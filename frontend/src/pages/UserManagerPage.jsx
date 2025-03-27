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
  FaUsers,
  FaUserCog,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaTasks,
  FaUserShield,
  FaUserAlt,
  FaBars
} from "react-icons/fa";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import UserTable from "../components/UserTable";
import FilterControls from "../components/FilterControls";

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
      alert("Failed to fetch users.");
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
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
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
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
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
      alert("No users found matching the filters.");
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
      <Sidebar
        sidebarOpen={sidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        activeTab={activeTab}
        toggleSidebar={toggleSidebar}
        toggleMobileSidebar={toggleMobileSidebar}
        setActiveTab={setActiveTab}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <MobileHeader toggleMobileSidebar={toggleMobileSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="hidden lg:flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            </div>
            
            <Tabs 
              selectedIndex={["admin", "lecturer", "student", "course manager", "assignment manager", "user manager", "user"].indexOf(activeTab)} 
              onSelect={(index) => setActiveTab(["admin", "lecturer", "student", "course manager", "assignment manager", "user manager", "user"][index])}
            >
              <TabList className="hidden lg:flex space-x-2 mb-8 p-1 bg-gray-100 rounded-xl">
                {["admin", "lecturer", "student", "course manager", "assignment manager", "user manager", "user"].map((role) => (
                  <Tab
                    key={role}
                    className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      activeTab === role 
                        ? "bg-white text-indigo-600 shadow-md font-medium" 
                        : "text-gray-600 hover:text-indigo-500 hover:bg-gray-50"
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Tab>
                ))}
              </TabList>

              <FilterControls
                filterDate={filterDate}
                filterRole={filterRole}
                setFilterDate={setFilterDate}
                setFilterRole={setFilterRole}
                generatePDF={generatePDF}
              />

              {["admin", "lecturer", "student", "course manager", "assignment manager", "user manager", "user"].map((role) => (
                <TabPanel key={role}>
                  {renderRoleTable(role)}
                </TabPanel>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagerPage;