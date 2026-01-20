// services/axiosUpload.ts
import axios from "axios";
import { store } from "@/store/store";
import { refreshAccessToken } from "@/utilis/api";
import { updateToken, logout } from "@/context/authSlice";

export const axiosBaseApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

// Request interceptor for adding token
axiosBaseApi.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers.Accept = "application/json";
  return config;
});

// Response interceptor for handling 401
axiosBaseApi.interceptors.response.use(
  (res) => res, // pass success
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // refresh token
        const newAccess = await refreshAccessToken();
        store.dispatch(updateToken(newAccess));

        // update Authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        // retry original request
        return axiosBaseApi(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
