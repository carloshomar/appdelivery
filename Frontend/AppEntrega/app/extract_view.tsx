import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ScrollView,
} from "react-native";
import Texts from "@/constants/Texts";
import helper from "@/helpers/helper";
import { useRoute } from "@react-navigation/native";
import Colors from "@/constants/Colors";
import Strings from "@/constants/Strings";

function ExtractView() {
  const route = useRoute();

  const {
    distance,
    status,
    deliveryValue,
    user,
    establishment,
    order_id,
    operationDate,
  } = route?.params as any;

  const handleShare = () => {
    const textToShare = `${Texts.establishment}:\nNome: ${
      establishment.name
    }\n${Texts.localizacao}: ${establishment.location_string}\n\n${
      Texts.pedido
    }:\nID: ${order_id}\n${Texts.data}: ${helper.formatDate(
      operationDate
    )}\n\n${Texts.entrega}:\n${Texts.cliente}: ${user.nome}\n${
      Texts.distancia
    }: ${distance?.toFixed(2) ?? ""} ${
      Texts.km
    }\nValor: ${helper.formatCurrency(deliveryValue)}\n
    `;

    Share.share({
      message: textToShare,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{Texts.establishment}</Text>
          <Text style={styles.info}>
            {Texts.nome}: {establishment.name}
          </Text>
          <Text style={styles.info}>
            {Texts.localizacao}: {establishment.location_string}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{Texts.pedido}</Text>
          <Text style={styles.info}>ID: {order_id}</Text>
          <Text style={styles.info}>
            {Texts.data}: {helper.formatDate(operationDate)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{Texts.entrega}</Text>
          <Text style={styles.info}>
            {Texts.cliente}: {user.nome}
          </Text>
          <Text style={styles.info}>
            {Texts.distancia}: {distance?.toFixed(2) ?? ""} {Texts.km}
          </Text>
          <Text style={styles.info}>
            {Texts.valor}: {helper.formatCurrency(deliveryValue)}
          </Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>{Texts.compartilhar}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.white,
    marginTop: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  shareButton: {
    backgroundColor: Colors.dark.tint,
    padding: 15,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  shareButtonText: {
    fontWeight: "500",
    color: Colors.light.white,
  },
});

export default ExtractView;
