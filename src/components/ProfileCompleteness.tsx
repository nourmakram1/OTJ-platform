import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreativeProfile, CreativeProfileData } from '../context/CreativeProfileContext';

interface CompletionStep {
  label: string;
  key: string;
  check: (p: CreativeProfileData) => boolean;
  settingsSection?: string;
}

const steps: CompletionStep[] = [
  { label: 'Add your name', key: 'name', check: p => p.name.trim().length > 0, settingsSection: 'profile' },
  { label: 'Write a bio', key: 'bio', check: p => p.bio.trim().length >= 20, settingsSection: 'profile' },
  { label: 'Set a tagline', key: 'tagline', check: p => p.tagline.trim().length > 0, settingsSection: 'profile' },
  { label: 'Choose a profession', key: 'profession', check: p => p.profession.trim().length > 0, settingsSection: 'profile' },
  { label: 'Select niches', key: 'niches', check: p => p.selectedNiches.length > 0, settingsSection: 'profile' },
  { label: 'Add your city', key: 'city', check: p => p.city.trim().length > 0, settingsSection: 'profile' },
  { label: 'Set experience level', key: 'experience', check: p => p.experience.trim().length > 0, settingsSection: 'profile' },
  { label: 'Add Instagram', key: 'instagram', check: p => p.instagram.trim().length > 1, settingsSection: 'profile' },
  { label: 'Add a portfolio link', key: 'links', check: p => p.links.some(l => l.url.trim().length > 0), settingsSection: 'profile' },
  { label: 'Add skills', key: 'skills', check: p => p.skills.length >= 3, settingsSection: 'profile' },
];

export function useProfileCompleteness() {
  const { profile } = useCreativeProfile();
  const completed = steps.filter(s => s.check(profile));
  const missing = steps.filter(s => !s.check(profile));
  const percentage = Math.round((completed.length / steps.length) * 100);
  return { percentage, completed, missing, total: steps.length, completedCount: completed.length };
}

interface ProfileCompletenessCardProps {
  variant?: 'full' | 'compact';
}

export const ProfileCompletenessCard: React.FC<ProfileCompletenessCardProps> = ({ variant = 'full' }) => {
  const navigate = useNavigate();
  const { percentage, missing, completedCount, total } = useProfileCompleteness();

  if (percentage === 100) {
    if (variant === 'compact') return null;
    return (
      <div className="bg-[hsl(var(--otj-green-bg))] border border-[hsl(var(--otj-green-border))] rounded-[14px] p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[hsl(var(--otj-green))] flex items-center justify-center text-primary-foreground text-lg">✓</div>
        <div>
          <div className="text-[13px] font-bold text-[hsl(var(--otj-green))]">Profile Complete!</div>
          <div className="text-[11px] text-[hsl(var(--otj-green))]/80">Your profile is 100% complete. You're all set to receive bookings.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-[14px] p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[13px] font-bold text-foreground">Complete Your Profile</div>
          <div className="text-[11px] text-muted-foreground">{completedCount} of {total} steps done</div>
        </div>
        <span className="text-[13px] font-extrabold text-foreground">{percentage}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: percentage >= 80 ? "hsl(var(--otj-green))" : percentage >= 50 ? "hsl(var(--otj-yellow))" : "hsl(var(--primary))",
          }}
        />
      </div>

      {variant === 'full' && missing.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          {missing.slice(0, 3).map(step => (
            <div
              key={step.key}
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2.5 p-2 px-3 rounded-[9px] bg-accent/50 cursor-pointer transition-colors hover:bg-accent"
            >
              <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-border shrink-0" />
              <div className="text-[12px] font-medium text-foreground flex-1">{step.label}</div>
              <div className="text-[10px] text-muted-foreground">→</div>
            </div>
          ))}
          {missing.length > 3 && (
            <div className="text-[11px] text-muted-foreground pl-3">+{missing.length - 3} more</div>
          )}
        </div>
      )}

      {variant === 'compact' && missing.length > 0 && (
        <div className="text-[11px] text-muted-foreground mb-3">
          Missing: {missing.slice(0, 2).map(s => s.label.toLowerCase()).join(', ')}{missing.length > 2 ? ` +${missing.length - 2} more` : ''}
        </div>
      )}

      <button
        onClick={() => navigate('/settings')}
        className="text-[12px] font-bold text-primary cursor-pointer bg-transparent border-none hover:underline p-0"
      >
        Complete now →
      </button>
    </div>
  );
};
