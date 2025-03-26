import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const UserManagerNavBar = () => {
  const Navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    axios
      .post("/logout")
      .then(() => {
        Navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-white bg-opacity-80 backdrop-blur-lg shadow-sm rounded-lg border border-gray-100">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png" // Replace with your logo path
            alt="Simplicity Logo"
            className="h-10 mr-3"
          />
          <span className="text-2xl font-bold text-gray-800">Simplicity</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex-1 md:flex md:items-center md:justify-center">
          <ul className="font-medium flex space-x-8">
            <li>
              <Link
                to="/AddUser"
                className="text-gray-700 hover:text-green-600 transition duration-300"
              >
                Add User
              </Link>
            </li>
            <li>
              <Link
                to="/AdminDash"
                className="text-gray-700 hover:text-green-600 transition duration-300"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/UserReport"
                className="text-gray-700 hover:text-green-600 transition duration-300"
              >
                User Report
              </Link>
            </li>
          </ul>
        </div>

        {/* Profile Dropdown */}
        <div className="flex items-center space-x-3 ml-auto relative">
          <div className="relative">
            <FaUser
              className="text-gray-700 hover:text-green-600 cursor-pointer transition duration-300"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-100">
                <ul className="list-reset">
                  <li>
                    <Link
                      to="/ManageProfile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
                    >
                      Manage Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserManagerNavBar;