import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import { NotesProvider } from "../context/NotesContext";
import { ThemeProvider, useTheme } from "../context/themeContext";

function AppDrawer() {
  const { theme, toggleTheme, dark } = useTheme();

  return (
    <Drawer
      screenOptions={({ navigation }) => ({
        // ===== HEADER STYLE =====
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.primary,
        headerTitle: "NotesFlow",

        // ===== DRAWER STYLE =====
        drawerStyle: {
          backgroundColor: theme.background,
        },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.text,

        // ===== MENU BUTTON (ONLY ONE - FIX DOUBLE ICON ISSUE) =====
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={26}
            color={theme.primary}
            style={{ marginLeft: 15 }}
            onPress={() => navigation.toggleDrawer()}
          />
        ),

        // ===== THEME TOGGLE =====
        headerRight: () => (
          <Ionicons
            name={dark ? "sunny" : "moon"}
            size={24}
            color={theme.primary}
            style={{ marginRight: 15 }}
            onPress={toggleTheme}
          />
        ),
      })}
    >

      {/* ===== SCREENS ===== */}
      <Drawer.Screen name="index" options={{ title: "Home" }} />
      <Drawer.Screen name="add" options={{ title: "Add Note" }} />
      <Drawer.Screen name="edit" options={{ title: "Edit Note" }} />

      <Drawer.Screen name="about" options={{ title: "About" }} />
      <Drawer.Screen name="setting" options={{ title: "Settings" }} />
      <Drawer.Screen name="privacy-policy" options={{ title: "Privacy Policy" }} />
      <Drawer.Screen name="help" options={{ title: "Help Center" }} />

    </Drawer>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NotesProvider>
          <AppDrawer />
        </NotesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}