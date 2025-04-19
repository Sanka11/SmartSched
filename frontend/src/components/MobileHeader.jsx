import { FaBars } from "react-icons/fa";
import PropTypes from 'prop-types';

const MobileHeader = ({ toggleMobileSidebar }) => {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
      <button
        onClick={toggleMobileSidebar}
        className="text-gray-500 hover:text-gray-600 focus:outline-none"
      >
        <FaBars className="h-6 w-6" />
      </button>
      <h1 className="text-lg font-medium text-gray-800">User Management</h1>
      <div className="w-6"></div>
    </header>
  );
};

MobileHeader.propTypes = {
  toggleMobileSidebar: PropTypes.func.isRequired
};

export default MobileHeader;