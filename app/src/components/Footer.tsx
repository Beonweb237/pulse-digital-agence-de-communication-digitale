import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  const quickLinks = [
    { to: '/services', label: 'Services' },
    { to: '/realisations', label: 'Réalisations' },
    { to: '/contact', label: 'Contact' },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <footer className="bg-[#050505] border-t border-[rgba(255,255,255,0.1)] py-12 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: 'var(--accent1)' }}>
                <span className="font-spaceGrotesk font-bold text-sm gradient-text">PD</span>
              </span>
              <span className="font-spaceGrotesk font-semibold text-lg text-white">Pulse Digital</span>
            </Link>
            <p className="text-sm text-[rgba(255,255,255,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
              &copy; {currentYear} Pulse Digital. Tous droits réservés.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-[rgba(255,255,255,0.5)] hover:text-[var(--accent1)] transition-colors duration-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-[rgba(255,255,255,0.5)] hover:text-[var(--accent1)] transition-colors duration-300"
              >
                <social.icon size={20} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
