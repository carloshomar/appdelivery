import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "@/services/api";
import { Buffer } from "buffer";

import Strings from "@/constants/Strings";

interface User {
  email: string;
  name: string;
  id: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLogged: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<any> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

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
      };

      setUser(decodedToken);

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(Strings.token_jwt);
        if (token) {
          // Decodifica o token para obter os dados do usuário

          // Decodifica o token para obter os dados do usuário
          const parts = token
            .split(".")
            .map((part) =>
              Buffer.from(
                part.replace(/-/g, "+").replace(/_/g, "/"),
                "base64"
              ).toString()
            );

          const decodedToken = JSON.parse(parts[1]) as {
            email: string;
            name: string;
            id: number;
          };

          setUser(decodedToken);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    setIsLogged(user != null);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLogged,
        login,
        logout,
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