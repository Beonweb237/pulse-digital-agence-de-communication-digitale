import { memo } from 'react';

interface CubeConfig {
  size: number;
  top: string;
  right: string;
  delay: string;
}

const cubes: CubeConfig[] = [
  { size: 120, top: '20%', right: '10%', delay: '0s' },
  { size: 80, top: '50%', right: '25%', delay: '1.3s' },
  { size: 60, top: '30%', right: '40%', delay: '2.6s' },
];

function Cube({ size, top, right, delay }: CubeConfig) {
  const half = size / 2;

  return (
    <div
      className="cube"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top,
        right,
        animationDelay: delay,
        animation: 'float 4s ease-in-out infinite alternate',
      }}
    >
      {/* Front */}
      <div
        className="cube-face"
        style={{ transform: `translateZ(${half}px)` }}
      />
      {/* Back */}
      <div
        className="cube-face"
        style={{ transform: `rotateY(180deg) translateZ(${half}px)` }}
      />
      {/* Right */}
      <div
        className="cube-face"
        style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}
      />
      {/* Left */}
      <div
        className="cube-face"
        style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }}
      />
      {/* Top */}
      <div
        className="cube-face"
        style={{ transform: `rotateX(90deg) translateZ(${half}px)` }}
      />
      {/* Bottom */}
      <div
        className="cube-face"
        style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}
      />
    </div>
  );
}

const FloatingCubes = memo(function FloatingCubes() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ perspective: '1000px', zIndex: 0 }}
    >
      {cubes.map((cube, i) => (
        <Cube key={i} {...cube} />
      ))}
    </div>
  );
});

export default FloatingCubes;
