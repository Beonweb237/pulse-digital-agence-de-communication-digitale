import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import gsap from 'gsap';
import { useSiteData } from '@/contexts/SiteDataContext';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  budget: string;
  message: string;
}

interface FormErrors {
  nom?: string;
  email?: string;
  sujet?: string;
  message?: string;
}

interface StoredMessage extends FormData {
  id: string;
  timestamp: number;
  status: 'nouveau' | 'lu' | 'repondu';
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const INITIAL_FORM: FormData = {
  nom: '',
  email: '',
  telephone: '',
  sujet: '',
  budget: '',
  message: '',
};

const SUJET_OPTIONS = [
  'Strategie digitale',
  'Production audiovisuelle',
  'Gestion de plateformes',
  'Contenus viraux',
  'Partenariats',
  'Autre',
];

const BUDGET_OPTIONS = [
  '< 5K€',
  '5K€ - 15K€',
  '15K€ - 50K€',
  '> 50K€',
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Contact() {
  const { data } = useSiteData();
  const contact = data.contact;
  const networkStats = data.networkStats;

  const [form, setForm] = useState<FormData>({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  /* ---- Animations on mount ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animations
      gsap.fromTo(
        '.contact-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.contact-title',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
      );
      gsap.fromTo(
        '.contact-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
      );

      // Left column stagger
      gsap.fromTo(
        '.info-block',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
          delay: 0.3,
        }
      );

      // Right column form
      gsap.fromTo(
        rightColRef.current,
        { opacity: 0, y: 30, x: 20 },
        { opacity: 1, y: 0, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
      );
    });

    return () => ctx.revert();
  }, []);

  /* ---- Handlers ---- */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      // Clear error for this field
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[name as keyof FormErrors];
          return next;
        });
      }
    },
    [errors]
  );

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Format email invalide';
    }
    if (!form.sujet) newErrors.sujet = 'Veuillez selectionner un sujet';
    if (!form.message.trim()) newErrors.message = 'Le message est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatusMsg('');

      if (!validate()) {
        setStatus('error');
        setStatusMsg('Veuillez corriger les erreurs ci-dessus.');
        return;
      }

      setStatus('loading');

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save to localStorage
      const message: StoredMessage = {
        ...form,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        status: 'nouveau',
      };

      try {
        const existing: StoredMessage[] = JSON.parse(
          localStorage.getItem('pulse-messages') || '[]'
        );
        existing.unshift(message);
        localStorage.setItem('pulse-messages', JSON.stringify(existing));

        setStatus('success');
        setStatusMsg('Message envoye avec succes ! Nous vous repondrons sous 24h.');
        setForm({ ...INITIAL_FORM });

        // Reset after 4s
        setTimeout(() => {
          setStatus('idle');
          setStatusMsg('');
        }, 4000);
      } catch {
        setStatus('error');
        setStatusMsg("Une erreur s'est produite. Veuillez reessayer.");
      }
    },
    [form, validate]
  );

  /* ---- Derived state ---- */
  const inputBase =
    'w-full bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-4 text-white placeholder-[rgba(255,255,255,0.5)] transition-all duration-300 outline-none font-inter text-base';
  const inputFocus = 'focus:border-[var(--accent1)] focus:shadow-[0_0_0_2px_rgba(255,51,51,0.2)]';
  const inputError = 'border-[#ff3333] focus:border-[#ff3333] focus:shadow-[0_0_0_2px_rgba(255,51,51,0.2)]';

  return (
    <div className="min-h-[100dvh] bg-[var(--bg)]">
      {/* ======================== HEADER ======================== */}
      <div
        ref={headerRef}
        className="pt-[120px] md:pt-[160px] pb-[40px] md:pb-[60px] px-5 md:px-[clamp(20px,5vw,80px)] max-w-[1400px] md:ml-[80px]"
      >
        <span
          className="contact-label inline-block font-jetBrainsMono text-xs uppercase tracking-[1px] mb-4"
          style={{ color: 'var(--accent1)' }}
        >
          Contact
        </span>
        <h1 className="contact-title font-spaceGrotesk font-bold text-[clamp(2rem,5vw,3.5rem)] text-white leading-[1.2] tracking-[-1.5px]">
          Contactez-nous
        </h1>
        <p className="contact-subtitle mt-4 text-lg text-[rgba(255,255,255,0.7)] max-w-xl leading-relaxed">
          Remplissez le formulaire ci-dessous et nous vous repondrons sous 24h.
        </p>
      </div>

      {/* ======================== TWO COLUMNS ======================== */}
      <div className="px-5 md:px-[clamp(20px,5vw,80px)] pb-[80px] md:pb-[120px] max-w-[1400px] md:ml-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-12 md:gap-16">
          {/* ---------- LEFT COLUMN: Contact Info ---------- */}
          <div ref={leftColRef} className="space-y-8">
            <div className="info-block">
              <h3 className="font-spaceGrotesk text-2xl font-semibold text-white mb-4 tracking-[-0.5px]">
                Parlons de votre projet
              </h3>
              <p className="text-[rgba(255,255,255,0.7)] leading-relaxed">
                Notre equipe d&apos;experts est a votre disposition pour vous accompagner dans
                tous vos projets digitaux. N&apos;hesitez pas a nous contacter.
              </p>
            </div>

            {/* Address */}
            <div className="info-block">
              <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">
                Adresse
              </span>
              <div className="flex items-start gap-3 mt-2">
                <MapPin size={18} className="text-[var(--accent1)] mt-1 shrink-0" />
                <p className="text-white leading-relaxed">
                  {contact.address}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="info-block">
              <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">
                Email
              </span>
              <div className="flex items-center gap-3 mt-2">
                <Mail size={18} className="text-[var(--accent1)] shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[var(--accent1)] hover:underline transition-all duration-300"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="info-block">
              <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">
                Telephone
              </span>
              <div className="flex items-center gap-3 mt-2">
                <Phone size={18} className="text-[var(--accent1)] shrink-0" />
                <p className="text-white">{contact.phone}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="info-block">
              <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">
                Horaires
              </span>
              <div className="flex items-center gap-3 mt-2">
                <Clock size={18} className="text-[var(--accent1)] shrink-0" />
                <p className="text-white">{contact.hours}</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="info-block">
              <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">
                Suivez-nous
              </span>
              <div className="flex items-center gap-4 mt-3">
                {[
                  { Icon: Facebook, label: 'Facebook', href: '#' },
                  { Icon: Twitter, label: 'Twitter/X', href: '#' },
                  { Icon: Instagram, label: 'Instagram', href: '#' },
                  { Icon: Linkedin, label: 'LinkedIn', href: '#' },
                  { Icon: Youtube, label: 'YouTube', href: '#' },
                  { Icon: Music2, label: 'TikTok', href: '#' },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-[rgba(255,255,255,0.5)] hover:text-[var(--accent1)] transition-colors duration-300"
                  >
                    <Icon size={22} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-[rgba(255,255,255,0.1)]" />

            {/* Network Stats Badge */}
            <div className="info-block">
              <div className="flex items-center gap-3 flex-wrap">
                {networkStats.slice(0, 3).map((stat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-jetBrainsMono"
                    style={{
                      background: 'rgba(255, 51, 51, 0.1)',
                      border: '1px solid rgba(255, 51, 51, 0.3)',
                      color: 'var(--accent1)',
                    }}
                  >
                    {stat.label}: {stat.value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ---------- RIGHT COLUMN: Contact Form ---------- */}
          <div ref={rightColRef}>
            <form
              onSubmit={handleSubmit}
              className="bg-[var(--surface)] rounded-2xl border border-[rgba(255,255,255,0.1)] p-6 md:p-12"
            >
              {/* Nom */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Nom <span className="text-[var(--accent1)]">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Votre nom et prenom"
                  className={`${inputBase} ${inputFocus} ${errors.nom ? inputError : ''}`}
                />
                {errors.nom && (
                  <p className="mt-2 text-sm text-[#ff3333] flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.nom}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Email <span className="text-[var(--accent1)]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className={`${inputBase} ${inputFocus} ${errors.email ? inputError : ''}`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-[#ff3333] flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Telephone */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Telephone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="+33 1 23 45 67 89"
                  className={`${inputBase} ${inputFocus}`}
                />
              </div>

              {/* Sujet */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Sujet <span className="text-[var(--accent1)]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="sujet"
                    value={form.sujet}
                    onChange={handleChange}
                    className={`${inputBase} ${inputFocus} appearance-none cursor-pointer ${
                      errors.sujet ? inputError : ''
                    } ${!form.sujet ? 'text-[rgba(255,255,255,0.5)]' : 'text-white'}`}
                  >
                    <option value="" disabled>
                      Selectionnez un sujet
                    </option>
                    {SUJET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#111] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  {/* Custom chevron */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[rgba(255,255,255,0.5)]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                {errors.sujet && (
                  <p className="mt-2 text-sm text-[#ff3333] flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.sujet}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Budget estime
                </label>
                <div className="relative">
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className={`${inputBase} ${inputFocus} appearance-none cursor-pointer ${
                      !form.budget ? 'text-[rgba(255,255,255,0.5)]' : 'text-white'
                    }`}
                  >
                    <option value="" disabled>
                      Selectionnez une fourchette
                    </option>
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#111] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[rgba(255,255,255,0.5)]">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-white mb-2">
                  Message <span className="text-[var(--accent1)]">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Parlez-nous de votre projet, vos objectifs, vos delais..."
                  rows={6}
                  className={`${inputBase} ${inputFocus} resize-none ${
                    errors.message ? inputError : ''
                  }`}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-[#ff3333] flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background:
                    status === 'success'
                      ? '#28a745'
                      : status === 'error'
                      ? 'rgba(255, 51, 51, 0.1)'
                      : undefined,
                  borderColor: status === 'error' ? '#ff3333' : undefined,
                }}
              >
                {status === 'loading' && (
                  <Loader2 size={18} className="animate-spin" />
                )}
                {status === 'success' && <CheckCircle2 size={18} />}
                {status === 'idle' && <Send size={16} />}
                {status === 'error' && <AlertCircle size={18} />}
                {status === 'loading' && 'Envoi en cours...'}
                {status === 'success' && 'Message envoye'}
                {status === 'error' && 'REESSAYER'}
                {status === 'idle' && 'ENVOYER LE MESSAGE'}
              </button>

              {/* Status Messages */}
              {status === 'success' && statusMsg && (
                <p className="mt-4 text-sm text-[#28a745] flex items-center gap-2 bg-[rgba(40,167,69,0.1)] border border-[rgba(40,167,69,0.3)] rounded-lg px-4 py-3">
                  <CheckCircle2 size={16} />
                  {statusMsg}
                </p>
              )}
              {status === 'error' && statusMsg && (
                <p className="mt-4 text-sm text-[#ff3333] flex items-center gap-2 bg-[rgba(255,51,51,0.1)] border border-[rgba(255,51,51,0.3)] rounded-lg px-4 py-3">
                  <AlertCircle size={16} />
                  {statusMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
