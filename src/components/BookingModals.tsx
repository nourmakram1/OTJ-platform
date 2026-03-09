import React, { useState } from 'react';
import { showToast } from './Toast';

// Quick Brief Popup
interface QuickBriefPopupProps {
  visible: boolean;
  onClose: () => void;
  creativeId: string | null;
}

const creativeData: Record<string, { av: string; name: string; role: string; rating: string }> = {
  nour: { av: '👩‍🎨', name: 'Nour Makram', role: 'Fashion Photographer · Cairo', rating: '⭐ 4.9 · 127 jobs · Available' },
  karim: { av: '✏️', name: 'Karim Samy', role: 'Script Writer · Cairo', rating: '⭐ 4.8 · 89 jobs · Available' },
  sara: { av: '🎨', name: 'Sara Ahmed', role: 'Brand Designer · Cairo', rating: '⭐ 5.0 · 54 jobs · Next week' },
  omar: { av: '🎥', name: 'Omar Hassan', role: 'Cinematographer · Cairo', rating: '⭐ 4.7 · 203 jobs · Available' },
};

export const QuickBriefPopup: React.FC<QuickBriefPopupProps> = ({ visible, onClose, creativeId }) => {
  const [budgetType, setBudgetType] = useState<'price' | 'range' | 'negotiate'>('price');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [budgetFixed, setBudgetFixed] = useState('');

  const c = creativeId && creativeData[creativeId] ? creativeData[creativeId] : { av: '👥', name: 'New Brief', role: 'Select creatives below', rating: '' };

  const inputClass = "w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-muted/40 text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-muted-foreground/60";
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-[5px]";

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} className={`fixed inset-0 z-[200] flex items-center justify-center bg-foreground/40 backdrop-blur-[6px] transition-opacity duration-250 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-card/96 backdrop-blur-[20px] border border-border rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.2)] w-full max-w-[520px] overflow-hidden transition-all duration-300 max-h-[90vh] overflow-y-auto ${visible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[0.98]'}`}>
        {/* Header */}
        <div className="p-5 px-[22px] pb-3 flex items-center gap-3">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-muted flex items-center justify-center text-[28px] shrink-0">{c.av}</div>
          <div className="flex-1">
            <div className="text-base font-extrabold tracking-[-0.03em]">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.role}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full border border-border bg-card cursor-pointer text-[13px] flex items-center justify-center text-muted-foreground transition-all duration-150 shrink-0 hover:border-foreground hover:text-foreground">×</button>
        </div>

        {/* Body */}
        <div className="px-[22px] py-4 pb-5 flex flex-col gap-3">
          {/* Project Name */}
          <div>
            <div className={labelClass}>Project Name</div>
            <input type="text" placeholder="e.g. Ramadan Campaign Shoot" className={inputClass} />
          </div>

          {/* Description */}
          <div>
            <div className={labelClass}>Description</div>
            <textarea rows={3} placeholder="Describe your project — mood, deliverables, references…" className={`${inputClass} resize-none leading-relaxed`} />
          </div>

          {/* Survey Question */}
          <div>
            <div className={labelClass}>Survey Question</div>
            <input type="text" placeholder="e.g. Can you share relevant portfolio pieces?" className={inputClass} />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <div className={labelClass}>Date</div>
              <input type="date" className={inputClass} />
            </div>
            <div>
              <div className={labelClass}>Location</div>
              <input type="text" placeholder="e.g. Cairo, Studio A" className={inputClass} />
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className={labelClass}>Budget</div>
            <div className="flex gap-1.5 mb-2.5">
              {([
                { id: 'price' as const, label: 'Fixed Price' },
                { id: 'range' as const, label: 'Range' },
                { id: 'negotiate' as const, label: 'I want to negotiate' },
              ]).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setBudgetType(opt.id)}
                  className={`flex-1 px-2 py-2 rounded-[10px] border-[1.5px] text-[11.5px] font-bold cursor-pointer transition-all duration-150 text-center tracking-[-0.01em] ${
                    budgetType === opt.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-card border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {budgetType === 'price' && (
              <input type="number" placeholder="e.g. 3500" value={budgetFixed} onChange={e => setBudgetFixed(e.target.value)} className={inputClass} />
            )}
            {budgetType === 'range' && (
              <div className="grid grid-cols-2 gap-2.5">
                <input type="number" placeholder="Min (EGP)" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} className={inputClass} />
                <input type="number" placeholder="Max (EGP)" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} className={inputClass} />
              </div>
            )}
            {budgetType === 'negotiate' && (
              <div className="text-xs text-muted-foreground bg-muted/40 rounded-[10px] p-3 text-center border border-border">
                💬 No amount specified — you'll discuss pricing with the creative
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-[22px] pb-5 flex flex-col gap-2">
          <button onClick={() => { onClose(); showToast('✓ Brief sent! Creative has 2hrs to confirm'); }} className="w-full py-3 rounded-full border-none bg-primary text-primary-foreground text-sm font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center justify-center gap-2 hover:bg-primary/90 group">
            Send Brief → <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
          </button>
          <div className="text-[11px] text-muted-foreground text-center leading-relaxed">🔒 50% deposit held in escrow on acceptance · Creative has 2hrs to confirm</div>
        </div>
      </div>
    </div>
  );
};
// Counter Offer Modal
interface CounterOfferModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CounterOfferModal: React.FC<CounterOfferModalProps> = ({ visible, onClose }) => {
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} className={`fixed inset-0 z-[200] flex items-center justify-center bg-foreground/40 backdrop-blur-[6px] transition-opacity duration-250 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-card rounded-[20px] w-full max-w-[440px] overflow-hidden transition-all duration-300 ${visible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[0.98]'}`}>
        <div className="p-[18px_20px] border-b border-border flex items-center justify-between">
          <div className="text-base font-extrabold tracking-[-0.03em]">↕ Send a Counter-Offer</div>
          <button onClick={onClose} className="w-7 h-7 rounded-full border border-border bg-card cursor-pointer text-[13px] flex items-center justify-center text-otj-text transition-all duration-150 hover:border-foreground hover:text-foreground">×</button>
        </div>
        <div className="p-[18px_20px]">
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Your Price (EGP)</div><input type="number" defaultValue={3200} className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card" /></div>
            <div><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Timeline (days)</div><input type="number" defaultValue={5} className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card" /></div>
          </div>
          <div className="mb-3"><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Deliverables</div><input placeholder="e.g. 40 edited photos, 2 revisions" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted" /></div>
          <div><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Message (optional)</div><textarea rows={2} defaultValue="Happy to do 3,200 EGP if we can confirm by Friday." className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 resize-none leading-relaxed focus:border-foreground focus:bg-card" /></div>
        </div>
        <div className="px-5 pb-[18px] flex gap-2">
          <button onClick={onClose} className="flex-1 py-[9px] px-5 rounded-full border-[1.5px] border-border bg-transparent text-[13px] font-bold text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">Cancel</button>
          <button onClick={() => { onClose(); showToast('↕ Counter-offer sent — 3,200 EGP'); }} className="flex-[2] py-[9px] px-5 rounded-full border-none bg-primary text-primary-foreground text-[13px] font-bold cursor-pointer transition-all duration-150 hover:bg-primary/90">Send Counter-Offer →</button>
        </div>
      </div>
    </div>
  );
};

