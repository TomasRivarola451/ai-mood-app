const API_URL = "https://ai-mood-app-three.vercel.app/api/chat";

/**
 * Llama al backend y devuelve exactamente lo que la API devuelve: { mood?, error? }.
 * No inferir error por ausencia de mood; solo error cuando el backend envía error.
 */
export async function getMoodFromText(text) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    console.log("[aiService] Raw API response:", { status: res.status, ok: res.ok, data });

    if (!res.ok) {
      console.log("[aiService] Response not ok, using error from body or generic");
      return {
        mood: null,
        error: data?.error || "Error al conectar con el servidor",
      };
    }

    const result = {
      mood: data.mood ?? null,
      error: data.error ?? null,
    };
    console.log("[aiService] Normalized result for render:", result);
    return result;
  } catch (error) {
    console.error("[aiService] getMoodFromText error:", error);
    return {
      mood: null,
      error: "No se pudo interpretar el estado de ánimo 😕",
    };
  }
}
