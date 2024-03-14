import { Image, ScrollView, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import OrderSummaryWithTotal from "@/components/OrderSummaryWithTotal";
import { useCartApi } from "@/contexts/ApiCartContext";
import OrderSummary from "@/components/OrderSummary";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useApi } from "@/contexts/ApiContext";

export default function TabTwoScreen() {
  const { establishment } = useCartApi();
  const { getUserData } = useApi();
  const [myOrders, setMyOrders] = useState([]);

  const { image, name } = establishment;

  async function getMyOrders() {
    try {
      const userData = await getUserData();
      if (!userData?.phone) {
        return;
      }
      const { data } = await api.get(
        "/api/order/orders/list-phone/" + userData.phone
      );
      setMyOrders(data);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  useEffect(() => {
    getMyOrders();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center", paddingTop: 10 }}>
        {myOrders?.map((e) => {
          return (
            <View style={containerStyle}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Image source={{ uri: image }} style={imageStyle} />
                <Text>{name}</Text>
              </View>
              <OrderSummary disabled={true} data={e.cart} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const containerStyle = {
  borderWidth: 1,
  width: "95%",
  padding: 10,
  borderColor: Colors.light.tabIconDefault,
  borderRadius: 3,
  marginBottom: 10,
};

const imageStyle = {
  width: 50,
  height: 50,
  borderRadius: 50,
  borderWidth: 1,
  borderColor: Colors.light.tabIconDefault,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
