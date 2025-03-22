import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewCoursePage = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/courses/${courseId}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
      });
  }, [courseId]);

  if (!course) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-inter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Course Details</h1>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-6 py-8 sm:p-10">
            {/* Centered Course Name in Red */}
            <h2 className="text-3xl font-bold text-center text-red-600 mb-8">{course.courseName}</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Duration:</span>{" "}
                  <span className="text-gray-700 font-semibold">{course.courseDuration}</span>
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Course Fee:</span>{" "}
                  <span className="text-gray-700 font-semibold">LKR {course.courseFee}</span>
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Class:</span>{" "}
                  <span className="text-gray-700 font-semibold">{course._class}</span>
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Lecturers:</span>{" "}
                  <span className="text-gray-700 font-semibold">{course.lectures}</span>
                </p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Contact Email:</span>{" "}
                  <span className="text-gray-700 font-semibold">{course.contactMail}</span>
                </p>
              </div>
              <div>
                <p className="text-lg font-medium">
                  <span className="font-semibold text-black">Description:</span>{" "}
                  <span className="text-gray-700 font-semibold">{course.description}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCoursePage;