import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Platform, Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import Texts from "@/constants/Texts";
import Strings from "@/constants/Strings";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  console.ignoredYellowBox = ["Warning: Each"];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarStyle: {
          paddingBottom: Platform.OS === "android" ? 5 : insets.bottom - 10,
        },

        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: Strings.inicio,
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: Strings.extrato,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="file-text-o" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: Strings.ajuda,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="question-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
