import { useEffect, useMemo, useState } from "react";
import { moodSongs } from "../../data/moodSongs";
import "./MoodResult.css";

function getRandomSongs(songs, count) {
  if (!Array.isArray(songs) || songs.length === 0) return [];

  const copy = [...songs];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, Math.min(count, copy.length));
}

function MoodResult({ mood, error }) {
  const [seed, setSeed] = useState(0);

  const moodData = mood ? moodSongs[mood] || null : null;

  useEffect(() => {
    // Cada vez que cambia el mood desde el backend, generamos una nueva playlist
    if (mood) {
      setSeed((prev) => prev + 1);
    }
  }, [mood]);

  const songs = useMemo(
    () =>
      moodData && Array.isArray(moodData.songs)
        ? getRandomSongs(moodData.songs, 7)
        : [],
    [moodData, seed]
  );

  console.log("[MoodResult] Render with:", {
    mood,
    error,
    hasMoodData: !!moodData,
    songsCount: songs.length,
  });

  if (error) {
    return (
      <div className="mood-result">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!mood) return null;

  const handleAnotherRecommendation = () => {
    // No llamamos a la API, solo re-randomizamos las canciones
    setSeed((prev) => prev + 1);
  };

  const hasSongs = songs.length > 0;

  return (
    <div className="mood-result">
      {moodData ? (
        <div className="mood-header">
          <div className="mood-heading">
            <span className="mood-emoji">{moodData.emoji}</span>
            <div className="mood-heading-text">
              <p className="mood-main-line">
                {moodData.emoji} Parece que estás {moodData.label}
              </p>
              <h2>{moodData.title}</h2>
            </div>
          </div>

          {moodData.description && (
            <p className="mood-description">{moodData.description}</p>
          )}

          {moodData.quote && (
            <p className="mood-quote">“{moodData.quote}”</p>
          )}
        </div>
      ) : (
        <h2>Estado detectado: {mood}</h2>
      )}

      {hasSongs ? (
        <>
          <ul className="song-list">
            {songs.map((song, index) => (
              <li
                key={`${song.title}-${song.artist}-${index}`}
                className="song-item"
              >
                <strong>{song.title}</strong> – {song.artist}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="another-recommendation"
            onClick={handleAnotherRecommendation}
          >
            🔁 Otra recomendación
          </button>
        </>
      ) : (
        <p>No hay canciones para este estado por ahora.</p>
      )}
    </div>
  );
}

export default MoodResult;
