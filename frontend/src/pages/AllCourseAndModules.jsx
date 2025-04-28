import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiClock,
  FiSearch,
  FiDollarSign,
  FiBook,
  FiUsers,
} from "react-icons/fi";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AllCourseAndModules() {
  // State management
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState({
    id: "",
    name: "",
    description: "",
    courseFee: "",
    courseDuration: "",
    contactEmail: "",
    modules: [],
    groups: [],
  });
  const [newModule, setNewModule] = useState({ title: "", description: "" });
  const [newGroup, setNewGroup] = useState({ groupName: "" });
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Course Report", 14, 22);

    const tableColumn = [
      "Course Name",
      "Course Fee",
      "Duration",
      "Contact Email",
    ];
    const tableRows = [];

    courses.forEach((course) => {
      const rowData = [
        course.name,
        `Rs ${course.courseFee}`,
        `${course.courseDuration} months`,
        course.contactEmail,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        fontSize: 10,
        cellPadding: 5,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(`Course_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("Report generated successfully!");
  };

  // Fetch courses function
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8080/api/allcourses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handler functions
  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;

    if (name === "courseDuration") {
      if (value === "" || (value.length <= 2 && /^\d*$/.test(value))) {
        setter((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    setter((prev) => ({ ...prev, [name]: value }));
  };

  const addListItem = (item, setItem, listName) => {
    if (!item[Object.keys(item)[0]]) {
      toast.warning(
        `Please enter a ${
          listName === "modules" ? "module title" : "group name"
        }`
      );
      return;
    }

    const newItem = {
      [`${listName.slice(0, -1)}Id`]: Date.now().toString(),
      ...item,
    };

    setCourse((prev) => ({
      ...prev,
      [listName]: [...prev[listName], newItem],
    }));
    setItem(
      listName === "modules"
        ? { title: "", description: "" }
        : { groupName: "" }
    );
    toast.success(
      `${listName === "modules" ? "Module" : "Group"} added successfully`
    );
  };

  const removeListItem = (index, listName) => {
    setCourse((prev) => {
      const updatedList = [...prev[listName]];
      updatedList.splice(index, 1);
      return { ...prev, [listName]: updatedList };
    });
    toast.info(`${listName === "modules" ? "Module" : "Group"} removed`);
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate course form
  const validateCourseForm = () => {
    if (!course.name) {
      setError("Course name is required");
      toast.error("Course name is required");
      return false;
    }
    if (
      !course.courseFee ||
      isNaN(course.courseFee) ||
      parseFloat(course.courseFee) <= 0
    ) {
      setError("Please enter a valid course fee");
      toast.error("Please enter a valid course fee");
      return false;
    }
    if (
      !course.courseDuration ||
      course.courseDuration.length > 2 ||
      isNaN(course.courseDuration) ||
      parseInt(course.courseDuration) <= 0
    ) {
      setError("Please enter a valid duration (1-99 months)");
      toast.error("Please enter a valid duration (1-99 months)");
      return false;
    }
    if (!course.contactEmail || !validateEmail(course.contactEmail)) {
      setError("Please enter a valid contact email");
      toast.error("Please enter a valid contact email");
      return false;
    }
    if (!course.description) {
      setError("Course description is required");
      toast.error("Course description is required");
      return false;
    }
    return true;
  };

  // Course CRUD operations
  const submitCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateCourseForm()) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token"); // <--- GET TOKEN FROM LOCAL STORAGE

    try {
      if (editingCourseId) {
        await axios.put(
          `http://localhost:8080/api/allcourses/${editingCourseId}`,
          { ...course, id: editingCourseId },
          {
            headers: { Authorization: `Bearer ${token}` }, // <--- ADD TOKEN HERE
          }
        );
        toast.success("Course updated successfully!");
      } else {
        const { id, ...newCourse } = course;
        await axios.post("http://localhost:8080/api/allcourses", newCourse, {
          headers: { Authorization: `Bearer ${token}` }, // <--- ADD TOKEN HERE TOO
        });
        toast.success("Course created successfully!");
      }
      await fetchCourses();
      resetForm();
      setIsFormOpen(false);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to save course";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error saving course:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!courseId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    setError(null);

    const token = localStorage.getItem("token"); // ✅ GET token first

    try {
      await axios.delete(`http://localhost:8080/api/allcourses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token here!
        },
      });

      // Update UI immediately
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      toast.success("Course deleted successfully");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete course";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error deleting course:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper functions
  const editCourse = (courseToEdit) => {
    if (!courseToEdit?.id) {
      setError("Invalid course data");
      toast.error("Invalid course data");
      return;
    }

    setCourse({
      ...courseToEdit,
      id: courseToEdit.id,
      modules: [...(courseToEdit.modules || [])],
      groups: [...(courseToEdit.groups || [])],
    });
    setEditingCourseId(courseToEdit.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Editing course...");
  };

  const resetForm = () => {
    setCourse({
      id: "",
      name: "",
      description: "",
      courseFee: "",
      courseDuration: "",
      contactEmail: "",
      modules: [],
      groups: [],
    });
    setEditingCourseId(null);
    setError(null);
  };

  const toggleCourseExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // Filter and render
  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
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

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800">
              Course Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all courses, modules, and student groups
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FiPlus className="text-lg" />
              <span>Add Course</span>
            </button>

            <button
              onClick={generateReport}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg shadow-md hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FiBook className="text-lg" />
              <span>Generate Report</span>
            </button>
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

        {/* Course Form */}
        {isFormOpen && (
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8 animate-fade-in border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingCourseId ? "✏️ Edit Course" : "➕ Add New Course"}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={submitCourse} className="space-y-6">
              {/* Course Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={course.name}
                    onChange={(e) => handleInputChange(e, setCourse)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="e.g., Advanced Web Development"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Course Fee (Rs) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiDollarSign className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="courseFee"
                      value={course.courseFee}
                      onChange={(e) => handleInputChange(e, setCourse)}
                      required
                      min="0"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="e.g., 50000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (Months) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="courseDuration"
                      value={course.courseDuration}
                      onChange={(e) => handleInputChange(e, setCourse)}
                      required
                      maxLength={2}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="e.g., 6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="contactEmail"
                      value={course.contactEmail}
                      onChange={(e) => handleInputChange(e, setCourse)}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={course.description}
                    onChange={(e) => handleInputChange(e, setCourse)}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Brief description of the course content and objectives..."
                  />
                </div>
              </div>

              {/* Modules Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
                    <FiBook className="text-indigo-600" />
                    <span>Course Modules</span>
                  </h3>
                  <span className="text-sm text-gray-500">
                    {course.modules.length} added
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {["title", "description"].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field === "title" ? "Module Title" : "Description"}
                        {field === "title" && (
                          <span className="text-red-500"> *</span>
                        )}
                      </label>
                      <input
                        type="text"
                        name={field}
                        value={newModule[field]}
                        onChange={(e) => handleInputChange(e, setNewModule)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder={
                          field === "title"
                            ? "e.g., React Fundamentals"
                            : "Brief module description (optional)"
                        }
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      addListItem(newModule, setNewModule, "modules")
                    }
                    disabled={!newModule.title}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                  >
                    <FiPlus /> Add Module
                  </button>
                </div>

                {course.modules.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                              Module
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                              Description
                            </th>
                            <th scope="col" className="relative py-3 pl-3 pr-4">
                              <span className="sr-only">Remove</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {course.modules.map((module, index) => (
                            <tr key={module.moduleId}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                {module.title}
                              </td>
                              <td className="whitespace-pre-wrap px-3 py-4 text-sm text-gray-500">
                                {module.description || "-"}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeListItem(index, "modules")
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Groups Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
                    <FiUsers className="text-indigo-600" />
                    <span>Student Groups</span>
                  </h3>
                  <span className="text-sm text-gray-500">
                    {course.groups.length} added
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Group Name
                    </label>
                    <input
                      type="text"
                      name="groupName"
                      value={newGroup.groupName}
                      onChange={(e) => handleInputChange(e, setNewGroup)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="e.g., Group A, Cohort 2023"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => addListItem(newGroup, setNewGroup, "groups")}
                    disabled={!newGroup.groupName}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
                  >
                    <FiPlus /> Add Group
                  </button>
                </div>

                {course.groups.length > 0 && (
                  <div className="mt-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {course.groups.map((group, index) => (
                        <li
                          key={group.groupId}
                          className="col-span-1 flex rounded-md shadow-sm"
                        >
                          <div className="flex flex-1 items-center justify-between truncate rounded-md border border-gray-200 bg-white">
                            <div className="flex-1 truncate px-4 py-3 text-sm">
                              <span className="font-medium text-gray-900 hover:text-gray-600">
                                {group.groupName}
                              </span>
                            </div>
                            <div className="flex-shrink-0 pr-2">
                              <button
                                type="button"
                                onClick={() => removeListItem(index, "groups")}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                <FiX className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                  className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : editingCourseId ? (
                    "Update Course"
                  ) : (
                    "Create Course"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  All Courses
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredCourses.length}{" "}
                  {filteredCourses.length === 1 ? "course" : "courses"} found
                </p>
              </div>

              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
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
                {searchTerm ? "No courses found" : "No courses added yet"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Get started by adding your first course."}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                    Add Course
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCourses.map((courseItem) => (
                <div
                  key={courseItem.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="flex justify-between items-start p-6 cursor-pointer"
                    onClick={() => toggleCourseExpand(courseItem.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {courseItem.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {courseItem.courseDuration} months
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {courseItem.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiDollarSign className="mr-1.5 flex-shrink-0 text-gray-400" />
                          <span>Rs {courseItem.courseFee}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiMail className="mr-1.5 flex-shrink-0 text-gray-400" />
                          <span>{courseItem.contactEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          editCourse(courseItem);
                        }}
                        className="p-2 text-indigo-600 hover:text-indigo-900 rounded-full hover:bg-indigo-50 transition-colors"
                        aria-label="Edit course"
                        title="Edit course"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCourse(courseItem.id);
                        }}
                        disabled={isDeleting}
                        className={`p-2 rounded-full transition-colors ${
                          isDeleting
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:text-red-900 hover:bg-red-50"
                        }`}
                        aria-label="Delete course"
                        title="Delete course"
                      >
                        <FiTrash2 />
                      </button>
                      {expandedCourse === courseItem.id ? (
                        <FiChevronUp className="text-gray-500 ml-2" />
                      ) : (
                        <FiChevronDown className="text-gray-500 ml-2" />
                      )}
                    </div>
                  </div>

                  {expandedCourse === courseItem.id && (
                    <div className="px-6 pb-6 pt-2 bg-gray-50 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Modules Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-700 flex items-center gap-2">
                              <FiBook className="text-indigo-600" />
                              <span>Modules</span>
                            </h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {courseItem.modules?.length || 0} modules
                            </span>
                          </div>

                          {courseItem.modules?.length > 0 ? (
                            <ul className="space-y-3">
                              {courseItem.modules.map((module) => (
                                <li
                                  key={`${courseItem.id}-module-${module.moduleId}`}
                                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                                >
                                  <h5 className="font-medium text-gray-900">
                                    {module.title}
                                  </h5>
                                  {module.description && (
                                    <p className="mt-1 text-sm text-gray-600">
                                      {module.description}
                                    </p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
                              No modules added to this course
                            </div>
                          )}
                        </div>

                        {/* Groups Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-700 flex items-center gap-2">
                              <FiUsers className="text-indigo-600" />
                              <span>Student Groups</span>
                            </h4>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {courseItem.groups?.length || 0} groups
                            </span>
                          </div>

                          {courseItem.groups?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {courseItem.groups.map((group) => (
                                <div
                                  key={`${courseItem.id}-group-${group.groupId}`}
                                  className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
                                >
                                  <span className="font-medium text-gray-800">
                                    {group.groupName}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
                              No student groups assigned
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
  );
}

export default AllCourseAndModules;
