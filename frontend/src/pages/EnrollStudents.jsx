import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  XCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import SideNav from "./SideNav";
import api from "../services/api";

const StudentEnrollment = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    type: "",
    data: null,
    callback: null,
  });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Fetch users and students from the backend API
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // 🛑 must get token

      if (!token) {
        console.error("No token found. User must login again.");
        setError("Unauthorized access. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const [usersResponse, studentsResponse] = await Promise.all([
          api.get("/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          api.get("/api/student-enrollments", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setUsers(
          usersResponse.data.filter(
            (user) => user?.role === "student" && user?.fullName
          )
        );
        const studentsWithDefaults = studentsResponse.data.map((student) => ({
          ...student,
          fullName: student.firstName + " " + student.lastName,
          courseClasses: student.courseClasses || {},
          courseModules: student.courseModules || {},
        }));
        setStudents(studentsWithDefaults);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users/students:", err);
        setError("Failed to fetch users/students. " + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User must login again.");
        toast.error("Unauthorized. Please login again.");
        return;
      }

      try {
        const response = await api.get("/api/allcourses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        toast.error("Failed to fetch courses. " + err.message);
      }
    };

    fetchCourses();
  }, []);

  // Filter students based on search query
  const filteredUsers = users.filter((user) => {
    const fullName = user?.fullName || "";
    const email = user?.email || "";
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSearchActive(e.target.value.length > 0);
  };

  // Handle user selection
  const handleUserSelect = async (user) => {
    if (!user) return;

    try {
      // Check if this user is already a student (has enrollments)
      const existingStudent = students.find(
        (student) => student.email === user.email
      );

      if (existingStudent) {
        setSelectedUser(existingStudent);
        // Fetch groups for all courses of the selected student
        existingStudent.courses.forEach((courseName) => {
          fetchGroupsForCourse(courseName);
        });
      } else {
        setSelectedUser({
          ...user,
          courses: [],
          courseClasses: {},
          courseModules: {},
        });
      }
    } catch (err) {
      console.error("Error selecting user:", err);
      toast.error("Failed to select user");
    }
  };

  // Fetch groups for a specific course
  const fetchGroupsForCourse = async (courseName) => {
    try {
      const selectedCourse = courses.find(
        (course) => course.name === courseName
      );
      if (selectedCourse) {
        setGroups((prev) => ({
          ...prev,
          [courseName]: selectedCourse.groups || [],
        }));
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
      toast.error("Failed to fetch groups");
    }
  };

  // Confirmation dialog
  const showConfirmation = (type, data, callback) => {
    setDeleteConfirmation({ show: true, type, data, callback });
  };

  const hideConfirmation = () => {
    setDeleteConfirmation({
      show: false,
      type: "",
      data: null,
      callback: null,
    });
  };

  // Handle course enrollment
  const handleEnrollCourse = async (courseName) => {
    if (!courseName || !selectedUser) {
      toast.warning("Please select a course and student.");
      return;
    }

    // Check if the user is already a student
    let student = students.find(
      (student) => student.email === selectedUser.email
    );

    if (!student) {
      // If not, create a new student enrollment record
      try {
        const nameParts = selectedUser.fullName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const response = await axios.post(
          "http://localhost:8080/api/student-enrollments",
          {
            firstName,
            lastName,
            email: selectedUser.email,
            courses: [courseName],
            courseClasses: { [courseName]: "" },
            courseModules: { [courseName]: [] },
          }
        );

        const newStudent = {
          ...response.data,
          fullName: firstName + " " + lastName,
          courseClasses: response.data.courseClasses || { [courseName]: "" },
          courseModules: response.data.courseModules || { [courseName]: [] },
        };

        // Update state
        setStudents([...students, newStudent]);
        setSelectedUser(newStudent);
        await fetchGroupsForCourse(courseName);
        toast.success(`Enrolled in course "${courseName}" successfully!`);
      } catch (err) {
        console.error("Error creating student enrollment:", err);
        toast.error("Failed to enroll in course");
      }
    } else {
      // Check if the course is already assigned
      if (student.courses.includes(courseName)) {
        toast.warning(
          `Course "${courseName}" is already assigned to the student.`
        );
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:8080/api/student-enrollments/${student.id}/courses?courseName=${courseName}`
        );
        const updatedStudent = {
          ...response.data,
          fullName: response.data.firstName + " " + response.data.lastName,
          courseClasses: response.data.courseClasses || {
            ...student.courseClasses,
            [courseName]: "",
          },
          courseModules: response.data.courseModules || {
            ...student.courseModules,
            [courseName]: [],
          },
        };

        setSelectedUser(updatedStudent);
        setStudents(
          students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
        );
        await fetchGroupsForCourse(courseName);
        toast.success(`Enrolled in course "${courseName}" successfully!`);
      } catch (err) {
        console.error("Error enrolling in course:", err);
        toast.error("Failed to enroll in course");
      }
    }
  };

  // Handle course removal with confirmation
  const handleRemoveCourse = async (courseName) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/student-enrollments/${selectedUser.id}/courses/${courseName}`
      );
      const updatedStudent = {
        ...response.data,
        fullName: response.data.firstName + " " + response.data.lastName,
        courseClasses: response.data.courseClasses || {},
        courseModules: response.data.courseModules || {},
      };

      setSelectedUser(updatedStudent);
      setStudents(
        students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );

      // Remove groups for this course
      setGroups((prev) => {
        const newGroups = { ...prev };
        delete newGroups[courseName];
        return newGroups;
      });

      toast.success(`Course "${courseName}" removed successfully!`);
    } catch (err) {
      console.error("Error removing course:", err);
      toast.error("Failed to remove course");
    }
  };

  // Handle class assignment
  const handleAssignClass = async (courseName, groupId) => {
    if (!selectedUser || !groupId) {
      toast.warning("Please select a class and student.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/student-enrollments/${selectedUser.id}/courses/${courseName}/class?className=${groupId}`
      );

      if (response.status === 200) {
        const updatedStudent = {
          ...response.data,
          fullName: response.data.firstName + " " + response.data.lastName,
          courseClasses: response.data.courseClasses || {
            ...selectedUser.courseClasses,
            [courseName]: groupId,
          },
          courseModules: response.data.courseModules || {
            ...selectedUser.courseModules,
          },
        };

        setSelectedUser(updatedStudent);
        setStudents(
          students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
        );

        // Find the group name to display in the success message
        const group = (groups[courseName] || []).find(
          (g) => g.groupId === groupId
        );
        toast.success(
          `Class "${group?.groupName || groupId}" assigned successfully!`
        );
      } else {
        toast.error(
          "Failed to assign class: Unexpected response from the server."
        );
      }
    } catch (err) {
      console.error("Error assigning class:", err);
      if (err.response) {
        toast.error(
          `Failed to assign class: ${
            err.response.data.message || err.response.statusText
          }`
        );
      } else if (err.request) {
        toast.error("Failed to assign class: No response from the server.");
      } else {
        toast.error("Failed to assign class: An unexpected error occurred.");
      }
    }
  };

  // Handle module enrollment
  const handleEnrollModule = async (courseName, moduleName) => {
    if (!moduleName) {
      toast.warning("Please select a module to enroll in.");
      return;
    }

    // Check if the module is already assigned for the selected course
    if (selectedUser.courseModules[courseName]?.includes(moduleName)) {
      toast.warning(
        `Module "${moduleName}" is already assigned to the student for course "${courseName}".`
      );
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/student-enrollments/${selectedUser.id}/courses/${courseName}/modules?moduleName=${moduleName}`
      );
      const updatedStudent = {
        ...response.data,
        fullName: response.data.firstName + " " + response.data.lastName,
        courseClasses: response.data.courseClasses || {
          ...selectedUser.courseClasses,
        },
        courseModules: response.data.courseModules || {
          ...selectedUser.courseModules,
          [courseName]: [
            ...(selectedUser.courseModules[courseName] || []),
            moduleName,
          ],
        },
      };

      setSelectedUser(updatedStudent);
      setStudents(
        students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );
      toast.success(`Enrolled in module "${moduleName}" successfully!`);
    } catch (err) {
      console.error("Error enrolling in module:", err);
      toast.error("Failed to enroll in module");
    }
  };

  // Handle module removal with confirmation
  const handleRemoveModule = async (data) => {
    const { courseName, moduleName } = data;

    if (!moduleName) {
      toast.warning("Module name is required.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/student-enrollments/${
          selectedUser.id
        }/courses/${encodeURIComponent(
          courseName
        )}/modules/${encodeURIComponent(moduleName)}`
      );

      // Create updated student object
      const updatedStudent = {
        ...selectedUser,
        courseModules: {
          ...selectedUser.courseModules,
          [courseName]: selectedUser.courseModules[courseName].filter(
            (mod) => mod !== moduleName
          ),
        },
      };

      setSelectedUser(updatedStudent);
      setStudents(
        students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );
      toast.success(`Module "${moduleName}" removed successfully!`);
    } catch (err) {
      console.error("Error removing module:", err);
      toast.error("Failed to remove module");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <SideNav
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mobileSidebarOpen={mobileSidebarOpen}
          toggleMobileSidebar={setMobileSidebarOpen}
        />
        <div
          className={`flex-1 flex items-center justify-center ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          }`}
        >
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <SideNav
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          mobileSidebarOpen={mobileSidebarOpen}
          toggleMobileSidebar={setMobileSidebarOpen}
        />
        <div
          className={`flex-1 flex items-center justify-center ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          }`}
        >
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Determine which users to display - hide others when a student is selected
  const displayedUsers = selectedUser
    ? []
    : isSearchActive
    ? filteredUsers
    : filteredUsers.slice(0, 6);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <SideNav
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        mobileSidebarOpen={mobileSidebarOpen}
        toggleMobileSidebar={setMobileSidebarOpen}
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
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
                Student Enrollment
              </h1>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Student Enrollment Management
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Enroll courses, modules, and classes to students
            </p>
          </div>

          {/* Confirmation Modal */}
          {deleteConfirmation.show && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
              <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                <div className="text-center">
                  <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Confirm Deletion
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {deleteConfirmation.type === "module"
                      ? `Are you sure you want to delete the "${deleteConfirmation.data.moduleName}" module?`
                      : `Are you sure you want to delete the course "${deleteConfirmation.data}"?`}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={hideConfirmation}
                      className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        deleteConfirmation.callback(deleteConfirmation.data);
                        hideConfirmation();
                      }}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <XCircleIcon className="w-5 h-5" />
                      Confirm Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Bar - Only show when no student is selected */}
          {!selectedUser && (
            <div className="mb-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          )}

          {/* Student Cards - Only show when no student is selected */}
          {!selectedUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedUsers.map((user) => (
                <div
                  key={user._id || user.email}
                  onClick={() => handleUserSelect(user)}
                  className={`group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <UserCircleIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {user.fullName}
                      </h2>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                      {students.some(
                        (student) => student.email === user.email
                      ) && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Enrolled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Student Details */}
          {selectedUser && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    <AcademicCapIcon className="w-8 h-8 text-purple-600 inline-block mr-3" />
                    {selectedUser.fullName + "'s Enrollments"}
                  </h2>
                  <p className="text-gray-500 mt-1">{selectedUser.email}</p>
                  {!students.some(
                    (student) => student.email === selectedUser.email
                  ) && (
                    <p className="text-sm text-yellow-600 mt-1">
                      This user is not yet enrolled as a student. Enrolling in a
                      course will create a student record.
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Enrolled Courses - only show if user is a student */}
              {students.some(
                (student) => student.email === selectedUser.email
              ) && (
                <div className="space-y-6">
                  {selectedUser.courses?.map((courseName) => (
                    <div
                      key={`${selectedUser.id}-${courseName}`}
                      className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <BookOpenIcon className="w-6 h-6 text-blue-500" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {courseName}
                            </h3>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            showConfirmation(
                              "course",
                              courseName,
                              handleRemoveCourse
                            )
                          }
                          className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Remove Course
                        </button>
                      </div>

                      {/* Class Assignment */}
                      <div className="ml-9 mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned Class
                        </label>
                        <div className="flex items-center gap-4">
                          <select
                            value={
                              selectedUser.courseClasses?.[courseName] || ""
                            }
                            onChange={(e) =>
                              handleAssignClass(courseName, e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="">Select Class</option>
                            {groups[courseName]?.map((group) => (
                              <option
                                key={`${courseName}-${group.groupId}`}
                                value={group.groupId}
                              >
                                {group.groupName}
                              </option>
                            ))}
                          </select>
                          <span className="text-gray-600">
                            {(() => {
                              const classId =
                                selectedUser.courseClasses?.[courseName];
                              const group = groups[courseName]?.find(
                                (g) => g.groupId === classId
                              );
                              return group
                                ? group.groupName
                                : classId || "Not assigned";
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Module Management */}
                      <div className="ml-9">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enrolled Modules
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedUser.courseModules?.[courseName]?.map(
                            (moduleName, index) => (
                              <div
                                key={`${selectedUser.id}-${courseName}-${moduleName}-${index}`}
                                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                              >
                                <span className="text-gray-700">
                                  {moduleName}
                                </span>
                                <button
                                  onClick={() =>
                                    showConfirmation(
                                      "module",
                                      {
                                        courseName: courseName,
                                        moduleName: moduleName,
                                      },
                                      handleRemoveModule
                                    )
                                  }
                                  className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                                >
                                  <XCircleIcon className="w-4 h-4" />
                                  Remove
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Add Module */}
                      <div className="ml-9 mt-4">
                        <select
                          onChange={(e) =>
                            handleEnrollModule(courseName, e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">Enroll in Module</option>
                          {courses
                            .find((course) => course.name === courseName)
                            ?.modules?.map((module) => (
                              <option
                                key={`${courseName}-${module.moduleId}`}
                                value={module.title}
                              >
                                {module.title}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Course */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <AcademicCapIcon className="w-6 h-6 text-green-500" />
                  Enroll in New Course
                </h3>
                <div className="flex items-center gap-4">
                  <select
                    onChange={(e) => handleEnrollCourse(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option
                        key={course.id || course.name}
                        value={course.name}
                      >
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEnrollment;
