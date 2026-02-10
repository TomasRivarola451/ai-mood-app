// Mapeo entre moods que puede devolver la IA (backend)
// y los moods canónicos que existen en data/moodSongs.
export const moodMap = {
  happy: "happy",
  joyful: "happy",
  excited: "energetic",

  sad: "sad",
  depressed: "sad",
  down: "sad",
  lonely: "sad",

  calm: "chill",
  relaxed: "chill",
  anxious: "chill",
  stressed: "chill",
  overwhelmed: "chill",

  energetic: "energetic",
  motivated: "energetic",

  tired: "tired",
  exhausted: "tired",
  sleepy: "tired",
  burned_out: "tired",

  angry: "angry",
  frustrated: "angry",

  neutral: "neutral",
  meh: "neutral",
};

/**
 * Normaliza el mood crudo de la API a un mood canónico
 * que siempre tiene canciones asociadas en data/moodSongs.
 */
export function normalizeMood(moodFromApi) {
  if (!moodFromApi || typeof moodFromApi !== "string") {
    return "neutral";
  }

  const key = moodFromApi.trim().toLowerCase();
  return moodMap[key] || "neutral";
}

