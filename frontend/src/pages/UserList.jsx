import React, { useEffect, useState } from "react";
import api from "../services/api";

const UserList = () => {
  const [users, setUsers] = useState([]); // State to store all users
  const [editingUserId, setEditingUserId] = useState(null); // State to track which user is being edited
  const [editedRole, setEditedRole] = useState(""); // State to store edited role
  const [editedPermissions, setEditedPermissions] = useState([]); // State to store edited permissions

  // Fetch all users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Fetch all users from the backend
  const fetchAllUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users.");
    }
  };

  // Handle editing a user's role and permissions
  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditedRole(user.role);
    setEditedPermissions(user.permissions);
  };

  // Handle saving changes to a user's role and permissions
  const handleSave = async (userId) => {
    try {
      // Send updated role and permissions to the backend
      await api.put(`/api/users/${userId}/role`, null, {
        params: {
          role: editedRole,
          permissions: editedPermissions.join(","), // Convert array to comma-separated string
        },
      });

      // Refresh the user list
      fetchAllUsers();
      setEditingUserId(null); // Exit edit mode
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  // Handle canceling edit mode
  const handleCancel = () => {
    setEditingUserId(null);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Manager</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Full Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Permissions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-700">{user.fullName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.contact}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editedRole}
                      onChange={(e) => setEditedRole(e.target.value)}
                      className="border p-2 rounded-lg w-full"
                    />
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
                      className="border p-2 rounded-lg w-full"
                    />
                  ) : (
                    user.permissions.join(", ")
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {editingUserId === user.id ? (
                    <>
                      <button
                        onClick={() => handleSave(user.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>
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

export default UserList;