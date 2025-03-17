import { useNavigate } from "react-router-dom";

const AssignmentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Assignment Dashboard
      </h1>
      <div className="flex gap-6">
        <button
          onClick={() => navigate("/enroll-students")}
          className="bg-blue-500 text-white px-8 py-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 flex items-center justify-center gap-2"
        >
          <span className="text-lg">Enroll Students</span>
        </button>
        <button
          onClick={() => navigate("/assign-instructors")}
          className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center justify-center gap-2"
        >
          <span className="text-lg">Assign Instructors</span>
        </button>
      </div>
    </div>
  );
};

export default AssignmentDashboard;