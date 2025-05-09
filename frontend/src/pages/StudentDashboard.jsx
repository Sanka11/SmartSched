import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaUserGraduate,
} from "react-icons/fa";
import DynamicSidebar from "../components/DynamicSidebar";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser || {});

    // Fetch upcoming events

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/events/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const events = response.data || [];
        const today = new Date();
        const upcoming = events.filter((e) => new Date(e.eventDate) >= today);
        setEventCount(upcoming.length);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DynamicSidebar user={user} />

      <main className="flex-1 p-6 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              🎓 Hello, {user?.fullName || "Student"}!
            </h1>
            <p className="text-sm">
              Welcome back to SmartSched – your intelligent academic planner.
            </p>
          </div>
          <FaUserGraduate size={50} className="text-white/70" />
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            👤 Your Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-medium">{user?.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-medium capitalize">
                {user?.role || "student"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Login</p>
              <p className="font-medium">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
            <FaBook size={36} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
            <FaChalkboardTeacher size={36} className="text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Modules</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
            <FaCalendarAlt size={36} className="text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Upcoming Events</p>
              <p className="text-xl font-bold">{eventCount}</p>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              📅 Academic Timetable
            </h2>
            <p className="text-gray-600 mb-4">
              View your generated conflict-free academic timetable.
            </p>
            <button
              onClick={() => navigate("/student/timetable")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Timetable
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              📝 Custom Schedule
            </h2>
            <p className="text-gray-600 mb-4">
              Add personal tasks and balance your week efficiently.
            </p>
            <button
              onClick={() => navigate("/custom-schedule/student")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Customize Schedule
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
