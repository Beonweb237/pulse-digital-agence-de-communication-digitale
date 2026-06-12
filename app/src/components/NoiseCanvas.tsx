import { useRef, useEffect, memo } from 'react';

const NoiseCanvas = memo(function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Disable on mobile/touch for battery
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let isActive = true;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      canvas!.width = parent.offsetWidth;
      canvas!.height = parent.offsetHeight;
    }

    function generateNoise() {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;     // R
        data[i + 1] = val; // G
        data[i + 2] = val; // B
        data[i + 3] = 40;  // A (low opacity)
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function animate() {
      if (!isActive) return;
      generateNoise();
      animationId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      isActive = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        opacity: 0.4,
        pointerEvents: 'none',
      }}
    />
  );
});

export default NoiseCanvas;
