import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DynamicSidebar from "../components/DynamicSidebar";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const colors = [
  "bg-blue-100",
  "bg-red-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-orange-100",
  "bg-cyan-100",
  "bg-teal-100",
  "bg-indigo-100",
];

const token = localStorage.getItem("token");
const LecturerTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  const token = localStorage.getItem("token");

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/timetable/instructor/view/${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = response.data || {};
      setTimetable(result.timetable || []);

      // Filter upcoming events only
      const now = new Date();
      const upcomingEvents = (result.events || []).filter((event) => {
        const eventDateTime = new Date(`${event.eventDate}T${event.eventTime}`);
        return eventDateTime >= now;
      });
      setEvents(upcomingEvents);

      if ((result.timetable || []).length === 0) {
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
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/scheduler/generate?email=${email}&role=lecturer`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const msg =
        typeof response.data === "string"
          ? response.data
          : response.data.message || "";

      if (msg.includes("❌ No valid sessions")) {
        setMessage("");
        setError("You are not yet assigned to any modules.");
        setTimetable([]);
      } else if (msg.includes("✅")) {
        setMessage("✅ Timetable generated successfully! Refreshing...");
        setTimeout(() => {
          fetchTimetable();
          setGenerating(false);
          setMessage("");
        }, 3000);
      } else {
        setMessage(msg);
      }
    } catch (err) {
      console.error("Error generating timetable", err);
      setMessage("");
      setError("❌ Failed to generate timetable.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("timetable-container");

    const clone = element.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.padding = "20px";
    clone.style.backgroundColor = "#ffffff";
    document.body.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "pt", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const contentWidth = pdfWidth - 40;
      const canvasHeight = (canvas.height * contentWidth) / canvas.width;

      // 🧑‍🏫 Get lecturer name
      const lecturerName = user?.fullName || user?.name || "Lecturer";

      // 🗓 Date range
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      const saturday = new Date(monday);
      saturday.setDate(monday.getDate() + 5);

      const formatDate = (d) =>
        d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

      const range = `${formatDate(monday)} – ${formatDate(saturday)}`;
      const title = `Lecturer Timetable for ${lecturerName}`;
      const subtitle = `Week: ${range}`;

      // 📝 Titles
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(title, pdfWidth / 2, 40, { align: "center" });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      pdf.text(subtitle, pdfWidth / 2, 60, { align: "center" });

      // 📄 Image
      pdf.addImage(imgData, "PNG", 20, 80, contentWidth, canvasHeight);
      pdf.save("Lecturer-Timetable.pdf");
    } catch (err) {
      console.error("❌ PDF generation failed:", err);
    } finally {
      document.body.removeChild(clone);
    }
  };

  const getSessionsByDay = (day) => {
    const filtered = timetable.filter(
      (s) => (s.day || "").toLowerCase() === day.toLowerCase()
    );

    const seen = new Set();
    const unique = [];
    filtered.forEach((s) => {
      const key = `${s.module_id}-${s.group_id}-${s.day}-${s.start_time}-${s.instructor_id}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(s);
      }
    });

    return unique.sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

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
        <h1 className="text-2xl font-semibold mb-4">📘 Lecturer Timetable</h1>

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
                              const bgColor =
                                moduleColorMap[session.module_name] ||
                                "bg-gray-100";
                              return (
                                <div
                                  key={idx}
                                  className={`pb-2 px-2 py-1 rounded ${bgColor} ${
                                    idx !== sessions.length - 1
                                      ? "border-b border-gray-200 mb-4"
                                      : ""
                                  }`}
                                  title={`${session.module_name} • ${session.group_name} • ${session.location} • ${session.instructor_name}`}
                                >
                                  <strong>
                                    {getSessionTypeIcon(session)}{" "}
                                    {session.module_name}
                                  </strong>
                                  <br />
                                  {session.group_name}
                                  <br />
                                  🕒 {session.start_time}–{session.end_time}
                                  <br />
                                  🏫 {session.location}
                                  <br />
                                  👨‍🏫 {session.instructor_name}
                                  {session.event && (
                                    <div className="mt-2 text-xs bg-gray-50 border p-1 rounded">
                                      🎉{" "}
                                      <strong>{session.event.eventName}</strong>
                                      <br />
                                      🗓{" "}
                                      {new Date(
                                        session.event.eventDate
                                      ).toLocaleDateString()}{" "}
                                      {new Date(
                                        session.event.eventTime
                                      ).toLocaleTimeString()}
                                      <br />
                                      📍 {session.event.eventMode} -{" "}
                                      {session.event.location}
                                      <br />
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
              {events.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-semibold mb-3">
                    🎉 Upcoming Events
                  </h2>
                  <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-3 py-2">Event</th>
                        <th className="border px-3 py-2">Date</th>
                        <th className="border px-3 py-2">Time</th>
                        <th className="border px-3 py-2">Mode</th>
                        <th className="border px-3 py-2">Location</th>
                        <th className="border px-3 py-2">Organizers</th>
                        <th className="border px-3 py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.eventId}>
                          <td className="border px-3 py-2">
                            {event.eventName}
                          </td>
                          <td className="border px-3 py-2">
                            {new Date(event.eventDate).toLocaleDateString()}
                          </td>
                          <td className="border px-3 py-2">
                            {event.eventTime}
                          </td>
                          <td className="border px-3 py-2">
                            {event.eventMode}
                          </td>
                          <td className="border px-3 py-2">{event.location}</td>
                          <td className="border px-3 py-2">
                            {event.orgCommittee}
                          </td>
                          <td className="border px-3 py-2">
                            {event.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

export default LecturerTimetable;
