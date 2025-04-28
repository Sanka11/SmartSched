// src/services/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// Only set headers manually — DO NOT use withCredentials for JWT
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ⛔ Don't add default Authorization here, only for protected routes

export default api;
