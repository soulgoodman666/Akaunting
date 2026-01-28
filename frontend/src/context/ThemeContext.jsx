import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    
    // Apply theme immediately on load
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    return isDark;
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      
      // Apply theme immediately
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode: toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
