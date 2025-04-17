import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  AcademicCapIcon,
  BookOpenIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";
// import Sidebar from "../components/Sidebar";
import Sidebar from "./DynamicNavBar";

const StudentCourses = () => {
  const [enrollments, setEnrollments] = useState({
    courses: [],
    courseClasses: {},
    courseModules: {}
  });
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Student User",
    email: "student@example.com",
    role: "student"
  };

  // Fetch all courses to get group names
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/allcourses");
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch student enrollments and groups
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        // First get all student enrollments
        const [enrollmentsResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/student-enrollments")
        ]);
        
        // Find the enrollment for the current student
        const studentEnrollment = enrollmentsResponse.data.find(
          student => student.email === currentUser.email
        );

        if (studentEnrollment) {
          // Format the data to match our state structure
          const formattedData = {
            fullName: `${studentEnrollment.firstName} ${studentEnrollment.lastName}`,
            email: studentEnrollment.email,
            courses: studentEnrollment.courses || [],
            courseClasses: studentEnrollment.courseClasses || {},
            courseModules: studentEnrollment.courseModules || {}
          };
          setEnrollments(formattedData);

          // Fetch groups for each enrolled course
          const groupsData = {};
          for (const courseName of formattedData.courses) {
            const course = courses.find(c => c.name === courseName);
            if (course) {
              groupsData[courseName] = course.groups || [];
            }
          }
          setGroups(groupsData);
        } else {
          toast.info("You are not enrolled in any courses yet.");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to fetch your enrollments");
      }
    };

    fetchEnrollments();
  }, [currentUser.email, courses]);

  // Helper function to get group name by ID
  const getGroupName = (courseName, groupId) => {
    if (!groupId) return "Not assigned";
    const courseGroups = groups[courseName] || [];
    const group = courseGroups.find(g => g.groupId === groupId);
    return group ? group.groupName : groupId;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mobileSidebarOpen={mobileSidebarOpen}
          toggleMobileSidebar={setMobileSidebarOpen}
        />
        <div className={`flex-1 flex items-center justify-center ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
          <div className="text-center py-8">Loading your courses...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mobileSidebarOpen={mobileSidebarOpen}
          toggleMobileSidebar={setMobileSidebarOpen}
        />
        <div className={`flex-1 flex items-center justify-center ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        mobileSidebarOpen={mobileSidebarOpen}
        toggleMobileSidebar={setMobileSidebarOpen}
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <div className="p-4 lg:p-8 w-full">
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Mobile header with toggle button */}
          <div className="lg:hidden flex items-center mb-6">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="mr-4 p-2 rounded-lg bg-blue-100 text-blue-600"
            >
              {mobileSidebarOpen ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">
                My Courses
              </h1>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                My Course Enrollments
              </span>
            </h1>
            <p className="text-gray-600 text-lg">View your enrolled courses and modules</p>
          </div>

          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <UserCircleIcon className="w-16 h-16 text-blue-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{enrollments.fullName || currentUser.name}</h2>
                <p className="text-gray-600">{currentUser.email}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {enrollments.courses?.length || 0} enrolled courses
                </p>
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          {enrollments.courses?.length > 0 ? (
            <div className="space-y-6">
              {enrollments.courses.map((courseName) => (
                <div 
                  key={courseName}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                      <BookOpenIcon className="w-8 h-8 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-800">{courseName}</h3>
                    </div>
                  </div>

                  {/* Class Information */}
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Class Information</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Assigned Class</p>
                          <p className="font-medium text-gray-800">
                            {getGroupName(courseName, enrollments.courseClasses?.[courseName])}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modules Section */}
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Enrolled Modules</h4>
                    {enrollments.courseModules?.[courseName]?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrollments.courseModules[courseName].map((moduleName, index) => (
                          <div 
                            key={`${courseName}-${moduleName}-${index}`}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <BookOpenIcon className="w-5 h-5 text-green-600" />
                              </div>
                              <h5 className="font-medium text-gray-800">{moduleName}</h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        You are not enrolled in any modules for this course yet.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Enrolled Courses</h3>
              <p className="text-gray-500 mb-6">
                You are not currently enrolled in any courses. Please contact your administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourses;