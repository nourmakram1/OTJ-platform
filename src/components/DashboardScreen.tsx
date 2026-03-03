import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from './Toast';

interface DashboardScreenProps {
  onOpenBrief: () => void;
  onAcceptBrief: () => void;
  onOpenCounter: () => void;
  onSwitchToMessages: () => void;
}

const pendingBriefs = [
  { icon: '📸', name: 'Ramadan Campaign Shoot', client: 'From: Randa Hatem · Edita Group', tags: ['Full Day', '3,500 EGP', 'Mar 15'], time: '3m ago' },
  { icon: '📸', name: 'Product Launch Photography', client: 'From: Tarek Saad · Vodafone Egypt', tags: ['3 Days', 'Negotiable', 'Mar 22–24'], time: '1h ago' },
];

const activeProjects = [
  { icon: '📸', name: 'Edita Re-Branding', client: 'Client: Randa Hatem · Edita Group', phases: [true, false, false, false], status: 'Phase 2 · Shoot Day', statusClass: 'bg-otj-blue-bg text-otj-blue', due: 'Due Mar 20', pct: '60%', value: '3,500 EGP' },
  { icon: '🎥', name: 'CIB Campaign Assets', client: 'Client: Ahmed Karim · CIB', phases: [true, true, false, false], status: 'Phase 3 · Pending Approval', statusClass: 'bg-otj-yellow-bg text-otj-yellow', due: 'Due Mar 25', pct: '75%', value: '5,200 EGP' },
  { icon: '📸', name: 'Vodafone Brand Refresh', client: 'Client: Tarek Saad · Vodafone', phases: [false, false, false, false], status: 'Phase 1 · Pre-Production', statusClass: 'bg-otj-blue-bg text-otj-blue', due: 'Due Apr 5', pct: '15%', value: '4,800 EGP' },
];

