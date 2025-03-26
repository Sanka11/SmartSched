import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import PropTypes from 'prop-types';

const UserTable = ({
  users,
  editingUserId,
  editedRole,
  editedPermissions,
  handleEdit,
  handleSave,
  handleDelete,
  handleCancel,
  setEditedRole,
  setEditedPermissions
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-indigo-600 to-blue-500">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Full Name</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Permissions</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <motion.tr
              key={user.id}
              className="hover:bg-gray-50 transition-colors duration-150"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.contact}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {editingUserId === user.id ? (
                  <select
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    value={editedPermissions.join(",")}
                    onChange={(e) => setEditedPermissions(e.target.value.split(","))}
                    className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {user.permissions?.map((perm, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {perm}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {editingUserId === user.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSave(user.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FaSave className="mr-1" /> Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaTimes className="mr-1" /> Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </div>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  editingUserId: PropTypes.string,
  editedRole: PropTypes.string,
  editedPermissions: PropTypes.array,
  handleEdit: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  setEditedRole: PropTypes.func.isRequired,
  setEditedPermissions: PropTypes.func.isRequired
};

export default UserTable;