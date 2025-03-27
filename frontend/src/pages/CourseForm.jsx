import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CourseForm = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    customCourseId: "",
    courseName: "",
    courseDuration: "",
    courseFee: "",
    lectures: "",
    contactMail: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isFocused, setIsFocused] = useState(false); // Track focus state for pop-up effect
  const [loading, setLoading] = useState(false); // Loading state for form submission

  // Fetch course details if updating
  useEffect(() => {
    if (courseId) {
      axios
        .get(`http://localhost:8080/api/courses/${courseId}`)
        .then((response) => {
          setCourse(response.data);
        })
        .catch((error) => console.error("Error fetching course:", error));
    }
  }, [courseId]);

  // Handle form input changes
  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  // Validate form inputs
  const validate = () => {
    let formErrors = {};

    if (!/^[0-9]+$/.test(course.courseFee) || parseInt(course.courseFee) <= 0) {
      formErrors.courseFee = "Course fee should be a positive integer.";
    }

    if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(course.contactMail)) {
      formErrors.contactMail = "Please enter a valid email address.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true); // Set loading to true
    try {
      // Skip customCourseId validation for update, only check for new courses
      if (!courseId) {
        const existingCourse = await axios.get(
          `http://localhost:8080/api/courses/custom/${course.customCourseId}`
        );

        if (existingCourse.data) {
          // If a course with the same customCourseId exists, show error message
          alert(
            "A course with this Custom Course ID already exists. Please choose a different ID."
          );
          return;
        }
      }

      // Proceed with creating or updating the course
      if (courseId) {
        await axios.put(
          `http://localhost:8080/api/courses/${courseId}`,
          course
        );
        alert("Course updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/courses", course);
        alert("Course created successfully!");
      }

      navigate("/courses");
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Error saving course. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  // Handle focus and blur events for pop-up effect
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="min-h-screen flex items-center justify-end p-8">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">
            {courseId ? (
              "Update Course"
            ) : (
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                Create New Course
              </span>
            )}
          </h2>
          <p className="text-gray-600 mt-2">
            {courseId
              ? "Edit the course details below."
              : "Fill in the details to create a new course."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Custom Course ID (read-only for updates) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Course ID
              </label>
              <input
                type="text"
                name="customCourseId"
                placeholder="Enter custom course ID"
                value={course.customCourseId || ""}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border ${
                  errors.courseFee ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-transform bg-blue-50 ${
                  isFocused ? "scale-105" : "scale-100"
                }`}
                required
                disabled={!!courseId} // Disable if updating
              />
            </div>
            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name
              </label>
              <input
                type="text"
                name="courseName"
                placeholder="Enter course name"
                value={course.courseName}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-transform bg-blue-50 ${
                  isFocused ? "scale-105" : "scale-100"
                }`}
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="courseDuration"
                placeholder="Enter course duration"
                value={course.courseDuration}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-transform bg-blue-50 ${
                  isFocused ? "scale-105" : "scale-100"
                }`}
                required
              />
            </div>

            {/* Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Fee
              </label>
              <input
                type="number"
                name="courseFee"
                placeholder="Enter course fee"
                value={course.courseFee}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-transform bg-blue-50 ${
                  isFocused ? "scale-105" : "scale-100"
                }`}
                required
              />
              {errors.courseFee && (
                <p className="text-sm text-red-500 mt-1">{errors.courseFee}</p>
              )}
            </div>

            {/* Number of Lectures */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Lectures
              </label>
              <input
                type="text"
                name="lectures"
                placeholder="Enter number of lectures"
                value={course.lectures}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-transform bg-blue-50 ${
                  isFocused ? "scale-105" : "scale-100"
                }`}
                required
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contactMail"
                placeholder="Enter contact email"
                value={course.contactMail}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-transform bg-blue-50 ${
                  isFocused ? "scale-105" : "scale-100"
                }`}
                required
              />
              {errors.contactMail && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.contactMail}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter course description"
                value={course.description}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-transform bg-blue-50 ${
                  isFocused ? "scale-105" : "scale-100"
                }`}
                rows="4"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : courseId
                  ? "Update Course"
                  : "Create Course"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;