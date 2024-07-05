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
} from "react-native";

const RegisterScreen = ({ setRegister }: any) => {
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("admin123");
  const [name, setName] = useState("Delivery man");
  const [phone, setPhone] = useState("31982442222");
  const { register } = useAuthApi();

  const handleLogin = async () => {
    register(email, password, name, phone);
  };

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
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Nome"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPhone}
          value={phone}
          placeholder="Telefone"
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            ...styles.loginButton,
            backgroundColor: "white",
            marginTop: 30,
          }}
          onPress={() => setRegister(false)}
        >
          <Text style={{ ...styles.loginButtonText, color: "red" }}>
            Voltar
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

export default RegisterScreen;
