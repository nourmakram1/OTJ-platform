/**
 * DashboardPreview.tsx
 * Standalone dashboard state preview for Figma captures.
 * URL: /dashboard-preview?state=empty|pending|active|complete
 */
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Star, PartyPopper, Zap, X } from 'lucide-react';

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_PENDING = [
  {
    id: 'b1',
    icon: '📸',
    name: 'Ramadan Campaign Shoot',
    clientName: 'Ahmed Hassan',
    clientCompany: 'BrandCo Egypt',
    tags: ['Photography', 'Lifestyle', 'Ramadan'],
    time: '2h ago',
    myRole: 'as-creative' as const,
  },
  {
    id: 'b2',
    icon: '🎥',
    name: 'Product Launch Video',
    clientName: 'Sara Kamel',
    clientCompany: 'Nova Tech',
    tags: ['Video', 'Motion', 'B2B'],
    time: '5h ago',
    myRole: 'as-creative' as const,
  },
  {
    id: 'b3',
    icon: '🎨',
    name: 'Social Media Pack',
    clientName: 'Dina Mostafa',
    clientCompany: 'Bloom Agency',
    tags: ['Design', 'Social', 'Branding'],
    time: '1d ago',
    myRole: 'as-creative' as const,
  },
];

const MOCK_ACTIVE = [
  {
    id: 'p1',
    icon: '📸',
    name: 'Fashion Week Editorial',
    clientName: 'Layla Nour',
    clientCompany: 'Vogue Arabia',
    myRole: 'as-creative' as const,
    phases: [
      { num: 1, title: 'Concept', status: 'complete' as const },
      { num: 2, title: 'Shoot', status: 'active' as const },
      { num: 3, title: 'Edit', status: 'locked' as const },
      { num: 4, title: 'Delivery', status: 'locked' as const },
    ],
    statusLabel: 'Phase 2 · Shoot',
    statusClass: 'bg-otj-blue-bg text-otj-blue',
    deadline: 'Apr 15',
    budget: 'EGP 12,000',
    pct: 25,
  },
  {
    id: 'p2',
    icon: '🎥',
    name: 'Brand Awareness TVC',
    clientName: 'Omar Fawzi',
    clientCompany: 'Telecom Egypt',
    myRole: 'as-creative' as const,
    phases: [
      { num: 1, title: 'Pre-prod', status: 'complete' as const },
      { num: 2, title: 'Shoot', status: 'complete' as const },
      { num: 3, title: 'Post', status: 'active' as const },
      { num: 4, title: 'Delivery', status: 'locked' as const },
    ],
    statusLabel: 'Phase 3 · Post Production',
    statusClass: 'bg-otj-blue-bg text-otj-blue',
    deadline: 'Mar 28',
    budget: 'EGP 32,000',
    pct: 60,
  },
];

const MOCK_COMPLETE = [
  { id: 'c1', icon: '🎨', name: 'Eid Collection Lookbook', client: 'Zara Egypt', earned: 'EGP 8,000' },
  { id: 'c2', icon: '📸', name: 'Startup Brand Identity', client: 'Fintech Cairo', earned: 'EGP 15,500' },
  { id: 'c3', icon: '🎥', name: 'Documentary Short Film', client: 'NatGeo MENA', earned: 'EGP 22,000' },
];

// ── Banners ──────────────────────────────────────────────────────────────

const ProfileBanner = ({ onDismiss }: { onDismiss: () => void }) => (
  <div className="bg-otj-blue-bg border border-otj-blue-border rounded-[14px] p-3.5 px-4 mb-3 flex items-center gap-3">
    <div className="flex-1 min-w-0">
      <div className="text-[13px] font-extrabold tracking-[-0.02em] text-foreground mb-0.5">Complete your profile</div>
      <div className="text-[11.5px] text-otj-text mb-2">You're 75% done — add your portfolio to attract more clients.</div>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex-1 h-1.5 bg-otj-light rounded-full overflow-hidden">
          <div className="h-full bg-otj-blue rounded-full" style={{ width: '75%' }} />
        </div>
        <span className="text-[11px] font-extrabold text-otj-blue shrink-0">75%</span>
      </div>
    </div>
    <div className="flex flex-col items-end gap-2 shrink-0">
      <button onClick={onDismiss} className="w-6 h-6 rounded-full bg-card/70 flex items-center justify-center cursor-pointer hover:bg-card">
        <X size={12} className="text-otj-muted" />
      </button>
      <button className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full bg-otj-blue text-white cursor-pointer hover:opacity-90 whitespace-nowrap">Complete Now</button>
    </div>
  </div>
);

