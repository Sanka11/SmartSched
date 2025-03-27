import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiPlus, FiX } from "react-icons/fi";
import { FaTrashAlt, FaEdit, FaGraduationCap, FaUsers } from "react-icons/fa";

const ViewCoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  // Module states
  const [modules, setModules] = useState([]);
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [newModule, setNewModule] = useState({
    code: "",
    moduleName: "",
    moduleDescription: "",
  });
  const [editModule, setEditModule] = useState(null);
  const [moduleError, setModuleError] = useState("");
  const [moduleSuccess, setModuleSuccess] = useState("");
  const [updatedModule, setUpdatedModule] = useState({
    moduleId: "",
    code: "",
    moduleName: "",
    moduleDescription: "",
  });

  // Group states
  const [groups, setGroups] = useState([]);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    groupName: "",
  });
  const [editGroup, setEditGroup] = useState(null);
  const [groupError, setGroupError] = useState("");
  const [groupSuccess, setGroupSuccess] = useState("");
  const [updatedGroup, setUpdatedGroup] = useState({
    groupId: "",
    groupName: "",
  });

  useEffect(() => {
    fetchCourse();
    fetchModules();
    fetchGroups();
  }, [courseId]);

  // Module functions
  const handleEditModule = (module) => {
    setEditModule(module);
    setUpdatedModule({
      moduleId: module.moduleId,
      code: module.code,
      moduleName: module.moduleName,
      moduleDescription: module.moduleDescription,
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
    setModuleError("");
    setModuleSuccess("");

    const isDuplicate = modules.some(
      (module) => module.code === newModule.code
    );
    if (isDuplicate) {
      setModuleError(
        "Module code already exists for this course. Please choose a different code."
      );
      return;
    }

    if (!newModule.code || !newModule.moduleName) {
      setModuleError("Code and Module Name are required");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/modules/${courseId}`,
        newModule
      );
      setModuleSuccess("Module added successfully!");
      setNewModule({
        code: "",
        moduleName: "",
        moduleDescription: "",
      });
      fetchModules();
      setShowAddModuleForm(false);
    } catch (err) {
      console.error("Error adding module:", err);
      setModuleError(
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

  // Group functions
  const handleEditGroup = (group) => {
    setEditGroup(group);
    setUpdatedGroup({
      groupId: group.groupId,
      groupName: group.groupName,
    });
  };

  const fetchGroups = () => {
    axios
      .get(`http://localhost:8080/api/groups/course/${courseId}`)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
  };

  const handleGroupInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddGroup = async (e) => {
    e.preventDefault();
    setGroupError("");
    setGroupSuccess("");

    const isDuplicate = groups.some(
      (group) => group.groupName === newGroup.groupName
    );
    if (isDuplicate) {
      setGroupError(
        "Group name already exists for this course. Please choose a different name."
      );
      return;
    }

    if (!newGroup.groupName) {
      setGroupError("Group Name is required");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/groups/${courseId}`,
        newGroup
      );
      setGroupSuccess("Group added successfully!");
      setNewGroup({
        groupName: "",
      });
      fetchGroups();
      setShowAddGroupForm(false);
    } catch (err) {
      console.error("Error adding group:", err);
      setGroupError(
        err.response?.data?.message || "Failed to add group. Please try again."
      );
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await axios.delete(
          `http://localhost:8080/api/groups/course/${courseId}/${groupId}`
        );
        alert("Group deleted successfully!");
        fetchGroups();
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/groups/course/${courseId}/${updatedGroup.groupId}`,
        updatedGroup
      );
      alert("Group updated successfully!");
      fetchGroups();
      setEditGroup(null);
    } catch (err) {
      console.error("Error updating group:", err);
      alert("Failed to update group!");
    }
  };

  // Common functions
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

  if (!course)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 overflow-hidden">
      {/* Header Section */}
      <header className="py-12 text-center bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <FaGraduationCap className="text-5xl text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4 text-white">Course Details</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            View and manage all course modules and groups
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Details Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 mb-8 overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
              {course.courseName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-4">
                  <p className="text-lg">
                    <span className="font-semibold text-gray-300">
                      Duration:
                    </span>{" "}
                    <span className="text-gray-200">
                      {course.courseDuration}
                    </span>
                  </p>
                </div>
                <div className="border-b border-gray-700 pb-4">
                  <p className="text-lg">
                    <span className="font-semibold text-gray-300">Fee:</span>{" "}
                    <span className="text-gray-200">
                      LKR {course.courseFee}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-4">
                  <p className="text-lg">
                    <span className="font-semibold text-gray-300">
                      Lecturers:
                    </span>{" "}
                    <span className="text-gray-200">{course.lectures}</span>
                  </p>
                </div>
                <div className="border-b border-gray-700 pb-4">
                  <p className="text-lg">
                    <span className="font-semibold text-gray-300">
                      Contact Email:
                    </span>{" "}
                    <span className="text-gray-200">{course.contactMail}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Description
              </h3>
              <p className="text-gray-300">{course.description}</p>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-200">Modules</h3>
            {!showAddModuleForm && (
              <button
                onClick={() => setShowAddModuleForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition group"
              >
                <FiPlus className="mr-2 group-hover:rotate-90 transition-transform" />
                Add Module
              </button>
            )}
          </div>

          {/* Add Module Form */}
          {showAddModuleForm && (
            <div className="bg-gray-700/50 p-6 rounded-lg mb-8 border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-gray-200">
                  Add New Module
                </h4>
                <button
                  onClick={() => {
                    setShowAddModuleForm(false);
                    setModuleError("");
                    setModuleSuccess("");
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              {moduleError && (
                <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
                  {moduleError}
                </div>
              )}
              {moduleSuccess && (
                <div className="mb-4 p-3 bg-green-900/50 text-green-200 rounded-lg border border-green-700">
                  {moduleSuccess}
                </div>
              )}

              <form onSubmit={handleAddModule}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Module Code*
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={newModule.code}
                      onChange={handleModuleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Module Name*
                    </label>
                    <input
                      type="text"
                      name="moduleName"
                      value={newModule.moduleName}
                      onChange={handleModuleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    name="moduleDescription"
                    value={newModule.moduleDescription}
                    onChange={handleModuleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Module
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModuleForm(false);
                      setModuleError("");
                      setModuleSuccess("");
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modules List */}
          {modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module) => (
                <div
                  key={module.moduleId}
                  className="bg-gray-700/30 p-6 rounded-lg border border-gray-600 hover:border-gray-500 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold text-blue-400 mb-1">
                        {module.moduleName}
                      </h4>
                      <p className="text-gray-400 mb-2">{module.code}</p>
                      {module.moduleDescription && (
                        <p className="text-gray-300 mt-2">
                          {module.moduleDescription}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditModule(module)}
                        className="p-2 bg-amber-600/90 text-white rounded-lg hover:bg-amber-700 transition group/action"
                      >
                        <FaEdit className="group-hover/action:animate-bounce" />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.moduleId)}
                        className="p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-700 transition group/action"
                      >
                        <FaTrashAlt className="group-hover/action:animate-pulse" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaGraduationCap className="text-4xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No modules added yet.</p>
            </div>
          )}
        </div>

        {/* Groups Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-200">Groups</h3>
            {!showAddGroupForm && (
              <button
                onClick={() => setShowAddGroupForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition group"
              >
                <FiPlus className="mr-2 group-hover:rotate-90 transition-transform" />
                Add Group
              </button>
            )}
          </div>

          {/* Add Group Form */}
          {showAddGroupForm && (
            <div className="bg-gray-700/50 p-6 rounded-lg mb-8 border border-gray-600">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-gray-200">
                  Add New Group
                </h4>
                <button
                  onClick={() => {
                    setShowAddGroupForm(false);
                    setGroupError("");
                    setGroupSuccess("");
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              {groupError && (
                <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
                  {groupError}
                </div>
              )}
              {groupSuccess && (
                <div className="mb-4 p-3 bg-green-900/50 text-green-200 rounded-lg border border-green-700">
                  {groupSuccess}
                </div>
              )}

              <form onSubmit={handleAddGroup}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Group Name*
                  </label>
                  <input
                    type="text"
                    name="groupName"
                    value={newGroup.groupName}
                    onChange={handleGroupInputChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Group
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddGroupForm(false);
                      setGroupError("");
                      setGroupSuccess("");
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Groups List */}
          {groups.length > 0 ? (
            <div className="space-y-4">
              {groups.map((group) => (
                <div
                  key={group.groupId}
                  className="bg-gray-700/30 p-6 rounded-lg border border-gray-600 hover:border-gray-500 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <FaUsers className="text-blue-400 mr-3 text-xl" />
                      <div>
                        <h4 className="text-xl font-bold text-white">
                          {group.groupName}
                        </h4>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="p-2 bg-amber-600/90 text-white rounded-lg hover:bg-amber-700 transition group/action"
                      >
                        <FaEdit className="group-hover/action:animate-bounce" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.groupId)}
                        className="p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-700 transition group/action"
                      >
                        <FaTrashAlt className="group-hover/action:animate-pulse" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaUsers className="text-4xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No groups added yet.</p>
            </div>
          )}
        </div>

        {/* Edit Module Form */}
        {editModule && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 max-w-2xl w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Edit Module</h3>
                <button
                  onClick={() => setEditModule(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateModule}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
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
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
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
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Module Description
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
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    rows="4"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditModule(null)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Group Form */}
        {editGroup && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 max-w-2xl w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Edit Group</h3>
                <button
                  onClick={() => setEditGroup(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateGroup}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    name="groupName"
                    value={updatedGroup.groupName}
                    onChange={(e) =>
                      setUpdatedGroup({
                        ...updatedGroup,
                        groupName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditGroup(null)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCoursePage;