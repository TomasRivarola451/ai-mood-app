import { useState } from "react";
import "./MoodInput.css";

function MoodInput({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    const trimmed = text.trim();
    if (!trimmed) return;

    console.log("[MoodInput] Submitting text:", trimmed);
    onSubmit(trimmed);
    setText("");
  };

  return (
    <section className="mood-input">
      <h1>¿Cómo te sentís hoy?</h1>
      <p className="mood-input-subtitle">
        Escribí una frase corta y te recomendamos música según tu estado de
        ánimo.
      </p>

      <form onSubmit={handleSubmit} className="mood-input-form">
        <input
          type="text"
          placeholder="Ej: estoy triste, necesito energía para entrenar..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button type="submit">
          Buscar canciones
        </button>
      </form>
    </section>
  );
}

export default MoodInput;
