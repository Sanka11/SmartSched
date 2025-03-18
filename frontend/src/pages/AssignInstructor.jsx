import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, UserCircleIcon, BookOpenIcon, AcademicCapIcon, XCircleIcon } from "@heroicons/react/24/outline";

const AssignInstructor = () => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const modules = ["Math 101", "Physics 101", "Chemistry 101"];
  const classes = ["1", "2", "3"];

  // Centralized fetch function
  const fetchInstructors = () => {
    fetch("http://localhost:8080/api/instructors")
      .then((res) => res.json())
      .then((data) => setInstructors(data))
      .catch((err) => console.error("Error fetching instructors:", err));
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const filteredInstructors = instructors.filter((instructor) =>
    (`${instructor.firstName} ${instructor.lastName}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignModule = (moduleName) => {
    if (!moduleName || !selectedInstructor) return;
    fetch(`http://localhost:8080/api/instructors/${selectedInstructor.email}/assignModule/${moduleName}`, {
      method: "PUT",
    })
      .then(() => {
        fetchInstructors(); // Refetch updated data
        alert("Module assigned successfully!");
      })
      .catch((err) => console.error("Error assigning module:", err));
  };

  const handleAssignClass = (moduleName, className) => {
    if (!selectedInstructor) return;
    fetch(`http://localhost:8080/api/instructors/${selectedInstructor.email}/assignClass/${moduleName}/${className}`, {
      method: "PUT",
    })
      .then(() => {
        fetchInstructors(); // Refetch updated data
        alert("Class assigned successfully!");
      })
      .catch((err) => console.error("Error assigning class:", err));
  };

  const handleDeleteModule = (moduleName) => {
    if (!selectedInstructor) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this module and its associated class?");
    if (!isConfirmed) return;

    fetch(`http://localhost:8080/api/instructors/${selectedInstructor.email}/deleteModule/${moduleName}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchInstructors(); // Refetch updated data
        alert("Module and class deleted successfully!");
      })
      .catch((err) => console.error("Error deleting module:", err));
  };

  const handleDeleteClass = (moduleName, className) => {
    if (!selectedInstructor) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this class?");
    if (!isConfirmed) return;

    fetch(`http://localhost:8080/api/instructors/${selectedInstructor.email}/deleteClass/${moduleName}/${className}`, {
      method: "DELETE",
    })
      .then(() => {
        fetchInstructors(); // Refetch updated data
        alert("Class deleted successfully!");
      })
      .catch((err) => console.error("Error deleting class:", err));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Instructor Management
          </span>
        </h1>
        <p className="text-gray-600 text-lg">Assign modules and classes to instructors</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search instructors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Instructor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredInstructors.map((instructor) => (
          <div
            key={instructor.id}
            onClick={() => setSelectedInstructor(instructor)}
            className={`group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
              selectedInstructor?.id === instructor.id 
                ? 'border-blue-500' 
                : 'border-transparent hover:border-blue-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <UserCircleIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {instructor.firstName} {instructor.lastName}
                </h2>
                <p className="text-gray-500 text-sm">{instructor.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Instructor Section */}
      {selectedInstructor && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                <AcademicCapIcon className="w-8 h-8 text-purple-600 inline-block mr-3" />
                {selectedInstructor.firstName} {selectedInstructor.lastName}'s Assignments
              </h2>
              <p className="text-gray-500 mt-1">{selectedInstructor.email}</p>
            </div>
            <button
              onClick={() => setSelectedInstructor(null)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Assigned Modules */}
          <div className="space-y-6">
            {selectedInstructor.modules?.map((module) => (
              <div key={module} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <BookOpenIcon className="w-6 h-6 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-800">{module}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteModule(module)}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                  >
                    <XCircleIcon className="w-4 h-4" />
                    Remove Module
                  </button>
                </div>

                <div className="ml-9">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Class</label>
                  <div className="flex items-center gap-4">
                    <select
                      value={selectedInstructor.classes?.[module] || ""}
                      onChange={(e) => handleAssignClass(module, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select Class</option>
                      {classes.map((classItem) => (
                        <option key={classItem} value={classItem}>{classItem}</option>
                      ))}
                    </select>
                    {selectedInstructor.classes?.[module] && (
                      <button
                        onClick={() => handleDeleteClass(module, selectedInstructor.classes[module])}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Module Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <AcademicCapIcon className="w-6 h-6 text-green-500" />
              Assign New Module
            </h3>
            <div className="flex items-center gap-4">
              <select
                onChange={(e) => setSelectedModule(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="">Select Module to Assign</option>
                {modules.map((module) => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
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
      )}
    </div>
  </div>
);
};

export default AssignInstructor;