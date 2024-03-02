// TabOneScreen.js
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text } from "react-native";
import { View } from "@/components/Themed";
import ProductCategory from "../pages/porducts/ProductCategory"; // Importando o novo componente
import api from "@/services/api";
import { ESTABLISHMENT, ESTABLISHMENT_ID } from "@/config/config";
import { useApi } from "@/contexts/ApiContext";
import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderMain from "@/components/HeaderMain";

export default function TabOneScreen() {
  const [cadProdcts, setData] = useState<any>([]);
  const { setIsLoading, isLoading } = useApi();
  const insets = useSafeAreaInsets();

  const init = async () => {
    try {
      const { data } = await api.get(
        "/api/order/categories/product/" + ESTABLISHMENT_ID
      );
      setData(data);
    } catch (e) {
      alert(e);
    }
  };

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
      <HeaderMain hiddenOpen={true} />
      {cadProdcts?.map((category: any) => (
        <View style={{ width: "100%" }}>
          <ProductCategory key={category.Id} category={category} />
        </View>
      ))}
      <View style={{ height: 50 }}></View>
    </ScrollView>
  );
}
