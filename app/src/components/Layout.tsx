import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 }
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] bg-[var(--bg)]">
      <Sidebar />

      {/* Main content area */}
      <main className="md:ml-[80px] min-h-[100dvh] pb-[60px] md:pb-0">
        <div ref={contentRef}>
          {children}
        </div>
        <Footer />
      </main>

      {/* Floating Admin Button */}
      <Link
        to="/admin"
        aria-label="Administration"
        className="fixed z-[999] flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
        style={{
          right: '24px',
          bottom: '24px',
          width: '56px',
          height: '56px',
          backgroundColor: 'var(--accent1)',
          boxShadow: '0 4px 20px rgba(var(--accent1-rgb), 0.4)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(var(--accent1-rgb), 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(var(--accent1-rgb), 0.4)';
        }}
      >
        <Shield size={24} color="#000" strokeWidth={2} />
      </Link>
    </div>
  );
}
