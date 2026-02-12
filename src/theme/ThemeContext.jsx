import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { normalizeMood } from "../services/moodAI";

/* -------------------------------------------------- */
/* 🎨 Aura dinámica por mood                         */
/* -------------------------------------------------- */

function getAuraColor(mood) {
  switch (mood) {
    case "happy":
      return "rgba(34, 197, 94, 0.25)";
    case "sad":
      return "rgba(30, 64, 175, 0.35)";
    case "chill":
      return "rgba(91, 33, 182, 0.3)";
    case "energetic":
      return "rgba(249, 115, 22, 0.3)";
    case "tired":
      return "rgba(71, 85, 105, 0.35)";
    case "angry":
      return "rgba(127, 29, 29, 0.35)";
    default:
      return "rgba(100, 116, 139, 0.25)";
  }
}

/* -------------------------------------------------- */
/* 🎨 Themes por mood                                */
/* -------------------------------------------------- */

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
};

/* -------------------------------------------------- */
/* 🧠 Context                                         */
/* -------------------------------------------------- */

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

    // Atributos globales
    root.setAttribute("data-theme", currentMood);
    root.setAttribute("data-theme-animation", theme.animationStyle);

    // Variables visuales
    root.style.setProperty("--bg-gradient", theme.backgroundGradient);
    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty("--secondary-color", theme.secondaryColor);
    root.style.setProperty("--text-color", theme.textColor);
    root.style.setProperty("--accent-color", theme.accentColor);

    // Nueva variable para aura
    root.style.setProperty("--aura-color", getAuraColor(currentMood));

    // Ritmo de animación
    const motionDuration =
      theme.animationStyle === "punchy"
        ? "260ms"
        : theme.animationStyle === "firm"
        ? "280ms"
        : theme.animationStyle === "soft-slow"
        ? "520ms"
        : "380ms";

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
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
