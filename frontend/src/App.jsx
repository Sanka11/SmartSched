import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage"; // Create LoginPage later
import AssignmentDashboard from "./pages/AssignmentDashboard"; // Create AssignmentDashboard later
import AssignInstructor from "./pages/AssignInstructor"; // Create AssignInstructor later
import EnrollStudents from "./pages/EnrollStudents";

import CourseFormPage from "./pages/CourseForm"; // create CourseFormPage

import RegisterPage from "./pages/RegisterPage"; // Create RegisterPage later
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
import CreateEventCourse from "./pages/CreateEventCourse";
import UpdatePassword from "./pages/UpdatePassword";

import AllCourseAndModules from "./pages/AllCourseAndModules";
import Viewcourse from "./pages/viewcourse";
import LocationManager from "./pages/LocationManager";
import StudentCourses from "./pages/StudentCourses";
import InstructorCourses from "./pages/InstructorCourses";

//AI Imports
import AIscheduler from "./pages/AIscheduler";
import UserTimetable from "./pages/UserTimetable";
import StudentTimetable from "./pages/StudentTimetable";
import StudentDashboard from "./pages/StudentDashboard";
import LecturerTimetable from "./pages/LecturerTimetable";
import LecturerDashboard from "./pages/LecturerDashboard";
import StudentCustomSchedule from "./pages/StudentCustomSchedule";
import LecturerCustomSchedule from "./pages/LecturerCustomSchedule";
import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard";
import GenerateTimetable from "./pages/superadmin/schedule/GenerateTimetable";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> {/* Default Landing Page */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/assignmentdashboard" element={<AssignmentDashboard />} />
      <Route path="/assign-instructors" element={<AssignInstructor />} />
      <Route path="/enroll-students" element={<EnrollStudents />} />
      <Route path="/courses" element={<CourseListPage />} />
      <Route path="/add-course" element={<CourseFormPage />} />
      <Route path="/edit-course/:id" element={<CourseFormPage />} />
      <Route path="/user-manager" element={<UserManagerPage />} />
      <Route path="/AddUser" element={<AddUser />} />
      <Route path="/UserProfile" element={<UserProfile />} />
      <Route path="/courses" element={<CourseListPage />} />
      <Route path="/add-course" element={<CourseForm />} />
      <Route path="/update-course/:courseId" element={<CourseForm />} />
      <Route path="/view-course/:courseId" element={<ViewCoursePage />} />
      <Route path="/createevent" element={<EventForm />} />
      <Route path="/eventlist" element={<EventList />} />
      <Route path="/view-event/:eventId" element={<EventDetails />} />
      <Route path="/update-event/:eventId" element={<EventForm />} />{" "}
      <Route path="/eventcourse" element={<CreateEventCourse />} />
      <Route path="/forgot-password" element={<UpdatePassword />} />
      <Route path="/locations" element={<LocationManager />} />
      <Route
        path="/generate-reports-assign"
        element={<GenerateReportAssignManager />}
      />
      <Route path="/assign-classes" element={<CourseClassesPage />} />
      <Route path="/InstructorTimetable" element={<InstructorTimetable />} />
      <Route path="/CourseGroupTimetable" element={<CourseGroupTimetable />} />
      <Route path="/courses" element={<CourseListPage />} />
      <Route path="/add-course" element={<CourseForm />} />
      <Route path="/update-course/:courseId" element={<CourseForm />} />
      <Route path="/view-course/:courseId" element={<ViewCoursePage />} />
      <Route path="/createevent" element={<EventForm />} />
      <Route path="/eventlist" element={<EventList />} />
      <Route path="/view-event/:eventId" element={<EventDetails />} />
      <Route path="/update-event/:eventId" element={<EventForm />} />
      <Route path="/AllCourseAndModules" element={<AllCourseAndModules />} />
      <Route
        path="/generate-reports-assign"
        element={<GenerateReportAssignManager />}
      />
      <Route path="/ai-scheduler" element={<AIscheduler />} /> {/*AI Sceduler*/}
      <Route path="/my-timetable" element={<UserTimetable />} />
      <Route path="/student/timetable" element={<StudentTimetable />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/lecturer/timetable" element={<LecturerTimetable />} />
      <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
      <Route path="/lecturer" element={<LecturerDashboard />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route
        path="/custom-schedule/student"
        element={<StudentCustomSchedule />}
      />
      <Route
        path="/custom-schedule/lecturer"
        element={<LecturerCustomSchedule />}
      />
      <Route path="/superadmin/dashboard" element={<SuperadminDashboard />} />
      <Route
        path="/superadmin/schedule/generate"
        element={<GenerateTimetable />}
      />
    </Routes>
  );
}

export default App;
