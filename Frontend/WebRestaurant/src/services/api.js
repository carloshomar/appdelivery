import axios from "axios";
import Strings from "../constants/Strings";

const api = axios.create({
  baseURL: "https://hpm3zd1439.execute-api.us-east-1.amazonaws.com",
});

api.interceptors.request.use(async (config) => {
  const toe = `Bearer ${localStorage.getItem(Strings.token_jwt)}`;

  if (toe) {
    config.headers.Authorization = toe;
  }
  return config;
});

export default api;
