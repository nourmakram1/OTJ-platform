import React from 'react';
import { showToast } from './Toast';

interface DashboardScreenProps {
  onOpenBrief: () => void;
  onAcceptBrief: () => void;
  onOpenCounter: () => void;
  onSwitchToMessages: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onOpenBrief, onAcceptBrief, onOpenCounter, onSwitchToMessages }) => {
  return (
    <div className="grid grid-cols-[64px_1fr_300px] h-[calc(100vh-52px)]">
      {/* Icon sidebar */}
      <div className="bg-card border-r border-border flex flex-col items-center py-4 gap-1">
        {[
          { icon: '🏠', active: true },
          { icon: '🔍', active: false },
          { icon: '💬', active: false, badge: true },
          { icon: '🔔', active: false },
        ].map((item, i) => (
          <div key={i} className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-lg cursor-pointer transition-all duration-150 relative ${item.active ? 'bg-primary' : 'hover:bg-otj-off'}`}>
            <span className={item.active ? 'invert' : ''}>{item.icon}</span>
            {item.badge && <div className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full bg-destructive border-2 border-card" />}
          </div>
        ))}
        <div className="flex-1" />
        <div className="w-9 h-9 rounded-full bg-otj-off flex items-center justify-center text-lg cursor-pointer border-2 border-border">👩‍🎨</div>
      </div>

      {/* Main content */}
      <div className="overflow-y-auto p-6">
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

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { label: 'Active Projects', val: '3', color: 'text-otj-blue', delta: '↑ 1 this week', deltaClass: 'text-otj-green' },
            { label: 'Pending Briefs', val: '2', color: 'text-otj-yellow', delta: 'Need response', deltaClass: 'text-otj-text' },
            { label: 'Revenue (Mar)', val: '14K', color: '', delta: '↑ 23% vs Feb', deltaClass: 'text-otj-green' },
            { label: 'Rating', val: '4.9', color: '', delta: '127 reviews', deltaClass: 'text-otj-green' },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">{s.label}</div>
              <div className={`text-[26px] font-extrabold tracking-[-0.05em] leading-none ${s.color}`}>{s.val}</div>
              <div className={`text-[11px] font-bold mt-1 ${s.deltaClass}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Brief Inbox */}
        <div className="bg-card border border-border rounded-[14px] mb-3.5 overflow-hidden">
          <div className="p-3 px-4 border-b border-border flex items-center justify-between">
            <div className="text-[13px] font-extrabold tracking-[-0.02em] flex items-center gap-2">
              Brief Inbox <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-otj-yellow-bg text-otj-yellow border border-otj-yellow-border">2 new</span>
            </div>
            <div className="text-xs font-semibold text-otj-text underline underline-offset-[3px] cursor-pointer">View all</div>
          </div>
          {[
            { emoji: '👩‍💼', from: 'Randa Hatem · Edita Group', brief: 'Full day campaign shoot for Ramadan collection. 40 product + lifestyle shots. March 15, Cairo studio.', tags: ['📸 Photography', 'Full Day', '3,500 EGP', 'Mar 15'], time: '3m ago' },
            { emoji: '👨‍💼', from: 'Tarek Saad · Vodafone Egypt', brief: 'Product launch event photography — 3 days, 120 shots minimum. Budget negotiable.', tags: ['📸 Photography', '3 Days', 'Negotiable', 'Mar 22–24'], time: '1h ago' },
          ].map((item, i) => (
            <div key={i} onClick={onSwitchToMessages} className="p-3 px-4 border-b border-border flex gap-3 items-start cursor-pointer transition-colors duration-150 hover:bg-otj-off last:border-b-0">
              <div className="w-[38px] h-[38px] rounded-full bg-otj-off flex items-center justify-center text-xl shrink-0">{item.emoji}</div>
              <div className="flex-1">
                <div className="text-xs font-bold mb-px">{item.from}</div>
                <div className="text-xs text-otj-text mb-1.5 leading-snug">{item.brief}</div>
                <div className="flex gap-[5px] flex-wrap">
                  {item.tags.map((t, j) => <span key={j} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-otj-off border border-border text-otj-text">{t}</span>)}
                </div>
                <div className="flex gap-[5px] mt-2">
                  <button onClick={(e) => { e.stopPropagation(); onAcceptBrief(); }} className="text-[11.5px] font-bold px-3 py-[5px] rounded-full bg-primary border-[1.5px] border-primary text-primary-foreground cursor-pointer transition-all duration-150">✓ Accept</button>
                  <button onClick={(e) => { e.stopPropagation(); onOpenCounter(); }} className="text-[11.5px] font-bold px-3 py-[5px] rounded-full border-[1.5px] border-otj-yellow text-otj-yellow bg-card cursor-pointer transition-all duration-150">↕ Counter</button>
                  <button onClick={(e) => { e.stopPropagation(); onSwitchToMessages(); }} className="text-[11.5px] font-bold px-3 py-[5px] rounded-full border-[1.5px] border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground">View Brief</button>
                </div>
              </div>
              <div className="text-[10.5px] text-otj-muted whitespace-nowrap shrink-0">{item.time}</div>
            </div>
          ))}
        </div>

        {/* Active Projects */}
        <div className="flex items-baseline justify-between mb-3 mt-5">
          <div className="text-lg font-extrabold tracking-[-0.04em]">Active Projects</div>
          <div className="text-xs font-semibold text-otj-text underline underline-offset-[3px] cursor-pointer">View all</div>
        </div>
        {[
          { icon: '📸', name: 'Edita Re-Branding', client: 'Client: Randa Hatem · Edita Group', phases: [true, false, false, false], status: 'Phase 2 · Shoot Day', statusClass: 'bg-otj-blue-bg text-otj-blue', due: 'Due Mar 20', pct: '60%' },
          { icon: '🎥', name: 'CIB Campaign Assets', client: 'Client: Ahmed Karim · CIB', phases: [true, true, false, false], status: 'Phase 3 · Pending Approval', statusClass: 'bg-otj-yellow-bg text-otj-yellow', due: 'Due Mar 25', pct: '75%' },
        ].map((proj, i) => (
          <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4 mb-2 cursor-pointer transition-all duration-150 flex gap-3 items-start hover:shadow-md hover:border-otj-muted">
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
            <div className="text-[13px] font-extrabold text-foreground whitespace-nowrap">{proj.pct}</div>
          </div>
        ))}

        {/* Collections */}
        <div className="flex items-baseline justify-between mb-3 mt-5">
          <div className="text-lg font-extrabold tracking-[-0.04em]">My Collections</div>
          <div className="text-xs font-semibold text-otj-text underline underline-offset-[3px] cursor-pointer" onClick={() => showToast('Opening all boards…')}>View all</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Ramadan Campaign', count: '4 creatives saved', icons: ['👩‍🎨', '✏️'] },
            { name: 'Product Launch', count: '2 creatives saved', icons: ['🎥', '🎨'] },
          ].map((coll, i) => (
            <div key={i} onClick={() => showToast(`Opening ${coll.name} board…`)} className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:border-foreground">
              <div className="grid grid-cols-2 h-[60px]">
                {coll.icons.map((ic, j) => <div key={j} className="flex items-center justify-center text-[22px] bg-otj-off">{ic}</div>)}
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

      {/* Right sidebar */}
      <div className="bg-card border-l border-border p-4 overflow-y-auto">
        <div className="mb-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2.5">March 2026</div>
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="p-2.5 px-3 border-b border-border text-xs font-extrabold tracking-[-0.02em] flex items-center justify-between">
              March 2026 <span className="flex gap-1"><span className="text-sm cursor-pointer text-otj-text px-1">‹</span><span className="text-sm cursor-pointer text-otj-text px-1">›</span></span>
            </div>
            <div className="grid grid-cols-7">
              {['M','T','W','T','F','S','S'].map((d,i) => <div key={i} className="p-1.5 text-center text-[9.5px] font-bold uppercase tracking-[0.06em] text-otj-muted">{d}</div>)}
              {Array.from({length:28}, (_,i) => i+1).map(d => (
                <div key={d} className={`p-[5px_4px] text-center text-[11px] cursor-pointer transition-all duration-150 rounded-md m-px ${
                  d === 2 ? 'bg-primary text-primary-foreground font-bold' :
                  d === 15 ? 'bg-otj-blue-bg text-otj-blue font-bold' :
                  d === 13 || d === 25 ? 'bg-otj-green-bg text-otj-green font-bold' :
                  'hover:bg-otj-off'
                }`}>{d}</div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-[5px]">
            {[
              { color: 'bg-otj-blue', title: 'Edita Shoot', time: 'Mar 15 · Full day' },
              { color: 'bg-otj-green', title: 'Vodafone Campaign', time: 'Mar 25 · Morning' },
              { color: 'bg-otj-orange', title: 'Phase 2 Deadline', time: 'Mar 20 · 5pm' },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-2 p-[7px_10px] rounded-[9px] cursor-pointer transition-all duration-150 hover:bg-otj-off">
                <div className={`w-2 h-2 rounded-full shrink-0 ${ev.color}`} />
                <div className="flex-1">
                  <div className="text-[11.5px] font-bold tracking-[-0.01em]">{ev.title}</div>
                  <div className="text-[10.5px] text-otj-text">{ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2.5">Today's Tasks</div>
          <div className="flex flex-col gap-[5px]">
            {[
              { text: 'Reply to Randa brief', priority: 'Urgent', prioColor: 'text-destructive', done: false },
              { text: 'Upload Phase 2 files', priority: 'Today', prioColor: 'text-otj-yellow', done: false },
              { text: 'Confirm Edita booking', priority: '', prioColor: '', done: true },
            ].map((task, i) => (
              <div key={i} onClick={() => !task.done && showToast('Task marked done ✓')} className={`flex items-center gap-2 p-2 px-2.5 rounded-[9px] border cursor-pointer ${task.done ? 'bg-otj-green-bg border-otj-green-border' : 'bg-card border-border'}`}>
                <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center ${task.done ? 'bg-otj-green' : 'border-[1.5px] border-border'}`}>
                  {task.done && <span className="text-primary-foreground text-[10px]">✓</span>}
                </div>
                <div className={`flex-1 text-xs font-semibold ${task.done ? 'text-otj-green line-through' : ''}`}>{task.text}</div>
                {task.priority && <div className={`text-[10px] font-bold ${task.prioColor}`}>{task.priority}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
