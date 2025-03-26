import React, { useState, useEffect } from "react";
import axios from "axios";

const AIscheduler = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/scheduler/generate");
            setSchedules(response.data);
        } catch (err) {
            setError("Failed to load schedule.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">AI-Generated Academic Schedule</h2>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-4 py-2">Course Name</th>
                                <th className="px-4 py-2">Module</th>
                                <th className="px-4 py-2">Instructor</th>
                                <th className="px-4 py-2">Time Slot</th>
                                <th className="px-4 py-2">Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="px-4 py-2 text-center">{schedule.courseName}</td>
                                    <td className="px-4 py-2 text-center">{schedule.module}</td>
                                    <td className="px-4 py-2 text-center">{schedule.instructor}</td>
                                    <td className="px-4 py-2 text-center">{schedule.timeSlot}</td>
                                    <td className="px-4 py-2 text-center">{schedule.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AIscheduler;
