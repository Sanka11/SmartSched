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

# === Fetch matching event for a session ===
def fetch_event_for_session(session_day, session_start):
    try:
        ist = tz_util.FixedOffset(330, "IST")

        session_time = datetime.strptime(session_start, "%H:%M").time()
        session_dt = datetime.combine(date.today(), session_time).replace(tzinfo=ist)

        # ✅ Updated: Convert "Monday" → 0
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


# === Fetch all class sessions and fill missing assigned modules ===
def fetch_all_sessions(user_email=None, user_role=None):
    global modules

    print("Fetching sessions from MongoDB...")
    print("Connected to DB:", db.name)
    print("Collections available:", db.list_collection_names())

    sessions = []
    user = users.find_one({"email": user_email})
    if not user:
        print("❌ User not found.")
        return []

    print("User role:", user_role)
    query = {}

    if user_role == "student":
        enrollment = student_enrollments.find_one({"email": user_email})
        if not enrollment:
            print("❌ Student enrollment not found.")
            return []

        course_name = enrollment.get("courses", [])[0]
        group_id = enrollment.get("courseClasses", {}).get(course_name)
        assigned_modules = enrollment.get("courseModules", {}).get(course_name, [])

        print("Student group ID:", group_id)
        query = {"groupId": group_id}
        results = list(allclassassignment.find(query))

        used_modules = set()
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
         "event": event  # ✅ Attach event here
         }   
        sessions.append(session)
        used_modules.add(doc.get("moduleName"))

        
        for mod in assigned_modules:
            if mod not in used_modules:
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

        modules = instructor.get("modules", [])
        class_map = instructor.get("classes", {})  # { moduleName: groupId }

        if not modules or not class_map:
            print("❌ No valid modules or class assignments.")
            return []

        print("Lecturer modules:", modules)
        print("Lecturer class map:", class_map)

        query = {
            "moduleName": { "$in": modules },
            "groupId": { "$in": list(class_map.values()) },
            "instructorId": str(instructor["_id"])  # safest unique match
        }

        results = list(allclassassignment.find(query))
        if not results:
            print("❌ No matching sessions found in allclassassignment.")
            return []

        for doc in results:
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
                "day": doc.get("date"),
                "start_time": doc.get("starttime"),
                "end_time": doc.get("endtime"),
                "event": fetch_event_for_session(doc.get("date"), doc.get("starttime"))
            })

    return sessions


# === Debug entry point ===
def debug_fetch():
    res = fetch_all_sessions("thissa@gmail.com", "student")
    for r in res:
        print(r)

        from fetch_data import fetch_all_sessions
sessions = fetch_all_sessions("thissa@gmail.com", "student")
for s in sessions:
    print(s["day"], s["start_time"], s["module_name"])


if __name__ == "__main__":
    debug_fetch()
