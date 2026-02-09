import { useState } from "react";
import { getMoodFromText } from "./services/aiService";
import MoodInput from "./components/MoodInput/MoodInput";
import MoodResult from "./components/MoodResult/MoodResult";

function App() {
  const [currentMood, setCurrentMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(text) {
    setLoading(true);
    setError(null);
    setCurrentMood(null);

    try {
      const result = await getMoodFromText(text);
      console.log("[App] Result from API, state to render:", { mood: result.mood, error: result.error });

      setCurrentMood(result.mood);
      setError(result.error);
    } catch (err) {
      console.error("[App] handleSubmit error:", err);
      setError("No se pudo interpretar el estado de ánimo 😕");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MoodInput onSubmit={handleSubmit} />

      {loading && <p>Analizando estado de ánimo...</p>}

      <MoodResult mood={currentMood} error={error} />
    </>
  );
}

export default App;
