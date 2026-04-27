import { View, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useContext, useState } from "react";
import { NotesContext } from "../context/NotesContext";
import { useTheme } from "../context/themeContext";
import NoteCard from "../components/NoteCard";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { notes, deleteNote, togglePin } = useContext(NotesContext);
  const { theme } = useTheme();
  const [search, setSearch] = useState("");

  const filtered = (notes ?? [])
    .filter(n =>
      (n.title ?? "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>

      {/* SEARCH */}
      <View style={{ padding: 15 }}>
        <TextInput
          placeholder="Search notes..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor: theme.card,
            color: theme.text,
            padding: 12,
            borderRadius: 10,
          }}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onDelete={() => deleteNote(item.id)}
            onPin={() => togglePin(item.id)}
          />
        )}
      />

      {/* ➕ BUTTON */}
      <TouchableOpacity
        onPress={() => router.push("/add")}
        style={{
          position: "absolute",
          bottom: 25,
          right: 20,
          backgroundColor: "#FDB425",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="add" size={30} color="#000" />
      </TouchableOpacity>

    </View>
  );
}