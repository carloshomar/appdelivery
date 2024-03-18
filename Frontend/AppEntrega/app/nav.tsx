import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { useAuthApi } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import LoginScreen from "./login";
import LoadingPage from "./pages/loading";

export default function StackNav() {
  const { isLogged, user, isLoading } = useAuthApi();

  if (!isLogged) {
    return <LoginScreen />;
  }
  return (
    <>
      {isLoading ? <LoadingPage /> : null}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="confirm"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            headerTitle: Texts.coleta,
            headerBackTitleVisible: false,
            headerTintColor: Colors.light.tint,
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{ presentation: "modal", title: Texts.notificacoes }}
        />
        <Stack.Screen
          name="perfil"
          options={{ presentation: "modal", title: Texts.perfil }}
        />
      </Stack>
    </>
  );
}
