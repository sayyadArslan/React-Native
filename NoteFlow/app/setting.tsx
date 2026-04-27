import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useTheme } from "../context/themeContext";
import { Ionicons } from "@expo/vector-icons";

export default function Settings() {
  const { theme, dark, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>

      <View style={{ padding: 20 }}>

        <Text style={{
          fontSize: 22,
          fontWeight: "bold",
          color: theme.primary,
          marginBottom: 20,
        }}>
          Settings
        </Text>

        {/* THEME TOGGLE */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.card,
            padding: 15,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#22314A",
          }}
        >
          <Ionicons
            name={dark ? "moon" : "sunny"}
            size={22}
            color={theme.primary}
          />

          <Text style={{ color: theme.text, marginLeft: 10 }}>
            {dark ? "Dark Mode" : "Light Mode"}
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}