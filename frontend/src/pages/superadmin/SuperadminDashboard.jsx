import React from "react";
import { useNavigate } from "react-router-dom";
import DynamicSidebar from "../../components/DynamicSidebar";

export default function SuperadminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DynamicSidebar user={user} />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#2c7a7b] mb-2">
            Welcome back, {user?.name || "Superadmin"}!
          </h1>
          <p className="text-gray-600">
            Manage timetables and system configurations from this dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Generate Timetables Card */}
          <div
            className="bg-white shadow-md p-6 rounded-xl border border-gray-100 hover:shadow-lg cursor-pointer transition-all duration-300 hover:border-[#2c7a7b] hover:scale-[1.02] group"
            onClick={() => navigate("/superadmin/schedule/generate")}
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#e6fffa] p-3 rounded-lg mr-4 group-hover:bg-[#b2f5ea] transition">
                <span className="text-2xl">🧠</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Generate Timetables
              </h2>
            </div>
            <p className="text-gray-600 pl-16">
              Run the AI scheduler for selected users or roles to create
              optimized, conflict-free timetables for your institution.
            </p>
            <div className="mt-4 text-sm text-[#2c7a7b] font-medium pl-16">
              Get started →
            </div>
          </div>

          {/* View Timetables Card */}
          <div
            className="bg-white shadow-md p-6 rounded-xl border border-gray-100 hover:shadow-lg cursor-pointer transition-all duration-300 hover:border-[#2c7a7b] hover:scale-[1.02] group"
            onClick={() => navigate("/superadmin/schedule/view")}
          >
            <div className="flex items-center mb-4">
              <div className="bg-[#e6fffa] p-3 rounded-lg mr-4 group-hover:bg-[#b2f5ea] transition">
                <span className="text-2xl">📅</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                View Timetables
              </h2>
            </div>
            <p className="text-gray-600 pl-16">
              Browse and review schedules for individual students or lecturers,
              with options to filter and export timetable data.
            </p>
            <div className="mt-4 text-sm text-[#2c7a7b] font-medium pl-16">
              View schedules →
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            Need help with scheduling?
          </h3>
          <p className="text-blue-600 mb-4">
            Our AI scheduler automatically resolves conflicts and optimizes for
            preferences.
          </p>
          <button
            className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition"
            onClick={() => navigate("/help/scheduling")}
          >
            Learn how it works
          </button>
        </div>
      </main>
    </div>
  );
}
