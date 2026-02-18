import { useEffect, useRef } from 'react';
import './MoodParticles.css';

function MoodParticles({ mood }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;

    // Configurar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Configuración de particles por mood
    const particleConfigs = {
      happy: {
        count: 30,
        color: 'rgba(34, 197, 94, 0.6)',
        size: { min: 2, max: 4 },
        speed: { min: 0.3, max: 0.8 },
        floatY: true,
      },
      sad: {
        count: 40,
        color: 'rgba(56, 189, 248, 0.5)',
        size: { min: 1, max: 3 },
        speed: { min: 0.5, max: 1.2 },
        fallDown: true,
      },
      energetic: {
        count: 50,
        color: 'rgba(249, 115, 22, 0.7)',
        size: { min: 2, max: 5 },
        speed: { min: 0.8, max: 1.8 },
        pulse: true,
      },
      chill: {
        count: 25,
        color: 'rgba(139, 92, 246, 0.5)',
        size: { min: 2, max: 4 },
        speed: { min: 0.2, max: 0.5 },
        wave: true,
      },
      angry: {
        count: 35,
        color: 'rgba(239, 68, 68, 0.6)',
        size: { min: 2, max: 4 },
        speed: { min: 0.6, max: 1.4 },
        flicker: true,
      },
      tired: {
        count: 20,
        color: 'rgba(100, 116, 139, 0.4)',
        size: { min: 2, max: 3 },
        speed: { min: 0.2, max: 0.4 },
        drift: true,
      },
    };

    const config = particleConfigs[mood] || particleConfigs.chill;

    // Crear particles
    particles.length = 0;
    for (let i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (config.size.max - config.size.min) + config.size.min,
        speedX: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
        speedY: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
        opacity: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Animar particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Movimiento específico por mood
        if (config.floatY) {
          particle.y -= particle.speedY;
          if (particle.y < -10) particle.y = canvas.height + 10;
        } else if (config.fallDown) {
          particle.y += particle.speedY;
          if (particle.y > canvas.height + 10) particle.y = -10;
        } else if (config.wave) {
          particle.x += Math.sin(particle.pulse) * 0.5;
          particle.y += particle.speedY;
          particle.pulse += 0.02;
          if (particle.y > canvas.height + 10) particle.y = -10;
        } else if (config.drift) {
          particle.x += particle.speedX;
          particle.y += particle.speedY * 0.3;
          if (particle.x < -10 || particle.x > canvas.width + 10) particle.speedX *= -1;
          if (particle.y < -10 || particle.y > canvas.height + 10) particle.y = Math.random() * canvas.height;
        } else {
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          if (particle.x < -10 || particle.x > canvas.width + 10) particle.x = Math.random() * canvas.width;
          if (particle.y < -10 || particle.y > canvas.height + 10) particle.y = Math.random() * canvas.height;
        }

        // Efectos especiales
        let currentOpacity = particle.opacity;
        
        if (config.pulse) {
          particle.pulse += 0.05;
          currentOpacity = particle.opacity + Math.sin(particle.pulse) * 0.3;
        }

        if (config.flicker) {
          if (Math.random() > 0.98) {
            currentOpacity = Math.random() * 0.8 + 0.2;
          }
        }

        // Dibujar particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Aplicar color con opacidad
        const colorMatch = config.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (colorMatch) {
          const [, r, g, b] = colorMatch;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;
        } else {
          ctx.fillStyle = config.color;
        }
        
        ctx.fill();

        // Glow effect
        if (config.pulse || config.energetic) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = config.color;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mood]);

  return (
    <canvas
      ref={canvasRef}
      className="mood-particles-canvas"
    />
  );
}

export default MoodParticles;