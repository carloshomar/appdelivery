import Strings from "@/constants/Strings";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://uid5u87m1l.execute-api.us-east-1.amazonaws.com",
});

api.interceptors.request.use(async (config) => {
  const toe = await AsyncStorage.getItem(Strings.token_jwt);
  if (toe) {
    config.headers.Authorization = toe;
  }
  return config;
});

export default api;
