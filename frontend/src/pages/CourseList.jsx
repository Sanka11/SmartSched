import React, { useState, useEffect } from "react";
import axios from "axios";

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);

  // Fetch courses when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/courses") // Replace with your backend URL if needed
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses!", error);
      });
  }, []);

  return (
    <div>
      <h1>Course List</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.courseId}>
            <h2>{course.courseName}</h2>
            <p>{course.courseDuration}</p>
            <p>{course.courseFee}</p>
            <p>{course.lectures}</p>
            <p>{course.contactMail}</p>
            <p>{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseListPage;
