import React, { useState } from 'react';
import { showToast } from './Toast';
import {
  Camera, Film, Palette, Sparkles, Briefcase, Building2, Monitor,
  Bot, Smartphone, Mic, FileText, PenLine, Target, Share2, Scissors,
  Clapperboard, Calendar, Plus, Search, X, Tag, MapPin, Crosshair,
} from 'lucide-react';

// Reusable links section for adding multiple hyperlinks
const LinksSection: React.FC = () => {
  const [links, setLinks] = useState([{ label: '', url: '' }]);
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Website / Links</div>
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={link.label} onChange={e => { const n = [...links]; n[i].label = e.target.value; setLinks(n); }}
            className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-[140px] focus:border-foreground focus:bg-card placeholder:text-otj-muted"
            placeholder="Label"
          />
          <input
            value={link.url} onChange={e => { const n = [...links]; n[i].url = e.target.value; setLinks(n); }}
            className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 flex-1 focus:border-foreground focus:bg-card placeholder:text-otj-muted"
            placeholder="https://..."
          />
          {links.length > 1 && (
            <span onClick={() => setLinks(links.filter((_, j) => j !== i))} className="text-otj-muted cursor-pointer px-1.5 py-1 rounded-md border border-border transition-all duration-150 hover:text-destructive hover:border-destructive flex items-center justify-center">
              <X size={11} />
            </span>
          )}
        </div>
      ))}
      <button onClick={() => setLinks([...links, { label: '', url: '' }])}
        className="text-[12px] font-semibold text-otj-blue cursor-pointer bg-transparent border-none text-left hover:underline flex items-center gap-1">
        <Plus size={12} /> Add another link
      </button>
    </div>
  );
};
const professions: { icon: React.ElementType; name: string; sub: string }[] = [
  { icon: Camera, name: 'Photography', sub: 'Wedding, Portrait, Editorial, Events' },
  { icon: Film, name: 'Videography', sub: 'Film, Commercial, Documentary' },
  { icon: Palette, name: 'Design & Branding', sub: 'Branding, Brand Identity, Packaging, Digital' },
  { icon: Bot, name: 'AI Creator', sub: 'Video, Images, Prompt, Avatars' },
  { icon: Sparkles, name: 'Talents', sub: 'Models, UGC, Voice Over, Musician' },
  { icon: Monitor, name: 'Tech Development', sub: 'Web, App, Frontend, Backend' },
  { icon: Briefcase, name: 'Business & Marketing', sub: 'Strategy, Growth, SEO, PR' },
  { icon: Scissors, name: 'MUA & Styling', sub: 'Bridal, Editorial, Personal Styling' },
  { icon: PenLine, name: 'Creative Writing', sub: 'Scriptwriting, Copy, Content' },
  { icon: Clapperboard, name: 'Creation Production', sub: 'Art Direction, Campaigns, Brand' },
  { icon: Calendar, name: 'Event Producers', sub: 'Wedding, Corporate, Festivals, Live' },
  { icon: Building2, name: 'Space Design', sub: 'Interior, Architecture, Exhibition, Set' },
  { icon: Mic, name: 'Voice & Audio', sub: 'Podcasting, Voice Over, Music' },
  { icon: Smartphone, name: 'Content Creator', sub: 'YouTube, TikTok, Reels, Streaming' },
  { icon: Share2, name: 'Social Media', sub: 'Instagram, LinkedIn, Community' },
  { icon: Target, name: 'Brand Strategist', sub: 'Identity, Positioning, Insights' },
];

