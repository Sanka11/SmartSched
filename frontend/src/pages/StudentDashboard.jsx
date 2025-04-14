import { useNavigate } from "react-router-dom";
import DynamicSidebar from "../components/DynamicSidebar"; // Adjust path as needed
import { useEffect, useState } from "react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser || {});
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DynamicSidebar user={user} />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">🎓 Welcome to Student Dashboard</h1>

        <button
          onClick={() => navigate("/student/timetable")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Academic Timetable
        </button>
      </main>
    </div>
  );
};

export default StudentDashboard;
