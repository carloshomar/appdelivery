import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function HeaderDelivery({
  onDisponivel,
  loading,
  disponivel,
  inWork,
  disabled,
}: any) {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();

  return (
    <View
      style={{
        width: Dimensions.get("window").width / 1.08,
        padding: 20,
        borderRadius: 35,
        position: "absolute",
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.tabIconDefault,
        top: insets.top + 10,
        zIndex: 1,

        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 5,

        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
          gap: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => nav.navigate("perfil")}
          disabled={disabled}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.freepik.com/512/4140/4140048.png",
            }}
            style={{
              height: 50,
              width: 50,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: disponivel ? "green" : Colors.light.tint,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            width: Dimensions.get("window").width / 2,
            padding: 10,
          }}
          disabled={disabled}
          onPress={() => onDisponivel(!disponivel)}
        >
          {!loading ? (
            <Text
              style={{
                fontSize: 17,
                fontWeight: "500",
                color: Colors.light.white,
              }}
            >
              {disponivel
                ? !inWork.status
                  ? Texts.disponivel
                  : Texts.em_entrega
                : Texts.indisponivel}
            </Text>
          ) : (
            <ActivityIndicator color={Colors.light.white} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate("notifications")}>
          <FontAwesome name="bell-o" size={30} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HeaderDelivery;
