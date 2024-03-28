import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import HeaderDelivery from "@/componentes/HeaderDelivery";
import { useAuthApi } from "@/contexts/AuthContext";
import helper from "@/helpers/helper";
import MinimizableModal from "@/componentes/ModalMinimize";
import { useIsFocused } from "@react-navigation/native";
import Config from "@/constants/Config";

function HomeDelivery() {
  const mapViewRef = useRef(null);

  const {
    inWork,
    disponivel,
    isActiveOrder,
    mylocation,
    setMyLocation,
    socketMessage,
  } = useAuthApi();

  const [markers, setMarkers] = useState<any>([]);
  const isAndroid = Platform.OS === "android";
  const isFocused = useIsFocused();
  const [hasFirst, setHasFirst] = useState(false);

  const centerMapOnUser = async () => {
    if (mylocation) {
      const { latitude, longitude } = mylocation.coords;
      mapViewRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.003,
      });
    }
    const firstOrder = inWork.order[0];
    setMarkers([
      helper.getMarkerClient(
        firstOrder.location.coords.latitude,
        firstOrder.location.coords.longitude
      ),
      helper.getMarkerEstablishment(
        firstOrder.establishment.lat,
        firstOrder.establishment.long
      ),
      helper.getMarkerUser(mylocation),
    ]);
  };

  async function start() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
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
  }

  useEffect(() => {
    start();
    setInterval(() => {
      isActiveOrder();
    }, Config.msUpdateInDelivery);
  }, []);

  useEffect(() => {
    if (!hasFirst && mylocation?.coords) {
      centerMapOnUser();
      setHasFirst(true);
    }
  }, [mylocation]);

  useEffect(() => {
    if (isFocused) {
      isActiveOrder();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <HeaderDelivery
        loading={false}
        disponivel={disponivel}
        inWork={inWork}
        disabled={true}
        onDisponivel={(disp: boolean) => {}}
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
            onPress={() => {}}
          >
            {marker?.icon ? (
              <Image source={marker?.icon} style={styles.markerImage} />
            ) : null}
          </Marker>
        ))}
      </MapView>
      <MinimizableModal />

      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => {
          centerMapOnUser();
          isActiveOrder();
        }}
      >
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
    minHeight: "100%",
  },
  centerButton: {
    position: "absolute",
    bottom: "15%",
    marginBottom: 15,
    right: 16,
    backgroundColor: Colors.light.tint,
    borderRadius: 50,
    padding: 10,
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
});

export default HomeDelivery;
