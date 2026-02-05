import { useState } from "react";

function MoodInput({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <section>
      <h1>¿Cómo te sentís hoy?</h1>

      <input
        type="text"
        placeholder="Ej: relajado, triste, con ganas de entrenar..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Buscar canciones
      </button>
    </section>
  );
}

export default MoodInput;