const nicheMap: Record<string, string[]> = {
  'Photography': ['Wedding', 'Fashion', 'E-Commerce', 'Product', 'Food & Beverage', 'Corporate & Event', 'Portraits'],
  'Videography': ['Music Videos', 'Commercials', 'Documentary', 'Weddings', 'Corporate', 'Events', 'Social Media'],
  'Design & Branding': ['Branding', 'Print Design', 'Digital Design', 'Packaging', 'Illustration', 'Typography'],
  'AI Creator': ['Prompt Engineering', 'AI Video', 'AI Image Generation', 'Custom Models', 'AI Avatars'],
  'Talents': ['Models', 'UGC Creator', 'Singer', 'Musician', 'Voice Over', 'Dancer'],
  'Tech Development': ['Frontend', 'Backend', 'Full Stack', 'Mobile Apps', 'Web3/Crypto', 'DevOps'],
  'Business & Marketing': ['Digital Marketing', 'SEO', 'Content Strategy', 'Growth Hacking', 'Email Marketing', 'Market Research', 'PR'],
  'MUA & Styling': ['Bridal', 'Editorial', 'Special FX', 'Personal Styling', 'Wardrobe'],
  'Creative Writing': ['Film/TV', 'Commercials', 'Video Games', 'YouTube', 'Podcasts'],
  'Creation Production': ['Art Direction', 'Campaigns', 'Brand Vision', 'Team Leadership'],
  'Event Producers': ['Corporate Events', 'Festivals', 'Exhibitions', 'Weddings', 'Live Shows'],
  'Space Design': ['Interior Design', 'Architecture', 'Visual Merchandising', 'Exhibition Design', 'Set Design'],
};

interface StepPanelProps {
  onNext: () => void;
  onBack?: () => void;
}

interface Step1PanelProps extends StepPanelProps {
  onSelectionsChange?: (profession: string, niches: string[]) => void;
}

interface Step2PanelProps extends StepPanelProps {
  selectedProfession?: string;
  selectedNiches?: string[];
}

