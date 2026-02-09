/* eslint-env node */
/* global process */
import OpenAI from "openai";

// Moods permitidos (canon) – debe coincidir con data/moodSongs
const ALLOWED_MOODS = [
  "happy",
  "sad",
  "chill",
  "angry",
  "tired",
  "anxious",
  "excited",
  "lonely",
  "motivated",
  "frustrated",
  "confused",
];

const SYSTEM_PROMPT = `Eres un asistente que detecta el estado de ánimo del usuario a partir de un texto.

REGLAS ESTRICTAS:

1. Si el texto es lenguaje humano con sentido (aunque sea una sola palabra como "triste", "feliz", o una frase), SIEMPRE debes inferir un estado de ánimo. Responde ÚNICAMENTE con un JSON válido en una sola línea, sin markdown ni texto extra:

{"mood": "<mood>"}

Donde <mood> debe ser exactamente uno de: happy, sad, chill, angry, tired, anxious, excited, lonely, motivated, frustrated, confused.

2. SOLO si el texto es claramente sin sentido (caracteres aleatorios, galimatías, tecleo sin significado, ej: "asdkjashdk", "xxxqqq"), responde ÚNICAMENTE:

{"error": true}

3. No incluyas explicaciones, emojis, ni texto fuera del JSON. Una sola línea. Si hay varias emociones, elige la dominante. En caso de duda entre dos moods válidos, elige el más cercano al texto.`;

/**
 * Extrae el mood de la respuesta cruda de OpenAI (JSON, texto suelto o texto con JSON embebido).
 * Nunca devuelve "unknown" si encuentra algo que parezca un mood válido.
 */
function parseMoodFromResponse(rawContent) {
  if (!rawContent || typeof rawContent !== "string") {
    return { mood: null, isError: true };
  }

  const raw = rawContent.trim();

  // 1) Intentar parsear como JSON directo
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.error === "boolean" && parsed.error) {
      return { mood: null, isError: true };
    }
    if (parsed && typeof parsed.mood === "string") {
      const m = parsed.mood.trim().toLowerCase();
      if (ALLOWED_MOODS.includes(m)) return { mood: m, isError: false };
      // Mood no está en la lista pero el modelo respondió algo → elegir el más cercano o "confused"
      return { mood: "confused", isError: false };
    }
  } catch {
    // No es JSON puro, seguir con otros intentos
  }

  // 2) Buscar un objeto JSON embebido en el texto (ej: "Here is: {\"mood\":\"sad\"}")
  const jsonMatch = raw.match(/\{[\s\S]*?\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed && typeof parsed.error === "boolean" && parsed.error) {
        return { mood: null, isError: true };
      }
      if (parsed && typeof parsed.mood === "string") {
        const m = parsed.mood.trim().toLowerCase();
        if (ALLOWED_MOODS.includes(m)) return { mood: m, isError: false };
        return { mood: "confused", isError: false };
      }
    } catch {
      // Ignorar y seguir
    }
  }

  // 3) Respuesta en una sola palabra (comportamiento legacy)
  const singleWord = raw.split(/\s+/)[0].toLowerCase();
  if (singleWord === "unknown" || singleWord === "error") {
    return { mood: null, isError: true };
  }
  if (ALLOWED_MOODS.includes(singleWord)) {
    return { mood: singleWord, isError: false };
  }

  // 4) Cualquier texto con sentido que no sea "unknown" → no devolver error; elegir mood por defecto
  return { mood: "confused", isError: false };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    console.error("[chat] OPENAI_API_KEY is missing or invalid (env not set or too short)");
    return res.status(500).json({
      error: "Server misconfiguration: OpenAI API key not set",
    });
  }

  const client = new OpenAI({ apiKey });

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "No se pudo interpretar el estado de ánimo 😕",
      });
    }

    const userText = message.trim();
    if (!userText) {
      return res.status(400).json({
        error: "No se pudo interpretar el estado de ánimo 😕",
      });
    }

    console.log("[chat] Request message length:", userText.length, "chars");

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userText },
      ],
      max_tokens: 80,
      temperature: 0,
    });

    const rawContent = completion?.choices?.[0]?.message?.content ?? null;
    console.log("[chat] OpenAI raw response:", JSON.stringify(rawContent));

    if (rawContent == null) {
      console.error("[chat] OpenAI returned no content. Full completion:", JSON.stringify(completion));
      return res.status(500).json({
        error: "OpenAI returned no content",
      });
    }

    const { mood, isError } = parseMoodFromResponse(rawContent);

    if (isError) {
      console.log("[chat] Interpreted as nonsense/error, returning fallback");
      return res.status(200).json({
        mood: null,
        error: "No se pudo interpretar el estado de ánimo 😕",
      });
    }

    const finalMood = ALLOWED_MOODS.includes(mood) ? mood : "confused";
    console.log("[chat] Resolved mood:", finalMood);
    return res.status(200).json({ mood: finalMood });
  } catch (error) {
    console.error("[chat] OpenAI or handler error:", error?.message ?? error);
    if (error?.response) {
      console.error("[chat] OpenAI API response status:", error.response?.status);
      console.error("[chat] OpenAI API response data:", JSON.stringify(error.response?.data));
    }
    return res.status(500).json({
      error: error?.message || "OpenAI error",
    });
  }
}
