import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Student Dashboard</h1>

      <button
        onClick={() => navigate("/student/timetable")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Time Tables
      </button>
    </div>
  );
};

export default StudentDashboard;
