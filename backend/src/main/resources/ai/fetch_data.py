from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime, date, time, timedelta
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

# === Fetch matching event for a session ===
def fetch_event_for_session(session_day, session_start):
    try:
        mongo_weekday = datetime.strptime(session_day, "%A").isoweekday() % 7 + 1
        session_time = datetime.strptime(session_start, "%H:%M").time()
        session_hour = session_time.hour

        print(f"🔍 Searching for event on day: {session_day} (Mongo weekday={mongo_weekday}) at ~{session_time}")

        today = datetime.combine(date.today(), time.min)

        event = events.find_one({
            "$expr": {
                "$and": [
                    {"$eq": [{"$dayOfWeek": "$eventDate"}, mongo_weekday]},
                    {"$gte": [{"$hour": "$eventDate"}, session_hour - 1]},
                    {"$lte": [{"$hour": "$eventDate"}, session_hour + 1]}
                ]
            },
            "eventDate": {"$gte": today}
        })

        if event:
            print(f"✅ Matching event found: {event.get('eventName')} at {event.get('eventTime')}")
            return {
                "eventName": event.get("eventName"),
                "eventDate": event.get("eventDate"),
                "eventTime": event.get("eventTime"),
                "eventMode": event.get("eventMode"),
                "location": event.get("location"),
                "description": event.get("description")
            }

    except Exception as e:
        print("⚠️ Error fetching event:", e)

    return None

# === Fetch all class sessions for user based on role ===
def fetch_all_sessions(user_email=None, user_role=None):
    print("Fetching sessions from MongoDB...")
    print("Connected to DB:", db.name)
    print("Collections available:", db.list_collection_names())

    sessions = []

    # 🧠 Validate user
    user = users.find_one({"email": user_email})
    if not user:
        print("❌ User not found.")
        return []

    print("User role:", user_role)
    query = {}

    # 🧑‍🎓 Student role logic
    if user_role == "student":
        enrollment = student_enrollments.find_one({"email": user_email})
        if not enrollment:
            print("❌ Student enrollment not found.")
            return []

        group_ids = list(enrollment.get("courseClasses", {}).values())
        print("Student group IDs:", group_ids)
        query = {"groupId": {"$in": group_ids}}

    # 👨‍🏫 Instructor role logic
    elif user_role == "lecturer":
        assignment = instructor_assignments.find_one({"email": user_email})
        if not assignment:
            print("❌ Instructor assignment not found.")
            return []

        instructor_id = str(assignment["_id"])
        print("Instructor ID:", instructor_id)
        query = {"instructorId": instructor_id}

    # 👤 Superadmin (user) sees all sessions
    elif user_role == "user":
        query = {}

    else:
        print("❌ Invalid user role.")
        return []

    # 🎯 Query sessions and attach event if found
    results = allclassassignment.find(query)
    for doc in results:
        event_data = fetch_event_for_session(doc.get("date"), doc.get("starttime"))

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
            "day": doc.get("date"),
            "start_time": doc.get("starttime"),
            "end_time": doc.get("endtime"),
            "event": event_data
        }
        sessions.append(session)

    print("Total sessions fetched:", len(sessions))
    return sessions

# === Debug entry point ===
def debug_fetch():
    res = fetch_all_sessions("kanishka@gmail.com", "student")
    for r in res:
        print(r)

# === Run when executed directly ===
if __name__ == "__main__":
    debug_fetch()
