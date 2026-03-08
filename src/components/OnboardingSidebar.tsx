import React from 'react';

interface Step {
  icon: string;
  name: string;
  sub: string;
  required: boolean;
}

const steps: Step[] = [
  { icon: '🎯', name: 'Profession & Niche', sub: 'Who you are', required: true },
  { icon: '👤', name: 'Profile & Bio', sub: 'Your story', required: true },
  { icon: '🖼️', name: 'Portfolio / Samples', sub: 'Show your work', required: false },
  { icon: '📋', name: 'Brief Questions', sub: 'What you need to know', required: false },
  { icon: '📅', name: 'Availability', sub: 'When you work', required: true },
  { icon: '⚙️', name: 'Settings', sub: 'Preferences', required: false },
];

interface OnboardingSidebarProps {
  currentStep: number;
  doneSteps: Set<number>;
  isReady: boolean;
  onStepClick: (step: number) => void;
  onGoLive: () => void;
}

export const OnboardingSidebar: React.FC<OnboardingSidebarProps> = ({
  currentStep, doneSteps, isReady, onStepClick, onGoLive
}) => {
  const pct = Math.round((doneSteps.size / 7) * 100);
  const circumference = 163;
  const offset = circumference - (circumference * pct / 100);
  const requiredSteps = [1, 2, 4, 6];
  const missing = requiredSteps.filter(s => !doneSteps.has(s));

  return (
    <aside className="bg-card border-r border-border p-[28px_20px_24px] fixed top-[52px] left-0 bottom-0 w-[260px] overflow-y-auto flex flex-col gap-0">
      <div className="text-base font-extrabold tracking-[-0.04em] text-foreground mb-1">Build Your Profile</div>
      <div className="text-[11.5px] text-otj-text leading-relaxed mb-5">Complete at your own pace. Go live whenever you're ready.</div>

      {/* Completion ring */}
      <div className="flex flex-col items-center mb-5">
        <svg className="w-16 h-16" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--otj-light))" strokeWidth="5" />
          <circle
            cx="32" cy="32" r="26"
            fill="none" stroke="hsl(var(--otj-black))" strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-600 ease-out"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '32px 32px' }}
          />
        </svg>
        <div className="text-[11px] font-bold text-otj-text mt-1.5 tracking-[-0.01em]">{pct}% Complete</div>
      </div>

      {/* Step list */}
      <div className="flex flex-col gap-0.5 flex-1">
        {steps.map((step, i) => {
          const num = i + 1;
          const isDone = doneSteps.has(num);
          const isActive = currentStep === num && !isDone;
          return (
            <div
              key={num}
              onClick={() => onStepClick(num)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] cursor-pointer transition-all duration-150 ${
                isActive ? 'bg-otj-off' : isDone ? '' : 'hover:bg-otj-off'
              }`}
            >
              <div className={`w-7 h-7 rounded-[7px] border-[1.5px] flex items-center justify-center text-[13px] shrink-0 transition-all duration-200 ${
                isDone
                  ? 'border-otj-green bg-otj-green-bg text-[11px]'
                  : isActive
                    ? 'border-foreground bg-otj-off'
                    : 'border-border bg-card'
              }`}>
                {isDone ? '✓' : step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[12.5px] font-bold tracking-[-0.02em] transition-colors duration-150 ${
                  isDone ? 'text-otj-green' : isActive ? 'text-foreground' : 'text-otj-text'
                }`}>{step.name}</div>
                <div className="text-[10.5px] text-otj-muted mt-px">{step.sub}</div>
              </div>
              <span className={`text-[9px] font-bold px-[7px] py-[2px] rounded-full shrink-0 ${
                isDone
                  ? 'bg-otj-green-bg text-otj-green border border-otj-green-border'
                  : step.required
                    ? 'bg-otj-off text-otj-text border border-border'
                    : 'text-otj-muted'
              }`}>
                {isDone ? '✓' : step.required ? 'Req' : 'Optional'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-border my-4" />

      {/* Go Live card */}
      <div className={`p-[14px_16px] rounded-xl border text-center ${
        isReady ? 'bg-primary border-primary' : 'bg-otj-off border-border'
      }`}>
        <div className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-2 ${
          isReady ? 'text-primary-foreground/40' : 'text-otj-muted'
        }`}>Profile Status</div>
        <button
          onClick={onGoLive}
          className={`w-full py-2.5 rounded-full border-none font-bold text-[13px] cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center justify-center gap-1.5 ${
            isReady
              ? 'bg-card text-foreground hover:bg-otj-off'
              : 'bg-border text-otj-muted cursor-not-allowed'
          }`}
        >
          {isReady ? '🟢 Go Live Now' : '🔒 Not Ready Yet'}
        </button>
        <div className={`text-[10.5px] mt-[7px] leading-relaxed ${
          isReady ? 'text-primary-foreground/40' : 'text-otj-text'
        }`}>
          {isReady ? 'All required steps complete!' : `Complete steps ${missing.join(', ')} to go live`}
        </div>
      </div>
    </aside>
  );
};
