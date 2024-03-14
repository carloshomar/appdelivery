// TabOneScreen.js
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text } from "react-native";

import api from "@/services/api";

import Colors from "@/constants/Colors";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { APP_MODE, APP_MODE_OPTIONS } from "@/config/config";
import EstablishmentView from "@/components/EstablishmentView";
import Establishment from "../establishment";
import { useCartApi } from "@/contexts/ApiCartContext";
import { useNavigation } from "@react-navigation/native";

export default function index() {
  return (
    <>{APP_MODE == APP_MODE_OPTIONS.unique ? <Establishment /> : TabTwo()}</>
  );
}

function TabTwo() {
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const insets = useSafeAreaInsets();
  const { setEstablishment } = useCartApi();
  const nav = useNavigation();
  async function init() {
    try {
      const { data } = await api.get("/api/auth/establishments");
      setEstabelecimentos(data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <ScrollView
      style={{
        backgroundColor: Colors.light.background,
        paddingTop: insets.top,
      }}
      showsVerticalScrollIndicator={false}
    >
      {estabelecimentos.map((e) => (
        <EstablishmentView
          item={e}
          onPress={() => {
            setEstablishment(e);
            nav.navigate("establishment");
          }}
        />
      ))}
    </ScrollView>
  );
}
