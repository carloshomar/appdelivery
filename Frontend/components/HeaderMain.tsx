import React, { useEffect, useState } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Text } from "./Themed";
import Texts from "@/constants/Texts";

import Colors from "@/constants/Colors";
import { useCartApi } from "@/contexts/ApiCartContext";
import helpers from "@/helpers/helpers";

function HeaderMain({ hiddenOpen }: any) {
  const { establishment } = useCartApi();
  const [distance, setDistance] = useState(null);

  async function init() {
    const rs = await helpers.calcularDistancia(
      establishment.lat,
      establishment.long
    );
    setDistance(rs);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{establishment.name}</Text>
        {hiddenOpen && (
          <View style={styles.infoContainer}>
            <Text style={styles.secondaryText}>
              {Texts.aberto_ate} {establishment.horarioFuncionamento}{" "}
              {distance ? "/ " : null}
            </Text>
            {distance && distance < establishment.max_distance_delivery ? (
              <Text style={styles.secondaryText}>
                {distance.toFixed(1)} {Texts.km}
              </Text>
            ) : null}

            {distance && distance > establishment.max_distance_delivery ? (
              <Text style={styles.secondaryText}>
                {Texts.fora_area_delivery}
              </Text>
            ) : null}
          </View>
        )}
      </View>
      <Image source={{ uri: establishment.image }} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingBottom: 0,
    borderBottomColor: Colors.light.tabIconDefault,
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 23,
    fontWeight: "600",
  },
  infoContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
  secondaryText: {
    color: Colors.light.secondaryText,
    paddingBottom: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default HeaderMain;
