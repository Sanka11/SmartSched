import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/timetable';

export const generateUserTimetable = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${BASE_URL}/generate`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
