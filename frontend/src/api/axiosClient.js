import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("healthnest_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("healthnest_token");
      localStorage.removeItem("healthnest_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosClient;