import { View, Text, TouchableOpacity } from "react-native";
import { Note } from "../types/note";
import { useTheme } from "../context/themeContext";

type Props = {
  note: Note;
  onPress: () => void;
  onDelete: () => void;
  onPin: () => void;
};

export default function NoteCard({ note, onPress, onDelete, onPin }: Props) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: theme.card,
        padding: 15,
        borderRadius: 14,
        marginBottom: 12,
        marginLeft:10,
        marginRight:10,
        borderWidth: 1,
        borderColor: "#22314A",
      }}
    >

      <Text style={{
        color: theme.text,
        fontWeight: "bold",
        fontSize: 16,
      }}>
        {note.title}
      </Text>

      <Text style={{
        color: "#94A3B8",
        marginTop: 5,
      }}>
        {note.description}
      </Text>

      <View style={{
        flexDirection: "row",
        marginTop: 12,
        justifyContent: "flex-end",
      }}>

        <TouchableOpacity onPress={onPin} style={{ marginRight: 15 }}>
          <Text style={{ color: theme.primary }}>📌</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete}>
          <Text style={{ color: "#EF4444" }}>🗑</Text>
        </TouchableOpacity>

      </View>
    </TouchableOpacity>
  );
}