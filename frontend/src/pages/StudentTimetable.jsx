import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const fetchTimetable = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/timetable/student/${email}`
      );
      const data = response.data?.timetable || [];
      setTimetable(data);
    } catch (err) {
      console.error("Failed to fetch timetable", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTimetable = async () => {
    setGenerating(true);
    setMessage("⏳ Generating timetable...");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/timetable/generate/${email}/student`
      );
      setMessage(response.data || "Timetable generation started.");

      // Delay before re-fetching to let the backend save the result
      setTimeout(() => {
        fetchTimetable();
        setGenerating(false);
      }, 3000);
    } catch (err) {
      setMessage("❌ Failed to generate timetable.");
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">📅 Your Timetable</h1>

      {loading ? (
        <p>Loading...</p>
      ) : timetable.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="mb-2">No timetable found. You can generate it below.</p>
          <button
            onClick={handleGenerateTimetable}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate Timetable"}
          </button>
          {message && <p className="mt-3 text-sm">{message}</p>}
        </div>
      ) : (
        <div className="grid gap-4">
          {timetable.map((session, index) => (
            <div
              key={index}
              className="border p-4 rounded shadow bg-white hover:bg-gray-50"
            >
              <h2 className="text-lg font-bold">
                {session.module_name} ({session.group_name})
              </h2>
              <p>
                📅 <strong>{session.day}</strong> | 🕒 {session.start_time} –{" "}
                {session.end_time}
              </p>
              <p>🏫 Location: {session.location}</p>
              <p>👨‍🏫 Instructor: {session.instructor_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
