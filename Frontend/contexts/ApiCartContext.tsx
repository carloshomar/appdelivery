import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { useNavigation } from "@react-navigation/native";
import helpers from "@/helpers/helpers";
import { ESTABLISHMENT } from "@/config/config";
import * as Location from "expo-location";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Strings from "@/constants/Strings";

interface ApiContextProps {
  cart: object[];
  addCart(item: object): void;
  removeCart(item: object): void;
  editCart(item: object): void;
  cleanCart(): void;
  setPaymentMethod(method: object): void;
  submitCart(user: any): boolean;

  validDelivery(): boolean;
  paymentMethod: any;
  deliveryValue: number | null;

  setHiddenCart(state: boolean): void;
  getValueDelivery(ns: number): Promise<any>;
  distance: number | null;
  setMyLocation(location: object): void;
  location: any;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

interface ApiCartProviderProps {
  children: ReactNode;
}

export const ApiCartProvider: React.FC<ApiCartProviderProps> = ({
  children,
}) => {
  const [cart, setCart] = useState<object[]>([]);
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const [hiddenCart, setHiddenCart] = useState(false);
  const [distance, setDistance] = useState<null | number>(null);
  const [deliveryValue, setDeliveryValue] = useState<null | number>(0);

  const [location, setLocation] = useState({
    cep: null,
    logradouro: null,
    complemento: null,
    bairro: null,
    localidade: null,
    uf: null,
    ibge: null,
    gia: null,
    numero: null,
    ddd: null,
    siafi: null,
  });

  const [paymentMethod, setPaymentMethod] = useState(ESTABLISHMENT.payment[0]);

  const cleanCart = () => {
    setCart([]);
  };

  const addCart = (item: object) => {
    setCart([...cart, { ...item, id: helpers.generateId(15) }]);
  };

  const removeCart = (item: any) => {
    const final = cart.filter((e: any) => e.id !== item.id);
    setCart(final);
  };

  const editCart = (item: any) => {
    const final = cart.map((e: any) => (e.id === item.id ? item : e));
    setCart(final);
  };

  const validDelivery = () => {
    if (!distance || distance > ESTABLISHMENT.coords.max_distancy_delivery) {
      return false;
    }
    return true;
  };

  const calcularDistancia = async () => {
    try {
      // Solicitar permissão para acessar a localização do dispositivo
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permissão de localização negada");
        return null;
      }

      // Obter a localização atual do usuário
      const localizacaoAtual = await Location.getCurrentPositionAsync({});
      const { latitude: origemLatitude, longitude: origemLongitude } =
        localizacaoAtual.coords;

      // Calcular a distância usando a fórmula de Haversine
      const distancia = haversineDistancia(
        origemLatitude,
        origemLongitude,
        ESTABLISHMENT.coords.lat,
        ESTABLISHMENT.coords.long
      );

      return distancia;
    } catch (error) {
      console.error("Erro ao obter a localização:", error);
      return null;
    }
  };

  const haversineDistancia = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Raio da Terra em quilômetros
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distância em quilômetros

    return distancia;
  };

  const deg2rad = (deg: any) => {
    return deg * (Math.PI / 180);
  };

  const getValueDelivery = async (ns: number) => {
    try {
      const { data } = await api.post(
        "/api/order/delivery/calculate-delivery-value",
        {
          distance: ns,
        }
      );

      return data.deliveryValue;
    } catch (e) {
      return null;
    }
  };

  async function getMyLocationStorange() {
    const locs = await AsyncStorage.getItem(Strings.token_location);
    if (locs) {
      setLocation(JSON.parse(locs));
    }
  }

  async function setMyLocation(locs: any) {
    await AsyncStorage.setItem(Strings.token_location, JSON.stringify(locs));
    setLocation(locs);
  }

  async function init() {
    try {
      const dist = await calcularDistancia();
      setDistance(dist);

      await getMyLocationStorange();
      if (dist) {
        const distVal = await getValueDelivery(dist);
        setDeliveryValue(distVal);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function submitCart(user: any) {
    if (!validDelivery()) {
      Alert.alert("", Texts.erroPedido);
      return false;
    }

    const body = {
      cart,
      distance,
      location,
      paymentMethod,
      deliveryValue,
      user,
      establishmentId: ESTABLISHMENT.id,
    };

    try {
      const { data } = await api.post(`/api/order/orders`, body);
      setCart([]);
      return true;
    } catch (e) {
      Alert.alert("", Texts.erroPedido);
      return false;
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        addCart,
        editCart,
        cleanCart,
        removeCart,
        submitCart,
        setMyLocation,
        getValueDelivery,
        validDelivery,
        setHiddenCart,
        setPaymentMethod,

        cart,
        distance,
        location,
        paymentMethod,
        deliveryValue,
      }}
    >
      {children}
      {!hiddenCart && cart.length !== 0 && (
        <TouchableOpacity
          style={{ ...styles.cartContainer, paddingBottom: insets.bottom }}
          onPress={() => nav.navigate("cart")}
        >
          <Text
            style={{
              ...styles.cartText,
              color: Colors.light.tint,
            }}
          >
            {Texts.carrinho}
          </Text>
          <Text style={{ ...styles.cartText }}>
            {cart.length.toString().padStart(2, "0")}{" "}
            {cart.length === 1 ? Texts.item : Texts.items}
          </Text>
        </TouchableOpacity>
      )}
    </ApiContext.Provider>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    backgroundColor: Colors.light.white,
    alignContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    marginTop: -20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopColor: Colors.light.tabIconDefault,
    borderTopWidth: 1,
  },
  cartText: {
    fontSize: 18,
    color: Colors.light.tint,
    fontWeight: "400",
  },
});

export const useCartApi = (): ApiContextProps => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useCartApi must be used within an ApiCartProvider");
  }
  return context;
};
