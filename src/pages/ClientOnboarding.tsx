import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';
import { categoryNiches } from '../data/niches';

const industries = [
  'FMCG / Food & Beverage', 'Tech / Startups', 'Fashion / Retail', 'Real Estate',
  'Healthcare / Pharma', 'Education', 'Finance / Banking', 'Entertainment / Media',
  'Hospitality / Travel', 'Non-Profit / NGO', 'Other',
];

const categories = Object.keys(categoryNiches);

const cities = ['Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Hurghada', 'Sharm El Sheikh', 'Tanta', 'Aswan', 'Other'];

const stepsMeta = [
  { icon: '🏢', name: 'About You', sub: 'Type & basics', required: true },
  { icon: '📞', name: 'Contact Info', sub: 'How to reach you', required: true },
  { icon: '🎯', name: 'What I Need', sub: 'Professions & skills', required: false },
];

const TOTAL_STEPS = 3;

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());

  // Step 1
  const [companyType, setCompanyType] = useState<'individual' | 'company' | null>(null);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');

  // Step 2
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('Cairo');

  // Step 3
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const availableNiches = useMemo(() => selectedCategories.flatMap(cat => categoryNiches[cat] || []), [selectedCategories]);
  const availableSkills = useMemo(() => {
    const set = new Set<string>();
    availableNiches.filter(n => selectedNiches.includes(n.label)).forEach(n => n.skills.forEach(s => set.add(s)));
    return Array.from(set);
  }, [availableNiches, selectedNiches]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat];
      const validLabels = next.flatMap(c => (categoryNiches[c] || []).map(n => n.label));
      setSelectedNiches(sn => sn.filter(n => validLabels.includes(n)));
      return next;
    });
  };
  const toggleNiche = (n: string) => {
    setSelectedNiches(prev => {
      const next = prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n];
      const validSkills = new Set<string>();
      availableNiches.filter(ni => next.includes(ni.label)).forEach(ni => ni.skills.forEach(s => validSkills.add(s)));
      setSelectedSkills(ss => ss.filter(s => validSkills.has(s)));
      return next;
    });
  };
  const toggleSkill = (s: string) => setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const markDone = useCallback((step: number) => setDoneSteps(prev => new Set(prev).add(step)), []);

  const nextStep = useCallback((from: number) => {
    markDone(from);
    showToast(`Step ${from} saved ✓`);
    if (from < TOTAL_STEPS) setCurrentStep(from + 1);
  }, [markDone]);

  const prevStep = useCallback((from: number) => {
    if (from > 1) setCurrentStep(from - 1);
  }, []);

  const isReady = doneSteps.has(1) && doneSteps.has(2);
  const pct = Math.round((doneSteps.size / TOTAL_STEPS) * 100);
  const circumference = 163;
  const offset = circumference - (circumference * pct / 100);

  const handleFinish = useCallback(() => {
    markDone(currentStep);
    showToast('✓ Profile set up! Welcome to OTJ');
    setTimeout(() => navigate('/dashboard'), 600);
  }, [markDone, currentStep, navigate]);

  const handleSkip = useCallback(() => {
    showToast('Skipped — you can update this later');
    navigate('/dashboard');
  }, [navigate]);

  const inputClass = "px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card placeholder:text-otj-muted";
  const chipClass = (active: boolean) => `text-[12.5px] font-semibold px-4 py-2 rounded-full border-[1.5px] cursor-pointer transition-all duration-150 tracking-[-0.01em] select-none flex items-center gap-1.5 ${
    active ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground hover:bg-otj-off'
  }`;

  return (
    <>
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] h-[52px] bg-card/97 backdrop-blur-[12px] border-b border-border flex items-center px-3 md:px-6 gap-2 md:gap-4">
        <div className="text-[17px] font-extrabold tracking-[-0.05em] text-foreground shrink-0">
          OTJ<sup className="text-[7px] align-super">™</sup>
        </div>
        <div className="w-px h-[18px] bg-border hidden md:block" />
        <div className="text-xs font-semibold text-otj-text hidden md:block">
          Client Setup · <strong className="text-foreground">Step {currentStep} of {TOTAL_STEPS}</strong>
        </div>
        <div className="text-[10px] font-semibold text-otj-text md:hidden">Step {currentStep}/{TOTAL_STEPS}</div>
        <div className="ml-auto flex items-center gap-1.5 md:gap-2.5">
          <button onClick={handleSkip} className="text-[10px] md:text-xs font-semibold text-otj-text px-2.5 md:px-3.5 py-1.5 rounded-full border border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">Skip</button>
          <button onClick={handleFinish} className={`text-[10px] md:text-xs font-bold px-3 md:px-4 py-1.5 rounded-full border-none cursor-pointer transition-all duration-150 flex items-center gap-1 md:gap-1.5 ${
            isReady ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-otj-light text-otj-muted cursor-not-allowed'
          }`}>
            {isReady ? '✓ Finish Setup' : '🔒 Not Ready'}
          </button>
        </div>
      </nav>

      <div className="min-h-screen pt-[52px]">
        {/* Sidebar */}
        <aside className="hidden md:flex bg-card border-r border-border p-[28px_20px_24px] fixed top-[52px] left-0 bottom-0 w-[260px] overflow-y-auto flex-col gap-0">
          <div className="text-base font-extrabold tracking-[-0.04em] text-foreground mb-1">Client Setup</div>
          <div className="text-[11.5px] text-otj-text leading-relaxed mb-5">Set up your profile to start hiring creatives.</div>

          <div className="flex flex-col items-center mb-5">
            <svg className="w-16 h-16" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--otj-light))" strokeWidth="5" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="hsl(var(--otj-black))" strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-600 ease-out" style={{ transform: 'rotate(-90deg)', transformOrigin: '32px 32px' }} />
            </svg>
            <div className="text-[11px] font-bold text-otj-text mt-1.5">{pct}% Complete</div>
          </div>

          <div className="flex flex-col gap-0.5 flex-1">
            {stepsMeta.map((step, i) => {
              const num = i + 1;
              const isDone = doneSteps.has(num);
              const isActive = currentStep === num && !isDone;
              return (
                <div key={num} onClick={() => setCurrentStep(num)} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] cursor-pointer transition-all duration-150 ${isActive ? 'bg-otj-off' : isDone ? '' : 'hover:bg-otj-off'}`}>
                  <div className={`w-7 h-7 rounded-[7px] border-[1.5px] flex items-center justify-center text-[13px] shrink-0 transition-all duration-200 ${isDone ? 'border-otj-green bg-otj-green-bg text-[11px]' : isActive ? 'border-foreground bg-otj-off' : 'border-border bg-card'}`}>
                    {isDone ? '✓' : step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[12.5px] font-bold tracking-[-0.02em] ${isDone ? 'text-otj-green' : isActive ? 'text-foreground' : 'text-otj-text'}`}>{step.name}</div>
                    <div className="text-[10.5px] text-otj-muted mt-px">{step.sub}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-[7px] py-[2px] rounded-full shrink-0 ${isDone ? 'bg-otj-green-bg text-otj-green border border-otj-green-border' : step.required ? 'bg-otj-off text-otj-text border border-border' : 'text-otj-muted'}`}>
                    {isDone ? '✓' : step.required ? 'Req' : 'Optional'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-border my-4" />

          <div className={`p-[14px_16px] rounded-xl border text-center ${isReady ? 'bg-primary border-primary' : 'bg-otj-off border-border'}`}>
            <div className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-2 ${isReady ? 'text-primary-foreground/40' : 'text-otj-muted'}`}>Profile Status</div>
            <button onClick={handleFinish} className={`w-full py-2.5 rounded-full border-none font-bold text-[13px] cursor-pointer transition-all duration-150 flex items-center justify-center gap-1.5 ${isReady ? 'bg-card text-foreground hover:bg-otj-off' : 'bg-border text-otj-muted cursor-not-allowed'}`}>
              {isReady ? '✓ Finish Setup' : '🔒 Not Ready Yet'}
            </button>
            <div className={`text-[10.5px] mt-[7px] leading-relaxed ${isReady ? 'text-primary-foreground/40' : 'text-otj-text'}`}>
              {isReady ? 'All required steps complete!' : `Complete steps ${[1, 2].filter(s => !doneSteps.has(s)).join(', ')} to finish`}
            </div>
          </div>
        </aside>

        {/* Mobile step indicator */}
        <div className="md:hidden px-4 py-3 flex gap-1.5 overflow-x-auto hide-scrollbar">
          {stepsMeta.map((_, i) => {
            const num = i + 1;
            return (
              <button key={num} onClick={() => setCurrentStep(num)} className={`shrink-0 w-8 h-8 rounded-full text-[11px] font-bold border-[1.5px] transition-all duration-150 ${
                doneSteps.has(num) ? 'border-otj-green bg-otj-green-bg text-otj-green' : currentStep === num ? 'border-foreground bg-otj-off text-foreground' : 'border-border bg-card text-otj-muted'
              }`}>{doneSteps.has(num) ? '✓' : num}</button>
            );
          })}
        </div>

        <main className="md:ml-[260px] px-4 md:px-12 py-6 md:py-10 max-w-[900px]">
          {/* STEP 1: About You */}
          {currentStep === 1 && (
            <div className="animate-fade-up">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">Step 1 of {TOTAL_STEPS}</div>
              <div className="text-[clamp(40px,5vw,60px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">ABOUT<br/>YOU.</div>
              <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">Tell us who you are so we can personalize your experience and match you with the right creatives.</div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">🏢 I'm hiring as…</div>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key: 'individual' as const, icon: '👤', label: 'Individual', sub: 'Personal projects' },
                    { key: 'company' as const, icon: '🏢', label: 'Company', sub: 'Business projects' },
                  ]).map(t => (
                    <div key={t.key} onClick={() => setCompanyType(t.key)} className={`p-4 rounded-xl border-[1.5px] cursor-pointer transition-all duration-150 text-center flex flex-col items-center justify-center gap-1 ${
                      companyType === t.key ? 'border-foreground bg-otj-off' : 'border-border hover:border-otj-muted hover:bg-otj-off'
                    }`}>
                      <div className="text-2xl mb-1">{t.icon}</div>
                      <div className="text-[12px] font-bold text-foreground">{t.label}</div>
                      <div className="text-[10px] text-otj-muted">{t.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">👤 Basic Info</div>
                <div className="flex flex-col gap-3.5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Full Name <span className="text-destructive">*</span></div>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className={inputClass} />
                  </div>
                  {companyType === 'company' && (
                    <div className="animate-fade-up">
                      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Company Name</div>
                      <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Edita Group" className={inputClass} />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">🏷️ Industry</div>
                <div className="flex flex-wrap gap-2">
                  {industries.map(ind => (
                    <div key={ind} onClick={() => setIndustry(ind)} className={chipClass(industry === ind)}>{ind}</div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
                <div />
                <button onClick={() => {
                  if (!fullName.trim() || !companyType || !industry) { showToast('Fill in all required fields'); return; }
                  nextStep(1);
                }} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-2 hover:bg-primary/90 group">
                  Save & Continue <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Contact Info */}
          {currentStep === 2 && (
            <div className="animate-fade-up">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">Step 2 of {TOTAL_STEPS}</div>
              <div className="text-[clamp(40px,5vw,60px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">CONTACT<br/>INFO.</div>
              <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">How can creatives reach you? This info stays private until you share it.</div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">📧 Email & Phone</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Email <span className="text-destructive">*</span></div>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@email.com" className={inputClass} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Phone Number <span className="text-destructive">*</span></div>
                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+20 1xx xxx xxxx" className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">🌐 Website</div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Website / Portfolio URL</div>
                  <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourcompany.com" className={inputClass} />
                </div>
              </div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">📍 Location</div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">City <span className="text-destructive">*</span></div>
                    <select value={location} onChange={e => setLocation(e.target.value)} className={`${inputClass} appearance-none cursor-pointer pr-9`}>
                      {cities.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Country</div>
                    <input value="Egypt" disabled className={`${inputClass} opacity-60`} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
                <button onClick={() => prevStep(2)} className="text-[13px] font-bold px-5 py-[11px] rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">← Back</button>
                <button onClick={() => {
                  if (!email.trim() || !phone.trim()) { showToast('Email and phone are required'); return; }
                  nextStep(2);
                }} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-2 hover:bg-primary/90 group">
                  Save & Continue <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: What I Need */}
          {currentStep === 3 && (
            <div className="animate-fade-up">
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">Step 3 of {TOTAL_STEPS}</div>
              <div className="text-[clamp(40px,5vw,60px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">WHAT I<br/>NEED.</div>
              <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">Tell us what kind of creatives you're looking for — we'll recommend the best matches.</div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">🎯 Professions I Need <span className="text-[11px] font-medium text-otj-text">— pick all that apply</span></div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <div key={cat} onClick={() => toggleCategory(cat)} className={chipClass(selectedCategories.includes(cat))}>{cat}</div>
                  ))}
                </div>
              </div>

              {availableNiches.length > 0 && (
                <div className="mb-7 animate-fade-up">
                  <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">🏷️ Specific Niches <span className="text-[11px] font-medium text-otj-text">— narrow it down</span></div>
                  <div className="flex flex-wrap gap-2">
                    {availableNiches.map(n => (
                      <div key={n.label} onClick={() => toggleNiche(n.label)} className={chipClass(selectedNiches.includes(n.label))}>
                        {n.label}
                        {selectedNiches.includes(n.label) && <span className="w-[5px] h-[5px] rounded-full bg-primary-foreground/50" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableSkills.length > 0 && (
                <div className="mb-7 animate-fade-up">
                  <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">⚡ Skills I Value <span className="text-[11px] font-medium text-otj-text">— what matters most</span></div>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map(s => (
                      <div key={s} onClick={() => toggleSkill(s)} className={chipClass(selectedSkills.includes(s))}>
                        {s}
                        {selectedSkills.includes(s) && <span className="w-[5px] h-[5px] rounded-full bg-primary-foreground/50" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {(selectedCategories.length > 0 || selectedNiches.length > 0) && (
                <div className="bg-otj-green-bg border border-otj-green-border rounded-[14px] p-4 mb-7 animate-fade-up">
                  <div className="text-[11px] font-bold text-otj-green mb-1">✓ Your preferences</div>
                  <div className="text-[12px] text-otj-text">
                    {selectedNiches.length > 0 ? selectedNiches.join(', ') : selectedCategories.join(', ')}
                    {selectedSkills.length > 0 && <span className="text-otj-muted"> · {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''}</span>}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
                <button onClick={() => prevStep(3)} className="text-[13px] font-bold px-5 py-[11px] rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">← Back</button>
                <button onClick={handleFinish} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-otj-green text-primary-foreground cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-2 hover:opacity-90 group">
                  ✓ Finish Setup <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Toast />
    </>
  );
};

export default ClientOnboarding;
