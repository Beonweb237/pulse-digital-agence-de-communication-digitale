import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PaletteName = 'rouge' | 'bleu' | 'vert' | 'or' | 'rose';

export interface Palette {
  name: PaletteName;
  label: string;
  accent1: string;
  accent2: string;
}

export const palettes: Palette[] = [
  { name: 'rouge', label: 'Rouge', accent1: '#ff3333', accent2: '#00ffff' },
  { name: 'bleu', label: 'Bleu', accent1: '#007bff', accent2: '#00ffff' },
  { name: 'vert', label: 'Vert', accent1: '#28a745', accent2: '#00ffff' },
  { name: 'or', label: 'Or', accent1: '#ffc107', accent2: '#00ffff' },
  { name: 'rose', label: 'Rose', accent1: '#ff69b4', accent2: '#00ffff' },
];

interface ThemeContextType {
  currentPalette: Palette;
  setPalette: (name: PaletteName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentPalette: palettes[0],
  setPalette: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<Palette>(palettes[0]);

  useEffect(() => {
    const saved = localStorage.getItem('pulse-digital-palette') as PaletteName | null;
    if (saved && palettes.find(p => p.name === saved)) {
      setCurrentPalette(palettes.find(p => p.name === saved)!);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent1', currentPalette.accent1);
    root.style.setProperty('--accent2', currentPalette.accent2);
  }, [currentPalette]);

  const setPalette = useCallback((name: PaletteName) => {
    const palette = palettes.find(p => p.name === name);
    if (palette) {
      setCurrentPalette(palette);
      localStorage.setItem('pulse-digital-palette', name);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ currentPalette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
