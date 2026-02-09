import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Moods permitidos (canon)
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "No se pudo interpretar el estado de ánimo 😕",
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an emotion detection AI.

Your task:
1. First, decide if the user's text is meaningful human language.
   - If the text is random characters, gibberish, or has no semantic meaning, respond ONLY with:
     unknown

2. If the text IS meaningful, infer the user's emotional state and respond with ONLY ONE of the following moods:

happy
sad
chill
angry
tired
anxious
excited
lonely
motivated
frustrated
confused

Rules:
- Respond with ONLY ONE word.
- No explanations.
- No punctuation.
- No emojis.
- If multiple emotions are present, choose the dominant one.
- If unsure, choose the closest possible mood.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 3,
      temperature: 0,
    });

    const rawMood =
      completion.choices[0].message.content.trim().toLowerCase();

    // Texto sin sentido real
    if (rawMood === "unknown") {
      return res.status(200).json({
        mood: null,
        error: "No se pudo interpretar el estado de ánimo 😕",
      });
    }

    // Normalización defensiva
    const mood = ALLOWED_MOODS.includes(rawMood)
      ? rawMood
      : "confused";

    return res.status(200).json({ mood });
  }catch (error) {
    console.error("🔥 OPENAI ERROR:", error);
  
    return res.status(500).json({
      error: error.message || "OpenAI error",
    });
  }
  
}
