import React, { useState } from "react";
import api from "../services/api"; // Import Axios API instance
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-3xl font-bold text-green-600">Register for SmartSched</h1>
      <form className="mt-6 w-96" onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="border p-2 rounded-md mb-2 w-full"
          value={user.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 rounded-md mb-2 w-full"
          value={user.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded-md mb-2 w-full"
          value={user.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600 w-full"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
