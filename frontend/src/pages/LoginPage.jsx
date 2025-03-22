import React, { useState } from "react";
import api from "../services/api"; // Import Axios API instance
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

// Import the image you want to use
import loginImage from "../assets/signuppageimage.jpg"; // Adjust the path to your image

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/users/login", credentials);
      console.log("User logged in:", response.data);
      alert("Login successful!");
      
      // Redirect based on user role
      const userRole = response.data.role; // Assuming response contains role
      if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else if (userRole === "user") {
        navigate("/user-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid email or password. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r">
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome Back!</h1>
          <p className="text-gray-600 mb-8">Sign in to continue to SmartSched.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-gray-600">
            Don't have an account? {" "}
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
