import {
  TouchableOpacity,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useContext } from "react";
import { ThemeContext } from "@/context/themeContext";

export default function ThemeToggle() {
  const { dark, setDark } =
    useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={() => setDark(!dark)}
    >
      <Ionicons
        name={dark ? "sunny" : "moon"}
        size={28}
        color="#5B5FFF"
      />
    </TouchableOpacity>
  );
}