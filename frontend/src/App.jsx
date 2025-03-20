import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";  // Create LoginPage later
import AssignmentDashboard from "./pages/AssignmentDashboard"; // Create AssignmentDashboard later
import AssignInstructor from "./pages/AssignInstructor"; // Create AssignInstructor later
import EnrollStudents from "./pages/EnrollStudents";

import CourseListPage from "./pages/CourseList";  //create CourseListPage
import CourseFormPage from "./pages/CourseForm"; // create CourseFormPage

import RegisterPage from "./pages/RegisterPage"; // Create RegisterPage later
import UserManagerPage from "./pages/UserManagerPage";
import GenerateReportAssignManager from "./pages/GenerateReportAssignManager";
import CourseClassesPage from "./pages/CourseClassesPage";






function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />  {/* Default Landing Page */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/assignmentdashboard" element={<AssignmentDashboard />} />
      <Route path="/assign-instructors" element={<AssignInstructor />} />
      <Route path="/enroll-students" element={<EnrollStudents />} />
      <Route path="/courses" element={<CourseListPage />} />
      <Route path="/add-course" element={<CourseFormPage />} />
      <Route path="/edit-course/:id" element={<CourseFormPage />} />
      <Route path="/user-manager" element={<UserManagerPage />} />
      <Route path="/generate-reports-assign" element={<GenerateReportAssignManager />} />
      <Route path="/class-assign" element={<CourseClassesPage />} />

    </Routes>
  );
}

export default App;
