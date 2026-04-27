import { View, TextInput, Text, TouchableOpacity, Alert } from "react-native";
import { useState, useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/themeContext";

export default function Add() {
  const { addNote } = useContext(NotesContext);
  const { theme } = useTheme();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const save = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    addNote({
      title: title.trim(),
      description: desc.trim(),
      pinned: false,
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
          New Note
        </Text>
      </View>

      {/* FORM */}
      <View style={{ padding: 15 }}>

        <View style={{
          backgroundColor: theme.card,
          padding: 15,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: "#22314A",
        }}>

          <Text style={{ color: theme.text, opacity: 0.7 }}>Title</Text>

          <TextInput
            placeholder="Enter title..."
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
            style={{
              color: theme.text,
              fontSize: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#22314A",
              paddingVertical: 8,
              marginBottom: 20,
            }}
          />

          <Text style={{ color: theme.text, opacity: 0.7 }}>Description</Text>

          <TextInput
            placeholder="Write your note..."
            placeholderTextColor="#94A3B8"
            value={desc}
            onChangeText={setDesc}
            multiline
            style={{
              color: theme.text,
              fontSize: 15,
              minHeight: 120,
              textAlignVertical: "top",
            }}
          />
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          onPress={save}
          style={{
            marginTop: 20,
            backgroundColor: theme.primary,
            padding: 15,
            borderRadius: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Ionicons name="save" size={20} color="#0B1220" />
          <Text style={{
            color: "#0B1220",
            fontWeight: "bold",
            fontSize: 16,
          }}>
            Save Note
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}