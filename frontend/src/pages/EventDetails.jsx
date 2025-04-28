import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ move inside
  const [error, setError] = useState(null); // ✅ move inside
  const { eventId } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("Failed to load event details.");
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 overflow-hidden">
      {/* Header Section */}
      <header className="py-12 text-center bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-white">Event Details</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Detailed information about the event
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Details Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
              {event.eventName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Event Date */}
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center text-lg">
                    <FaCalendarAlt className="text-blue-400 mr-3" />
                    <div>
                      <span className="font-semibold text-gray-300">Date:</span>{" "}
                      <span className="text-gray-200">{event.eventDate}</span>
                    </div>
                  </div>
                </div>

                {/* Event Time */}
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center text-lg">
                    <FaClock className="text-blue-400 mr-3" />
                    <div>
                      <span className="font-semibold text-gray-300">Time:</span>{" "}
                      <span className="text-gray-200">{event.eventTime}</span>
                    </div>
                  </div>
                </div>

                {/* Event Mode */}
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center text-lg">
                    <div className="w-5 mr-3"></div>{" "}
                    {/* Spacer for alignment */}
                    <div>
                      <span className="font-semibold text-gray-300">Mode:</span>{" "}
                      <span className="text-gray-200">{event.eventMode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Location */}
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center text-lg">
                    <FaMapMarkerAlt className="text-blue-400 mr-3" />
                    <div>
                      <span className="font-semibold text-gray-300">
                        Location:
                      </span>{" "}
                      <span className="text-gray-200">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Organizing Committee */}
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center text-lg">
                    <FaUsers className="text-blue-400 mr-3" />
                    <div>
                      <span className="font-semibold text-gray-300">
                        Organizing Committee:
                      </span>{" "}
                      <span className="text-gray-200">
                        {event.orgCommittee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-start">
                <FaInfoCircle className="text-blue-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-300 whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
