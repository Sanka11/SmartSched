import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DynamicSidebar from "../components/DynamicSidebar"; // Adjust if your path differs

const LecturerDashboard = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser || {});
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DynamicSidebar user={user} />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          👩‍🏫 Welcome, {user?.fullName || "Lecturer"}!
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            to="/lecturer/timetable"
            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-2">📅 View Timetable</h2>
            <p className="text-gray-600">
              See your personalized class schedule and sessions.
            </p>
          </Link>

          {/* Additional features can be added here later */}
        </div>
      </main>
    </div>
  );
};

export default LecturerDashboard;
