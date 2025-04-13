import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';

const CreateEventCourse = () => {
    const navigate = useNavigate();

    const handleCreateEvent = () => {
        navigate('/eventlist');  // Navigate to EventForm page
    };

    const handleCreateCourse = () => {
        navigate('/AllCourseAndModules');  // Navigate to CourseForm page
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-6">
            {/* Header Section */}
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-white">My Dashboard</h1>
                <p className="text-lg text-gray-400 max-w-2xl">
                    Choose whether to create a new event or course
                </p>
            </header>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Event Card */}
                <div 
                    onClick={handleCreateEvent}
                    className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8 cursor-pointer hover:border-blue-500 transition-all duration-300 hover:scale-105 group"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-blue-900/20 p-6 rounded-full mb-6 group-hover:bg-blue-900/30 transition">
                            <FaCalendarAlt className="text-5xl text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3"> Event</h2>
                        <p className="text-gray-400 mb-6">
                            Organize and schedule institutional events with detailed information
                        </p>
                        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition">
                            Get Started
                        </button>
                    </div>
                </div>

                {/* Course Card */}
                <div 
                    onClick={handleCreateCourse}
                    className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8 cursor-pointer hover:border-emerald-500 transition-all duration-300 hover:scale-105 group"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-emerald-900/20 p-6 rounded-full mb-6 group-hover:bg-emerald-900/30 transition">
                            <FaGraduationCap className="text-5xl text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3"> Course</h2>
                        <p className="text-gray-400 mb-6">
                            Set up new academic courses with comprehensive details and modules
                        </p>
                        <button className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-800 transition">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEventCourse;