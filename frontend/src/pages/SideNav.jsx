import {
  UserGroupIcon,
  PresentationChartBarIcon,
  ChartBarIcon,
  HomeIcon,
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  UserPlusIcon,
  MapPinIcon, // Added for the locations icon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const SideNav = ({ sidebarOpen, toggleSidebar, mobileSidebarOpen, toggleMobileSidebar }) => {
  const navigate = useNavigate();

  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileClick = () => {
    toggleMobileSidebar(false);
    navigate("/user-profile");
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
        aria-label="Admin sidebar"
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Academic System</h1>
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
              {currentUser.role === "admin" && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-blue-800"></span>
              )}
            </div>
            {sidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-blue-200 truncate">{currentUser.email}</p>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <div 
                  onClick={() => {
                    navigate("/assignmentdashboard");
                    toggleMobileSidebar(false);
                  }}
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${!sidebarOpen ? "justify-center" : ""}`}
                >
                  <HomeIcon className="w-5 h-5" />
                  {sidebarOpen && <span className="ml-3">Dashboard</span>}
                </div>
              </li>
              <li>
                <div 
                  onClick={() => {
                    navigate("/enroll-students");
                    toggleMobileSidebar(false);
                  }}
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${!sidebarOpen ? "justify-center" : ""}`}
                >
                  <UserPlusIcon className="w-5 h-5" />
                  {sidebarOpen && <span className="ml-3">Enroll Students</span>}
                </div>
              </li>
              <li>
                <div 
                  onClick={() => {
                    navigate("/assign-instructors");
                    toggleMobileSidebar(false);
                  }}
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${!sidebarOpen ? "justify-center" : ""}`}
                >
                  <PresentationChartBarIcon className="w-5 h-5" />
                  {sidebarOpen && <span className="ml-3">Assign Instructors</span>}
                </div>
              </li>
              <li>
                <div 
                  onClick={() => {
                    navigate("/assign-classes");
                    toggleMobileSidebar(false);
                  }}
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${!sidebarOpen ? "justify-center" : ""}`}
                >
                  <AcademicCapIcon className="w-5 h-5" />
                  {sidebarOpen && <span className="ml-3">Assign Classes</span>}
                </div>
              </li>
              <li>
                <div 
                  onClick={() => {
                    navigate("/locations"); // Added locations navigation
                    toggleMobileSidebar(false);
                  }}
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${!sidebarOpen ? "justify-center" : ""}`}
                >
                  <MapPinIcon className="w-5 h-5" /> {/* Added MapPinIcon */}
                  {sidebarOpen && <span className="ml-3">Locations</span>}
                </div>
              </li>
              <li>
                <div 
                  onClick={() => {
                    navigate("/generate-reports-assign");
                    toggleMobileSidebar(false);
                  }}
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${!sidebarOpen ? "justify-center" : ""}`}
                >
                  <ChartBarIcon className="w-5 h-5" />
                  {sidebarOpen && <span className="ml-3">Generate Reports</span>}
                </div>
              </li>
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

export default SideNav;