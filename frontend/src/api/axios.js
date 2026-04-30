import axios from "axios";

// base URL points to your Django backend
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

// before every request, automatically attach JWT token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;