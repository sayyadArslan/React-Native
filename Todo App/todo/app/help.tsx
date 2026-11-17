import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Help() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.header}>Help Center</Text>
      <Text style={styles.subHeader}>Find answers to common questions</Text>

      <FAQ title="How to use the app?" desc="Navigate through tabs and explore features easily." />
      <FAQ title="How to reset password?" desc="Go to settings > security and update your password." />
      <FAQ title="How to contact support?" desc="Email us at support khanconsole7632@gmail.com anytime." />

    </ScrollView>
  );
}

function FAQ({ title, desc }) {
  return (
    <View style={styles.card}>
      <Text style={styles.q}>{title}</Text>
      <Text style={styles.a}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 16,
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
  },

  subHeader: {
    color: "#666",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  q: {
    fontWeight: "700",
    marginBottom: 6,
  },

  a: {
    color: "#555",
    lineHeight: 20,
  },
});