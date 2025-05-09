import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import DynamicSidebar from "../../components/DynamicSidebar";
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
} from "react-icons/fi";
import { TailSpin } from "react-loader-spinner";

const ViewSchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllSchedules = async () => {
      try {
        const res = await api.get("/api/timetable/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const enriched = await Promise.all(
          res.data
            .filter((s) => s.userEmail)
            .map(async (s) => {
              try {
                const userRes = await api.get(
                  `/api/users/email/${s.userEmail}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                return {
                  ...s,
                  userRole: userRes.data.role?.toLowerCase(),
                  userName:
                    userRes.data.fullName ||
                    userRes.data.name ||
                    "Unknown User",
                };
              } catch (err) {
                console.warn(`Failed to fetch user for ${s.userEmail}`);
                return { ...s, userRole: "unknown", userName: s.userEmail };
              }
            })
        );

        setSchedules(enriched);
      } catch (err) {
        console.error("Error fetching schedules", err);
        toast.error("Failed to load schedules");
      } finally {
        setLoading(false);
      }
    };

    fetchAllSchedules();
  }, []);

  const filteredSchedules = schedules.filter((s) => {
    return (
      s.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.userName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <DynamicSidebar user={user} />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              View All Timetables
            </h1>
            <p className="text-gray-600">
              Browse and manage schedules for all users
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-8 border border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <TailSpin height={40} width={40} color="#4f46e5" />
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No schedules found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "No timetables have been generated yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredSchedules.map((schedule, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {schedule.userName}
                        {schedule.userRole &&
                          schedule.userRole !== "unknown" && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {schedule.userRole}
                            </span>
                          )}
                      </h2>
                      <p className="text-gray-600">{schedule.userEmail}</p>
                    </div>
                    <div className="mt-2 md:mt-0 text-sm text-gray-500">
                      <span className="inline-flex items-center">
                        <FiCalendar className="mr-1" />
                        Generated on{" "}
                        {new Date(schedule.generatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {schedule.timetable.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {schedule.timetable.map((session, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-indigo-300 transition-colors"
                        >
                          <h3 className="font-medium text-gray-800 mb-2">
                            {session.module_name}
                            {session.group_name && (
                              <span className="ml-2 text-sm text-gray-500">
                                ({session.group_name})
                              </span>
                            )}
                          </h3>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-start">
                              <FiClock className="mt-0.5 mr-2 flex-shrink-0 text-gray-400" />
                              <span>
                                {session.day}, {session.start_time}–
                                {session.end_time}
                              </span>
                            </div>

                            {session.location && (
                              <div className="flex items-start">
                                <FiMapPin className="mt-0.5 mr-2 flex-shrink-0 text-gray-400" />
                                <span>{session.location}</span>
                              </div>
                            )}

                            {session.instructor_name && (
                              <div className="flex items-start">
                                <FiUser className="mt-0.5 mr-2 flex-shrink-0 text-gray-400" />
                                <span>{session.instructor_name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No sessions scheduled
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewSchedulesPage;
