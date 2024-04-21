import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

import Strings from "../constants/Strings";
import { decodeToken } from "react-jwt";

import useWebSocket from "react-use-websocket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEstablishment, setOpenEstablishment] = useState(false);
  const [fmode, setFMode] = useState(false);

  const [socketMessage, setSocketMessage] = useState([]);

  const url = api.getUri().replace("http", "ws") + "/api/order/ws/1";

  const { sendJsonMessage, lastMessage } = useWebSocket(url, {
    reconnectInterval: 1000,
    retryOnError: true,
    reconnectAttempts: 5,
    onReconnectStop: () => {
      setFMode(true);
    },
  });

  const getUser = () => {
    const storedToken = localStorage.getItem(Strings.token_jwt);

    if (storedToken) {
      const decodedToken = decodeToken(storedToken);

      return decodedToken;
    }
    return null;
  };

  const sendSocketMessage = (type, data) => {
    sendJsonMessage({
      type,
      data,
    });
  };

  useEffect(() => {
    try {
      const decodedToken = getUser();
      setUser(decodedToken);
      if (decodedToken) {
        sendSocketMessage("connect", {
          id: decodedToken.establishment.id,
          name: decodedToken.establishment.name,
        });
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (lastMessage) {
      setSocketMessage([...socketMessage, lastMessage]);
    }
  }, [lastMessage]);

  const login = async (email, password) => {
    try {
      const response = await api.post("api/auth/users/login", {
        email,
        password,
      });
      const token = response.data.token;
      setUser(token);

      localStorage.setItem(Strings.token_jwt, token);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem(Strings.token_jwt);
    setUser(null);
  };

  const refreshOpen = async () => {
    const id = getUser()?.id;
    if (!id) return;

    try {
      const { data } = await api.get(
        "/api/auth/establishments/" + getUser().id
      );

      setOpenEstablishment(data?.open_data ?? false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    refreshOpen();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        getUser,
        sendSocketMessage,
        socketMessage,
        openEstablishment,
        setOpenEstablishment,
        refreshOpen,
        fmode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Crie um hook personalizado para acessar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);
