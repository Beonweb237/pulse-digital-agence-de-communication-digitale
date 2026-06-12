import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Mail,
  FileText,
  Settings,
  LogOut,
  ArrowLeft,
  Eye,
  FolderOpen,
  MessageSquare,
  TrendingUp,
  Bell,
  CheckCircle2,
  Circle,
  Reply,
  X,
  Trash2,
  Palette,
  Search,
  Menu,
  Plus,
  Save,
  RotateCcw,
  Pencil,
  Users,
  Megaphone,
  Video,
  Globe,
  Handshake,
  Target,
  Smartphone,
  Lightbulb,
  BarChart3,
  Sparkles,
  Zap,
  Star,
  Heart,
} from 'lucide-react';
import AdminChart from '@/components/AdminChart';
import { useTheme, palettes } from '@/contexts/ThemeContext';
import { useSiteData } from '@/contexts/SiteDataContext';
import gsap from 'gsap';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StoredMessage {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  budget?: string;
  message: string;
  timestamp: number;
  status: 'nouveau' | 'lu' | 'repondu';
}

/* ------------------------------------------------------------------ */
/*  Icon map for services                                              */
/* ------------------------------------------------------------------ */

const serviceIconMap: Record<string, React.ElementType> = {
  Megaphone, Video, Globe, TrendingUp, Handshake, Target,
  Palette, Smartphone, MessageSquare, Lightbulb, BarChart3,
  Users, Sparkles, Zap, Star, Heart,
};

const serviceIconNames = Object.keys(serviceIconMap);

