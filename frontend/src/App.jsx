import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AssignmentDashboard from "./pages/AssignmentDashboard";
import AssignInstructor from "./pages/AssignInstructor";
import EnrollStudents from "./pages/EnrollStudents";
import RegisterPage from "./pages/RegisterPage";
import UserManagerPage from "./pages/UserManagerPage";
import UpdatePassword from "./pages/UpdatePassword";
import UserNav from "./components/UserManagerNavBar"; // Import the Navbar component

function App() {
  return (
    <div>
      <Routes>
        {/* Render Navbar only for these pages */}
        <Route path="/user-manager" element={<><UserNav /><UserManagerPage /></>} />
        <Route path="/assignmentdashboard" element={<><AssignmentDashboard /></>} />
        <Route path="/assign-instructors" element={<><AssignInstructor /></>} />
        <Route path="/enroll-students" element={<><EnrollStudents /></>} />

        {/* Other routes without the Navbar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/UpdatePassword" element={<UpdatePassword />} />
      </Routes>
    </div>
  );
}

export default App;
