import { useState, useEffect } from "react";
import Layout from "./components/Layout/Layout";
import MoodInput from "./components/MoodInput/MoodInput";
import MoodResult from "./components/MoodResult/MoodResult";
import MoodParticles from "./components/MoodParticles/MoodParticles";
import AnimatedBackground from "./components/AnimatedBackground/AnimatedBackground";
import AudioToggleButton from "./components/AudioToggleButton/AudioToggleButton";
import { EmotionalAudioProvider } from "./audio/EmotionalAudioProvider";
import { getMoodFromText } from "./services/aiService";
import "./App.css";

function App() {
  const [mood, setMood] = useState(null);
  const [variant, setVariant] = useState(null);
  const [reason, setReason] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Actualizar tema según mood
  useEffect(() => {
    if (mood) {
      document.documentElement.setAttribute("data-theme", mood);
    } else {
      document.documentElement.setAttribute("data-theme", "neutral");
    }
  }, [mood]);

  const handleMoodSubmit = async (text) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getMoodFromText(text);
      
      if (result.error) {
        setError(result.error);
      } else {
        setMood(result.mood);
        setVariant(result.variant);
        setReason(result.reason);
        setMessage(result.message);
      }
    } catch (err) {
      setError("Error al analizar el estado. Intenta de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmotionalAudioProvider mood={mood}> {/* ← CAMBIO: mood en vez de normalizedMood */}
      {/* Background animado */}
      <AnimatedBackground mood={mood} />
      
      {/* Particles por mood */}
      {mood && <MoodParticles mood={mood} />}

      {/* Layout principal */}
      <Layout>
        <MoodInput onSubmit={handleMoodSubmit} loading={loading} />
        
        {loading && (
          <div className="loading-indicator">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span>Analizando tu estado...</span>
          </div>
        )}

        <MoodResult
          mood={mood}
          variant={variant}
          reason={reason}
          message={message}
          error={error}
        />
      </Layout>

      {/* Botón de audio toggle */}
      <AudioToggleButton />
    </EmotionalAudioProvider>
  );
}

export default App;