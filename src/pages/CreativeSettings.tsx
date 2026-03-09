import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Toast, showToast } from '../components/Toast';

const professions = [
  { icon: '📸', name: 'Photographer' },
  { icon: '🎥', name: 'Videographer' },
  { icon: '🎨', name: 'Graphic Designer' },
  { icon: '✨', name: 'Motion Designer' },
  { icon: '💼', name: 'Business & Marketing' },
  { icon: '🏗️', name: 'Space Design' },
  { icon: '💻', name: 'Tech Development' },
  { icon: '🤖', name: 'AI Creator' },
  { icon: '📱', name: 'Content Creator' },
  { icon: '🎤', name: 'Talent' },
  { icon: '✏️', name: 'Script Writer' },
  { icon: '📝', name: 'Copywriter' },
  { icon: '🎯', name: 'Brand Strategist' },
  { icon: '📱', name: 'Social Media' },
  { icon: '💄', name: 'MUA & Stylist' },
  { icon: '🎬', name: 'Creative Director' },
  { icon: '🎪', name: 'Event Producer' },
  { icon: '➕', name: 'Other' },
];

const nicheMap: Record<string, string[]> = {
  'Photographer': ['Fashion Editorial', 'E-Commerce', 'Product Photography', 'Architecture', 'Lifestyle', 'Sports & Action', 'Food & Beverage', 'Corporate & Events', 'Weddings', 'Portraits', 'Street & Documentary', 'Beauty & Cosmetics'],
  'Videographer': ['Music Videos', 'Commercials', 'Documentary', 'Weddings', 'Corporate', 'Events', 'Social Media'],
  'Graphic Designer': ['Branding', 'Print Design', 'Digital Design', 'Packaging', 'Illustration', 'Typography'],
  'Motion Designer': ['2D Animation', '3D Animation', 'VFX', 'UI/UX Animation', 'Explainer Videos'],
  'Business & Marketing': ['Digital Marketing', 'SEO', 'Content Strategy', 'Growth Hacking', 'Email Marketing', 'Market Research', 'PR'],
  'Space Design': ['Interior Design', 'Architecture', 'Visual Merchandising', 'Exhibition Design', 'Set Design'],
  'Tech Development': ['Frontend', 'Backend', 'Full Stack', 'Mobile Apps', 'Web3/Crypto', 'DevOps'],
  'AI Creator': ['Prompt Engineering', 'AI Video', 'AI Image Generation', 'Custom Models', 'AI Avatars'],
  'Content Creator': ['YouTube', 'TikTok', 'Instagram Reels', 'Podcasting', 'Live Streaming', 'Gaming Content'],
  'Talent': ['Models', 'UGC Creator', 'Singer', 'Musician', 'Voice Over', 'Dancer'],
  'Script Writer': ['Film/TV', 'Commercials', 'Video Games', 'YouTube', 'Podcasts'],
  'Copywriter': ['Ad Copy', 'Website Copy', 'Email Copy', 'Product Descriptions', 'SEO Copywriting'],
  'Brand Strategist': ['Brand Identity', 'Market Positioning', 'Consumer Insights', 'Tone of Voice'],
  'Social Media': ['Instagram', 'TikTok', 'LinkedIn', 'Community Management', 'Content Calendar'],
  'MUA & Stylist': ['Bridal', 'Editorial', 'Special FX', 'Personal Styling', 'Wardrobe'],
  'Creative Director': ['Art Direction', 'Campaigns', 'Brand Vision', 'Team Leadership'],
  'Event Producer': ['Corporate Events', 'Festivals', 'Exhibitions', 'Weddings', 'Live Shows'],
  'Other': ['General'],
};

const sections = [
  { icon: '🎯', name: 'Profession & Niche', key: 'profession' },
  { icon: '👤', name: 'Profile & Bio', key: 'profile' },
  { icon: '🖼️', name: 'Portfolio', key: 'portfolio' },
  { icon: '🔗', name: 'Links & Socials', key: 'links' },
];

const inputClass = "px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card placeholder:text-otj-muted";

