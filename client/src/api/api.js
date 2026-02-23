import axios from "axios";

/*
  Production-ready Axios instance
  Supports:
  - Localhost
  - Vercel frontend
  - Render backend
  - JWT authentication
  - Auto logout on 401
  - Proper error handling
*/

// ===============================
// BASE URL
// ===============================
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";


// ===============================
// AXIOS INSTANCE
// ===============================
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
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
// RESPONSE INTERCEPTOR (FIXED)
// Handles global errors properly
// ===============================
api.interceptors.response.use(

  // Success → return normally
  (response) => response,

  // Error handler
  (error) => {

    // Network error
    if (!error.response) {
      console.error("Network error: Server not responding");

      return Promise.reject({
        status: 0,
        message: "Server not responding",
        isNetworkError: true,
      });
    }

    const { status, data } = error.response;

    // Unauthorized → logout automatically
    if (status === 401) {
      console.warn("Session expired. Logging out.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    // Forbidden
    if (status === 403) {
      console.warn("Forbidden access");
    }

    // Server error
    if (status >= 500) {
      console.error("Server error:", data);
    }

    // Return proper structured error
    return Promise.reject({
      status,
      message:
        data?.message ||
        data?.error ||
        "Request failed",
      data,
    });
  }
);


// ===============================
// AUTH HELPERS
// ===============================

// Save token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

// Save user
export const setUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

// Get user
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// Check login
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};


// ===============================
// EXPORT
// ===============================
export default api;