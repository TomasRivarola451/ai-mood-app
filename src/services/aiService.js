export async function getMoodFromText(text) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    console.log("[aiService] Raw API response:", {
      status: res.status,
      ok: res.ok,
      data,
    });

    if (!res.ok) {
      console.log("[aiService] Response not ok, using error from body or generic");
      return {
        mood: null,
        error: data?.error || "Error al conectar con el servidor",
      };
    }

    const result = {
      mood: data.mood ?? null,
      variant: data.variant ?? null,
      reason: data.reason ?? null,
      message: data.message ?? null,
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
