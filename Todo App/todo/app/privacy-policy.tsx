import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Privacy() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.header}>Privacy Policy</Text>

      <Section title="Data Collection">
        We collect basic user data to improve app experience.
      </Section>

      <Section title="Data Usage">
        Your data is only used for app functionality and improvements.
      </Section>

      <Section title="Security">
        We use industry standard security to protect your data.
      </Section>

    </ScrollView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{children}</Text>
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
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  title: {
    fontWeight: "700",
    marginBottom: 6,
  },

  text: {
    color: "#555",
    lineHeight: 20,
  },
});