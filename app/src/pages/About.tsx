import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, Database, Heart, Award, Users } from 'lucide-react';
import { useSiteData } from '@/contexts/SiteDataContext';

gsap.registerPlugin(ScrollTrigger);

/* ─── Icon map for values ─── */
const valueIcons = [Eye, Database, Heart, Award];

/* ─── About Page ─── */
export default function About() {
  const { data } = useSiteData();
  const pageRef = useRef<HTMLDivElement>(null);
  const about = data.about;
  const networkStats = data.networkStats;

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header animations */
      const headerTl = gsap.timeline({ delay: 0.2 });
      headerTl.fromTo(
        '.about-label',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      headerTl.fromTo(
        '.about-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
      headerTl.fromTo(
        '.about-desc',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );

      /* Vision section */
      ScrollTrigger.create({
        trigger: '.vision-section',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.vision-section',
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
          );
        },
      });

      /* Mission items stagger */
      ScrollTrigger.batch('.mission-item', {
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.1,
              overwrite: true,
            }
          );
        },
        start: 'top 85%',
        once: true,
      });

      /* Values cards */
      ScrollTrigger.batch('.value-card', {
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.1,
              overwrite: true,
            }
          );
        },
        start: 'top 85%',
        once: true,
      });

      /* Network stats */
      ScrollTrigger.batch('.network-stat', {
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.08,
              overwrite: true,
            }
          );
        },
        start: 'top 85%',
        once: true,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      {/* ─── Page Header ─── */}
      <section
        className="relative pt-[120px] md:pt-[160px] pb-16 md:pb-24"
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
        }}
      >
        {/* Label */}
        <span
          className="about-label inline-block font-jetbrains text-xs uppercase tracking-widest mb-6"
          style={{ color: 'var(--accent1)' }}
        >
          À Propos
        </span>

        {/* Title */}
        <h1
          className="about-title font-spaceGrotesk font-bold max-w-[800px]"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--text)',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
          }}
        >
          {about.title}
        </h1>

        {/* Description */}
        <p
          className="about-desc font-inter text-lg mt-6 max-w-[700px]"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
        >
          {about.description}
        </p>
      </section>

      {/* ─── Vision Section ─── */}
      <section
        className="vision-section pb-16 md:pb-24"
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
          opacity: 0,
        }}
      >
        <div
          className="rounded-2xl p-8 md:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(var(--accent1-rgb), 0.08), rgba(var(--accent2-rgb), 0.08))',
            border: '1px solid rgba(var(--accent1-rgb), 0.15)',
          }}
        >
          <span
            className="font-jetbrains text-xs uppercase tracking-widest mb-4 block"
            style={{ color: 'var(--accent1)' }}
          >
            Notre Vision
          </span>
          <p
            className="font-spaceGrotesk text-xl md:text-2xl font-medium"
            style={{
              color: 'var(--text)',
              lineHeight: 1.6,
              letterSpacing: '-0.5px',
            }}
          >
            <span className="gradient-text">&ldquo;</span>
            {about.vision}
            <span className="gradient-text">&rdquo;</span>
          </p>
        </div>
      </section>

      {/* ─── Mission Section ─── */}
      <section
        className="pb-16 md:pb-24"
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <span
          className="font-jetbrains text-xs uppercase tracking-widest mb-6 block"
          style={{ color: 'var(--accent1)' }}
        >
          Notre Mission
        </span>
        <h2
          className="font-spaceGrotesk font-bold text-2xl md:text-3xl mb-8"
          style={{ color: 'var(--text)', letterSpacing: '-1px', lineHeight: 1.2 }}
        >
          Ce qui nous anime au quotidien
        </h2>

        <div className="space-y-4">
          {about.mission.map((item, i) => (
            <div
              key={i}
              className="mission-item flex items-start gap-4 p-5 rounded-xl"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-color)',
                opacity: 0,
              }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-jetbrains text-xs font-bold"
                style={{
                  background: 'var(--accent1)',
                  color: '#000',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p
                className="font-inter text-base pt-1"
                style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Values Section ─── */}
      <section
        className="pb-16 md:pb-24"
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <span
          className="font-jetbrains text-xs uppercase tracking-widest mb-6 block"
          style={{ color: 'var(--accent1)' }}
        >
          Nos Valeurs
        </span>
        <h2
          className="font-spaceGrotesk font-bold text-2xl md:text-3xl mb-8"
          style={{ color: 'var(--text)', letterSpacing: '-1px', lineHeight: 1.2 }}
        >
          Les piliers de notre culture
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.values.map((value, i) => {
            const Icon = valueIcons[i] || Award;
            return (
              <div
                key={i}
                className="value-card p-6 rounded-2xl"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  opacity: 0,
                }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl mb-4"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent1), var(--accent2))',
                  }}
                >
                  <Icon size={24} strokeWidth={2} color="#000" />
                </div>
                <h4
                  className="font-spaceGrotesk text-lg font-semibold mb-2"
                  style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}
                >
                  {value.title}
                </h4>
                <p
                  className="font-inter text-sm"
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
                >
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Network Stats Section ─── */}
      <section
        className="pb-24 md:pb-32"
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Users size={20} style={{ color: 'var(--accent1)' }} />
          <span
            className="font-jetbrains text-xs uppercase tracking-widest"
            style={{ color: 'var(--accent1)' }}
          >
            Notre Réseau
          </span>
        </div>

        <h2
          className="font-spaceGrotesk font-bold text-2xl md:text-3xl mb-8"
          style={{ color: 'var(--text)', letterSpacing: '-1px', lineHeight: 1.2 }}
        >
          Une audience de millions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {networkStats.map((stat, i) => (
            <div
              key={i}
              className="network-stat p-5 rounded-2xl text-center"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-color)',
                opacity: 0,
              }}
            >
              <div
                className="font-spaceGrotesk text-2xl md:text-3xl font-bold gradient-text"
                style={{ lineHeight: 1.2 }}
              >
                {stat.value}
              </div>
              <p
                className="font-jetbrains text-xs mt-2 uppercase tracking-wide"
                style={{ color: 'var(--text-muted)' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
