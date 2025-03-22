import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
    const navigate = useNavigate();

    const handleCreateEvent = () => {
        navigate('/eventform');  // Navigate to EventForm page
    };

    const handleCreateCourse = () => {
        navigate('/courseform');  // Navigate to CourseForm page
    };

    return (
        <div className="flex justify-center items-center h-screen space-x-4">
            <button 
                onClick={handleCreateEvent}
                className="p-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Create Event
            </button>
            <button 
                onClick={handleCreateCourse}
                className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Create Course
            </button>
        </div>
    );
};

export default CreateEvent;
