import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Diamond, Folder, Mail, Lock, Palette, Info } from 'lucide-react';
import { useTheme, palettes } from '@/contexts/ThemeContext';

export default function Sidebar() {
  const location = useLocation();
  const { currentPalette, setPalette } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/services', icon: Diamond, label: 'Services' },
    { to: '/realisations', icon: Folder, label: 'Realisations' },
    { to: '/about', icon: Info, label: 'A Propos' },
    { to: '/contact', icon: Mail, label: 'Contact' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThemeOpen(false);
      }
    }
    if (themeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [themeOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-[80px] z-[1000] hidden md:flex flex-col items-center py-8 border-r border-[rgba(255,255,255,0.1)] bg-[#050505]/80 backdrop-blur-[20px]">
        {/* Logo */}
        <Link
          to="/"
          className="w-10 h-10 rounded-full border flex items-center justify-center mb-6"
          style={{ borderColor: 'var(--accent1)' }}
        >
          <span className="font-spaceGrotesk font-bold text-[16px] gradient-text">PD</span>
        </Link>

        {/* Separator */}
        <div className="w-5 h-px bg-[rgba(255,255,255,0.1)] mb-6" />

        {/* Nav Icons */}
        <div className="flex flex-col items-center gap-6 flex-1">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className="relative group"
              >
                <item.icon
                  size={24}
                  strokeWidth={2}
                  className="transition-colors duration-300"
                  style={{
                    color: active ? 'var(--accent1)' : 'rgba(255,255,255,0.5)',
                  }}
                />
                {/* Tooltip */}
                <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-[#111] border border-[rgba(255,255,255,0.1)] text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Separator */}
        <div className="w-5 h-px bg-[rgba(255,255,255,0.1)] mb-6" />

        {/* Theme Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setThemeOpen(!themeOpen)}
            aria-label="Changer de theme"
            className="transition-transform duration-300 hover:rotate-45"
          >
            <Palette
              size={20}
              strokeWidth={2}
              style={{ color: 'var(--accent1)' }}
            />
          </button>

          {/* Theme Dropdown */}
          {themeOpen && (
            <div
              className="absolute left-[60px] bottom-0 glass-strong rounded-xl p-3 min-w-[160px]"
              style={{
                animation: 'fadeInUp 0.3s ease forwards',
              }}
            >
              <p className="text-xs text-[rgba(255,255,255,0.5)] mb-2 px-2" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Theme
              </p>
              {palettes.map((palette) => (
                <button
                  key={palette.name}
                  onClick={() => {
                    setPalette(palette.name);
                    setThemeOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors duration-200 hover:bg-[#111]"
                >
                  <span
                    className="w-4 h-4 rounded-full border"
                    style={{
                      backgroundColor: palette.accent1,
                      borderColor: currentPalette.name === palette.name ? 'var(--accent1)' : 'transparent',
                    }}
                  />
                  <span className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {palette.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Admin Link */}
        <Link
          to="/admin"
          aria-label="Administration"
          className="mt-4 transition-colors duration-300"
        >
          <Lock
            size={20}
            strokeWidth={2}
            className="text-[rgba(255,255,255,0.5)] hover:text-[var(--accent1)] transition-colors duration-300"
          />
        </Link>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[60px] z-[1000] flex md:hidden items-center justify-around bg-[#050505]/95 backdrop-blur-[20px] border-t border-[rgba(255,255,255,0.1)]">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className="flex flex-col items-center gap-1"
            >
              <item.icon
                size={22}
                strokeWidth={2}
                style={{
                  color: active ? 'var(--accent1)' : 'rgba(255,255,255,0.5)',
                }}
              />
              <span className="text-[9px] uppercase tracking-wide" style={{ color: active ? 'var(--accent1)' : 'rgba(255,255,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>
                {item.label.slice(0, 5)}
              </span>
            </Link>
          );
        })}

        {/* Theme button mobile */}
        <button
          onClick={() => setThemeOpen(!themeOpen)}
          aria-label="Changer de theme"
          className="flex flex-col items-center gap-1"
        >
          <Palette size={22} strokeWidth={2} style={{ color: 'var(--accent1)' }} />
          <span className="text-[9px] uppercase tracking-wide" style={{ color: 'var(--accent1)', fontFamily: 'JetBrains Mono, monospace' }}>Theme</span>
        </button>

        {/* Admin link mobile */}
        <Link to="/admin" aria-label="Administration" className="flex flex-col items-center gap-1">
          <Lock size={22} strokeWidth={2} className="text-[rgba(255,255,255,0.5)]" />
          <span className="text-[9px] uppercase tracking-wide text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Admin</span>
        </Link>
      </nav>

      {/* Mobile Theme Dropdown */}
      {themeOpen && (
        <div
          className="fixed bottom-[70px] right-4 z-[1001] glass-strong rounded-xl p-3 min-w-[160px] md:hidden"
          ref={dropdownRef}
        >
          <p className="mb-2 px-2 text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Theme
          </p>
          {palettes.map((palette) => (
            <button
              key={palette.name}
              onClick={() => {
                setPalette(palette.name);
                setThemeOpen(false);
              }}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors duration-200 hover:bg-[#111]"
            >
              <span
                className="w-4 h-4 rounded-full border"
                style={{
                  backgroundColor: palette.accent1,
                  borderColor: currentPalette.name === palette.name ? 'var(--accent1)' : 'transparent',
                }}
              />
              <span className="text-sm text-white">{palette.label}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
