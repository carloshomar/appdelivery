import Colors from "@/constants/Colors";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DeliveryHappy from "../assets/images/deliveryman_happy.png";
import Texts from "@/constants/Texts";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";

export default function ConfirmGenerical() {
  const nav = useNavigation();
  const route = useRoute();

  const { onConfirm, hasCode = false } = route.params as any;
  const [code, setCode] = useState("");

  function handlerConfirm() {
    if (hasCode && hasCode !== code) {
      return;
    }

    if (onConfirm) onConfirm();
    nav.goBack();
  }

  function verify() {
    console.log("Codigos: ", hasCode, code);

    if (hasCode === code) {
      handlerConfirm();
    } else {
      console.log(code);
      Alert.alert("", Texts.codigo_errado);
    }
  }

  useEffect(() => {
    if (code.length >= 4) verify();
  }, [code]);
  useEffect(() => {
    setCode("");
  }, []);

  return (
    <View style={styles.containers}>
      <View></View>
      {!hasCode ? (
        <View style={styles.imageContainer}>
          <Image source={DeliveryHappy} style={styles.images} />
          <Text style={styles.textTwo}>{Texts.continue_duvida}</Text>
          <Text style={styles.titleOne}>{Texts.nao_sera_possivel_voltar}</Text>
        </View>
      ) : (
        <View style={styles.containerdata}>
          <Text
            style={{
              ...styles.textTwo,
              textAlign: "center",
              fontSize: 20,
              width: "80%",
            }}
          >
            {Texts.codigo}
          </Text>

          <View style={styles.containermine}>
            <TextInput
              value={code}
              keyboardType={"numeric"}
              style={styles.codes}
              autoFocus={true}
              placeholder="####"
              placeholderTextColor={Colors.light.secondaryText}
              maxLength={4}
              onChangeText={(text) => setCode(text)}
            />
          </View>
        </View>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity
          disabled={hasCode && hasCode !== code}
          onPress={() => {
            handlerConfirm();
          }}
          style={{
            ...styles.button,
            ...styles.acceptButton,
            ...(hasCode && hasCode !== code
              ? {
                  backgroundColor: Colors.light.tabIconDefault,
                  borderColor: Colors.light.secondaryText,
                  color: Colors.light.secondaryText,
                }
              : {}),
          }}
        >
          <Text
            style={{
              ...styles.buttonText,
              color:
                hasCode && hasCode !== code
                  ? Colors.light.secondaryText
                  : Colors.light.tint,
            }}
          >
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
  containerdata: {
    width: "95%",
    alignContent: "center",
    alignItems: "center",
  },
  containermine: {
    borderBottomWidth: 3,
    borderColor: "red",
    borderBottomColor: "red",
    marginTop: 30,
  },
  textTwo: {
    fontSize: 22,
    fontWeight: "500",
    color: Colors.light.text,
  },
  codes: {
    fontSize: 30,
    padding: 15,
    paddingLeft: 30,
    letterSpacing: 15,
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
