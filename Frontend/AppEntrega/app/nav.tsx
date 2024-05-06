import Colors from "@/constants/Colors";
import Texts from "@/constants/Texts";
import { useAuthApi } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import LoginScreen from "./login";
import LoadingPage from "./pages/loading";

export default function StackNav() {
  const { isLogged, isLoading } = useAuthApi();

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

        <Stack.Screen
          name="delivery_mode"
          options={{
            title: "",
            headerBackTitleVisible: false,
            headerTintColor: Colors.light.tint,
          }}
        />

        <Stack.Screen
          name="extract_view"
          options={{
            title: Texts.extract,
            headerBackTitleVisible: false,
            headerTintColor: Colors.light.text,
          }}
        />

        <Stack.Screen
          name="confirm_generical"
          options={{
            title: "",
            headerBackTitleVisible: false,
            headerShown: false,
            presentation: "modal",
          }}
        />
      </Stack>
    </>
  );
}
