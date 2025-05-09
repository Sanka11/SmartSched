import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  BookOpenIcon,
  AcademicCapIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "./SideNav";

const AssignInstructor = () => {
  // State variables
  const [users, setUsers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState("");
  const [classToDelete, setClassToDelete] = useState("");
  const [deleteAction, setDeleteAction] = useState(""); // 'module' or 'class'
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch users and instructors on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const userRole = JSON.parse(localStorage.getItem("user"))?.role || "";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        if (
          [
            "admin",
            "superadmin",
            "user manager",
            "assignment manager",
          ].includes(userRole)
        ) {
          const resUsers = await fetch("http://localhost:8080/api/users", {
            headers,
          });
          if (resUsers.ok) setUsers(await resUsers.json());
          else throw new Error("Failed to fetch users");
        }
        const resInstructors = await fetch(
          "http://localhost:8080/api/instructors",
          { headers }
        );
        if (resInstructors.ok) setInstructors(await resInstructors.json());
        else throw new Error("Failed to fetch instructors");

        const resCourses = await fetch("http://localhost:8080/api/allcourses", {
          headers,
        });
        if (resCourses.ok) setCourses(await resCourses.json());
        else throw new Error("Failed to fetch courses");
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search query and role
  const filteredUsers = users.filter(
    (user) =>
      user.role === "lecturer" &&
      (user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    // Check if this user is already an instructor
    const existingInstructor = instructors.find(
      (instructor) => instructor.email === user.email
    );

    if (existingInstructor) {
      // If they are an instructor, set them as selected
      setSelectedUser({
        ...existingInstructor,
        fullName:
          existingInstructor.firstName + " " + existingInstructor.lastName,
      });
    } else {
      // If not, just set the basic user info
      setSelectedUser(user);
    }
  };

  // Handle module assignment
  const handleAssignModule = async (moduleTitle) => {
    if (!selectedCourse || !moduleTitle || !selectedUser) {
      toast.warning("Please select a course, module, and instructor.");
      return;
    }

    // Check if the user is already an instructor
    let instructor = instructors.find(
      (instructor) => instructor.email === selectedUser.email
    );

    if (!instructor) {
      // If not, create a new instructor record
      try {
        const nameParts = selectedUser.fullName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const response = await fetch("http://localhost:8080/api/instructors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: selectedUser.email,
            modules: [moduleTitle],
          }),
        });

        if (!response.ok) throw new Error("Failed to create instructor");

        const newInstructor = await response.json();
        const newInstructorWithFullName = {
          ...newInstructor,
          fullName: firstName + " " + lastName,
        };

        // Update state
        setInstructors([...instructors, newInstructor]);
        setSelectedUser(newInstructorWithFullName);
        instructor = newInstructor;
      } catch (err) {
        console.error("Error creating instructor:", err);
        toast.error("Failed to create instructor");
        return;
      }
    } else {
      // Check if the module is already assigned
      if (instructor.modules && instructor.modules.includes(moduleTitle)) {
        toast.warning(
          `Module "${moduleTitle}" is already assigned to ${instructor.firstName} ${instructor.lastName}.`
        );
        return;
      }

      // Assign module to existing instructor
      fetch(
        `http://localhost:8080/api/instructors/${instructor.email}/assignModule/${moduleTitle}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((updatedInstructor) => {
          const updatedInstructorWithFullName = {
            ...updatedInstructor,
            fullName:
              updatedInstructor.firstName + " " + updatedInstructor.lastName,
          };

          setInstructors((prevInstructors) =>
            prevInstructors.map((inst) =>
              inst.id === updatedInstructor.id ? updatedInstructor : inst
            )
          );
          setSelectedUser(updatedInstructorWithFullName);
          setSelectedCourse("");
          setSelectedModule("");
          toast.success(`Module "${moduleTitle}" assigned successfully!`);
        })
        .catch((err) => {
          console.error("Error assigning module:", err);
          toast.error("Failed to assign module");
        });
      return;
    }
  };

  // Handle class assignment
  const handleAssignClass = (moduleName, groupId) => {
    if (!selectedUser || !groupId || !selectedUser.email) {
      toast.warning("Please select a class and instructor.");
      return;
    }

    // Find the course that contains this module
    const selectedCourse = courses.find((c) =>
      c.modules?.some((m) => m.title === moduleName)
    );

    // Find the specific group in this course
    const selectedGroup = selectedCourse?.groups?.find(
      (group) => group.groupId === groupId
    );
    const groupName = selectedGroup?.groupName;

    if (!groupName) {
      toast.warning("Invalid group selected.");
      return;
    }

    // Send the groupId to the backend
    fetch(
      `http://localhost:8080/api/instructors/${selectedUser.email}/assignClass/${moduleName}/${groupId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupName }),
      }
    )
      .then(() => {
        // Update the selectedUser state immediately
        const updatedUser = {
          ...selectedUser,
          classes: {
            ...selectedUser.classes,
            [moduleName]: groupId,
          },
        };
        setSelectedUser(updatedUser);

        // Update the instructors list
        setInstructors((prevInstructors) =>
          prevInstructors.map((instructor) =>
            instructor.email === selectedUser.email ? updatedUser : instructor
          )
        );

        toast.success(`Class "${groupName}" assigned successfully!`);
      })
      .catch((err) => {
        console.error("Error assigning class:", err);
        toast.error("Failed to assign class");
      });
  };

  // Handle module deletion
  const handleDeleteModule = (moduleName) => {
    setModuleToDelete(moduleName);
    setClassToDelete("");
    setDeleteAction("module");
    setShowDeleteModal(true);
  };

  // Handle class deletion
  const handleDeleteClass = (moduleName, groupId) => {
    setModuleToDelete(moduleName);
    setClassToDelete(groupId);
    setDeleteAction("class");
    setShowDeleteModal(true);
  };

  // Confirm deletion (module or class)
  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    if (deleteAction === "module") {
      fetch(
        `http://localhost:8080/api/instructors/${selectedUser.email}/deleteModule/${moduleToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(() => {
          // Update the selectedUser state immediately
          const updatedUser = {
            ...selectedUser,
            modules: selectedUser.modules.filter((m) => m !== moduleToDelete),
            classes: Object.fromEntries(
              Object.entries(selectedUser.classes || {}).filter(
                ([mod]) => mod !== moduleToDelete
              )
            ),
          };
          setSelectedUser(updatedUser);

          // Update the instructors list
          setInstructors((prevInstructors) =>
            prevInstructors.map((instructor) =>
              instructor.email === selectedUser.email ? updatedUser : instructor
            )
          );

          toast.success(
            `Module "${moduleToDelete}" and its classes deleted successfully!`
          );
        })
        .catch((err) => {
          console.error("Error deleting module:", err);
          toast.error("Failed to delete module");
        });
    } else if (deleteAction === "class") {
      fetch(
        `http://localhost:8080/api/instructors/${selectedUser.email}/deleteClass/${moduleToDelete}/${classToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(() => {
          // Update the selectedUser state immediately
          const updatedUser = {
            ...selectedUser,
            classes: Object.fromEntries(
              Object.entries(selectedUser.classes || {}).filter(
                ([mod, cls]) =>
                  !(mod === moduleToDelete && cls === classToDelete)
              )
            ),
          };
          setSelectedUser(updatedUser);

          // Update the instructors list
          setInstructors((prevInstructors) =>
            prevInstructors.map((instructor) =>
              instructor.email === selectedUser.email ? updatedUser : instructor
            )
          );

          toast.success(`Class deleted successfully!`);
        })
        .catch((err) => {
          console.error("Error deleting class:", err);
          toast.error("Failed to delete class");
        });
    }
  };

  // Get course name for a module
  const getCourseNameForModule = (moduleTitle) => {
    const course = courses.find((c) =>
      c.modules?.some((m) => m.title === moduleTitle)
    );
    return course?.name || "Unknown Course";
  };

  // Get group name for a module
  const getGroupNameForModule = (moduleName) => {
    const groupId = selectedUser.classes?.[moduleName];
    if (!groupId) return "No class assigned";

    const selectedCourse = courses.find((c) =>
      c.modules?.some((m) => m.title === moduleName)
    );
    const selectedGroup = selectedCourse?.groups?.find(
      (group) => group.groupId === groupId
    );
    return selectedGroup?.groupName || "Unknown Group";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
          {/* Toast Container */}
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
                Instructor Management
              </h1>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Instructor Management
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Assign modules and classes to instructors
            </p>
          </div>

          {/* Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <div className="text-center">
                  <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Confirm Deletion
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {deleteAction === "module"
                      ? `Are you sure you want to delete the "${moduleToDelete}" module and its associated classes?`
                      : `Are you sure you want to delete the class from "${moduleToDelete}"?`}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
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

          {/* Search Bar */}
          <div className="mb-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Back button when user is selected */}
          {selectedUser && (
            <button
              onClick={() => setSelectedUser(null)}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to all users
            </button>
          )}

          {/* Main Content */}
          {selectedUser ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    <AcademicCapIcon className="w-8 h-8 text-purple-600 inline-block mr-3" />
                    {selectedUser.fullName ||
                      selectedUser.firstName + " " + selectedUser.lastName}
                    's Assignments
                  </h2>
                  <p className="text-gray-500 mt-1">{selectedUser.email}</p>
                  {!instructors.some(
                    (instructor) => instructor.email === selectedUser.email
                  ) && (
                    <p className="text-sm text-yellow-600 mt-1">
                      This user is not yet an instructor. Assigning a module
                      will create an instructor record.
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Assigned Modules - only show if user is an instructor */}
              {instructors.some(
                (instructor) => instructor.email === selectedUser.email
              ) && (
                <div className="space-y-6">
                  {selectedUser.modules?.map((module) => (
                    <div
                      key={module}
                      className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <BookOpenIcon className="w-6 h-6 text-blue-500" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {module}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {getCourseNameForModule(module)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteModule(module)}
                          className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Remove Module
                        </button>
                      </div>

                      {/* Class Assignment */}
                      <div className="ml-9">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned Class
                        </label>
                        <div className="flex items-center gap-4">
                          <select
                            value={selectedUser.classes?.[module] || ""}
                            onChange={(e) =>
                              handleAssignClass(module, e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="">Select Class</option>
                            {(() => {
                              // Find the course that contains this module
                              const courseForModule = courses.find((c) =>
                                c.modules?.some((m) => m.title === module)
                              );

                              // Return groups only from this course
                              return courseForModule?.groups?.map((group) => (
                                <option
                                  key={group.groupId}
                                  value={group.groupId}
                                >
                                  {group.groupName}
                                </option>
                              ));
                            })()}
                          </select>
                          <span className="text-gray-600">
                            {getGroupNameForModule(module)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Module Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <AcademicCapIcon className="w-6 h-6 text-green-500" />
                  Assign New Module
                </h3>
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Course Dropdown */}
                  <select
                    value={selectedCourse}
                    onChange={(e) => {
                      setSelectedCourse(e.target.value);
                      setSelectedModule("");
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white min-w-[200px]"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>

                  {/* Module Dropdown */}
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white min-w-[200px]"
                    disabled={!selectedCourse}
                  >
                    <option value="">Select Module</option>
                    {selectedCourse &&
                      courses
                        .find((c) => c.id === selectedCourse)
                        ?.modules?.map((module) => (
                          <option key={module.moduleId} value={module.title}>
                            {module.title}
                          </option>
                        ))}
                  </select>

                  {/* Assign Module Button */}
                  <button
                    onClick={() => handleAssignModule(selectedModule)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center gap-2"
                  >
                    <BookOpenIcon className="w-5 h-5" />
                    Assign Module
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <UserCircleIcon className="h-10 w-10 text-gray-400" />
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
                            {instructors.some(
                              (instructor) => instructor.email === user.email
                            ) ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Instructor
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Potential Instructor
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleUserSelect(user)}
                              className="text-blue-600 hover:text-blue-900 mr-4 flex items-center"
                            >
                              <PencilSquareIcon className="w-4 h-4 mr-1" />
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          {isLoading
                            ? "Loading users..."
                            : "No users found matching your criteria"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredUsers.length > usersPerPage && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {indexOfFirstUser + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastUser, filteredUsers.length)}
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
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Previous</span>
                          <ArrowLeftIcon
                            className="h-5 w-5"
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
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Next</span>
                          <ArrowLeftIcon
                            className="h-5 w-5 transform rotate-180"
                            aria-hidden="true"
                          />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignInstructor;
