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
  const [editModule, setEditModule] = useState(null); // Consolidating to a single state for editing
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
    setEditModule(module); // Set the module to be edited
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

    // Check if module code already exists
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
      fetchModules(); // Refresh the modules list
      setShowAddModuleForm(false); // Hide the form after successful submission
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
        fetchModules(); // Refresh the modules list after deletion
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
      fetchModules(); // Refresh the list of modules
      setEditModule(null); // Close the edit form after successful update
    } catch (err) {
      console.error("Error updating module:", err);
      alert("Failed to update module!");
    }
  };

  if (!course)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-inter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Course Details
        </h1>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
              {course.courseName}
            </h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Duration:</span>{" "}
                  <span className="text-gray-700 font-semibold">
                    {course.courseDuration}
                  </span>
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Course Fee:</span>{" "}
                  <span className="text-gray-700 font-semibold">
                    LKR {course.courseFee}
                  </span>
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Class:</span>{" "}
                  <span className="text-gray-700 font-semibold">
                    {course._class}
                  </span>
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Lecturers:</span>{" "}
                  <span className="text-gray-700 font-semibold">
                    {course.lectures}
                  </span>
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">
                    Contact Email:
                  </span>{" "}
                  <span className="text-gray-700 font-semibold">
                    {course.contactMail}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Description:</span>{" "}
                  <span className="text-gray-700 font-semibold">
                    {course.description}
                  </span>
                </p>
              </div>
            </div>

            {/* Modules Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Modules</h3>

              {modules.length > 0 ? (
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div
                      key={module.moduleId}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h4 className="font-bold text-lg">{module.moduleName}</h4>
                      <p className="text-gray-600">{module.code}</p>
                      {module.moduleDescription && (
                        <p className="text-gray-700 mt-2">
                          {module.moduleDescription}
                        </p>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteModule(module.moduleId)} // Use module.moduleId here
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      >
                        Delete Module
                      </button>

                      {/* Update Button */}
                      <button
                        onClick={() => handleEditModule(module)} // Pass the whole module to edit
                        className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 ml-2"
                      >
                        Update Module
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No modules added yet.</p>
              )}

              {/* Add Module Button and Form */}
              <div className="mt-8">
                {!showAddModuleForm ? (
                  <button
                    onClick={() => setShowAddModuleForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                  >
                    Add Module
                  </button>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg mt-4">
                    <h4 className="text-xl font-bold mb-4">Add New Module</h4>
                    {error && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                        {success}
                      </div>
                    )}
                    <form onSubmit={handleAddModule}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Module Code
                        </label>
                        <input
                          type="text"
                          name="code"
                          value={newModule.code}
                          onChange={handleModuleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Module Name
                        </label>
                        <input
                          type="text"
                          name="moduleName"
                          value={newModule.moduleName}
                          onChange={handleModuleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (Optional)
                        </label>
                        <textarea
                          name="moduleDescription"
                          value={newModule.moduleDescription}
                          onChange={handleModuleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows="3"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Save Module
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddModuleForm(false);
                            setError("");
                            setSuccess("");
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Module Form */}
            {editModule && (
              <div className="bg-gray-50 p-6 rounded-lg mt-4">
                <h4 className="text-xl font-bold mb-4">Edit Module</h4>
                <form onSubmit={handleUpdateModule}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Module Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={updatedModule.code}
                      onChange={(e) =>
                        setUpdatedModule({
                          ...updatedModule,
                          code: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Module Name
                    </label>
                    <input
                      type="text"
                      name="moduleName"
                      value={updatedModule.moduleName}
                      onChange={(e) =>
                        setUpdatedModule({
                          ...updatedModule,
                          moduleName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Module Description (Optional)
                    </label>
                    <textarea
                      name="moduleDescription"
                      value={updatedModule.moduleDescription}
                      onChange={(e) =>
                        setUpdatedModule({
                          ...updatedModule,
                          moduleDescription: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="3"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditModule(null)} // Close the form
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCoursePage;