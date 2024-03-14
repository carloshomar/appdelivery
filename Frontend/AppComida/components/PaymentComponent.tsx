import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function PaymentComponent({ title, icon, hiddenTitle = true, onPress }: any) {
  const nav = useNavigation();
  return (
    <View
      style={{
        ...styles.container,
        marginTop: !hiddenTitle ? 0 : undefined,
        borderBottomWidth: !hiddenTitle ? 0 : undefined,
      }}
    >
      {hiddenTitle ? (
        <Text style={styles.pas}>{Texts.metodos_pagamentos}</Text>
      ) : null}
      <TouchableOpacity
        style={{
          ...styles.containerPay,
          marginTop: hiddenTitle ? 15 : 0,
          paddingBottom: hiddenTitle ? 10 : 0,
        }}
        onPress={() => (onPress ? onPress() : nav.navigate("payments"))}
      >
        <View style={styles.icon}>
          <MaterialIcons name={icon} size={20} color={Colors.light.white} />
        </View>
        <Text style={styles.payText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.tabIconDefault,
  },
  payText: {
    fontSize: 16,
    fontWeight: "400",
  },
  containerPay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 15,
    paddingBottom: 10,
    marginLeft: 5,
  },
  pas: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.light.text,
  },
  icon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.light.secondaryText,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});

export default PaymentComponent;
