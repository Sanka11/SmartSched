import {
  FaUsers,
  FaUserCog,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaTasks,
  FaUserShield,
  FaUserAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserPlus,
  FaUserCircle,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const roleIcons = {
  admin: <FaUserShield className="mr-2" />,
  lecturer: <FaChalkboardTeacher className="mr-2" />,
  student: <FaUserGraduate className="mr-2" />,
  "course manager": <FaTasks className="mr-2" />,
  "assignment manager": <FaTasks className="mr-2" />,
  "user manager": <FaUserCog className="mr-2" />,
  user: <FaUserAlt className="mr-2" />,
};

const Sidebar = ({
  sidebarOpen,
  mobileSidebarOpen,
  activeTab,
  toggleSidebar,
  toggleMobileSidebar,
  setActiveTab,
  setMobileSidebarOpen,
}) => {
  const navigate = useNavigate();
  const roles = [
    "admin",
    "lecturer",
    "student",
    "course manager",
    "assignment manager",
    "user manager",
    "user",
  ];

  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem("user")) || {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAddUser = () => {
    setMobileSidebarOpen(false);
    navigate("/AddUser");
  };

  const handleProfileClick = () => {
    setMobileSidebarOpen(false);
    navigate("/UserProfile");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileSidebar}
          data-testid="sidebar-backdrop"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-30 h-screen w-64 bg-gradient-to-b from-indigo-700 to-blue-800 text-white transition-all duration-300 ease-in-out flex flex-col
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0 lg:w-20"
          } 
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between p-4 border-b border-blue-700">
            {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
            <button
              onClick={toggleSidebar}
              className="hidden lg:block text-white hover:text-blue-200"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden text-white hover:text-blue-200"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Profile section */}
        <div className="flex-shrink-0 p-4 border-b border-blue-700">
          <div
            onClick={handleProfileClick}
            className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-700 ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <FaUserCircle className="text-3xl text-blue-200" />
            {sidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-blue-200 truncate">
                  {currentUser.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-800">
          <nav className="p-4">
            <div className="mb-8">
              <h2
                className={`text-xs uppercase font-semibold mb-4 ${
                  !sidebarOpen && "text-center"
                }`}
              >
                {sidebarOpen ? "Management" : "..."}
              </h2>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 rounded-lg bg-blue-900"
                  >
                    <FaUsers className="text-lg" />
                    {sidebarOpen && <span className="ml-3">User Manager</span>}
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleAddUser}
                    className="flex items-center w-full p-2 rounded-lg hover:bg-blue-700"
                  >
                    <FaUserPlus className="text-lg" />
                    {sidebarOpen && <span className="ml-3">Add User</span>}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h2
                className={`text-xs uppercase font-semibold mb-4 ${
                  !sidebarOpen && "text-center"
                }`}
              >
                {sidebarOpen ? "Quick Access" : "..."}
              </h2>
              <ul className="space-y-2">
                {roles.map((role) => (
                  <li key={role}>
                    <button
                      onClick={() => {
                        setActiveTab(role);
                        setMobileSidebarOpen(false);
                      }}
                      className={`flex items-center w-full p-2 rounded-lg ${
                        activeTab === role ? "bg-blue-600" : "hover:bg-blue-700"
                      }`}
                    >
                      {roleIcons[role]}
                      {sidebarOpen && (
                        <span>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Logout section */}
        <div className="flex-shrink-0 p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-blue-700"
          >
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  mobileSidebarOpen: PropTypes.bool.isRequired,
  activeTab: PropTypes.string.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleMobileSidebar: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setMobileSidebarOpen: PropTypes.func.isRequired,
};

export default Sidebar;
