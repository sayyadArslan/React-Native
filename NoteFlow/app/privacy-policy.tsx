import { View, Text, SafeAreaView } from "react-native";
import { useTheme } from "../context/themeContext";

export default function Privacy() {
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
          Privacy Policy
        </Text>

        <Text style={{ color: theme.text, lineHeight: 22 }}>
          We respect your privacy. NotesFlow does not collect personal data without your permission.{"\n\n"}

          • Your notes are stored locally{"\n"}
          • We do not sell your data{"\n"}
          • No third-party tracking{"\n\n"}

          Your data remains secure on your device.
        </Text>

      </View>
    </SafeAreaView>
  );
}