import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function TaskCard({
  task,
  onToggle,
  onDelete,
}: any) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => onToggle(task.id)}
      >
        <Ionicons
          name={
            task.completed
              ? "checkmark-circle"
              : "ellipse-outline"
          }
          size={28}
          color={
            task.completed
              ? "#2ED47A"
              : "#5B5FFF"
          }
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            task.completed &&
              styles.completed,
          ]}
        >
          {task.title}
        </Text>

        <Text style={styles.category}>
          {task.category}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onDelete(task.id)}
      >
        <Ionicons
          name="trash-outline"
          size={24}
          color="#FF5A7A"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E2D",
  },

  completed: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },

  category: {
    marginTop: 4,
    color: "#5B5FFF",
    fontWeight: "600",
  },
});