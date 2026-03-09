import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';

const industries = [
  'FMCG / Food & Beverage',
  'Tech / Startups',
  'Fashion / Retail',
  'Real Estate',
  'Healthcare / Pharma',
  'Education',
  'Finance / Banking',
  'Entertainment / Media',
  'Hospitality / Travel',
  'Non-Profit / NGO',
  'Other',
];

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companyType, setCompanyType] = useState<'individual' | 'company' | null>(null);

  const canContinue = fullName.trim() && industry && companyType;

  const handleContinue = () => {
    if (!canContinue) {
      showToast('Please fill in all required fields');
      return;
    }
    showToast('✓ Profile set up! Welcome to OTJ');
    setTimeout(() => navigate('/dashboard'), 600);
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted";

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-[480px]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-[28px] font-extrabold tracking-[-0.05em] text-foreground mb-2">
              Welcome to OTJ 👋
            </div>
            <div className="text-sm text-otj-text">Tell us a bit about yourself so we can personalize your experience</div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1 rounded-full bg-otj-green" />
            <div className={`flex-1 h-1 rounded-full transition-colors duration-300 ${companyType ? 'bg-otj-green' : 'bg-border'}`} />
            <div className={`flex-1 h-1 rounded-full transition-colors duration-300 ${industry ? 'bg-otj-green' : 'bg-border'}`} />
          </div>

          <div className="bg-card border border-border rounded-[18px] p-6 animate-fade-up">
            <div className="flex flex-col gap-5">
              {/* Type selection */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">I'm hiring as… <span className="text-destructive">*</span></div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCompanyType('individual')}
                    className={`flex-1 py-3.5 rounded-[12px] border-[1.5px] text-[13px] font-bold cursor-pointer transition-all duration-150 flex flex-col items-center gap-1 ${
                      companyType === 'individual'
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-card border-border text-otj-text hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-lg">👤</span>
                    <span>Individual</span>
                    <span className={`text-[10px] font-medium ${companyType === 'individual' ? 'text-primary-foreground/70' : 'text-otj-muted'}`}>Personal projects</span>
                  </button>
                  <button
                    onClick={() => setCompanyType('company')}
                    className={`flex-1 py-3.5 rounded-[12px] border-[1.5px] text-[13px] font-bold cursor-pointer transition-all duration-150 flex flex-col items-center gap-1 ${
                      companyType === 'company'
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-card border-border text-otj-text hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-lg">🏢</span>
                    <span>Company</span>
                    <span className={`text-[10px] font-medium ${companyType === 'company' ? 'text-primary-foreground/70' : 'text-otj-muted'}`}>Business projects</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">
                  Full Name <span className="text-destructive">*</span>
                </div>
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

              {/* Company Name (shown for company type) */}
              {companyType === 'company' && (
                <div className="animate-fade-up">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Company Name</div>
                  <input
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Edita Group"
                    className={inputClass}
                  />
                </div>
              )}

              {/* Industry */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">
                  Industry <span className="text-destructive">*</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {industries.map(ind => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-all duration-150 border-[1.5px] ${
                        industry === ind
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-card border-border text-otj-text hover:border-foreground hover:text-foreground'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {canContinue && (
                <div className="bg-otj-green-bg border border-otj-green-border rounded-[12px] p-3.5 animate-fade-up">
                  <div className="text-[11px] font-bold text-otj-green mb-1">✓ Looking good!</div>
                  <div className="text-[12px] text-otj-text">
                    {fullName}{companyName ? ` · ${companyName}` : ''} · {industry}
                  </div>
                </div>
              )}

              {/* Action */}
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`w-full py-3 rounded-full border-none text-sm font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center justify-center gap-2 group mt-1 ${
                  canContinue
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-otj-off text-otj-muted cursor-not-allowed'
                }`}
              >
                Continue to Dashboard <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
              </button>

              <button
                onClick={() => { showToast('Skipped — you can update this later'); navigate('/dashboard'); }}
                className="text-[12px] text-otj-muted font-semibold text-center cursor-pointer hover:text-foreground transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>

          <div className="text-center mt-5 text-xs text-otj-muted">
            You can update this anytime in settings
          </div>
        </div>
      </div>
      <Toast />
    </>
  );
};

export default ClientOnboarding;
