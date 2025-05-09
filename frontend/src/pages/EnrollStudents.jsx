import React, { useState, useEffect, useMemo } from "react";
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
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import SideNav from "./SideNav";
import api from "../services/api";

const StudentEnrollment = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState({
    users: true,
    students: true,
    courses: true,
    enrollments: false,
  });
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    type: "",
    data: null,
    callback: null,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "fullName",
    direction: "ascending",
  });

  // Fetch data with optimized loading states
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized access. Please login again.");
      setLoading({ users: false, students: false, courses: false });
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch users and students in parallel
        const [usersResponse, studentsResponse, coursesResponse] =
          await Promise.all([
            api.get("/api/users", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            api.get("/api/student-enrollments", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            api.get("/api/allcourses", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setUsers(
          usersResponse.data.filter(
            (user) => user?.role === "student" && user?.fullName
          )
        );

        setStudents(
          studentsResponse.data.map((student) => ({
            ...student,
            fullName: `${student.firstName} ${student.lastName}`,
            courseClasses: student.courseClasses || {},
            courseModules: student.courseModules || {},
          }))
        );

        setCourses(coursesResponse.data);

        setLoading({ users: false, students: false, courses: false });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. " + err.message);
        setLoading({ users: false, students: false, courses: false });
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  // Sort users based on sort configuration
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter((user) => {
      const fullName = user?.fullName?.toLowerCase() || "";
      const email = user?.email?.toLowerCase() || "";
      const search = searchQuery.toLowerCase();
      return fullName.includes(search) || email.includes(search);
    });
  }, [sortedUsers, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Handle sort request
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle user selection
  const handleUserSelect = async (user) => {
    if (!user) return;

    setLoading((prev) => ({ ...prev, enrollments: true }));

    try {
      const existingStudent = students.find(
        (student) => student.email === user.email
      );

      if (existingStudent) {
        setSelectedUser(existingStudent);
        // Fetch groups for all courses in parallel
        await Promise.all(
          existingStudent.courses.map((courseName) =>
            fetchGroupsForCourse(courseName)
          )
        );
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
      toast.error("Failed to load user enrollments");
    } finally {
      setLoading((prev) => ({ ...prev, enrollments: false }));
    }
  };

  // Fetch groups for a course
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

  // Confirmation dialog handlers
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

    const token = localStorage.getItem("token");

    let student = students.find(
      (student) => student.email === selectedUser.email
    );

    if (!student) {
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
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newStudent = {
          ...response.data,
          fullName: firstName + " " + lastName,
          courseClasses: response.data.courseClasses || { [courseName]: "" },
          courseModules: response.data.courseModules || { [courseName]: [] },
        };

        setStudents([...students, newStudent]);
        setSelectedUser(newStudent);
        await fetchGroupsForCourse(courseName);
        toast.success(`Enrolled in course "${courseName}" successfully!`);
      } catch (err) {
        console.error("Error creating student enrollment:", err);
        toast.error("Failed to enroll in course");
      }
    } else {
      if (student.courses.includes(courseName)) {
        toast.warning(`Course "${courseName}" is already assigned.`);
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:8080/api/student-enrollments/${student.id}/courses?courseName=${courseName}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/student-enrollments/${selectedUser.id}/courses/${courseName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:8080/api/student-enrollments/${selectedUser.id}/courses/${courseName}/class?className=${groupId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

    const token = localStorage.getItem("token");

    if (selectedUser.courseModules[courseName]?.includes(moduleName)) {
      toast.warning(`Module "${moduleName}" is already assigned.`);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/student-enrollments/${selectedUser.id}/courses/${courseName}/modules?moduleName=${moduleName}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `http://localhost:8080/api/student-enrollments/${
          selectedUser.id
        }/courses/${encodeURIComponent(
          courseName
        )}/modules/${encodeURIComponent(moduleName)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  if (loading.users || loading.students || loading.courses) {
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
          <div className="text-center py-8">
            <ArrowPathIcon className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading student data...</p>
          </div>
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
          <div className="text-center py-8 text-red-500">
            <ExclamationTriangleIcon className="w-10 h-10 mx-auto" />
            <p className="mt-4">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Mobile header */}
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

          {/* Main Content Area */}
          {!selectedUser ? (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Search and Controls */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search students by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  Showing {currentUsers.length} of {filteredUsers.length}{" "}
                  students
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("fullName")}
                      >
                        <div className="flex items-center">
                          Student Name
                          {sortConfig.key === "fullName" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUpIcon className="ml-1 w-4 h-4" />
                            ) : (
                              <ChevronDownIcon className="ml-1 w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort("email")}
                      >
                        <div className="flex items-center">
                          Email
                          {sortConfig.key === "email" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUpIcon className="ml-1 w-4 h-4" />
                            ) : (
                              <ChevronDownIcon className="ml-1 w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Enrolled Courses
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => {
                        const isEnrolled = students.some(
                          (student) => student.email === user.email
                        );
                        const student = students.find(
                          (student) => student.email === user.email
                        );
                        const enrolledCount = student?.courses?.length || 0;

                        return (
                          <tr
                            key={user._id || user.email}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <UserCircleIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.fullName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {user.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  isEnrolled
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {isEnrolled ? "Enrolled" : "Not Enrolled"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {enrolledCount} course
                                {enrolledCount !== 1 ? "s" : ""}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleUserSelect(user)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          {searchQuery
                            ? "No matching students found"
                            : "No students available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredUsers.length > itemsPerPage && (
                <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(
                            currentPage * itemsPerPage,
                            filteredUsers.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredUsers.length}
                        </span>{" "}
                        results
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronUpIcon
                            className="h-5 w-5 transform -rotate-90"
                            aria-hidden="true"
                          />
                        </button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronDownIcon
                            className="h-5 w-5 transform -rotate-90"
                            aria-hidden="true"
                          />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
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
