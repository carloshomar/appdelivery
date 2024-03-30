import Colors from "@/constants/Colors";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeliveryHappy from "../assets/images/deliveryman_happy.png";
import Texts from "@/constants/Texts";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";

export default function ConfirmGenerical() {
  const nav = useNavigation();
  const route = useRoute();

  const { onConfirm } = route.params;

  return (
    <View style={styles.containers}>
      <View></View>
      <View style={styles.imageContainer}>
        <Image source={DeliveryHappy} style={styles.images} />
        <Text style={styles.textTwo}>{Texts.continue_duvida}</Text>
        <Text style={styles.titleOne}>{Texts.nao_sera_possivel_voltar}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => {
            onConfirm();
            nav.goBack();
          }}
          style={{ ...styles.button, ...styles.acceptButton }}
        >
          <Text style={{ ...styles.buttonText, color: Colors.light.tint }}>
            {Texts.confirmar}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={[styles.button, styles.rejectButton]}
        >
          <Text style={{ ...styles.buttonText, color: Colors.light.white }}>
            {Texts.voltar}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containers: {
    backgroundColor: Colors.light.background,
    alignContent: "center",
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
  },
  textTwo: {
    fontSize: 22,
    fontWeight: "500",
    color: Colors.light.text,
  },
  imageContainer: {
    alignContent: "center",
    alignItems: "center",
  },
  images: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  container: {
    backgroundColor: Colors.light.tint,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    height: "100%",
  },
  titleOne: {
    fontSize: 15,
    fontWeight: "300",
    marginTop: 20,
    color: Colors.light.secondaryText,
  },
  content: {
    alignItems: "center",
    marginTop: "30%",
  },
  text: {
    fontSize: 40,
    color: Colors.light.white,

    fontWeight: "600",
    textAlign: "center",
  },
  description: {
    fontSize: 20,
    color: Colors.light.white,
    textAlign: "center",
    marginTop: 20,
  },
  buttons: {
    width: "100%",
    padding: 20,
  },
  button: {
    paddingVertical: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.tint,
    borderWidth: 1,
  },
  rejectButton: {
    backgroundColor: Colors.light.tint,
    borderWidth: 1,
    borderColor: Colors.light.white,
    color: Colors.light.white,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
