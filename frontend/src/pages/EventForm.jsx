import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiSave, FiArrowLeft } from "react-icons/fi";

const EventForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    location: "",
    orgCommittee: "",
    eventMode: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      axios
        .get(`http://localhost:8080/api/events/${eventId}`)
        .then((response) => {
          setEvent(response.data);
        })
        .catch((error) => console.error("Error fetching event:", error));
    }
  }, [eventId]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let formErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(event.eventDate) < today) {
      formErrors.eventDate = "Event date cannot be in the past.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (eventId) {
        await axios.put(
          `http://localhost:8080/api/events/update/${eventId}`,
          event
        );
        alert("Event updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/events/add", event);
        alert("Event created successfully!");
      }
      navigate("/eventlist");
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Error saving event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 overflow-hidden">
      {/* Header Section */}
      <header className="py-8 text-center bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">
            {eventId ? "Update Event" : "Create New Event"}
          </h1>
          <p className="text-gray-400">
            {eventId
              ? "Edit the event details below"
              : "Fill in the details to create a new event"}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-8">
            <button
              onClick={() => navigate("/eventlist")}
              className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition"
            >
              <FiArrowLeft className="mr-2" />
              Back to Events
            </button>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={event.eventName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                    placeholder="Enter event name"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={event.eventDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 border ${
                      errors.eventDate ? "border-red-500" : "border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white`}
                    required
                  />
                  {errors.eventDate && (
                    <p className="text-sm text-red-400 mt-2">
                      {errors.eventDate}
                    </p>
                  )}
                </div>

                {/* Event Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Event Time
                  </label>
                  <input
                    type="time"
                    name="eventTime"
                    value={event.eventTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={event.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                    placeholder="Enter event location"
                  />
                </div>

                {/* Organizing Committee */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Organizing Committee
                  </label>
                  <input
                    type="text"
                    name="orgCommittee"
                    value={event.orgCommittee}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                    placeholder="Enter organizing committee"
                  />
                </div>

                {/* Event Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Event Mode
                  </label>
                  <input
                    type="text"
                    name="eventMode"
                    value={event.eventMode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    required
                    placeholder="Online/Offline"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={event.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  rows="5"
                  required
                  placeholder="Enter detailed event description..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <FiSave className="mr-2" />
                  {loading
                    ? eventId
                      ? "Updating..."
                      : "Creating..."
                    : eventId
                    ? "Update Event"
                    : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;