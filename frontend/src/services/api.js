import axios from "axios";

// Shared Axios setup for all backend requests.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
});

// Every request uses this same Axios instance, so the JWT is attached in one place.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Converts different backend error response shapes into one message for the UI.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (Array.isArray(data?.errors)) return data.errors.join(", ");

  return fallback;
}

export default api;
