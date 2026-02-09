import { moodSongs } from "../../data/moodSongs";
import "./MoodResult.css";

function MoodResult({ mood, error }) {
  const songs = mood ? (moodSongs[mood] || []) : [];

  console.log("[MoodResult] Render with:", { mood, error, songsCount: songs.length });

  if (error) {
    return (
      <div className="mood-result">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!mood) return null;

  return (
    <div className="mood-result">
      <h2>Estado detectado: {mood}</h2>
      {songs.length > 0 ? (
        <ul>
          {songs.map((song, index) => (
            <li key={index}>
              <strong>{song.title}</strong> – {song.artist}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay canciones para este estado por ahora.</p>
      )}
    </div>
  );
}

export default MoodResult;