const completedProjects = [
  { icon: '📸', name: 'Pepsi Ramadan Campaign', client: 'Completed Feb 10', earned: '3,500 EGP' },
  { icon: '🎥', name: 'OPPO Brand Launch Video', client: 'Completed Feb 2', earned: '5,200 EGP' },
  { icon: '👗', name: 'Cairo Fashion Week SS26', client: 'Completed Jan 25', earned: '6,000 EGP' },
  { icon: '📸', name: 'Edita Product Shoot Q4', client: 'Completed Jan 14', earned: '2,800 EGP' },
  { icon: '📱', name: 'Juhayna Social Campaign', client: 'Completed Jan 7', earned: '4,100 EGP' },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onOpenBrief, onAcceptBrief, onOpenCounter, onSwitchToMessages }) => {
  const navigate = useNavigate();
  const [projectTab, setProjectTab] = useState<'pending' | 'active' | 'complete'>('pending');

  return (
    <div className="max-w-[1100px] mx-auto p-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[22px] font-extrabold tracking-[-0.04em]">Good morning, Nour 👋</div>
          <div className="text-[13px] text-otj-text mt-0.5">Monday, March 2 · 3 things need your attention today</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => showToast('Opening export…')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border-[1.5px] border-border bg-transparent text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">↓ Export</button>
          <button onClick={onOpenBrief} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer">+ New Brief</button>
        </div>
      </div>

      {/* Stats — 5 cards */}
      <div className="grid grid-cols-5 gap-2 mb-5">
        {[
          { label: 'Active Projects', val: '3', color: 'text-otj-blue', delta: '↑ 1 this week', deltaClass: 'text-otj-green' },
          { label: 'Pending Briefs', val: '2', color: 'text-otj-yellow', delta: 'Need response', deltaClass: 'text-otj-text' },
          { label: 'Revenue (Mar)', val: '14K', color: '', delta: '↑ 23% vs Feb', deltaClass: 'text-otj-green' },
          { label: 'Complete', val: '20', color: 'text-otj-green', delta: 'Total projects', deltaClass: 'text-otj-text' },
          { label: 'Rating', val: '4.9', color: '', delta: '127 reviews', deltaClass: 'text-otj-green' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">{s.label}</div>
            <div className={`text-[26px] font-extrabold tracking-[-0.05em] leading-none ${s.color}`}>{s.val}</div>
            <div className={`text-[11px] font-bold mt-1 ${s.deltaClass}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Projects with tabs */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-lg font-extrabold tracking-[-0.04em]">Projects</div>
            <div className="flex gap-1 ml-3">
              {[
                { key: 'pending' as const, label: `Pending (${pendingBriefs.length})` },
                { key: 'active' as const, label: `Active (${activeProjects.length})` },
                { key: 'complete' as const, label: 'Complete (20)' },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setProjectTab(tab.key)} className={`text-[12px] font-semibold px-3.5 py-[5px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 ${
                  projectTab === tab.key ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-otj-text hover:border-foreground'
                }`}>{tab.label}</button>
              ))}
            </div>
          </div>
          <div className="text-xs font-semibold text-otj-text underline underline-offset-[3px] cursor-pointer">View all</div>
        </div>

        {projectTab === 'pending' && (
          <div className="flex flex-col gap-2 animate-fade-up">
            {pendingBriefs.map((brief, i) => (
              <div key={i} onClick={onSwitchToMessages} className="bg-card border border-border rounded-[14px] p-3.5 px-4 cursor-pointer transition-all duration-150 flex gap-3 items-start hover:shadow-md hover:border-otj-muted">
                <div className="w-10 h-10 rounded-[10px] bg-otj-yellow-bg flex items-center justify-center text-xl shrink-0">{brief.icon}</div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-extrabold tracking-[-0.02em] mb-0.5">{brief.name}</div>
                  <div className="text-[11.5px] text-otj-text mb-1.5">{brief.client}</div>
                  <div className="flex gap-[5px] flex-wrap mb-2">
                    {brief.tags.map((t, j) => <span key={j} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-otj-off border border-border text-otj-text">{t}</span>)}
                  </div>
                  <div className="flex gap-[5px]">
                    <button onClick={(e) => { e.stopPropagation(); onAcceptBrief(); }} className="text-[11.5px] font-bold px-3 py-[5px] rounded-full bg-primary border-[1.5px] border-primary text-primary-foreground cursor-pointer transition-all duration-150">✓ Accept</button>
                    <button onClick={(e) => { e.stopPropagation(); onOpenCounter(); }} className="text-[11.5px] font-bold px-3 py-[5px] rounded-full border-[1.5px] border-otj-yellow text-otj-yellow bg-card cursor-pointer transition-all duration-150">↕ Counter</button>
                    <button onClick={(e) => { e.stopPropagation(); onSwitchToMessages(); }} className="text-[11.5px] font-bold px-3 py-[5px] rounded-full border-[1.5px] border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground">View Brief</button>
                  </div>
                </div>
                <div className="text-[10.5px] text-otj-muted whitespace-nowrap shrink-0">{brief.time}</div>
              </div>
            ))}
          </div>
        )}

        {projectTab === 'active' && (
          <div className="flex flex-col gap-2 animate-fade-up">
            {activeProjects.map((proj, i) => (
              <div key={i} onClick={() => navigate('/project/1')} className="bg-card border border-border rounded-[14px] p-3.5 px-4 cursor-pointer transition-all duration-150 flex gap-3 items-start hover:shadow-md hover:border-otj-muted">
                <div className="w-10 h-10 rounded-[10px] bg-otj-off flex items-center justify-center text-xl shrink-0">{proj.icon}</div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-extrabold tracking-[-0.02em] mb-0.5">{proj.name}</div>
                  <div className="text-[11.5px] text-otj-text mb-1.5">{proj.client}</div>
                  <div className="flex gap-[3px] mb-1.5">
                    {proj.phases.map((done, j) => (
                      <div key={j} className={`h-1 flex-1 rounded-full ${
                        done ? 'bg-otj-green' :
                        j === proj.phases.filter(Boolean).length ? 'bg-otj-blue' : 'bg-otj-light'
                      }`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${proj.statusClass}`}>{proj.status}</div>
                    <div className="text-[10.5px] text-otj-muted">{proj.due}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-extrabold text-foreground">{proj.pct}</div>
                  <div className="text-[11px] text-otj-text mt-0.5">{proj.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {projectTab === 'complete' && (
          <div className="flex flex-col gap-2 animate-fade-up">
            {completedProjects.map((proj, i) => (
              <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4 flex gap-3 items-center cursor-pointer transition-all duration-150 hover:shadow-md hover:border-otj-muted">
                <div className="w-10 h-10 rounded-[10px] bg-otj-green-bg flex items-center justify-center text-xl shrink-0">{proj.icon}</div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-extrabold tracking-[-0.02em] mb-0.5">{proj.name}</div>
                  <div className="text-[11.5px] text-otj-text">{proj.client}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">✓ Complete</span>
                  <div className="text-[13px] font-extrabold text-otj-green">Earned {proj.earned}</div>
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
          <div className="text-xs font-semibold text-otj-text underline underline-offset-[3px] cursor-pointer" onClick={() => showToast('Opening all boards…')}>View all</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: 'Ramadan Campaign', count: '4 creatives saved', icons: ['👩‍🎨', '✏️', '🎥', '🎨'] },
            { name: 'Product Launch', count: '2 creatives saved', icons: ['🎥', '🎨', '', ''] },
            { name: 'Fashion Week', count: '3 creatives saved', icons: ['👗', '📸', '💄', ''] },
          ].map((coll, i) => (
            <div key={i} onClick={() => showToast(`Opening ${coll.name} board…`)} className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:border-foreground">
              <div className="grid grid-cols-2 h-[60px]">
                {coll.icons.map((ic, j) => <div key={j} className="flex items-center justify-center text-[18px] bg-otj-off border-r border-b border-border last:border-r-0">{ic}</div>)}
              </div>
              <div className="p-2 px-2.5">
                <div className="text-xs font-extrabold tracking-[-0.02em] mb-px">{coll.name}</div>
                <div className="text-[10.5px] text-otj-text">{coll.count}</div>
              </div>
            </div>
          ))}
          <div onClick={() => showToast('Create new board…')} className="border-[1.5px] border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 min-h-[96px] cursor-pointer hover:border-foreground">
            <div className="text-2xl">＋</div>
            <div className="text-[11px] font-semibold text-otj-text">New Board</div>
          </div>
        </div>
      </div>
    </div>
  );
};
