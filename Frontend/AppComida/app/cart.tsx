// components/ProductPage.js
import HeaderMain from "@/components/HeaderMain";
import OrderSummary from "@/components/OrderSummary";
import OrderSummaryWithTotal from "@/components/OrderSummaryWithTotal";
import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { useCartApi } from "@/contexts/ApiCartContext";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import PaymentComponent from "@/components/PaymentComponent";
import { useApi } from "@/contexts/ApiContext";

const cart = () => {
  const { setHiddenCart, cart, paymentMethod, submitCart, distance } =
    useCartApi();

  const [load, setLoad] = useState(false);

  const { getUserData } = useApi();

  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  async function handlerSubmit() {
    setLoad(true);
    try {
      const res = await submitCart(await getUserData());

      if (res) {
        nav.goBack();
        nav.navigate("orders");
      }
    } catch (e) {
      console.log(e);
    }
    setLoad(false);
  }

  useEffect(() => {
    setHiddenCart(true);
    nav.addListener("blur", () => {
      setHiddenCart(false);
    });
  }, [nav]);

  useEffect(() => {
    if (cart.length <= 0) {
      nav.goBack();
    }
  }, [cart]);

  return (
    <View
      style={{
        ...styles.container,
        paddingBottom: Platform.OS === "android" ? 10 : insets.bottom,
      }}
    >
      <ScrollView style={{ height: "95%" }}>
        <HeaderMain />

        <OrderSummary data={cart} />

        <OrderSummaryWithTotal data={cart} />
        <PaymentComponent
          title={Texts[paymentMethod.type]}
          icon={paymentMethod.icon}
        />
      </ScrollView>
      <TouchableOpacity
        style={{ ...styles.btns, opacity: !distance || load ? 0.8 : 1 }}
        onPress={() => handlerSubmit()}
        disabled={!distance || load}
      >
        {!load ? (
          <>
            <Text style={styles.txtFinal}>{Texts.finalizar_pagamento}</Text>
            <MaterialIcons name="check" size={20} color={Colors.light.white} />
          </>
        ) : (
          <>
            <Text style={styles.txtFinal}>{Texts.finalizando_pedido}</Text>
            <ActivityIndicator
              size={20}
              color={Colors.light.white}
              style={{ alignSelf: "center" }}
            />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  txtFinal: {
    fontWeight: "500",
    color: Colors.light.white,
  },
  btns: {
    width: "95%",
    backgroundColor: Colors.dark.tint,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  container: {
    backgroundColor: Colors.light.white,
    minHeight: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default cart;
