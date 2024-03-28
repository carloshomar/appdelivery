import React from "react";
import { View, Image, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
const LoadIcon = require("../../assets/images/load_icon.png");

const LoadingPage = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={LoadIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: Colors.light.tint,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "1",
  },
  image: {
    width: 250,
    resizeMode: "contain",
  },
});

export default LoadingPage;