const SubscribeBanner = ({ variant, onDismiss }: { variant: 'paid' | 'free'; onDismiss: () => void }) => (
  <div className="bg-gradient-to-r from-[#f8f0ff] to-[#f0f7ff] border border-[#e9d5ff] rounded-[14px] p-3.5 px-4 mb-5 flex items-center gap-3">
    <div className="text-2xl shrink-0">⚡</div>
    <div className="flex-1 min-w-0">
      {variant === 'paid' ? (
        <>
          <div className="text-[13px] font-extrabold tracking-[-0.02em] text-foreground mb-0.5">Unlock unlimited projects</div>
          <div className="text-[11.5px] text-otj-text">Subscribe to OTJ Pro for only <span className="font-extrabold text-foreground">$249/year</span> — grow your creative business.</div>
        </>
      ) : (
        <>
          <div className="text-[13px] font-extrabold tracking-[-0.02em] text-foreground mb-0.5">You have 2 free project workspaces</div>
          <div className="text-[11.5px] text-otj-text">Start your first project for free. Upgrade anytime to unlock unlimited workspaces.</div>
        </>
      )}
    </div>
    <div className="flex flex-col items-end gap-2 shrink-0">
      <button onClick={onDismiss} className="w-6 h-6 rounded-full bg-card/70 flex items-center justify-center cursor-pointer hover:bg-card">
        <X size={12} className="text-otj-muted" />
      </button>
      <button className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 whitespace-nowrap">
        {variant === 'paid' ? 'Subscribe Now' : 'Start Free'}
      </button>
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────

const DashboardPreview = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const state = (searchParams.get('state') ?? 'empty') as 'empty' | 'pending' | 'active' | 'complete';
  const subscribe = (searchParams.get('subscribe') ?? 'paid') as 'paid' | 'free';

  const [projectTab, setProjectTab] = useState<'pending' | 'active' | 'complete'>(
    state === 'active' ? 'active' : state === 'complete' ? 'complete' : 'pending'
  );
  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const [showSubscribeBanner, setShowSubscribeBanner] = useState(true);

  const pendingBriefs = state === 'pending' ? MOCK_PENDING : state === 'empty' ? [] : MOCK_PENDING.slice(0, 1);
  const activeProjects = state === 'active' ? MOCK_ACTIVE : state === 'complete' ? [] : state === 'pending' ? [] : [];
  const completedProjects = state === 'complete' ? MOCK_COMPLETE : [];

  return (
    <>
      <NavBar
        onAcceptBrief={() => {}}
        onOpenCounter={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
      />
      <div className="min-h-screen pt-[52px]">
        <div className="max-w-[1100px] mx-auto p-4 md:p-6 pb-20 md:pb-6">

          {/* Welcome header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
            <div>
              <div className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.04em]">Good morning, Nour</div>
              <div className="text-[12px] md:text-[13px] text-otj-text mt-0.5">
                Monday, March 2 · {pendingBriefs.length > 0 ? `${pendingBriefs.length} briefs need your attention` : 'All caught up!'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-[12px] font-bold">
                <Star size={12} className="fill-current text-otj-yellow" />
                <span className="text-muted-foreground">4.9</span>
                <span className="text-otj-muted font-medium">(127)</span>
              </div>
              <button className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer active:scale-95">Share Profile</button>
            </div>
          </div>

          {/* Banners */}
          {showProfileBanner && <ProfileBanner onDismiss={() => setShowProfileBanner(false)} />}
          {showSubscribeBanner && <SubscribeBanner variant={subscribe} onDismiss={() => setShowSubscribeBanner(false)} />}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
            {[
              { label: 'Hired Projects', val: String(activeProjects.filter(p => (p.myRole as string) !== 'as-client').length), delta: activeProjects.length > 0 ? 'Working on' : 'None yet', deltaClass: 'text-otj-green' },
              { label: 'My Bookings', val: '0', delta: 'None yet', deltaClass: 'text-otj-blue' },
              { label: 'Revenue (Mar)', val: state === 'empty' ? '—' : '14K', delta: state === 'empty' ? 'No data yet' : '↑ 23% vs Feb', deltaClass: 'text-otj-green' },
              { label: 'Pending Briefs', val: String(pendingBriefs.length), delta: pendingBriefs.length > 0 ? 'Need response' : 'All clear', deltaClass: 'text-otj-text' },
            ].map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4 hover:shadow-sm transition-shadow">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">{s.label}</div>
                <div className="text-[26px] font-extrabold tracking-[-0.05em] leading-none text-foreground">{s.val}</div>
                <div className={`text-[11px] font-bold mt-1 ${s.deltaClass}`}>{s.delta}</div>
              </div>
            ))}
          </div>

          {/* Projects with tabs */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-lg font-extrabold tracking-[-0.04em]">Projects</div>
                <div className="flex gap-1 ml-0 md:ml-3 overflow-x-auto hide-scrollbar">
                  {[
                    { key: 'pending' as const, label: `Pending (${pendingBriefs.length})` },
                    { key: 'active' as const, label: `Active (${activeProjects.length})` },
                    { key: 'complete' as const, label: `Complete (${completedProjects.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setProjectTab(tab.key)}
                      className={`text-[12px] font-semibold px-3.5 py-[5px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 active:scale-95 ${
                        projectTab === tab.key ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-otj-text hover:border-foreground'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending tab */}
            {projectTab === 'pending' && (
              <div className="flex flex-col gap-2 animate-fade-up">
                {pendingBriefs.length === 0 && (
                  <div className="bg-card border border-border rounded-[14px] p-10 text-center flex flex-col items-center gap-2">
                    <PartyPopper size={40} className="text-otj-muted" />
                    <div className="text-[14px] font-extrabold text-foreground">No pending briefs!</div>
                    <div className="text-[12px] text-muted-foreground max-w-[260px]">You're all caught up — sit back and relax until the next opportunity rolls in.</div>
                  </div>
                )}
                {pendingBriefs.map((brief) => (
                  <div key={brief.id} className="bg-card border border-border rounded-[14px] p-3.5 px-4 transition-all duration-150 flex flex-col md:flex-row md:items-center gap-3 hover:shadow-md hover:border-otj-muted">
                    <div className="flex gap-3 items-start flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-[10px] bg-otj-yellow-bg flex items-center justify-center text-xl shrink-0">{brief.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-extrabold tracking-[-0.02em] truncate mb-0.5 flex items-center gap-1.5">
                          {brief.name}
                          <span className="text-[9px] font-bold px-1.5 py-[1px] rounded-full border shrink-0 bg-otj-green-bg text-otj-green border-otj-green-border">Hired</span>
                        </div>
                        <div className="text-[11.5px] text-otj-text mb-1.5">From: {brief.clientName} · {brief.clientCompany}</div>
                        <div className="flex gap-[5px] flex-wrap">
                          {brief.tags.map((t, j) => <span key={j} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-otj-off border border-border text-otj-text">{t}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0">
                      <div className="text-[10.5px] text-otj-muted whitespace-nowrap">{brief.time}</div>
                      <div className="flex items-center gap-[5px]">
                        <button className="text-[11.5px] font-bold px-3 py-[5px] rounded-full bg-primary border-[1.5px] border-primary text-primary-foreground cursor-pointer whitespace-nowrap">View Brief</button>
                        <button className="text-[11.5px] font-bold px-3 py-[5px] rounded-full border-[1.5px] border-border bg-card text-muted-foreground cursor-pointer whitespace-nowrap">Decline</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Active tab */}
            {projectTab === 'active' && (
              <div className="flex flex-col gap-2 animate-fade-up">
                {activeProjects.length === 0 && (
                  <div className="bg-card border border-border rounded-[14px] p-10 text-center flex flex-col items-center gap-2">
                    <Zap size={40} className="text-otj-muted" />
                    <div className="text-[14px] font-extrabold text-foreground">No active projects yet</div>
                    <div className="text-[12px] text-muted-foreground max-w-[260px]">Accept a brief and watch the magic begin!</div>
                  </div>
                )}
                {activeProjects.map((proj) => (
                  <div key={proj.id} onClick={() => navigate(`/project/${proj.id}`)} className="bg-card border border-border rounded-[14px] p-3.5 px-4 cursor-pointer transition-all duration-150 flex gap-3 items-start hover:shadow-md hover:border-otj-muted">
                    <div className="w-10 h-10 rounded-[10px] bg-otj-off flex items-center justify-center text-xl shrink-0">{proj.icon}</div>
                    <div className="flex-1">
                      <div className="text-[13.5px] font-extrabold tracking-[-0.02em] mb-0.5 flex items-center gap-1.5">
                        {proj.name}
                        <span className="text-[9px] font-bold px-1.5 py-[1px] rounded-full border shrink-0 bg-otj-green-bg text-otj-green border-otj-green-border">Hired</span>
                      </div>
                      <div className="text-[11.5px] text-otj-text mb-1.5">Client: {proj.clientName} · {proj.clientCompany}</div>
                      <div className="flex gap-[3px] mb-1.5">
                        {proj.phases.map((phase) => (
                          <div key={phase.num} className={`h-1 flex-1 rounded-full ${
                            phase.status === 'complete' ? 'bg-otj-green' :
                            phase.status === 'active' ? 'bg-otj-blue' : 'bg-otj-light'
                          }`} />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${proj.statusClass}`}>{proj.statusLabel}</div>
                        <div className="text-[10.5px] text-otj-muted">Due {proj.deadline}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-extrabold text-foreground">{proj.pct}%</div>
                      <div className="text-[11px] text-otj-text mt-0.5">{proj.budget}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Complete tab */}
            {projectTab === 'complete' && (
              <div className="flex flex-col gap-2 animate-fade-up">
                {completedProjects.length === 0 && (
                  <div className="bg-card border border-border rounded-[14px] p-10 text-center flex flex-col items-center gap-2">
                    <div className="text-[48px]">✨</div>
                    <div className="text-[14px] font-extrabold text-foreground">No completed projects yet</div>
                    <div className="text-[12px] text-muted-foreground max-w-[260px]">Your finished masterpieces will live here — keep creating amazing work!</div>
                  </div>
                )}
                {completedProjects.map((proj, i) => (
                  <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4 flex flex-col md:flex-row gap-2 md:gap-3 md:items-center cursor-pointer transition-all duration-150 hover:shadow-md hover:border-otj-muted">
                    <div className="flex gap-3 items-center flex-1">
                      <div className="w-10 h-10 rounded-[10px] bg-otj-green-bg flex items-center justify-center text-xl shrink-0">{proj.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-extrabold tracking-[-0.02em] mb-0.5 truncate">{proj.name}</div>
                        <div className="text-[11.5px] text-otj-text">{proj.client}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border whitespace-nowrap">✓ Complete</span>
                      <div className="text-[13px] font-extrabold text-otj-green whitespace-nowrap">Earned {proj.earned}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collections */}
          <div className="mb-5">
            <div className="flex items-baseline justify-between mb-3">
              <div className="text-lg font-extrabold tracking-[-0.04em]">My Collections</div>
              <div className="text-xs font-semibold text-otj-text underline underline-offset-[3px] cursor-pointer">View all</div>
            </div>
            {state === 'empty' ? (
              <div className="border-[1.5px] border-dashed border-border rounded-[14px] p-8 flex flex-col items-center gap-2 text-center">
                <div className="text-3xl">🗂️</div>
                <div className="text-[13px] font-extrabold text-foreground">No collections yet</div>
                <div className="text-[12px] text-muted-foreground max-w-[260px]">Save creatives to boards to organise your projects and campaigns.</div>
                <button className="mt-1 text-[11.5px] font-bold px-4 py-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">Create Board</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { name: 'Ramadan Campaign', count: '4 creatives saved', icons: ['👩‍🎨', '✏️', '🎥', '🎨'] },
                  { name: 'Product Launch', count: '2 creatives saved', icons: ['🎥', '🎨', '', ''] },
                  { name: 'Fashion Week', count: '3 creatives saved', icons: ['👗', '📸', '💄', ''] },
                ].map((coll, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:border-foreground">
                    <div className="grid grid-cols-2 h-[60px]">
                      {coll.icons.map((ic, j) => <div key={j} className="flex items-center justify-center text-[18px] bg-otj-off border-r border-b border-border last:border-r-0">{ic}</div>)}
                    </div>
                    <div className="p-2 px-2.5">
                      <div className="text-xs font-extrabold tracking-[-0.02em] mb-px">{coll.name}</div>
                      <div className="text-[10.5px] text-otj-text">{coll.count}</div>
                    </div>
                  </div>
                ))}
                <div className="border-[1.5px] border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 min-h-[96px] cursor-pointer hover:border-foreground">
                  <div className="text-2xl">＋</div>
                  <div className="text-[11px] font-semibold text-otj-text">New Board</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default DashboardPreview;
