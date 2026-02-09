/* eslint-env node */
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `
Sos un clasificador de estados de ánimo.

Respondé EXCLUSIVAMENTE con UNA SOLA PALABRA,
en minúsculas, elegida de esta lista exacta:

chill
happy
sad
angry
anxious
focused
energetic
romantic
nostalgic

Reglas:
- No expliques nada
- No agregues texto extra
- Si no estás seguro, respondé: unknown
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const mood = response.output_text.trim();

    return res.status(200).json({ mood });
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    return res.status(500).json({ error: "AI error" });
  }
}
