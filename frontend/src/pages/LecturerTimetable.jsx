import React, { useEffect, useState } from "react";
import axios from "axios";

const LecturerTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const fetchTimetable = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/timetable/instructor/${email}`
      );
      const data = response.data?.timetable || [];
      setTimetable(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching timetable", err);
      setMessage("Failed to fetch timetable.");
      setLoading(false);
    }
  };

  const generateTimetable = async () => {
    setMessage("⏳ Generating timetable...");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/timetable/generate/${email}/lecturer`
      );
      setMessage(response.data);
      setTimeout(fetchTimetable, 3000); // wait 3s then refetch
    } catch (err) {
      console.error("Error generating timetable", err);
      setMessage("❌ Failed to generate timetable.");
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
      ) : timetable.length === 0 ? (
        <>
          <p>No timetable found. Please generate it first.</p>
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

      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default LecturerTimetable;
