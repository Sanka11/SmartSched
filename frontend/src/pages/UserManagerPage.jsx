import React, { useEffect, useState } from "react";
import api from "../services/api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";
import { 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaFilePdf,
  FaUserCog
} from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import UserTable from "../components/UserTable";
import FilterControls from "../components/FilterControls";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagerPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [editedPermissions, setEditedPermissions] = useState([]);
  const [activeTab, setActiveTab] = useState("admin");
  const [filterDate, setFilterDate] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await api.get("/api/users");
      const usersWithPermissions = response.data.map((user) => ({
        ...user,
        permissions: user.permissions || [],
      }));
      setUsers(usersWithPermissions);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(
        <div className="flex items-center">
          <FaTimes className="mr-2 text-red-500 text-xl" />
          <div>
            <p className="font-semibold">Fetch Failed!</p>
            <p className="text-sm">Could not load users.</p>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-white border-l-4 border-red-500 shadow-lg',
          bodyClassName: 'text-gray-800',
        }
      );
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditedRole(user.role);
    setEditedPermissions(user.permissions || []);
  };

  const handleSave = async (userId) => {
    try {
      await api.put(`/api/users/${userId}/role`, null, {
        params: {
          role: editedRole,
          permissions: editedPermissions.join(","),
        },
      });
      fetchAllUsers();
      setEditingUserId(null);
      toast.success(
        <div className="flex items-center">
          <FaUserCog className="mr-2 text-green-500 text-xl" />
          <div>
            <p className="font-semibold">User Updated!</p>
            <p className="text-sm">Changes saved successfully.</p>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-white border-l-4 border-green-500 shadow-lg',
          bodyClassName: 'text-gray-800',
        }
      );
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        <div className="flex items-center">
          <FaTimes className="mr-2 text-red-500 text-xl" />
          <div>
            <p className="font-semibold">Update Failed!</p>
            <p className="text-sm">Could not save changes.</p>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-white border-l-4 border-red-500 shadow-lg',
          bodyClassName: 'text-gray-800',
        }
      );
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAllUsers();
      toast.success(
        <div className="flex items-center">
          <FaTrash className="mr-2 text-green-500 text-xl" />
          <div>
            <p className="font-semibold">User Deleted!</p>
            <p className="text-sm">The user has been removed.</p>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-white border-l-4 border-green-500 shadow-lg',
          bodyClassName: 'text-gray-800',
        }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        <div className="flex items-center">
          <FaTimes className="mr-2 text-red-500 text-xl" />
          <div>
            <p className="font-semibold">Delete Failed!</p>
            <p className="text-sm">Could not remove the user.</p>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-white border-l-4 border-red-500 shadow-lg',
          bodyClassName: 'text-gray-800',
        }
      );
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
  };

  const handleFilter = () => {
    const filteredUsers = users.filter((user) => {
      const matchesRole = filterRole ? user.role === filterRole : true;
      return matchesRole;
    });

    return filteredUsers;
  };

  const generatePDF = () => {
    const filteredUsers = handleFilter();

    if (filteredUsers.length === 0) {
      toast.warning(
        <div className="flex items-center">
          <FaFilePdf className="mr-2 text-yellow-500 text-xl" />
          <div>
            <p className="font-semibold">No Users Found!</p>
            <p className="text-sm">No users matching the filters.</p>
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: 'bg-white border-l-4 border-yellow-500 shadow-lg',
          bodyClassName: 'text-gray-800',
        }
      );
      return;
    }

    const doc = new jsPDF();
    doc.text("User Report", 10, 10);

    const tableData = filteredUsers.map((user) => [
      user.fullName,
      user.email,
      user.contact,
      user.role,
      (user.permissions || []).join(", "),
    ]);

    autoTable(doc, {
      head: [["Full Name", "Email", "Contact", "Role", "Permissions"]],
      body: tableData,
    });

    doc.save("user_report.pdf");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const renderRoleTable = (role) => {
    const filteredUsers = handleFilter().filter((user) => user.role === role);

    return (
      <motion.div
        key={role}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UserTable
          users={filteredUsers}
          editingUserId={editingUserId}
          editedRole={editedRole}
          editedPermissions={editedPermissions}
          handleEdit={handleEdit}
          handleSave={handleSave}
          handleDelete={handleDelete}
          handleCancel={handleCancel}
          setEditedRole={setEditedRole}
          setEditedPermissions={setEditedPermissions}
        />
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'} bg-white shadow-lg z-30 transition-all duration-300 ease-in-out`}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          mobileSidebarOpen={mobileSidebarOpen}
          activeTab={activeTab}
          toggleSidebar={toggleSidebar}
          toggleMobileSidebar={toggleMobileSidebar}
          setActiveTab={setActiveTab}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <MobileHeader toggleMobileSidebar={toggleMobileSidebar} />

        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
            
            <Tabs 
              selectedIndex={["admin", "lecturer", "student", "course manager", "assignment manager", "user manager", "user"].indexOf(activeTab)} 
              onSelect={(index) => setActiveTab(["admin", "lecturer", "student", "course manager", "assignment manager", "user manager", "user"][index])}
            >
              <TabList className="flex space-x-1 mb-6 p-1 bg-gray-100 rounded-md">
                {["admin", "lecturer", "student", "course manager", "assignment manager", "user manager", "user"].map((role) => (
                  <Tab
                    key={role}
                    className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-all ${
                      activeTab === role 
                        ? "bg-white text-indigo-600 shadow font-medium" 
                        : "text-gray-600 hover:text-indigo-500 hover:bg-gray-50"
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Tab>
                ))}
              </TabList>

              <div className="mb-6">
                <FilterControls
                  filterDate={filterDate}
                  filterRole={filterRole}
                  setFilterDate={setFilterDate}
                  setFilterRole={setFilterRole}
                  generatePDF={generatePDF}
                />
              </div>

              {["admin", "lecturer", "student", "course manager", "assignment manager", "user manager", "user"].map((role) => (
                <TabPanel key={role}>
                  {renderRoleTable(role)}
                </TabPanel>
              ))}
            </Tabs>
          </div>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName={() => "relative flex p-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-white shadow-lg my-2"}
      />
    </div>
  );
};

export default UserManagerPage;