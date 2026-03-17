import React, { useState } from 'react';
import {
  Bell, User, Camera, PenLine, Link2, DollarSign, Package, Wallet,
  ClipboardList, Calendar, Clock, BarChart3, Lock, CreditCard,
  ArrowUpDown, X, ChevronLeft, ChevronRight, GripVertical, Plus,
  Check, Film, MessageCircle, CheckCircle2, Star, Banknote, Image,
  Palette, Sparkles, Briefcase, Building2, Monitor, Bot, Smartphone,
  Mic, FileText, Target, Share2, Scissors, Clapperboard, Search,
  MapPin, Tag, Crosshair, TrendingUp, Zap, ChevronDown,
} from 'lucide-react';

// ─── SHARED STYLE ATOMS ────────────────────────────────────────────────────────
const inp =
  'w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none placeholder:text-otj-muted';
const lbl = 'text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px] block';

// ─── SHARED UI ATOMS ──────────────────────────────────────────────────────────

// Icon-based section heading
function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="text-[13px] font-bold tracking-tight text-foreground mb-3.5 pb-2.5 border-b border-border flex items-center gap-2">
      <Icon size={14} className="text-otj-muted shrink-0" />
      {children}
    </div>
  );
}

// Avatar circle (for nav + modals)
function Avatar({ size = 32 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-otj-off border border-border flex items-center justify-center text-otj-muted shrink-0"
      style={{ width: size, height: size }}
    >
      <User size={size * 0.5} />
    </div>
  );
}

// Bell icon with optional dot
function BellIcon({ dot = false }: { dot?: boolean }) {
  return (
    <div className="relative">
      <Bell size={18} className="text-foreground cursor-pointer" />
      {dot && (
        <span className="absolute -top-0.5 -right-0.5 w-[7px] h-[7px] rounded-full bg-otj-blue border-[1.5px] border-card" />
      )}
    </div>
  );
}

// Close button for modals
function CloseBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-full border border-border bg-card flex items-center justify-center text-otj-muted hover:border-foreground hover:text-foreground"
    >
      <X size={13} />
    </button>
  );
}

