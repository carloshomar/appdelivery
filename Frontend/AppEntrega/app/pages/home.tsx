import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
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
import { useIsFocused } from "@react-navigation/native";
import { useAuthApi } from "@/contexts/AuthContext";
import Config from "@/constants/Config";
import deliveryModel from "@/services/delivery.model";

export default function Home() {
  const {
    disponivel,
    setDisponivel,
    isActiveOrder,
    inWork,
    mylocation,
    setMyLocation,
  } = useAuthApi();

  const nav = useNavigation();
  const intervalRef = useRef<any>(null);

  const [formatView, setFormatView] = useState<"list" | "map">("map");
  const [loading, setLoading] = useState(false);
  const [markers, setMarkers] = useState<any>([]);
  const isFocused = useIsFocused();
  const [hasStart, setHasStart] = useState(false);

  const mapViewRef = React.useRef(null);

  const centerMapOnUser = () => {
    if (mylocation) {
      const { latitude, longitude } = mylocation.coords ?? {
        latitude: 0,
        longitude: 0,
      };
      if (mapViewRef.current)
        mapViewRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.003,
        });
    }
  };

  async function getPermission() {
    try {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status === "granted") return true;
    } catch (e) {
      console.log(e);
    }

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") return true;
    } catch (e) {
      console.log(e);
    }

    return false;
  }

  async function start() {
    try {
      const status = await getPermission();
      if (!status) {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMyLocation({
        ...location,
        coords: {
          ...location.coords,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function disponify(focused = true, loader = true) {
    if (loader) setLoading(true);

    const marks = await deliveryModel.getLocation(mylocation);
    console.log(marks);
    const final = [...(marks ?? []), helper.getMarkerUser(mylocation)];
    setMarkers(final);

    if (focused) {
      centerMapOnUser();
    }

    setLoading(false);
  }

  async function clearMap() {
    setMarkers([]);
  }

  useEffect(() => {
    const iniciarIntervalo = () => {
      start();

      intervalRef.current = setInterval(() => {
        start();
        disponify(false, false);
      }, Config.msUpdateOffDelivery);
    };

    iniciarIntervalo();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      disponify(false, false);
    }
  }, [isFocused]);

  useEffect(() => {
    setTimeout(() => {
      if (!hasStart && mylocation?.coords) {
        centerMapOnUser();
        setHasStart(true);
      }
      if (disponivel) {
        disponify(false, false);
      }
    }, 500);
  }, [mylocation]);

  return (
    <View style={styles.container}>
      <HeaderDelivery
        loading={loading}
        disponivel={disponivel}
        disabled={loading}
        inWork={inWork}
        headerView={formatView === "map"}
        onDisponivel={(disp: boolean) => {
          if (!disp) {
            clearMap();
          } else {
            disponify();
          }
          setDisponivel(disp);
        }}
      />
      {formatView === "map" ? (
        <MapView
          ref={mapViewRef}
          style={styles.map}
          googleMapId="googleMapId"
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
            >
              {marker?.icon ? (
                <Image source={marker?.icon} style={styles.markerImage} />
              ) : null}

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
      ) : null}

      {formatView === "list" ? (
        <FlatList
          data={markers.filter((x: any) => x.name)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.containers}
              onPress={() =>
                item.isEstablishment
                  ? nav.navigate("modal", { establishment: item })
                  : null
              }
            >
              <Text style={styles.name}>{item?.name}</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ ...styles.distance }}>
                  {item.distance?.toFixed(1)}
                  {Texts.km}
                </Text>
                <Text style={{ ...styles.valueDelivery, marginTop: 5 }}>
                  {helper.formatCurrency(item?.valueDelivery)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            backgroundColor: Colors.light.white,

            marginTop: 150,
          }}
        />
      ) : null}

      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => setFormatView(formatView === "list" ? "map" : "list")}
      >
        {formatView === "map" ? (
          <MaterialIcons name="list" size={24} color="white" />
        ) : (
          <MaterialIcons name="map" size={24} color="white" />
        )}
      </TouchableOpacity>

      {formatView === "map" ? (
        <TouchableOpacity
          style={{ ...styles.centerButton, bottom: 76 }}
          onPress={() => {
            centerMapOnUser();
            isActiveOrder();
          }}
        >
          <MaterialIcons name="my-location" size={24} color="white" />
        </TouchableOpacity>
      ) : null}
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
    minHeight: "100%",
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
  containers: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tabIconDefault,
  },
  name: {
    fontSize: 18,
    fontWeight: "400",
  },
  distance: {
    fontSize: 16,
    fontWeight: "300",
  },
  valueDelivery: {
    fontSize: 17,
    fontWeight: "500",
    color: "green",
  },
});
