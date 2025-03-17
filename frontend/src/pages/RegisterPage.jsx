import React, { useState } from "react";
import api from "../services/api"; // Import Axios API instance
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing

// Import the image you want to use
import registerImage from "../assets/signuppageimage.jpg"; // Adjust the path to your image

const RegisterPage = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    contact: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Hash the password before sending it to the server
      const hashedPassword = bcrypt.hashSync(user.password, 10);
      const userData = { ...user, password: hashedPassword };

      const response = await api.post("/api/users/register", userData);
      console.log("User registered:", response.data);
      alert("Registration successful!");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r ">
      {/* Container for the form and image */}
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Join SmartSched</h1>
          <p className="text-gray-600 mb-8">Create your account to get started.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={user.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={user.email}
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
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="tel"
                name="contact"
                placeholder="Contact Number"
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={user.contact}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition-all transform hover:scale-105"
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