// Notification Popup
interface NotifPopupProps {
  visible: boolean;
  onClose: () => void;
  onAcceptBrief: () => void;
  onCounter: () => void;
  onSwitchToMessages: () => void;
}

export const NotifPopup: React.FC<NotifPopupProps> = ({ visible, onClose, onAcceptBrief, onCounter, onSwitchToMessages }) => {
  if (!visible) return null;
  return (
    <div className={`fixed top-16 right-5 z-[300] w-[340px] bg-card border border-border rounded-[18px] shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-250 ${visible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-2 opacity-0 pointer-events-none'}`}>
      <div className="p-3.5 px-4 border-b border-border flex items-center justify-between">
        <div className="text-[13px] font-extrabold tracking-[-0.02em]">Notifications</div>
        <div onClick={onClose} className="text-xs text-otj-muted cursor-pointer px-2 py-0.5 rounded-md border border-border transition-all duration-150 hover:text-foreground hover:border-foreground">Mark all read</div>
      </div>
      {/* Brief request */}
      <div className="p-3.5 px-4 bg-otj-yellow-bg border-[1.5px] border-otj-yellow-border rounded-xl mx-2.5 my-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-otj-yellow mb-1.5">📋 New Brief Request · 3m ago</div>
        <div className="text-sm font-extrabold tracking-[-0.03em] mb-1">Randa Hatem wants to book you</div>
        <div className="text-xs text-otj-text leading-relaxed mb-2.5">Campaign shoot for Edita Group · Full Day · Budget: 3,500 EGP · Date: March 15</div>
        <div className="flex gap-1.5">
          <button onClick={() => { onClose(); onAcceptBrief(); }} className="flex-1 py-2 rounded-full text-xs font-bold cursor-pointer transition-all duration-150 bg-primary border-[1.5px] border-primary text-primary-foreground hover:bg-primary/90">✓ Accept</button>
          <button onClick={() => { onClose(); onCounter(); }} className="flex-1 py-2 rounded-full text-xs font-bold cursor-pointer transition-all duration-150 border-[1.5px] border-otj-yellow text-otj-yellow bg-card">↕ Counter</button>
          <button onClick={onClose} className="flex-1 py-2 rounded-full text-xs font-bold cursor-pointer transition-all duration-150 border-[1.5px] border-border bg-card hover:border-foreground">✕ Decline</button>
        </div>
      </div>
      <div className="py-1.5 max-h-[360px] overflow-y-auto">
        {[
          { icon: '💬', bg: 'bg-otj-off', title: 'Ahmed Karim sent you a message', sub: 'Can we schedule a call for Thursday?', time: '12m ago', unread: true },
          { icon: '💳', bg: 'bg-otj-green-bg', title: 'Payment released — 3,325 EGP', sub: 'Edita Campaign · Phase 2 approved by client', time: '2h ago', unread: true },
          { icon: '📅', bg: 'bg-otj-blue-bg', title: 'Booking confirmed · March 15', sub: 'Edita Group campaign — added to your calendar', time: 'Yesterday', unread: false },
        ].map((n, i) => (
          <div key={i} onClick={() => { onClose(); onSwitchToMessages(); }} className="px-4 py-2.5 cursor-pointer transition-colors duration-150 border-b border-border last:border-b-0 hover:bg-otj-off">
            <div className="flex items-start gap-2.5">
              <div className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-base shrink-0 ${n.bg}`}>{n.icon}</div>
              <div className="flex-1">
                <div className="text-[12.5px] font-bold tracking-[-0.01em] mb-px">{n.title}</div>
                <div className="text-[11.5px] text-otj-text leading-snug">{n.sub}</div>
                <div className="text-[10.5px] text-otj-muted mt-0.5">{n.time}</div>
              </div>
              {n.unread && <div className="w-[7px] h-[7px] rounded-full bg-otj-blue shrink-0 mt-[5px]" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
