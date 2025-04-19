import {
    HomeIcon,
    AcademicCapIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    BookOpenIcon,
    TableCellsIcon,
    UserGroupIcon,
    ChartBarIcon,
    MapPinIcon
  } from "@heroicons/react/24/outline";
  import { useNavigate } from "react-router-dom";
  
  const DynamicNavBar = ({ sidebarOpen, toggleSidebar, mobileSidebarOpen, toggleMobileSidebar }) => {
    const navigate = useNavigate();
  
    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem("user")) || {
      name: "User",
      email: "user@example.com",
      role: "student" // default role
    };
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    };
  
    const handleProfileClick = () => {
      toggleMobileSidebar(false);
      navigate(`/${currentUser.role}-profile`);
    };
  
    // Student navigation items
    const studentNavItems = [
      {
        name: "Dashboard",
        icon: <HomeIcon className="w-5 h-5" />,
        path: "/student-dashboard"
      },
      {
        name: "My Courses",
        icon: <BookOpenIcon className="w-5 h-5" />,
        path: "/my-courses"
      },
      {
        name: "Timetables",
        icon: <TableCellsIcon className="w-5 h-5" />,
        path: "/timetables"
      },
      {
        name: "View Courses",
        icon: <AcademicCapIcon className="w-5 h-5" />,
        path: "/view-courses"
      }
    ];
  
    // Lecturer navigation items
    const lecturerNavItems = [
      {
        name: "Dashboard",
        icon: <HomeIcon className="w-5 h-5" />,
        path: "/lecturer-dashboard"
      },
      {
        name: "My Classes",
        icon: <UserGroupIcon className="w-5 h-5" />,
        path: "/my-assignments"
      },
      {
        name: "Timetables",
        icon: <TableCellsIcon className="w-5 h-5" />,
        path: "/lecturer-timetables"
      }
    ];
  
    // Admin navigation items (optional)
    const adminNavItems = [
      {
        name: "Dashboard",
        icon: <HomeIcon className="w-5 h-5" />,
        path: "/admin-dashboard"
      },
      {
        name: "Manage Students",
        icon: <UserGroupIcon className="w-5 h-5" />,
        path: "/manage-students"
      },
      {
        name: "Manage Courses",
        icon: <AcademicCapIcon className="w-5 h-5" />,
        path: "/manage-courses"
      },
      {
        name: "Reports",
        icon: <ChartBarIcon className="w-5 h-5" />,
        path: "/reports"
      },
      {
        name: "Locations",
        icon: <MapPinIcon className="w-5 h-5" />,
        path: "/locations"
      }
    ];
  
    // Get navigation items based on role
    const getNavItems = () => {
      switch(currentUser.role) {
        case "lecturer":
          return lecturerNavItems;
        case "admin":
          return adminNavItems;
        default: // student
          return studentNavItems;
      }
    };
  
    // Get portal title based on role
    const getPortalTitle = () => {
      switch(currentUser.role) {
        case "lecturer":
          return "Lecturer Portal";
        case "admin":
          return "Admin Portal";
        default: // student
          return "Student Portal";
      }
    };
  
    return (
      <>
        {/* Mobile sidebar backdrop */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => toggleMobileSidebar(false)}
            data-testid="sidebar-backdrop"
          />
        )}
  
        {/* Sidebar */}
        <aside 
          className={`fixed top-0 left-0 z-30 h-screen w-64 bg-gradient-to-b from-indigo-700 to-blue-800 text-white transition-all duration-300 ease-in-out 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"} 
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-label={`${currentUser.role} sidebar`}
        >
          <div className="flex items-center justify-between p-4 border-b border-blue-700">
            {sidebarOpen && (
              <h1 className="text-xl font-bold">{getPortalTitle()}</h1>
            )}
            <button 
              onClick={toggleSidebar}
              className="hidden lg:block text-white hover:text-blue-200"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => toggleMobileSidebar(false)}
              className="lg:hidden text-white hover:text-blue-200"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="p-4 flex flex-col h-[calc(100%-64px)]">
            {/* User Profile Section */}
            <div 
              onClick={handleProfileClick}
              className={`flex items-center p-3 mb-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
            >
              <div className="relative">
                <UserCircleIcon className="w-8 h-8 text-blue-200" />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-blue-800 ${
                  currentUser.role === "admin" ? "bg-red-400" : 
                  currentUser.role === "lecturer" ? "bg-yellow-400" : "bg-green-400"
                }`}></span>
              </div>
              {sidebarOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium truncate">{currentUser.name}</p>
                  <p className="text-xs text-blue-200 truncate">{currentUser.email}</p>
                  <p className="text-xs text-blue-300 capitalize">{currentUser.role}</p>
                </div>
              )}
            </div>
  
            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {getNavItems().map((item) => (
                  <li key={item.name}>
                    <div 
                      onClick={() => {
                        navigate(item.path);
                        toggleMobileSidebar(false);
                      }}
                      className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${!sidebarOpen ? "justify-center" : ""}`}
                    >
                      {item.icon}
                      {sidebarOpen && <span className="ml-3">{item.name}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Logout Button */}
            <div className="mt-auto pt-4 border-t border-blue-700">
              <button
                onClick={handleLogout}
                className={`flex items-center w-full p-2 rounded-lg hover:bg-blue-700 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3">Logout</span>}
              </button>
            </div>
          </nav>
        </aside>
      </>
    );
  };
  
  export default DynamicNavBar;