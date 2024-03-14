import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoadingPage = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-200">
      <ActivityIndicator size="large" color="red" />
    </View>
  );
};

export default LoadingPage;
