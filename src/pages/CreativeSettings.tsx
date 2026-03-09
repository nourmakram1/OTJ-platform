import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Toast, showToast } from '../components/Toast';
import { useCreativeProfile } from '../context/CreativeProfileContext';
import { Camera, LayoutGrid, Star, Bell, Settings, Shield, HelpCircle, LogOut, Trash2, ChevronRight, Crown, Check, X } from 'lucide-react';

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

const inputClass = "px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-background text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground focus:bg-card placeholder:text-muted-foreground";

type Section = 'hub' | 'profile' | 'portfolio' | 'reviews' | 'notifications' | 'account' | 'privacy' | 'help' | 'subscription';

const CreativeSettings = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useCreativeProfile();

  const [activeSection, setActiveSection] = useState<Section>('hub');

  // Profile state — initialized from context
  const [profession, setProfession] = useState(profile.profession);
  const [selectedNiches, setSelectedNiches] = useState<Set<string>>(new Set(profile.selectedNiches));
  const [city, setCity] = useState(profile.city);
  const [experience, setExperience] = useState(profile.experience);
  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUploaded, setAvatarUploaded] = useState(true);
  const [instagram, setInstagram] = useState(profile.instagram);
  const [links, setLinks] = useState(profile.links.map(l => ({ ...l })));
  const [filledSlots, setFilledSlots] = useState(new Set([0, 1, 2, 3]));
  const [profSearch, setProfSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Notification preferences
  const [notifEmail, setNotifEmail] = useState({ messages: true, bookings: true, reviews: true, marketing: false });
  const [notifPush, setNotifPush] = useState({ messages: true, bookings: true, reviews: false, marketing: false });
  const [notifInApp, setNotifInApp] = useState({ messages: true, bookings: true, reviews: true, marketing: true });

  // Account settings
  const [email, setEmail] = useState('nour@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('instapay');
  const [paymentDetails, setPaymentDetails] = useState('nour.makram@instapay');
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro'>('free');

  const availableNiches = nicheMap[profession] || [];
  const q = profSearch.toLowerCase();
  const filteredProfessions = q ? professions.filter(p => p.name.toLowerCase().includes(q)) : professions;
  const filteredNiches = q ? availableNiches.filter(n => n.toLowerCase().includes(q)) : availableNiches;
  const autoTagline = `${profession} · ${Array.from(selectedNiches).map(n => n.toLowerCase()).join(' · ') || 'specialist'}`;

  const handleSave = () => {
    // Build skills from profession + niches
    const skills = [profession, ...Array.from(selectedNiches)].slice(0, 8);
    updateProfile({
      name: name.trim(),
      tagline: tagline.trim(),
      bio: bio.trim(),
      profession,
      selectedNiches: Array.from(selectedNiches),
      skills,
      city,
      experience,
      instagram,
      links: links.filter(l => l.url.trim()),
    });
    showToast('✓ Changes saved successfully!');
  };
  const handleSignOut = () => { showToast('Signed out'); navigate('/auth'); };
  const handleDeleteAccount = () => setDeleteConfirm(true);

  const menuItems = [
    { key: 'profile' as Section, icon: Camera, title: 'Edit Profile', subtitle: 'Name, bio, photo, profession, niche' },
    { key: 'portfolio' as Section, icon: LayoutGrid, title: 'Portfolio', subtitle: 'Manage your work samples' },
    { key: 'reviews' as Section, icon: Star, title: 'Reviews', subtitle: '10 reviews · 4.9 avg' },
    { key: 'notifications' as Section, icon: Bell, title: 'Notifications', subtitle: 'Manage preferences' },
  ];

  const menuItems2 = [
    { key: 'subscription' as Section, icon: Crown, title: 'Subscription', subtitle: currentPlan === 'pro' ? 'Pro plan · Active' : 'Free plan' },
    { key: 'account' as Section, icon: Settings, title: 'Account Settings', subtitle: 'Email, password, payments' },
    { key: 'privacy' as Section, icon: Shield, title: 'Privacy', subtitle: 'Visibility and data' },
    { key: 'help' as Section, icon: HelpCircle, title: 'Help & Support', subtitle: 'FAQs, contact us' },
  ];

  // Hub view
  if (activeSection === 'hub') {
    return (
      <>
        <NavBar />
        <div className="min-h-screen pt-[52px] bg-background">
          <div className="max-w-[600px] mx-auto px-4 py-8">
            <div className="text-lg font-extrabold tracking-[-0.03em] text-foreground mb-6">Settings</div>

            {/* Group 1 */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-4">
              {menuItems.map((item, i) => (
                <div
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-accent ${i < menuItems.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <item.icon className="w-[18px] h-[18px] text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-foreground">{item.title}</div>
                    <div className="text-[12.5px] text-muted-foreground">{item.subtitle}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>

            {/* Group 2 */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-4">
              {menuItems2.map((item, i) => (
                <div
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-accent ${i < menuItems2.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <item.icon className="w-[18px] h-[18px] text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-bold text-foreground">{item.title}</div>
                    <div className="text-[12.5px] text-muted-foreground">{item.subtitle}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>

            {/* Sign Out & Delete */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-4">
              <div
                onClick={handleSignOut}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-accent border-b border-border"
              >
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <LogOut className="w-[18px] h-[18px] text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-foreground">Sign Out</div>
                </div>
              </div>
              <div
                onClick={handleDeleteAccount}
                className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-destructive/5"
              >
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <Trash2 className="w-[18px] h-[18px] text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-destructive">Delete My Account</div>
                  <div className="text-[12.5px] text-muted-foreground">Permanently remove your data</div>
                </div>
              </div>
            </div>

            {/* Delete confirmation */}
            {deleteConfirm && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 mb-4">
                <div className="text-[14px] font-bold text-destructive mb-1">Are you sure?</div>
                <div className="text-[12.5px] text-muted-foreground mb-4">This action is permanent and cannot be undone. All your data, projects, and reviews will be deleted.</div>
                <div className="flex gap-2">
                  <button onClick={() => setDeleteConfirm(false)} className="text-[12.5px] font-bold px-5 py-2 rounded-full border border-border bg-card text-foreground cursor-pointer hover:bg-accent transition-colors">Cancel</button>
                  <button onClick={() => { showToast('Account deleted'); navigate('/auth'); }} className="text-[12.5px] font-bold px-5 py-2 rounded-full border-none bg-destructive text-destructive-foreground cursor-pointer hover:bg-destructive/90 transition-colors">Delete Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <Toast />
      </>
    );
  }

  // Sub-section header with back button
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <button onClick={() => setActiveSection('hub')} className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer hover:bg-accent transition-colors text-foreground text-sm">←</button>
      <div className="text-lg font-extrabold tracking-[-0.03em] text-foreground">{title}</div>
    </div>
  );

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-[52px] bg-background">
        <div className="max-w-[600px] mx-auto px-4 py-8">

          {/* Edit Profile */}
          {activeSection === 'profile' && (
            <div className="animate-fade-up">
              <SectionHeader title="Edit Profile" />

              {/* Profession */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-3">Profession</div>
                <div className="relative mb-4">
                  <input value={profSearch} onChange={e => setProfSearch(e.target.value)} placeholder="Search profession or niche…"
                    className={inputClass} />
                  {profSearch && <button onClick={() => setProfSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground hover:text-foreground">✕</button>}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {filteredProfessions.map(p => (
                    <div key={p.name} onClick={() => { setProfession(p.name); setSelectedNiches(new Set()); }}
                      className={`p-3 rounded-xl border-[1.5px] cursor-pointer transition-all text-center ${
                        profession === p.name ? 'border-foreground bg-accent' : 'border-border hover:border-muted-foreground'
                      }`}>
                      <div className="text-xl mb-0.5">{p.icon}</div>
                      <div className="text-[11px] font-bold text-foreground leading-tight">{p.name}</div>
                    </div>
                  ))}
                </div>

                <div className="text-[13px] font-bold text-foreground mb-2">Niches</div>
                <div className="flex flex-wrap gap-1.5">
                  {filteredNiches.map(n => (
                    <div key={n} onClick={() => { const next = new Set(selectedNiches); next.has(n) ? next.delete(n) : next.add(n); setSelectedNiches(next); }}
                      className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-full border-[1.5px] cursor-pointer transition-all select-none ${
                        selectedNiches.has(n) ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground hover:border-muted-foreground'
                      }`}>{n}</div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-3">Location & Experience</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">City</div>
                    <select value={city} onChange={e => setCity(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option>Cairo</option><option>Alexandria</option><option>Giza</option><option>Hurghada</option><option>Sharm El Sheikh</option><option>Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Experience</div>
                    <select value={experience} onChange={e => setExperience(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                      <option>Less than 1 year</option><option>1–2 years</option><option>3–5 years</option><option>5–8 years</option><option>8+ years</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Name, tagline, bio, photo */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-3">Profile Photo</div>
                <div className="flex items-center gap-4 mb-5">
                  <div onClick={() => { setAvatarUploaded(true); showToast('Photo updated ✓'); }}
                    className="w-20 h-20 rounded-full border-2 border-dashed border-border bg-accent flex items-center justify-center cursor-pointer transition-all shrink-0 relative overflow-hidden hover:border-foreground">
                    {avatarUploaded ? (
                      <div className="absolute inset-0 bg-accent flex items-center justify-center text-4xl">👩‍🎨</div>
                    ) : (
                      <div className="text-2xl">📷</div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Square photo, min 400×400px</div>
                </div>

                <div className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Full Name</div>
                    <input value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Your full name" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Tagline</div>
                      <button className="text-[10px] text-primary font-semibold cursor-pointer bg-transparent border-none" onClick={() => setTagline(autoTagline)}>↻ Auto</button>
                    </div>
                    <input value={tagline} onChange={e => setTagline(e.target.value)} maxLength={80} className={inputClass} />
                    <div className="text-[10px] text-muted-foreground text-right">{tagline.length}/80</div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Bio</div>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={500} rows={4}
                      className={`${inputClass} resize-y leading-relaxed min-h-[90px]`} />
                    <div className="text-[10px] text-muted-foreground text-right">{bio.length}/500</div>
                  </div>
                </div>
              </div>

              {/* Links & Socials */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-3">Links & Socials</div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Instagram</div>
                    <input value={instagram} onChange={e => setInstagram(e.target.value)} className={inputClass} placeholder="@yourusername" />
                  </div>
                  {links.map((link, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={link.label} onChange={e => { const n = [...links]; n[i].label = e.target.value; setLinks(n); }}
                        className={`${inputClass} w-[120px]`} placeholder="Label" />
                      <input value={link.url} onChange={e => { const n = [...links]; n[i].url = e.target.value; setLinks(n); }}
                        className={`${inputClass} flex-1`} placeholder="https://..." />
                      {links.length > 1 && (
                        <button onClick={() => setLinks(links.filter((_, j) => j !== i))}
                          className="text-[11px] text-muted-foreground cursor-pointer px-2 py-0.5 rounded-md border border-border hover:text-destructive hover:border-destructive transition-colors">✕</button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setLinks([...links, { label: '', url: '' }])}
                    className="text-[12px] font-semibold text-primary cursor-pointer bg-transparent border-none text-left hover:underline">
                    ＋ Add link
                  </button>
                </div>
              </div>

              <button onClick={handleSave} className="w-full text-[13.5px] font-bold py-3 rounded-full bg-primary text-primary-foreground cursor-pointer transition-colors hover:bg-primary/90 border-none">
                Save Changes
              </button>
            </div>
          )}

          {/* Portfolio */}
          {activeSection === 'portfolio' && (
            <div className="animate-fade-up">
              <SectionHeader title="Portfolio" />
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-1">Your work samples</div>
                <div className="text-[12px] text-muted-foreground mb-4">First image becomes your cover on Explore.</div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
                    const emojis = ['🌆','👗','🎭','🌸','🔥','⚡','📸','🎨','🌊','🏙️','🌿','✨'];
                    return (
                      <div key={i} onClick={() => { const next = new Set(filledSlots); next.has(i) ? next.delete(i) : next.add(i); setFilledSlots(next); }}
                        className={`aspect-[4/3] rounded-xl border-[1.5px] flex items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
                          filledSlots.has(i) ? 'border-border' : 'border-dashed border-border hover:border-foreground'
                        } bg-accent`}>
                        {filledSlots.has(i) ? (
                          <div className="text-[32px]">{emojis[i]}</div>
                        ) : (
                          <div className="text-xl text-muted-foreground">+</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={handleSave} className="w-full text-[13.5px] font-bold py-3 rounded-full bg-primary text-primary-foreground cursor-pointer transition-colors hover:bg-primary/90 border-none">
                Save Changes
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="animate-fade-up">
              <SectionHeader title="Notifications" />

              {/* Email notifications */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-1">Email Notifications</div>
                <div className="text-[12px] text-muted-foreground mb-4">Receive updates via email</div>
                {Object.entries(notifEmail).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="text-[13px] text-foreground capitalize">{key === 'marketing' ? 'Marketing & tips' : key}</div>
                    <button onClick={() => setNotifEmail(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                      className={`w-10 h-6 rounded-full transition-colors cursor-pointer border-none relative ${val ? 'bg-primary' : 'bg-muted'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-card transition-all ${val ? 'left-5' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Push notifications */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-1">Push Notifications</div>
                <div className="text-[12px] text-muted-foreground mb-4">Receive push notifications on your device</div>
                {Object.entries(notifPush).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="text-[13px] text-foreground capitalize">{key === 'marketing' ? 'Marketing & tips' : key}</div>
                    <button onClick={() => setNotifPush(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                      className={`w-10 h-6 rounded-full transition-colors cursor-pointer border-none relative ${val ? 'bg-primary' : 'bg-muted'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-card transition-all ${val ? 'left-5' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>

              {/* In-app notifications */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-1">In-App Notifications</div>
                <div className="text-[12px] text-muted-foreground mb-4">Show notifications inside the app</div>
                {Object.entries(notifInApp).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="text-[13px] text-foreground capitalize">{key === 'marketing' ? 'Marketing & tips' : key}</div>
                    <button onClick={() => setNotifInApp(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                      className={`w-10 h-6 rounded-full transition-colors cursor-pointer border-none relative ${val ? 'bg-primary' : 'bg-muted'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-card transition-all ${val ? 'left-5' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={handleSave} className="w-full text-[13.5px] font-bold py-3 rounded-full bg-primary text-primary-foreground cursor-pointer transition-colors hover:bg-primary/90 border-none">
                Save Preferences
              </button>
            </div>
          )}

          {/* Account Settings */}
          {activeSection === 'account' && (
            <div className="animate-fade-up">
              <SectionHeader title="Account Settings" />

              {/* Email */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-3">Email Address</div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Current Email</div>
                  <input value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="your@email.com" />
                </div>
                <button onClick={() => { showToast('Verification email sent ✓'); }} className="mt-3 text-[12px] font-semibold text-primary cursor-pointer bg-transparent border-none hover:underline">
                  Update Email
                </button>
              </div>

              {/* Password */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-3">Change Password</div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Current Password</div>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">New Password</div>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">Confirm New Password</div>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <div className="text-[11px] text-destructive">Passwords don't match</div>
                    )}
                  </div>
                </div>
                <button onClick={() => {
                  if (!currentPassword || !newPassword) return showToast('Please fill all fields');
                  if (newPassword !== confirmPassword) return showToast('Passwords don\'t match');
                  setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
                  showToast('Password updated ✓');
                }} className="mt-3 text-[12px] font-semibold text-primary cursor-pointer bg-transparent border-none hover:underline">
                  Update Password
                </button>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="text-[13px] font-bold text-foreground mb-1">Payment Method</div>
                <div className="text-[12px] text-muted-foreground mb-4">How clients pay you for completed work</div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    {['instapay', 'bank', 'vodafone-cash'].map(m => (
                      <button key={m} onClick={() => setPaymentMethod(m)}
                        className={`text-[12px] font-semibold px-4 py-2 rounded-full border-[1.5px] cursor-pointer transition-all ${
                          paymentMethod === m ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground hover:border-muted-foreground'
                        }`}>
                        {m === 'instapay' ? 'InstaPay' : m === 'bank' ? 'Bank Transfer' : 'Vodafone Cash'}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {paymentMethod === 'instapay' ? 'InstaPay Username' : paymentMethod === 'bank' ? 'Account Number / IBAN' : 'Phone Number'}
                    </div>
                    <input value={paymentDetails} onChange={e => setPaymentDetails(e.target.value)} className={inputClass}
                      placeholder={paymentMethod === 'instapay' ? 'username@instapay' : paymentMethod === 'bank' ? 'EG00 0000 0000 ...' : '01x xxxx xxxx'} />
                  </div>
                </div>
              </div>

              <button onClick={handleSave} className="w-full text-[13.5px] font-bold py-3 rounded-full bg-primary text-primary-foreground cursor-pointer transition-colors hover:bg-primary/90 border-none">
                Save Changes
              </button>
            </div>
          )}

          {/* Subscription */}
          {activeSection === 'subscription' && (
            <div className="animate-fade-up">
              <SectionHeader title="Subscription" />

              {/* Current plan badge */}
              <div className="bg-card rounded-2xl border border-border p-5 mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-full ${
                    currentPlan === 'pro' ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'
                  }`}>
                    {currentPlan === 'pro' ? '⭐ Pro' : 'Free'}
                  </div>
                </div>
                <div className="text-[13px] text-muted-foreground mt-2">
                  {currentPlan === 'pro' ? 'You\'re on the Pro plan. Enjoy all premium features.' : 'Upgrade to Pro to unlock premium features and grow faster.'}
                </div>
              </div>

              {/* Plan comparison */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Free */}
                <div className={`bg-card rounded-2xl border-[1.5px] p-5 transition-all ${currentPlan === 'free' ? 'border-foreground' : 'border-border'}`}>
                  <div className="text-[13px] font-bold text-foreground mb-1">Free</div>
                  <div className="text-[22px] font-extrabold tracking-[-0.03em] text-foreground mb-3">$0<span className="text-[12px] font-medium text-muted-foreground">/mo</span></div>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { text: 'Basic profile', included: true },
                      { text: '4 portfolio slots', included: true },
                      { text: '3 bookings/month', included: true },
                      { text: 'Priority in search', included: false },
                      { text: 'Verified badge', included: false },
                      { text: '10 bookings/month', included: false },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {f.included ? (
                          <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                        )}
                        <span className={`text-[12px] ${f.included ? 'text-foreground' : 'text-muted-foreground/50'}`}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                  {currentPlan === 'free' && (
                    <div className="mt-4 text-[11px] font-bold text-center text-muted-foreground uppercase tracking-[0.08em]">Current plan</div>
                  )}
                </div>

                {/* Pro */}
                <div className={`bg-card rounded-2xl border-[1.5px] p-5 transition-all relative ${currentPlan === 'pro' ? 'border-foreground' : 'border-border'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Crown className="w-3.5 h-3.5 text-foreground" />
                    <div className="text-[13px] font-bold text-foreground">Pro</div>
                  </div>
                  <div className="text-[22px] font-extrabold tracking-[-0.03em] text-foreground mb-3">$9<span className="text-[12px] font-medium text-muted-foreground">/mo</span></div>
                  <div className="flex flex-col gap-2.5">
                    {[
                      'Full profile customization',
                      '12 portfolio slots',
                      '10 bookings/month',
                      'Priority in search',
                      'Verified badge',
                      'Analytics & insights',
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                        <span className="text-[12px] text-foreground">{f}</span>
                      </div>
                    ))}
                  </div>
                  {currentPlan === 'pro' ? (
                    <div className="mt-4 text-[11px] font-bold text-center text-muted-foreground uppercase tracking-[0.08em]">Current plan</div>
                  ) : (
                    <button onClick={() => { setCurrentPlan('pro'); showToast('🎉 Upgraded to Pro!'); }}
                      className="mt-4 w-full text-[12.5px] font-bold py-2.5 rounded-full bg-primary text-primary-foreground cursor-pointer transition-colors hover:bg-primary/90 border-none">
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>

              {/* Manage */}
              {currentPlan === 'pro' && (
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="text-[13px] font-bold text-foreground mb-1">Manage Subscription</div>
                  <div className="text-[12px] text-muted-foreground mb-3">Next billing date: April 9, 2026</div>
                  <button onClick={() => { setCurrentPlan('free'); showToast('Subscription cancelled'); }}
                    className="text-[12px] font-semibold text-destructive cursor-pointer bg-transparent border-none hover:underline">
                    Cancel subscription
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Placeholder sections */}
          {['reviews', 'privacy', 'help'].includes(activeSection) && (
            <div className="animate-fade-up">
              <SectionHeader title={
                activeSection === 'reviews' ? 'Reviews' :
                activeSection === 'privacy' ? 'Privacy' : 'Help & Support'
              } />
              <div className="bg-card rounded-2xl border border-border p-8 text-center">
                <div className="text-muted-foreground text-sm">Coming soon</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast />
    </>
  );
};

export default CreativeSettings;
