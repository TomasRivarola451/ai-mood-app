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

    try {
      const mood = await getMoodFromText(text);
      setCurrentMood(mood);
    } catch (err) {
      setError("No se pudo interpretar el estado de ánimo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MoodInput onSubmit={handleSubmit} />

      {loading && <p>Analizando estado de ánimo...</p>}
      {error && <p>{error}</p>}

      <MoodResult mood={currentMood} />
    </>
  );
}

export default App;
