import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { 
  MdDashboard, 
  MdSchedule, 
  MdEditCalendar,
  MdAccountCircle 
} from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiFileList3Line } from "react-icons/ri";

const DynamicSidebar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On larger screens, keep sidebar open
      if (!mobile) {
        setIsOpen(true);
      }
    };

    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    {
      path: user?.role === "student" ? "/student/dashboard" : "/lecturer/dashboard",
      name: "Dashboard",
      icon: <MdDashboard className="text-xl" />,
      roles: ["student", "lecturer"]
    },
    {
      path: user?.role === "student" ? "/student/timetable" : "/lecturer/timetable",
      name: "Timetable",
      icon: <MdSchedule className="text-xl" />,
      roles: ["student", "lecturer"]
    },
    {
      path: user?.role === "student" ? "/custom-schedule/student" : "/custom-schedule/lecturer",
      name: "Custom Schedule",
      icon: <MdEditCalendar className="text-xl" />,
      roles: ["student", "lecturer"]
    },
    {
      path: user?.role === "student" ? "/student/courses" : "/lecturer/courses",
      name: "My Courses",
      icon: <RiFileList3Line className="text-xl" />,
      roles: ["student", "lecturer"]
    },
    {
      path: user?.role === "student" ? "/student/notifications" : "/lecturer/notifications",
      name: "Notifications",
      icon: <IoMdNotificationsOutline className="text-xl" />,
      roles: ["student", "lecturer"]
    },
    {
      path: user?.role === "student" ? "/student/profile" : "/lecturer/profile",
      name: "Profile",
      icon: <MdAccountCircle className="text-xl" />,
      roles: ["student", "lecturer"]
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="md:hidden fixed top-0 left-0 right-0 bg-indigo-700 text-white p-4 flex justify-between items-center shadow-lg z-40 h-16">
          <button 
            onClick={toggleSidebar} 
            className="focus:outline-none p-1 rounded-md hover:bg-indigo-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-8 h-8 object-contain" 
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="ml-2 font-semibold">EduSchedule</span>
          </div>
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>
      )}

      {/* Sidebar */}
    
<div className={`fixed md:relative z-30 w-72 h-screen bg-gradient-to-b from-indigo-700 to-indigo-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
  isOpen ? "left-0" : "-left-72"
} md:left-0 shadow-xl`}>
        <div className="flex flex-col items-center py-6 px-4 h-full overflow-y-auto">
          {/* Logo - Hidden on mobile since we have it in the header */}
          <div className={`items-center justify-center mb-8 ${isMobile ? 'hidden' : 'flex'}`}>
            <img 
              src={logo} 
              alt="Logo" 
              className="w-30 h-16 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          {/* User Info */}
          <div className="text-center mb-8 px-4 py-4 bg-indigo-600 rounded-xl w-full">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-indigo-500 flex items-center justify-center text-3xl">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold text-lg truncate">{user?.fullName}</p>
            <p className="text-sm text-indigo-100 truncate">{user?.email}</p>
            <p className="text-xs text-indigo-200 mt-1 capitalize bg-indigo-700 rounded-full px-2 py-1 inline-block">
              {user?.role}
            </p>
          </div>

          {/* Navigation */}
          <nav className="w-full flex flex-col gap-1 flex-grow">
            {navItems.map((item) => (
              item.roles.includes(user?.role) && (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-white text-indigo-700 font-semibold shadow-md" 
                        : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                    }`
                  }
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <>
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </>
                </NavLink>
              )
            ))}

            <div className="mt-auto pt-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-indigo-100 hover:bg-indigo-600 rounded-lg transition-colors group"
              >
                <FiLogOut className="mr-3 group-hover:text-white" />
                <span className="group-hover:text-white">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default DynamicSidebar;