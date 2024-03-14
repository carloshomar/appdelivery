// TabOneScreen.js
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text } from "react-native";
import { View } from "@/components/Themed";
import api from "@/services/api";
import { useApi } from "@/contexts/ApiContext";
import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderMain from "@/components/HeaderMain";
import { useCartApi } from "@/contexts/ApiCartContext";
import { APP_MODE, APP_MODE_OPTIONS } from "@/config/config";
import EstablishmentView from "@/components/EstablishmentView";
import ProductCategory from "./pages/porducts/ProductCategory";

export default function Establishment() {
  const [cadProdcts, setData] = useState<any>([]);
  const { establishment } = useCartApi();
  const insets = useSafeAreaInsets();

  const init = async () => {
    try {
      const { data } = await api.get(
        "/api/order/categories/product/" + establishment.id
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
