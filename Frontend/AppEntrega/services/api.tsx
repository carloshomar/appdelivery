import Strings from "@/constants/Strings";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.100.142",
});

api.interceptors.request.use(async (config) => {
  const toe =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InlhbmFnYXNzaUBvdXRsb29rLmNvbSIsImVzdGFibGlzaG1lbnQiOnsiaWQiOjEsIm5hbWUiOiJDYXNhIGRhIENhcm5lIiwiZGVzY3JpcHRpb24iOiJVbWEgY2FzYSBvbmRlIHNlIHRlbSBjYXJuZXMuIiwib3duZXJfaWQiOjEsIkltYWdlIjoiIiwicHJpbWFyeV9jb2xvciI6IiM4QjAwMDAiLCJzZWNvZGFyeV9jb2xvciI6IiNGMEY4RkYifSwiZXhwIjoxNzA3MDc0MTA5LCJpZCI6MSwibmFtZSI6IllhbiJ9.HY99-7ZZ_L-JxjMIUad5uXmodsVB0bBHqzzF-UfElWo";
  //await AsyncStorage.getItem(Strings.token_jwt);
  if (toe) {
    config.headers.Authorization = toe;
  }
  return config;
});

export default api;
