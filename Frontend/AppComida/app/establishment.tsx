import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { View } from "@/components/Themed";
import api from "@/services/api";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderMain from "@/components/HeaderMain";
import { useCartApi } from "@/contexts/ApiCartContext";
import ProductCategory from "./pages/porducts/ProductCategory";
import helpers from "@/helpers/helpers";
import Texts from "@/constants/Texts";

export default function Establishment() {
  const [cadProdcts, setCadProdcts] = useState<any>([]);
  const { establishment } = useCartApi();
  const insets = useSafeAreaInsets();

  const init = async () => {
    try {
      const categories = await api.get(
        "/api/order/categories/product/" + establishment.id
      );

      const produtos = await api.get("/api/order/products/" + establishment.id);

      setCadProdcts([
        ...categories.data,
        {
          Id: 9999,
          Name: Texts.todos,
          EstablishmentId: establishment.id,
          Products: helpers.orderByImage(produtos.data),
        },
      ]);
    } catch (e) {
      console.log(e);
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
      <HeaderMain hiddenOpen={true} hiddenBack={false} />
      {cadProdcts?.map((category: any) => (
        <View style={{ width: "100%" }}>
          <ProductCategory key={category.Id} category={category} />
        </View>
      ))}
      <View style={{ height: 50 }}></View>
    </ScrollView>
  );
}
