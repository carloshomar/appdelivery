import React from "react";
import { FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useAuthApi } from "@/contexts/AuthContext";

export default function Help() {
  const { logout, inWork } = useAuthApi();
  const data = [
    {
      id: "2",
      title: "Solicitar Ajuda",
      iconName: "help-buoy",
      onPress: () => {},
    },
    { id: "3", title: "Sair da conta", iconName: "exit", onPress: logout },
  ];

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={{ ...styles.item }}
      onPress={item.onPress}
      disabled={item.id === "3" && inWork.status}
    >
      <Ionicons
        name={item.iconName}
        size={24}
        color={
          item.id === "3" && inWork.status
            ? Colors.light.secondaryText
            : Colors.light.text
        }
        style={styles.icon}
      />
      <Text
        style={{
          ...styles.title,
          color:
            item.id === "3" && inWork.status
              ? Colors.light.secondaryText
              : Colors.light.text,
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {},
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.light.white,
  },
  icon: {
    marginRight: 15,
    marginLeft: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "300",
  },
});