// STEP 1
export const Step1Panel: React.FC<Step1PanelProps> = ({ onNext, onSelectionsChange }) => {
  const [selectedProf, setSelectedProf] = useState('Photography');
  const [selectedNiches, setSelectedNiches] = useState(new Set<string>());
  const [selectedSkills, setSelectedSkills] = useState(new Set<string>());
  const [search, setSearch] = useState('');

  const availableNiches = nicheMap[selectedProf] || [];
  
  const q = search.toLowerCase();
  const filteredProfessions = q ? professions.filter(p => p.name.toLowerCase().includes(q)) : professions;
  const filteredNiches = q ? availableNiches.filter(n => n.toLowerCase().includes(q)) : availableNiches;

  const handleProfChange = (name: string) => {
    setSelectedProf(name);
    setSelectedNiches(new Set()); // Reset niches when profession changes
    showToast('Profession set: ' + name);
    onSelectionsChange?.(name, []);
  };

  const handleNicheToggle = (n: string) => {
    const next = new Set(selectedNiches);
    if (next.has(n)) {
      next.delete(n);
    } else {
      if (next.size >= 3) { showToast('Max 3 niches allowed'); return; }
      next.add(n);
    }
    setSelectedNiches(next);
    onSelectionsChange?.(selectedProf, Array.from(next));
  };

  return (
    <div className="animate-fade-up">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-muted mb-2.5">Build Your Profile · <span className="text-foreground">Step 1 of 5</span></div>
      <div className="text-[clamp(36px,5vw,56px)] font-extrabold tracking-[-0.04em] leading-[0.95] text-foreground mb-2.5">What do you ✦ create?</div>
      <div className="text-sm text-otj-text leading-relaxed max-w-[660px] mb-8">Pick your primary profession and the niches you specialise in. This shapes how clients find you — you can edit later.</div>

      {/* Search bar */}
      <div className="relative mb-7">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-otj-muted pointer-events-none flex items-center"><Search size={14} /></span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search profession or niche…"
          className="w-full pl-9 pr-9 py-2.5 rounded-[12px] border-[1.5px] border-border bg-card text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground placeholder:text-otj-muted"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-otj-muted hover:text-foreground transition-colors duration-150 flex items-center justify-center w-5 h-5"><X size={12} /></button>
        )}
      </div>

      <div className="mb-8">
        <div className="text-[14px] font-bold tracking-[-0.02em] text-foreground mb-1 flex items-center gap-2">Your Profession</div>
        <div className="h-px bg-border mb-4" />
        {filteredProfessions.length > 0 ? (
          <div className="grid grid-rows-3 grid-flow-col auto-cols-[minmax(240px,1fr)] gap-2.5 overflow-x-auto hide-scrollbar snap-x pb-2">
            {filteredProfessions.map(p => (
              <div
                key={p.name}
                onClick={() => handleProfChange(p.name)}
                className={`snap-start px-5 py-4 rounded-2xl border-[1.5px] bg-card cursor-pointer transition-all duration-150 flex items-center gap-4 active:scale-[0.98] ${
                  selectedProf === p.name ? 'border-foreground bg-primary text-primary-foreground' : 'border-border hover:border-otj-muted hover:bg-otj-off'
                }`}
              >
                <p.icon size={26} strokeWidth={1.5} className="shrink-0" />
                <div className="min-w-0">
                  <div className="text-[13.5px] font-bold tracking-[-0.02em] leading-tight">{p.name}</div>
                  <div className={`text-[11px] leading-snug mt-0.5 ${
                    selectedProf === p.name ? 'text-primary-foreground/60' : 'text-otj-muted'
                  }`}>{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[12.5px] text-otj-muted py-4">No professions match "{search}"</div>
        )}
      </div>

      <div className="mb-8">
        <div className="text-[14px] font-bold tracking-[-0.02em] text-foreground mb-0.5 flex items-center gap-1.5">Your Niche <span className="text-[11px] font-medium text-otj-muted">· Pick 3 Max</span></div>
        <div className="h-px bg-border mb-4" />
        {filteredNiches.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filteredNiches.map(n => (
              <div
                key={n}
                onClick={() => handleNicheToggle(n)}
                className={`text-[12.5px] font-semibold px-4 py-2 rounded-full border-[1.5px] cursor-pointer transition-all duration-150 tracking-[-0.01em] select-none flex items-center gap-1.5 active:scale-95 ${
                  selectedNiches.has(n)
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground hover:bg-otj-off'
                }`}
              >
                {n}
                {selectedNiches.has(n) && <span className="w-[5px] h-[5px] rounded-full bg-primary-foreground/50" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[12.5px] text-otj-muted py-4">No niches match "{search}"</div>
        )}
      </div>

      <div className="mb-8">
        <div className="text-[14px] font-bold tracking-[-0.02em] text-foreground mb-0.5 flex items-center gap-1.5">Select Your Skills <span className="text-[11px] font-medium text-otj-muted">· Pick 6 Max</span></div>
        <div className="h-px bg-border mb-4" />
        {availableSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableSkills.map(s => (
              <div
                key={s}
                onClick={() => {
                  const next = new Set(selectedSkills);
                  if (next.has(s)) { next.delete(s); }
                  else { if (next.size >= 6) { showToast('Max 6 skills allowed'); return; } next.add(s); }
                  setSelectedSkills(next);
                }}
                className={`text-[12.5px] font-semibold px-4 py-2 rounded-full border-[1.5px] cursor-pointer transition-all duration-150 tracking-[-0.01em] select-none flex items-center gap-1.5 active:scale-95 ${
                  selectedSkills.has(s)
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground hover:bg-otj-off'
                }`}
              >
                {s}
                {selectedSkills.has(s) && <span className="w-[5px] h-[5px] rounded-full bg-primary-foreground/50" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[12.5px] text-otj-muted py-4">Select a profession first</div>
        )}
      </div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2"><MapPin size={14} className="text-otj-muted shrink-0" /> Location & Experience</div>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">City <span className="text-destructive">*</span></div>
            <select className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card appearance-none cursor-pointer pr-9">
              <option>Cairo</option><option>Alexandria</option><option>Giza</option><option>Hurghada</option><option>Sharm El Sheikh</option><option>Other</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Years of Experience <span className="text-destructive">*</span></div>
            <select defaultValue="5–8 years" className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card appearance-none cursor-pointer pr-9">
              <option>Less than 1 year</option><option>1–2 years</option><option>3–5 years</option><option>5–8 years</option><option>8+ years</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <div />
        <button onClick={onNext} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-2 hover:bg-primary/90 active:scale-[0.98] group">
          Save & Continue <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
        </button>
      </div>
    </div>
  );
};

// STEP 2
export const Step2Panel: React.FC<Step2PanelProps> = ({ onNext, onBack, selectedProfession, selectedNiches }) => {
  const [avatarUploaded, setAvatarUploaded] = useState(false);
  const autoTagline = React.useMemo(() => {
    const prof = selectedProfession || 'Photographer';
    const nicheList = (selectedNiches && selectedNiches.length > 0) ? selectedNiches : ['Fashion Editorial', 'E-Commerce'];
    const formattedNiches = nicheList.map(n => n.toLowerCase()).join(' · ');
    return `${prof} · ${formattedNiches}`;
  }, [selectedProfession, selectedNiches]);
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');

  // Update tagline when auto-tagline changes
  React.useEffect(() => {
    setTagline(autoTagline);
  }, [autoTagline]);

  return (
    <div className="animate-fade-up">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">Step 2 of 7</div>
      <div className="text-[clamp(40px,5vw,60px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">YOUR<br/>STORY.</div>
      <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">Your profile is your first impression. Make it count — clients read this before booking.</div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">👤 Profile Photo</div>
        <div className="flex items-center gap-5 mb-2">
          <div
            onClick={() => { setAvatarUploaded(true); showToast('Photo uploaded ✓'); }}
            className="w-24 h-24 rounded-full border-2 border-dashed border-border bg-otj-off flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shrink-0 relative overflow-hidden hover:border-foreground hover:bg-otj-light active:opacity-80"
          >
            {avatarUploaded ? (
              <div className="absolute inset-0 bg-otj-light flex items-center justify-center text-5xl">👩‍🎨</div>
            ) : (
              <>
                <div className="text-2xl mb-1">📷</div>
                <div className="text-[9.5px] font-bold text-otj-muted uppercase tracking-[0.08em]">Upload</div>
              </>
            )}
          </div>
          <div>
            <div className="text-[13px] font-bold text-foreground mb-1">Profile photo</div>
            <div className="text-xs text-otj-text leading-relaxed">Square photo works best. Minimum 400×400px.<br/>Clients are 3× more likely to book profiles with photos.</div>
          </div>
        </div>
      </div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">✍️ Your Tagline & Bio</div>
        <div className="flex flex-col gap-1.5 mb-3.5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Tagline <span className="text-destructive">*</span></div>
            <div className="text-[10px] text-otj-blue font-semibold cursor-pointer" onClick={() => setTagline(autoTagline)}>↻ Reset to auto</div>
          </div>
          <input
            value={tagline} onChange={e => setTagline(e.target.value)} maxLength={80}
            className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card placeholder:text-otj-muted"
            placeholder="e.g. Fashion & E-commerce photographer based in Cairo"
          />
          <div className="text-[10.5px] text-otj-muted text-right mt-0.5">{tagline.length}/80</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Bio <span className="text-destructive">*</span></div>
          <textarea
            value={bio} onChange={e => setBio(e.target.value)} maxLength={500} rows={5}
            className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card resize-y leading-relaxed min-h-[100px] placeholder:text-otj-muted"
            placeholder="Tell clients about yourself — your experience, what makes your work unique, who you love working with…"
          />
          <div className="text-[10.5px] text-otj-muted text-right mt-0.5">{bio.length}/500</div>
        </div>
      </div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">🔗 Links</div>
        <div className="flex flex-col gap-1.5 mb-3.5">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Instagram</div>
          <input className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card placeholder:text-otj-muted" placeholder="@yourusername" />
        </div>
        <LinksSection />
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <button onClick={onBack} className="text-[13px] font-bold px-5 py-[11px] rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground active:scale-95">← Back</button>
        <button onClick={onNext} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-2 hover:bg-primary/90 active:scale-[0.98] group">
          Save & Continue <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
        </button>
      </div>
    </div>
  );
};

// STEP 3
export const Step3Panel: React.FC<StepPanelProps> = ({ onNext, onBack }) => {
  const [filledSlots, setFilledSlots] = useState(new Set([0, 1]));
  const emojis = ['🌆', '👗', '🎭', '🌸', '🔥', '⚡'];
  const [selectedStyle, setSelectedStyle] = useState(0);

  return (
    <div className="animate-fade-up">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">Step 3 of 7</div>
      <div className="text-[clamp(40px,5vw,60px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">SHOW<br/>YOUR WORK.</div>
      <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">Upload your best work. For non-visual creatives, add case studies and samples instead.</div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">
          🖼️ Portfolio Images <span className="text-[11px] font-medium text-otj-text">— up to 12 photos</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              onClick={() => {
                const next = new Set(filledSlots);
                next.add(i);
                setFilledSlots(next);
                showToast('Photo added ✓');
              }}
              className={`aspect-[4/3] rounded-xl border-[1.5px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden active:opacity-80 ${
                filledSlots.has(i)
                  ? 'border-solid border-border'
                  : 'border-dashed border-border hover:border-foreground hover:bg-otj-light'
              } bg-otj-off`}
            >
              {filledSlots.has(i) ? (
                <div className="absolute inset-0 flex items-center justify-center text-[40px] bg-otj-light">{emojis[i]}</div>
              ) : (
                <>
                  <div className="text-2xl mb-1.5">➕</div>
                  <div className="text-[10px] font-semibold text-otj-muted">Add photo</div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="text-[11.5px] text-otj-text">First image becomes your card cover on Explore. Drag to reorder.</div>
      </div>


      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <button onClick={onBack} className="text-[13px] font-bold px-5 py-[11px] rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground active:scale-95">← Back</button>
        <button onClick={onNext} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-2 hover:bg-primary/90 active:scale-[0.98] group">
          Save & Continue <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
        </button>
      </div>
    </div>
  );
};

// STEP 4
export const Step4Panel: React.FC<StepPanelProps> = ({ onNext, onBack }) => {
  const [packages, setPackages] = useState([
    { name: 'Starter Package', price: '2000', duration: 'Half day (4hrs)', deliverables: ['20 edited photos', 'Online gallery'], revisions: '2 rounds', hidePrice: false },
    { name: 'Full Day Campaign', price: '3500', duration: 'Full day (8hrs)', deliverables: ['40 edited photos', 'Color correction', 'Online gallery'], revisions: '3 rounds', hidePrice: false },
  ]);

  const updateDeliverable = (pkgIdx: number, delIdx: number, value: string) => {
    const next = [...packages];
    next[pkgIdx].deliverables[delIdx] = value;
    setPackages(next);
  };

  const addDeliverable = (pkgIdx: number) => {
    const next = [...packages];
    next[pkgIdx].deliverables.push('');
    setPackages(next);
  };

  const removeDeliverable = (pkgIdx: number, delIdx: number) => {
    const next = [...packages];
    next[pkgIdx].deliverables = next[pkgIdx].deliverables.filter((_, j) => j !== delIdx);
    setPackages(next);
  };

  return (
    <div className="animate-fade-up">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">Step 4 of 7</div>
      <div className="text-[clamp(40px,5vw,60px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">SET YOUR<br/>PACKAGES.</div>
      <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">Define what you offer and at what price. You can always edit these later. Clients book specific packages.</div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">📦 Your Packages</div>
        <div className="flex flex-col gap-3">
          {packages.map((pkg, i) => (
            <div key={i} className="bg-card border-[1.5px] border-border rounded-[14px] p-[18px]">
              <div className="flex items-center justify-between mb-3.5">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">
                  Package {i + 1}{i === 1 ? ' — Standard · Most Booked' : i === 0 ? ' — Starter' : ''}
                </div>
                <span onClick={() => { setPackages(packages.filter((_, j) => j !== i)); showToast('Package removed'); }} className="text-[11px] text-otj-muted cursor-pointer px-2 py-0.5 rounded-md border border-border transition-all duration-150 hover:text-destructive hover:border-destructive">Remove</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Package Name <span className="text-destructive">*</span></div>
                  <input defaultValue={pkg.name} className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Price (EGP) <span className="text-destructive">*</span></div>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={pkg.hidePrice} onChange={() => { const next = [...packages]; next[i].hidePrice = !next[i].hidePrice; setPackages(next); }} className="w-3.5 h-3.5 rounded border-border accent-primary cursor-pointer" />
                      <span className="text-[10px] text-otj-muted font-semibold">Hide price</span>
                    </label>
                  </div>
                  <input defaultValue={pkg.price} type="number" disabled={pkg.hidePrice} className={`px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card ${pkg.hidePrice ? 'opacity-40' : ''}`} />
                  {pkg.hidePrice && <div className="text-[10.5px] text-otj-muted">Clients will see "Contact for pricing"</div>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Duration</div>
                  <select defaultValue={pkg.duration} className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card appearance-none cursor-pointer">
                    <option>Half day (4hrs)</option><option>Full day (8hrs)</option><option>2 hours</option><option>Custom</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Revisions</div>
                  <select defaultValue={pkg.revisions} className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card appearance-none cursor-pointer">
                    <option>1 round</option><option>2 rounds</option><option>3 rounds</option><option>Unlimited</option>
                  </select>
                </div>
              </div>
              {/* Deliverables list */}
              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Deliverables</div>
                <div className="flex flex-col gap-1.5">
                  {pkg.deliverables.map((d, di) => (
                    <div key={di} className="flex items-center gap-2">
                      <span className="text-otj-muted text-xs">•</span>
                      <input
                        value={d} onChange={e => updateDeliverable(i, di, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-border bg-otj-off text-[13px] text-foreground outline-none transition-all duration-150 flex-1 focus:border-foreground focus:bg-card placeholder:text-otj-muted"
                        placeholder="e.g. 20 edited photos"
                      />
                      <span onClick={() => removeDeliverable(i, di)} className="text-[11px] text-otj-muted cursor-pointer hover:text-destructive">✕</span>
                    </div>
                  ))}
                  <button onClick={() => addDeliverable(i)}
                    className="text-[11.5px] font-semibold text-otj-blue cursor-pointer bg-transparent border-none text-left hover:underline mt-0.5">
                    ＋ Add deliverable
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => { setPackages([...packages, { name: '', price: '', duration: 'Half day (4hrs)', deliverables: [''], revisions: '1 round', hidePrice: false }]); showToast('Package added ✓'); }}
          className="w-full p-3 rounded-[10px] border-[1.5px] border-dashed border-border bg-transparent text-[13px] font-semibold text-otj-text cursor-pointer transition-all duration-150 flex items-center justify-center gap-2 mt-2.5 hover:border-foreground hover:text-foreground hover:bg-otj-off">
          ＋ Add Another Package
        </button>
      </div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">💰 Payment Preferences</div>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Deposit Required</div>
            <select className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card appearance-none cursor-pointer">
              <option>50% deposit (recommended)</option><option>30% deposit</option><option>100% upfront</option>
            </select>
            <div className="text-[11px] text-otj-muted leading-relaxed">OTJ holds deposits in escrow until delivery</div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Lead Time</div>
            <select defaultValue="48 hours" className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card appearance-none cursor-pointer">
              <option>Same day (urgent)</option><option>24 hours</option><option>48 hours</option><option>1 week</option>
            </select>
            <div className="text-[11px] text-otj-muted leading-relaxed">Minimum notice before a booking starts</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <button onClick={onBack} className="text-[13px] font-bold px-5 py-[11px] rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground active:scale-95">← Back</button>
        <button onClick={onNext} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-2 hover:bg-primary/90 active:scale-[0.98] group">
          Save & Continue <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
        </button>
      </div>
    </div>
  );
};

// STEP 5
export const Step5Panel: React.FC<StepPanelProps> = ({ onNext, onBack }) => {
  const [questions, setQuestions] = useState([
    'What is the shoot purpose or campaign goal?',
    'What mood or aesthetic are you going for?',
    'What is the subject or product being shot?',
    'How many final deliverables do you need?',
    'Where will the content be used? (Social, print, ads…)',
  ]);

  return (
    <div className="animate-fade-up">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">Step 5 of 7</div>
      <div className="text-[clamp(40px,5vw,60px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">WHAT DO<br/>YOU NEED?</div>
      <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">These questions are sent to clients when they book you. Drag to reorder. Add or remove as needed.</div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">
          📋 Brief Questions <span className="text-[11px] font-medium text-otj-text">— clients answer these before booking</span>
        </div>
        <div className="flex flex-col gap-2">
          {questions.map((q, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-card border-[1.5px] border-border rounded-[10px] transition-all duration-150 hover:border-otj-muted hover:shadow-sm">
              <span className="text-otj-muted text-sm cursor-grab">⠿</span>
              <div className="w-[22px] h-[22px] rounded-md bg-otj-off border border-border flex items-center justify-center text-[10px] font-bold text-otj-muted shrink-0">{i + 1}</div>
              <input
                value={q}
                onChange={e => { const next = [...questions]; next[i] = e.target.value; setQuestions(next); }}
                className="flex-1 text-[13px] text-foreground font-medium bg-transparent border-none outline-none placeholder:text-otj-muted"
                placeholder="Type your question…"
              />
              <span onClick={() => { setQuestions(questions.filter((_, j) => j !== i)); showToast('Question removed'); }}
                className="text-[11px] text-otj-muted cursor-pointer px-2 py-0.5 rounded-md border border-border transition-all duration-150 hover:text-destructive hover:border-destructive">Remove</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setQuestions([...questions, 'New question — click to edit']); }}
          className="w-full p-2.5 rounded-[10px] border-[1.5px] border-dashed border-border bg-transparent text-[12.5px] font-semibold text-otj-text cursor-pointer transition-all duration-150 flex items-center justify-center gap-[7px] mt-2.5 hover:border-foreground hover:text-foreground">
          ＋ Add Question
        </button>
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <button onClick={onBack} className="text-[13px] font-bold px-5 py-[11px] rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground active:scale-95">← Back</button>
        <button onClick={onNext} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-2 hover:bg-primary/90 active:scale-[0.98] group">
          Save & Continue <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
        </button>
      </div>
    </div>
  );
};

// STEP 6
export const Step6Panel: React.FC<StepPanelProps> = ({ onNext, onBack }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [activeDays, setActiveDays] = useState(new Set([0, 1, 2, 3, 5]));

  return (
    <div className="animate-fade-up">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">Step 6 of 7</div>
      <div className="text-[clamp(40px,5vw,60px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">WHEN DO<br/>YOU WORK?</div>
      <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">Set your working days and hours. Clients can only book on available days. You control your calendar.</div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">📅 Working Days</div>
        <div className="grid grid-cols-7 gap-2 mb-5">
          {days.map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted">{d}</div>
              <div
                onClick={() => { const next = new Set(activeDays); next.has(i) ? next.delete(i) : next.add(i); setActiveDays(next); }}
                className={`w-10 h-10 rounded-[10px] border-[1.5px] cursor-pointer transition-all duration-150 flex items-center justify-center text-base ${
                  activeDays.has(i)
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-border hover:border-foreground'
                }`}
              >
                {activeDays.has(i) ? <span className="text-sm font-bold">✓</span> : '🌙'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">⏰ Working Hours</div>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-card border-[1.5px] border-border rounded-[10px] mb-2">
          <div className="text-xs font-bold text-foreground w-9 shrink-0">Mon–Thu</div>
          <input type="time" defaultValue="09:00" className="px-2.5 py-1.5 rounded-lg border border-border bg-otj-off text-xs text-foreground outline-none" />
          <span className="text-[11px] text-otj-muted">to</span>
          <input type="time" defaultValue="18:00" className="px-2.5 py-1.5 rounded-lg border border-border bg-otj-off text-xs text-foreground outline-none" />
        </div>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-card border-[1.5px] border-border rounded-[10px]">
          <div className="text-xs font-bold text-foreground w-9 shrink-0">Sat</div>
          <input type="time" defaultValue="10:00" className="px-2.5 py-1.5 rounded-lg border border-border bg-otj-off text-xs text-foreground outline-none" />
          <span className="text-[11px] text-otj-muted">to</span>
          <input type="time" defaultValue="16:00" className="px-2.5 py-1.5 rounded-lg border border-border bg-otj-off text-xs text-foreground outline-none" />
        </div>
      </div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">📊 Capacity Settings</div>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Max Bookings per Month</div>
            <select defaultValue="8 bookings" className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card appearance-none cursor-pointer">
              <option>4 bookings</option><option>8 bookings</option><option>12 bookings</option><option>Unlimited</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Travel Radius</div>
            <select defaultValue="Greater Cairo + Giza" className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card appearance-none cursor-pointer">
              <option>Cairo only</option><option>Greater Cairo + Giza</option><option>Anywhere in Egypt</option><option>International</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <button onClick={onBack} className="text-[13px] font-bold px-5 py-[11px] rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground active:scale-95">← Back</button>
        <button onClick={onNext} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-2 hover:bg-primary/90 active:scale-[0.98] group">
          Save & Continue <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
        </button>
      </div>
    </div>
  );
};

// STEP 7
export const Step7Panel: React.FC<StepPanelProps & { onFinish: () => void }> = ({ onBack, onFinish }) => {
  const [toggles, setToggles] = useState({
    whatsapp: true, email: true, messages: true,
    pricing: true, calendar: true, dms: false, featured: false,
  });

  const toggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-[42px] h-6 rounded-full border-none cursor-pointer relative transition-colors duration-200 shrink-0 ${on ? 'bg-primary' : 'bg-otj-light'}`}
    >
      <span className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-card shadow-sm transition-transform duration-200 ${on ? 'translate-x-[18px]' : ''}`} />
    </button>
  );

  return (
    <div className="animate-fade-up">
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">Step 7 of 7</div>
      <div className="text-[clamp(40px,5vw,60px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">ALMOST<br/>THERE.</div>
      <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">Set your notification preferences and privacy settings. You can always change these later.</div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">🔔 Notifications</div>
        <div className="flex flex-col">
          {[
            { key: 'whatsapp' as const, name: 'WhatsApp Notifications', desc: 'Booking requests, phase approvals, payment releases via WhatsApp' },
            { key: 'email' as const, name: 'Email Notifications', desc: 'Weekly summary and important account updates via email' },
            { key: 'messages' as const, name: 'New Message Alerts', desc: 'Instant notification when a client sends you a message' },
          ].map((item, i) => (
            <div key={item.key} className={`flex items-center px-4 py-3.5 border-b border-border bg-card ${i === 0 ? 'rounded-t-xl' : ''} ${i === 2 ? 'rounded-b-xl border-b-0' : ''}`}>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-foreground tracking-[-0.02em]">{item.name}</div>
                <div className="text-[11.5px] text-otj-text mt-0.5">{item.desc}</div>
              </div>
              <ToggleSwitch on={toggles[item.key]} onClick={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">🔒 Privacy & Visibility</div>
        <div className="flex flex-col">
          {[
            { key: 'pricing' as const, name: 'Show Pricing on Profile', desc: 'Clients can see your package prices before booking' },
            { key: 'calendar' as const, name: 'Show Availability Calendar', desc: 'Display your available and booked dates publicly' },
            { key: 'dms' as const, name: 'Allow Direct Messages', desc: 'Clients can message you before booking (requires brief first)' },
            { key: 'featured' as const, name: 'Featured on Explore', desc: 'Appear in recommended and featured sections (OTJ Pro)' },
          ].map((item, i) => (
            <div key={item.key} className={`flex items-center px-4 py-3.5 border-b border-border bg-card ${i === 0 ? 'rounded-t-xl' : ''} ${i === 3 ? 'rounded-b-xl border-b-0' : ''}`}>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-foreground tracking-[-0.02em]">{item.name}</div>
                <div className="text-[11.5px] text-otj-text mt-0.5">{item.desc}</div>
              </div>
              <ToggleSwitch on={toggles[item.key]} onClick={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">💳 Payout Details</div>
        <div className="grid grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Preferred Payout Method</div>
            <select className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card appearance-none cursor-pointer">
              <option>Vodafone Cash</option><option>InstaPay</option><option>Bank Transfer</option><option>Fawry</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Phone / Account Number</div>
            <input className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card placeholder:text-otj-muted" placeholder="01X XXXX XXXX" />
          </div>
        </div>
        <div className="text-[11.5px] text-otj-text px-3.5 py-2.5 bg-otj-blue-bg border border-otj-blue-border rounded-lg mt-2 leading-relaxed">
          🔒 OTJ holds payments in escrow and releases to your account only after delivery is confirmed. Platform fee is 5%.
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
        <button onClick={onBack} className="text-[13px] font-bold px-5 py-[11px] rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground active:scale-95">← Back</button>
        <button onClick={onFinish} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-otj-green text-primary-foreground cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center gap-2 hover:opacity-90 active:scale-[0.98]">
          Finish Setup ✓
        </button>
      </div>
    </div>
  );
};
