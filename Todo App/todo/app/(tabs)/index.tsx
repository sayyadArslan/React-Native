import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Ionicons from "@expo/vector-icons/Ionicons";

import { router } from "expo-router";

import SearchBar from "@/components/Ui/SearchBar";

import TaskCard from "@/components/cards/TaskCard";

import { useTaskStore } from "@/store/taskStore";

import { useUserStore } from "@/store//useStore";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(true);

  // USER STORE
  const name =
    useUserStore((state) => state.name);

  const setName =
    useUserStore((state) => state.setName);

  // TASK STORE
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

  // LOAD USER NAME
  useEffect(() => {
    loadUser();
  }, []);
useEffect(() => {
  useTaskStore.getState().loadTasks();
}, []);
  const loadUser = async () => {
    try {
      const username =
        await AsyncStorage.getItem(
          "username"
        );

      if (username) {
        setName(username);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // FILTER TASKS
  const filteredTasks = tasks.filter(
    (task) =>
      task.title
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // LOADING SCREEN
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color="#5B5FFF"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello {name} 👋
          </Text>

          <Text style={styles.appName}>
            TaskFlow
          </Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() =>
            router.push("/Profile")
          }
        >
          <Ionicons
            name="person"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <SearchBar
        value={search}
        onChangeText={setSearch}
      />

      {/* STATS CARD */}
      <View style={styles.statsCard}>
        <View>
          <Text style={styles.statsNumber}>
            {tasks.length}
          </Text>

          <Text style={styles.statsText}>
            Total Tasks
          </Text>
        </View>

        <Ionicons
          name="checkmark-done-circle"
          size={50}
          color="#fff"
        />
      </View>

      {/* SECTION TITLE */}
      <Text style={styles.sectionTitle}>
        Today's Tasks
      </Text>

      {/* TASK LIST */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="document-text-outline"
              size={70}
              color="#ccc"
            />

            <Text style={styles.emptyText}>
              No Tasks Found
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}
      />

      {/* FLOATING BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push("/add-task")
        }
      >
        <Ionicons
          name="add"
          size={34}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#F7F8FC",

    paddingHorizontal: 20,

    paddingTop: 70,
  },

  loaderContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#F7F8FC",
  },

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  greeting: {
    fontSize: 18,

    color: "#777",
  },

  appName: {
    fontSize: 34,

    fontWeight: "700",

    color: "#1E1E2D",
  },

  profileButton: {
    width: 52,

    height: 52,

    borderRadius: 26,

    backgroundColor: "#5B5FFF",

    justifyContent: "center",

    alignItems: "center",
  },

  statsCard: {
    marginTop: 24,

    backgroundColor: "#5B5FFF",

    borderRadius: 30,

    padding: 24,

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    elevation: 5,
  },

  statsNumber: {
    color: "#fff",

    fontSize: 40,

    fontWeight: "700",
  },

  statsText: {
    color: "#E6E6FF",

    marginTop: 8,

    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 24,

    fontWeight: "700",

    marginTop: 30,

    marginBottom: 18,

    color: "#1E1E2D",
  },

  emptyContainer: {
    alignItems: "center",

    marginTop: 80,
  },

  emptyText: {
    marginTop: 16,

    fontSize: 18,

    color: "#999",
  },

  fab: {
    position: "absolute",

    bottom: 30,

    right: 24,

    width: 70,

    height: 70,

    borderRadius: 35,

    backgroundColor: "#5B5FFF",

    justifyContent: "center",

    alignItems: "center",

    elevation: 10,
  },
});