// Toggle switch
function Toggle({ on }: { on: boolean }) {
  return (
    <div className={`w-[42px] h-6 rounded-full relative shrink-0 ${on ? 'bg-primary' : 'bg-otj-light'}`}>
      <span
        className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-card shadow-sm transition-transform duration-200 ${
          on ? 'left-auto right-[3px]' : 'left-[3px]'
        }`}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 0 — ONBOARDING STEP 1: WHO ARE YOU? (profession picker)
// ══════════════════════════════════════════════════════════════════════════════

const PROFESSIONS = [
  { Icon: Camera,      name: 'Photography',      sub: 'Wedding, Portrait, Editorial',   bg: 'bg-[#121212]',  iconBg: 'bg-white/15', iconColor: 'text-white',     textColor: 'text-white',     subColor: 'text-white/70', selected: true },
  { Icon: Film,        name: 'Videography',       sub: 'Film, Commercial, Documentary',  bg: 'bg-card',       iconBg: 'bg-[#ebebeb]', iconColor: 'text-foreground', textColor: 'text-foreground', subColor: 'text-otj-muted', selected: false },
  { Icon: Palette,     name: 'Design & Branding', sub: 'Logos, Identity, Motion',        bg: 'bg-card',       iconBg: 'bg-purple-50', iconColor: 'text-purple-500', textColor: 'text-foreground', subColor: 'text-otj-muted', selected: false },
  { Icon: PenLine,     name: 'Writing & Copy',    sub: 'Articles, Scripts, Social',      bg: 'bg-card',       iconBg: 'bg-amber-50',  iconColor: 'text-amber-500',  textColor: 'text-foreground', subColor: 'text-otj-muted', selected: false },
  { Icon: TrendingUp,  name: 'Marketing',         sub: 'Strategy, Campaigns, Growth',    bg: 'bg-card',       iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',   textColor: 'text-foreground', subColor: 'text-otj-muted', selected: false },
  { Icon: Scissors,    name: 'Fashion & Styling', sub: 'Wardrobe, Lookbooks, Sets',      bg: 'bg-card',       iconBg: 'bg-rose-50',   iconColor: 'text-rose-500',   textColor: 'text-foreground', subColor: 'text-otj-muted', selected: false },
  { Icon: Monitor,     name: 'Tech & Digital',    sub: 'Web, Apps, UX/UI',               bg: 'bg-card',       iconBg: 'bg-emerald-50',iconColor: 'text-emerald-500',textColor: 'text-foreground', subColor: 'text-otj-muted', selected: false },
  { Icon: Mic,         name: 'Performance',       sub: 'Music, Voice, Acting, DJ',       bg: 'bg-card',       iconBg: 'bg-orange-50', iconColor: 'text-orange-500', textColor: 'text-foreground', subColor: 'text-otj-muted', selected: false },
  { Icon: Building2,   name: 'Space Design',      sub: 'Interior, Set, Exhibition',      bg: 'bg-card',       iconBg: 'bg-sky-50',    iconColor: 'text-sky-500',    textColor: 'text-foreground', subColor: 'text-otj-muted', selected: false },
];

function Screen_Step1() {
  const niches = ['Wedding', 'Portrait', 'Street', 'Commercial', 'Editorial', 'Documentary', 'Events', 'Architecture', 'Fashion', 'Newborn', 'Sports'];
  const active = new Set(['Wedding', 'Portrait']);
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 h-[56px] bg-card border-b border-border flex items-center justify-between px-5 z-50">
        <span className="text-[15px] font-extrabold tracking-[-0.04em] text-foreground">OTJ</span>
        <span className="text-[11px] text-otj-muted">Already have an account? <span className="font-bold text-foreground">Log in</span></span>
        <div className="w-[32px] h-[32px] rounded-full border border-border flex items-center justify-center">
          <ChevronLeft size={14} className="text-otj-muted" />
        </div>
      </nav>

      <div className="flex pt-[56px] h-screen">
        {/* Sidebar */}
        <aside className="w-[280px] bg-[#fafafa] border-r border-border flex flex-col py-8 px-5 shrink-0">
          {/* Progress ring placeholder */}
          <div className="w-[80px] h-[80px] border-[1.5px] border-foreground rounded-sm flex items-center justify-center mx-auto mb-7">
            <span className="text-[16px] font-bold text-foreground">1/6</span>
          </div>
          <div className="flex flex-col gap-0.5">
            {[
              { n: 1, label: 'Profession & Niche', active: true },
              { n: 2, label: 'Profile Details', active: false },
              { n: 3, label: 'Portfolio', active: false },
              { n: 4, label: 'Experience', active: false },
              { n: 5, label: 'Pricing', active: false },
              { n: 6, label: 'Verification', active: false },
            ].map((s) => (
              <div key={s.n} className={`flex items-center gap-3 px-3 py-[10px] rounded-[10px] ${s.active ? 'bg-foreground' : ''}`}>
                <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${s.active ? 'bg-white border-white/20' : 'border-border'}`}>
                  <span className={`text-[11px] font-bold ${s.active ? 'text-foreground' : 'text-otj-muted'}`}>{s.n}</span>
                </div>
                <span className={`text-[12.5px] font-semibold tracking-tight ${s.active ? 'text-white' : 'text-otj-text'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-[#f5f3f0] overflow-y-auto px-[60px] py-10">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">Step 1 of 6</div>
          <div className="text-[52px] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-3">
            What do you create?
          </div>
          <div className="text-base text-otj-muted mb-7 leading-relaxed">
            Select your primary profession — you can edit later.
          </div>

          {/* 3x3 Profession grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {PROFESSIONS.map((p) => (
              <div key={p.name} className={`rounded-[18px] border-[1.5px] p-5 flex gap-4 items-start cursor-pointer ${p.selected ? 'bg-[#121212] border-[#121212]' : 'bg-card border-border'}`}>
                <div className={`w-[44px] h-[44px] rounded-[12px] flex items-center justify-center shrink-0 ${p.iconBg}`}>
                  <p.Icon size={22} className={p.iconColor} />
                </div>
                <div>
                  <div className={`text-[14px] font-bold tracking-tight leading-tight mb-0.5 ${p.textColor}`}>{p.name}</div>
                  <div className={`text-[11.5px] leading-snug ${p.subColor}`}>{p.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Niches */}
          <div>
            <div className="text-[13px] font-semibold text-foreground mb-3">Select your niches</div>
            <div className="flex flex-wrap gap-2">
              {niches.map((n) => (
                <span key={n} className={`text-[13px] font-semibold px-5 py-2 rounded-full border-[1.5px] ${active.has(n) ? 'bg-foreground border-foreground text-white' : 'bg-card border-border text-foreground'}`}>{n}</span>
              ))}
            </div>
          </div>

          {/* Footer nav */}
          <div className="flex items-center justify-between mt-10 pt-5 border-t border-border">
            <button className="text-[13px] font-semibold px-5 py-2.5 rounded-full border border-border bg-card text-otj-muted flex items-center gap-1.5">
              <ChevronLeft size={14} /> Back
            </button>
            <button className="text-[13.5px] font-bold px-8 py-3 rounded-full bg-foreground text-white flex items-center gap-1.5">
              Continue <ChevronRight size={14} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD SHARED NAV
// ══════════════════════════════════════════════════════════════════════════════
function DashNav({ notif = false }: { notif?: boolean }) {
  return (
    <nav className="fixed top-0 inset-x-0 h-[56px] bg-card border-b border-border flex items-center justify-between px-5 z-50">
      <span className="text-[15px] font-extrabold tracking-[-0.04em] text-foreground">OTJ</span>
      <div className="flex gap-6 text-[12px] font-bold text-otj-muted">
        <span>Explore</span>
        <span>Messages</span>
        <span className="text-foreground border-b-[1.5px] border-foreground pb-0.5">Dashboard</span>
      </div>
      <div className="flex items-center gap-3">
        <BellIcon dot={notif} />
        <Avatar size={32} />
      </div>
    </nav>
  );
}

// Stats row shared between dashboard screens
function DashStats({ hired, booked }: { hired: number; booked: number }) {
  const stats = [
    { label: 'Hired Projects', val: String(hired), delta: 'Working on', cls: 'text-otj-green' },
    { label: 'My Bookings',    val: String(booked), delta: booked > 0 ? 'You booked' : 'None yet', cls: 'text-otj-blue' },
    { label: 'Revenue (Mar)',  val: '14K',            delta: '↑ 23% vs Feb',  cls: 'text-otj-green' },
    { label: 'Pending Briefs', val: '3',              delta: 'Need response',  cls: 'text-otj-text' },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 mb-5">
      {stats.map((s, i) => (
        <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">{s.label}</div>
          <div className="text-[26px] font-extrabold tracking-[-0.05em] leading-none text-foreground">{s.val}</div>
          <div className={`text-[11px] font-bold mt-1 ${s.cls}`}>{s.delta}</div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD — PENDING BRIEFS (Getting Booked)
// ══════════════════════════════════════════════════════════════════════════════
function Screen_DashPending() {
  const briefs = [
    {
      icon: Camera, iconBg: 'bg-amber-50', iconColor: 'text-amber-500',
      name: 'Ramadan Campaign Shoot',
      client: 'ZARA Egypt · Cairo',
      tags: ['Photography', 'Fashion', 'On-location'],
      time: '5m ago',
      budget: '3,500 EGP',
    },
    {
      icon: Film, iconBg: 'bg-blue-50', iconColor: 'text-blue-500',
      name: 'Product Launch Video',
      client: 'Noon.com · Remote',
      tags: ['Videography', 'Commercial', 'Studio'],
      time: '2h ago',
      budget: '6,000 EGP',
    },
    {
      icon: Palette, iconBg: 'bg-purple-50', iconColor: 'text-purple-500',
      name: 'Brand Identity Refresh',
      client: 'Drip Coffee Co. · Hybrid',
      tags: ['Branding', 'Logo', 'Guidelines'],
      time: '5h ago',
      budget: '4,200 EGP',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashNav notif />
      <div className="max-w-[1100px] mx-auto px-6 pt-[72px] pb-10">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[22px] font-extrabold tracking-[-0.04em]">Good morning, Nour</div>
            <div className="text-[13px] text-otj-text mt-0.5">Monday, March 2 · 3 briefs need your attention</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold">
              <Star size={13} className="text-amber-400 fill-current" />
              <span className="text-otj-muted">4.9</span>
              <span className="text-otj-muted font-medium">(127)</span>
            </div>
            <button className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full bg-foreground text-white">Share Profile</button>
          </div>
        </div>

        <DashStats hired={2} booked={1} />

        {/* Projects section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-lg font-extrabold tracking-[-0.04em]">Projects</div>
              <div className="flex gap-1">
                {[
                  { key: 'pending', label: 'Pending (3)', active: true },
                  { key: 'active',  label: 'Active (2)',  active: false },
                  { key: 'done',    label: 'Complete (5)',active: false },
                ].map((tab) => (
                  <button key={tab.key} className={`text-[12px] font-semibold px-3.5 py-[5px] rounded-full border-[1.5px] ${tab.active ? 'bg-foreground border-foreground text-white' : 'bg-card border-border text-otj-text'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {['All', 'Hired', 'My Bookings'].map((f, i) => (
                  <button key={f} className={`text-[11px] font-semibold px-2.5 py-[4px] rounded-full border-[1.5px] ${i === 1 ? 'bg-otj-off border-border text-foreground' : 'bg-transparent border-transparent text-otj-muted'}`}>{f}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {briefs.map((b, i) => (
              <div key={i} className="bg-card border border-border rounded-[14px] p-4 flex items-center gap-3 hover:shadow-md hover:border-otj-muted transition-all">
                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${b.iconBg}`}>
                  <b.icon size={20} className={b.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-extrabold tracking-[-0.02em] truncate mb-0.5 flex items-center gap-2">
                    {b.name}
                    <span className="text-[9px] font-bold px-1.5 py-[1px] rounded-full border bg-otj-green-bg text-otj-green border-otj-green-border shrink-0">
                      Incoming Brief
                    </span>
                  </div>
                  <div className="text-[11.5px] text-otj-text mb-1.5">{b.client}</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {b.tags.map((t) => (
                      <span key={t} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-otj-off border border-border text-otj-text">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <div className="text-[10.5px] font-bold text-otj-green">{b.budget}</div>
                  <div className="text-[10px] text-otj-muted">{b.time}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <button className="text-[11.5px] font-bold px-3 py-[5px] rounded-full bg-foreground text-white">View Brief</button>
                    <button className="text-[11.5px] font-bold px-3 py-[5px] rounded-full border border-border text-otj-muted">Decline</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD — ACTIVE PROJECTS (I Am Hired)
// ══════════════════════════════════════════════════════════════════════════════
function Screen_DashActive() {
  const projects = [
    {
      icon: Camera, iconBg: 'bg-amber-50', iconColor: 'text-amber-500',
      name: 'Ramadan Campaign Shoot',
      client: 'ZARA Egypt · Cairo',
      phases: [
        { num: 1, title: 'Pre-Production', status: 'complete' },
        { num: 2, title: 'Shoot Day',       status: 'active' },
        { num: 3, title: 'Post-Production', status: 'pending' },
        { num: 4, title: 'Delivery',        status: 'pending' },
      ],
      status: 'Phase 2 · Shoot Day',
      statusCls: 'bg-otj-blue-bg text-otj-blue',
      deadline: 'Mar 25',
      budget: '3,500 EGP',
    },
    {
      icon: Palette, iconBg: 'bg-purple-50', iconColor: 'text-purple-500',
      name: 'Brand Identity Refresh',
      client: 'Drip Coffee Co. · Remote',
      phases: [
        { num: 1, title: 'Discovery',    status: 'complete' },
        { num: 2, title: 'Concepts',     status: 'complete' },
        { num: 3, title: 'Refinement',   status: 'active' },
        { num: 4, title: 'Final Assets', status: 'pending' },
      ],
      status: 'Phase 3 · Refinement',
      statusCls: 'bg-otj-blue-bg text-otj-blue',
      deadline: 'Mar 30',
      budget: '4,200 EGP',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashNav />
      <div className="max-w-[1100px] mx-auto px-6 pt-[72px] pb-10">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[22px] font-extrabold tracking-[-0.04em]">Good morning, Nour</div>
            <div className="text-[13px] text-otj-text mt-0.5">Monday, March 2 · 2 active projects</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[12px] font-bold">
              <Star size={13} className="text-amber-400 fill-current" />
              <span className="text-otj-muted">4.9</span>
              <span className="text-otj-muted font-medium">(127)</span>
            </div>
            <button className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full bg-foreground text-white">Share Profile</button>
          </div>
        </div>

        <DashStats hired={2} booked={1} />

        {/* Projects section */}
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <div className="text-lg font-extrabold tracking-[-0.04em]">Projects</div>
            <div className="flex gap-1">
              {[
                { key: 'pending', label: 'Pending (3)', active: false },
                { key: 'active',  label: 'Active (2)',  active: true },
                { key: 'done',    label: 'Complete (5)',active: false },
              ].map((tab) => (
                <button key={tab.key} className={`text-[12px] font-semibold px-3.5 py-[5px] rounded-full border-[1.5px] ${tab.active ? 'bg-foreground border-foreground text-white' : 'bg-card border-border text-otj-text'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {['All', 'Hired', 'My Bookings'].map((f, i) => (
                <button key={f} className={`text-[11px] font-semibold px-2.5 py-[4px] rounded-full border-[1.5px] ${i === 1 ? 'bg-otj-off border-border text-foreground' : 'bg-transparent border-transparent text-otj-muted'}`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {projects.map((p, i) => (
              <div key={i} className="bg-card border border-border rounded-[14px] p-4 flex gap-3 items-start cursor-pointer hover:shadow-md hover:border-otj-muted transition-all">
                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${p.iconBg}`}>
                  <p.icon size={20} className={p.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-extrabold tracking-[-0.02em] mb-0.5 flex items-center gap-2">
                    {p.name}
                    <span className="text-[9px] font-bold px-1.5 py-[1px] rounded-full border bg-otj-green-bg text-otj-green border-otj-green-border shrink-0">
                      Hired
                    </span>
                  </div>
                  <div className="text-[11.5px] text-otj-text mb-2">Client: {p.client}</div>
                  {/* Phase progress bars */}
                  <div className="flex gap-[3px] mb-1.5">
                    {p.phases.map((ph) => (
                      <div key={ph.num} className={`h-1 flex-1 rounded-full ${ph.status === 'complete' ? 'bg-otj-green' : ph.status === 'active' ? 'bg-otj-blue' : 'bg-otj-light'}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${p.statusCls}`}>{p.status}</span>
                    <span className="text-[10.5px] text-otj-muted">Due {p.deadline}</span>
                    <span className="text-[10.5px] font-bold text-otj-green ml-auto">{p.budget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING SHARED LAYOUT ─────────────────────────────────────────────────
const OB_STEPS = [
  { n: 1, label: 'What do you create?', req: true },
  { n: 2, label: 'Your profile', req: true },
  { n: 3, label: 'Portfolio', req: false },
  { n: 4, label: 'Pricing', req: false },
  { n: 5, label: 'Brief questions', req: true },
  { n: 6, label: 'Availability', req: false },
  { n: 7, label: 'Final touches', req: false },
];

function OBNav({ step }: { step: number }) {
  const pct = Math.round(((step - 1) / 6) * 100);
  return (
    <nav className="fixed top-0 inset-x-0 h-[56px] bg-card border-b border-border flex items-center justify-between px-5 z-50">
      <span className="text-[15px] font-extrabold tracking-[-0.04em] text-foreground">OTJ</span>
      <span className="text-[10.5px] font-bold text-otj-muted tracking-[0.06em] uppercase">
        Step {step} of 7 · {pct}% complete
      </span>
      <div className="flex items-center gap-3">
        <BellIcon />
        <Avatar size={32} />
      </div>
    </nav>
  );
}

function OBSidebar({ step }: { step: number }) {
  return (
    <aside className="fixed top-[56px] left-0 bottom-0 w-[260px] bg-card border-r border-border flex flex-col py-4 px-3 z-40">
      <div className="flex flex-col gap-0.5 flex-1">
        {OB_STEPS.map((s) => {
          const done = s.n < step;
          const active = s.n === step;
          return (
            <div
              key={s.n}
              className={`flex items-center gap-2.5 px-3 py-[9px] rounded-[10px] cursor-pointer ${
                active ? 'bg-foreground' : done ? 'bg-otj-green-bg' : 'hover:bg-otj-off'
              }`}
            >
              <div
                className={`w-[26px] h-[26px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                  active
                    ? 'bg-primary-foreground border-primary-foreground/20 text-foreground'
                    : done
                    ? 'bg-card border-otj-green-border text-otj-green'
                    : 'bg-card border-border text-otj-muted'
                }`}
              >
                {done ? (
                  <Check size={12} />
                ) : (
                  <span className="text-[11px] font-bold">{s.n}</span>
                )}
              </div>
              <span
                className={`text-[12.5px] font-semibold tracking-tight flex-1 ${
                  active ? 'text-primary-foreground' : done ? 'text-otj-green' : 'text-otj-text'
                }`}
              >
                {s.label}
              </span>
              {s.req && (
                <span
                  className={`text-[9px] font-bold uppercase ${
                    active ? 'text-primary-foreground/50' : done ? 'text-otj-green/60' : 'text-destructive/60'
                  }`}
                >
                  req
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="px-3 mt-3">
        <button className="w-full py-2.5 rounded-full text-[13px] font-bold bg-otj-green text-primary-foreground opacity-40 cursor-not-allowed flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-foreground/80" />
          Go Live
        </button>
        <p className="text-center text-[10px] text-otj-muted mt-1.5 leading-relaxed">
          Complete required steps to go live
        </p>
      </div>
    </aside>
  );
}

function OBPage({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <OBNav step={step} />
      <OBSidebar step={step} />
      <main className="ml-[260px] pt-[56px] px-12 py-10">
        <div className="max-w-[640px] animate-fade-up">{children}</div>
      </main>
    </div>
  );
}

function StepLabel({ label }: { label: string }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-otj-blue mb-2.5">
      {label}
    </div>
  );
}

function StepH1({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[clamp(40px,5vw,52px)] font-extrabold tracking-[-0.05em] leading-[0.9] text-foreground mb-2.5">
      {children}
    </div>
  );
}

function StepDesc({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-otj-text leading-relaxed max-w-[560px] mb-8">{children}</div>
  );
}

function NavButtons({ last }: { last?: boolean }) {
  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
      <button className="text-[13px] font-bold px-5 py-[11px] rounded-full border-[1.5px] border-border bg-card text-otj-text flex items-center gap-1.5">
        <ChevronLeft size={15} /> Back
      </button>
      <button className="text-[13.5px] font-bold px-7 py-3 rounded-full bg-primary text-primary-foreground flex items-center gap-1.5">
        {last ? (
          <>
            Finish Setup <Check size={15} />
          </>
        ) : (
          <>
            Save & Continue <ChevronRight size={15} />
          </>
        )}
      </button>
    </div>
  );
}

// ─── BOOKING SCREEN BACKGROUND ────────────────────────────────────────────────
function BookingBg({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <nav className="fixed top-0 inset-x-0 h-[56px] bg-card border-b border-border flex items-center justify-between px-5 z-10">
        <span className="text-[15px] font-extrabold tracking-tight">OTJ</span>
        <div className="flex gap-6 text-[12px] font-bold text-otj-muted">
          <span className="text-foreground border-b-[1.5px] border-foreground pb-0.5">Explore</span>
          <span>Messages</span>
          <span>Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <BellIcon />
          <Avatar size={32} />
        </div>
      </nav>
      {/* Blurred explore grid */}
      <div className="pt-[56px] px-6 py-6 blur-sm opacity-30 pointer-events-none select-none">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-[18px] border border-border overflow-hidden">
              <div
                className={`h-44 flex items-center justify-center ${
                  ['bg-blue-50', 'bg-purple-50', 'bg-green-50', 'bg-orange-50', 'bg-pink-50', 'bg-yellow-50'][i]
                }`}
              />
              <div className="p-3">
                <div className="h-3 w-24 bg-otj-border rounded mb-1.5" />
                <div className="h-2.5 w-36 bg-otj-light rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-50 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — ONBOARDING STEP 2: YOUR PROFILE
// ══════════════════════════════════════════════════════════════════════════════
function Screen_Step2() {
  return (
    <OBPage step={2}>
      <StepLabel>Step 2 of 7</StepLabel>
      <StepH1>YOUR<br />PROFILE.</StepH1>
      <StepDesc>
        Tell clients who you are. A strong profile gets 3× more briefs than an incomplete one.
      </StepDesc>

      <div className="mb-7">
        <SectionTitle icon={Camera}>Profile Photo</SectionTitle>
        <div className="flex items-center gap-5">
          <div className="w-[88px] h-[88px] rounded-full bg-otj-off border-[2px] border-dashed border-border flex items-center justify-center shrink-0">
            <User size={36} className="text-otj-muted" />
          </div>
          <div>
            <button className="text-[13px] font-bold px-4 py-2.5 rounded-full border-[1.5px] border-border bg-card text-foreground mb-2">
              Upload Photo
            </button>
            <p className="text-[11.5px] text-otj-muted leading-relaxed">
              JPG, PNG · Max 5MB · Recommended 400×400px
            </p>
          </div>
        </div>
      </div>

      <div className="mb-7">
        <SectionTitle icon={PenLine}>Tagline & Bio</SectionTitle>
        <div className="flex flex-col gap-3">
          <div>
            <label className={lbl}>
              Tagline <span className="text-destructive">*</span>{' '}
              <span className="text-otj-muted normal-case font-normal">— 80 chars max</span>
            </label>
            <input className={inp} defaultValue="Fashion & Editorial Photographer based in Cairo" />
            <p className="text-[10.5px] text-otj-muted mt-1">47 / 80 characters</p>
          </div>
          <div>
            <label className={lbl}>
              Bio <span className="text-otj-muted normal-case font-normal">— up to 500 chars</span>
            </label>
            <textarea
              rows={4}
              className={`${inp} resize-none leading-relaxed`}
              defaultValue="I shoot fashion editorials, e-commerce campaigns, and brand lookbooks across Cairo and beyond. With 5 years of editorial experience, I bring a clean, high-end aesthetic to every shoot."
            />
            <p className="text-[10.5px] text-otj-muted mt-1">188 / 500 characters</p>
          </div>
        </div>
      </div>

      <div className="mb-7">
        <SectionTitle icon={Link2}>Links & Social</SectionTitle>
        <div className="flex flex-col gap-2.5">
          {[
            { platform: 'Instagram', value: '@nour.makram', placeholder: '' },
            { platform: 'Portfolio', value: '', placeholder: 'https://your-website.com' },
            { platform: 'Behance', value: '', placeholder: 'https://behance.net/yourname' },
          ].map((link) => (
            <div key={link.platform} className="flex items-center gap-2.5">
              <span className="text-[13px] font-semibold text-otj-text w-[90px] shrink-0">
                {link.platform}
              </span>
              <input className={inp} defaultValue={link.value} placeholder={link.placeholder} />
            </div>
          ))}
          <button className="text-[11.5px] font-semibold text-otj-blue text-left mt-0.5 flex items-center gap-1">
            <Plus size={12} /> Add another link
          </button>
        </div>
      </div>

      <NavButtons />
    </OBPage>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — ONBOARDING STEP 3: PORTFOLIO
// ══════════════════════════════════════════════════════════════════════════════
function Screen_Step3() {
  const filled = [true, true, true, false, false, false];

  return (
    <OBPage step={3}>
      <StepLabel>Step 3 of 7</StepLabel>
      <StepH1>YOUR<br />WORK.</StepH1>
      <StepDesc>
        Upload up to 6 portfolio images. Your best work goes first — clients judge portfolios in
        under 8 seconds.
      </StepDesc>

      <div className="mb-7">
        <SectionTitle icon={Image}>
          Portfolio Images{' '}
          <span className="text-[11px] font-medium text-otj-text">
            {filled.filter(Boolean).length} / 6 uploaded
          </span>
        </SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {filled.map((isOn, i) => (
            <div
              key={i}
              className={`aspect-[4/3] rounded-[14px] border-[1.5px] flex flex-col items-center justify-center overflow-hidden relative cursor-pointer ${
                isOn ? 'border-border' : 'border-dashed border-border bg-card hover:border-foreground'
              }`}
            >
              {isOn ? (
                <>
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${
                      ['bg-blue-50', 'bg-purple-50', 'bg-green-50'][i]
                    }`}
                  >
                    <Camera size={32} className="text-otj-muted/40" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-foreground/75">
                    <p className="text-[10px] font-semibold text-primary-foreground truncate">
                      {['Campaign_01.jpg', 'Editorial_03.jpg', 'Product_shoot.jpg'][i]}
                    </p>
                  </div>
                  <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/70 flex items-center justify-center text-primary-foreground">
                    <X size={10} />
                  </button>
                </>
              ) : (
                <>
                  <Plus size={20} className="text-otj-muted mb-1" />
                  <p className="text-[11px] text-otj-muted font-semibold">Add image</p>
                </>
              )}
            </div>
          ))}
        </div>
        <p className="text-[11.5px] text-otj-muted mt-3 leading-relaxed">
          JPG, PNG, WebP · Max 10MB per file · Min 800×600px · Drag to reorder
        </p>
      </div>

      <div className="mb-7">
        <SectionTitle icon={Film}>
          Featured Video <span className="text-[11px] font-medium text-otj-muted">(optional)</span>
        </SectionTitle>
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] border-[1.5px] border-dashed border-border bg-card cursor-pointer hover:border-foreground">
          <Film size={20} className="text-otj-muted shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-foreground">Add a showreel or behind-the-scenes</p>
            <p className="text-[11px] text-otj-muted">
              YouTube or Vimeo link · Displayed at the top of your profile
            </p>
          </div>
        </div>
      </div>

      <NavButtons />
    </OBPage>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — ONBOARDING STEP 4: PRICING
// ══════════════════════════════════════════════════════════════════════════════
function Screen_Step4() {
  const packages = [
    { name: 'Half-Day Shoot', price: '2000', duration: 'Half day (4hrs)', revisions: '1 round', deliverables: ['10 edited photos', '1 revision round'] },
    { name: 'Full-Day Campaign', price: '3500', duration: 'Full day (8hrs)', revisions: '2 rounds', deliverables: ['25 edited photos', '2 revision rounds', '3 raw video clips'] },
  ];

  return (
    <OBPage step={4}>
      <StepLabel>Step 4 of 7</StepLabel>
      <StepH1>YOUR<br />RATES.</StepH1>
      <StepDesc>
        Set your day rate and packages. Transparent pricing builds trust and converts more briefs.
      </StepDesc>

      <div className="mb-7">
        <SectionTitle icon={DollarSign}>Day Rate</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Day Rate (EGP) <span className="text-destructive">*</span></label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-otj-muted">EGP</span>
              <input type="number" className={`${inp} pl-[52px]`} defaultValue={3500} />
            </div>
          </div>
          <div>
            <label className={lbl}>Experience Level</label>
            <select className={`${inp} appearance-none cursor-pointer`}>
              <option>Mid-level · 3–5 years</option>
              <option>Junior · 0–2 years</option>
              <option>Senior · 5+ years</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-7">
        <SectionTitle icon={Package}>
          Packages <span className="text-[11px] font-medium text-otj-text">— optional but recommended</span>
        </SectionTitle>
        {packages.map((pkg, i) => (
          <div key={i} className="p-4 rounded-[14px] border-[1.5px] border-border bg-card mb-3">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-border">
              <span className="text-[11px] font-bold text-otj-muted uppercase tracking-[0.06em]">Package {i + 1}</span>
              <span className="text-[11px] text-otj-muted cursor-pointer hover:text-destructive">Remove</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-2.5">
              <div>
                <label className={lbl}>Package Name <span className="text-destructive">*</span></label>
                <input className={inp} defaultValue={pkg.name} />
              </div>
              <div>
                <label className={lbl}>Price (EGP) <span className="text-destructive">*</span></label>
                <input type="number" className={inp} defaultValue={pkg.price} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-2.5">
              <div>
                <label className={lbl}>Duration</label>
                <select className={`${inp} appearance-none`}><option>{pkg.duration}</option></select>
              </div>
              <div>
                <label className={lbl}>Revisions</label>
                <select className={`${inp} appearance-none`}><option>{pkg.revisions}</option></select>
              </div>
            </div>
            <div>
              <label className={lbl}>Deliverables</label>
              {pkg.deliverables.map((d, di) => (
                <div key={di} className="flex items-center gap-2 mb-1.5">
                  <span className="text-otj-muted text-xs">•</span>
                  <input defaultValue={d} className="flex-1 px-3 py-2 rounded-lg border border-border bg-otj-off text-[13px] text-foreground outline-none" />
                  <button className="text-otj-muted hover:text-destructive"><X size={11} /></button>
                </div>
              ))}
              <button className="text-[11.5px] font-semibold text-otj-blue mt-0.5 flex items-center gap-1">
                <Plus size={12} /> Add deliverable
              </button>
            </div>
          </div>
        ))}
        <button className="w-full p-3 rounded-[10px] border-[1.5px] border-dashed border-border text-[13px] font-semibold text-otj-text flex items-center justify-center gap-2 hover:border-foreground hover:text-foreground">
          <Plus size={14} /> Add Another Package
        </button>
      </div>

      <div className="mb-7">
        <SectionTitle icon={Wallet}>Payment Preferences</SectionTitle>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className={lbl}>Deposit Required</label>
            <select className={`${inp} appearance-none cursor-pointer`}>
              <option>50% deposit (recommended)</option>
              <option>30% deposit</option>
              <option>100% upfront</option>
            </select>
            <p className="text-[11px] text-otj-muted mt-1 leading-relaxed">OTJ holds deposits in escrow until delivery</p>
          </div>
          <div>
            <label className={lbl}>Lead Time</label>
            <select className={`${inp} appearance-none cursor-pointer`}>
              <option>48 hours</option>
              <option>Same day</option>
              <option>1 week</option>
            </select>
            <p className="text-[11px] text-otj-muted mt-1 leading-relaxed">Minimum notice before a booking starts</p>
          </div>
        </div>
      </div>

      <NavButtons />
    </OBPage>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 4 — ONBOARDING STEP 5: BRIEF QUESTIONS
// ══════════════════════════════════════════════════════════════════════════════
function Screen_Step5() {
  const questions = [
    'What is the shoot purpose or campaign goal?',
    'What mood or aesthetic are you going for?',
    'What is the subject or product being shot?',
    'How many final deliverables do you need?',
    'Where will the content be used? (Social, print, ads…)',
  ];

  return (
    <OBPage step={5}>
      <StepLabel>Step 5 of 7</StepLabel>
      <StepH1>WHAT DO<br />YOU NEED?</StepH1>
      <StepDesc>
        These questions are sent to clients when they book you. Drag to reorder. Add or remove as needed.
      </StepDesc>

      <div className="mb-7">
        <SectionTitle icon={ClipboardList}>
          Brief Questions{' '}
          <span className="text-[11px] font-medium text-otj-text">— clients answer before booking</span>
        </SectionTitle>
        <div className="flex flex-col gap-2">
          {questions.map((q, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-card border-[1.5px] border-border rounded-[10px]">
              <GripVertical size={15} className="text-otj-muted cursor-grab shrink-0" />
              <div className="w-[22px] h-[22px] rounded-md bg-otj-off border border-border flex items-center justify-center text-[10px] font-bold text-otj-muted shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 text-[13px] text-foreground font-medium">{q}</div>
              <button className="text-[11px] text-otj-muted px-2 py-0.5 rounded-md border border-border hover:text-destructive hover:border-destructive">
                Remove
              </button>
            </div>
          ))}
        </div>
        <button className="w-full p-2.5 rounded-[10px] border-[1.5px] border-dashed border-border text-[12.5px] font-semibold text-otj-text flex items-center justify-center gap-1.5 mt-2.5 hover:border-foreground hover:text-foreground">
          <Plus size={13} /> Add Question
        </button>
      </div>

      <NavButtons />
    </OBPage>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 5 — ONBOARDING STEP 6: AVAILABILITY
// ══════════════════════════════════════════════════════════════════════════════
function Screen_Step6() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activeDays = new Set([0, 1, 2, 3, 5]);

  return (
    <OBPage step={6}>
      <StepLabel>Step 6 of 7</StepLabel>
      <StepH1>WHEN DO<br />YOU WORK?</StepH1>
      <StepDesc>
        Set your working days and hours. Clients can only book on available days. You control your calendar.
      </StepDesc>

      <div className="mb-7">
        <SectionTitle icon={Calendar}>Working Days</SectionTitle>
        <div className="grid grid-cols-7 gap-2 mb-5">
          {days.map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted">{d}</div>
              <div
                className={`w-10 h-10 rounded-[10px] border-[1.5px] flex items-center justify-center ${
                  activeDays.has(i)
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-card border-border text-otj-muted'
                }`}
              >
                {activeDays.has(i) ? <Check size={16} /> : <span className="text-xs">—</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <SectionTitle icon={Clock}>Working Hours</SectionTitle>
        <div className="flex flex-col gap-2">
          {[{ label: 'Mon–Thu', start: '09:00', end: '18:00' }, { label: 'Sat', start: '10:00', end: '16:00' }].map((row) => (
            <div key={row.label} className="flex items-center gap-2.5 px-3.5 py-2.5 bg-card border-[1.5px] border-border rounded-[10px]">
              <div className="text-xs font-bold text-foreground w-12 shrink-0">{row.label}</div>
              <input type="time" defaultValue={row.start} className="px-2.5 py-1.5 rounded-lg border border-border bg-otj-off text-xs text-foreground outline-none" />
              <span className="text-[11px] text-otj-muted">to</span>
              <input type="time" defaultValue={row.end} className="px-2.5 py-1.5 rounded-lg border border-border bg-otj-off text-xs text-foreground outline-none" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <SectionTitle icon={BarChart3}>Capacity Settings</SectionTitle>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className={lbl}>Max Bookings per Month</label>
            <select className={`${inp} appearance-none cursor-pointer`}>
              <option>8 bookings</option>
              <option>4 bookings</option>
              <option>12 bookings</option>
              <option>Unlimited</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Travel Radius</label>
            <select className={`${inp} appearance-none cursor-pointer`}>
              <option>Greater Cairo + Giza</option>
              <option>Cairo only</option>
              <option>Anywhere in Egypt</option>
              <option>International</option>
            </select>
          </div>
        </div>
      </div>

      <NavButtons />
    </OBPage>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 6 — ONBOARDING STEP 7: FINAL TOUCHES
// ══════════════════════════════════════════════════════════════════════════════
function Screen_Step7() {
  const notifItems = [
    { label: 'WhatsApp Notifications', desc: 'Booking requests, phase approvals, payment releases via WhatsApp', on: true },
    { label: 'Email Notifications', desc: 'Weekly summary and important account updates via email', on: true },
    { label: 'New Message Alerts', desc: 'Instant notification when a client sends you a message', on: true },
  ];
  const privacyItems = [
    { label: 'Show Pricing on Profile', desc: 'Clients can see your package prices before booking', on: true },
    { label: 'Show Availability Calendar', desc: 'Display your available and booked dates publicly', on: true },
    { label: 'Allow Direct Messages', desc: 'Clients can message you before booking', on: false },
    { label: 'Featured on Explore', desc: 'Appear in recommended sections (OTJ Pro)', on: false },
  ];

  return (
    <OBPage step={7}>
      <StepLabel>Step 7 of 7</StepLabel>
      <StepH1>ALMOST<br />THERE.</StepH1>
      <StepDesc>
        Set your notification preferences and privacy settings. You can always change these later.
      </StepDesc>

      <div className="mb-7">
        <SectionTitle icon={Bell}>Notifications</SectionTitle>
        <div className="rounded-xl overflow-hidden border border-border">
          {notifItems.map((item, i) => (
            <div key={i} className={`flex items-center px-4 py-3.5 bg-card ${i < notifItems.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-foreground tracking-tight">{item.label}</div>
                <div className="text-[11.5px] text-otj-text mt-0.5">{item.desc}</div>
              </div>
              <Toggle on={item.on} />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <SectionTitle icon={Lock}>Privacy & Visibility</SectionTitle>
        <div className="rounded-xl overflow-hidden border border-border">
          {privacyItems.map((item, i) => (
            <div key={i} className={`flex items-center px-4 py-3.5 bg-card ${i < privacyItems.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-foreground tracking-tight">{item.label}</div>
                <div className="text-[11.5px] text-otj-text mt-0.5">{item.desc}</div>
              </div>
              <Toggle on={item.on} />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-7">
        <SectionTitle icon={CreditCard}>Payout Details</SectionTitle>
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className={lbl}>Preferred Payout Method</label>
            <select className={`${inp} appearance-none cursor-pointer`}>
              <option>Vodafone Cash</option>
              <option>InstaPay</option>
              <option>Bank Transfer</option>
              <option>Fawry</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Phone / Account Number</label>
            <input className={inp} placeholder="01X XXXX XXXX" />
          </div>
        </div>
        <div className="text-[11.5px] text-otj-text px-3.5 py-2.5 bg-otj-blue-bg border border-otj-blue-border rounded-lg mt-2 leading-relaxed flex items-start gap-2">
          <Lock size={12} className="text-otj-blue mt-0.5 shrink-0" />
          Payouts are released within 48hrs of project approval. OTJ platform fee: 12%.
        </div>
      </div>

      <NavButtons last />
    </OBPage>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 7 — QUICK BRIEF POPUP: STEP 1
// ══════════════════════════════════════════════════════════════════════════════
function Screen_BriefStep1() {
  return (
    <BookingBg>
      <div className="bg-card rounded-3xl border border-border shadow-[0_32px_80px_rgba(0,0,0,0.18)] w-full max-w-[520px] overflow-hidden">
        <div className="px-[22px] py-4 border-b border-border flex items-center gap-3">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-otj-off flex items-center justify-center shrink-0">
            <User size={26} className="text-otj-muted" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-extrabold tracking-tight text-foreground">Nour Makram</div>
            <div className="text-xs text-otj-text">Fashion Photographer · Cairo · ⭐ 4.9 · 127 jobs · Available</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted">Step 1/2</span>
            <CloseBtn />
          </div>
        </div>

        <div className="px-[22px] py-4 flex flex-col gap-3">
          <div>
            <label className={lbl}>Project Name</label>
            <input type="text" placeholder="e.g. Ramadan Campaign Shoot" className={inp} />
          </div>
          <div>
            <label className={lbl}>Description</label>
            <textarea rows={3} placeholder="Describe your project — mood, deliverables, references…" className={`${inp} resize-none leading-relaxed`} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={lbl}>Date</label>
              <input type="date" className={inp} />
            </div>
            <div>
              <label className={lbl}>Location</label>
              <input type="text" placeholder="e.g. Cairo" className={inp} />
            </div>
          </div>
          <div>
            <label className={lbl}>Budget</label>
            <div className="flex gap-1.5 mb-2">
              {['Fixed', 'Range', 'Negotiate'].map((opt, i) => (
                <button key={opt} className={`flex-1 px-2 py-2 rounded-[10px] border-[1.5px] text-[11.5px] font-bold ${i === 0 ? 'bg-foreground border-foreground text-card' : 'bg-card border-border text-otj-muted'}`}>
                  {opt}
                </button>
              ))}
            </div>
            <input type="number" placeholder="e.g. 3500 EGP" className={inp} />
          </div>
        </div>

        <div className="px-[22px] pb-5">
          <button className="w-full py-3 rounded-full bg-foreground text-card text-sm font-bold flex items-center justify-center gap-2">
            Next: Survey Questions <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </BookingBg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 8 — QUICK BRIEF POPUP: STEP 2
// ══════════════════════════════════════════════════════════════════════════════
function Screen_BriefStep2() {
  const questions = [
    'What is the shoot purpose or campaign goal?',
    'What mood or aesthetic are you going for?',
    'What is the subject or product being shot?',
    'How many final deliverables do you need?',
    'Where will the content be used? (Social, print, ads…)',
  ];

  return (
    <BookingBg>
      <div className="bg-card rounded-3xl border border-border shadow-[0_32px_80px_rgba(0,0,0,0.18)] w-full max-w-[520px] max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-card px-[22px] py-4 border-b border-border flex items-center gap-3 z-10">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-otj-off flex items-center justify-center shrink-0">
            <User size={26} className="text-otj-muted" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-extrabold tracking-tight text-foreground">Nour Makram</div>
            <div className="text-xs text-otj-text">Fashion Photographer · Cairo</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted">Step 2/2</span>
            <CloseBtn />
          </div>
        </div>

        <div className="px-[22px] py-4 flex flex-col gap-3">
          <div className="text-[13px] font-bold tracking-tight text-foreground pb-2.5 border-b border-border flex items-center gap-2">
            <ClipboardList size={14} className="text-otj-muted" />
            Brief Questions{' '}
            <span className="text-[11px] font-medium text-otj-text">— answer for creative</span>
          </div>
          {questions.map((q, i) => (
            <div key={i}>
              <div className="flex items-start gap-2 mb-1.5">
                <div className="w-[22px] h-[22px] rounded-md bg-otj-off border border-border flex items-center justify-center text-[10px] font-bold text-otj-muted shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="text-[12.5px] font-semibold text-foreground leading-snug">{q}</div>
              </div>
              <textarea rows={2} placeholder="Type your answer…" className={`${inp} resize-none leading-relaxed`} />
            </div>
          ))}
        </div>

        <div className="px-[22px] pb-5 flex flex-col gap-2">
          <div className="flex gap-2">
            <button className="flex-1 py-3 rounded-full border-[1.5px] border-border bg-card text-otj-text text-sm font-bold flex items-center justify-center gap-1">
              <ChevronLeft size={15} /> Back
            </button>
            <button className="flex-[2] py-3 rounded-full bg-foreground text-card text-sm font-bold flex items-center justify-center gap-2">
              Send Brief <ChevronRight size={15} />
            </button>
          </div>
          <div className="text-[11px] text-otj-muted text-center flex items-center justify-center gap-1.5">
            <Lock size={11} /> 50% deposit in escrow · Creative has 2hrs to confirm
          </div>
        </div>
      </div>
    </BookingBg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 9 — COUNTER OFFER MODAL
// ══════════════════════════════════════════════════════════════════════════════
function Screen_CounterOffer() {
  return (
    <BookingBg>
      <div className="bg-card rounded-[20px] w-full max-w-[440px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.18)]">
        <div className="px-5 py-[18px] border-b border-border flex items-center justify-between">
          <div className="text-base font-extrabold tracking-tight flex items-center gap-2">
            <ArrowUpDown size={16} /> Send Counter-Offer
          </div>
          <CloseBtn />
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div>
              <label className={lbl}>Price (EGP)</label>
              <input type="number" defaultValue={3200} className={inp} />
            </div>
            <div>
              <label className={lbl}>Timeline (days)</label>
              <input type="number" defaultValue={5} className={inp} />
            </div>
          </div>
          <div className="mb-3">
            <label className={lbl}>Deliverables</label>
            <input placeholder="e.g. 40 photos, 2 revisions" className={inp} />
          </div>
          <div>
            <label className={lbl}>Message (optional)</label>
            <textarea rows={2} defaultValue="Happy to do 3,200 EGP if we can confirm by Friday." className={`${inp} resize-none leading-relaxed`} />
          </div>
        </div>

        <div className="px-5 pb-[18px] flex gap-2">
          <button className="flex-1 py-[9px] px-5 rounded-full border-[1.5px] border-border text-[13px] font-bold text-otj-text hover:border-foreground hover:text-foreground">
            Cancel
          </button>
          <button className="flex-[2] py-[9px] px-5 rounded-full bg-primary text-primary-foreground text-[13px] font-bold flex items-center justify-center gap-2">
            Send Offer <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </BookingBg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 10 — NOTIFICATIONS PANEL
// ══════════════════════════════════════════════════════════════════════════════
function Screen_Notifications() {
  const notifs = [
    { Icon: CheckCircle2, iconClass: 'text-otj-green', bg: 'bg-otj-green-bg', title: 'Counter accepted — Ramadan Campaign', sub: 'Karim accepted 2,800 EGP · 5 days', time: '2m ago', unread: true, titleClass: 'text-otj-green' },
    { Icon: MessageCircle, iconClass: 'text-otj-blue', bg: 'bg-otj-blue-bg', title: 'New message from Sara Ahmed', sub: 'Hey, are you available next Tuesday?', time: '14m ago', unread: true, titleClass: 'text-foreground' },
    { Icon: Banknote, iconClass: 'text-otj-green', bg: 'bg-otj-green-bg', title: 'Payment released — 1,750 EGP', sub: 'Phase 1 approved · E-Commerce Project', time: '1h ago', unread: false, titleClass: 'text-foreground' },
    { Icon: Star, iconClass: 'text-[hsl(var(--otj-yellow))]', bg: 'bg-otj-yellow-bg', title: 'New review from Ahmed Salah', sub: '5 stars · "Exceptional work!"', time: '3h ago', unread: false, titleClass: 'text-foreground' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 inset-x-0 h-[56px] bg-card border-b border-border flex items-center justify-between px-5 z-10">
        <span className="text-[15px] font-extrabold tracking-tight">OTJ</span>
        <div className="flex gap-6 text-[12px] font-bold text-otj-muted">
          <span className="text-foreground border-b-[1.5px] border-foreground pb-0.5">Explore</span>
          <span>Messages</span>
          <span>Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <BellIcon dot />
          <Avatar size={32} />
        </div>
      </nav>

      {/* Blurred background */}
      <div className="pt-[56px] px-6 py-6 blur-sm opacity-25 pointer-events-none select-none">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-[18px] border border-border h-56" />
          ))}
        </div>
      </div>

      {/* Notification panel */}
      <div className="fixed top-16 right-5 z-[300] w-[340px] bg-card border border-border rounded-[18px] shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
        <div className="p-3.5 px-4 border-b border-border flex items-center justify-between">
          <div className="text-[13px] font-extrabold tracking-tight">Notifications</div>
          <button className="text-xs text-otj-muted px-2 py-0.5 rounded-md border border-border hover:text-foreground hover:border-foreground">
            Mark read
          </button>
        </div>

        {/* Featured brief */}
        <div className="mx-2.5 my-2 p-3.5 px-4 bg-[hsl(var(--otj-yellow-bg))] border-[1.5px] border-[hsl(var(--otj-yellow-border))] rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[hsl(var(--otj-yellow))] mb-1.5 flex items-center gap-1.5">
            <ClipboardList size={11} /> New Brief · 5m ago
          </div>
          <div className="text-sm font-extrabold tracking-tight mb-1">ZARA Egypt wants to book you</div>
          <div className="text-xs text-otj-text leading-relaxed mb-2.5">
            Ramadan Campaign Shoot · 3,500 EGP · March 20
          </div>
          <div className="flex gap-1.5">
            <button className="flex-1 py-2 rounded-full text-xs font-bold bg-primary border-[1.5px] border-primary text-primary-foreground">Accept</button>
            <button className="flex-1 py-2 rounded-full text-xs font-bold border-[1.5px] border-[hsl(var(--otj-yellow))] text-[hsl(var(--otj-yellow))] bg-card">Counter</button>
            <button className="flex-1 py-2 rounded-full text-xs font-bold border-[1.5px] border-border bg-card text-otj-muted">Decline</button>
          </div>
        </div>

        {/* List */}
        <div className="py-1 max-h-[320px] overflow-y-auto">
          {notifs.map(({ Icon, iconClass, bg, title, sub, time, unread, titleClass }, i) => (
            <div key={i} className={`px-4 py-2.5 cursor-pointer hover:bg-otj-off transition-colors ${i < notifs.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex items-start gap-2.5">
                <div className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon size={17} className={iconClass} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[12.5px] font-bold tracking-tight mb-px truncate ${titleClass}`}>{title}</div>
                  <div className="text-[11.5px] text-otj-muted leading-snug truncate">{sub}</div>
                  <div className="text-[10.5px] text-otj-muted mt-0.5">{time}</div>
                </div>
                {unread && <div className="w-[7px] h-[7px] rounded-full bg-otj-blue shrink-0 mt-[5px]" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DESIGN EXPORT PAGE
// ══════════════════════════════════════════════════════════════════════════════
const SCREENS = [
  { id: 'step1',   label: 'Step 1 — Who Are You?',     Component: Screen_Step1 },
  { id: 'step2',   label: 'Step 2 — Profile',           Component: Screen_Step2 },
  { id: 'step3',   label: 'Step 3 — Portfolio',         Component: Screen_Step3 },
  { id: 'step4',   label: 'Step 4 — Pricing',           Component: Screen_Step4 },
  { id: 'step5',   label: 'Step 5 — Brief Qs',          Component: Screen_Step5 },
  { id: 'step6',   label: 'Step 6 — Availability',      Component: Screen_Step6 },
  { id: 'step7',   label: 'Step 7 — Final',             Component: Screen_Step7 },
  { id: 'dash-pending', label: 'Dashboard — Getting Booked', Component: Screen_DashPending },
  { id: 'dash-active',  label: 'Dashboard — I Am Hired',     Component: Screen_DashActive },
  { id: 'brief1',  label: 'Brief Popup (Step 1)',        Component: Screen_BriefStep1 },
  { id: 'brief2',  label: 'Brief Popup (Step 2)',        Component: Screen_BriefStep2 },
  { id: 'counter', label: 'Counter Offer',               Component: Screen_CounterOffer },
  { id: 'notifs',  label: 'Notifications',               Component: Screen_Notifications },
];

export default function DesignExport() {
  const [idx, setIdx] = useState(0);
  const { Component } = SCREENS[idx];

  return (
    <div>
      {/* Floating control strip */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-foreground/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-xl">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="w-7 h-7 rounded-full bg-primary-foreground/10 text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:bg-primary-foreground/20"
        >
          <ChevronLeft size={14} />
        </button>
        <select
          value={idx}
          onChange={(e) => setIdx(Number(e.target.value))}
          className="bg-transparent text-primary-foreground text-[11px] font-bold outline-none cursor-pointer"
          style={{ maxWidth: 200 }}
        >
          {SCREENS.map((s, i) => (
            <option key={s.id} value={i} className="text-foreground bg-card">
              {i + 1}. {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setIdx((i) => Math.min(SCREENS.length - 1, i + 1))}
          disabled={idx === SCREENS.length - 1}
          className="w-7 h-7 rounded-full bg-primary-foreground/10 text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:bg-primary-foreground/20"
        >
          <ChevronRight size={14} />
        </button>
        <span className="text-[10px] text-primary-foreground/50 ml-1">
          {idx + 1}/{SCREENS.length}
        </span>
      </div>

      <Component />
    </div>
  );
}
