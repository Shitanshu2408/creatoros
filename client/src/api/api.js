import axios from "axios";

/*
  Production-ready Axios instance
  Works for:
  - Local development
  - Vercel frontend
  - Render backend
  - JWT authentication
*/

// Automatically choose correct API URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // set true only if using cookies
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
});

// ===============================
// REQUEST INTERCEPTOR
// Attaches JWT token automatically
// ===============================
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// ===============================
// RESPONSE INTERCEPTOR
// Handles global errors
// ===============================
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      console.error("Network error or server not responding");
      return Promise.reject({
        message: "Server not responding",
      });
    }

    const { status } = error.response;

    // Unauthorized → logout user
    if (status === 401) {
      console.warn("Unauthorized. Logging out...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/login";
    }

    // Forbidden
    if (status === 403) {
      console.warn("Forbidden access");
    }

    // Server error
    if (status >= 500) {
      console.error("Server error");
    }

    return Promise.reject(error.response.data || error);
  }
);

// ===============================
// Optional helper methods
// ===============================

// Set token manually
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

// Remove token
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// Export main instance
export default api;