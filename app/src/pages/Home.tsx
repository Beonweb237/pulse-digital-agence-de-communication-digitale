import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { MessageSquare, Palette as PaletteIcon, Smartphone, ArrowRight } from 'lucide-react';
import FloatingCubes from '@/components/FloatingCubes';
import NoiseCanvas from '@/components/NoiseCanvas';
import ConicGradient from '@/components/ConicGradient';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { useSiteData } from '@/contexts/SiteDataContext';

/* ─── Hero Section ─── */
function HeroSection() {
  const { data } = useSiteData();
  const hero = data.hero;
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Step 1: Cubes fade in (0s)
      tl.fromTo('.hero-cubes', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });

      // Step 2: Conic gradient fades in (0.2s)
      tl.fromTo('.hero-conic', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.2);

      // Step 3: Content fades in + slides up (0.8s)
      tl.fromTo(
        '.hero-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.8
      );

      // Step 4: Canvas noise fades in (1.2s)
      tl.fromTo('.hero-noise', { opacity: 0 }, { opacity: 0.4, duration: 0.5, ease: 'power2.out' }, 1.2);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* Vignette mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, var(--bg) 70%)',
          zIndex: 2,
        }}
      />

      {/* Conic gradient background */}
      <div className="hero-conic absolute inset-0" style={{ opacity: 0 }}>
        <ConicGradient />
      </div>

      {/* Floating 3D Cubes */}
      <div className="hero-cubes absolute inset-0" style={{ opacity: 0, zIndex: 0 }}>
        <FloatingCubes />
      </div>

      {/* Noise Canvas */}
      <div className="hero-noise absolute inset-0" style={{ opacity: 0, zIndex: 1 }}>
        <NoiseCanvas />
      </div>

      {/* Hero Content */}
      <div
        ref={contentRef}
        className="hero-content relative z-[3] max-w-[1400px] mx-auto px-5 md:px-10 lg:px-20"
        style={{ opacity: 0 }}
      >
        <h1 className="font-spaceGrotesk font-bold leading-[1.1] tracking-[-2px]" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)' }}>
          <span className="block text-white">Agence de</span>
          <span className="block gradient-text">{hero.title.replace('Agence de ', '')}</span>
        </h1>

        <p className="mt-6 text-xl text-[rgba(255,255,255,0.7)] max-w-[500px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
          {hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link to="/services" className="btn-primary">
            {hero.ctaPrimary}
            <ArrowRight size={16} />
          </Link>
          <Link to="/realisations" className="btn-secondary">
            {hero.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Stat Card ─── */
interface StatCardProps {
  number: string;
  label: string;
  value: number;
  suffix?: string;
  delay: number;
  inView: boolean;
}

function StatCard({ number, label, value, suffix = '', delay, inView }: StatCardProps) {
  const count = useCountUp(value, 1500, inView);

  return (
    <div
      className="py-6 border-b border-[rgba(255,255,255,0.1)] transition-colors duration-300 hover:border-[var(--accent1)]"
      style={{
        animation: inView ? `fadeInUp 0.6s ease-out ${delay}s both` : 'none',
      }}
    >
      <span className="text-xs text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {number}
      </span>
      <div className="mt-2 font-spaceGrotesk font-bold text-5xl gradient-text" style={{ lineHeight: 1.2 }}>
        {count}{suffix}
      </div>
      <p className="mt-2 text-base text-[rgba(255,255,255,0.7)]" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </p>
    </div>
  );
}

/* ─── Statistics Section ─── */
function StatisticsSection() {
  const { data } = useSiteData();
  const [sectionRef, inView] = useInView<HTMLDivElement>(0.2);

  return (
    <section className="py-[120px] md:py-[120px] px-5 md:px-10 lg:px-20 bg-[var(--bg)]" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              number={String(i + 1).padStart(2, '0')}
              label={stat.label}
              value={stat.number}
              suffix={stat.suffix}
              delay={i * 0.1}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Service Card ─── */
interface ServiceCardProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  inView: boolean;
}

function ServiceCard({ number, icon, title, description, delay, inView }: ServiceCardProps) {
  return (
    <div
      className="service-card"
      style={{
        animation: inView ? `fadeInUp 0.6s ease-out ${delay}s both` : 'none',
      }}
    >
      <span className="text-xs text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {number}
      </span>
      <div className="mt-4 mb-4 text-5xl gradient-text">{icon}</div>
      <h4 className="font-spaceGrotesk font-semibold text-2xl text-white mb-3" style={{ letterSpacing: '-0.5px' }}>
        {title}
      </h4>
      <p className="text-base text-[rgba(255,255,255,0.7)]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
        {description}
      </p>
    </div>
  );
}

/* ─── Featured Services Section ─── */
function FeaturedServicesSection() {
  const { data } = useSiteData();
  const featuredServices = data.services.slice(0, 3);
  const [sectionRef, inView] = useInView<HTMLDivElement>(0.2);

  // Map icon names to components for the first 3
  const iconComponents = [
    <MessageSquare size={48} strokeWidth={1.5} />,
    <PaletteIcon size={48} strokeWidth={1.5} />,
    <Smartphone size={48} strokeWidth={1.5} />,
  ];

  return (
    <section className="py-[120px] md:py-[120px] px-5 md:px-10 lg:px-20 bg-[var(--surface)]" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div
          style={{
            animation: inView ? 'fadeInUp 0.6s ease-out both' : 'none',
          }}
        >
          <span className="text-xs uppercase tracking-[1px] text-[var(--accent1)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            NOS SERVICES
          </span>
          <h2 className="mt-4 font-spaceGrotesk font-bold text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-1.5px', lineHeight: 1.2 }}>
            Ce que nous faisons de mieux
          </h2>
          <p className="mt-4 text-lg text-[rgba(255,255,255,0.7)] max-w-[600px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
            Une expertise complete de la strategie a la viralite.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {featuredServices.map((service, i) => (
            <ServiceCard
              key={service.id}
              number={String(i + 1).padStart(2, '0')}
              icon={iconComponents[i] || <MessageSquare size={48} strokeWidth={1.5} />}
              title={service.title}
              description={service.description}
              delay={i * 0.1}
              inView={inView}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div
          className="flex justify-center mt-12"
          style={{
            animation: inView ? 'fadeInUp 0.6s ease-out 0.4s both' : 'none',
          }}
        >
          <Link to="/services" className="btn-secondary">
            Voir tous les services
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonial Card ─── */
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  delay: number;
  inView: boolean;
}

function TestimonialCard({ quote, author, role, delay, inView }: TestimonialCardProps) {
  return (
    <div
      className="testimonial-card"
      style={{
        animation: inView ? `fadeInUp 0.6s ease-out ${delay}s both` : 'none',
      }}
    >
      {/* Opening quote */}
      <span
        className="absolute top-4 left-4 font-spaceGrotesk text-6xl text-[var(--accent1)] opacity-30 select-none"
        style={{ lineHeight: 1 }}
      >
        &ldquo;
      </span>

      <p
        className="relative z-[1] text-lg text-white italic pt-8"
        style={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}
      >
        {quote}
      </p>

      <div className="w-full h-px bg-[rgba(255,255,255,0.1)] my-6" />

      <p className="font-semibold text-base text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
        {author}
      </p>
      <p className="text-sm text-[rgba(255,255,255,0.5)] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
        {role}
      </p>
    </div>
  );
}

/* ─── Testimonials Section ─── */
function TestimonialsSection() {
  const { data } = useSiteData();
  const [sectionRef, inView] = useInView<HTMLDivElement>(0.2);

  return (
    <section className="py-[120px] md:py-[120px] px-5 md:px-10 lg:px-20 bg-[var(--bg)]" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div
          className="text-center mb-12"
          style={{
            animation: inView ? 'fadeInUp 0.6s ease-out both' : 'none',
          }}
        >
          <span className="text-xs uppercase tracking-[1px] text-[var(--accent1)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            TEMOIGNAGES
          </span>
          <h2 className="mt-4 font-spaceGrotesk font-bold text-white" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-1.5px', lineHeight: 1.2 }}>
            Ils nous font confiance
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.testimonials.map((t, i) => (
            <TestimonialCard
              key={t.id}
              quote={t.content}
              author={t.name}
              role={t.role}
              delay={i * 0.15}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ─── */
function CTASection() {
  const [sectionRef, inView] = useInView<HTMLDivElement>(0.2);

  return (
    <section className="py-[60px] md:py-[60px] px-5 md:px-10 lg:px-20 bg-[var(--bg)]" ref={sectionRef}>
      <div
        className="max-w-[1400px] mx-auto rounded-3xl py-20 px-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(var(--accent1-rgb), 0.1), rgba(var(--accent2-rgb), 0.1))',
          animation: inView ? 'fadeInUp 0.6s ease-out both' : 'none',
        }}
      >
        <h2
          className="font-spaceGrotesk font-bold text-white"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-1.5px', lineHeight: 1.2 }}
        >
          Pret a propulser votre marque ?
        </h2>
        <p className="mt-4 text-xl text-[rgba(255,255,255,0.7)]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Discutons de votre prochain projet.
        </p>
        <div className="flex justify-center mt-10">
          <Link to="/contact" className="btn-primary">
            NOUS CONTACTER
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Home Page ─── */
export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatisticsSection />
      <FeaturedServicesSection />
      <TestimonialsSection />
      <CTASection />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
