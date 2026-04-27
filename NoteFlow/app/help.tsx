import { View, Text, SafeAreaView } from "react-native";
import { useTheme } from "../context/themeContext";

export default function Help() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>

      <View style={{ padding: 20 }}>

        <Text style={{
          fontSize: 22,
          fontWeight: "bold",
          color: theme.primary,
          marginBottom: 10,
        }}>
          Help Center
        </Text>

        <Text style={{ color: theme.text, lineHeight: 22 }}>
          • Tap + button to add notes{"\n"}
          • Tap note to edit{"\n"}
          • Pin important notes 📌{"\n"}
          • Swipe or delete icon to remove notes{"\n\n"}

          If app not working:
          restart the app or clear cache.
        </Text>

      </View>
    </SafeAreaView>
  );
}