import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Hook to get the event ID from URL

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const { eventId } = useParams(); // Get eventId from URL params

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/events/${eventId}`
        );
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">Event Details</h2>
          <p className="text-gray-600 mt-2">
            Detailed information about the event.
          </p>
        </div>

        {/* Event Details Section (Form-Like Layout) */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                {event.eventName}
              </div>
            </div>

            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                {event.eventDate}
              </div>
            </div>

            {/* Event Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Time
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                {event.eventTime}
              </div>
            </div>

            {/* Event Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Mode
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                {event.eventMode}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                {event.location}
              </div>
            </div>

            {/* Organizing Committee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organizing Committee
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                {event.orgCommittee}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                {event.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;