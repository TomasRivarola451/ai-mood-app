import { moodSongs } from "../../data/moodSongs";


function MoodResult({ mood }) {
  if (!mood) return null;

  const songs = moodSongs[mood];

  return (
    <div>
      <h2>Mood detectado: {mood}</h2>

      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            {song.title} — {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodResult;
