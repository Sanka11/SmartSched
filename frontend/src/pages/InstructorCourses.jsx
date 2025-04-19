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
  UserGroupIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import Sidebar from "./DynamicNavBar";

const InstructorCourses = () => {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Lecturer User",
    email: "lecturer@example.com",
    role: "lecturer"
  };

  // Fetch instructor data and courses using the same API as AssignInstructor
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch all instructors (same as AssignInstructor page)
        const instructorsResponse = await axios.get("http://localhost:8080/api/instructors");
        
        // Find the current lecturer in the instructors list
        const currentInstructor = instructorsResponse.data.find(
          instructor => instructor.email === currentUser.email
        );

        // Then fetch all courses (same as AssignInstructor page)
        const coursesResponse = await axios.get("http://localhost:8080/api/allcourses");
        
        setInstructors(instructorsResponse.data);
        setCourses(coursesResponse.data);
        setLoading(false);

        if (!currentInstructor) {
          toast.info("You are not currently assigned to any modules.");
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to fetch your assigned modules");
      }
    };

    fetchData();
  }, [currentUser.email]);

  // Get the current instructor's assignments
  const getCurrentInstructor = () => {
    return instructors.find(instructor => instructor.email === currentUser.email);
  };

  // Get course for a module
  const getCourseForModule = (moduleTitle) => {
    return courses.find(course => 
      course.modules?.some(module => module.title === moduleTitle)
    );
  };

  // Get group name for a module
  const getGroupName = (moduleTitle) => {
    const instructor = getCurrentInstructor();
    if (!instructor || !instructor.classes) return "Not assigned";
    
    const groupId = instructor.classes[moduleTitle];
    if (!groupId) return "Not assigned";
    
    const course = getCourseForModule(moduleTitle);
    const group = course?.groups?.find(g => g.groupId === groupId);
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
          <div className="text-center py-8">Loading your assigned modules...</div>
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

  const currentInstructor = getCurrentInstructor();
  const assignedModules = currentInstructor?.modules || [];

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
                My Assignments
              </h1>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                My Teaching Assignments
              </span>
            </h1>
            <p className="text-gray-600 text-lg">View your assigned courses and modules</p>
          </div>

          {/* Lecturer Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <UserCircleIcon className="w-16 h-16 text-blue-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentInstructor ? 
                    `${currentInstructor.firstName} ${currentInstructor.lastName}` : 
                    currentUser.name}
                </h2>
                <p className="text-gray-600">{currentUser.email}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  {assignedModules.length} assigned modules
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Modules */}
          {assignedModules.length > 0 ? (
            <div className="space-y-6">
              {assignedModules.map((moduleTitle, index) => {
                const course = getCourseForModule(moduleTitle);
                return (
                  <div 
                    key={`${moduleTitle}-${index}`}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center gap-3">
                        <BookOpenIcon className="w-8 h-8 text-purple-600" />
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{moduleTitle}</h3>
                          {course && (
                            <p className="text-sm text-gray-600">{course.name}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Class Information */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-700 mb-3">Class Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <UserGroupIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Assigned Class</p>
                            <p className="font-medium text-gray-800">
                              {getGroupName(moduleTitle)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          
                        </div>
                      </div>
                    </div>

                    
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Assigned Modules</h3>
              <p className="text-gray-500 mb-6">
                You are not currently assigned to any modules. Please contact your administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourses;