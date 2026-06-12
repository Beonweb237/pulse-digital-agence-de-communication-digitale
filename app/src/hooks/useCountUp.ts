import { useState, useEffect, useRef } from 'react';

export function useCountUp(
  end: number,
  duration: number = 1500,
  started: boolean = false
): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;

    function animate(timestamp: number) {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, duration, started]);

  return count;
}
