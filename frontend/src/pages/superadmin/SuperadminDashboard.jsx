import React from "react";
import { useNavigate } from "react-router-dom";
import DynamicSidebar from "../../components/DynamicSidebar";

export default function SuperadminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar with user prop */}
      <DynamicSidebar user={user} />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-[#2c7a7b] mb-8">
          Superadmin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-white shadow-md p-6 rounded-xl border hover:shadow-xl cursor-pointer transition"
            onClick={() => navigate("/superadmin/schedule/generate")}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              🧠 Generate Timetables
            </h2>
            <p className="text-gray-600">
              Run AI scheduler for selected users or roles and save
              conflict-free timetables.
            </p>
          </div>

          <div
            className="bg-white shadow-md p-6 rounded-xl border hover:shadow-xl cursor-pointer transition"
            onClick={() => navigate("/superadmin/schedule/view")}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              📅 View Timetables
            </h2>
            <p className="text-gray-600">
              Select a student or lecturer and view their latest generated
              schedule.
            </p>
          </div>

          <div
            className="bg-white shadow-md p-6 rounded-xl border hover:shadow-xl cursor-pointer transition"
            onClick={() => navigate("/superadmin/schedule/conflicts")}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              🔍 Conflict Report
            </h2>
            <p className="text-gray-600">
              Preview and review scheduling conflicts across users.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
