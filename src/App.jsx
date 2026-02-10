import { useState } from "react";
import { getMoodFromText } from "./services/aiService";
import MoodInput from "./components/MoodInput/MoodInput";
import MoodResult from "./components/MoodResult/MoodResult";
import Layout from "./components/Layout/Layout";
import { useTheme } from "./theme/ThemeContext.jsx";

function App() {
  const [currentMood, setCurrentMood] = useState(null);
  const [variant, setVariant] = useState(null);
  const [reason, setReason] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setMoodFromApi } = useTheme();

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

      // Actualizar theme solo si la IA respondió sin error
      if (!result.error && result.mood) {
        setMoodFromApi(result.mood);
      } else if (result.error) {
        setMoodFromApi("neutral");
      }
    } catch (err) {
      console.error("[App] handleSubmit error:", err);
      setError("No se pudo interpretar el estado de ánimo 😕");
      setMoodFromApi("neutral");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <MoodInput onSubmit={handleSubmit} />

      {loading && (
        <div className="loading-indicator">
          <span className="loading-dot" />
          <p>Estamos leyendo tu mensaje con cuidado…</p>
        </div>
      )}

      <MoodResult
        mood={currentMood}
        variant={variant}
        reason={reason}
        message={message}
        error={error}
      />
    </Layout>
  );
}

export default App;
