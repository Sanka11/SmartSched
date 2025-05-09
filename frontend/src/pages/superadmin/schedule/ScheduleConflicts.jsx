import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import DynamicSidebar from "../../../components/DynamicSidebar";
import { toast } from "react-hot-toast";

const ScheduleConflicts = () => {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConflicts = async () => {
      try {
        const res = await api.get("/api/timetable/conflicts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConflicts(res.data);
      } catch (err) {
        toast.error("Failed to fetch conflicts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConflicts();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <DynamicSidebar user={user} />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-semibold mb-4">🚨 Conflict Timetables</h1>

        {loading ? (
          <p>Loading...</p>
        ) : conflicts.length === 0 ? (
          <p className="text-gray-500">No conflicts found.</p>
        ) : (
          conflicts.map((conflict, index) => (
            <div
              key={index}
              className="bg-white rounded shadow p-4 mb-6 border border-red-300"
            >
              <h2 className="text-lg font-bold text-red-600 mb-2">
                Conflict: {conflict.timeSlot}
              </h2>
              <ul className="list-disc ml-6 text-sm">
                {conflict.sessions.map((s, i) => (
                  <li key={i}>
                    {s.module_name} — {s.group_name} — {s.instructor_name}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default ScheduleConflicts;
