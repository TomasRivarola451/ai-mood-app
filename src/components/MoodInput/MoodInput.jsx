import { useState } from "react";
import "./MoodInput.css";

function MoodInput({ onSubmit, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <div className="mood-input-container">
      <div className="mood-input-card">
        <h1 className="mood-input-title">¿Cómo te sentís hoy?</h1>
        <p className="mood-input-subtitle">
          Escribí cómo te sentís y te recomendamos música para acompañarte.
        </p>
        
        <form onSubmit={handleSubmit} className="mood-input-wrapper">
          <input
            type="text"
            className="mood-input-field"
            placeholder="Escribí algo como: 'me siento solo últimamente' o 'tengo mucha energía y ganas de hacer cosas'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="mood-input-submit"
            disabled={loading || !text.trim()}
          >
            {loading ? "Analizando..." : "Buscar canciones"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MoodInput;