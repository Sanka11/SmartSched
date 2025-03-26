from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables (MongoDB URI)
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)
db = client["smartsched"]  

# Collections
allclassassignment = db["allclassassignment"]

def fetch_all_sessions():
    print("Fetching sessions from MongoDB...")
    print("Connected to DB:", db.name)
    print("Collections available:", db.list_collection_names())


    """Fetch and structure class assignments into GA-compatible format."""
    sessions = []

    for doc in allclassassignment.find():
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

    return sessions


if __name__ == "__main__":
    result = fetch_all_sessions()
    for i, session in enumerate(result):
        print(f"Session {i+1}: {session}")
