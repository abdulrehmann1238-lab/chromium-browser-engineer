import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { config } from '../../config';
import { ProcessScene } from './Hero/ProcessScene';
import { PinnedStory } from './Story/PinnedStory';
import { ProblemClasses } from './ProblemClasses';
import { CaseTeaser } from './CaseTeaser';
import { Ninety } from './Ninety';
import { Evidence } from './Evidence';
import { AnswerCards } from './Closing/AnswerCards';
import { ContactForm } from './Closing/ContactForm';
import { Button } from '../../design/Button';
import { ArrowRight, Copy, Check, Mail, Clock, Calendar } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const outletContext = useOutletContext<{ onFourthStonePlaced?: () => void }>();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(config.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1200);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center py-12 lg:py-16 overflow-hidden hero-dot-grid border-b border-[var(--line)]">
        <div className="container-site w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left text stack (columns 1 to 5) */}
            <div className="lg:col-span-5 flex flex-col items-start z-10">
              <span className="eyebrow">BROWSER INFRASTRUCTURE / CONCEPT DEMO</span>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-serif font-medium text-[var(--ink-1)] tracking-tight leading-[1.08] mb-5">
                At scale, Chromium fails in places a dev tab never shows.
              </h1>

              <p className="text-base sm:text-lg text-[var(--ink-2)] leading-relaxed max-w-[52ch] mb-8">
                A working concept of how I would investigate, instrument and stabilize Chromium-based infrastructure. Built so you can click through the reasoning instead of reading about it.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link to="/console">
                  <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                    Open the console
                  </Button>
                </Link>
                <Link to="/case-files/014">
                  <Button variant="secondary" size="lg">
                    Read Case File 014
                  </Button>
                </Link>
              </div>

              {/* Prepared line */}
              <div className="font-mono text-xs text-[var(--ink-3)] flex flex-wrap items-center gap-1.5 pt-4 border-t border-[var(--line)]/80 w-full">
                <span>Concept demo prepared for Chromium infrastructure hire by {config.yourName}.</span>
                <span className="px-1.5 py-0.5 rounded bg-[var(--sunken)] text-[10px] text-[var(--ink-2)] border border-[var(--line-strong)]">
                  Data is illustrative
                </span>
              </div>
            </div>

            {/* Right Scene (columns 6 to 12) */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              <ProcessScene />
            </div>
          </div>
        </div>
      </section>

      {/* How I read a browser */}
      <PinnedStory />

      {/* Problem classes */}
      <div id="problem-classes">
        <ProblemClasses />
      </div>

      {/* Case File teaser */}
      <CaseTeaser />

      {/* First 90 days */}
      <div id="timeline">
        <Ninety />
      </div>

      {/* Evidence strip */}
      <div id="evidence">
        <Evidence />
      </div>

      {/* Closing Section: Dark Inversion */}
      <section
        id="contact-section"
        className="bg-[var(--well-bg)] text-[var(--well-text)] py-24 sm:py-32 border-t border-[var(--well-line)]"
      >
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Heading and Proposal specifics */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--well-ring)] uppercase mb-3">
                APPLY
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[var(--well-text)] tracking-tight leading-tight mb-4">
                Three questions in your posting. Three direct answers.
              </h2>
              <p className="text-sm text-[var(--well-muted)] leading-relaxed mb-8">
                You asked for browser-internals experience, one hard problem solved, and open-source links. Here they are, in that order.
              </p>

              {/* Candidate Metadata Block */}
              <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--well-raised)] border border-[var(--well-line)] font-mono text-xs space-y-2.5">
                <div className="flex items-center gap-2 text-[var(--well-muted)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--well-ring)]" />
                  <span>Availability:</span>
                  <span className="text-[var(--well-text)] font-semibold">{config.availability}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--well-muted)]">
                  <Calendar className="w-3.5 h-3.5 text-[var(--well-ring)]" />
                  <span>Overlap:</span>
                  <span className="text-[var(--well-text)] font-semibold">{config.overlap}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[var(--well-line)]/50">
                  <div className="flex items-center gap-2 text-[var(--well-muted)]">
                    <Mail className="w-3.5 h-3.5 text-[var(--well-ring)]" />
                    <span className="text-[var(--well-text)]">{config.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 text-[var(--well-muted)] hover:text-white transition-colors cursor-pointer"
                    title="Copy email"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Accordion Answer Cards */}
            <div className="lg:col-span-7">
              <AnswerCards />
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="mt-20 pt-12 border-t border-[var(--well-line)] max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--well-ring)]">
                GET IN TOUCH
              </span>
              <h3 className="text-2xl font-serif font-medium text-[var(--well-text)] mt-1">
                Start a conversation about your browser fleet.
              </h3>
            </div>
            <ContactForm onSuccess={() => outletContext?.onFourthStonePlaced?.()} />
          </div>
        </div>
      </section>
    </div>
  );
};
