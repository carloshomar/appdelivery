import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import helpers from "@/helpers/helpers";
import Texts from "@/constants/Texts";

const EstablishmentView = ({ item, onPress }) => {
  const [distance, setDistance] = useState(null);
  async function init() {
    try {
      const result = await helpers.calcularDistancia(item.lat, item.long);
      setDistance(result);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    init();
  }, []);

  return (
    <TouchableOpacity onPress={onPress} style={styles.establishmentContainer}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.establishmentImage} />
      ) : null}
      <View style={styles.establishmentDetails}>
        <Text style={styles.establishmentName}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.description}>
          {distance ? distance?.toFixed(1) : null} {distance ? Texts.km : null}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  establishmentContainer: {
    marginBottom: 10,
    flexDirection: "row-reverse",
    width: "100%",

    borderBottomColor: Colors.light.tabIconDefault,
    borderBottomWidth: 1,
    paddingBottom: 10,
    alignContent: "center",
    alignItems: "center",
  },
  establishmentDetails: {
    justifyContent: "space-between",
    flex: 1,
    padding: 10,
    gap: 5,
  },
  establishmentImage: {
    width: 80,
    height: 80,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
    marginRight: 5,
    borderRadius: 5,
  },
  establishmentName: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.light.text,
  },

  description: {
    width: "95%",
    color: Colors.light.secondaryText,
    fontSize: 12.5,
    textAlign: "justify",
  },
});

export default EstablishmentView;