const CreativeSettings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profession');

  // Pre-filled with existing profile data
  const [profession, setProfession] = useState('Photographer');
  const [selectedNiches, setSelectedNiches] = useState<Set<string>>(new Set(['Fashion Editorial', 'E-Commerce']));
  const [city, setCity] = useState('Cairo');
  const [experience, setExperience] = useState('5–8 years');
  const [name, setName] = useState('Nour Makram');
  const [tagline, setTagline] = useState('Fashion & E-commerce Photographer · Cairo');
  const [bio, setBio] = useState('Cairo-based fashion and e-commerce photographer with 7+ years of experience. Specializing in product photography, lifestyle campaigns, and brand content for leading Egyptian and MENA brands.');
  const [avatarUploaded, setAvatarUploaded] = useState(true);
  const [instagram, setInstagram] = useState('@nourmakram');
  const [links, setLinks] = useState([{ label: 'Portfolio', url: 'https://nourmakram.com' }]);
  const [filledSlots, setFilledSlots] = useState(new Set([0, 1, 2, 3]));
  const [profSearch, setProfSearch] = useState('');

  const availableNiches = nicheMap[profession] || [];
  const q = profSearch.toLowerCase();
  const filteredProfessions = q ? professions.filter(p => p.name.toLowerCase().includes(q)) : professions;
  const filteredNiches = q ? availableNiches.filter(n => n.toLowerCase().includes(q)) : availableNiches;

  const autoTagline = `${profession} · ${Array.from(selectedNiches).map(n => n.toLowerCase()).join(' · ') || 'specialist'}`;

  const handleSave = () => {
    showToast('✓ Profile updated successfully!');
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-[52px]">
        {/* Sidebar */}
        <aside className="hidden md:flex bg-card border-r border-border p-[28px_20px_24px] fixed top-[52px] left-0 bottom-0 w-[260px] overflow-y-auto flex-col gap-0">
          <div className="text-base font-extrabold tracking-[-0.04em] text-foreground mb-1">Edit Profile</div>
          <div className="text-[11.5px] text-otj-text leading-relaxed mb-5">Update your profile details. Changes are saved per section.</div>

          <div className="flex flex-col gap-0.5 flex-1">
            {sections.map(s => (
              <div
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] cursor-pointer transition-all duration-150 ${
                  activeSection === s.key ? 'bg-otj-off' : 'hover:bg-otj-off'
                }`}
              >
                <div className={`w-7 h-7 rounded-[7px] border-[1.5px] flex items-center justify-center text-[13px] shrink-0 transition-all duration-200 ${
                  activeSection === s.key ? 'border-foreground bg-otj-off' : 'border-border bg-card'
                }`}>{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[12.5px] font-bold tracking-[-0.01em] ${activeSection === s.key ? 'text-foreground' : 'text-otj-text'}`}>{s.name}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2">
            <button onClick={() => navigate('/creative/nour')} className="w-full text-[12px] font-bold py-2.5 rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">
              👁 View Profile
            </button>
          </div>
        </aside>

        {/* Mobile section picker */}
        <div className="md:hidden px-4 py-3 flex gap-1.5 overflow-x-auto hide-scrollbar">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`shrink-0 text-[12px] font-semibold px-4 py-[7px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 whitespace-nowrap ${
                activeSection === s.key
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-card border-border text-otj-text hover:border-otj-muted'
              }`}
            >{s.icon} {s.name}</button>
          ))}
        </div>

        {/* Main content */}
        <main className="md:ml-[260px] px-4 md:px-12 py-6 md:py-10 max-w-[900px]">
          {/* Profession & Niche */}
          {activeSection === 'profession' && (
            <div className="animate-fade-up">
              <div className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">PROFESSION<br/>& NICHE</div>
              <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-6">Update your primary profession, niches, and location.</div>

              {/* Search */}
              <div className="relative mb-7">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-otj-muted text-[14px] pointer-events-none">🔍</span>
                <input value={profSearch} onChange={e => setProfSearch(e.target.value)} placeholder="Search profession or niche…"
                  className="w-full pl-9 pr-9 py-2.5 rounded-[12px] border-[1.5px] border-border bg-card text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground placeholder:text-otj-muted"
                />
                {profSearch && <button onClick={() => setProfSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-otj-muted hover:text-foreground">✕</button>}
              </div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border">🎯 Your Profession</div>
                <div className="grid grid-rows-3 grid-flow-col auto-cols-[140px] gap-2.5 mb-7 pb-4 overflow-x-auto hide-scrollbar snap-x">
                  {filteredProfessions.map(p => (
                    <div key={p.name} onClick={() => { setProfession(p.name); setSelectedNiches(new Set()); }}
                      className={`snap-start w-full p-4 rounded-xl border-[1.5px] bg-card cursor-pointer transition-all duration-150 text-center flex flex-col items-center justify-center ${
                        profession === p.name ? 'border-foreground bg-otj-off' : 'border-border hover:border-otj-muted hover:bg-otj-off'
                      }`}>
                      <div className="text-2xl mb-1">{p.icon}</div>
                      <div className="text-[12px] font-bold tracking-[-0.02em] text-foreground leading-tight">{p.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border">
                  🏷️ Your Niches <span className="text-[11px] font-medium text-otj-text">— pick all that apply</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredNiches.map(n => (
                    <div key={n} onClick={() => { const next = new Set(selectedNiches); next.has(n) ? next.delete(n) : next.add(n); setSelectedNiches(next); }}
                      className={`text-[12.5px] font-semibold px-4 py-2 rounded-full border-[1.5px] cursor-pointer transition-all duration-150 select-none flex items-center gap-1.5 ${
                        selectedNiches.has(n)
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground hover:bg-otj-off'
                      }`}>
                      {n} {selectedNiches.has(n) && <span className="w-[5px] h-[5px] rounded-full bg-primary-foreground/50" />}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border">📍 Location & Experience</div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">City</div>
                    <select value={city} onChange={e => setCity(e.target.value)} className={`${inputClass} appearance-none cursor-pointer pr-9`}>
                      <option>Cairo</option><option>Alexandria</option><option>Giza</option><option>Hurghada</option><option>Sharm El Sheikh</option><option>Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Years of Experience</div>
                    <select value={experience} onChange={e => setExperience(e.target.value)} className={`${inputClass} appearance-none cursor-pointer pr-9`}>
                      <option>Less than 1 year</option><option>1–2 years</option><option>3–5 years</option><option>5–8 years</option><option>8+ years</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-6 border-t border-border">
                <button onClick={handleSave} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:bg-primary/90">
                  ✓ Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Profile & Bio */}
          {activeSection === 'profile' && (
            <div className="animate-fade-up">
              <div className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">YOUR<br/>STORY.</div>
              <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">Update your profile photo, name, tagline, and bio.</div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border">👤 Profile Photo</div>
                <div className="flex items-center gap-5 mb-2">
                  <div onClick={() => { setAvatarUploaded(true); showToast('Photo updated ✓'); }}
                    className="w-24 h-24 rounded-full border-2 border-dashed border-border bg-otj-off flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shrink-0 relative overflow-hidden hover:border-foreground hover:bg-otj-light">
                    {avatarUploaded ? (
                      <div className="absolute inset-0 bg-otj-light flex items-center justify-center text-5xl">👩‍🎨</div>
                    ) : (
                      <><div className="text-2xl mb-1">📷</div><div className="text-[9.5px] font-bold text-otj-muted uppercase tracking-[0.08em]">Upload</div></>
                    )}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-foreground mb-1">Profile photo</div>
                    <div className="text-xs text-otj-text leading-relaxed">Square photo works best. Minimum 400×400px.</div>
                  </div>
                </div>
              </div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border">✍️ Name & Bio</div>
                <div className="flex flex-col gap-1.5 mb-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Full Name</div>
                  <input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Your full name" />
                </div>
                <div className="flex flex-col gap-1.5 mb-3.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Tagline</div>
                    <div className="text-[10px] text-otj-blue font-semibold cursor-pointer" onClick={() => setTagline(autoTagline)}>↻ Reset to auto</div>
                  </div>
                  <input value={tagline} onChange={e => setTagline(e.target.value)} maxLength={80} className={inputClass} placeholder="e.g. Fashion & E-commerce photographer based in Cairo" />
                  <div className="text-[10.5px] text-otj-muted text-right mt-0.5">{tagline.length}/80</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Bio</div>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={500} rows={5}
                    className={`${inputClass} resize-y leading-relaxed min-h-[100px]`}
                    placeholder="Tell clients about yourself — your experience, what makes your work unique…" />
                  <div className="text-[10.5px] text-otj-muted text-right mt-0.5">{bio.length}/500</div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-6 border-t border-border">
                <button onClick={handleSave} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:bg-primary/90">
                  ✓ Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Portfolio */}
          {activeSection === 'portfolio' && (
            <div className="animate-fade-up">
              <div className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">YOUR<br/>PORTFOLIO.</div>
              <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">Manage your portfolio images. First image becomes your card cover on Explore.</div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border">
                  🖼️ Portfolio Images <span className="text-[11px] font-medium text-otj-text">— up to 12 photos</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
                    const emojis = ['🌆', '👗', '🎭', '🌸', '🔥', '⚡', '📸', '🎨', '🌊', '🏙️', '🌿', '✨'];
                    return (
                      <div key={i} onClick={() => { const next = new Set(filledSlots); if (next.has(i)) { next.delete(i); showToast('Photo removed'); } else { next.add(i); showToast('Photo added ✓'); } setFilledSlots(next); }}
                        className={`aspect-[4/3] rounded-xl border-[1.5px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
                          filledSlots.has(i) ? 'border-solid border-border' : 'border-dashed border-border hover:border-foreground hover:bg-otj-light'
                        } bg-otj-off`}>
                        {filledSlots.has(i) ? (
                          <div className="absolute inset-0 flex items-center justify-center text-[40px] bg-otj-light">
                            {emojis[i]}
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center text-[10px] text-otj-muted hover:text-destructive hover:border-destructive transition-all">✕</div>
                          </div>
                        ) : (
                          <><div className="text-2xl mb-1.5">➕</div><div className="text-[10px] font-semibold text-otj-muted">Add photo</div></>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="text-[11.5px] text-otj-text">Drag to reorder. First image is your cover.</div>
              </div>

              <div className="flex items-center justify-end pt-6 border-t border-border">
                <button onClick={handleSave} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:bg-primary/90">
                  ✓ Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Links & Socials */}
          {activeSection === 'links' && (
            <div className="animate-fade-up">
              <div className="text-[clamp(32px,4vw,48px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">LINKS &<br/>SOCIALS.</div>
              <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">Add your social profiles and website links so clients can find you everywhere.</div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border">📱 Social Accounts</div>
                <div className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Instagram</div>
                    <input value={instagram} onChange={e => setInstagram(e.target.value)} className={inputClass} placeholder="@yourusername" />
                  </div>
                </div>
              </div>

              <div className="mb-7">
                <div className="text-[13px] font-bold tracking-[-0.02em] text-foreground mb-3.5 pb-2.5 border-b border-border">🔗 Website / Links</div>
                <div className="flex flex-col gap-2.5">
                  {links.map((link, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={link.label} onChange={e => { const n = [...links]; n[i].label = e.target.value; setLinks(n); }}
                        className={`${inputClass} w-[140px]`} placeholder="Label" />
                      <input value={link.url} onChange={e => { const n = [...links]; n[i].url = e.target.value; setLinks(n); }}
                        className={`${inputClass} flex-1`} placeholder="https://..." />
                      {links.length > 1 && (
                        <span onClick={() => setLinks(links.filter((_, j) => j !== i))}
                          className="text-[11px] text-otj-muted cursor-pointer px-2 py-0.5 rounded-md border border-border transition-all duration-150 hover:text-destructive hover:border-destructive">✕</span>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setLinks([...links, { label: '', url: '' }])}
                    className="text-[12px] font-semibold text-otj-blue cursor-pointer bg-transparent border-none text-left hover:underline">
                    ＋ Add another link
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end pt-6 border-t border-border">
                <button onClick={handleSave} className="text-[13.5px] font-bold px-7 py-3 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:bg-primary/90">
                  ✓ Save Changes
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

export default CreativeSettings;
