import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentEnrollment = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    type: "",
    data: null,
    callback: null,
  });

  // Fetch students from the backend API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/student-enrollments");
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle student search
  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Confirmation dialog
  const showConfirmation = (type, data, callback) => {
    setDeleteConfirmation({ show: true, type, data, callback });
  };

  const hideConfirmation = () => {
    setDeleteConfirmation({ show: false, type: "", data: null, callback: null });
  };

  // Handle course removal with confirmation
  const handleRemoveCourse = async (courseName) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/student-enrollments/${selectedStudent.id}/courses/${courseName}`
      );
      const updatedStudent = response.data;
      setSelectedStudent(updatedStudent);
      toast.success(`Course "${courseName}" removed successfully!`);
    } catch (err) {
      console.error("Error removing course:", err);
      toast.error("Failed to remove course");
    }
  };

  // Handle course enrollment
  const handleEnrollCourse = async (courseName) => {
    if (!courseName) {
      toast.warning("Please select a course to enroll in.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/student-enrollments/${selectedStudent.id}/courses?courseName=${courseName}`
      );
      const updatedStudent = response.data;
      setSelectedStudent(updatedStudent);
      toast.success(`Enrolled in course "${courseName}" successfully!`);
    } catch (err) {
      console.error("Error enrolling in course:", err);
      toast.error("Failed to enroll in course");
    }
  };

  // Handle class assignment
  const handleAssignClass = async (courseName, className) => {
    if (!className) {
      toast.warning("Please select a class to assign.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/api/student-enrollments/${selectedStudent.id}/courses/${courseName}/class?className=${className}`
      );
      const updatedStudent = response.data;
      setSelectedStudent(updatedStudent);
      toast.success(`Class "${className}" assigned successfully!`);
    } catch (err) {
      console.error("Error assigning class:", err);
      toast.error("Failed to assign class");
    }
  };

  // Handle module enrollment
  const handleEnrollModule = async (courseName, moduleName) => {
    if (!moduleName) {
      toast.warning("Please select a module to enroll in.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/student-enrollments/${selectedStudent.id}/courses/${courseName}/modules?moduleName=${moduleName}`
      );
      const updatedStudent = response.data;
      setSelectedStudent(updatedStudent);
      toast.success(`Enrolled in module "${moduleName}" successfully!`);
    } catch (err) {
      console.error("Error enrolling in module:", err);
      toast.error("Failed to enroll in module");
    }
  };

  // Handle module removal with confirmation
  const handleRemoveModule = async (courseName, moduleName) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/student-enrollments/${selectedStudent.id}/courses/${courseName}/modules/${moduleName}`
      );
      const updatedStudent = response.data;
      setSelectedStudent(updatedStudent);
      toast.success(`Module "${moduleName}" removed successfully!`);
    } catch (err) {
      console.error("Error removing module:", err);
      toast.error("Failed to remove module");
    }
  };

  if (loading) return <div className="p-6 text-gray-700">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this {deleteConfirmation.type}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={hideConfirmation}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteConfirmation.callback(deleteConfirmation.data);
                  hideConfirmation();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mr-3 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Student Enrollment
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white shadow-sm"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-4 top-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Student List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`p-6 bg-white rounded-xl shadow-sm cursor-pointer transition-all duration-300 ${
                selectedStudent?.id === student.id
                  ? "ring-2 ring-blue-500 transform scale-[1.02]"
                  : "hover:shadow-md hover:ring-1 hover:ring-gray-100"
              }`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-gray-600 truncate">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline mr-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {student.email}
              </p>
            </div>
          ))}
        </div>

        {/* Selected Student Details */}
        {selectedStudent && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-3 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {selectedStudent.firstName} {selectedStudent.lastName}'s Enrollments
            </h2>

            {/* Enrolled Courses */}
            <div className="space-y-6">
              {selectedStudent.courses.map((courseName) => (
                <div key={courseName} className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800 px-4 py-2 bg-white rounded-md shadow-sm">
                      {courseName}
                    </h3>
                    <button
                      onClick={() => showConfirmation("course", courseName, handleRemoveCourse)}
                      className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove Course
                    </button>
                  </div>

                  {/* Class Assignment */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Assigned Class:</label>
                    <select
                      value={selectedStudent.courseClasses[courseName] || ""}
                      onChange={(e) => handleAssignClass(courseName, e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                      <option value="">Select Class</option>
                      <option value="WD Class 1">WD Class 1</option>
                      <option value="WD Class 2">WD Class 2</option>
                    </select>
                  </div>

                  {/* Module Management */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Enrolled Modules:</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedStudent.courseModules[courseName]?.map((moduleName) => (
                        <div
                          key={moduleName}
                          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                        >
                          <span className="text-gray-700">{moduleName}</span>
                          <button
                            onClick={() => showConfirmation("module", { courseName, moduleName }, handleRemoveModule)}
                            className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Module */}
                  <div className="mt-6">
                    <select
                      onChange={(e) => handleEnrollModule(courseName, e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                      <option value="">Enroll in Module</option>
                      <option value="Web Development Basics">Web Development Basics</option>
                      <option value="Advanced Web Development">Advanced Web Development</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Course */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Enroll in New Course</h3>
              <select
                onChange={(e) => handleEnrollCourse(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              >
                <option value="">Select Course</option>
                <option value="IT">IT</option>
                <option value="SE">SE</option>
                <option value="DS">DS</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollment;