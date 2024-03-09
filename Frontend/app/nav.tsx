import React, { useEffect } from "react";
import { Stack, Tabs } from "expo-router";
import LoginScreen from "./pages/auth/login";
import { useApi } from "@/contexts/ApiContext";
import { useCartApi } from "@/contexts/ApiCartContext";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { useRoute } from "@react-navigation/native";
import { APP_MODE, APP_MODE_OPTIONS } from "@/config/config";

export default function NavStack() {
  const { isLogged } = useApi();

  if (!isLogged) {
    return <LoginScreen />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: APP_MODE !== APP_MODE_OPTIONS.unique,
          title: Texts.inicio,
        }}
      />

      <Stack.Screen
        name="establishment"
        options={{
          title: "",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="cart"
        options={{
          presentation: "modal",
          title: Texts.carrinho,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="payments"
        options={{
          presentation: "modal",
          title: Texts.metodos_pagamentos,
        }}
      />

      <Stack.Screen
        name="location"
        options={{
          title: Texts.metodos_pagamentos,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
