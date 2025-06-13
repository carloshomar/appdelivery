import { encode } from "base-64";
import Strings from "@/constants/Strings";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = process.env.API_BASE_URL ?? "http://192.168.68.103";

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(async (config) => {
  const toe = await AsyncStorage.getItem(Strings.token_jwt);
  if (toe) {
    config.headers.Authorization = `${encode(toe)}`;
  }
  return config;
});

export default api;
