import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import DynamicSidebar from "../components/DynamicSidebar";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const colors = [
  "bg-blue-100", "bg-red-100", "bg-green-100", "bg-yellow-100",
  "bg-purple-100", "bg-pink-100", "bg-orange-100", "bg-cyan-100",
  "bg-teal-100", "bg-indigo-100"
];

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
        `${import.meta.env.VITE_BACKEND_URL}/api/timetable/student/${email}`
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
        `${import.meta.env.VITE_BACKEND_URL}/api/scheduler/generate?email=${email}&role=student`
      );
      const msg = response.data;

      if (msg.includes("❌ No valid sessions")) {
        setMessage("");
        setError("You are not yet assigned to any modules.");
        setTimetable([]);
        setGenerating(false);
        return;
      }

      if (msg.includes("✅")) {
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

  const handleDownloadPDF = () => {
    const element = document.getElementById("timetable-container");
    html2pdf().from(element).save("Student-Timetable.pdf");
  };

  const getSessionsByDay = (day) =>
    timetable
      .filter((session) => session.day === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

  useEffect(() => {
    fetchTimetable();
  }, []);

  const moduleColorMap = {};
  let colorIndex = 0;
  timetable.forEach((session) => {
    const module = session.module_name;
    if (!moduleColorMap[module]) {
      moduleColorMap[module] = colors[colorIndex % colors.length];
      colorIndex++;
    }
  });

  const getSessionTypeIcon = (session) => {
    const location = session.location.toLowerCase();
    if (location.includes("lab")) return "🧪";
    if (location.includes("zoom") || location.includes("online")) return "💻";
    if (session.event) return "🎉";
    return "🎓";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DynamicSidebar user={user} />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">📅 Your Weekly Timetable</h1>

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
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleGenerateTimetable}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                disabled={generating}
              >
                {generating ? "Regenerating..." : "🔁 Generate Again"}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                📄 Download PDF
              </button>
            </div>

            <div id="timetable-container" className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    {days.map((day) => (
                      <th
                        key={day}
                        className="border border-gray-300 px-4 py-2 text-left"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {days.map((day) => {
                      const sessions = getSessionsByDay(day);

                      return (
                        <td
                          key={day}
                          className="border border-gray-200 px-3 py-2 align-top text-sm min-w-[200px]"
                        >
                          {sessions.length > 0 ? (
                            sessions.map((session, idx) => {
                              const bgColor = moduleColorMap[session.module_name] || "bg-gray-100";
                              return (
                                <div
                                  key={idx}
                                  className={`pb-2 px-2 py-1 rounded ${bgColor} ${idx !== sessions.length - 1 ? "border-b border-gray-200 mb-4" : ""}`}
                                  title={`${session.module_name} • ${session.group_name} • ${session.location} • ${session.instructor_name}`}
                                >
                                  <strong>{getSessionTypeIcon(session)} {session.module_name}</strong><br />
                                  {session.group_name}<br />
                                  🕒 {session.start_time}–{session.end_time}<br />
                                  🏫 {session.location}<br />
                                  👨‍🏫 {session.instructor_name}
                                  {session.event && (
                                    <div className="mt-2 text-xs bg-gray-50 border p-1 rounded">
                                      🎉 <strong>{session.event.eventName}</strong><br />
                                      🗓 {new Date(session.event.eventDate).toLocaleDateString()} {new Date(session.event.eventTime).toLocaleTimeString()}<br />
                                      📍 {session.event.eventMode} - {session.event.location}<br />
                                      📝 {session.event.description}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <span className="text-gray-400 italic">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {!loading && message && !error && (
          <p className="mt-4 text-sm text-gray-600 text-center">{message}</p>
        )}
      </main>
    </div>
  );
};

export default StudentTimetable;
