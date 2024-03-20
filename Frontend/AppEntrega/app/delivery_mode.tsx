import { Linking, Platform, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Texts from "@/constants/Texts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";

import { useEffect, useRef } from "react";

import { useAuthApi } from "@/contexts/AuthContext";
import { useNavigation } from "expo-router";
import Strings from "@/constants/Strings";
import api from "@/services/api";
import { SwipeButton } from "react-native-expo-swipe-button";
import SwipeButtonDelivery from "@/componentes/SwipButton";

export default function DeliveryMode({ showIcon }: any) {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const mapViewRef = useRef(null);
  const { user, inWork, isActiveOrder } = useAuthApi();
  const order = inWork.order[0];

  const establishment = order.establishment;
  const deliveryman = order.deliveryman;

  const handlerStatus = async () => {
    let newStatus;

    switch (deliveryman.status) {
      case Strings.status_array.IN_ROUTE_COLECT:
        newStatus = Strings.status_array.AWAIT_COLECT;
        break;
      case Strings.status_array.AWAIT_COLECT:
        newStatus = Strings.status_array.IN_ROUTE_DELIVERY;
        break;
      case Strings.status_array.IN_ROUTE_DELIVERY:
        newStatus = Strings.status_array.FINISH;
        break;
      default:
        console.log("Status não reconhecido:", deliveryman.status);
        return;
    }

    try {
      const { data } = await api.post("/api/delivery/deliveryman/status", {
        order_id: order.order_id,
        deliveryman: {
          id: deliveryman.id,
          status: newStatus,
        },
      });
      await isActiveOrder();
    } catch (error) {
      console.error("Erro ao atualizar o status do entregador:", error);
    }
  };

  const onConfirm = () => {
    nav.navigate("confirm_generical");
  };

  const openMap = () => {
    const { lat, long } = establishment;
    const label = establishment.name;

    const url = Platform.select({
      ios: `maps://${lat},${long}?q=`,
      android: "geo:${latitude},${longitude}?q=",
    });

    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  useEffect(() => {
    nav.setOptions({ title: Strings.status_title?.[deliveryman.status] });
  }, [deliveryman.status]);

  return (
    <View
      style={{
        ...styles.container,
        paddingBottom: insets.bottom,
        paddingTop: !showIcon ? 20 : 10,
      }}
    >
      {showIcon ? <View style={styles.viewIcon} /> : null}
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
              latitude: establishment.lat | 0,
              longitude: establishment.long | 0,
              latitudeDelta: 0.001,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              key={establishment.id}
              coordinate={{
                latitude: establishment.lat | 0,
                longitude: establishment.long | 0,
              }}
            ></Marker>
          </MapView>
        </View>
      </View>

      <SwipeButtonDelivery
        title={Texts[deliveryman.status] ?? deliveryman.status}
        onComplete={() => onConfirm()}
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
  viewIcon: {
    width: 70,
    height: 8,
    backgroundColor: Colors.light.secondaryText,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  btns: {
    padding: 15,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.tint,
    borderColor: Colors.dark.tint,
    borderWidth: 1,
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
