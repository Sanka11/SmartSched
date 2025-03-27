import { FaBars } from "react-icons/fa";
import PropTypes from 'prop-types';

const MobileHeader = ({ toggleMobileSidebar }) => {
  return (
    <header className="lg:hidden bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={toggleMobileSidebar}
          className="text-gray-500 hover:text-gray-600"
          aria-label="Open menu"
        >
          <FaBars />
        </button>
        <h1 className="text-xl font-bold text-gray-800">User Management</h1>
        <div className="w-6"></div>
      </div>
    </header>
  );
};

MobileHeader.propTypes = {
  toggleMobileSidebar: PropTypes.func.isRequired
};

export default MobileHeader;