const CATEGORY_OPTIONS = ['Branding', 'Social', 'Web', 'Video'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getMessages(): StoredMessage[] {
  try {
    return JSON.parse(localStorage.getItem('pulse-messages') || '[]');
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/*  Status Badge                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: StoredMessage['status'] }) {
  const config = {
    nouveau: {
      bg: 'rgba(255, 51, 51, 0.1)',
      border: 'rgba(255, 51, 51, 0.3)',
      color: 'var(--accent1)',
      label: 'Nouveau',
    },
    lu: {
      bg: 'rgba(255,255,255,0.05)',
      border: 'rgba(255,255,255,0.1)',
      color: 'rgba(255,255,255,0.5)',
      label: 'Lu',
    },
    repondu: {
      bg: 'rgba(40, 167, 69, 0.1)',
      border: 'rgba(40, 167, 69, 0.3)',
      color: '#28a745',
      label: 'Repondu',
    },
  };

  const c = config[status];

  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-jetBrainsMono capitalize"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
    >
      {status === 'nouveau' && <Circle size={8} fill="currentColor" />}
      {status === 'lu' && <CheckCircle2 size={10} />}
      {status === 'repondu' && <Reply size={10} />}
      {c.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated Counter                                                   */
/* ------------------------------------------------------------------ */

function AnimatedCounter({ target, duration = 1000, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      setValue(target);
      return;
    }

    const startTime = performance.now();
    hasAnimated.current = true;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span>
      {value.toLocaleString('fr-FR')}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  delay,
}: {
  label: string;
  value: number;
  change: string;
  icon: React.ElementType;
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay }
      );
    }
  }, [delay]);

  const isPositive = !change.startsWith('-');

  return (
    <div
      ref={cardRef}
      className="bg-[var(--surface)] rounded-2xl border border-[rgba(255,255,255,0.1)] p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">
          {label}
        </span>
        <Icon size={20} className="text-[rgba(255,255,255,0.5)]" />
      </div>
      <div className="font-spaceGrotesk text-[32px] font-bold text-white">
        <AnimatedCounter target={value} />
      </div>
      <div
        className="mt-2 text-sm flex items-center gap-1"
        style={{ color: isPositive ? 'var(--accent1)' : '#ff3333' }}
      >
        <span>{isPositive ? '↑' : '↓'}</span>
        <span>{change}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Message Detail Modal                                               */
/* ------------------------------------------------------------------ */

function MessageModal({
  message,
  onClose,
  onMarkRead,
  onMarkReplied,
}: {
  message: StoredMessage;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkReplied: (id: string) => void;
}) {
  useEffect(() => {
    if (message.status === 'nouveau') {
      onMarkRead(message.id);
    }
  }, [message.id, message.status, onMarkRead]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl border border-[rgba(255,255,255,0.1)] p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--surface)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <StatusBadge status={message.status} />
          <h3 className="font-spaceGrotesk text-xl font-semibold text-white mt-3">
            {message.nom}
          </h3>
          <p className="text-sm text-[rgba(255,255,255,0.5)] mt-1">{message.email}</p>
          <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
            {formatDate(message.timestamp)}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">
              Sujet
            </span>
            <p className="text-white mt-1">{message.sujet}</p>
          </div>

          {message.telephone && (
            <div>
              <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">
                Telephone
              </span>
              <p className="text-white mt-1">{message.telephone}</p>
            </div>
          )}

          {message.budget && (
            <div>
              <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">
                Budget
              </span>
              <p className="text-white mt-1">{message.budget}</p>
            </div>
          )}

          <div>
            <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">
              Message
            </span>
            <p className="text-white mt-1 leading-relaxed whitespace-pre-wrap">
              {message.message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          {message.status !== 'repondu' && (
            <button
              onClick={() => {
                onMarkReplied(message.id);
                onClose();
              }}
              className="btn-primary flex-1"
            >
              <CheckCircle2 size={16} />
              Marquer comme repondu
            </button>
          )}
          <button onClick={onClose} className="btn-secondary flex-1">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Input Components                                                   */
/* ------------------------------------------------------------------ */

function TextInput({ label, value, onChange, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-white mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white placeholder-[rgba(255,255,255,0.5)] outline-none focus:border-[var(--accent1)] transition-colors text-sm"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = '', rows = 4 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-white mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white placeholder-[rgba(255,255,255,0.5)] outline-none focus:border-[var(--accent1)] transition-colors text-sm resize-none"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Site Content Sub-Tab Editors                                       */
/* ------------------------------------------------------------------ */

function HeroEditor() {
  const { data, updateSection } = useSiteData();
  const hero = data.hero;
  const [local, setLocal] = useState({ ...hero });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSection('hero', local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-spaceGrotesk text-lg font-semibold text-white">Hero Section</h3>
      <TextInput label="Titre" value={local.title} onChange={(v) => setLocal(p => ({ ...p, title: v }))} />
      <TextArea label="Sous-titre" value={local.subtitle} onChange={(v) => setLocal(p => ({ ...p, subtitle: v }))} rows={2} />
      <TextInput label="CTA Primaire" value={local.ctaPrimary} onChange={(v) => setLocal(p => ({ ...p, ctaPrimary: v }))} />
      <TextInput label="CTA Secondaire" value={local.ctaSecondary} onChange={(v) => setLocal(p => ({ ...p, ctaSecondary: v }))} />

      {/* Live Preview */}
      <div className="p-6 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#111]">
        <span className="font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)] mb-3 block">Apercu</span>
        <h1 className="font-spaceGrotesk font-bold text-2xl text-white">{local.title}</h1>
        <p className="text-[rgba(255,255,255,0.7)] mt-2">{local.subtitle}</p>
        <div className="flex gap-3 mt-4">
          <span className="text-xs font-jetBrainsMono" style={{ color: 'var(--accent1)' }}>{local.ctaPrimary}</span>
          <span className="text-xs font-jetBrainsMono text-[rgba(255,255,255,0.5)]">{local.ctaSecondary}</span>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary">
        <Save size={16} />
        {saved ? 'Enregistre !' : 'Enregistrer'}
      </button>
    </div>
  );
}

function ServicesEditor() {
  const { data, updateSection } = useSiteData();
  const [services, setServices] = useState([...data.services]);
  const [editing, setEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ id: 0, title: '', description: '', icon: 'MessageSquare' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSection('services', services);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const openEdit = (svc: typeof editForm) => {
    setEditForm({ ...svc });
    setEditing(svc.id);
  };

  const saveEdit = () => {
    setServices(prev => prev.map(s => s.id === editForm.id ? { ...editForm } : s));
    setEditing(null);
  };

  const addService = () => {
    const newId = Math.max(...services.map(s => s.id), 0) + 1;
    const newSvc = { id: newId, title: 'Nouveau Service', description: 'Description du service...', icon: 'MessageSquare' };
    setServices([...services, newSvc]);
  };

  const deleteService = (id: number) => {
    if (window.confirm('Supprimer ce service ?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-spaceGrotesk text-lg font-semibold text-white">Services ({services.length})</h3>
        <button onClick={addService} className="btn-primary text-xs py-2 px-4">
          <Plus size={14} /> Ajouter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.1)]">
              {['ID', 'Titre', 'Description', 'Icone', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map(svc => {
              const Icon = serviceIconMap[svc.icon] || MessageSquare;
              return (
                <tr key={svc.id} className="border-b border-[rgba(255,255,255,0.05)]">
                  <td className="py-3 px-4 text-sm text-[rgba(255,255,255,0.5)]">{svc.id}</td>
                  <td className="py-3 px-4 text-sm text-white font-semibold">{svc.title}</td>
                  <td className="py-3 px-4 text-sm text-[rgba(255,255,255,0.7)] max-w-[300px] truncate">{svc.description}</td>
                  <td className="py-3 px-4"><Icon size={16} className="text-[var(--accent1)]" /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(svc)} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[var(--accent1)] hover:bg-[rgba(255,51,51,0.1)] transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteService(svc.id)} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[#ff3333] hover:bg-[rgba(255,51,51,0.1)] transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button onClick={handleSave} className="btn-primary">
        <Save size={16} /> {saved ? 'Enregistre !' : 'Enregistrer les modifications'}
      </button>

      {/* Edit Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.1)] p-6" style={{ background: 'var(--surface)' }}>
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-[rgba(255,255,255,0.5)] hover:text-white">
              <X size={20} />
            </button>
            <h4 className="font-spaceGrotesk text-lg font-semibold text-white mb-4">Modifier le Service</h4>
            <TextInput label="Titre" value={editForm.title} onChange={(v) => setEditForm(p => ({ ...p, title: v }))} />
            <TextArea label="Description" value={editForm.description} onChange={(v) => setEditForm(p => ({ ...p, description: v }))} />
            <div className="mb-4">
              <label className="block text-sm font-semibold text-white mb-2">Icone</label>
              <select
                value={editForm.icon}
                onChange={(e) => setEditForm(p => ({ ...p, icon: e.target.value }))}
                className="w-full bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white outline-none focus:border-[var(--accent1)] text-sm"
              >
                {serviceIconNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <button onClick={saveEdit} className="btn-primary w-full">
              <Save size={16} /> Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectsEditor() {
  const { data, updateSection } = useSiteData();
  const [projects, setProjects] = useState([...data.projects]);
  const [editing, setEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ id: 0, title: '', category: 'Branding', image: '/project-1.jpg', description: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSection('projects', projects);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const openEdit = (p: typeof editForm) => {
    setEditForm({ ...p });
    setEditing(p.id);
  };

  const saveEdit = () => {
    setProjects(prev => prev.map(p => p.id === editForm.id ? { ...editForm } : p));
    setEditing(null);
  };

  const addProject = () => {
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const newProj = { id: newId, title: 'Nouveau Projet', category: 'Branding', image: `/project-${(newId % 6) || 6}.jpg`, description: 'Description du projet...' };
    setProjects([...projects, newProj]);
  };

  const deleteProject = (id: number) => {
    if (window.confirm('Supprimer ce projet ?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-spaceGrotesk text-lg font-semibold text-white">Projets ({projects.length})</h3>
        <button onClick={addProject} className="btn-primary text-xs py-2 px-4">
          <Plus size={14} /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(proj => (
          <div key={proj.id} className="rounded-xl border border-[rgba(255,255,255,0.1)] overflow-hidden bg-[var(--surface)] group">
            <div className="aspect-video overflow-hidden">
              <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="p-4">
              <h4 className="font-spaceGrotesk text-sm font-semibold text-white truncate">{proj.title}</h4>
              <span className="inline-block mt-1 font-jetBrainsMono text-[10px] uppercase tracking-wide px-2 py-1 rounded" style={{ color: 'var(--accent1)', background: 'rgba(var(--accent1-rgb), 0.1)', border: '1px solid rgba(var(--accent1-rgb), 0.3)' }}>
                {proj.category}
              </span>
              <p className="text-xs text-[rgba(255,255,255,0.5)] mt-2 line-clamp-2">{proj.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => openEdit(proj)} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[var(--accent1)] hover:bg-[rgba(255,51,51,0.1)] transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteProject(proj.id)} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[#ff3333] hover:bg-[rgba(255,51,51,0.1)] transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="btn-primary">
        <Save size={16} /> {saved ? 'Enregistre !' : 'Enregistrer les modifications'}
      </button>

      {/* Edit Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.1)] p-6" style={{ background: 'var(--surface)' }}>
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-[rgba(255,255,255,0.5)] hover:text-white">
              <X size={20} />
            </button>
            <h4 className="font-spaceGrotesk text-lg font-semibold text-white mb-4">Modifier le Projet</h4>
            <TextInput label="Titre" value={editForm.title} onChange={(v) => setEditForm(p => ({ ...p, title: v }))} />
            <div className="mb-4">
              <label className="block text-sm font-semibold text-white mb-2">Categorie</label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white outline-none focus:border-[var(--accent1)] text-sm"
              >
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <TextInput label="Image" value={editForm.image} onChange={(v) => setEditForm(p => ({ ...p, image: v }))} />
            <TextArea label="Description" value={editForm.description} onChange={(v) => setEditForm(p => ({ ...p, description: v }))} />
            <button onClick={saveEdit} className="btn-primary w-full">
              <Save size={16} /> Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TestimonialsEditor() {
  const { data, updateSection } = useSiteData();
  const [testimonials, setTestimonials] = useState([...data.testimonials]);
  const [editing, setEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ id: 0, name: '', role: '', content: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSection('testimonials', testimonials);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const openEdit = (t: typeof editForm) => {
    setEditForm({ ...t });
    setEditing(t.id);
  };

  const saveEdit = () => {
    setTestimonials(prev => prev.map(t => t.id === editForm.id ? { ...editForm } : t));
    setEditing(null);
  };

  const addTestimonial = () => {
    const newId = Math.max(...testimonials.map(t => t.id), 0) + 1;
    const newT = { id: newId, name: 'Nouveau Client', role: 'Role', content: 'Temoignage...' };
    setTestimonials([...testimonials, newT]);
  };

  const deleteTestimonial = (id: number) => {
    if (window.confirm('Supprimer ce temoignage ?')) {
      setTestimonials(testimonials.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-spaceGrotesk text-lg font-semibold text-white">Temoignages ({testimonials.length})</h3>
        <button onClick={addTestimonial} className="btn-primary text-xs py-2 px-4">
          <Plus size={14} /> Ajouter
        </button>
      </div>

      <div className="space-y-4">
        {testimonials.map(t => (
          <div key={t.id} className="p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[var(--surface)]">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <p className="text-[rgba(255,255,255,0.5)] text-xs mt-0.5">{t.role}</p>
                <p className="text-[rgba(255,255,255,0.7)] text-sm mt-2 italic line-clamp-3">&ldquo;{t.content}&rdquo;</p>
              </div>
              <div className="flex items-center gap-1 ml-3 shrink-0">
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[var(--accent1)] hover:bg-[rgba(255,51,51,0.1)] transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => deleteTestimonial(t.id)} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[#ff3333] hover:bg-[rgba(255,51,51,0.1)] transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSave} className="btn-primary">
        <Save size={16} /> {saved ? 'Enregistre !' : 'Enregistrer les modifications'}
      </button>

      {/* Edit Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.1)] p-6" style={{ background: 'var(--surface)' }}>
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-[rgba(255,255,255,0.5)] hover:text-white">
              <X size={20} />
            </button>
            <h4 className="font-spaceGrotesk text-lg font-semibold text-white mb-4">Modifier le Temoignage</h4>
            <TextInput label="Nom" value={editForm.name} onChange={(v) => setEditForm(p => ({ ...p, name: v }))} />
            <TextInput label="Role" value={editForm.role} onChange={(v) => setEditForm(p => ({ ...p, role: v }))} />
            <TextArea label="Contenu" value={editForm.content} onChange={(v) => setEditForm(p => ({ ...p, content: v }))} rows={4} />
            <button onClick={saveEdit} className="btn-primary w-full">
              <Save size={16} /> Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactEditor() {
  const { data, updateSection } = useSiteData();
  const contact = data.contact;
  const [local, setLocal] = useState({ ...contact });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSection('contact', local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-spaceGrotesk text-lg font-semibold text-white">Contact</h3>
      <TextInput label="Adresse" value={local.address} onChange={(v) => setLocal(p => ({ ...p, address: v }))} />
      <TextInput label="Email" value={local.email} onChange={(v) => setLocal(p => ({ ...p, email: v }))} />
      <TextInput label="Telephone" value={local.phone} onChange={(v) => setLocal(p => ({ ...p, phone: v }))} />
      <TextInput label="Horaires" value={local.hours} onChange={(v) => setLocal(p => ({ ...p, hours: v }))} />

      <button onClick={handleSave} className="btn-primary">
        <Save size={16} /> {saved ? 'Enregistre !' : 'Enregistrer'}
      </button>
    </div>
  );
}

function AboutEditor() {
  const { data, updateSection } = useSiteData();
  const about = data.about;
  const [local, setLocal] = useState({ ...about, mission: [...about.mission], values: about.values.map(v => ({ ...v })) });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSection('about', local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateMission = (index: number, value: string) => {
    const newMission = [...local.mission];
    newMission[index] = value;
    setLocal(p => ({ ...p, mission: newMission }));
  };

  const addMission = () => {
    setLocal(p => ({ ...p, mission: [...p.mission, 'Nouvelle mission...'] }));
  };

  const removeMission = (index: number) => {
    setLocal(p => ({ ...p, mission: p.mission.filter((_, i) => i !== index) }));
  };

  const updateValue = (index: number, field: 'title' | 'description', value: string) => {
    const newValues = local.values.map((v, i) => i === index ? { ...v, [field]: value } : v);
    setLocal(p => ({ ...p, values: newValues }));
  };

  const addValue = () => {
    setLocal(p => ({ ...p, values: [...p.values, { title: 'Nouvelle Valeur', description: 'Description...' }] }));
  };

  const removeValue = (index: number) => {
    setLocal(p => ({ ...p, values: p.values.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-spaceGrotesk text-lg font-semibold text-white mb-4">A Propos</h3>
        <TextInput label="Titre" value={local.title} onChange={(v) => setLocal(p => ({ ...p, title: v }))} />
        <TextArea label="Description" value={local.description} onChange={(v) => setLocal(p => ({ ...p, description: v }))} rows={4} />
        <TextArea label="Vision" value={local.vision} onChange={(v) => setLocal(p => ({ ...p, vision: v }))} rows={3} />
      </div>

      {/* Mission */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-spaceGrotesk text-base font-semibold text-white">Mission</h4>
          <button onClick={addMission} className="text-xs font-jetBrainsMono px-3 py-1.5 rounded-lg border border-[var(--accent1)] text-[var(--accent1)] hover:bg-[var(--accent1)] hover:text-black transition-colors">
            <Plus size={12} className="inline mr-1" /> Ajouter
          </button>
        </div>
        <div className="space-y-2">
          {local.mission.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-[rgba(255,255,255,0.3)] font-jetBrainsMono shrink-0 w-6">{i + 1}</span>
              <input
                type="text"
                value={m}
                onChange={(e) => updateMission(i, e.target.value)}
                className="flex-1 bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--accent1)]"
              />
              <button onClick={() => removeMission(i)} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.3)] hover:text-[#ff3333] transition-colors shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-spaceGrotesk text-base font-semibold text-white">Valeurs</h4>
          <button onClick={addValue} className="text-xs font-jetBrainsMono px-3 py-1.5 rounded-lg border border-[var(--accent1)] text-[var(--accent1)] hover:bg-[var(--accent1)] hover:text-black transition-colors">
            <Plus size={12} className="inline mr-1" /> Ajouter
          </button>
        </div>
        <div className="space-y-3">
          {local.values.map((v, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[#111]">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={v.title}
                  onChange={(e) => updateValue(i, 'title', e.target.value)}
                  className="w-full bg-transparent border-b border-[rgba(255,255,255,0.1)] px-0 py-1 text-white text-sm font-semibold outline-none focus:border-[var(--accent1)]"
                  placeholder="Titre"
                />
                <input
                  type="text"
                  value={v.description}
                  onChange={(e) => updateValue(i, 'description', e.target.value)}
                  className="w-full bg-transparent border-b border-[rgba(255,255,255,0.1)] px-0 py-1 text-[rgba(255,255,255,0.7)] text-sm outline-none focus:border-[var(--accent1)]"
                  placeholder="Description"
                />
              </div>
              <button onClick={() => removeValue(i)} className="p-1.5 rounded-lg text-[rgba(255,255,255,0.3)] hover:text-[#ff3333] transition-colors shrink-0 mt-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary">
        <Save size={16} /> {saved ? 'Enregistre !' : 'Enregistrer les modifications'}
      </button>
    </div>
  );
}

function StatsEditor() {
  const { data, updateSection } = useSiteData();
  const [stats, setStats] = useState(data.stats.map(s => ({ ...s })));
  const [networkStats, setNetworkStats] = useState(data.networkStats.map(s => ({ ...s })));
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSection('stats', stats);
    updateSection('networkStats', networkStats);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-spaceGrotesk text-lg font-semibold text-white mb-4">Statistiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[var(--surface)]">
              <TextInput label="Label" value={s.label} onChange={(v) => {
                const newStats = [...stats];
                newStats[i] = { ...newStats[i], label: v };
                setStats(newStats);
              }} />
              <div className="grid grid-cols-2 gap-3">
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-white mb-1">Valeur (nombre)</label>
                  <input
                    type="number"
                    value={s.number}
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[i] = { ...newStats[i], number: Number(e.target.value) };
                      setStats(newStats);
                    }}
                    className="w-full bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--accent1)]"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-white mb-1">Suffixe</label>
                  <input
                    type="text"
                    value={s.suffix}
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[i] = { ...newStats[i], suffix: e.target.value };
                      setStats(newStats);
                    }}
                    className="w-full bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:border-[var(--accent1)]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-spaceGrotesk text-lg font-semibold text-white mb-4">Reseaux Sociaux</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {networkStats.map((s, i) => (
            <div key={i} className="p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[var(--surface)]">
              <TextInput label="Label" value={s.label} onChange={(v) => {
                const newStats = [...networkStats];
                newStats[i] = { ...newStats[i], label: v };
                setNetworkStats(newStats);
              }} />
              <TextInput label="Valeur" value={s.value} onChange={(v) => {
                const newStats = [...networkStats];
                newStats[i] = { ...newStats[i], value: v };
                setNetworkStats(newStats);
              }} />
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary">
        <Save size={16} /> {saved ? 'Enregistre !' : 'Enregistrer les modifications'}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Site Content Tab (container with sub-tabs)                         */
/* ------------------------------------------------------------------ */

function SiteContentTab() {
  const [subTab, setSubTab] = useState('hero');

  const subTabs = [
    { key: 'hero', label: 'Hero', icon: Megaphone },
    { key: 'services', label: 'Services', icon: FolderOpen },
    { key: 'projects', label: 'Projets', icon: FolderOpen },
    { key: 'testimonials', label: 'Temoignages', icon: MessageSquare },
    { key: 'contact', label: 'Contact', icon: Mail },
    { key: 'about', label: 'A Propos', icon: Users },
    { key: 'stats', label: 'Stats', icon: TrendingUp },
  ];

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[rgba(255,255,255,0.1)] pb-4">
        {subTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setSubTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-jetBrainsMono uppercase tracking-wide transition-all duration-200"
            style={{
              background: subTab === tab.key ? 'rgba(255, 51, 51, 0.1)' : 'transparent',
              color: subTab === tab.key ? 'var(--accent1)' : 'rgba(255,255,255,0.5)',
              border: subTab === tab.key ? '1px solid rgba(255, 51, 51, 0.3)' : '1px solid transparent',
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {subTab === 'hero' && <HeroEditor />}
      {subTab === 'services' && <ServicesEditor />}
      {subTab === 'projects' && <ProjectsEditor />}
      {subTab === 'testimonials' && <TestimonialsEditor />}
      {subTab === 'contact' && <ContactEditor />}
      {subTab === 'about' && <AboutEditor />}
      {subTab === 'stats' && <StatsEditor />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Admin Component                                               */
/* ------------------------------------------------------------------ */

export default function Admin() {
  const navigate = useNavigate();
  const { currentPalette, setPalette } = useTheme();
  const { resetData } = useSiteData();

  // Data states
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<StoredMessage | null>(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Refs for animations
  const statsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  /* ---- Load messages ---- */
  useEffect(() => {
    setMessages(getMessages());
  }, []);

  /* ---- Animations ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chartRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.4 }
      );
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.5 }
      );
    });
    return () => ctx.revert();
  }, []);

  /* ---- Stats ---- */
  const totalMessages = messages.length;
  const unreadCount = messages.filter((m) => m.status === 'nouveau').length;
  const projetsEnCours = 12;
  const tauxConversion = 85;

  /* ---- Actions ---- */
  const markAsRead = useCallback((id: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) => (m.id === id && m.status === 'nouveau' ? { ...m, status: 'lu' as const } : m));
      localStorage.setItem('pulse-messages', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const markAsReplied = useCallback((id: string) => {
    setMessages((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, status: 'repondu' as const } : m));
      localStorage.setItem('pulse-messages', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem('pulse-messages', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleResetMessages = useCallback(() => {
    if (window.confirm('Etes-vous sur de vouloir supprimer tous les messages ? Cette action est irreversible.')) {
      localStorage.removeItem('pulse-messages');
      setMessages([]);
    }
  }, []);

  const handleResetAllData = useCallback(() => {
    resetData();
  }, [resetData]);

  /* ---- Filtered messages ---- */
  const filteredMessages = messages.filter(
    (m) =>
      m.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sujet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---- Nav items ---- */
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'messages', label: 'Messages', icon: Mail },
    { key: 'content', label: 'Contenu', icon: FileText },
    { key: 'settings', label: 'Parametres', icon: Settings },
  ];

  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-[999] flex overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* ======================== ADMIN SIDEBAR ======================== */}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 border-r border-[rgba(255,255,255,0.1)] bg-[#050505]/80 backdrop-blur-[20px]">
        {/* Logo */}
        <div className="flex items-center justify-center py-6">
          <Link
            to="/"
            className="w-10 h-10 rounded-full border flex items-center justify-center"
            style={{ borderColor: 'var(--accent1)' }}
          >
            <span className="font-spaceGrotesk font-bold text-[16px] gradient-text">PD</span>
          </Link>
          <span className="ml-3 font-spaceGrotesk font-bold text-white text-lg">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const active = activeNav === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveNav(item.key)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-all duration-200"
                style={{
                  background: active ? 'rgba(255, 51, 51, 0.1)' : 'transparent',
                  color: active ? 'var(--accent1)' : 'rgba(255,255,255,0.7)',
                  borderLeft: active ? '3px solid var(--accent1)' : '3px solid transparent',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = '#111';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  }
                }}
              >
                <item.icon size={18} />
                {item.label}
                {item.key === 'messages' && unreadCount > 0 && (
                  <span
                    className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--accent1)', color: '#000' }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="mx-4 h-px bg-[rgba(255,255,255,0.1)]" />

        {/* Back to site */}
        <div className="px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-colors duration-200 hover:text-white"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}
          >
            <ArrowLeft size={16} />
            Retour au site
          </Link>
        </div>

        {/* Theme Selector */}
        <div className="px-4 py-4">
          <p className="text-xs text-[rgba(255,255,255,0.5)] mb-2 font-jetBrainsMono uppercase tracking-[1px] text-[10px]">
            Theme
          </p>
          <div className="flex flex-wrap gap-2">
            {palettes.map((palette) => (
              <button
                key={palette.name}
                onClick={() => setPalette(palette.name)}
                className="w-7 h-7 rounded-full border-2 transition-transform duration-200 hover:scale-110"
                style={{
                  backgroundColor: palette.accent1,
                  borderColor: currentPalette.name === palette.name ? '#fff' : 'transparent',
                }}
                title={palette.label}
              />
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm transition-colors duration-200 hover:bg-[rgba(255,51,51,0.1)] hover:text-[#ff3333]"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}
          >
            <LogOut size={16} />
            Deconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[1500] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#050505] border-r border-[rgba(255,255,255,0.1)] flex flex-col">
            <div className="flex items-center justify-between px-4 py-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border flex items-center justify-center"
                  style={{ borderColor: 'var(--accent1)' }}
                >
                  <span className="font-spaceGrotesk font-bold text-[16px] gradient-text">PD</span>
                </div>
                <span className="font-spaceGrotesk font-bold text-white text-lg">Admin</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-[rgba(255,255,255,0.5)]">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const active = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveNav(item.key);
                      setSidebarOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-all duration-200"
                    style={{
                      background: active ? 'rgba(255, 51, 51, 0.1)' : 'transparent',
                      color: active ? 'var(--accent1)' : 'rgba(255,255,255,0.7)',
                      borderLeft: active ? '3px solid var(--accent1)' : '3px solid transparent',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    <item.icon size={18} />
                    {item.label}
                    {item.key === 'messages' && unreadCount > 0 && (
                      <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent1)', color: '#000' }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="px-4 py-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {palettes.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => setPalette(palette.name)}
                    className="w-7 h-7 rounded-full border-2 transition-transform duration-200 hover:scale-110"
                    style={{
                      backgroundColor: palette.accent1,
                      borderColor: currentPalette.name === palette.name ? '#fff' : 'transparent',
                    }}
                    title={palette.label}
                  />
                ))}
              </div>
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======================== MAIN CONTENT ======================== */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(5,5,5,0.8)] backdrop-blur-[20px]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white mr-2">
              <Menu size={22} />
            </button>
            <h1 className="font-spaceGrotesk text-xl md:text-2xl font-bold text-white">
              {activeNav === 'dashboard' && 'Tableau de bord'}
              {activeNav === 'messages' && 'Messages'}
              {activeNav === 'content' && 'Contenu du Site'}
              {activeNav === 'settings' && 'Parametres'}
            </h1>
          </div>
          <div className="hidden md:block text-sm text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {today}
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-[rgba(255,255,255,0.5)] hover:text-[var(--accent1)] transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ff3333] text-[10px] text-white font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm"
              style={{ background: '#111', color: 'var(--accent1)', fontFamily: 'Inter, sans-serif' }}
            >
              AD
            </div>
          </div>
        </header>

        {/* ======================== DASHBOARD VIEW ======================== */}
        {activeNav === 'dashboard' && (
          <div className="p-4 md:p-8">
            {/* Stats Cards */}
            <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <StatCard label="Total Messages" value={totalMessages} change="+5" icon={MessageSquare} delay={0} />
              <StatCard label="Nouveaux Messages" value={unreadCount} change={`${unreadCount}`} icon={Mail} delay={0.1} />
              <StatCard label="Projets En Cours" value={projetsEnCours} change="+2" icon={FolderOpen} delay={0.2} />
              <StatCard label="Taux de Conversion" value={tauxConversion} change="+5%" icon={TrendingUp} delay={0.3} />
            </div>

            {/* Chart Section */}
            <div
              ref={chartRef}
              className="bg-[var(--surface)] rounded-2xl border border-[rgba(255,255,255,0.1)] p-4 md:p-8 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-spaceGrotesk text-lg font-semibold text-white">
                    Visites du site (6 derniers mois)
                  </h2>
                  <p className="text-xs text-[rgba(255,255,255,0.5)] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Evolution mensuelle
                  </p>
                </div>
                <Eye size={18} className="text-[rgba(255,255,255,0.5)]" />
              </div>
              <AdminChart />
            </div>

            {/* Messages Table */}
            <div
              ref={tableRef}
              className="bg-[var(--surface)] rounded-2xl border border-[rgba(255,255,255,0.1)] p-4 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-spaceGrotesk text-lg font-semibold text-white">
                  Derniers Messages
                </h2>
                <button
                  onClick={() => setActiveNav('messages')}
                  className="font-jetBrainsMono text-xs uppercase tracking-[1px] hover:underline"
                  style={{ color: 'var(--accent1)' }}
                >
                  Voir tout
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <Mail size={40} className="mx-auto text-[rgba(255,255,255,0.2)] mb-4" />
                  <p className="text-[rgba(255,255,255,0.5)] text-sm">
                    Aucun message pour le moment.
                  </p>
                  <p className="text-[rgba(255,255,255,0.3)] text-xs mt-1">
                    Les messages envoyes via le formulaire de contact apparaitront ici.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.1)]">
                        {['Nom', 'Email', 'Sujet', 'Date', 'Statut', 'Actions'].map((h) => (
                          <th
                            key={h}
                            className="text-left py-3 px-4 font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {messages.slice(0, 5).map((msg) => (
                        <tr
                          key={msg.id}
                          className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[#111] transition-colors cursor-pointer"
                          onClick={() => setSelectedMsg(msg)}
                        >
                          <td className="py-4 px-4 text-sm text-white whitespace-nowrap">{msg.nom}</td>
                          <td className="py-4 px-4 text-sm text-[rgba(255,255,255,0.7)] whitespace-nowrap">
                            {msg.email}
                          </td>
                          <td className="py-4 px-4 text-sm text-white whitespace-nowrap">{msg.sujet}</td>
                          <td className="py-4 px-4 text-sm text-[rgba(255,255,255,0.5)] whitespace-nowrap">
                            {formatDate(msg.timestamp)}
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge status={msg.status} />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              {msg.status === 'nouveau' && (
                                <button
                                  onClick={() => markAsRead(msg.id)}
                                  className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[var(--accent1)] hover:bg-[rgba(255,51,51,0.1)] transition-colors"
                                  title="Marquer comme lu"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              {msg.status !== 'repondu' && (
                                <button
                                  onClick={() => markAsReplied(msg.id)}
                                  className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[#28a745] hover:bg-[rgba(40,167,69,0.1)] transition-colors"
                                  title="Marquer comme repondu"
                                >
                                  <Reply size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => deleteMessage(msg.id)}
                                className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[#ff3333] hover:bg-[rgba(255,51,51,0.1)] transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================== MESSAGES VIEW ======================== */}
        {activeNav === 'messages' && (
          <div className="p-4 md:p-8">
            <div className="bg-[var(--surface)] rounded-2xl border border-[rgba(255,255,255,0.1)] p-4 md:p-8">
              {/* Search bar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.5)]" />
                  <input
                    type="text"
                    placeholder="Rechercher un message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#111] border border-[rgba(255,255,255,0.1)] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-[rgba(255,255,255,0.5)] outline-none focus:border-[var(--accent1)] transition-colors"
                  />
                </div>
              </div>

              {filteredMessages.length === 0 ? (
                <div className="text-center py-16">
                  <Mail size={40} className="mx-auto text-[rgba(255,255,255,0.2)] mb-4" />
                  <p className="text-[rgba(255,255,255,0.5)] text-sm">
                    {searchTerm ? 'Aucun message ne correspond a votre recherche.' : 'Aucun message pour le moment.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.1)]">
                        {['Nom', 'Email', 'Sujet', 'Date', 'Statut', 'Actions'].map((h) => (
                          <th
                            key={h}
                            className="text-left py-3 px-4 font-jetBrainsMono text-xs uppercase tracking-[1px] text-[rgba(255,255,255,0.5)]"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMessages.map((msg) => (
                        <tr
                          key={msg.id}
                          className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[#111] transition-colors cursor-pointer"
                          onClick={() => setSelectedMsg(msg)}
                        >
                          <td className="py-4 px-4 text-sm text-white whitespace-nowrap">{msg.nom}</td>
                          <td className="py-4 px-4 text-sm text-[rgba(255,255,255,0.7)] whitespace-nowrap">
                            {msg.email}
                          </td>
                          <td className="py-4 px-4 text-sm text-white whitespace-nowrap">{msg.sujet}</td>
                          <td className="py-4 px-4 text-sm text-[rgba(255,255,255,0.5)] whitespace-nowrap">
                            {formatDate(msg.timestamp)}
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge status={msg.status} />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              {msg.status === 'nouveau' && (
                                <button
                                  onClick={() => markAsRead(msg.id)}
                                  className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[var(--accent1)] hover:bg-[rgba(255,51,51,0.1)] transition-colors"
                                  title="Marquer comme lu"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                              )}
                              {msg.status !== 'repondu' && (
                                <button
                                  onClick={() => markAsReplied(msg.id)}
                                  className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[#28a745] hover:bg-[rgba(40,167,69,0.1)] transition-colors"
                                  title="Marquer comme repondu"
                                >
                                  <Reply size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => deleteMessage(msg.id)}
                                className="p-1.5 rounded-lg text-[rgba(255,255,255,0.5)] hover:text-[#ff3333] hover:bg-[rgba(255,51,51,0.1)] transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================== CONTENT VIEW ======================== */}
        {activeNav === 'content' && (
          <div className="p-4 md:p-8">
            <div className="bg-[var(--surface)] rounded-2xl border border-[rgba(255,255,255,0.1)] p-4 md:p-8">
              <SiteContentTab />
            </div>
          </div>
        )}

        {/* ======================== SETTINGS VIEW ======================== */}
        {activeNav === 'settings' && (
          <div className="p-4 md:p-8 max-w-2xl">
            <div className="bg-[var(--surface)] rounded-2xl border border-[rgba(255,255,255,0.1)] p-4 md:p-8 space-y-8">
              {/* Color Palette */}
              <div>
                <h3 className="font-spaceGrotesk text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Palette size={18} style={{ color: 'var(--accent1)' }} />
                  Palette de couleurs
                </h3>
                <div className="flex flex-wrap gap-3">
                  {palettes.map((palette) => (
                    <button
                      key={palette.name}
                      onClick={() => setPalette(palette.name)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 hover:bg-[#111]"
                      style={{
                        borderColor: currentPalette.name === palette.name ? 'var(--accent1)' : 'rgba(255,255,255,0.1)',
                        background: currentPalette.name === palette.name ? 'rgba(255,51,51,0.05)' : undefined,
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-full border"
                        style={{ backgroundColor: palette.accent1, borderColor: 'rgba(255,255,255,0.2)' }}
                      />
                      <span className="text-sm text-white">{palette.label}</span>
                      {currentPalette.name === palette.name && (
                        <CheckCircle2 size={14} style={{ color: 'var(--accent1)' }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[rgba(255,255,255,0.1)]" />

              {/* Reset Messages */}
              <div>
                <h3 className="font-spaceGrotesk text-base font-semibold text-white mb-2 flex items-center gap-2">
                  <Trash2 size={18} className="text-[#ff3333]" />
                  Reinitialiser les messages
                </h3>
                <p className="text-sm text-[rgba(255,255,255,0.5)] mb-4">
                  Cette action supprimera definitivement tous les messages stockes dans le navigateur.
                </p>
                <button
                  onClick={handleResetMessages}
                  className="px-6 py-3 rounded-full border border-[#ff3333] text-[#ff3333] font-jetBrainsMono text-xs uppercase tracking-[1px] hover:bg-[#ff3333] hover:text-black transition-all duration-300"
                >
                  Supprimer tous les messages
                </button>
              </div>

              <div className="h-px bg-[rgba(255,255,255,0.1)]" />

              {/* Reset All Site Data */}
              <div>
                <h3 className="font-spaceGrotesk text-base font-semibold text-white mb-2 flex items-center gap-2">
                  <RotateCcw size={18} className="text-[#ff3333]" />
                  Reinitialiser tout le site
                </h3>
                <p className="text-sm text-[rgba(255,255,255,0.5)] mb-4">
                  Cette action reinitialisera TOUTES les donnees du site (contenu, stats, services, projets...) aux valeurs par defaut.
                </p>
                <button
                  onClick={handleResetAllData}
                  className="px-6 py-3 rounded-full border border-[#ff3333] text-[#ff3333] font-jetBrainsMono text-xs uppercase tracking-[1px] hover:bg-[#ff3333] hover:text-black transition-all duration-300"
                >
                  Reinitialiser tout le site
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================== MODAL ======================== */}
      {selectedMsg && (
        <MessageModal
          message={selectedMsg}
          onClose={() => setSelectedMsg(null)}
          onMarkRead={markAsRead}
          onMarkReplied={markAsReplied}
        />
      )}

      {/* ======================== STYLES ======================== */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
