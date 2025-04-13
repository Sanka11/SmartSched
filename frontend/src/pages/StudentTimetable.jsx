import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/timetable/student/${email}`
      );
      const data = response.data?.timetable || [];
      setTimetable(data);

      if (data.length === 0) {
        setError("You are not yet assigned to any modules.");
      } else {
        setError("");
      }
    } catch (err) {
      console.error("Failed to fetch timetable", err);
      setError("❌ Failed to fetch timetable.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTimetable = async () => {
    setGenerating(true);
    setMessage("⏳ Generating timetable...");
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/timetable/generate/${email}/student`
      );
      const msg = response.data;

      if (msg.includes("❌ No valid sessions")) {
        setMessage("");
        setError("You are not yet assigned to any modules.");
        setTimetable([]);
        setGenerating(false);
        return;
      }

      if (msg.includes("✅ Timetable generation started")) {
        setTimeout(() => {
          fetchTimetable();
          setGenerating(false);
          setMessage("");
        }, 3000);
      } else {
        setMessage(msg);
        setGenerating(false);
      }
    } catch (err) {
      console.error("Error generating timetable", err);
      setMessage("");
      setError("❌ Failed to generate timetable.");
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
      ) : error ? (
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="mb-2 text-red-600">{error}</p>
          <button
            onClick={handleGenerateTimetable}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate Timetable"}
          </button>
          {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleGenerateTimetable}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              disabled={generating}
            >
              {generating ? "Regenerating..." : "🔁 Generate Again"}
            </button>
          </div>

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
        </>
      )}

      {!loading && message && !error && (
        <p className="mt-4 text-sm text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
};

export default StudentTimetable;
