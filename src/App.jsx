import { useState } from "react";
import { getMoodFromText } from "./services/aiService";
import MoodInput from "./components/MoodInput/MoodInput";
import MoodResult from "./components/MoodResult/MoodResult";

function App() {
  const [currentMood, setCurrentMood] = useState(null);
  const [variant, setVariant] = useState(null);
  const [reason, setReason] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(text) {
    setLoading(true);
    setError(null);
    setCurrentMood(null);
    setVariant(null);
    setReason(null);
    setMessage(null);

    try {
      const result = await getMoodFromText(text);
      console.log("[App] Result from API, state to render:", result);

      setCurrentMood(result.mood ?? null);
      setVariant(result.variant ?? null);
      setReason(result.reason ?? null);
      setMessage(result.message ?? null);
      setError(result.error ?? null);
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

      <MoodResult
        mood={currentMood}
        variant={variant}
        reason={reason}
        message={message}
        error={error}
      />
    </>
  );
}

export default App;
