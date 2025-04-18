import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import registerImage from "../assets/signuppageimage.jpg";

const RegisterPage = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    contact: "",
    role: "user",
    permissions: ["read"],
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    
    // Real-time validation
    if (name === "password") {
      calculatePasswordStrength(value);
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(Math.min(strength, 5));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Full name validation
    if (!user.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Contact validation
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(user.contact)) {
      newErrors.contact = "Please enter a valid 10-digit number";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/api/users/register", user);
      console.log("User registered:", response.data);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Auto-navigate after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error registering user:", error);
      setIsSubmitting(false);
      alert("Failed to register. Try again.");
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r ">
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <motion.div 
              className="bg-white rounded-xl p-8 max-w-md w-full relative shadow-2xl"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
            >
              <button 
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={24} />
              </button>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Success!</h2>
                <p className="text-gray-600 mb-6">
                  Your account has been created successfully. You'll be redirected to login shortly.
                </p>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="h-1 bg-blue-200 rounded-full overflow-hidden"
                >
                  <div className="h-full bg-blue-500"></div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Form */}
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full animate-fade-in">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Join SmartSched</h1>
          <p className="text-gray-600 mb-8">Create your account to get started</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className={`border p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 transition-all ${
                  errors.fullName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                value={user.fullName}
                onChange={handleChange}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaTimes className="mr-1" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={`border p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 transition-all ${
                  errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                value={user.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaTimes className="mr-1" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`border p-3 pl-10 pr-10 rounded-lg w-full focus:outline-none focus:ring-2 transition-all ${
                  errors.password ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                value={user.password}
                onChange={handleChange}
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              
              {/* Password Strength Meter */}
              {user.password && (
                <div className="mt-2">
                  <div className="flex items-center mb-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      {passwordStrength <= 2 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong"}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaTimes className="mr-1" /> {errors.password}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="contact"
                placeholder="Contact Number"
                className={`border p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 transition-all ${
                  errors.contact ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                value={user.contact}
                onChange={handleChange}
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <FaTimes className="mr-1" /> {errors.contact}
                </p>
              )}
            </div>

            {/* Hidden fields */}
            <input type="hidden" name="role" value={user.role} />
            <input type="hidden" name="permissions" value={user.permissions} />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition-all transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="mt-6 text-gray-600 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Sign In
            </a>
          </p>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={registerImage}
            alt="Register"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 flex items-end p-8">
            <div>
              <h2 className="text-white text-2xl font-bold mb-2">Smart Scheduling</h2>
              <p className="text-white/90">Join thousands of users managing their time efficiently</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;