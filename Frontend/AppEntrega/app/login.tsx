import Colors from "@/constants/Colors";
import { useAuthApi } from "@/contexts/AuthContext";

import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import RegisterScreen from "./cadastro";

const LoginScreen = () => {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("admin123");
  const { login } = useAuthApi();
  const [register, setRegister] = useState(false);
  const [load, setLoad] = useState(false);

  const handleLogin = async () => {
    setLoad(true);
    login(email, password);
    setLoad(false);
  };
  if (register) {
    return <RegisterScreen setRegister={setRegister} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Senha"
          secureTextEntry={true}
        />
        <TouchableOpacity
          disabled={load}
          style={styles.loginButton}
          onPress={handleLogin}
        >
          {!load ? (
            <Text style={styles.loginButtonText}>Entrar</Text>
          ) : (
            <ActivityIndicator
              size={20}
              color={Colors.light.white}
              style={{ alignSelf: "center" }}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...styles.loginButton,
            backgroundColor: "white",
            marginTop: 30,
          }}
          onPress={() => setRegister(true)}
        >
          <Text style={{ ...styles.loginButtonText, color: "red" }}>
            Novo Entregador
          </Text>
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
