import React, { useState } from 'react';
import { mockApi } from '../../../mock/api';
import { Button } from '../../../design/Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ContactFormProps {
  onSuccess: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [overlapHours, setOverlapHours] = useState('Flexible');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name || name.trim().length < 2) {
      errs.name = "Tell me who I'm writing back to.";
    }
    if (!email || !email.includes('@')) {
      errs.email = "That email doesn't look right.";
    }
    if (!message || message.trim().length < 20) {
      errs.message = 'A sentence or two is enough (20 characters minimum).';
    } else if (message.length > 600) {
      errs.message = 'Please keep within 600 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await mockApi.submitContact({
        name,
        email,
        organization,
        message,
        overlapHours,
      });
      setSubmitted(true);
      onSuccess();
    } catch (err: any) {
      setGeneralError("Couldn't send. Your message is still here. (demo, simulated failure)");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[var(--well-raised)] border border-emerald-800/80 rounded-[var(--radius-xl)] p-8 text-center animate-reveal">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-xl font-serif text-[var(--well-text)] mb-2">
          Thanks, {name}.
        </h3>
        <p className="text-sm font-mono text-[var(--well-muted)] mb-6">
          Demo only: no message was sent.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="text-xs bg-[var(--well-bg)] border-[var(--well-line)] text-[var(--well-text)] hover:bg-[var(--well-line)]"
          onClick={() => {
            setSubmitted(false);
            setMessage('');
          }}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {generalError && (
        <div
          role="alert"
          className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-[var(--radius-md)] flex items-center gap-2 text-xs text-rose-300 font-mono"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="text-xs font-mono uppercase text-[var(--well-muted)] block mb-1">
            Your name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="Priya Raman"
            className="w-full h-10 px-3 bg-[var(--well-raised)] border border-[var(--well-line)] rounded-[var(--radius-md)] text-sm text-[var(--well-text)] placeholder:text-[var(--well-muted)]/50 focus:outline-none focus:border-[var(--well-ring)]"
          />
          {errors.name && <span className="text-xs text-rose-400 mt-1 block font-mono">{errors.name}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-mono uppercase text-[var(--well-muted)] block mb-1">
            Work email <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            placeholder="priya@company.com"
            className="w-full h-10 px-3 bg-[var(--well-raised)] border border-[var(--well-line)] rounded-[var(--radius-md)] text-sm text-[var(--well-text)] placeholder:text-[var(--well-muted)]/50 focus:outline-none focus:border-[var(--well-ring)]"
          />
          {errors.email && <span className="text-xs text-rose-400 mt-1 block font-mono">{errors.email}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Organization */}
        <div>
          <label className="text-xs font-mono uppercase text-[var(--well-muted)] block mb-1">
            Organization (optional)
          </label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Autonomous Browser Fleet"
            className="w-full h-10 px-3 bg-[var(--well-raised)] border border-[var(--well-line)] rounded-[var(--radius-md)] text-sm text-[var(--well-text)] placeholder:text-[var(--well-muted)]/50 focus:outline-none focus:border-[var(--well-ring)]"
          />
        </div>

        {/* Overlap Hours */}
        <div>
          <label className="text-xs font-mono uppercase text-[var(--well-muted)] block mb-1">
            Overlap hours (optional)
          </label>
          <select
            value={overlapHours}
            onChange={(e) => setOverlapHours(e.target.value)}
            className="w-full h-10 px-3 bg-[var(--well-raised)] border border-[var(--well-line)] rounded-[var(--radius-md)] text-sm text-[var(--well-text)] focus:outline-none focus:border-[var(--well-ring)]"
          >
            <option value="Flexible">Flexible (4-6h overlap)</option>
            <option value="Your morning">Your morning (EU / US East)</option>
            <option value="Your afternoon">Your afternoon (US West)</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-mono uppercase text-[var(--well-muted)]">
            What are you working on? <span className="text-rose-400">*</span>
          </label>
          <span className="font-mono text-[11px] text-[var(--well-muted)]">
            {message.length}/600
          </span>
        </div>
        <textarea
          required
          rows={3}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
          }}
          placeholder="A sentence or two about your browser fleet or upcoming Chromium challenge..."
          className="w-full p-3 bg-[var(--well-raised)] border border-[var(--well-line)] rounded-[var(--radius-md)] text-sm text-[var(--well-text)] placeholder:text-[var(--well-muted)]/50 focus:outline-none focus:border-[var(--well-ring)] resize-y"
        />
        {errors.message && (
          <span className="text-xs text-rose-400 mt-1 block font-mono">{errors.message}</span>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between">
        <span className="text-[11px] font-mono text-[var(--well-muted)]">
          Demo form · No real credentials sent
        </span>
        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="bg-[var(--paper)] text-[var(--ink-1)] hover:bg-[var(--elevated)] font-semibold text-sm"
        >
          Send a message
        </Button>
      </div>
    </form>
  );
};
