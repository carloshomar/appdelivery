import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.142",
});

api.interceptors.request.use(async (config) => {
  const toe = "alskdmlasdnlkasdlnlaskn";
  if (toe) {
    config.headers.Authorization = toe;
  }
  return config;
});

export default api;
