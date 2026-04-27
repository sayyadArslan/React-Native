import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { useState, useContext } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/themeContext";
import { NotesContext } from "../context/NotesContext";

export default function Edit() {
  const { theme } = useTheme();
  const { updateNote } = useContext(NotesContext);

  const params = useLocalSearchParams();
  const note = params.note ? JSON.parse(params.note as string) : null;

  const [title, setTitle] = useState(note?.title || "");
  const [desc, setDesc] = useState(note?.description || "");

  const save = () => {
    if (!note) return;

    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    updateNote({
      id: note.id,
      title: title.trim(),
      description: desc.trim(),
      pinned: note.pinned,
    });

    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>

      {/* HEADER */}
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#22314A",
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={theme.primary} />
        </TouchableOpacity>

        <Text style={{
          color: theme.primary,
          fontSize: 18,
          fontWeight: "bold",
          marginLeft: 15,
        }}>
          Edit Note
        </Text>
      </View>

      {/* FORM */}
      <View style={{ padding: 15 }}>

        <View style={{
          backgroundColor: theme.card,
          padding: 15,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#22314A",
        }}>

          <Text style={{ color: theme.text, opacity: 0.7 }}>
            Title
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Edit title..."
            placeholderTextColor="#94A3B8"
            style={{
              color: theme.text,
              fontSize: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#22314A",
              paddingVertical: 8,
              marginBottom: 20,
            }}
          />

          <Text style={{ color: theme.text, opacity: 0.7 }}>
            Description
          </Text>

          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="Edit note..."
            placeholderTextColor="#94A3B8"
            multiline
            style={{
              color: theme.text,
              fontSize: 15,
              minHeight: 120,
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* SAVE */}
        <TouchableOpacity
          onPress={save}
          style={{
            marginTop: 20,
            backgroundColor: theme.primary,
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{
            color: "#0B1220",
            fontWeight: "bold",
          }}>
            Update Note
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}