import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { showToast } from './Toast';

interface ProfileIncompleteBannerProps {
  percentage: number;
  /** Where to send the user to finish their profile. */
  ctaPath: string;
  /** Storage key so dismissal persists across the session. */
  storageKey: string;
  /** Friendly label for the toast / banner copy. */
  roleLabel: 'creative' | 'client';
}

/**
 * Top-of-dashboard nudge shown when profile completeness < 100%.
 * Renders a dismissible banner and fires a one-shot toast on first mount per session.
 */
export const ProfileIncompleteBanner: React.FC<ProfileIncompleteBannerProps> = ({
  percentage,
  ctaPath,
  storageKey,
  roleLabel,
}) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(storageKey) === '1';
  });
  const toastFired = useRef(false);

  useEffect(() => {
    if (toastFired.current) return;
    if (percentage >= 100) return;
    if (typeof window === 'undefined') return;
    const toastKey = `${storageKey}:toast`;
    if (sessionStorage.getItem(toastKey) === '1') return;
    sessionStorage.setItem(toastKey, '1');
    toastFired.current = true;
    const msg = roleLabel === 'creative'
      ? `Your profile is ${percentage}% complete — finish it to start receiving bookings.`
      : `Your profile is ${percentage}% complete — finish it so creatives can respond faster.`;
    // Defer slightly so it doesn't collide with route transitions.
    const t = setTimeout(() => showToast(msg), 600);
    return () => clearTimeout(t);
  }, [percentage, roleLabel, storageKey]);

  if (percentage >= 100 || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== 'undefined') sessionStorage.setItem(storageKey, '1');
  };

  return (
    <div className="mb-4 rounded-[14px] border border-foreground bg-foreground p-3 px-4 flex items-center gap-3 animate-fade-up">
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-extrabold text-background tracking-[-0.01em]">
          Your profile is {percentage}% complete
        </div>
        <div className="text-[11px] text-background/70 leading-snug truncate">
          {roleLabel === 'creative'
            ? 'Finish setting it up to unlock bookings and stand out in search.'
            : 'Add the last details so creatives can respond to your briefs faster.'}
        </div>
      </div>
      <button
        onClick={() => navigate(ctaPath)}
        className="text-[11.5px] font-bold px-3 py-1.5 rounded-full bg-background text-foreground cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-95 shrink-0"
      >
        Finish setup →
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="w-7 h-7 rounded-full hover:bg-background/10 flex items-center justify-center text-background/60 hover:text-background transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
