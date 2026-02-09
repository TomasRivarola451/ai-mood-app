import OpenAI from "openai";

const client = new OpenAI({
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

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You analyze text and respond with ONE lowercase word that describes the user's mood. Examples: happy, sad, angry, chill, excited. No punctuation. No explanation.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 3,
      temperature: 0,
    });

    const mood =
      completion.choices[0].message.content.trim().toLowerCase();

    return res.status(200).json({ mood });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}
