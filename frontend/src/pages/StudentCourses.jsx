import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AcademicCapIcon,
  BookOpenIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import DynamicSidebar from "../components/DynamicSidebar";
import api from "../services/api";

const StudentCourses = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState({
    courses: [],
    courseClasses: {},
    courseModules: {},
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Get current user from localStorage with token
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser || {});
  }, []);

  // Fetch all courses to get group names
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get("/api/allcourses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message);
      toast.error("Failed to load course data");
    }
  };

  // Helper function to get group name by ID
  const getGroupName = (courseName, groupId) => {
    if (!groupId) return "Not assigned";

    const course = courses.find((c) => c.name === courseName);

    if (!course || !course.groups) return groupId;

    const group = course.groups.find((g) => g.groupId === groupId);

    return group ? group.groupName : groupId;
  };

  // Fetch student enrollments
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const [enrollmentsResponse] = await Promise.all([
        api.get("/api/student-enrollments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const studentEnrollment = enrollmentsResponse.data.find(
        (student) => student.email === user.email
      );

      if (studentEnrollment) {
        const formattedData = {
          fullName: `${studentEnrollment.firstName} ${studentEnrollment.lastName}`,
          email: studentEnrollment.email,
          courses: studentEnrollment.courses || [],
          courseClasses: studentEnrollment.courseClasses || {},
          courseModules: studentEnrollment.courseModules || {},
        };
        setEnrollments(formattedData);
      } else {
        toast.info("You are not enrolled in any courses yet.");
      }
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError(err.message);
      if (err.response?.status === 403) {
        toast.error("Access denied. Please login again.");
      } else {
        toast.error("Failed to fetch your enrollments");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      await fetchCourses();
      await fetchEnrollments();
    };

    loadData();
  }, [user.email]);

  if (loading && enrollments.courses.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <DynamicSidebar user={user} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <DynamicSidebar user={user} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md mx-auto">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Error Loading Data
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Re-login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DynamicSidebar
        user={user}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <main className="flex-1 p-6">
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
            <h1 className="text-xl font-bold text-gray-800">My Courses</h1>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              My Course Enrollments
            </span>
          </h1>
          <p className="text-gray-600">
            View your enrolled courses and modules
          </p>
        </div>

        {/* Student Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <UserCircleIcon className="w-16 h-16 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {enrollments.fullName || user.name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
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
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <BookOpenIcon className="w-8 h-8 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-800">
                      {courseName}
                    </h3>
                  </div>
                </div>

                {/* Class Information */}
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    Class Information
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Assigned Class</p>
                        <p className="font-medium text-gray-800">
                          {getGroupName(
                            courseName,
                            enrollments.courseClasses?.[courseName]
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modules Section */}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    Enrolled Modules
                  </h4>
                  {enrollments.courseModules?.[courseName]?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {enrollments.courseModules[courseName].map(
                        (moduleName, index) => (
                          <div
                            key={`${courseName}-${moduleName}-${index}`}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <BookOpenIcon className="w-5 h-5 text-green-600" />
                              </div>
                              <h5 className="font-medium text-gray-800">
                                {moduleName}
                              </h5>
                            </div>
                          </div>
                        )
                      )}
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
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No Enrolled Courses
            </h3>
            <p className="text-gray-500 mb-6">
              You are not currently enrolled in any courses. Please contact your
              administrator.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentCourses;
