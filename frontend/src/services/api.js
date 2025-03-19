import axios from 'axios';

// Load backend URL from environment variables
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  
});
// Export API methods- nimanji
/* export const createCourse = (course) => axios.post(VITE_BACKEND_URL, course);
export const getCourses = () => axios.get(VITE_BACKEND_URLL);
export const getCourseById = (id) => axios.get(`${VITE_BACKEND_URL}/${id}`);
export const updateCourse = (id, updatedCourse) => axios.put(`${VITE_BACKEND_URL}/${id}`, updatedCourse);
export const deleteCourse = (id) => axios.delete(`${VITE_BACKEND_URL}/${id}`); */

// Create a new course
export const createCourse = async (courseData) => {
  try {
      const response = await axios.post(API_URL, courseData);
      return response.data;
  } catch (error) {
      console.error("There was an error creating the course!", error);
  }
};

// Update an existing course
export const updateCourse = async (courseId, courseData) => {
  try {
      const response = await axios.put(`${API_URL}/${courseId}`, courseData);
      return response.data;
  } catch (error) {
      console.error("There was an error updating the course!", error);
  }
};



export default api;
