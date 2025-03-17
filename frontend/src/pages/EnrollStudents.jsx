import { useState } from "react";

const EnrollStudents = () => {
  // Sample data for students
  const [students, setStudents] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", courses: [1], classes: [1] },
    { id: 2, name: "Bob Smith", email: "bob@example.com", courses: [2], classes: [2] },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", courses: [], classes: [] },
  ]);

  // Sample data for courses
  const [courses, setCourses] = useState([
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Physics" },
    { id: 3, name: "Chemistry" },
  ]);

  // Sample data for classes
  const [classes, setClasses] = useState([
    { id: 1, name: "Class 1" },
    { id: 2, name: "Class 2" },
    { id: 3, name: "Class 3" },
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle student search
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle course enrollment
  const handleEnrollCourse = (courseId) => {
    if (!courseId) return;
    const updatedStudents = students.map((student) =>
      student.id === selectedStudent.id
        ? { ...student, courses: [...student.courses, Number(courseId)] }
        : student
    );
    setStudents(updatedStudents);
    alert("Course enrolled successfully!");
  };

  // Handle course removal
  const handleRemoveCourse = (courseId) => {
    const updatedStudents = students.map((student) =>
      student.id === selectedStudent.id
        ? { ...student, courses: student.courses.filter((id) => id !== courseId) }
        : student
    );
    setStudents(updatedStudents);
    alert("Course removed successfully!");
  };

  // Handle class assignment for a course
  const handleAssignClass = (courseId, classId) => {
    const updatedStudents = students.map((student) =>
      student.id === selectedStudent.id
        ? { ...student, classes: [...student.classes.filter((id) => id !== classId), Number(classId)] }
        : student
    );
    setStudents(updatedStudents);
    alert("Class assigned successfully!");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Enroll Students</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => setSelectedStudent(student)}
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
            <p className="text-gray-600">{student.email}</p>
          </div>
        ))}
      </div>

      {/* Selected Student Details */}
      {selectedStudent && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedStudent.name}'s Enrolled Courses
          </h2>

          {/* Enrolled Courses */}
          <div className="space-y-4">
            {courses
              .filter((course) => selectedStudent.courses.includes(course.id))
              .map((course) => (
                <div key={course.id} className="p-4 bg-white rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                  <div className="mt-2">
                    <label className="block text-gray-700">Assigned Class:</label>
                    <select
                      value={selectedStudent.classes.find((classId) => classId === course.id) || ""}
                      onChange={(e) => handleAssignClass(course.id, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Class</option>
                      {classes.map((classItem) => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemoveCourse(course.id)}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Remove Course
                  </button>
                </div>
              ))}
          </div>

          {/* Add Course */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Enroll in a New Course</h3>
            <select
              onChange={(e) => handleEnrollCourse(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Course</option>
              {courses
                .filter((course) => !selectedStudent.courses.includes(course.id))
                .map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollStudents;