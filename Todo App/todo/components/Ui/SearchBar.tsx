import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function SearchBar({
  value,
  onChangeText,
}: any) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={22}
        color="#999"
      />

      <TextInput
        placeholder="Search your tasks..."
        placeholderTextColor="#999"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,

    backgroundColor: "#fff",

    borderRadius: 18,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 18,

    marginTop: 24,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.05,

    shadowRadius: 10,

    elevation: 3,
  },

  input: {
    flex: 1,

    marginLeft: 12,

    fontSize: 16,

    color: "#1E1E2D",
  },
});