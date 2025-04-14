import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  PresentationChartBarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
  BuildingOfficeIcon, // Added for Hall Management
} from "@heroicons/react/24/outline";

const AssignmentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto"> {/* Increased max-width to accommodate more cards */}
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Academic Management
            </span>
          </h1>
          <p className="text-xl text-gray-600">Manage student enrollments, instructor assignments, and class allocations efficiently</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Student Enrollment Card */}
          <div
            onClick={() => navigate("/enroll-students")}
            className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <UserGroupIcon className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Student Enrollment</h2>
              <p className="text-gray-600 mb-6">
                Manage student registrations, course enrollments, and academic records
              </p>
              <button className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                <span>Enroll Students</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Instructor Assignment Card */}
          <div
            onClick={() => navigate("/assign-instructors")}
            className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <PresentationChartBarIcon className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Instructor Assignment</h2>
              <p className="text-gray-600 mb-6">
                Assign courses to instructors and manage teaching schedules
              </p>
              <button className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                <span>Assign Instructors</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Assign Class Card */}
          <div
            onClick={() => navigate("/assign-classes")}
            className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative">
              <div className="mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <AcademicCapIcon className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Assign Classes</h2>
              <p className="text-gray-600 mb-6">
                Allocate classes to students and manage class schedules
              </p>
              <button className="flex items-center text-yellow-600 font-semibold group-hover:text-yellow-700 transition-colors">
                <span>Assign Classes</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Hall Management Card */}
          <div
            onClick={() => navigate("/locations")} // Assuming this is your hall management route
            className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative">
              <div className="mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                  <BuildingOfficeIcon className="w-8 h-8 text-teal-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Hall Management</h2>
              <p className="text-gray-600 mb-6">
                Manage lecture halls, classrooms, and facility allocations
              </p>
              <button className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                <span>Manage Halls</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Timetable Card */}
          <div
            className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">View Timetables</h2>
              <p className="text-gray-600 mb-6">
                Access and manage class schedules by instructor or by course
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate("/InstructorTimetable")}
                  className="w-full flex items-center justify-between px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <span className="text-red-600 font-medium">By Instructor</span>
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button 
                  onClick={() => navigate("/CourseGroupTimetable")}
                  className="w-full flex items-center justify-between px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <span className="text-red-600 font-medium">By Course</span>
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Generate Reports Card */}
          <div
            onClick={() => navigate("/generate-reports-assign")}
            className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            <div className="relative">
              <div className="mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Generate Reports</h2>
              <p className="text-gray-600 mb-6">
                Generate and export detailed academic reports and analytics
              </p>
              <button className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors">
                <span>Generate Reports</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-500 mt-12 text-sm">
          Manage all academic operations in one place • Quick and efficient management tools
        </p>
      </div>
    </div>
  );
};

export default AssignmentDashboard;