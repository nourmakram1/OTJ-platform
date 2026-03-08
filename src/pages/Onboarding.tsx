import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavOnboarding } from '../components/TopNavOnboarding';
import { OnboardingSidebar } from '../components/OnboardingSidebar';
import { Step1Panel, Step2Panel, Step3Panel, Step5Panel, Step6Panel, Step7Panel } from '../components/OnboardingSteps';
import { Toast, showToast } from '../components/Toast';

const REQUIRED_STEPS = [1, 2, 5];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());
  const [showComplete, setShowComplete] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState('Photographer');
  const [selectedNiches, setSelectedNiches] = useState<string[]>(['Fashion Editorial', 'E-Commerce']);

  const isReady = REQUIRED_STEPS.every(s => doneSteps.has(s));

  const markDone = useCallback((step: number) => {
    setDoneSteps(prev => new Set(prev).add(step));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback((from: number) => {
    markDone(from);
    if (from < 6) {
      setCurrentStep(from + 1);
      showToast(`Step ${from} saved ✓`);
    }
  }, [markDone]);

  const prevStep = useCallback((from: number) => {
    if (from > 1) setCurrentStep(from - 1);
  }, []);

  const handleGoLive = useCallback(() => {
    if (isReady) {
      showToast('🟢 You are now live on OTJ!');
    } else {
      showToast('Complete all required steps first');
    }
  }, [isReady]);

  const handleSkip = useCallback(() => {
    setShowComplete(true);
  }, []);

  const handleFinish = useCallback(() => {
    markDone(6);
    setShowComplete(true);
  }, [markDone]);

  if (showComplete) {
    return (
      <>
        <TopNavOnboarding currentStep={6} totalSteps={6} isReady={isReady} onSkip={handleSkip} onGoLive={handleGoLive} />
        <div className="min-h-screen flex flex-col items-center justify-center pt-[52px] text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-otj-green-bg border-2 border-otj-green-border flex items-center justify-center text-4xl mb-6">✓</div>
          <div className="text-5xl font-extrabold tracking-[-0.05em] text-foreground leading-[0.9] mb-3">PROFILE<br/>COMPLETE.</div>
          <div className="text-sm text-otj-text max-w-[400px] leading-relaxed mb-8">Your profile is built. You decide when the world can find you — go live when you're ready.</div>
          <div className="flex gap-2.5">
            <button onClick={() => showToast('Previewing your profile…')} className="text-[13.5px] font-bold px-6 py-3 rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">
              👁 Preview Profile
            </button>
            <button onClick={() => navigate('/booking')} className="text-sm font-bold px-8 py-[13px] rounded-full border-none bg-otj-green text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90">
              🟢 Go Live Now
            </button>
          </div>
        </div>
        <Toast />
      </>
    );
  }

  return (
    <>
      <TopNavOnboarding currentStep={currentStep} totalSteps={6} isReady={isReady} onSkip={handleSkip} onGoLive={handleGoLive} />
      <div className="min-h-screen pt-[52px]">
        <OnboardingSidebar currentStep={currentStep} doneSteps={doneSteps} isReady={isReady} onStepClick={goToStep} onGoLive={handleGoLive} />
        <main className="ml-[260px] px-12 py-10 max-w-[900px]">
          {currentStep === 1 && <Step1Panel onNext={() => nextStep(1)} onSelectionsChange={(prof, niches) => { setSelectedProfession(prof); setSelectedNiches(niches); }} />}
          {currentStep === 2 && <Step2Panel onNext={() => nextStep(2)} onBack={() => prevStep(2)} selectedProfession={selectedProfession} selectedNiches={selectedNiches} />}
          {currentStep === 3 && <Step3Panel onNext={() => nextStep(3)} onBack={() => prevStep(3)} />}
          {currentStep === 4 && <Step5Panel onNext={() => nextStep(4)} onBack={() => prevStep(4)} />}
          {currentStep === 5 && <Step6Panel onNext={() => nextStep(5)} onBack={() => prevStep(5)} />}
          {currentStep === 6 && <Step7Panel onBack={() => prevStep(6)} onNext={() => {}} onFinish={handleFinish} />}
        </main>
      </div>
      <Toast />
    </>
  );
};

export default Onboarding;
