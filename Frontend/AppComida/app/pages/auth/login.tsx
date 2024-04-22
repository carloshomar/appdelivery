import Colors from "@/constants/Colors";
import { useApi } from "@/contexts/ApiContext";
import helpers from "@/helpers/helpers";
import api from "@/services/api";
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";

const LoginScreen = () => {
  const [nome, setNome] = useState("André Silva");
  const [phone, setPhone] = useState(helpers.formatPhoneNumber("11988444499"));
  const { login } = useApi();

  const handleLogin = async () => {
    login({ phone: phone.replace(/ /g, ""), nome });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: "" }} style={styles.logo} />
      <View style={styles.formContainer}>
        <TextInput style={styles.input} onChangeText={setNome} value={nome} />
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPhone(text.slice(0, 15))}
          keyboardType="numeric"
          value={helpers.formatPhoneNumber(phone)}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.white,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 10,
    marginTop: -200,
    resizeMode: "contain",
    alignSelf: "center",
  },
  formContainer: {
    width: "90%",
    padding: 16,
    borderRadius: 2,
    backgroundColor: Colors.light.white,
    gap: 10,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: Colors.light.tabIconDefault,
    fontSize: 16,
    marginBottom: 12,
    padding: 10,
  },
  loginButton: {
    backgroundColor: Colors.light.tint,
    padding: 8,
    borderRadius: 2,
    alignItems: "center",
  },
  loginButtonText: {
    color: Colors.light.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
