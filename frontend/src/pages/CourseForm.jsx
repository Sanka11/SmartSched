import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CourseForm = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    courseName: "",
    courseDuration: "",
    courseFee: "",
    lectures: "",
    contactMail: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

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

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">
            {courseId ? "Update Course" : "Create Course"}
          </h2>
          <p className="text-gray-600 mt-2">
            {courseId
              ? "Edit the course details below."
              : "Fill in the details to create a new course."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee
              </label>
              <input
                type="number"
                name="courseFee"
                placeholder="Enter course fee"
                value={course.courseFee}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
              {errors.contactMail && (
                <p className="text-sm text-red-500 mt-1">{errors.contactMail}</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows="4"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {courseId ? "Update Course" : "Create Course"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;