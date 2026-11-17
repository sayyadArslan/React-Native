import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import { useUserStore } from "@/store/useStore";

export default function OnboardingScreen() {
  const [name, setNameInput] =
    useState("");

  const setName =
    useUserStore((state) => state.setName);

  const handleContinue = async () => {
    if (!name) return;

    await AsyncStorage.setItem(
      "username",
      name
    );

    setName(name);

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to
      </Text>

      <Text style={styles.logo}>
        TaskFlow
      </Text>

      <TextInput
        placeholder="Enter your name"
        style={styles.input}
        value={name}
        onChangeText={setNameInput}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",

    padding: 24,

    backgroundColor: "#F7F8FC",
  },

  title: {
    fontSize: 32,

    color: "#777",
  },

  logo: {
    fontSize: 48,

    fontWeight: "700",

    color: "#5B5FFF",

    marginBottom: 40,
  },

  input: {
    backgroundColor: "#fff",

    borderRadius: 20,

    padding: 18,

    fontSize: 16,

    marginBottom: 20,
  },

  button: {
    backgroundColor: "#5B5FFF",

    padding: 18,

    borderRadius: 20,

    alignItems: "center",
  },

  buttonText: {
    color: "#fff",

    fontSize: 16,

    fontWeight: "700",
  },
});