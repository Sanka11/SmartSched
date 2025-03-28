import React from "react";
import { Link } from "react-router-dom";

const LecturerDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
    </div>
  );
};

export default LecturerDashboard;
