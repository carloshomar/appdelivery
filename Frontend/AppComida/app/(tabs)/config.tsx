import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useApi } from "@/contexts/ApiContext";
import { useCartApi } from "@/contexts/ApiCartContext";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Texts from "@/constants/Texts";
import { useNavigation } from "@react-navigation/native";

export default function Perfil() {
  const { logout, getUserData } = useApi();
  const { cleanCart, location } = useCartApi();
  const [user, setUser] = useState(null);
  const nav = useNavigation();

  async function init() {
    setUser(await getUserData());
  }

  useEffect(() => {
    init();
  }, []);

  const handleLogout = () => {
    logout();
    cleanCart();
  };

  return (
    <View style={styles.container}>
      <View style={styles.userDataContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>{Texts.nome_es}</Text>
          <Text style={styles.userInfo}>{user?.nome}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>{Texts.telefone}</Text>
          <Text style={styles.userInfo}>{user?.phone}</Text>
        </View>

        <TouchableOpacity
          style={styles.addressBox}
          onPress={() => nav.navigate("location")}
        >
          <View style={{ width: "85%" }}>
            <Text style={styles.addressLabel}>{Texts.endereco}</Text>
            <View style={{ paddingTop: 10 }}>
              {location.logradouro ? (
                <Text style={styles.userInfo}>
                  {`${location?.logradouro} ${location?.bairro ?? ""}  Nº${
                    location?.numero ?? ""
                  }  ${location?.complemento ?? ""}`}
                </Text>
              ) : null}
              <Text style={styles.userInfo}>
                {location?.localidade} - {location?.uf}
              </Text>
            </View>
          </View>
          <View>
            <Ionicons name="pencil" size={20} style={styles.pencilIcon} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 15 }}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
          <MaterialIcons name="logout" size={16} color={Colors.light.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userDataContainer: {
    marginBottom: 20,
  },
  infoBox: {
    borderRadius: 3,
    borderColor: Colors.light.tabIconDefault,
    marginBottom: 10,
    padding: 15,
    borderBottomWidth: 1,
    paddingTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 12,
    marginBottom: 10,
    color: Colors.light.secondaryText,
    paddingLeft: 3,
  },
  addressBox: {
    borderRadius: 3,
    padding: 15,
    paddingTop: 5,
    paddingBottom: 0,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: Colors.light.tabIconDefault,
    alignItems: "center",
  },
  addressLabel: {
    fontSize: 16,
  },
  pencilIcon: {
    color: Colors.light.secondaryText,
  },
  logoutButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 3,
    marginTop: "10%",
  },
  logoutButtonText: {
    color: Colors.light.white,
    fontSize: 14,
    fontWeight: "bold",
  },
});
