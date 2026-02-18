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
      className={`audio-toggle ${isUserPaused ? "audio-toggle--muted" : ""}`}
      onClick={togglePlayPause}
      aria-label={label}
      title={label}
    >
      {isUserPaused ? (
        // Icono de volumen mutado
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Icono de volumen activo con ondas
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}

export default AudioToggleButton;