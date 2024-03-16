import { Linking, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { SwipeButton } from "react-native-expo-swipe-button";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Texts from "@/constants/Texts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { useRoute } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import helper from "@/helpers/helper";
import SwipeButtonDelivery from "@/componentes/SwipButton";

export default function ModalScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { establishment }: any = route.params;
  const mapViewRef = useRef(null);

  const centerMapOnUser = async () => {
    const { latitude, longitude } = establishment.coordinates;
    mapViewRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.003,
    });
  };

  const acceptEntrega = () => {
    console.log(establishment);
  };

  const openMap = () => {
    const { latitude, longitude } = establishment.coordinates;
    const label = establishment.name;

    const url = Platform.select({
      ios: `maps://${latitude},${longitude}?q=`,
      android: "geo:${latitude},${longitude}?q=",
    });

    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  useEffect(() => {
    setTimeout(() => {
      centerMapOnUser();
    }, 200);
  }, []);

  return (
    <View style={{ ...styles.container, paddingBottom: insets.bottom }}>
      <View>
        <View style={styles.boxOne}>
          <View style={styles.nameContainer}>
            <Text style={{ fontSize: 20 }}>{establishment.name}</Text>
            <Text style={styles.locationText}>
              {establishment.location_string}
            </Text>
          </View>
          <TouchableOpacity style={styles.btnMap} onPress={openMap}>
            <FontAwesome name="map" size={25} color={Colors.light.tint} />
            <Text style={styles.maptext}>{Texts.maps}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{ ...styles.boxOne, marginTop: 10, flexDirection: "column" }}
        >
          <Text style={styles.textMap}>{Texts.maps}</Text>
          <MapView
            style={styles.mapView}
            ref={mapViewRef}
            initialRegion={{
              latitude: establishment.coordinates.latitude | 0,
              longitude: establishment.coordinates.longitude | 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              key={establishment.id}
              coordinate={establishment.coordinates}
            ></Marker>
          </MapView>
        </View>

        <View
          style={{ ...styles.boxOne, marginTop: 10, flexDirection: "column" }}
        >
          <View style={styles.valores}>
            <Text style={styles.valueText}>{Texts.valorEntrega}</Text>
            <Text style={{ ...styles.valueText, fontSize: 16 }}>
              {helper.formatCurrency(establishment.valueDelivery)}
            </Text>
          </View>
          <View style={{ ...styles.valores, marginTop: 10 }}>
            <Text style={styles.valueText}>{Texts.distancia}</Text>
            <Text style={{ ...styles.valueText, fontSize: 16 }}>
              {establishment.distance.toFixed(1)}
              {Texts.km}
            </Text>
          </View>
        </View>
      </View>
      <SwipeButtonDelivery
        title={Texts.aceitar_entrega}
        onComplete={() => acceptEntrega()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    height: "100%",
    padding: 10,
    justifyContent: "space-between",
  },
  switTextStyle: { color: Colors.light.tint, fontWeight: "600", fontSize: 16 },
  swipContainer: {
    borderWidth: 0.8,
    borderColor: Colors.light.tint,
  },
  maptext: { color: Colors.light.tint, marginTop: 5 },
  nameContainer: {
    backgroundColor: Colors.light.white,
    width: "80%",
    paddingRight: 15,
  },
  mapView: {
    width: "100%",
    height: 200,
    borderColor: Colors.light.background,
    borderWidth: 1,
  },
  valueText: { fontWeight: "500", fontSize: 15 },
  locationText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "left",
  },
  valores: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.light.white,
    width: "100%",
  },
  textMap: {
    alignSelf: "flex-start",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "500",
  },
  btnMap: {
    padding: 10,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.tint,
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: 15,
    paddingRight: 14,
  },
  boxOne: {
    width: "100%",

    backgroundColor: Colors.light.white,
    borderRadius: 5,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-arround",
    alignContent: "center",
    alignItems: "center",
  },
  btns: {
    backgroundColor: Colors.dark.tint,
    padding: 15,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
