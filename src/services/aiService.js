const API_URL =
  import.meta.env.MODE === "development"
    ? "https://ai-mood-app-three.vercel.app/api/chat"
    : "/api/chat";

export async function getMoodFromText(text) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    if (!res.ok) {
      throw new Error("API error");
    }

    const data = await res.json();
    return data.mood || "unknown";
  } catch (error) {
    console.error(error);
    return "unknown";
  }
}
