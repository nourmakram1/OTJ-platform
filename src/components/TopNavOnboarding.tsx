import React from 'react';

interface TopNavOnboardingProps {
  currentStep: number;
  totalSteps: number;
  isReady: boolean;
  onSkip: () => void;
  onGoLive: () => void;
}

export const TopNavOnboarding: React.FC<TopNavOnboardingProps> = ({
  currentStep, totalSteps, isReady, onSkip, onGoLive
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-[52px] bg-card/97 backdrop-blur-[12px] border-b border-border flex items-center px-3 md:px-6 gap-2 md:gap-4">
      <div className="text-[17px] font-extrabold tracking-[-0.05em] text-foreground shrink-0">
        OTJ<sup className="text-[7px] align-super">™</sup>
      </div>
      <div className="w-px h-[18px] bg-border hidden md:block" />
      <div className="text-xs font-semibold text-otj-text hidden md:block">
        Build Your Profile · <strong className="text-foreground">Step {currentStep} of {totalSteps}</strong>
      </div>
      <div className="text-[10px] font-semibold text-otj-text md:hidden">
        Step {currentStep}/{totalSteps}
      </div>
      <div className="ml-auto flex items-center gap-1.5 md:gap-2.5">
        <button
          onClick={onSkip}
          className="text-[10px] md:text-xs font-semibold text-otj-text px-2.5 md:px-3.5 py-1.5 rounded-full border border-border bg-card cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground"
        >
          Skip
        </button>
        <button
          onClick={onGoLive}
          className={`text-[10px] md:text-xs font-bold px-3 md:px-4 py-1.5 rounded-full border-none cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-1 md:gap-1.5 ${
            isReady
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-otj-light text-otj-muted cursor-not-allowed'
          }`}
        >
          {isReady ? '🟢 Go Live' : '🔒 Not Ready'}
        </button>
      </div>
    </nav>
  );
};
