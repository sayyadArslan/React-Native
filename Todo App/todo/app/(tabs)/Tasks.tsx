import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import TaskCard from "@/components/cards/TaskCard";

import { useTaskStore } from "@/store/taskStore";

export default function TasksScreen() {
  const tasks =
    useTaskStore((state) => state.tasks);

  const toggleTask =
    useTaskStore(
      (state) => state.toggleTask
    );

  const deleteTask =
    useTaskStore(
      (state) => state.deleteTask
    );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        All Tasks
      </Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}
      />
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
    fontSize: 34,
    fontWeight: "700",
    marginBottom: 20,
  },
});