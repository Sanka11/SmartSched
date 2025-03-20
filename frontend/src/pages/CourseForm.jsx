/* import { useState, useEffect } from "react";
import { createCourse, updateCourse } from "../services/api"; // Assuming you have these functions in api.js */
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const CourseForm = ({ courseToEdit, onFormSubmit }) => {
    const [course, setCourse] = useState({
        courseId: "",
        courseName: "",
        courseDuration: "",
        courseFee: "",
        lectures: "",
        contactMail: "",
        description: ""
    });
    
    const [error, setError] = useState(null); // State to store errors
    const [loading, setLoading] = useState(false); // State to manage loading state

    useEffect(() => {
        if (courseToEdit) {
            setCourse(courseToEdit);
        }
    }, [courseToEdit]);

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Reset error state on new submission
        setLoading(true); // Set loading to true before making the API call

        try {
            if (course.courseId) {
                await updateCourse(course.courseId, course);
            } else {
                await createCourse(course);
            }
            setLoading(false); // Set loading to false once the API request is completed
            onFormSubmit(); // Notify the parent component about the submission
            setCourse({ // Optionally reset form after submission
                courseId: "",
                courseName: "",
                courseDuration: "",
                courseFee: "",
                lectures: "",
                contactMail: "",
                description: ""
            });
        } catch (error) {
            setLoading(false); // Stop loading on error
            setError(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{course.courseId ? "Edit Course" : "Add Course"}</h2>
            <input
                type="text"
                name="courseId"
                placeholder="Course ID"
                value={course.courseId}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="courseName"
                placeholder="Course Name"
                value={course.courseName}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="courseDuration"
                placeholder="Course Duration"
                value={course.courseDuration}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="courseFee"
                placeholder="Course Fee"
                value={course.courseFee}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="lectures"
                placeholder="Lectures"
                value={course.lectures}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="contactMail"
                placeholder="Contact Email"
                value={course.contactMail}
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="Description"
                value={course.description}
                onChange={handleChange}
                required
            ></textarea>
            <button type="submit" disabled={loading}>
                {loading ? "Saving..." : course.courseId ? "Update Course" : "Add Course"}
            </button>
            {error && <p className="error">{error}</p>} {/* Display error message */}
        </form>
    );
};

export default CourseForm;
