import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AssignmentDashboard from "./pages/AssignmentDashboard";
import AssignInstructor from "./pages/AssignInstructor";
import EnrollStudents from "./pages/EnrollStudents";
import RegisterPage from "./pages/RegisterPage";
import UserManagerPage from "./pages/UserManagerPage";
import GenerateReportAssignManager from "./pages/GenerateReportAssignManager";
import CourseClassesPage from "./pages/CourseClassesPage";
import InstructorTimetable from "./pages/InstructorTimetable";
import CourseGroupTimetable from "./pages/CourseGroupTimetable";
import CourseListPage from "./pages/CourseList"; //create CourseListPage
import CourseForm from "./pages/CourseForm"; // create CourseForm
import ViewCoursePage from "./pages/ViewCoursePage";
import EventForm from "./pages/EventForm"; //event form  page
import EventList from "./pages/EventList";
import EventDetails from "./pages/EventDetails";
import AddUser from "./pages/AddUser";
import UserProfile from "./pages/UserProfile";



function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />  {/* Default Landing Page */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/assignmentdashboard" element={<AssignmentDashboard />} />
      <Route path="/assign-instructors" element={<AssignInstructor />} />
      <Route path="/enroll-students" element={<EnrollStudents />} />
      <Route path="/user-manager" element={<UserManagerPage />} />
      <Route path="/AddUser" element={<AddUser />} />
      <Route path="/UserProfile" element={<UserProfile />} />

      
    </Routes>
  );
}

export default App;