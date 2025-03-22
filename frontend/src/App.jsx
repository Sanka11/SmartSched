import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage"; // Create LoginPage later
import AssignmentDashboard from "./pages/AssignmentDashboard"; // Create AssignmentDashboard later
import AssignInstructor from "./pages/AssignInstructor"; // Create AssignInstructor later
import EnrollStudents from "./pages/EnrollStudents";
import RegisterPage from "./pages/RegisterPage"; // Create RegisterPage later
import UserManagerPage from "./pages/UserManagerPage";
import GenerateReportAssignManager from "./pages/GenerateReportAssignManager";
import CourseClassesPage from "./pages/CourseClassesPage";
import CourseListPage from "./pages/CourseList"; //create CourseListPage
import CourseForm from "./pages/CourseForm"; // create CourseForm
import ViewCoursePage from "./pages/ViewCoursePage";
import EventForm from "./pages/EventForm"; //event form  page
import EventList from "./pages/EventList";
import EventDetails from "./pages/EventDetails";


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> {/* Default Landing Page */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/assignmentdashboard" element={<AssignmentDashboard />} />
      <Route path="/assign-instructors" element={<AssignInstructor />} />
      <Route path="/enroll-students" element={<EnrollStudents />} />
      <Route path="/user-manager" element={<UserManagerPage />} />
      <Route path="/generate-reports-assign" element={<GenerateReportAssignManager/>} />
      <Route path="/assign-classes" element={<CourseClassesPage/>} />

    </Routes>
  );
      <Route path="/courses" element={<CourseListPage />} />
      <Route path="/add-course" element={<CourseForm />} />
      <Route path="/update-course/:courseId" element={<CourseForm />} />
      <Route path="/view-course/:courseId" element={<ViewCoursePage />} />
      <Route path="/createevent" element={<EventForm />} />
      <Route path="/eventlist" element={<EventList />} />
      <Route path="/view-event/:eventId" element={<EventDetails />} />
      <Route path="/update-event/:eventId" element={<EventForm />} />
    </Routes>
  );
}

export default App;
