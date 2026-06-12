import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Megaphone,
  Video,
  Globe,
  TrendingUp,
  Handshake,
  Target,
  Palette,
  Smartphone,
  MessageSquare,
  Lightbulb,
  BarChart3,
  Users,
  Sparkles,
  Zap,
  Star,
  Heart,
} from 'lucide-react';
import { useSiteData } from '@/contexts/SiteDataContext';

gsap.registerPlugin(ScrollTrigger);

/* ─── Icon name → Component mapping ─── */
const iconMap: Record<string, React.ElementType> = {
  Megaphone,
  Video,
  Globe,
  TrendingUp,
  Handshake,
  Target,
  Palette,
  Smartphone,
  MessageSquare,
  Lightbulb,
  BarChart3,
  Users,
  Sparkles,
  Zap,
  Star,
  Heart,
};

/* ─── Service Card ─── */
function ServiceCard({
  service,
  index,
}: {
  service: { id: number; title: string; description: string; icon: string };
  index: number;
}) {
  const Icon = iconMap[service.icon] || MessageSquare;

  return (
    <div className="service-card group">
      {/* Number */}
      <span
        className="font-jetbrains text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Icon */}
      <div
        className="mt-6 w-12 h-12 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, var(--accent1), var(--accent2))',
          borderRadius: '12px',
        }}
      >
        <Icon size={24} strokeWidth={2} color="#000" />
      </div>

      {/* Title */}
      <h4
        className="font-spaceGrotesk text-xl font-semibold mt-4"
        style={{ color: 'var(--text)', letterSpacing: '-0.5px' }}
      >
        {service.title}
      </h4>

      {/* Description */}
      <p
        className="font-inter text-base mt-3"
        style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
      >
        {service.description}
      </p>

      {/* Link */}
      <span
        className="inline-block mt-6 font-jetbrains text-xs uppercase tracking-wide transition-all duration-300 group-hover:opacity-80"
        style={{ color: 'var(--accent1)' }}
      >
        En savoir plus
        <span
          className="block h-px mt-1 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
          style={{ backgroundColor: 'var(--accent1)' }}
        />
      </span>
    </div>
  );
}

/* ─── Main Services Page ─── */
export default function Services() {
  const { data } = useSiteData();
  const services = data.services;
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header animations */
      const headerTl = gsap.timeline({ delay: 0.2 });
      headerTl.fromTo(
        '.services-label',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      headerTl.fromTo(
        '.services-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
      headerTl.fromTo(
        '.services-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
      headerTl.fromTo(
        '.services-border',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.out', transformOrigin: 'left' },
        '-=0.2'
      );

      /* Cards stagger animation */
      ScrollTrigger.batch('.service-card', {
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

      /* CTA animation */
      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            ctaRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
          );
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      {/* ─── Page Header ─── */}
      <section
        ref={headerRef}
        className="relative pt-[120px] md:pt-[160px] pb-16 md:pb-20"
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
          className="services-label inline-block font-jetbrains text-xs uppercase tracking-widest mb-6"
          style={{ color: 'var(--accent1)' }}
        >
          Nos Services
        </span>

        {/* Title */}
        <h1
          className="services-title font-spaceGrotesk font-bold max-w-[800px]"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--text)',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
          }}
        >
          Une expertise complete pour votre transformation digitale
        </h1>

        {/* Subtitle */}
        <p
          className="services-subtitle font-inter text-lg mt-4 max-w-[600px]"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
        >
          De la strategie a l'execution, nous couvrons l'ensemble de vos besoins en communication digitale.
        </p>

        {/* Bottom border */}
        <div
          className="services-border mt-12 md:mt-16 h-px w-full"
          style={{ backgroundColor: 'var(--border-color)' }}
        />
      </section>

      {/* ─── Services Grid ─── */}
      <section
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
          paddingBottom: '120px',
        }}
      >
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
          paddingBottom: '120px',
        }}
      >
        <div
          ref={ctaRef}
          className="rounded-3xl py-16 md:py-20 px-8 text-center"
          style={{
            background: 'var(--surface)',
          }}
        >
          <h2
            className="font-spaceGrotesk text-2xl md:text-4xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            Un projet en tete ?
          </h2>
          <p
            className="font-inter text-base md:text-lg mt-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Decouvrez comment nous avons accompagne des marques ambitieuses.
          </p>
          <Link
            to="/realisations"
            className="btn-secondary inline-flex mt-8"
          >
            Voir nos realisations
          </Link>
        </div>
      </section>
    </div>
  );
}
