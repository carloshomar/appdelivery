import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost",
});

api.interceptors.request.use(async (config) => {
  const toe = "alskdmlasdnlkasdlnlaskn";
  if (toe) {
    config.headers.Authorization = toe;
  }
  return config;
});

export default api;
