import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useUserStore } from "../../store/useStore";

export default function Profile() {
  const name = useUserStore((state) => state.name);
  const setName = useUserStore((state) => state.setName);

  const [edit, setEdit] = useState(false);
  const [temp, setTemp] = useState(name);

  const save = () => {
    setName(temp);
    setEdit(false);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.header}>Profile</Text>

      <View style={styles.card}>

        {edit ? (
          <TextInput
            value={temp}
            onChangeText={setTemp}
            style={styles.input}
            placeholder="Enter name"
          />
        ) : (
          <Text style={styles.name}>
            {name || "No Name Found"}
          </Text>
        )}

        <Pressable
          style={styles.btn}
          onPress={() => {
            if (edit) save();
            else setEdit(true);
          }}
        >
          <Text style={styles.btnText}>
            {edit ? "Save" : "Edit"}
          </Text>
        </Pressable>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: "center",
  },

  btn: {
    backgroundColor: "#5B5FFF",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});