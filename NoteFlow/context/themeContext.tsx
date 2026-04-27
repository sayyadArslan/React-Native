import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
  const [dark, setDark] = useState(true);

  const theme = {
    background: dark ? "#0F172A" : "#FFFFFF",
    card: dark ? "#1E293B" : "#F1F5F9",
    text: dark ? "#FFFFFF" : "#0F172A",
    primary: "#FDB425",
  };

  const toggleTheme = () => setDark(!dark);

  return (
    <ThemeContext.Provider value={{ theme, dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);