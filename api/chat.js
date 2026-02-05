export default function handler(req, res) {
    // 🔹 CORS HEADERS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    // 🔹 Preflight (muy importante)
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { text } = req.body;
  
    let mood = "unknown";
  
    if (!text) {
      return res.status(400).json({ mood });
    }
  
    const lower = text.toLowerCase();
  
    if (
      lower.includes("relajado") ||
      lower.includes("tranquilo") ||
      lower.includes("calma")
    ) {
      mood = "chill";
    } else if (
      lower.includes("triste") ||
      lower.includes("mal") ||
      lower.includes("bajón")
    ) {
      mood = "sad";
    } else if (
      lower.includes("feliz") ||
      lower.includes("contento") ||
      lower.includes("alegre")
    ) {
      mood = "happy";
    }
  
    return res.status(200).json({ mood });
  }
  