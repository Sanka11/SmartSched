from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables (MongoDB URI)
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["smartsched"]

# Collections
allclassassignment = db["allclassassignment"]
users = db["users"]
student_enrollments = db["student_enrollments"]
instructor_assignments = db["instructor_assignments"]

def fetch_all_sessions(user_email=None, user_role=None):
    print("Fetching sessions from MongoDB...")
    print("Connected to DB:", db.name)
    print("Collections available:", db.list_collection_names())

    sessions = []

    # Step 1: Find user
    user = users.find_one({"email": user_email})
    if not user:
        print("❌ User not found.")
        return []

    print("User role:", user_role)

    query = {}

    # Step 2: Role-based filtering
    if user_role == "student":
        enrollment = student_enrollments.find_one({"email": user_email})
        if not enrollment:
            print("❌ Student enrollment not found.")
            return []

        group_ids = list(enrollment.get("courseClasses", {}).values())
        print("Student group IDs:", group_ids)
        query = {"groupId": {"$in": group_ids}}

    elif user_role == "lecturer":
        assignment = instructor_assignments.find_one({"email": user_email})
        if not assignment:
            print("❌ Instructor assignment not found.")
            return []

        instructor_id = str(assignment["_id"])
        print("Instructor ID:", instructor_id)
        query = {"instructorId": instructor_id}

    elif user_role == "user":
        # Superadmin: fetch all sessions
        query = {}

    else:
        print("❌ Invalid user role.")
        return []

    # Step 3: Fetch sessions based on query
    results = allclassassignment.find(query)
    for doc in results:
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
            "end_time": doc.get("endtime")
        }
        sessions.append(session)

    print("Total sessions fetched:", len(sessions))
    return sessions

# Debug mode
if __name__ == "__main__":
    # You can test with any email and role here
    res = fetch_all_sessions("pawani@gmail.com", "lecturer")
    for r in res:
        print(r)
