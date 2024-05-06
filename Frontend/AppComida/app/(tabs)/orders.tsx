import { Image, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import OrderSummary from "@/components/OrderSummary";
import { useEffect, useState } from "react";
import { useApi } from "@/contexts/ApiContext";
import { useIsFocused } from "@react-navigation/native";
import Texts from "@/constants/Texts";
import helpers from "@/helpers/helpers";
import Strings from "@/constants/Strings";
import orderModel from "@/services/order.model";

export default function TabTwoScreen() {
  const { getUserData } = useApi();
  const [myOrders, setMyOrders] = useState([]);
  const isFocused = useIsFocused();
  const [intervalId, setIntervalId] = useState<any>(null);

  function sortObjectsByLastModified(arr: any) {
    arr.sort((a: any, b: any) => {
      if (a.lastModified === undefined) {
        return -1;
      } else if (b.lastModified === undefined) {
        return 1;
      } else {
        return 0;
      }
    });
    return arr;
  }

  async function getMyOrders() {
    const userData = await getUserData();
    if (!userData?.phone) {
      return;
    }

    const data = await orderModel.getOrders(userData?.phone);
    setMyOrders(sortObjectsByLastModified(data));
  }

  useEffect(() => {
    if (isFocused) {
      getMyOrders();
      const idinterval = setInterval(() => {
        getMyOrders();
      }, Strings.wait_interval);

      setIntervalId(idinterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isFocused]);

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center", paddingTop: 10 }}>
        {myOrders?.map((e: any) => {
          return (
            <View style={styles.containerStyle}>
              <View style={styles.contStl}>
                <View style={styles.container2}>
                  <View style={styles.container3}>
                    <Image
                      source={{ uri: e?.establishment?.image }}
                      style={styles.imageStyle}
                    />
                    <Text style={styles.text}>{e?.establishment?.name}</Text>
                  </View>
                </View>

                {e.status !== "FINISHED" ? (
                  <View style={styles.fins}>
                    <Text style={styles.codtexts}>Código</Text>

                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      {helpers.genCode(e._id, null) ?? ""}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.context1(e.status)}>
                  <View style={styles.context2(e.status)}>
                    <Text style={styles.codtext2}>
                      {Texts[e.status] ?? e.status}
                    </Text>

                    <Text
                      style={{
                        color: Colors.light.white,
                        fontWeight: "600",
                        fontSize: 13,
                      }}
                    >
                      {e.lastModified
                        ? helpers.formatDate(e.lastModified)
                        : null}
                    </Text>
                  </View>
                </View>
              </View>
              <OrderSummary disabled={true} data={e.cart} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  contStl: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  codtext2: {
    color: Colors.light.white,
    fontWeight: "600",
    fontSize: 13,
  },
  context1: (status: string) => {
    return {
      padding: 5,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor:
        status !== "FINISHED" ? Colors.light.secondaryText : Colors.light.green,
      justifyContent: "center",
      borderRadius: 3,
      height: 35,
      marginTop: 10,
      marginBottom: 10,
    };
  },
  context2: (status: string) => {
    return {
      backgroundColor:
        status !== "FINISHED" ? Colors.light.secondaryText : Colors.light.green,
      flexDirection: "row",
      justifyContent: "space-between",
    };
  },
  codtexts: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  fins: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.light.tabIconDefault,
    padding: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 3,
    marginTop: 10,
  },
  container2: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 19,
    fontWeight: "500",
    color: Colors.light.text,
  },
  container3: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
  },
  containerStyle: {
    borderWidth: 1,
    width: "95%",
    padding: 10,
    borderColor: Colors.light.tabIconDefault,
    borderRadius: 3,
    marginBottom: 10,
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
