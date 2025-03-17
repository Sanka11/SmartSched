import { useState, useEffect } from "react";

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Assign Instructor</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search instructors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Instructor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredInstructors.map((instructor) => (
          <div
            key={instructor.id}
            onClick={() => setSelectedInstructor(instructor)}
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {instructor.firstName} {instructor.lastName}
            </h2>
            <p className="text-gray-600">{instructor.email}</p>
          </div>
        ))}
      </div>

      {/* Selected Instructor Details */}
      {selectedInstructor && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedInstructor.firstName} {selectedInstructor.lastName}'s Assigned Modules
          </h2>

          {/* Assigned Modules */}
          <div className="space-y-4">
            {selectedInstructor.modules?.map((module) => (
              <div key={module} className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">{module}</h3>
                <div className="mt-2">
                  <label className="block text-gray-700">Assigned Class:</label>
                  {/* Dropdown for Assigning a Class */}
                  <select
                    value={selectedInstructor.classes?.[module] || ""}
                    onChange={(e) => handleAssignClass(module, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map((classItem) => (
                      <option key={classItem} value={classItem}>{classItem}</option>
                    ))}
                  </select>
                </div>
                {/* Delete Module Button */}
                <button
                  onClick={() => handleDeleteModule(module)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Delete Module
                </button>
              </div>
            ))}
          </div>

          {/* Add Module */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Add Module</h3>
            {/* Dropdown for Adding a Module */}
            <select
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Module</option>
              {modules.map((module) => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
            <button
              onClick={() => handleAssignModule(selectedModule)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Assign Module
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignInstructor;
