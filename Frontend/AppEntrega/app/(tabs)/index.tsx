import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import helper from "@/helpers/helper";
import HeaderDelivery from "@/componentes/HeaderDelivery";
import { useNavigation } from "expo-router";
import Texts from "@/constants/Texts";
import api from "@/services/api";
import Strings from "@/constants/Strings";

export default function Home() {
  const [mylocation, setLocation] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const nav = useNavigation();
  const [loading, setLoading] = useState(false);
  const [disponivel, setDisponivel] = useState(false);
  const [markers, setMarkers] = useState<any>([]);
  const mapViewRef = React.useRef(null);
  const isAndroid = Platform.OS === "android";

  const centerMapOnUser = async () => {
    if (mylocation) {
      const { latitude, longitude } = mylocation.coords;
      mapViewRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.003,
      });
    }
  };

  const generateMarkers = async (
    latitude: number,
    longitude: number,
    numMarkers: number
  ) => {
    const generatedMarkers = [];

    for (let i = 1; i <= numMarkers; i++) {
      const newLocation = await helper.calculateNewCoordinates(
        latitude,
        longitude,
        i * 50
      );

      generatedMarkers.push({
        id: i,
        name: `Burger Shop - Matriz ${i}`,
        location: "Rua Dona Joana de Paiva Gusmão, 43, jardim",
        coordinates: newLocation,
        isEstablishment: true,
        valueDelivery: (i / 12.8) * 25,
        distance: (i / 12) * 10,
      });
    }

    return generatedMarkers;
  };

  async function start() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permissão para acessar a localização negada");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation({
      ...location,
      coords: {
        ...location.coords,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  }

  function getMarkerUser() {
    return {
      id: 3,
      title: "Marker 2",
      coordinates: {
        latitude: mylocation.coords.latitude,
        longitude: mylocation.coords.longitude,
      },
      icon: require("../../assets/images/deliveryman_icon.png"),
    };
  }

  async function disponify(focused = true) {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/api/delivery/solicitation-orders?latitude=${mylocation.coords.latitude}&longitude=${mylocation.coords.longitude}&limitDistance=${Strings.distance_delivery_distance}`
      );

      const marks = data.map((mak: any) => {
        return {
          id: mak.establishmentId,
          name: mak.establishment.name,
          location: "Rua Dona Joana de Paiva Gusmão, 43, jardim",
          coordinates: {
            latitude: mak.establishment.lat,
            longitude: mak.establishment.long,
          },
          isEstablishment: true,
          valueDelivery: mak.deliveryValue,
          distance: mak.distance,
        };
      });
      console.log(marks);
      const final = [...marks, getMarkerUser()];

      setMarkers(final);
      if (focused) {
        centerMapOnUser();
      }
    } catch (e) {
      console.log(e);
      setMarkers([getMarkerUser()]);
    }
    setLoading(false);
  }

  async function clearMap() {
    setMarkers([]);
  }

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      centerMapOnUser();
    }, 400);
  }, [mylocation]);

  return (
    <View style={styles.container}>
      <HeaderDelivery
        loading={loading}
        disponivel={disponivel}
        onDisponivel={(disp: boolean) => {
          if (!disp) {
            clearMap();
          } else {
            disponify();
          }
          setDisponivel(disp);
        }}
      />
      <MapView
        ref={mapViewRef}
        style={styles.map}
        initialRegion={{
          latitude: mylocation?.coords.latitude || 0,
          longitude: mylocation?.coords.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker: any) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinates}
            onPress={() =>
              marker.isEstablishment
                ? nav.navigate("modal", { establishment: marker })
                : null
            }
            image={isAndroid ? marker?.icon : null}
          >
            {!isAndroid && (
              <Image source={marker?.icon} style={styles.markerImage} />
            )}
            {marker.isEstablishment ? (
              <TouchableOpacity style={styles.calloutContainer}>
                <View style={styles.calloutRow}>
                  <FontAwesome6
                    name="money-bill"
                    size={17}
                    color={Colors.light.secondaryText}
                  />
                  <Text style={styles.calloutText}>
                    {helper.formatCurrency(marker.valueDelivery)}
                  </Text>
                </View>
                <View style={styles.calloutRow}>
                  <MaterialCommunityIcons
                    name="bike-fast"
                    size={17}
                    color={Colors.light.secondaryText}
                  />
                  <Text style={styles.calloutText}>
                    {marker.distance.toFixed(1)}
                    {Texts.km}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity style={styles.centerButton} onPress={centerMapOnUser}>
        <MaterialIcons name="my-location" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  markerImage: {
    width: 70,
    height: 50,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  calloutContainer: {
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.tabIconDefault,
    borderWidth: 1,
    borderRadius: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    // borderBottomRightRadius: 0,
    gap: 5,
    paddingTop: 5,
    paddingBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    paddingRight: 5,
  },
  calloutRow: {
    flexDirection: "row",
    width: "100%",
    paddingLeft: 10,
    alignContent: "center",
    alignItems: "center",
  },
  calloutText: {
    marginLeft: 10,
    color: Colors.light.text,
  },
  centerButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: Colors.light.tint,
    borderRadius: 50,
    padding: 10,
  },
});
