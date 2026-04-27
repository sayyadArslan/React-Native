import { View, Text, SafeAreaView } from "react-native";
import { useTheme } from "../context/themeContext";

export default function About() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>

      <View style={{ padding: 20 }}>

        {/* TITLE */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: theme.primary,
            marginBottom: 10,
          }}
        >
          About NotesFlow
        </Text>

        {/* DESCRIPTION */}
        <Text
          style={{
            color: theme.text,
            fontSize: 16,
            lineHeight: 22,
          }}
        >
          NotesFlow is a modern note-taking app built for who Want to Save Note.
          It allows you to create, edit, pin, and manage your notes easily with a clean UI.
        </Text>

        {/* EXTRA INFO CARD */}
        <View
          style={{
            marginTop: 20,
            backgroundColor: theme.card,
            padding: 15,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#22314A",
          }}
        >
          <Text style={{ color: theme.text, fontWeight: "bold" }}>
            Features:
          </Text>

          <Text style={{ color: "#94A3B8", marginTop: 5 }}>
            • Create & edit notes{"\n"}
            • Pin important notes{"\n"}
            • Dark / Light theme{"\n"}
            • Fast & smooth UI
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}