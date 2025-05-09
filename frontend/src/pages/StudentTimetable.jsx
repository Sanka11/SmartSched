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

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;
  const token = localStorage.getItem("token");

  const fetchTimetable = async () => {
    if (!email || !token) {
      setError("🔐 User not authenticated. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/timetable/student/${encodeURIComponent(email)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = response.data || {};
      setTimetable(result.timetable || []);
      const now = new Date();
      const upcomingEvents = (result.events || []).filter((event) => {
        const eventDateTime = new Date(`${event.eventDate}T${event.eventTime}`);
        return eventDateTime >= now;
      });
      setEvents(upcomingEvents);

      if (result.timetable.length === 0) {
        setError("⚠️ You are not yet assigned to any modules.");
      }
    } catch (err) {
      setError("❌ Failed to fetch timetable from server.");
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
        }/api/scheduler/generate?email=${email}&role=student`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const msg = response.data;

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
        setGenerating(false);
      }
    } catch (err) {
      setMessage("");
      setError("❌ Failed to generate timetable.");
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

      // 🗓 Calculate date range: Monday to Saturday of current week
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1); // Monday
      const saturday = new Date(monday);
      saturday.setDate(monday.getDate() + 5); // Saturday

      const formatDate = (d) =>
        d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

      const range = `${formatDate(monday)} – ${formatDate(saturday)}`;
      const title = `Your Weekly Timetable for ${range}`;

      // 📝 Draw title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(title, pdfWidth / 2, 40, { align: "center" });

      // 🖼️ Draw timetable image below title
      pdf.addImage(imgData, "PNG", 20, 60, contentWidth, canvasHeight);
      pdf.save("Student-Timetable.pdf");
    } catch (err) {
      console.error("❌ PDF generation failed:", err);
    } finally {
      document.body.removeChild(clone);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const moduleColorMap = {};
  timetable.forEach((session, idx) => {
    const module = session.module_name || `Module ${idx}`;
    moduleColorMap[module] =
      moduleColorMap[module] || colors[idx % colors.length];
  });

  const getSessionsByDay = (day) =>
    timetable
      .filter((s) => s.day?.toLowerCase() === day.toLowerCase())
      .sort((a, b) => a.start_time.localeCompare(b.start_time));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DynamicSidebar user={user} />

      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-semibold mb-4">
          📅 Your Weekly Timetable
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded">{error}</div>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleGenerateTimetable}
                disabled={generating}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {generating ? "🔄 Generating..." : "🔁 Generate Timetable"}
              </button>

              <button
                onClick={handleDownloadPDF}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                📄 Download PDF
              </button>
            </div>

            <div id="timetable-container" className="overflow-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    {days.map((day) => (
                      <th key={day} className="border px-4 py-2">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {days.map((day) => (
                      <td
                        key={day}
                        className="border px-2 py-2 align-top min-w-[180px]"
                      >
                        {getSessionsByDay(day).map((session, idx) => (
                          <div
                            key={idx}
                            className={`mb-3 p-2 rounded ${
                              moduleColorMap[session.module_name]
                            }`}
                          >
                            <strong>{session.module_name}</strong>
                            <br />
                            <small>{session.group_name}</small>
                            <br />
                            <small>
                              🕒 {session.start_time}–{session.end_time}
                            </small>
                            <br />
                            <small>🏫 {session.location}</small>
                            <br />
                            <small>👨‍🏫 {session.instructor_name}</small>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              {events.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">
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
      </main>
    </div>
  );
};

export default StudentTimetable;
