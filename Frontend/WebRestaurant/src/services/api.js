import axios from "axios";
import Strings from "../constants/Strings";

const baseURL = process.env.API_BASE_URL || "http://127.0.0.1";

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(async (config) => {
  const toe = `Bearer ${localStorage.getItem(Strings.token_jwt)}`;

  if (toe) {
    config.headers.Authorization = toe;
  }
  return config;
});

export default api;
