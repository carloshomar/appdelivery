import axios from "axios";
import Strings from "../constants/Strings";

const api = axios.create({
  baseURL: "http://192.168.100.142",
});

api.interceptors.request.use(async (config) => {
  const toe = `Bearer ${localStorage.getItem(Strings.token_jwt)}`;

  if (toe) {
    config.headers.Authorization = toe;
  }
  return config;
});

export default api;
