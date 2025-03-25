import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Fetch courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    axios
      .get("http://localhost:8080/api/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  };

  // Delete course function
  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:8080/api/courses/${courseId}`);
        alert("Course deleted successfully!");
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          All Course Schedule
        </h1>
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/add-course")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            + Add Course
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Course Name</th>
                <th className="px-6 py-4 text-left font-semibold">Duration</th>
                <th className="px-6 py-4 text-left font-semibold">Course Fee</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course) => (
                <tr
                  key={course.courseId}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-gray-700">{course.courseName}</td>
                  <td className="px-6 py-4 text-gray-700">{course.courseDuration}</td>
                  <td className="px-6 py-4 text-gray-700">LKR {course.courseFee}.00</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                    <button
                        onClick={() => navigate(`/view-course/${course.courseId}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg border border-blue-600 hover:bg-blue-600 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/update-course/${course.courseId}`)
                        }
                        className="px-4 py-2 bg-green-500 text-white rounded-lg border border-green-600 hover:bg-green-600 transition"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(course.courseId)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg border border-red-600 hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseListPage;