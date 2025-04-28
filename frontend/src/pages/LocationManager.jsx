import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  UserGroupIcon,
  PresentationChartBarIcon,
  ChartBarIcon,
  HomeIcon,
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const SideNav = ({
  sidebarOpen,
  toggleSidebar,
  mobileSidebarOpen,
  toggleMobileSidebar,
}) => {
  const navigate = useNavigate();

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

  const handleProfileClick = () => {
    toggleMobileSidebar(false);
    navigate("/user-profile");
  };
  const token = localStorage.getItem("token");

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
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0 lg:w-20"
          } 
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
            {sidebarOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
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
            className={`flex items-center p-3 mb-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <UserCircleIcon className="w-8 h-8 text-blue-200" />
              {currentUser.role === "admin" && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-blue-800"></span>
              )}
            </div>
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

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <div
                  onClick={() => {
                    navigate("/assignmentdashboard");
                    toggleMobileSidebar(false);
                  }}
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${
                    !sidebarOpen ? "justify-center" : ""
                  }`}
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
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${
                    !sidebarOpen ? "justify-center" : ""
                  }`}
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
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${
                    !sidebarOpen ? "justify-center" : ""
                  }`}
                >
                  <PresentationChartBarIcon className="w-5 h-5" />
                  {sidebarOpen && (
                    <span className="ml-3">Assign Instructors</span>
                  )}
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    navigate("/assign-classes");
                    toggleMobileSidebar(false);
                  }}
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${
                    !sidebarOpen ? "justify-center" : ""
                  }`}
                >
                  <AcademicCapIcon className="w-5 h-5" />
                  {sidebarOpen && <span className="ml-3">Assign Classes</span>}
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    navigate("/generate-reports-assign");
                    toggleMobileSidebar(false);
                  }}
                  className={`flex items-center p-2 rounded-lg hover:bg-blue-700 cursor-pointer ${
                    !sidebarOpen ? "justify-center" : ""
                  }`}
                >
                  <ChartBarIcon className="w-5 h-5" />
                  {sidebarOpen && (
                    <span className="ml-3">Generate Reports</span>
                  )}
                </div>
              </li>
            </ul>
          </div>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full p-2 rounded-lg hover:bg-blue-700 transition-colors ${
                !sidebarOpen ? "justify-center" : ""
              }`}
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

const LocationManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    hallName: "",
    buildingName: "",
    capacity: "",
    description: "",
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = "http://localhost:8080/api/locations";

  const fetchLocations = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add token
        },
      });
      setLocations(res.data);
    } catch (error) {
      setErrorMessage("Failed to fetch locations");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Add token
          },
        });
        setSuccessMessage("Location updated successfully!");
      } else {
        await axios.post(API_URL, form, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Add token
          },
        });
        setSuccessMessage("Location added successfully!");
      }
      setForm({
        hallName: "",
        buildingName: "",
        capacity: "",
        description: "",
      });
      setEditId(null);
      fetchLocations();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleEdit = (loc) => {
    setForm(loc);
    setEditId(loc.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?"))
      return;

    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Add token
        },
      });
      setSuccessMessage("Location deleted successfully!");
      fetchLocations();
    } catch (error) {
      setErrorMessage("Failed to delete location");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const cancelEdit = () => {
    setForm({ hallName: "", buildingName: "", capacity: "", description: "" });
    setEditId(null);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideNav
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        mobileSidebarOpen={mobileSidebarOpen}
        toggleMobileSidebar={setMobileSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-600"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Location Management
          </h1>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </header>

        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10 hidden lg:block">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Location Management
              </h1>
              <p className="mt-3 text-xl text-gray-500">
                Manage all your classroom and facility locations
              </p>
            </div>

            {/* Notification Messages */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded shadow animate-fade-in">
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2" />
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow animate-fade-in">
                <div className="flex items-center">
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Form Section */}
            <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-10 transition-all duration-300 hover:shadow-2xl">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  {editId ? (
                    <>
                      <PencilIcon className="h-6 w-6 mr-2 text-blue-500" />
                      Edit Location
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-6 w-6 mr-2 text-blue-500" />
                      Add New Location
                    </>
                  )}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="hallName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Hall Name *
                      </label>
                      <input
                        type="text"
                        id="hallName"
                        name="hallName"
                        placeholder="e.g., Hall A, Room 101"
                        value={form.hallName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="buildingName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Building Name *
                      </label>
                      <input
                        type="text"
                        id="buildingName"
                        name="buildingName"
                        placeholder="e.g., Main Building, Science Block"
                        value={form.buildingName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="capacity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Capacity *
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        placeholder="e.g., 50"
                        value={form.capacity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                        min="1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        id="description"
                        name="description"
                        placeholder="e.g., Lecture hall with projector"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${
                        isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          {editId ? "Updating..." : "Adding..."}
                        </span>
                      ) : editId ? (
                        "Update Location"
                      ) : (
                        "Add Location"
                      )}
                    </button>

                    {editId && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Locations List */}
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <svg
                    className="h-6 w-6 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  All Locations
                </h2>
              </div>

              {isLoading && !locations.length ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading locations...</p>
                </div>
              ) : locations.length === 0 ? (
                <div className="p-8 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No locations found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Add your first location using the form above.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {locations.map((loc) => (
                    <li key={loc.id} className="hover:bg-gray-50 transition">
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900">
                                {loc.hallName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {loc.buildingName}
                              </p>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <svg
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                Capacity: {loc.capacity}
                              </div>
                              {loc.description && (
                                <p className="mt-1 text-sm text-gray-500">
                                  <svg
                                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  {loc.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(loc)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(loc.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition"
                              title="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationManager;
