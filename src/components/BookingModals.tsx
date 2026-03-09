import React, { useState } from 'react';
import { showToast } from './Toast';
import { useProjects } from '../context/ProjectContext';

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
  const [step, setStep] = useState(1);
  const [budgetType, setBudgetType] = useState<'price' | 'range' | 'negotiate'>('price');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [budgetFixed, setBudgetFixed] = useState('');
  const [surveyAnswers, setSurveyAnswers] = useState<string[]>(['', '', '', '', '']);

  const surveyQuestions = [
    'What is the shoot purpose or campaign goal?',
    'What mood or aesthetic are you going for?',
    'What is the subject or product being shot?',
    'How many final deliverables do you need?',
    'Where will the content be used? (Social, print, ads…)',
  ];

  const c = creativeId && creativeData[creativeId] ? creativeData[creativeId] : { av: '👥', name: 'New Brief', role: 'Select creatives below', rating: '' };

  const inputClass = "w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-card text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted";
  const labelClass = "text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]";

  const handleClose = () => {
    onClose();
    setStep(1);
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && handleClose()} className={`fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[6px] transition-opacity duration-250 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-card border border-border rounded-2xl md:rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.18)] w-full max-w-[520px] overflow-hidden transition-all duration-300 max-h-[85vh] overflow-y-auto ${visible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[0.98]'}`}>
        {/* Header */}
        <div className="p-4 md:p-5 px-4 md:px-[22px] pb-3 flex items-center gap-2.5 md:gap-3 border-b border-border">
          <div className="w-10 h-10 md:w-[52px] md:h-[52px] rounded-xl md:rounded-[14px] bg-otj-off flex items-center justify-center text-xl md:text-[28px] shrink-0">{c.av}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm md:text-base font-extrabold tracking-[-0.03em] text-foreground truncate">{c.name}</div>
            <div className="text-[11px] md:text-xs text-otj-text truncate">{c.role}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted">Step {step}/2</div>
            <button onClick={handleClose} className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-border bg-card cursor-pointer text-xs md:text-[13px] flex items-center justify-center text-otj-muted transition-all duration-150 shrink-0 hover:border-foreground hover:text-foreground">×</button>
          </div>
        </div>

        {step === 1 && (
          <>
            {/* Step 1: Project Details */}
            <div className="px-4 md:px-[22px] py-3 md:py-4 pb-4 md:pb-5 flex flex-col gap-2.5 md:gap-3">
              <div>
                <div className={labelClass}>Project Name</div>
                <input type="text" placeholder="e.g. Ramadan Campaign Shoot" className={inputClass} />
              </div>

              <div>
                <div className={labelClass}>Description</div>
                <textarea rows={3} placeholder="Describe your project — mood, deliverables, references…" className={`${inputClass} resize-none leading-relaxed`} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className={labelClass}>Date</div>
                  <input type="date" className={inputClass} />
                </div>
                <div>
                  <div className={labelClass}>Location</div>
                  <input type="text" placeholder="e.g. Cairo" className={inputClass} />
                </div>
              </div>

              <div>
                <div className={labelClass}>Budget</div>
                <div className="flex gap-1 md:gap-1.5 mb-2">
                  {([
                    { id: 'price' as const, label: 'Fixed' },
                    { id: 'range' as const, label: 'Range' },
                    { id: 'negotiate' as const, label: 'Negotiate' },
                  ]).map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setBudgetType(opt.id)}
                      className={`flex-1 px-1.5 md:px-2 py-2 rounded-lg md:rounded-[10px] border-[1.5px] text-[10px] md:text-[11.5px] font-bold cursor-pointer transition-all duration-150 text-center tracking-[-0.01em] ${
                        budgetType === opt.id
                          ? 'bg-foreground border-foreground text-card'
                          : 'bg-card border-border text-otj-muted hover:border-foreground hover:text-foreground'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {budgetType === 'price' && (
                  <input type="number" placeholder="e.g. 3500 EGP" value={budgetFixed} onChange={e => setBudgetFixed(e.target.value)} className={inputClass} />
                )}
                {budgetType === 'range' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Min (EGP)" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} className={inputClass} />
                    <input type="number" placeholder="Max (EGP)" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} className={inputClass} />
                  </div>
                )}
                {budgetType === 'negotiate' && (
                  <div className="text-[11px] md:text-xs text-otj-text bg-otj-off rounded-lg md:rounded-[10px] p-2.5 md:p-3 text-center border border-border">
                    💬 You'll discuss pricing with the creative
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 md:px-[22px] pb-4 md:pb-5">
              <button onClick={() => setStep(2)} className="w-full py-2.5 md:py-3 rounded-full border-none bg-foreground text-card text-[13px] md:text-sm font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center justify-center gap-2 hover:opacity-90 group">
                Next <span className="hidden md:inline">: Survey Questions</span> <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            {/* Step 2: Survey Questions */}
            <div className="px-4 md:px-[22px] py-3 md:py-4 pb-4 md:pb-5 flex flex-col gap-2.5 md:gap-3">
              <div className="text-[12px] md:text-[13px] font-bold tracking-[-0.02em] text-foreground pb-2 md:pb-2.5 border-b border-border flex items-center gap-2 flex-wrap">
                📋 Brief Questions <span className="text-[10px] md:text-[11px] font-medium text-otj-text">— answer for creative</span>
              </div>
              {surveyQuestions.map((q, i) => (
                <div key={i}>
                  <div className="flex items-start gap-2 mb-1.5">
                    <div className="w-5 h-5 md:w-[22px] md:h-[22px] rounded-md bg-otj-off border border-border flex items-center justify-center text-[9px] md:text-[10px] font-bold text-otj-muted shrink-0 mt-0.5">{i + 1}</div>
                    <div className="text-[11px] md:text-[12.5px] font-semibold text-foreground leading-snug">{q}</div>
                  </div>
                  <textarea
                    rows={2}
                    value={surveyAnswers[i]}
                    onChange={e => { const next = [...surveyAnswers]; next[i] = e.target.value; setSurveyAnswers(next); }}
                    placeholder="Type your answer…"
                    className={`${inputClass} resize-none leading-relaxed text-[12px] md:text-[13.5px]`}
                  />
                </div>
              ))}
            </div>

            <div className="px-4 md:px-[22px] pb-4 md:pb-5 flex flex-col gap-2">
              <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="flex-1 py-2.5 md:py-3 rounded-full border-[1.5px] border-border bg-card text-otj-text text-[12px] md:text-sm font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground">
                  ← Back
                </button>
                <button onClick={() => { handleClose(); showToast('✓ Brief sent! Creative has 2hrs to confirm'); }} className="flex-[2] py-2.5 md:py-3 rounded-full border-none bg-foreground text-card text-[12px] md:text-sm font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center justify-center gap-1.5 md:gap-2 hover:opacity-90 group">
                  Send Brief <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
                </button>
              </div>
              <div className="text-[10px] md:text-[11px] text-otj-muted text-center leading-relaxed">🔒 50% deposit in escrow · Creative has 2hrs to confirm</div>
            </div>
          </>
        )}
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
    <div onClick={(e) => e.target === e.currentTarget && onClose()} className={`fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[6px] transition-opacity duration-250 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-card rounded-2xl md:rounded-[20px] w-full max-w-[440px] overflow-hidden transition-all duration-300 ${visible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[0.98]'}`}>
        <div className="p-4 md:p-[18px_20px] border-b border-border flex items-center justify-between">
          <div className="text-sm md:text-base font-extrabold tracking-[-0.03em]">↕ Send Counter-Offer</div>
          <button onClick={onClose} className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-border bg-card cursor-pointer text-xs md:text-[13px] flex items-center justify-center text-otj-text transition-all duration-150 hover:border-foreground hover:text-foreground">×</button>
        </div>
        <div className="p-4 md:p-[18px_20px]">
          <div className="grid grid-cols-2 gap-2 md:gap-2.5 mb-2.5 md:mb-3">
            <div>
              <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Price (EGP)</div>
              <input type="number" defaultValue={3200} className="w-full px-3 md:px-3.5 py-2 md:py-2.5 rounded-lg md:rounded-[10px] border-[1.5px] border-border bg-otj-off text-[12px] md:text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card" />
            </div>
            <div>
              <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Timeline (days)</div>
              <input type="number" defaultValue={5} className="w-full px-3 md:px-3.5 py-2 md:py-2.5 rounded-lg md:rounded-[10px] border-[1.5px] border-border bg-otj-off text-[12px] md:text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card" />
            </div>
          </div>
          <div className="mb-2.5 md:mb-3">
            <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Deliverables</div>
            <input placeholder="e.g. 40 photos, 2 revisions" className="w-full px-3 md:px-3.5 py-2 md:py-2.5 rounded-lg md:rounded-[10px] border-[1.5px] border-border bg-otj-off text-[12px] md:text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted" />
          </div>
          <div>
            <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Message (optional)</div>
            <textarea rows={2} defaultValue="Happy to do 3,200 EGP if we can confirm by Friday." className="w-full px-3 md:px-3.5 py-2 md:py-2.5 rounded-lg md:rounded-[10px] border-[1.5px] border-border bg-otj-off text-[12px] md:text-[13.5px] text-foreground outline-none transition-all duration-150 resize-none leading-relaxed focus:border-foreground focus:bg-card" />
          </div>
        </div>
        <div className="px-4 md:px-5 pb-4 md:pb-[18px] flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 md:py-[9px] px-3 md:px-5 rounded-full border-[1.5px] border-border bg-transparent text-[11px] md:text-[13px] font-bold text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">Cancel</button>
          <button onClick={() => { onClose(); showToast('↕ Counter-offer sent — 3,200 EGP'); }} className="flex-[2] py-2 md:py-[9px] px-3 md:px-5 rounded-full border-none bg-primary text-primary-foreground text-[11px] md:text-[13px] font-bold cursor-pointer transition-all duration-150 hover:bg-primary/90">Send Offer →</button>
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
  onNavigate: (path: string) => void;
}

export const NotifPopup: React.FC<NotifPopupProps> = ({ visible, onClose, onAcceptBrief, onCounter, onSwitchToMessages }) => {
  const { notifications, markAllRead, pendingBriefs } = useProjects();
  if (!visible) return null;

  const briefNotif = pendingBriefs[0]; // Show first pending brief as featured

  return (
    <div className={`fixed top-14 md:top-16 right-2 md:right-5 left-2 md:left-auto z-[300] md:w-[340px] bg-card border border-border rounded-2xl md:rounded-[18px] shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-250 ${visible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-2 opacity-0 pointer-events-none'}`}>
      <div className="p-3 md:p-3.5 px-3.5 md:px-4 border-b border-border flex items-center justify-between">
        <div className="text-[12px] md:text-[13px] font-extrabold tracking-[-0.02em]">Notifications</div>
        <div onClick={() => { markAllRead(); }} className="text-[10px] md:text-xs text-muted-foreground cursor-pointer px-1.5 md:px-2 py-0.5 rounded-md border border-border transition-all duration-150 hover:text-foreground hover:border-foreground">Mark read</div>
      </div>

      {/* Featured brief request */}
      {briefNotif && (
        <div className="p-3 md:p-3.5 px-3.5 md:px-4 bg-[hsl(var(--otj-yellow-bg))] border-[1.5px] border-[hsl(var(--otj-yellow-border))] rounded-xl mx-2 md:mx-2.5 my-2">
          <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.08em] text-[hsl(var(--otj-yellow))] mb-1 md:mb-1.5">📋 New Brief · {briefNotif.time}</div>
          <div className="text-[13px] md:text-sm font-extrabold tracking-[-0.03em] mb-1">{briefNotif.clientName} wants to book you</div>
          <div className="text-[11px] md:text-xs text-muted-foreground leading-relaxed mb-2 md:mb-2.5">{briefNotif.name} · {briefNotif.budget}</div>
          <div className="flex gap-1 md:gap-1.5">
            <button onClick={() => { onClose(); onAcceptBrief(); }} className="flex-1 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold cursor-pointer transition-all duration-150 bg-primary border-[1.5px] border-primary text-primary-foreground hover:bg-primary/90">Accept</button>
            <button onClick={() => { onClose(); onCounter(); }} className="flex-1 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold cursor-pointer transition-all duration-150 border-[1.5px] border-[hsl(var(--otj-yellow))] text-[hsl(var(--otj-yellow))] bg-card">Counter</button>
            <button onClick={onClose} className="flex-1 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold cursor-pointer transition-all duration-150 border-[1.5px] border-border bg-card hover:border-foreground">Decline</button>
          </div>
        </div>
      )}

      <div className="py-1.5 max-h-[280px] md:max-h-[360px] overflow-y-auto">
        {notifications.map((n) => (
          <div key={n.id} onClick={() => { onClose(); onSwitchToMessages(); }} className="px-3.5 md:px-4 py-2 md:py-2.5 cursor-pointer transition-colors duration-150 border-b border-border last:border-b-0 hover:bg-muted">
            <div className="flex items-start gap-2 md:gap-2.5">
              <div className={`w-8 h-8 md:w-[34px] md:h-[34px] rounded-lg md:rounded-[10px] flex items-center justify-center text-sm md:text-base shrink-0 ${n.bg}`}>{n.icon}</div>
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] md:text-[12.5px] font-bold tracking-[-0.01em] mb-px truncate ${n.type === 'counter-accepted' ? 'text-[hsl(var(--otj-green))]' : 'text-foreground'}`}>{n.title}</div>
                <div className="text-[10px] md:text-[11.5px] text-muted-foreground leading-snug truncate">{n.sub}</div>
                <div className="text-[9px] md:text-[10.5px] text-muted-foreground mt-0.5">{n.time}</div>
              </div>
              {n.unread && <div className="w-1.5 h-1.5 md:w-[7px] md:h-[7px] rounded-full bg-[hsl(var(--otj-blue))] shrink-0 mt-[5px]" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
