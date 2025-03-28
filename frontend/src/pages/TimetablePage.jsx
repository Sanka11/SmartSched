import { useState } from 'react';

function TimetablePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerateTimetable = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/schedule/generate");
      const text = await res.text();
      setMessage(text);
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleGenerateTimetable}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Generating..." : "Generate Timetable"}
      </button>
      <p className="mt-2">{message}</p>
    </div>
  );
}
export default TimetablePage;
