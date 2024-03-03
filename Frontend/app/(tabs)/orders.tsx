import { ScrollView, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

export default function TabTwoScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text className="font-bold text-2xl">Tela Pedidos</Text>
    </ScrollView>
  );
}

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
