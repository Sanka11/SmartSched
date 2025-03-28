import { FaFilePdf } from "react-icons/fa";
import PropTypes from 'prop-types';

const FilterControls = ({
  filterDate,
  filterRole,
  setFilterDate,
  setFilterRole,
  generatePDF
}) => {
  return (
    <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
          <input
            type="date"
            id="date-filter"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
          <select
            id="role-filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="lecturer">Lecturer</option>
            <option value="student">Student</option>
            <option value="course manager">Course Manager</option>
            <option value="assignment manager">Assignment Manager</option>
            <option value="user manager">User Manager</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaFilePdf className="mr-2" /> Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

FilterControls.propTypes = {
  filterDate: PropTypes.string,
  filterRole: PropTypes.string,
  setFilterDate: PropTypes.func.isRequired,
  setFilterRole: PropTypes.func.isRequired,
  generatePDF: PropTypes.func.isRequired
};

export default FilterControls;