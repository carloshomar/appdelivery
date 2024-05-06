import React from "react";
import { Stack } from "expo-router";
import LoginScreen from "./pages/auth/login";
import { useApi } from "@/contexts/ApiContext";
import Texts from "@/constants/Texts";

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
          headerShown: false,
          title: Texts.inicio,
        }}
      />

      <Stack.Screen
        name="establishment"
        options={{
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
