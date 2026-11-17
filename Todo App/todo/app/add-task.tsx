import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import { useTaskStore } from "@/store/taskStore";

export default function AddTaskScreen() {
  const addTask = useTaskStore((state) => state.addTask);

  const [title, setTitle] = useState("");

  const handleAddTask = () => {
    if (!title.trim()) return;

    addTask(title.trim());

    setTitle("");

    router.back();
  };

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Add Task</Text>

      <TextInput
        placeholder="Enter task..."
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity
        style={[
          styles.button,
          !title.trim() && { opacity: 0.5 },
        ]}
        onPress={handleAddTask}
        disabled={!title.trim()}
      >
        <Text style={styles.buttonText}>Save Task</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    padding: 20,
    paddingTop: 70,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#5B5FFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});