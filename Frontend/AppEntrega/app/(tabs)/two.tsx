import { ScrollView, StyleSheet, Text, View } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import SolicitationList from "@/componentes/SolicitationList";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuthApi } from "@/contexts/AuthContext";
import Texts from "@/constants/Texts";
import { useIsFocused } from "@react-navigation/native";

export default function TabTwoScreen() {
  const [orders, setOrders] = useState([]);
  const [load, setLoad] = useState(true);
  const { user } = useAuthApi();
  const isFocused = useIsFocused();

  async function init() {
    setLoad(true);
    try {
      const { data } = await api.get(
        "/api/delivery/deliveryman/extrato/" + user.id
      );
      setOrders(data);
    } catch (e) {
      console.log(e);
    }
    setLoad(false);
  }

  useEffect(() => {
    init();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {orders?.length === 0 && !load ? (
        <View style={styles.errocontainer}>
          <Text style={styles.errotext}>{Texts.notfound_extract}</Text>
        </View>
      ) : null}
      <SolicitationList orders={orders} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  errotext: {
    fontSize: 17,
    fontWeight: "400",
  },
  errocontainer: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "30%",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
