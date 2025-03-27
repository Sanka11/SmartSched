import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EventForm = () => {
  const { eventId } = useParams(); // Get eventId from URL if updating
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

  // Fetch event details if updating
  useEffect(() => {
    if (eventId) {
      axios
        .get(`http://localhost:8080/events/${eventId}`)
        .then((response) => {
          setEvent(response.data);
        })
        .catch((error) => console.error("Error fetching event:", error));
    }
  }, [eventId]);

  // Handle form input changes
  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  // Validate form inputs
  const validate = () => {
    let formErrors = {};
    const today = new Date("2025-03-22");

    // Validate date (not in the past)
    if (new Date(event.eventDate) < today) {
      formErrors.eventDate = "Event date cannot be in the past.";
    }

    // Validate time format (HH:MM)
    if (!/^([01]?\d|2[0-3]):[0-5]\d$/.test(event.eventTime)) {
      formErrors.eventTime = "Please enter a valid time (HH:MM).";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (eventId) {
        // Update existing event
        await axios.put(
          `http://localhost:8080/events/update/${eventId}`,
          event
        );
        alert("Event updated successfully!");
      } else {
        // Create new event
        await axios.post("http://localhost:8080/events/add", event);
        alert("Event created successfully!");
      }
      navigate("/eventlist");
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">
            {eventId ? "Update Event" : "Create Event"}
          </h2>
          <p className="text-gray-600 mt-2">
            {eventId
              ? "Edit the event details below."
              : "Fill in the details to create a new event."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                name="eventName"
                placeholder="Enter event name"
                value={event.eventName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                name="eventDate"
                value={event.eventDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
              {errors.eventDate && (
                <p className="text-sm text-red-500 mt-1">{errors.eventDate}</p>
              )}
            </div>

            {/* Event Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Time
              </label>
              <input
                type="time"
                name="eventTime"
                value={event.eventTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
             
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter event location"
                value={event.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* Organizing Committee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organizing Committee
              </label>
              <input
                type="text"
                name="orgCommittee"
                placeholder="Enter organizing committee"
                value={event.orgCommittee}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* Event Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Mode
              </label>
              <input
                type="text"
                name="eventMode"
                placeholder="Enter event mode (Online/Offline)"
                value={event.eventMode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter event description"
                value={event.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows="4"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {eventId ? "Update Event" : "Create Event"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;