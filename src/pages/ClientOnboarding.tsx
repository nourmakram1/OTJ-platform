import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';
import { categoryNiches } from '../data/niches';

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

const categories = Object.keys(categoryNiches);

const ClientOnboarding = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companyType, setCompanyType] = useState<'individual' | 'company' | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Derive available niches from selected categories
  const availableNiches = useMemo(() => {
    if (selectedCategories.length === 0) return [];
    return selectedCategories.flatMap(cat => categoryNiches[cat] || []);
  }, [selectedCategories]);

  // Derive available skills from selected niches
  const availableSkills = useMemo(() => {
    const skillSet = new Set<string>();
    availableNiches
      .filter(n => selectedNiches.includes(n.label))
      .forEach(n => n.skills.forEach(s => skillSet.add(s)));
    return Array.from(skillSet);
  }, [availableNiches, selectedNiches]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat];
      // Remove niches/skills that no longer belong
      const validNicheLabels = next.flatMap(c => (categoryNiches[c] || []).map(n => n.label));
      setSelectedNiches(sn => sn.filter(n => validNicheLabels.includes(n)));
      return next;
    });
  };

  const toggleNiche = (niche: string) => {
    setSelectedNiches(prev => {
      const next = prev.includes(niche) ? prev.filter(n => n !== niche) : [...prev, niche];
      // Remove skills that no longer belong
      const validSkills = new Set<string>();
      availableNiches.filter(n => next.includes(n.label)).forEach(n => n.skills.forEach(s => validSkills.add(s)));
      setSelectedSkills(ss => ss.filter(s => validSkills.has(s)));
      return next;
    });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const canContinue = fullName.trim() && industry && companyType;
  const progressSteps = [
    true, // step 1 always started
    !!companyType,
    !!industry,
    selectedCategories.length > 0,
  ];

  const handleContinue = () => {
    if (!canContinue) {
      showToast('Please fill in all required fields');
      return;
    }
    showToast('✓ Profile set up! Welcome to OTJ');
    setTimeout(() => navigate('/dashboard'), 600);
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted";

  const chipClass = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-all duration-150 border-[1.5px] ${
      active
        ? 'bg-primary border-primary text-primary-foreground'
        : 'bg-card border-border text-otj-text hover:border-foreground hover:text-foreground'
    }`;

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-[520px]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-[28px] font-extrabold tracking-[-0.05em] text-foreground mb-2">
              Welcome to OTJ 👋
            </div>
            <div className="text-sm text-otj-text">Tell us a bit about yourself so we can personalize your experience</div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {progressSteps.map((done, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${done ? 'bg-otj-green' : 'bg-border'}`} />
            ))}
          </div>

          <div className="bg-card border border-border rounded-[18px] p-6 animate-fade-up">
            <div className="flex flex-col gap-5">
              {/* Type selection */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">I'm hiring as… <span className="text-destructive">*</span></div>
                <div className="flex gap-2">
                  {([
                    { key: 'individual' as const, icon: '👤', label: 'Individual', sub: 'Personal projects' },
                    { key: 'company' as const, icon: '🏢', label: 'Company', sub: 'Business projects' },
                  ]).map(t => (
                    <button
                      key={t.key}
                      onClick={() => setCompanyType(t.key)}
                      className={`flex-1 py-3.5 rounded-[12px] border-[1.5px] text-[13px] font-bold cursor-pointer transition-all duration-150 flex flex-col items-center gap-1 ${
                        companyType === t.key
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-card border-border text-otj-text hover:border-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span>{t.label}</span>
                      <span className={`text-[10px] font-medium ${companyType === t.key ? 'text-primary-foreground/70' : 'text-otj-muted'}`}>{t.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">
                  Full Name <span className="text-destructive">*</span>
                </div>
                <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className={inputClass} />
              </div>

              {/* Company Name */}
              {companyType === 'company' && (
                <div className="animate-fade-up">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Company Name</div>
                  <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Edita Group" className={inputClass} />
                </div>
              )}

              {/* Industry */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Industry <span className="text-destructive">*</span></div>
                <div className="flex flex-wrap gap-1.5">
                  {industries.map(ind => (
                    <button key={ind} onClick={() => setIndustry(ind)} className={chipClass(industry === ind)}>{ind}</button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] text-otj-muted font-semibold">What I'm looking for</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Profession / Category */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Professions I need</div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => toggleCategory(cat)} className={chipClass(selectedCategories.includes(cat))}>{cat}</button>
                  ))}
                </div>
              </div>

              {/* Niches (shown when categories selected) */}
              {availableNiches.length > 0 && (
                <div className="animate-fade-up">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Specific niches</div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableNiches.map(n => (
                      <button key={n.label} onClick={() => toggleNiche(n.label)} className={chipClass(selectedNiches.includes(n.label))}>{n.label}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills (shown when niches selected) */}
              {availableSkills.length > 0 && (
                <div className="animate-fade-up">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Skills I value</div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSkills.map(s => (
                      <button key={s} onClick={() => toggleSkill(s)} className={chipClass(selectedSkills.includes(s))}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {canContinue && (
                <div className="bg-otj-green-bg border border-otj-green-border rounded-[12px] p-3.5 animate-fade-up">
                  <div className="text-[11px] font-bold text-otj-green mb-1">✓ Looking good!</div>
                  <div className="text-[12px] text-otj-text">
                    {fullName}{companyName ? ` · ${companyName}` : ''} · {industry}
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="text-[11px] text-otj-muted mt-1">
                      Looking for: {selectedNiches.length > 0 ? selectedNiches.join(', ') : selectedCategories.join(', ')}
                      {selectedSkills.length > 0 && ` · ${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''} selected`}
                    </div>
                  )}
                </div>
              )}

              {/* Action */}
              <button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`w-full py-3 rounded-full border-none text-sm font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center justify-center gap-2 group mt-1 ${
                  canContinue ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-otj-off text-otj-muted cursor-not-allowed'
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
