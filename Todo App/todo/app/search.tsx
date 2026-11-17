import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";

import { useState, useContext } from "react";

import { TaskContext } from "@/context/TaskContext";

export default function SearchScreen() {
  const { tasks } = useContext(TaskContext);

  const [query, setQuery] = useState("");

  const filtered = tasks.filter((item: any) =>
    item.title
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search tasks..."
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.title}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F8FC",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginTop: 60,
    marginBottom: 20,
  },

  item: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    fontWeight: "600",
  },
});