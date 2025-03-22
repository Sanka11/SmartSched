import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  PresentationChartBarIcon,
  ChartBarIcon,
  HomeIcon,
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const SideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="w-64 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 shadow-lg flex flex-col justify-between">
      <div className="flex flex-col space-y-6">
        {/* Logo or Branding */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Academic
            </span>
          </h1>
          <p className="text-sm text-gray-600">Management System</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-3">
          <div
            onClick={() => navigate("/assignmentdashboard")}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
          >
            <HomeIcon className="w-6 h-6 text-blue-600" />
            <span className="text-gray-800 font-medium">Home</span>
          </div>
          <div
            onClick={() => navigate("/enroll-students")}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
          >
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
            <span className="text-gray-800 font-medium">Enroll Students</span>
          </div>
          <div
            onClick={() => navigate("/assign-instructors")}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-100 cursor-pointer transition-colors"
          >
            <PresentationChartBarIcon className="w-6 h-6 text-green-600" />
            <span className="text-gray-800 font-medium">Assign Instructors</span>
          </div>
          <div
            onClick={() => navigate("/assign-classes")}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-yellow-100 cursor-pointer transition-colors"
          >
            <AcademicCapIcon className="w-6 h-6 text-yellow-600" />
            <span className="text-gray-800 font-medium">Assign Classes</span>
          </div>
          <div
            onClick={() => navigate("/generate-reports-assign")}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-100 cursor-pointer transition-colors"
          >
            <ChartBarIcon className="w-6 h-6 text-purple-600" />
            <span className="text-gray-800 font-medium">Generate Reports</span>
          </div>
        </nav>
      </div>

      {/* Logout Button */}
      <div
        onClick={handleLogout}
        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-100 cursor-pointer transition-colors"
      >
        <ArrowLeftOnRectangleIcon className="w-6 h-6 text-red-600" />
        <span className="text-gray-800 font-medium">Logout</span>
      </div>
    </div>
  );
};

export default SideNav;