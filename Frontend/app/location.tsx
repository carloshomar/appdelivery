import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import Texts from "@/constants/Texts";
import { Ionicons } from "@expo/vector-icons";
import { useCartApi } from "@/contexts/ApiCartContext";
import { useNavigation } from "@react-navigation/native";

const Location = () => {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const { setMyLocation, location } = useCartApi();
  const [endereco, setEndereco] = useState(location);

  const handleSave = () => {
    setMyLocation(endereco);
    nav.goBack();
  };

  const handleCancel = () => {
    nav.goBack();
  };

  const consultarCEP = async (cep) => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(
          `http://viacep.com.br/ws/${cep}/json/`
        );

        if (response.status === 200 && response.data.logradouro) {
          setEndereco({
            ...response?.data,
            complemento: null,
            numero: null,
          });
        }
      } catch (error) {
        console.error("Erro ao consultar CEP:", error);
      }
    }
  };

  const handlerInput = (key, text) => {
    setEndereco({
      ...endereco,
      [key]: text,
    });
  };

  const renderAddressInput = (
    label: string,
    value: string,
    keyboardType: string | null = null,
    keyString: string | null = null
  ) => {
    return (
      <View>
        <Text style={styles.addressLabel}>{label}:</Text>
        <TextInput
          style={styles.input}
          value={value}
          keyboardType={keyboardType ?? "default"}
          onChangeText={(text) =>
            handlerInput(keyString ?? label.toLowerCase(), text)
          }
        />
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>CEP:</Text>
        <TextInput
          style={styles.input}
          maxLength={8}
          keyboardType="numeric"
          placeholder="Digite seu CEP"
          value={endereco?.cep}
          onChangeText={(text) => {
            consultarCEP(text);
            handlerInput("cep", text);
          }}
        />

        <View style={styles.addressContainer}>
          {renderAddressInput("UF", endereco?.uf, "uf")}
          {renderAddressInput("Localidade", endereco?.localidade)}
          {renderAddressInput("Bairro", endereco?.bairro)}
          {renderAddressInput("Logradouro", endereco?.logradouro)}
          {renderAddressInput("Número", endereco?.numero, "numeric", "numero")}
          {renderAddressInput("Complemento", endereco?.complemento)}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>{Texts.voltar}</Text>
          <Ionicons name="arrow-back" size={20} color={Colors.light.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>{Texts.salvar}</Text>
          <Ionicons
            name="checkmark-sharp"
            size={20}
            color={Colors.light.white}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    height: "100%",
  },
  formContainer: {
    padding: 16,
    borderRadius: 2,
    backgroundColor: Colors.light.white,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.tabIconDefault,
    borderRadius: 3,
    padding: 10,
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    gap: 10,
    width: "100%",
    padding: 10,
    flexDirection: "row",
  },
  saveButton: {
    width: "47.5%",
    backgroundColor: Colors.dark.tint,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: Colors.light.white,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  addressContainer: {
    marginTop: 25,
    gap: 5,
  },
  addressLabel: {
    fontSize: 16,
    paddingBottom: 5,
  },
});

export default Location;
