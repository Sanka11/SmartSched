import React from "react";
import { Link } from "react-router-dom";
import LandingImage from "../assets/landingimage.png"; // Import the image from the assets folder
import "@fontsource/ibm-plex-sans-condensed/700.css"; // Import the bold version

const LandingPage = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Left Side - Full Image */}
      <div className="w-full lg:w-1/2 flex justify-center items-center ">
        <img
          src={LandingImage}
          alt="SmartSched Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-10 text-left">
        {/* Title with Custom Font */}
        <h1 className="text-9xl font-bold text-blue-900" style={{ fontFamily: "IBM Plex Sans Condensed, sans-serif" }}>
          SmartSched
        </h1>

        {/* Subheading */}
        <p className="text-lg text-gray-700 mt-4">
          An Academic Scheduler for <br />
          <span className="text-xl font-semibold">
            Conflict-Free Timetable Management System
          </span>
        </p>

        {/* Buttons */}
        <div className="mt-6 flex space-x-4">
          <Link
            to="/login"
            className="px-8 py-3 text-lg font-semibold bg-gray-300 text-black rounded-lg shadow-md hover:bg-gray-400 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 text-lg font-semibold bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
