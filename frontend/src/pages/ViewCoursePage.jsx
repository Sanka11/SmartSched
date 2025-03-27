import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [newModule, setNewModule] = useState({
    code: "",
    moduleName: "",
    moduleDescription: "",
  });
  const [editModule, setEditModule] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatedModule, setUpdatedModule] = useState({
    moduleId: "",
    code: "",
    moduleName: "",
    moduleDescription: "",
  });

  useEffect(() => {
    fetchCourse();
    fetchModules();
  }, [courseId]);

  const handleEditModule = (module) => {
    setEditModule(module);
    setUpdatedModule({
      moduleId: module.moduleId,
      code: module.code,
      moduleName: module.moduleName,
      moduleDescription: module.moduleDescription,
    });
  };

  const fetchCourse = () => {
    axios
      .get(`http://localhost:8080/api/courses/${courseId}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
      });
  };

  const fetchModules = () => {
    axios
      .get(`http://localhost:8080/api/modules/course/${courseId}`)
      .then((response) => {
        setModules(response.data);
      })
      .catch((error) => {
        console.error("Error fetching modules:", error);
      });
  };

  const handleModuleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const isDuplicate = modules.some(
      (module) => module.code === newModule.code
    );
    if (isDuplicate) {
      setError(
        "Module code already exists for this course. Please choose a different code."
      );
      return;
    }

    if (!newModule.code || !newModule.moduleName) {
      setError("Code and Module Name are required");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/modules/${courseId}`,
        newModule
      );
      setSuccess("Module added successfully!");
      setNewModule({
        code: "",
        moduleName: "",
        moduleDescription: "",
      });
      fetchModules();
      setShowAddModuleForm(false);
    } catch (err) {
      console.error("Error adding module:", err);
      setError(
        err.response?.data?.message || "Failed to add module. Please try again."
      );
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/modules/course/${courseId}/${moduleId}`
        );
        alert("Module deleted successfully!");
        fetchModules();
      } catch (error) {
        console.error("Error deleting module:", error);
      }
    }
  };

  const handleUpdateModule = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/modules/course/${courseId}/${updatedModule.moduleId}`,
        updatedModule
      );
      alert("Module updated successfully!");
      fetchModules();
      setEditModule(null);
    } catch (err) {
      console.error("Error updating module:", err);
      alert("Failed to update module!");
    }
  };

  if (!course)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
            {course.courseName}
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            {course.description}
          </p>
        </div>

        {/* Course Details Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-12">
          <div className="px-8 py-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              Course Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 font-medium w-36 flex-shrink-0">
                    Duration:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {course.courseDuration}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 font-medium w-36 flex-shrink-0">
                    Course Fee:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    LKR {course.courseFee.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 font-medium w-36 flex-shrink-0">
                    Class:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {course._class}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 font-medium w-36 flex-shrink-0">
                    Contact Email:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {course.contactMail}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-8 py-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Course Modules</h2>
              <button
                onClick={() => setShowAddModuleForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Module
              </button>
            </div>

            {/* Modules List */}
            {modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.moduleId} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold mr-3 px-2.5 py-0.5 rounded">
                            {module.code}
                          </span>
                          {module.moduleName}
                        </h3>
                        {module.moduleDescription && (
                          <p className="text-gray-600 mt-2">{module.moduleDescription}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditModule(module)}
                          className="text-yellow-600 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteModule(module.moduleId)}
                          className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No modules</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new module.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Module Modal */}
        {showAddModuleForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 py-6 sm:p-8">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">Add New Module</h3>
                  <button
                    onClick={() => {
                      setShowAddModuleForm(false);
                      setError("");
                      setSuccess("");
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                    {success}
                  </div>
                )}
                <form onSubmit={handleAddModule} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                      Module Code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="code"
                        id="code"
                        value={newModule.code}
                        onChange={handleModuleInputChange}
                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md p-2 border"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700">
                      Module Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="moduleName"
                        id="moduleName"
                        value={newModule.moduleName}
                        onChange={handleModuleInputChange}
                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md p-2 border"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="moduleDescription" className="block text-sm font-medium text-gray-700">
                      Description (Optional)
                    </label>
                    <div className="mt-1">
                      <textarea
                        name="moduleDescription"
                        id="moduleDescription"
                        value={newModule.moduleDescription}
                        onChange={handleModuleInputChange}
                        rows={3}
                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModuleForm(false);
                        setError("");
                        setSuccess("");
                      }}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Module
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Module Modal */}
        {editModule && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 py-6 sm:p-8">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">Edit Module</h3>
                  <button
                    onClick={() => setEditModule(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleUpdateModule} className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="edit-code" className="block text-sm font-medium text-gray-700">
                      Module Code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="code"
                        id="edit-code"
                        value={updatedModule.code}
                        onChange={(e) =>
                          setUpdatedModule({
                            ...updatedModule,
                            code: e.target.value,
                          })
                        }
                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md p-2 border"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-moduleName" className="block text-sm font-medium text-gray-700">
                      Module Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="moduleName"
                        id="edit-moduleName"
                        value={updatedModule.moduleName}
                        onChange={(e) =>
                          setUpdatedModule({
                            ...updatedModule,
                            moduleName: e.target.value,
                          })
                        }
                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md p-2 border"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-moduleDescription" className="block text-sm font-medium text-gray-700">
                      Description (Optional)
                    </label>
                    <div className="mt-1">
                      <textarea
                        name="moduleDescription"
                        id="edit-moduleDescription"
                        value={updatedModule.moduleDescription}
                        onChange={(e) =>
                          setUpdatedModule({
                            ...updatedModule,
                            moduleDescription: e.target.value,
                          })
                        }
                        rows={3}
                        className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md p-2 border"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditModule(null)}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCoursePage;