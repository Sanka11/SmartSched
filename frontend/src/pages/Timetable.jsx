import React from "react";

const Timetable = ({ data }) => {
  // Group data by day
  const groupedByDay = data.reduce((acc, item) => {
    const day = item.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(item);
    return acc;
  }, {});

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Day</th>
            <th className="px-4 py-2 border-b">Time</th>
            <th className="px-4 py-2 border-b">Course</th>
            <th className="px-4 py-2 border-b">Group</th>
            <th className="px-4 py-2 border-b">Module</th>
            <th className="px-4 py-2 border-b">Instructor</th>
            <th className="px-4 py-2 border-b">Location</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByDay).map(([day, entries]) =>
            entries.map((entry, index) => (
              <tr key={`${day}-${index}`}>
                {index === 0 && (
                  <td rowSpan={entries.length} className="px-4 py-2 border-b">
                    {day}
                  </td>
                )}
                <td className="px-4 py-2 border-b">
                  {entry.startTime} - {entry.endTime}
                </td>
                <td className="px-4 py-2 border-b">{entry.courseName}</td>
                <td className="px-4 py-2 border-b">{entry.groupName}</td>
                <td className="px-4 py-2 border-b">{entry.moduleName}</td>
                <td className="px-4 py-2 border-b">{entry.instructorName}</td>
                <td className="px-4 py-2 border-b">{entry.location}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;