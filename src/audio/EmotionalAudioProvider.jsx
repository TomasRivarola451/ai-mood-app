import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AUDIO_CONFIG, SENSORY_FAMILY } from "./emotionalAudioConfig";

const EmotionalAudioContext = createContext({
  currentFamily: "neutral",
  isUserPaused: false,
  hasActiveFamily: false,
  togglePlayPause: () => {},
});

function getFamilyFromMood(mood) {
  if (!mood || typeof mood !== "string") return "neutral";
  const key = mood.trim().toLowerCase();
  return SENSORY_FAMILY[key] || "neutral";
}

export function EmotionalAudioProvider({ mood, children }) {
  const audioRef = useRef(null);
  const fadeFrameRef = useRef(null);

  const [currentFamily, setCurrentFamily] = useState("neutral");
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const hasActiveFamily =
    currentFamily !== "neutral" && AUDIO_CONFIG[currentFamily] != null;

  useEffect(() => {
    // Marcar primera interacción global del usuario para cumplir con autoplay policy
    const handleFirstInteraction = () => {
      setHasUserInteracted(true);
    };

    window.addEventListener("pointerdown", handleFirstInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
  }, []);

  useEffect(() => {
    return () => {
      if (fadeFrameRef.current != null) {
        cancelAnimationFrame(fadeFrameRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  function fadeVolume(targetVolume, durationMs) {
    const audio = audioRef.current;
    if (!audio || durationMs <= 0) return Promise.resolve();

    if (fadeFrameRef.current != null) {
      cancelAnimationFrame(fadeFrameRef.current);
    }

    const startVolume = audio.volume;
    const startTime = performance.now();

    return new Promise((resolve) => {
      const step = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / durationMs);
        const nextVolume = startVolume + (targetVolume - startVolume) * t;
        audio.volume = Math.max(0, Math.min(1, nextVolume));

        if (t < 1) {
          fadeFrameRef.current = requestAnimationFrame(step);
        } else {
          fadeFrameRef.current = null;
          resolve();
        }
      };

      fadeFrameRef.current = requestAnimationFrame(step);
    });
  }

  async function fadeOutAndPause(durationMs = 800) {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await fadeVolume(0, durationMs);
      audio.pause();
    } catch {
      audio.pause();
    }
  }

  async function playFamily(family, { fadeInMs = 1200 } = {}) {
    const cfg = AUDIO_CONFIG[family];
    const audio = audioRef.current;
    if (!cfg || !audio) return;

    // Actualizar src solo si cambia de archivo
    if (audio.src !== window.location.origin + cfg.file && audio.src !== cfg.file) {
      audio.src = cfg.file;
    }

    try {
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        await playPromise;
      }
      await fadeVolume(cfg.volume, fadeInMs);
    } catch (err) {
      // Puede fallar por autoplay policy; no interrumpimos la app
      console.warn("[EmotionalAudio] play failed:", err);
    }
  }

  // Reaccionar a cambios de mood -> familias sensoriales
  useEffect(() => {
    const nextFamily = getFamilyFromMood(mood);
    const prevFamily = currentFamily;

    if (nextFamily === prevFamily) {
      // Nada que hacer: seguimos con el audio actual
      return;
    }

    setCurrentFamily(nextFamily);

    const audio = audioRef.current;
    if (!audio) return;

    // Neutral: siempre fade out y detener
    if (nextFamily === "neutral") {
      fadeOutAndPause(800);
      return;
    }

    // Si el usuario pausó manualmente, no reproducimos nada automáticamente
    if (isUserPaused || !hasUserInteracted) {
      return;
    }

    // Veníamos de neutral -> nuevo ambiente
    if (prevFamily === "neutral") {
      playFamily(nextFamily, { fadeInMs: 1200 });
      return;
    }

    // Cambió de familia → crossfade (fade out luego fade in)
    (async () => {
      await fadeOutAndPause(800);
      await playFamily(nextFamily, { fadeInMs: 1200 });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, hasUserInteracted, isUserPaused]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasUserInteracted(true);

    if (isUserPaused) {
      // Usuario quiere reanudar
      setIsUserPaused(false);

      const family = getFamilyFromMood(mood);
      const effectiveFamily =
        family !== "neutral" && AUDIO_CONFIG[family] ? family : currentFamily;

      if (!effectiveFamily || effectiveFamily === "neutral") {
        return;
      }

      await playFamily(effectiveFamily, { fadeInMs: 1200 });
    } else {
      // Usuario quiere pausar todo el ambiente sonoro
      setIsUserPaused(true);
      await fadeOutAndPause(800);
    }
  };

  const value = useMemo(
    () => ({
      currentFamily,
      isUserPaused,
      hasActiveFamily,
      togglePlayPause,
    }),
    [currentFamily, isUserPaused, hasActiveFamily]
  );

  return (
    <EmotionalAudioContext.Provider value={value}>
      {children}
      <audio ref={audioRef} style={{ display: "none" }} />
    </EmotionalAudioContext.Provider>
  );
}

export function useEmotionalAudio() {
  return useContext(EmotionalAudioContext);
}

