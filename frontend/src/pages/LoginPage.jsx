import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../services/api";

import loginImage from "../assets/signuppageimage.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaCheck, FaTimes } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible, AiOutlineClose } from "react-icons/ai";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userRole, setUserRole] = useState("");

  const { setUser } = useAuth(); // from context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await api.post("/api/users/login", credentials);
      const { user, token } = response.data;

      // Save session
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      setUser(user);

      const role = user.role || "user";
      setUserRole(role);

      setShowSuccess(true);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const redirectUser = () => {
    switch (userRole.toLowerCase()) {
      case "superadmin":
        navigate("/superadmin/dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "user manager":
        navigate("/user-manager");
        break;
      case "assignment manager":
        navigate("/assignmentdashboard");
        break;
      case "course manager":
        navigate("/eventcourse");
        break;
      case "student":
        navigate("/student/dashboard");
        break;
      case "lecturer":
        navigate("/lecturer/dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r">
      {/* ✅ Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          >
            <motion.div
              className="bg-white rounded-xl p-8 max-w-md w-full relative shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <button
                onClick={() => {
                  setShowSuccess(false);
                  redirectUser();
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <AiOutlineClose size={20} />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
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

                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Login Successful!
                </h2>
                <p className="text-gray-600 mb-4">
                  Welcome back! You're being redirected to your {userRole}{" "}
                  dashboard.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  (Redirecting in 3 seconds...)
                </p>

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  onAnimationComplete={redirectUser}
                  className="h-2 bg-blue-200 rounded-full overflow-hidden"
                >
                  <div className="h-full bg-blue-500"></div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Login Form UI */}
      <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600 mb-6">
              Sign in to continue to SmartSched
            </p>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-start"
              >
                <FaTimes className="mt-1 mr-2 flex-shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`border p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 transition-all ${
                    errorMessage
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  value={credentials.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`border p-3 pl-10 pr-10 rounded-lg w-full focus:outline-none focus:ring-2 transition-all ${
                    errorMessage
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <AiFillEyeInvisible size={20} />
                  ) : (
                    <AiFillEye size={20} />
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition-all transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSubmitting ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-600">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Sign Up
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={loginImage}
            alt="Login"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30 flex items-end p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-white text-2xl font-bold mb-2">
                Smart Scheduling
              </h2>
              <p className="text-white/90">
                Efficient time management for everyone
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
