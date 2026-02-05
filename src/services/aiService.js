export async function getMoodFromText(userText) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userText,
      }),
    });
  
    if (!response.ok) {
      throw new Error("Error al comunicarse con la IA");
    }
  
    const data = await response.json();
    return data.mood;
  }
  