import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";  // Create LoginPage later
import RegisterPage from "./pages/RegisterPage"; 
import UserManagerPage from "./pages/UserManagerPage";// Create RegisterPage later

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />  {/* Default Landing Page */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/user-manager" element={<UserManagerPage />} />
    </Routes>
  );
}

export default App;
