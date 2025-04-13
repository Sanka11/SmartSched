import React, { useEffect, useState } from "react";
import axios from "axios";

const LecturerTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/timetable/instructor/${email}`
      );
      const data = response.data?.timetable || [];
      setTimetable(data);
      setLoading(false);

      if (data.length === 0) {
        setError("You are not yet assigned to any modules. Please contact admin panel.");
      } else {
        setError("");
      }
    } catch (err) {
      console.error("Error fetching timetable", err);
      setError("❌ Failed to fetch timetable.");
      setLoading(false);
    }
  };

  const generateTimetable = async () => {
    setMessage("⏳ Generating timetable...");
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/timetable/generate/${email}/lecturer`
      );
      const msg = response.data;

      if (msg.includes("❌ No valid sessions")) {
        setMessage("");
        setError("You are not yet assigned to any modules. Please contact admin panel.");
        setTimetable([]);
        return;
      }

      if (msg.includes("✅ Timetable generation started")) {
        setTimeout(() => {
          fetchTimetable();
          setMessage("");
        }, 3000);
      } else {
        setMessage(msg);
      }
    } catch (err) {
      console.error("Error generating timetable", err);
      setMessage("");
      setError("❌ Failed to generate timetable.");
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">📘 Lecturer Timetable</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <>
          <p className="text-red-600">{error}</p>
          <button
            onClick={generateTimetable}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Generate Timetable
          </button>
        </>
      ) : (
        <div className="space-y-4">
          {timetable.map((session, index) => (
            <div
              key={index}
              className="border rounded p-4 shadow-sm hover:shadow-md"
            >
              <h2 className="font-semibold text-lg">
                {session.module_name} ({session.group_name})
              </h2>
              <p>
                📅 <strong>{session.day}</strong> | 🕒{" "}
                {session.start_time} – {session.end_time}
              </p>
              <p>🏫 Location: {session.location}</p>
              <p>👨‍🎓 Group: {session.group_name}</p>
            </div>
          ))}
        </div>
      )}

      {message && !loading && (
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default LecturerTimetable;
