import React, { useState } from "react";
import api from "../services/api"; // Import Axios API instance
import { useNavigate } from "react-router-dom";

// Import the image you want to use
import registerImage from "../assets/signuppageimage.jpg"; // Adjust the path to your image

// Import icons (using react-icons)
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

const RegisterPage = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    contact: "",
    role: "user", // Default role for new users
    permissions: ["read"], // Default permissions for new users
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation (minimum 6 characters)
    if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Contact number validation (just a simple check for digits)
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(user.contact)) {
      newErrors.contact = "Please enter a valid 10-digit contact number.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Perform form validation
    const formErrors = validateForm();
    setErrors(formErrors);

    // If there are errors, prevent form submission
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      const response = await api.post("/api/users/register", user);
      console.log("User registered:", response.data);
      alert("Registration successful!");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Container for the form and image */}
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full animate-fade-in">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Join SmartSched</h1>
          <p className="text-gray-600 mb-8">Create your account to get started.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="border p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={user.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={user.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="border p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={user.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="contact"
                placeholder="Contact Number"
                className="border p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={user.contact}
                onChange={handleChange}
                required
              />
              {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
            </div>
            {/* Hidden input for role and permissions (default values) */}
            <input type="hidden" name="role" value={user.role} />
            <input type="hidden" name="permissions" value={user.permissions} />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-6 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign In 
            </a>
          </p>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block w-1/2">
          <img
            src={registerImage}
            alt="Register"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
