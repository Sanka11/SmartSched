import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaUserCircle,
  FaTasks,
} from "react-icons/fa";
import DynamicSidebar from "../components/DynamicSidebar";

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser || {});
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DynamicSidebar user={user} />

      <main className="flex-1 p-6 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-purple-700 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              👩‍🏫 Hello, {user?.fullName || "Lecturer"}!
            </h1>
            <p className="text-sm">
              Plan and manage your teaching schedule with SmartSched.
            </p>
          </div>
          <FaChalkboardTeacher size={50} className="text-white/80" />
        </div>

        {/* Profile Info */}
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
                {user?.role || "lecturer"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Login</p>
              <p className="font-medium">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* View Academic Timetable */}
          <div
            onClick={() => navigate("/lecturer/timetable")}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer flex items-center space-x-4"
          >
            <FaCalendarAlt size={36} className="text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Your Academic Timetable</p>
              <p className="text-xl font-bold">View Now</p>
            </div>
          </div>

          {/* Custom Schedule */}
          <div
            onClick={() => navigate("/custom-schedule/lecturer")}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer flex items-center space-x-4"
          >
            <FaTasks size={36} className="text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Your Custom Schedule</p>
              <p className="text-xl font-bold">Customize</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LecturerDashboard;
