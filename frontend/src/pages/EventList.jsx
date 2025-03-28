import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaEye, FaCalendarAlt } from "react-icons/fa";
import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.orgCommittee.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [searchTerm, events]);

  const fetchEvents = () => {
    axios
      .get("http://localhost:8080/api/events/all")
      .then((response) => {
        setEvents(response.data);
        setFilteredEvents(response.data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8080/api/events/delete/${eventId}`);
        alert("Event deleted successfully!");
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 overflow-hidden">
      {/* Header Section */}
      <header className="py-12 text-center bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <FaCalendarAlt className="text-5xl text-blue-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4 text-white">
            Event Management Portal
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Manage and organize all your institutional events in one place
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add Event */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-3 w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Premium Add Event Button */}
          <button
            onClick={() => navigate("/createevent")}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 group"
          >
            <FiPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              Add New Event
            </span>
          </button>
        </div>

        {/* Events Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-8 py-4 text-left font-semibold text-gray-300">
                  Event Details
                </th>
                <th className="px-8 py-4 text-left font-semibold text-gray-300">
                  Date & Time
                </th>
                <th className="px-8 py-4 text-left font-semibold text-gray-300">
                  Location
                </th>
                <th className="px-8 py-4 text-left font-semibold text-gray-300">
                  Committee
                </th>
                <th className="px-8 py-4 text-left font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <tr
                    key={event.eventId}
                    className="hover:bg-gray-750 transition"
                  >
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100/10 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-blue-400">
                            {event.eventName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-medium text-white">
                            {event.eventName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {event.eventMode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="text-gray-300">
                        <div>{event.eventDate}</div>
                        <div className="text-sm text-gray-400">
                          {event.eventTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-gray-300">
                      {event.location}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-gray-300">
                      {event.orgCommittee}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/view-event/${event.eventId}`)}
                          className="flex items-center px-4 py-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700 transition group/action"
                        >
                          <FaEye className="mr-2 group-hover/action:animate-pulse" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/update-event/${event.eventId}`)}
                          className="flex items-center px-4 py-2 bg-amber-600/90 text-white rounded-lg hover:bg-amber-700 transition group/action"
                        >
                          <FaEdit className="mr-2 group-hover/action:animate-bounce" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.eventId)}
                          className="flex items-center px-4 py-2 bg-red-600/90 text-white rounded-lg hover:bg-red-700 transition group/action"
                        >
                          <FaTrashAlt className="mr-2 group-hover/action:animate-pulse" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-12 text-center text-gray-400"
                  >
                    {searchTerm ? (
                      "No events match your search criteria."
                    ) : (
                      <div className="flex flex-col items-center">
                        <FaCalendarAlt className="text-4xl mb-4 text-gray-500" />
                        <p className="text-lg mb-4">
                          No events scheduled yet.
                        </p>
                        <button
                          onClick={() => navigate("/createevent")}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Schedule Your First Event
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredEvents.length > eventsPerPage && (
            <div className="px-8 py-4 bg-gray-800 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-400 mb-4 sm:mb-0">
                Showing{" "}
                <span className="font-medium text-white">
                  {indexOfFirstEvent + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-white">
                  {Math.min(indexOfLastEvent, filteredEvents.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-white">
                  {filteredEvents.length}
                </span>{" "}
                events
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-300 hover:bg-gray-700"
                  } transition`}
                >
                  <FiChevronLeft size={20} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`w-10 h-10 rounded-md flex items-center justify-center ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      } transition`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="text-gray-500 px-1">...</span>
                )}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => paginate(totalPages)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center ${
                      currentPage === totalPages
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    } transition`}
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() =>
                    paginate(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-300 hover:bg-gray-700"
                  } transition`}
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventListPage;