import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { CairnMark } from '../components/CairnMark';
import { Button } from '../design/Button';
import { IconButton } from '../design/IconButton';
import { Menu, X, ArrowUp } from 'lucide-react';
import { ToastContainer } from '../design/Toast';

export const SiteLayout: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasFourthStone, setHasFourthStone] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const contactElem = document.getElementById('contact-section');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink-1)]">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Sticky Navigation */}
      <header
        className={`sticky top-0 z-[var(--z-nav)] transition-all duration-[var(--dur-fast)] bg-[var(--paper)] ${
          scrolled ? 'h-[60px] border-b border-[var(--line)] shadow-none' : 'h-[72px]'
        }`}
      >
        <div className="container-site h-full flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 select-none group">
            <CairnMark className="w-7 h-7 text-[var(--ink-1)] transition-transform duration-200 group-hover:scale-105" />
            <span className="font-serif text-2xl font-medium tracking-tight text-[var(--ink-1)]">
              Cairn
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--ink-2)]">
            <Link
              to="/console"
              className="hover:text-[var(--ink-1)] transition-colors hover:underline underline-offset-8"
            >
              Console
            </Link>
            <Link
              to="/case-files/014"
              className="hover:text-[var(--ink-1)] transition-colors hover:underline underline-offset-8"
            >
              Case File 014
            </Link>
            <a
              href="#problem-classes"
              className="hover:text-[var(--ink-1)] transition-colors hover:underline underline-offset-8"
            >
              Problems
            </a>
            <a
              href="#timeline"
              className="hover:text-[var(--ink-1)] transition-colors hover:underline underline-offset-8"
            >
              First 90 Days
            </a>
            <a
              href="#evidence"
              className="hover:text-[var(--ink-1)] transition-colors hover:underline underline-offset-8"
            >
              Evidence
            </a>
          </nav>

          {/* Right action */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={scrollToContact}>
              Contact
            </Button>
            <Link to="/console">
              <Button variant="primary" size="sm">
                Open the console
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <IconButton
              label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </IconButton>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[var(--z-drawer)] bg-[var(--paper)] flex flex-col p-6 animate-overlay md:hidden">
          <div className="flex items-center justify-between pb-6 border-b border-[var(--line)]">
            <div className="flex items-center gap-3">
              <CairnMark className="w-7 h-7" />
              <span className="font-serif text-2xl font-medium">Cairn</span>
            </div>
            <IconButton label="Close" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </IconButton>
          </div>

          <div className="flex flex-col gap-6 py-8 text-xl font-medium font-serif">
            <Link
              to="/console"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--ink-1)]"
            >
              Console Fleet Overview
            </Link>
            <Link
              to="/case-files/014"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--ink-1)]"
            >
              Case File 014 (Investigation)
            </Link>
            <a
              href="#problem-classes"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--ink-2)]"
            >
              Problem Classes
            </a>
            <a
              href="#timeline"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--ink-2)]"
            >
              First 90 Days
            </a>
            <a
              href="#evidence"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--ink-2)]"
            >
              Open Source Evidence
            </a>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <Link to="/console" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full">
                Open the console
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        <Outlet context={{ onFourthStonePlaced: () => setHasFourthStone(true) }} />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--well-bg)] text-[var(--well-text)] border-t border-[var(--well-line)] py-12">
        <div className="container-site flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 select-none">
            <CairnMark
              className="w-7 h-7 text-[var(--well-text)]"
              hasFourthStone={hasFourthStone}
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg font-medium text-[var(--well-text)]">
                Cairn
              </span>
              <span className="font-mono text-[11px] text-[var(--well-muted)]">
                browser infrastructure, observed
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[var(--well-muted)]">
            <Link to="/console" className="hover:text-[var(--well-text)] transition-colors">
              Console
            </Link>
            <Link to="/case-files/014" className="hover:text-[var(--well-text)] transition-colors">
              Case File 014
            </Link>
            <a href="#evidence" className="hover:text-[var(--well-text)] transition-colors">
              Evidence
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-[var(--well-text)] transition-colors flex items-center gap-1 cursor-pointer"
            >
              Back to top
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right text-xs font-mono text-[var(--well-muted)] space-y-0.5">
            <div>Concept demo. All data is illustrative.</div>
            <div className="text-[11px] opacity-70">
              Built with React, TypeScript and Vite. No cookies. No third-party scripts.
            </div>
          </div>
        </div>
      </footer>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};
