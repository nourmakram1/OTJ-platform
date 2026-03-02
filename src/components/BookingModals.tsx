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
  const [mode, setMode] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [selectedPkg, setSelectedPkg] = useState(0);

  const c = creativeId && creativeData[creativeId] ? creativeData[creativeId] : { av: '👥', name: 'New Brief', role: 'Select creatives below', rating: 'Mode: Casting Call' };
  const modes = [
    { id: 'A' as const, icon: '⚡', label: 'Quick Brief' },
    { id: 'B' as const, icon: '↕', label: 'Negotiate' },
    { id: 'C' as const, icon: '👥', label: 'Casting Call' },
    { id: 'D' as const, icon: '📁', label: 'Saved Brief' },
  ];
  const submitLabels = { A: 'Send Brief → Creative', B: 'Request Quote →', C: 'Send to All Creatives →', D: 'Send Saved Brief →' };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} className={`fixed inset-0 z-[200] flex items-center justify-center bg-foreground/40 backdrop-blur-[6px] transition-opacity duration-250 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-card/96 backdrop-blur-[20px] border border-card/80 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.2)] w-full max-w-[520px] overflow-hidden transition-all duration-300 max-h-[90vh] overflow-y-auto ${visible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[0.98]'}`}>
        {/* Header */}
        <div className="p-5 px-[22px] pb-0 flex items-center gap-3">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-otj-off flex items-center justify-center text-[28px] shrink-0">{c.av}</div>
          <div className="flex-1">
            <div className="text-base font-extrabold tracking-[-0.03em]">{c.name}</div>
            <div className="text-xs text-otj-text">{c.role}</div>
            <div className="text-[11.5px] font-bold text-foreground mt-0.5">{c.rating}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full border border-border bg-card cursor-pointer text-[13px] flex items-center justify-center text-otj-text transition-all duration-150 shrink-0 hover:border-foreground hover:text-foreground">×</button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 p-3.5 px-[22px] pt-3.5">
          {modes.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} className={`flex-1 px-1.5 py-2 rounded-[10px] border-[1.5px] text-[11.5px] font-bold cursor-pointer transition-all duration-150 text-center tracking-[-0.01em] ${
              mode === m.id ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground'
            }`}>
              <span className="text-sm block mb-0.5">{m.icon}</span>{m.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-[22px] py-4 pb-5">
          {mode === 'A' && (
            <div className="animate-fade-up">
              <div className="mb-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Select Package</div>
                <div className="flex flex-col gap-1.5">
                  {[
                    { name: 'Starter · Half Day', desc: '20 edited photos · 2 revisions', price: '2,000', unit: 'EGP' },
                    { name: 'Full Day Campaign', desc: '40 edited photos · 3 revisions', price: '3,500', unit: 'EGP', badge: 'Popular' },
                    { name: 'Premium Multi-Day', desc: '80+ photos · unlimited revisions', price: '6,500', unit: 'EGP' },
                  ].map((pkg, i) => (
                    <div key={i} onClick={() => setSelectedPkg(i)} className={`p-2.5 px-3.5 rounded-[10px] border-[1.5px] bg-card cursor-pointer transition-all duration-150 flex items-center justify-between ${selectedPkg === i ? 'border-foreground bg-otj-off' : 'border-border hover:border-otj-muted'}`}>
                      <div>
                        <div className="text-[13px] font-bold tracking-[-0.02em]">{pkg.name}</div>
                        <div className="text-[11px] text-otj-text">{pkg.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-extrabold">{pkg.price} <span className="text-[10px] font-medium text-otj-text">{pkg.unit}</span></div>
                        {pkg.badge && <div className="text-[10.5px] font-semibold text-primary-foreground bg-primary px-2 py-0.5 rounded-full mt-0.5">{pkg.badge}</div>}
                      </div>
                    </div>
                  ))}
                  <div onClick={() => setSelectedPkg(-1)} className={`text-xs font-semibold p-[9px_14px] rounded-[10px] border-[1.5px] border-dashed text-center cursor-pointer transition-all duration-150 ${selectedPkg === -1 ? 'border-otj-blue text-otj-blue bg-otj-blue-bg' : 'border-border text-otj-text hover:border-foreground hover:text-foreground'}`}>
                    💬 I want to discuss pricing
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Date</div>
                  <input type="date" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Duration</div>
                  <select className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card appearance-none cursor-pointer">
                    <option>Half day (4hrs)</option><option>Full day (8hrs)</option><option>Multi-day</option><option>Custom</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Brief Notes</div>
                <textarea rows={3} placeholder="Describe your project — mood, deliverables, references…" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 resize-none leading-relaxed focus:border-foreground focus:bg-card placeholder:text-otj-muted" />
              </div>
            </div>
          )}
          {mode === 'B' && (
            <div className="animate-fade-up">
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                <div><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Your Budget (EGP)</div><input type="number" placeholder="3000" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card" /></div>
                <div><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Timeline</div><select className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none appearance-none cursor-pointer"><option>3 days</option><option>5 days</option><option>1 week</option><option>2 weeks</option></select></div>
              </div>
              <div><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">What do you need?</div><textarea rows={3} placeholder="Describe the project scope and requirements…" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none resize-none leading-relaxed focus:border-foreground focus:bg-card placeholder:text-otj-muted" /></div>
            </div>
          )}
          {mode === 'C' && (
            <div className="animate-fade-up">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Selected Creatives</div>
              <div className="flex flex-col gap-1.5 mb-3">
                {[{ av: '👩‍🎨', name: 'Nour Makram', role: 'Photographer' }, { av: '🎥', name: 'Omar Hassan', role: 'Cinematographer' }].map((c, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 px-3 rounded-[10px] border-[1.5px] border-border bg-card">
                    <div className="w-8 h-8 rounded-full bg-otj-off flex items-center justify-center text-base shrink-0">{c.av}</div>
                    <div className="flex-1 text-[12.5px] font-bold">{c.name}</div>
                    <div className="text-[11px] text-otj-text">{c.role}</div>
                    <span className="text-[11px] text-otj-muted cursor-pointer px-2 py-0.5 rounded-md border border-border transition-all duration-150 hover:text-destructive hover:border-destructive">×</span>
                  </div>
                ))}
                <button className="p-2 px-3.5 rounded-[10px] border-[1.5px] border-dashed border-border bg-transparent text-xs font-semibold text-otj-text cursor-pointer transition-all duration-150 text-center w-full hover:border-foreground hover:text-foreground">+ Add Creative</button>
              </div>
              <div><div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Brief</div><textarea rows={3} placeholder="Describe the project for all creatives…" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none resize-none leading-relaxed focus:border-foreground focus:bg-card placeholder:text-otj-muted" /></div>
            </div>
          )}
          {mode === 'D' && (
            <div className="animate-fade-up">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Your Saved Briefs</div>
              <div className="flex flex-col gap-1.5 mb-2.5">
                {[
                  { icon: '📸', name: 'Product Shoot Brief', meta: 'Used 3 times · Last: Feb 28' },
                  { icon: '🎥', name: 'Campaign Video Brief', meta: 'Used 1 time · Last: Feb 15' },
                ].map((b, i) => (
                  <div key={i} className="p-2.5 px-3.5 rounded-[10px] border-[1.5px] border-border bg-card cursor-pointer transition-all duration-150 flex items-center gap-2.5 hover:border-foreground">
                    <span className="text-base shrink-0">{b.icon}</span>
                    <div className="flex-1"><div className="text-[13px] font-bold tracking-[-0.02em]">{b.name}</div><div className="text-[11px] text-otj-text">{b.meta}</div></div>
                    <span className="text-sm text-otj-blue">✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-[22px] pb-5 flex flex-col gap-2">
          <button onClick={() => { onClose(); showToast('✓ Brief sent! Creative has 2hrs to confirm'); }} className="w-full py-3 rounded-full border-none bg-primary text-primary-foreground text-sm font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center justify-center gap-2 hover:bg-primary/90 group">
            {submitLabels[mode]} <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
          </button>
          <button onClick={() => showToast('📁 Brief saved as template')} className="w-full py-[9px] rounded-full border-[1.5px] border-border bg-transparent text-[12.5px] font-semibold text-otj-text cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground">📁 Save as Brief Template</button>
          <div className="text-[11px] text-otj-muted text-center leading-relaxed">🔒 50% deposit held in OTJ escrow on acceptance · Creative has 2hrs to confirm</div>
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
