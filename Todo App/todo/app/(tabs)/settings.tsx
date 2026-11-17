import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  useWindowDimensions,
} from "react-native";

import { User, Moon, CircleHelp, Shield } from "lucide-react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isTablet && styles.contentTablet,
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.wrapper, isTablet && styles.wrapperTablet]}>
        
        <Text style={styles.header}>Settings</Text>
        <Text style={styles.subHeader}>
          Manage your account & preferences
        </Text>

        {/* ACCOUNT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <SettingsItem
            icon={<User size={20} color="#5B5FFF" />}
            title="Profile"
            onPress={() => router.push("/Profile")}
          />
        </View>

        {/* PREFERENCES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Moon size={20} color="#5B5FFF" />
              <Text style={styles.itemText}>Dark Mode</Text>
            </View>

            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        {/* SUPPORT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <SettingsItem
            icon={<CircleHelp size={20} color="#5B5FFF" />}
            title="Help Center"
            onPress={() => router.push("/help")}
          />

          <SettingsItem
            icon={<Shield size={20} color="#5B5FFF" />}
            title="Privacy Policy"
            onPress={() => router.push("/privacy-policy")}
          />
        </View>

      </View>
    </ScrollView>
  );
}

/* reusable item */
function SettingsItem({ icon, title, onPress }) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        {icon}
        <Text style={styles.itemText}>{title}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },

  content: {
    padding: 16,
    alignItems: "center",
  },

  contentTablet: {
    padding: 30,
  },

  wrapper: {
    width: "100%",
  },

  wrapperTablet: {
    maxWidth: 600,
    width: "100%",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    color: "#111",
  },

  subHeader: {
    color: "#666",
    marginTop: 4,
    marginBottom: 20,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    marginBottom: 10,
    marginLeft: 4,
  },

  item: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  itemText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },

  arrow: {
    fontSize: 20,
    color: "#999",
  },
});