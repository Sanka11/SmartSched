import React, { useState } from "react";
import api from "../services/api"; // Axios API instance
import { useNavigate } from "react-router-dom";

// Import the image
import loginImage from "../assets/signuppageimage.jpg";

// Import icons
import { FaEnvelope, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Store error messages

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/users/login", credentials); // Updated endpoint
      console.log("User logged in:", response.data);
      
      alert("Login successful!");

      // Store user data if needed (e.g., authentication token)
      localStorage.setItem("user", JSON.stringify(response.data));

      // Redirect based on user role
      const userRole = response.data.role; // Assuming response contains role
      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else if (userRole === "user-manager") {
        navigate("/user-manager");
      } else if (userRole === "student") {
        navigate("/student/dashboard");
      }else if (userRole === "assignment manager") {
        navigate("/assignment manager");
      }else if (userRole === "course manager") {
        navigate("/course manager");
      }else if (userRole === "lecturer") {
        navigate("/lecturer/dashboard");
      }
      else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage(error.response?.data || "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-300">
      {/* Container for the form and image */}
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full animate-fade-in">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome Back!</h1>
          <p className="text-gray-600 mb-4">Sign in to continue to SmartSched.</p>

          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* Display error messages */}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block w-1/2">
          <img
            src={loginImage}
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;