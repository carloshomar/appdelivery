import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "@/services/api";
import { Buffer } from "buffer";
import useWebSocket from "react-use-websocket";
import Strings from "@/constants/Strings";
import { useNavigation } from "expo-router";

interface User {
  email: string;
  name: string;
  id: number;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLogged: boolean;
  disponivel: boolean;
  setDisponivel: (a: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  inWork: boolean;
  setIsLoading: (a: boolean) => void;
  mylocation: boolean;
  setMyLocation: (a: boolean) => void;
  isActiveOrder: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [disponivel, setDisponivel] = useState(false);
  const [socketMessage, setSocketMessage] = useState<any>([]);
  const [mylocation, setMyLocation] = useState<any | null>(null);

  const [inWork, setInWork] = useState({ status: false, order: null });

  const nav = useNavigation();

  // const { sendJsonMessage, lastMessage, lastJsonMessage } = useWebSocket(
  //   api.getUri().replace("http", "ws") + "/api/delivery/ws/" + user?.id,
  //   {
  //     reconnectInterval: 1000,
  //     retryOnError: true,
  //   }
  // );

  useEffect(() => {
    if (user) sendSocketMessage("connect", user);
  }, [user]);

  // useEffect(() => {
  //   if (lastJsonMessage) {
  //     setSocketMessage([...socketMessage, lastJsonMessage]);
  //   }
  // }, [lastJsonMessage]);

  const sendSocketMessage = (type: string, data: any) => {
    try {
      // sendJsonMessage({
      //   type,
      //   data,
      // });
    } catch (e) {
      console.log(e);
    }
  };

  const isActiveOrder = async () => {
    if (!user || !user.id) {
      setInWork({ status: false, order: null });
    }

    try {
      const { data } = await api.get(
        "/api/delivery/deliveryman/has-active/" + user?.id
      );
      setInWork({ status: data !== null, order: data });

      setDisponivel(data !== null || disponivel);
    } catch (e) {
      console.log(e);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/delivery-man/login", {
        email,
        password,
      });
      const { token } = response.data;

      await AsyncStorage.setItem(Strings.token_jwt, token);

      // Decodifica o token para obter os dados do usuário
      const parts = token
        .split(".")
        .map((part: any) =>
          Buffer.from(
            part.replace(/-/g, "+").replace(/_/g, "/"),
            "base64"
          ).toString()
        );

      const decodedToken = JSON.parse(parts[1]) as {
        email: string;
        name: string;
        id: number;
        phone: string;
      };

      setUser(decodedToken);
      nav.navigate("index");
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(Strings.token_jwt);
      // Limpa o estado do usuário e finaliza o carregamento
      setUser(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  const getUser = async () => {
    try {
      const token = await AsyncStorage.getItem(Strings.token_jwt);
      if (token) {
        const parts = token
          .split(".")
          .map((part) =>
            Buffer.from(
              part.replace(/-/g, "+").replace(/_/g, "/"),
              "base64"
            ).toString()
          );

        const decodedToken = (await JSON.parse(parts[1])) as {
          email: string;
          name: string;
          id: number;
        };
        return decodedToken;
      }
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  const checkAuth = async () => {
    const decodedToken = await getUser();
    setUser(decodedToken);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    setIsLogged(user != null);
    isActiveOrder();
  }, [user, socketMessage]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setIsLoading,
        isLogged,
        login,
        logout,
        inWork,
        disponivel,
        setDisponivel,
        isActiveOrder,
        mylocation,
        setMyLocation,
        sendSocketMessage,
        socketMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthApi = (): any => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

export { AuthProvider, AuthContext, useAuthApi };
