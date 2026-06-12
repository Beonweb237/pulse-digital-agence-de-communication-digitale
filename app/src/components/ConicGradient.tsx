import { memo } from 'react';

const ConicGradient = memo(function ConicGradient() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'conic-gradient(from 0deg, transparent 0%, var(--accent1) 20%, var(--accent2) 40%, transparent 60%)',
        animation: 'spin-slow 20s linear infinite',
        opacity: 0.4,
        zIndex: -1,
      }}
    />
  );
});

export default ConicGradient;
