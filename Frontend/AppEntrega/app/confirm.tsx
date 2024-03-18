import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import Texts from "@/constants/Texts";
import helper from "@/helpers/helper";
import api from "@/services/api";
import { useAuthApi } from "@/contexts/AuthContext";

const ConfirmScreen = () => {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const route = useRoute();
  const { isActiveOrder } = useAuthApi();
  const { order, delivery } = route.params as any;

  async function aceitarRota() {
    try {
      const { data } = await api.put(
        "/api/delivery/solicitation-orders/hand-shake",
        {
          order_id: order.order_id,
          deliveryman: delivery,
        }
      );
      await isActiveOrder();

      nav.navigate("(tabs)");
    } catch (error) {
      await isActiveOrder();

      if (error.response) {
        Alert.alert(
          "",
          error.response.data.error,
          [
            {
              text: "OK",
              onPress: () => nav.navigate("(tabs)"),
            },
          ],
          { cancelable: false }
        );
      } else if (error.request) {
        console.log("Sem resposta do servidor:", error.request);
      } else {
        console.log("Erro ao processar a solicitação:", error.message);
      }
    }
  }

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom, paddingTop: insets.top },
      ]}
    >
      <View style={styles.content}>
        <Text style={{ ...styles.text, marginBottom: 30 }}>
          {Texts.aceitar_rota}
        </Text>
        <Text style={styles.text}>
          {helper.formatCurrency(order.valueDelivery)}
        </Text>
        <Text style={{ ...styles.description, marginTop: 30 }}>
          {order.distance.toFixed(1)}
          {Texts.km} -{" "}
          {helper.calcularDistanciaMediaDeBike(order.distance).toFixed(1)}{" "}
          {Texts.minutos}
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => aceitarRota()}
          style={{ ...styles.button, ...styles.acceptButton }}
        >
          <Text style={{ ...styles.buttonText, color: Colors.light.tint }}>
            {Texts.aceitar}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={[styles.button, styles.rejectButton]}
        >
          <Text style={{ ...styles.buttonText, color: Colors.light.white }}>
            {Texts.voltar}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.tintHard,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: "100%",
  },
  content: {
    alignItems: "center",
    marginTop: "30%",
  },
  text: {
    fontSize: 40,
    color: Colors.light.white,

    fontWeight: "600",
    textAlign: "center",
  },
  description: {
    fontSize: 20,
    color: Colors.light.white,
    textAlign: "center",
    marginTop: 20,
  },
  buttons: {
    width: "100%",
  },
  button: {
    paddingVertical: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: Colors.light.white,
  },
  rejectButton: {
    backgroundColor: Colors.light.tintHard,
    borderWidth: 1,
    borderColor: Colors.light.white,
    color: Colors.light.white,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ConfirmScreen;
