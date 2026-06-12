import { createContext, useContext, useState, useCallback, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HeroData {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface StatItem {
  label: string;
  value: string;
  number: number;
  suffix: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  content: string;
}

export interface ContactData {
  address: string;
  email: string;
  phone: string;
  hours: string;
}

export interface AboutValue {
  title: string;
  description: string;
}

export interface AboutData {
  title: string;
  description: string;
  vision: string;
  mission: string[];
  values: AboutValue[];
}

export interface NetworkStat {
  label: string;
  value: string;
}

export interface SiteData {
  hero: HeroData;
  stats: StatItem[];
  services: ServiceItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  contact: ContactData;
  about: AboutData;
  networkStats: NetworkStat[];
}

export type SiteDataSection = keyof SiteData;

/* ------------------------------------------------------------------ */
/*  Default Data (French digital agency)                               */
/* ------------------------------------------------------------------ */

export const defaultSiteData: SiteData = {
  hero: {
    title: 'Agence de Communication Digitale',
    subtitle: 'Strategie, creation et viralite pour marques ambitieuses.',
    ctaPrimary: 'NOS SERVICES',
    ctaSecondary: 'NOS REALISATIONS',
  },

  stats: [
    { label: 'Projets Livres', value: '150+', number: 150, suffix: '+' },
    { label: 'Marques Accompagnees', value: '80+', number: 80, suffix: '+' },
    { label: 'Abonnes Touchés', value: '5M+', number: 5, suffix: 'M+' },
    { label: 'Annees d\'Existence', value: '8', number: 8, suffix: '' },
  ],

  services: [
    {
      id: 1,
      title: 'Strategie Digitale',
      description: 'Audits, plans d\'action et feuilles de route data-driven pour votre transformation digitale.',
      icon: 'TrendingUp',
    },
    {
      id: 2,
      title: 'Direction Artistique',
      description: 'Identites visuelles, UI/UX et systemes de design qui marquent les esprits.',
      icon: 'Palette',
    },
    {
      id: 3,
      title: 'Social Media',
      description: 'Creation de contenu, community management et campagnes sponsorisees multi-plateformes.',
      icon: 'Smartphone',
    },
    {
      id: 4,
      title: 'Production Audiovisuelle',
      description: 'Videos 4K, motion design, interviews et reportages. Podcasts et contenus multimedia.',
      icon: 'Video',
    },
    {
      id: 5,
      title: 'Partenariats Strategiques',
      description: 'Collaboration avec des plateformes numeriques a forte credibilite. Acces a des millions d\'abonnes.',
      icon: 'Handshake',
    },
    {
      id: 6,
      title: 'Influence Marketing',
      description: 'Identification et collaboration avec des influenceurs pertinents. Suivi ROI et optimisation.',
      icon: 'Target',
    },
  ],

  projects: [
    {
      id: 1,
      title: 'Lumiere Noire',
      category: 'Branding',
      image: '/project-1.jpg',
      description: 'Creation d\'une identite visuelle complete pour la marque de luxe Lumiere Noire.',
    },
    {
      id: 2,
      title: 'AfriCommerce Rebrand',
      category: 'Branding',
      image: '/project-2.jpg',
      description: 'Refonte totale de l\'identite de marque pour la plateforme e-commerce AfricCommerce.',
    },
    {
      id: 3,
      title: 'Campagne NutriAfrik',
      category: 'Social',
      image: '/project-3.jpg',
      description: 'Campagne social media complète pour le lancement des produits NutriAfrik.',
    },
    {
      id: 4,
      title: 'Dashboard Analytics',
      category: 'Web',
      image: '/project-4.jpg',
      description: 'Conception et developpement d\'un tableau de bord analytics en temps reel.',
    },
    {
      id: 5,
      title: 'Guide de Marque TechStart',
      category: 'Branding',
      image: '/project-5.jpg',
      description: 'Elaboration du guide de marque complet pour le startup TechStart.',
    },
    {
      id: 6,
      title: 'Serie Documentaire "Visages"',
      category: 'Video',
      image: '/project-6.jpg',
      description: 'Production d\'une serie documentaire de 6 episodes sur les entrepreneurs africains.',
    },
  ],

  testimonials: [
    {
      id: 1,
      name: 'Marie D.',
      role: 'CEO, TechStart',
      content: 'Pulse Digital a transforme notre presence en ligne en 3 mois. Resultats au-dela de nos attentes.',
    },
    {
      id: 2,
      name: 'Karim B.',
      role: 'DG, AfriCommerce',
      content: 'Une equipe creative, reactive et visionnaire. Notre taux d\'engagement a explose.',
    },
    {
      id: 3,
      name: 'Aicha L.',
      role: 'Fondatrice, NutriAfrik',
      content: 'Leur approche data + creativite est unique. Ils comprennent vraiment le marche africain.',
    },
  ],

  contact: {
    address: '123 Boulevard Haussmann, 75008 Paris, France',
    email: 'contact@pulsedigital.fr',
    phone: '+33 1 23 45 67 89',
    hours: 'Lun-Ven: 9h-18h',
  },

  about: {
    title: 'Qui sommes-nous ?',
    description:
      'Pulse Digital est une agence de communication digitale independante fondee en 2016. Nous accompagnons les marques ambitieuses dans leur transformation digitale avec une approche qui allie creativite, data et expertise du marche africain. Notre equipe pluridisciplinaire reunit strateges, creatifs, developpeurs et producteurs de contenu passionnes.',
    vision:
      'Devenir l\'agence de reference pour l\'innovation digitale en Afrique et porter les marques vers un impact durable et mesurable.',
    mission: [
      'Accompagner les marques dans leur transformation digitale avec des strategies sur mesure',
      'Creer des contenus qui captent l\'attention et generent de l\'engagement authentique',
      'Connecter les entreprises avec leur audience a travers des campagnes data-driven',
      'Developper des partenariats strategiques pour amplifier la portee de chaque message',
      'Mesurer et optimiser en continu pour garantir un retour sur investissement maximal',
    ],
    values: [
      {
        title: 'Creativite',
        description: 'Nous repoussons les limites de l\'innovation pour creer des experiences memorables.',
      },
      {
        title: 'Data-Driven',
        description: 'Chaque decision est fondee sur des donnees precises et des analyses approfondies.',
      },
      {
        title: 'Authenticite',
        description: 'Nous valorisons les voix authentiques et les connexions humaines genuines.',
      },
      {
        title: 'Excellence',
        description: 'Nous visons l\'excellence dans chaque projet, du plus modeste au plus ambitieux.',
      },
    ],
  },

  networkStats: [
    { label: 'Facebook', value: '1.2M+' },
    { label: 'Instagram', value: '850K+' },
    { label: 'TikTok', value: '2.1M+' },
    { label: 'YouTube', value: '600K+' },
    { label: 'Twitter/X', value: '450K+' },
    { label: 'LinkedIn', value: '180K+' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface SiteDataContextType {
  data: SiteData;
  updateSection: <K extends SiteDataSection>(section: K, newData: SiteData[K]) => void;
  resetData: () => void;
}

const SiteDataContext = createContext<SiteDataContextType>({
  data: defaultSiteData,
  updateSection: () => {},
  resetData: () => {},
});

const STORAGE_KEY = 'pulse-site-data';

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultSiteData, ...JSON.parse(saved) };
      }
    } catch {
      // ignore parse errors
    }
    return defaultSiteData;
  });

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateSection = useCallback(<K extends SiteDataSection>(section: K, newData: SiteData[K]) => {
    setData((prev) => ({
      ...prev,
      [section]: newData,
    }));
  }, []);

  const resetData = useCallback(() => {
    if (window.confirm('Etes-vous sur de vouloir reinitialiser toutes les donnees du site ? Cette action est irreversible.')) {
      setData(defaultSiteData);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <SiteDataContext.Provider value={{ data, updateSection, resetData }}>
      {children}
    </SiteDataContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useSiteData() {
  return useContext(SiteDataContext);
}

export default SiteDataContext;
