import { useState, useEffect } from "react";
import { createCourse, updateCourse } from "../services/api";


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
        if (course.courseId) {
            await updateCourse(course.courseId, course);
        } else {
            await createCourse(course);
        }
        onFormSubmit();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{course.courseId ? "Edit Course" : "Add Course"}</h2>
            <input type="text" name="courseId" placeholder="Course ID" value={course.courseId} onChange={handleChange} required />
            <input type="text" name="courseName" placeholder="Course Name" value={course.courseName} onChange={handleChange} required />
            <input type="text" name="courseDuration" placeholder="Course Duration" value={course.courseDuration} onChange={handleChange} required />
            <input type="number" name="courseFee" placeholder="Course Fee" value={course.courseFee} onChange={handleChange} required />
            <input type="text" name="lectures" placeholder="Lectures" value={course.lectures} onChange={handleChange} required />
            <input type="email" name="contactMail" placeholder="Contact Email" value={course.contactMail} onChange={handleChange} required />
            <textarea name="description" placeholder="Description" value={course.description} onChange={handleChange} required></textarea>
            <button type="submit">{course.courseId ? "Update Course" : "Add Course"}</button>
        </form>
    );
};

export default CourseForm;
