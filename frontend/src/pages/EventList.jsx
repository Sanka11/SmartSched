import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get("http://localhost:8080/events/all")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  // Delete event function
  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8080/events/delete/${eventId}`);
        alert("Event deleted successfully!");
        fetchEvents(); // Refresh the event list after deletion
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          All Event Schedule
        </h1>

        {/* Add Event Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/createevent")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            + Add Event
          </button>
        </div>

        {/* Event Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Event Name</th>
                <th className="px-6 py-4 text-left font-semibold">Event Date</th>
                <th className="px-6 py-4 text-left font-semibold">Event Time</th>
                <th className="px-6 py-4 text-left font-semibold">Location</th>
                <th className="px-6 py-4 text-left font-semibold">
                  Organizing Committee
                </th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <tr
                  key={event.eventId}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-gray-700">{event.eventName}</td>
                  <td className="px-6 py-4 text-gray-700">{event.eventDate}</td>
                  <td className="px-6 py-4 text-gray-700">{event.eventTime}</td>
                  <td className="px-6 py-4 text-gray-700">{event.location}</td>
                  <td className="px-6 py-4 text-gray-700">{event.orgCommittee}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/view-event/${event.eventId}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg border border-blue-600 hover:bg-blue-600 transition flex items-center"
                      >
                        <FaEye className="mr-2" /> View
                      </button>
                      <button
                        onClick={() => navigate(`/update-event/${event.eventId}`)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg border border-green-600 hover:bg-green-600 transition flex items-center"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.eventId)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg border border-red-600 hover:bg-red-600 transition flex items-center"
                      >
                        <FaTrashAlt className="mr-2" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventListPage;