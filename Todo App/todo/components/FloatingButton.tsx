import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useState, useContext } from "react";
import { router } from "expo-router";

import { TaskContext } from "@/context/TaskContext";

import { v4 as uuidv4 } from "uuid";

export default function AddTaskScreen() {
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState("Personal");

  const { addTask } = useContext(TaskContext);

  const handleAdd = () => {
    if (!title) return;

    addTask({
      id: uuidv4(),
      title,
      category,
      completed: false,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Add New Task
      </Text>

      <TextInput
        placeholder="Enter task"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Category"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
      >
        <Text style={styles.buttonText}>
          Add Task
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
    padding: 20,
    paddingTop: 60,
  },

  heading: {
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 18,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#5B5FFF",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});