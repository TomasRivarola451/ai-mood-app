import './AnimatedBackground.css';

function AnimatedBackground({ mood }) {
  return (
    <div className="animated-background">
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />
    </div>
  );
}

export default AnimatedBackground;