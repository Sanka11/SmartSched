import React, { useState } from 'react';
import { generateUserTimetable } from '../services/timetableService';

const UserTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateUserTimetable();
      setTimetable(data);
    } catch (err) {
      alert('Error generating timetable');
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Weekly Timetable
      </button>

      {loading && <p className="mt-2 text-gray-600">Generating...</p>}

      {timetable.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Your Weekly Timetable</h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Course</th>
                <th className="border px-4 py-2">Day</th>
                <th className="border px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((slot, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{slot.courseCode}</td>
                  <td className="border px-4 py-2">{slot.day}</td>
                  <td className="border px-4 py-2">{slot.timeSlot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTimetable;
