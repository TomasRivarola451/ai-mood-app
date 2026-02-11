// Familias sensoriales por mood crudo devuelto por la IA
export const SENSORY_FAMILY = {
  happy: "bright",
  joyful: "bright",

  energetic: "energy",
  motivated: "energy",
  excited: "energy",

  sad: "low",
  depressed: "low",
  down: "low",
  lonely: "low",

  calm: "calm",
  relaxed: "calm",

  anxious: "tense",
  stressed: "tense",
  overwhelmed: "tense",

  tired: "fatigue",
  exhausted: "fatigue",
  sleepy: "fatigue",
  burned_out: "fatigue",

  angry: "rage",
  frustrated: "rage",

  neutral: "neutral",
  meh: "neutral",
};

// Configuración de archivos y volumen por familia sensorial
export const AUDIO_CONFIG = {
  bright: { file: "/audio/bright.mp3", volume: 0.35 },
  energy: { file: "/audio/energy.mp3", volume: 0.4 },
  low: { file: "/audio/low.mp3", volume: 0.25 },
  calm: { file: "/audio/calm.mp3", volume: 0.25 },
  tense: { file: "/audio/tense.mp3", volume: 0.3 },
  fatigue: { file: "/audio/fatigue.mp3", volume: 0.2 },
  rage: { file: "/audio/rage.mp3", volume: 0.4 },
  neutral: null,
};

