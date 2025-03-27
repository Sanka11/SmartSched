import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiSave, FiArrowLeft } from "react-icons/fi";

const CourseForm = () => {
  const { courseId } = useParams();
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
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

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

    setLoading(true);
    try {
      if (!courseId) {
        const existingCourse = await axios.get(
          `http://localhost:8080/api/courses/custom/${course.customCourseId}`
        );
        if (existingCourse.data) {
          alert("A course with this Custom Course ID already exists.");
          return;
        }
      }

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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 overflow-hidden">
      {/* Header Section */}
      <header className="py-8 text-center bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">
            {courseId ? "Update Course" : "Create New Course"}
          </h1>
          <p className="text-gray-400">
            {courseId
              ? "Edit the course details below"
              : "Fill in the details to create a new course"}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-8">
            <button
              onClick={() => navigate("/courses")}
              className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition"
            >
              <FiArrowLeft className="mr-2" />
              Back to Courses
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Custom Course ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Custom Course ID
                  </label>
                  <input
                    type="text"
                    name="customCourseId"
                    value={course.customCourseId || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border ${
                      errors.customCourseId
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white`}
                    required
                    disabled={!!courseId}
                    placeholder="C001"
                  />
                </div>

                {/* Course Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={course.courseName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                    placeholder="Advanced Web Development"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="courseDuration"
                    value={course.courseDuration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                    placeholder="3 months"
                  />
                </div>

                {/* Course Fee */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Course Fee (LKR)
                  </label>
                  <input
                    type="number"
                    name="courseFee"
                    value={course.courseFee}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border ${
                      errors.courseFee ? "border-red-500" : "border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white`}
                    required
                    placeholder="25000"
                  />
                  {errors.courseFee && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.courseFee}
                    </p>
                  )}
                </div>

                {/* Number of Lectures */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Leacture In Charge
                  </label>
                  <input
                    type="text"
                    name="lectures"
                    value={course.lectures}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                    placeholder="12"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactMail"
                    value={course.contactMail}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border ${
                      errors.contactMail ? "border-red-500" : "border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white`}
                    required
                    placeholder="contact@example.com"
                  />
                  {errors.contactMail && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.contactMail}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={course.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  rows="5"
                  required
                  placeholder="Enter detailed course description..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <FiSave className="mr-2" />
                  {loading
                    ? courseId
                      ? "Updating..."
                      : "Creating..."
                    : courseId
                    ? "Update Course"
                    : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;