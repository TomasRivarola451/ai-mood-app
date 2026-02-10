import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { normalizeMood } from "../services/moodAI";

// Definición de themes por mood canónico.
// Los colores son suaves y modernos, evitando saturación.
export const themesByMood = {
  neutral: {
    backgroundGradient:
      "radial-gradient(circle at top, #1f2933 0%, #020617 55%, #020617 100%)",
    primaryColor: "#e5e7eb",
    secondaryColor: "#9ca3af",
    textColor: "#f9fafb",
    accentColor: "#38bdf8",
    animationStyle: "calm",
  },
  happy: {
    backgroundGradient:
      "radial-gradient(circle at top, #22c55e33 0%, #0f172a 45%, #020617 100%)",
    primaryColor: "#f9fafb",
    secondaryColor: "#bbf7d0",
    textColor: "#f9fafb",
    accentColor: "#22c55e",
    animationStyle: "bright",
  },
  sad: {
    backgroundGradient:
      "radial-gradient(circle at top, #0ea5e933 0%, #020617 50%, #020617 100%)",
    primaryColor: "#e5e7eb",
    secondaryColor: "#94a3b8",
    textColor: "#e2e8f0",
    accentColor: "#38bdf8",
    animationStyle: "soft-slow",
  },
  chill: {
    backgroundGradient:
      "radial-gradient(circle at top, #8b5cf633 0%, #020617 50%, #020617 100%)",
    primaryColor: "#e5e7eb",
    secondaryColor: "#a5b4fc",
    textColor: "#e5e7eb",
    accentColor: "#a78bfa",
    animationStyle: "calm",
  },
  energetic: {
    backgroundGradient:
      "radial-gradient(circle at top, #f9731633 0%, #111827 40%, #020617 100%)",
    primaryColor: "#fefce8",
    secondaryColor: "#fed7aa",
    textColor: "#f9fafb",
    accentColor: "#f97316",
    animationStyle: "punchy",
  },
  tired: {
    backgroundGradient:
      "radial-gradient(circle at top, #4b556333 0%, #020617 50%, #020617 100%)",
    primaryColor: "#e5e7eb",
    secondaryColor: "#9ca3af",
    textColor: "#e5e7eb",
    accentColor: "#64748b",
    animationStyle: "soft-slow",
  },
  angry: {
    backgroundGradient:
      "radial-gradient(circle at top, #ef444433 0%, #111827 40%, #020617 100%)",
    primaryColor: "#fee2e2",
    secondaryColor: "#fca5a5",
    textColor: "#fef2f2",
    accentColor: "#f97373",
    animationStyle: "firm",
  },
  // Fallback para cualquier mood desconocido – debería mapearse a neutral,
  // pero mantenemos coherencia si llegara a utilizarse directamente.
};

const ThemeContext = createContext({
  mood: "neutral",
  theme: themesByMood.neutral,
  setMoodFromApi: () => {},
});

export function ThemeProvider({ children }) {
  const [currentMood, setCurrentMood] = useState("neutral");

  const theme = useMemo(
    () => themesByMood[currentMood] || themesByMood.neutral,
    [currentMood]
  );

  useEffect(() => {
    const root = document.documentElement;

    // Atributos para CSS basados en mood y animación
    root.setAttribute("data-theme", currentMood);
    root.setAttribute("data-theme-animation", theme.animationStyle);

    // Variables CSS para colores y fondo
    root.style.setProperty("--bg-gradient", theme.backgroundGradient);
    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty("--secondary-color", theme.secondaryColor);
    root.style.setProperty("--text-color", theme.textColor);
    root.style.setProperty("--accent-color", theme.accentColor);

    // Variables para controlar ritmo de animación según el mood
    const motionDuration =
      theme.animationStyle === "punchy"
        ? "260ms"
        : theme.animationStyle === "firm"
        ? "280ms"
        : theme.animationStyle === "soft-slow"
        ? "520ms"
        : "380ms"; // calm / bright / default
    root.style.setProperty("--motion-duration", motionDuration);
  }, [currentMood, theme]);

  const setMoodFromApi = (moodFromApi) => {
    const normalized = normalizeMood(moodFromApi || "neutral");
    setCurrentMood(normalized);
  };

  const value = useMemo(
    () => ({
      mood: currentMood,
      theme,
      setMoodFromApi,
    }),
    [currentMood, theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

