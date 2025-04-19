import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiMail,
  FiClock,
  FiBook,
  FiUsers,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicNavBar from "./DynamicNavBar";

function Viewmycourses() {
  // State management
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Fetch courses function
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8080/api/allcourses");
      setCourses(response.data);
      toast.success("Courses loaded successfully");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch courses";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.modules &&
        c.modules.some(
          (m) =>
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const toggleCourseExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = (open) => {
    setMobileSidebarOpen(open);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Navigation Sidebar */}
      <DynamicNavBar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        mobileSidebarOpen={mobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <button
              onClick={() => toggleMobileSidebar(true)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-indigo-800">
              Course Catalog
            </h1>
            <div className="w-6"></div>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

          <div className={`mx-auto ${sidebarOpen ? "max-w-6xl" : "max-w-7xl"}`}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className={`${sidebarOpen ? "lg:block" : "lg:block"}`}>
                <h1 className="text-2xl lg:text-3xl font-bold text-indigo-800">
                  Course Catalog
                </h1>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">
                  Browse all available courses and their modules
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80 lg:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses or modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 lg:py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm lg:text-base"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Courses List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                      Available Courses
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm">
                      {filteredCourses.length}{" "}
                      {filteredCourses.length === 1 ? "course" : "courses"}{" "}
                      found
                    </p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                  <p className="text-gray-600">Loading courses...</p>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    {searchTerm
                      ? "No matching courses found"
                      : "No courses available"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search to find what you're looking for."
                      : "Please check back later."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="flex justify-between items-start p-4 md:p-6 cursor-pointer"
                        onClick={() => toggleCourseExpand(course.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                              {course.name}
                            </h3>
                            <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {course.courseDuration} months
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {course.description}
                          </p>

                          <div className="mt-2 md:mt-3 flex flex-wrap gap-2 md:gap-3">
                            <div className="flex items-center text-xs md:text-sm text-gray-500">
                              <span>Rs {course.courseFee}</span>
                            </div>
                            <div className="flex items-center text-xs md:text-sm text-gray-500">
                              <FiMail className="mr-1 flex-shrink-0 text-gray-400" />
                              <span className="truncate max-w-[120px] md:max-w-none">
                                {course.contactEmail}
                              </span>
                            </div>
                            <div className="flex items-center text-xs md:text-sm text-gray-500">
                              <FiBook className="mr-1 flex-shrink-0 text-gray-400" />
                              <span>{course.modules?.length || 0} modules</span>
                            </div>
                            <div className="flex items-center text-xs md:text-sm text-gray-500">
                              <FiUsers className="mr-1 flex-shrink-0 text-gray-400" />
                              <span>{course.groups?.length || 0} groups</span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-2 md:ml-4 flex-shrink-0">
                          {expandedCourse === course.id ? (
                            <FiChevronUp className="text-gray-500 text-lg md:text-xl" />
                          ) : (
                            <FiChevronDown className="text-gray-500 text-lg md:text-xl" />
                          )}
                        </div>
                      </div>

                      {expandedCourse === course.id && (
                        <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 bg-gray-50 animate-fade-in">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                            {/* Course Details */}
                            <div>
                              <h4 className="font-medium text-gray-700 mb-3 md:mb-4">
                                Course Details
                              </h4>
                              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="space-y-3 md:space-y-4">
                                  <div>
                                    <h5 className="text-xs md:text-sm font-medium text-gray-500">
                                      Description
                                    </h5>
                                    <p className="mt-1 text-xs md:text-sm text-gray-800">
                                      {course.description}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                      <h5 className="text-xs md:text-sm font-medium text-gray-500">
                                        Duration
                                      </h5>
                                      <p className="mt-1 text-xs md:text-sm text-gray-800 flex items-center">
                                        <FiClock className="mr-1" />
                                        {course.courseDuration} months
                                      </p>
                                    </div>
                                    <div>
                                      <h5 className="text-xs md:text-sm font-medium text-gray-500">
                                        Course Fee
                                      </h5>
                                      <p className="mt-1 text-xs md:text-sm text-gray-800 flex items-center">
                                        Rs {course.courseFee}
                                      </p>
                                    </div>
                                    <div>
                                      <h5 className="text-xs md:text-sm font-medium text-gray-500">
                                        Contact Email
                                      </h5>
                                      <p className="mt-1 text-xs md:text-sm text-gray-800 flex items-center">
                                        <FiMail className="mr-1" />
                                        {course.contactEmail}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Student Groups */}
                              {course.groups?.length > 0 && (
                                <div className="mt-4 md:mt-6">
                                  <h4 className="font-medium text-gray-700 mb-2 md:mb-4 flex items-center gap-2">
                                    <FiUsers className="text-indigo-600" />
                                    <span>Student Groups</span>
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                                    {course.groups.map((group) => (
                                      <div
                                        key={group.groupId}
                                        className="bg-white p-2 md:p-3 rounded-lg shadow-sm border border-gray-200"
                                      >
                                        <span className="font-medium text-gray-800 text-sm">
                                          {group.groupName}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Modules Section */}
                            <div>
                              <h4 className="font-medium text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
                                <FiBook className="text-indigo-600" />
                                <span>Course Modules</span>
                                <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {course.modules?.length || 0}
                                </span>
                              </h4>

                              {course.modules?.length > 0 ? (
                                <div className="space-y-2 md:space-y-3">
                                  {course.modules.map((module) => (
                                    <div
                                      key={module.moduleId}
                                      className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200"
                                    >
                                      <h5 className="font-medium text-gray-900 text-sm md:text-base">
                                        {module.title}
                                      </h5>
                                      {module.description && (
                                        <p className="mt-1 md:mt-2 text-xs md:text-sm text-gray-600">
                                          {module.description}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500 text-sm">
                                  No modules available for this course
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Viewmycourses;
