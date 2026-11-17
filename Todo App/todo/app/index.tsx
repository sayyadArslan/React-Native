import { useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import { View, ActivityIndicator } from "react-native";

export default function Index() {
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const name =
      await AsyncStorage.getItem(
        "username"
      );

    if (name) {
      router.replace("/(tabs)");
    } else {
      router.replace("/onboarding");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}