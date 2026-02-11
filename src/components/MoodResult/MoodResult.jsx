import { useEffect, useMemo, useState } from "react";
import { moodSongs } from "../../data/moodSongs";
import { normalizeMood } from "../../services/moodAI";
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

function MoodResult({ mood, variant, reason, message, error }) {
  const [seed, setSeed] = useState(0);

  const hasApiMood = Boolean(mood);
  const normalizedMood = hasApiMood ? normalizeMood(mood) : null;
  const moodData =
    hasApiMood && normalizedMood ? moodSongs[normalizedMood] || null : null;

  useEffect(() => {
    // Cada vez que cambia el mood desde el backend, generamos una nueva playlist
    if (hasApiMood) {
      setSeed((prev) => prev + 1);
    }
  }, [hasApiMood, normalizedMood]);

  const songs = useMemo(
    () =>
      moodData && Array.isArray(moodData.songs)
        ? getRandomSongs(moodData.songs, 7)
        : [],
    [moodData, seed]
  );

  console.log("[MoodResult] Render with:", {
    rawMood: mood,
    normalizedMood,
    variant,
    reason,
    message,
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

  if (!hasApiMood) return null;

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
            <div className="mood-heading-text">
              <h2>{moodData.title}</h2>
              <p className="mood-main-line">
                Parece que estás {moodData.label}
                {variant ? ` (${variant})` : ""}
              </p>
            </div>
          </div>

          {message && <p className="mood-message">{message}</p>}

          {reason && (
            <p className="mood-reason">
              {reason}
            </p>
          )}

          {!message && moodData.description && (
            <p className="mood-description">{moodData.description}</p>
          )}

          {moodData.quote && (
            <p className="mood-quote">“{moodData.quote}”</p>
          )}
        </div>
      ) : (
        <h2>Estado detectado: {normalizedMood || mood}</h2>
      )}

      {hasSongs || (moodData && moodData.albums?.length) ? (
        <div className="mood-result-content">
          <div className="mood-result-songs">
            {hasSongs ? (
              <>
                <ul className="song-list">
                  {songs.map((song, index) => (
                    <li
                      key={`${song.title}-${song.artist}-${index}`}
                      className="song-card"
                    >
                      <div className="song-card-cover">
                        {(song.cover || song.image) ? (
                          <img
                            src={song.cover || song.image}
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <span className="song-card-cover-placeholder" />
                        )}
                      </div>
                      <div className="song-card-info">
                        <strong className="song-card-title">{song.title}</strong>
                        <span className="song-card-artist">{song.artist}</span>
                        {song.album && (
                          <span className="song-card-album">{song.album}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="another-recommendation"
                  onClick={handleAnotherRecommendation}
                >
                  Otra recomendación
                </button>
              </>
            ) : (
              <p className="mood-result-empty">Todavía no hay canciones para este estado.</p>
            )}
          </div>

          {moodData?.albums?.length > 0 && (
            <aside className="mood-result-albums">
              <h3 className="albums-section-title">Álbumes recomendados</h3>
              <div className="albums-grid">
                {(moodData.albums.slice(0, 6)).map((album, index) => (
                  <div
                    key={`${album.title}-${album.artist}-${index}`}
                    className="album-card"
                  >
                    <div className="album-card-cover">
                      {album.cover ? (
                        <img src={album.cover} alt="" loading="lazy" />
                      ) : (
                        <span className="album-card-cover-placeholder" />
                      )}
                    </div>
                    <span className="album-card-title">{album.title}</span>
                    <span className="album-card-artist">{album.artist}</span>
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      ) : (
        <p className="mood-result-empty">Todavía no hay canciones para este estado.</p>
      )}
    </div>
  );
}

export default MoodResult;
