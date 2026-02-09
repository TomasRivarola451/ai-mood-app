import { moodSongs } from "../../data/moodSongs";
import "./MoodResult.css";

function MoodResult({ mood }) {
  if (!mood) return null;

  const songs = moodSongs[mood] || [];

  if (!songs.length) {
    return (
      <div className="mood-result">
        <p className="error">
          No se pudo interpretar el estado de ánimo 😕
        </p>
      </div>
    );
  }
  return (
    <div className="mood-result">
      <h2>Estado detectado: {mood}</h2>

      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            <strong>{song.title}</strong> – {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodResult;
