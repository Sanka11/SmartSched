import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import DynamicSidebar from "../../components/DynamicSidebar";

const ViewSchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllSchedules = async () => {
      try {
        const res = await api.get("/api/schedule/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchedules(res.data);
      } catch (err) {
        console.error("Error fetching schedules", err);
        toast.error("Failed to load schedules");
      } finally {
        setLoading(false);
      }
    };

    fetchAllSchedules();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <DynamicSidebar user={user} />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-semibold mb-6">📚 All User Timetables</h1>
        {loading ? (
          <p>Loading...</p>
        ) : schedules.length === 0 ? (
          <p>No schedules found.</p>
        ) : (
          schedules.map((schedule, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold mb-2 text-indigo-700">
                {schedule.userEmail} — Generated on{" "}
                {new Date(schedule.generatedAt).toLocaleString()}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedule.timetable.map((session, i) => (
                  <div
                    key={i}
                    className="p-3 rounded bg-indigo-50 border border-indigo-200 text-sm"
                  >
                    <strong>{session.module_name}</strong> —{" "}
                    {session.group_name}
                    <br />
                    🗓 {session.day}, {session.start_time}–{session.end_time}
                    <br />
                    🏫 {session.location}
                    <br />
                    👨‍🏫 {session.instructor_name}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default ViewSchedulesPage;
