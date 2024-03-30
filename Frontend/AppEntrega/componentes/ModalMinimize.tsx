import DeliveryMode from "@/app/delivery_mode";
import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const MinimizableModal = ({}) => {
  const nav = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => nav.navigate("delivery_mode")}
      style={{ ...styles.container, height: "15%" }}
    >
      <DeliveryMode showIcon={true} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
  },
});

export default MinimizableModal;
