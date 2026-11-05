import axios from "axios";
import useAuthStore from "../stores/authStore";

const mainApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8899",
});

mainApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default mainApi;