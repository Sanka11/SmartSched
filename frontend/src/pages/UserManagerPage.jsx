import React, { useEffect, useState } from "react";
import api from "../services/api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const UserManagerPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [editedPermissions, setEditedPermissions] = useState([]);
  const [activeTab, setActiveTab] = useState("admin");
  const [filterDate, setFilterDate] = useState("");
  const [filterRole, setFilterRole] = useState("");

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
      // Filter by role if filterRole is provided
      const matchesRole = filterRole ? user.role === filterRole : true;
      return matchesRole;
    });

    console.log("Filtered Users:", filteredUsers); // Debugging line
    return filteredUsers;
  };

  const generatePDF = () => {
    const filteredUsers = handleFilter();
    console.log("Filtered Users:", filteredUsers); // Debugging line

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

    console.log("Table Data:", tableData); // Debugging line

    autoTable(doc, {
      head: [["Full Name", "Email", "Contact", "Role", "Permissions"]],
      body: tableData,
    });

    doc.save("user_report.pdf");
  };

  const renderRoleTable = (role) => {
    const filteredUsers = handleFilter().filter((user) => user.role === role);

    return (
      <div key={role} className="mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{user.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {editingUserId === user.id ? (
                      <select
                        value={editedRole}
                        onChange={(e) => setEditedRole(e.target.value)}
                        className="border p-1 rounded-lg w-full"
                      >
                        <option value="admin">Admin</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="student">Student</option>
                        <option value="course manager">Course Manager</option>
                        <option value="assignment manager">Assignment Manager</option>
                        <option value="user manager">User Manager</option>
                        <option value="user">User</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedPermissions.join(",")}
                        onChange={(e) => setEditedPermissions(e.target.value.split(","))}
                        className="border p-1 rounded-lg w-full"
                      />
                    ) : (
                      (user.permissions || []).join(", ")
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {editingUserId === user.id ? (
                      <>
                        <button
                          onClick={() => handleSave(user.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded-lg mr-2 hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 text-white px-2 py-1 rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 text-white px-2 py-1 rounded-lg mr-2 hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex space-x-4 mb-8">
        {["admin", "lecturer", "student", "course manager", "assignment manager", "user manager", "user"].map((role) => (
          <button
            key={role}
            onClick={() => setActiveTab(role)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === role ? "bg-blue-500 text-white" : "bg-white text-gray-700"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded-lg mr-4"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border p-2 rounded-lg mr-4"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="lecturer">Lecturer</option>
          <option value="student">Student</option>
          <option value="course manager">Course Manager</option>
          <option value="assignment manager">Assignment Manager</option>
          <option value="user manager">User Manager</option>
          <option value="user">user</option>
        </select>
        <button
          onClick={generatePDF}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Generate PDF Report
        </button>
      </div>

      {["admin", "lecturer", "student", "course manager", "assignment manager", "user manager", "user"].map((role) =>
        activeTab === role && renderRoleTable(role)
      )}
    </div>
  );
};

export default UserManagerPage;