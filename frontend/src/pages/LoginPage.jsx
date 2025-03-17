import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Import the image you want to use
import loginImage from "../assets/signuppageimage.jpg"; // Adjust the path to your image

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      // Make a POST request to your backend login endpoint
      const response = await api.post("/api/users/login", { email, password });

      // Assuming the response contains a 'role' field
      const userRole = response.data.role;

      // Redirect based on user role
      switch (userRole) {
        case "user manager":
          navigate("/user-manager");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "employee":
          navigate("/employee-dashboard");
          break;
        default:
          navigate("/default-dashboard"); // Fallback for unknown roles
      }
    } catch (err) {
      // Handle errors, such as invalid credentials
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r ">
      {/* Container for the form and image */}
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Login to SmartSched</h1>
          <p className="text-gray-600 mb-8">Enter your credentials to continue.</p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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