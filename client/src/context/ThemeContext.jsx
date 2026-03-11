import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchTheme } from "../api/portfolioApi";

const ThemeContext = createContext(null);

const setCssVariables = (theme, mode) => {
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primaryColor || "#22c55e");
  root.style.setProperty("--accent", theme.accentColor || "#38bdf8");
  root.style.setProperty("--bg-custom", theme.backgroundColor || "#020617");
  root.style.setProperty("--font-main", theme.font || "Space Grotesk");
  root.dataset.mode = mode;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    primaryColor: "#22c55e",
    accentColor: "#38bdf8",
    backgroundColor: "#020617",
    mode: "dark",
    font: "Space Grotesk"
  });
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTheme();
        setTheme(data);
        setMode(data.mode || "dark");
      } catch (error) {
        // Ignore theme fetch errors and use defaults.
      }
    };
    load();
  }, []);

  useEffect(() => {
    setCssVariables(theme, mode);
  }, [theme, mode]);

  const value = useMemo(
    () => ({
      theme,
      mode,
      toggleMode: () => setMode((prev) => (prev === "dark" ? "light" : "dark"))
    }),
    [theme, mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

