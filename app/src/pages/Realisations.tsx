import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useSiteData } from '@/contexts/SiteDataContext';

gsap.registerPlugin(ScrollTrigger);

/* ─── Types ─── */
type Category = 'all' | 'branding' | 'social' | 'web' | 'video';

const categoryMap: Record<string, Category> = {
  'Branding': 'branding',
  'Social': 'social',
  'Web': 'web',
  'Video': 'video',
};

const filters: { label: string; value: Category }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Branding', value: 'branding' },
  { label: 'Social Media', value: 'social' },
  { label: 'Web', value: 'web' },
  { label: 'Video', value: 'video' },
];

/* ─── Project Card ─── */
function ProjectCard({ project }: { project: { id: number; title: string; category: string; image: string; description: string } }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      style={{ background: 'var(--surface)' }}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden rounded-2xl">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6"
          style={{
            background:
              'linear-gradient(transparent 40%, rgba(0,0,0,0.85) 100%)',
          }}
        >
          <span
            className="font-jetbrains text-xs uppercase tracking-wide"
            style={{ color: 'var(--accent1)' }}
          >
            {project.category}
          </span>
          <h4
            className="font-spaceGrotesk text-xl font-semibold mt-1"
            style={{ color: '#ffffff' }}
          >
            {project.title}
          </h4>
        </div>
      </div>

      {/* Info below image */}
      <div className="px-1 py-5">
        <h4
          className="font-spaceGrotesk text-lg font-semibold"
          style={{ color: 'var(--text)' }}
        >
          {project.title}
        </h4>
        <span
          className="inline-block mt-2 font-jetbrains text-xs uppercase tracking-wide px-3 py-1.5 rounded-lg"
          style={{
            color: 'var(--accent1)',
            background: 'rgba(var(--accent1-rgb), 0.1)',
            border: '1px solid rgba(var(--accent1-rgb), 0.3)',
          }}
        >
          {project.category}
        </span>
      </div>
    </div>
  );
}

/* ─── Filter Button ─── */
function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="font-jetbrains text-xs uppercase tracking-wide rounded-full px-6 py-2.5 transition-all duration-300 cursor-pointer"
      style={{
        background: active ? 'var(--accent1)' : 'transparent',
        border: active
          ? '1px solid var(--accent1)'
          : '1px solid var(--border-color)',
        color: active ? '#000' : 'var(--text-muted)',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'var(--accent1)';
          e.currentTarget.style.color = 'var(--accent1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.color = 'var(--text-muted)';
        }
      }}
    >
      {label}
    </button>
  );
}

/* ─── Main Realisations Page ─── */
export default function Realisations() {
  const { data } = useSiteData();
  const projects = data.projects;
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const pageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => categoryMap[p.category] === activeFilter);

  /* Entrance animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header staggered entrance */
      const headerTl = gsap.timeline({ delay: 0.2 });
      headerTl.fromTo(
        '.real-label',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      headerTl.fromTo(
        '.real-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
      headerTl.fromTo(
        '.real-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
      headerTl.fromTo(
        '.real-filters',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.2'
      );

      /* Cards scroll-triggered stagger */
      ScrollTrigger.batch('.project-card-wrapper', {
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

  /* Filter change handler with animation */
  const handleFilterChange = useCallback((filter: Category) => {
    if (filter === activeFilter) return;

    const grid = document.querySelector('.projects-grid');
    if (!grid) {
      setActiveFilter(filter);
      return;
    }

    gsap.to(grid, {
      opacity: 0,
      scale: 0.98,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setActiveFilter(filter);
        gsap.to(grid, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          delay: 0.05,
        });
      },
    });
  }, [activeFilter]);

  return (
    <div ref={pageRef}>
      {/* ─── Page Header ─── */}
      <section
        className="relative pt-[120px] md:pt-[160px] pb-10 md:pb-16"
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
          className="real-label inline-block font-jetbrains text-xs uppercase tracking-widest mb-6"
          style={{ color: 'var(--accent1)' }}
        >
          Nos Realisations
        </span>

        {/* Title */}
        <h1
          className="real-title font-spaceGrotesk font-bold max-w-[800px]"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--text)',
            letterSpacing: '-1.5px',
            lineHeight: 1.1,
          }}
        >
          Projets qui parlent d'eux-memes
        </h1>

        {/* Subtitle */}
        <p
          className="real-subtitle font-inter text-lg mt-4 max-w-[600px]"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
        >
          Une selection de nos collaborations les plus impactantes.
        </p>
      </section>

      {/* ─── Filter Bar ─── */}
      <section
        className="real-filters pb-10"
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div className="flex flex-wrap gap-3">
          {filters.map((f) => (
            <FilterButton
              key={f.value}
              label={f.label}
              active={activeFilter === f.value}
              onClick={() => handleFilterChange(f.value)}
            />
          ))}
        </div>
      </section>

      {/* ─── Projects Grid ─── */}
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
        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card-wrapper">
              <ProjectCard project={project} />
            </div>
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
            background:
              'linear-gradient(135deg, rgba(var(--accent1-rgb), 0.08), rgba(var(--accent2-rgb), 0.08))',
          }}
        >
          <h2
            className="font-spaceGrotesk text-2xl md:text-4xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            Votre projet merite d'etre vu
          </h2>
          <p
            className="font-inter text-base md:text-lg mt-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Racontons votre histoire ensemble.
          </p>
          <Link
            to="/contact"
            className="btn-primary inline-flex mt-8"
          >
            Demarrer un projet
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  );
}
