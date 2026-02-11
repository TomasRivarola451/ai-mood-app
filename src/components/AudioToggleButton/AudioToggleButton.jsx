import { useEmotionalAudio } from "../../audio/EmotionalAudioProvider.jsx";
import "./AudioToggleButton.css";

function AudioToggleButton() {
  const { isUserPaused, hasActiveFamily, togglePlayPause } = useEmotionalAudio();

  // Si estamos en neutral y no hay ambiente activo, no mostramos el botón
  if (!hasActiveFamily && isUserPaused === false) {
    return null;
  }

  const label = isUserPaused ? "Reanudar ambiente sonoro" : "Pausar ambiente sonoro";

  return (
    <button
      type="button"
      className="audio-toggle"
      onClick={togglePlayPause}
      aria-label={label}
    >
      {isUserPaused ? "🔇 Pausado" : "🔊 Sonido activo"}
    </button>
  );
}

export default AudioToggleButton;

