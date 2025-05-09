from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime, date, time as dt_time
from bson import tz_util

# === Load environment variables ===
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# === Connect to MongoDB ===
client = MongoClient(MONGO_URI)
db = client["smartsched"]

# === Collections ===
allclassassignment = db["allclassassignment"]
users = db["users"]
student_enrollments = db["student_enrollments"]
instructor_assignments = db["instructor_assignments"]
events = db["events"]
modules = db["modules"]
courses = db["courses"]

# === Fetch event-time map for global conflict checking ===
def fetch_events(db):
    from datetime import datetime
    event_map = {}  # { "Wednesday": ["09:00", "14:00"], ... }

    try:
        upcoming_events = events.find({})
        for event in upcoming_events:
            if not event.get("eventDate") or not event.get("eventTime"):
                continue

            day = event["eventDate"].strftime("%A")  # "Wednesday"
            time_str = event["eventTime"].strftime("%H:%M")  # "09:00"

            if day not in event_map:
                event_map[day] = []
            event_map[day].append(time_str)
    except Exception as e:
        print("⚠️ Error fetching global events:", e)

    return event_map

# === Match event for a specific session ===
def fetch_event_for_session(session_day, session_start):
    try:
        ist = tz_util.FixedOffset(330, "IST")
        session_time = datetime.strptime(session_start, "%H:%M").time()
        session_dt = datetime.combine(date.today(), session_time).replace(tzinfo=ist)

        WEEKDAY_MAP = {
            "Monday": 0, "Tuesday": 1, "Wednesday": 2,
            "Thursday": 3, "Friday": 4, "Saturday": 5, "Sunday": 6
        }
        target_weekday = WEEKDAY_MAP.get(session_day, -1)

        today = datetime.now(tz_util.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        matching_events = events.find({"eventDate": {"$gte": today}})

        for event in matching_events:
            event_date = event.get("eventDate")
            event_time = event.get("eventTime")
            if not event_date or not event_time:
                continue

            event_local_dt = event_date.astimezone(ist)
            event_time_only = event_time.astimezone(ist).time()
            event_weekday = event_local_dt.weekday()

            weekday_match = event_weekday == target_weekday
            delta_seconds = abs(
                (datetime.combine(date.today(), event_time_only) - session_dt.replace(tzinfo=None)).total_seconds()
            )

            if weekday_match and delta_seconds <= 3600:
                return {
                    "eventName": event.get("eventName"),
                    "eventDate": event.get("eventDate"),
                    "eventTime": event.get("eventTime"),
                    "eventMode": event.get("eventMode"),
                    "location": event.get("location"),
                    "description": event.get("description"),
                }

    except Exception as e:
        print("⚠️ Error fetching event:", e)

    return None

# === Fetch all sessions for a student or lecturer ===
def fetch_all_sessions(user_email=None, user_role=None):
    print("Fetching sessions from MongoDB...")
    print("Connected to DB:", db.name)
    print("Collections available:", db.list_collection_names())

    sessions = []
    user = users.find_one({"email": user_email})
    if not user:
        print("❌ User not found.")
        return []

    print("User role:", user_role)

    if user_role == "student":
        enrollment = student_enrollments.find_one({"email": user_email})
        if not enrollment:
            print("❌ Student enrollment not found.")
            return []

        used_modules_global = set()

        for course_name in enrollment.get("courses", []):
            group_id = enrollment.get("courseClasses", {}).get(course_name)
            assigned_modules = enrollment.get("courseModules", {}).get(course_name, [])

            print(f"📘 Processing course: {course_name} → Group ID: {group_id}")
            if group_id:
                query = {"groupId": str(group_id)}
                results = list(allclassassignment.find(query))

                for doc in results:
                    day = doc.get("date")
                    start_time = doc.get("starttime")
                    event = fetch_event_for_session(day, start_time)

                    print(f"🧪 Matching event for {doc.get('moduleName')} on {day} at {start_time} → {event}")

                    session = {
                        "course_id": doc.get("courseId"),
                        "course_name": doc.get("courseName"),
                        "module_id": doc.get("moduleId"),
                        "module_name": doc.get("moduleName"),
                        "group_id": doc.get("groupId"),
                        "group_name": doc.get("groupName"),
                        "instructor_id": doc.get("instructorId"),
                        "instructor_name": doc.get("instructorName"),
                        "location": doc.get("location"),
                        "day": day,
                        "start_time": start_time,
                        "end_time": doc.get("endtime"),
                        "event": event
                    }
                    sessions.append(session)
                    used_modules_global.add(doc.get("moduleName"))

            for mod in assigned_modules:
                if mod not in used_modules_global:
                    module_doc = modules.find_one({"moduleName": mod})
                    sessions.append({
                        "course_id": "-",
                        "course_name": course_name,
                        "module_id": str(module_doc["_id"]) if module_doc else mod.replace(" ", "_").lower(),
                        "module_name": mod,
                        "group_id": "-",
                        "group_name": "UNSCHEDULED",
                        "instructor_id": "-",
                        "instructor_name": "-",
                        "location": "-",
                        "day": "TBD",
                        "start_time": "--",
                        "end_time": "--",
                        "event": None
                    })

    elif user_role == "lecturer":
        instructor = instructor_assignments.find_one({"email": user_email})
        if not instructor:
            print("❌ Instructor assignment not found.")
            return []

        modules_list = instructor.get("modules", [])
        class_map = instructor.get("classes", {})

        if not modules_list or not class_map:
            print("❌ No valid modules or class assignments.")
            return []

        print("Lecturer modules:", modules_list)
        print("Lecturer class map:", class_map)

        query = {
            "moduleName": {"$in": modules_list},
            "groupId": {"$in": list(class_map.values())},
            "instructorId": str(instructor["_id"])
        }

        results = list(allclassassignment.find(query))
        if not results:
            print("❌ No matching sessions found in allclassassignment.")
            return []

        for doc in results:
            session_day = str(doc.get("date")).capitalize()
            session_start = str(doc.get("starttime")).zfill(5)

            event = fetch_event_for_session(session_day, session_start)

            print(f"🧪 Matching event for {doc.get('moduleName')} on {session_day} at {session_start} → {event}")

            sessions.append({
                "course_id": doc.get("courseId"),
                "course_name": doc.get("courseName"),
                "module_id": doc.get("moduleId"),
                "module_name": doc.get("moduleName"),
                "group_id": doc.get("groupId"),
                "group_name": doc.get("groupName"),
                "instructor_id": doc.get("instructorId"),
                "instructor_name": doc.get("instructorName"),
                "location": doc.get("location"),
                "day": session_day,
                "start_time": session_start,
                "end_time": doc.get("endtime"),
                "event": event
            })

    return sessions

# === Debug Entry Point ===
def debug_fetch():
    res = fetch_all_sessions("thissa@gmail.com", "student")
    if not res:
        print("❌ No sessions returned.")
        return
    for r in res:
        print(r)

if __name__ == "__main__":
    debug_fetch()
