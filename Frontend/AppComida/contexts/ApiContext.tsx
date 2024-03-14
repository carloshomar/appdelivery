// ApiContext.tsx
import Strings from "@/constants/Strings";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "@/helpers/jwt";
import LoadingPage from "@/components/LoadingPage";

interface User {
  nome: string;
  phone: string;
}

interface ApiContextProps {
  login(token: any): void;
  isLogged: boolean;
  getUserData(): object;
  isLoading: boolean;
  setIsLoading(status: boolean): void;
  logout(): void;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem(Strings.token_jwt);
        if (token) {
          setIsLogged(true);
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
      }
      setIsLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const logout = async () => {
    await AsyncStorage.setItem(Strings.token_jwt, "");
    setIsLogged(false);
  };

  const getUserData = async () => {
    const token = await AsyncStorage.getItem(Strings.token_jwt);
    return JSON.parse(token);
  };

  const login = async (token: any) => {
    if (token) {
      try {
        await AsyncStorage.setItem(Strings.token_jwt, JSON.stringify(token));
        setIsLogged(true);
      } catch (error) {
        console.error("Error storing token:", error);
      }
    }
  };

  return (
    <ApiContext.Provider
      value={{ logout, login, isLogged, isLoading, setIsLoading, getUserData }}
    >
      {!isLoading ? children : <LoadingPage />}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextProps => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
