import React, { useState } from 'react';
import { PhaseData, ProjectData, PaymentMilestone, PaymentMethod } from '../context/ProjectContext';

interface ProposalBuilderProps {
  project: ProjectData;
  onSubmit: (phases: PhaseData[], deliverables: string[], price: string, milestones: PaymentMilestone[], paymentMethod: PaymentMethod) => void;
}

interface DraftPhase {
  title: string;
  tasks: string[];
  deadline: string;
}

interface DraftMilestone {
  label: string;
  percentage: string;
}

const PRESET_SPLITS = [
  { label: '50 / 50', milestones: [{ label: 'Deposit', percentage: '50' }, { label: 'On Completion', percentage: '50' }] },
  { label: '30 / 70', milestones: [{ label: 'Deposit', percentage: '30' }, { label: 'On Completion', percentage: '70' }] },
  { label: '25 / 25 / 50', milestones: [{ label: 'Deposit', percentage: '25' }, { label: 'Mid-Project', percentage: '25' }, { label: 'On Completion', percentage: '50' }] },
  { label: 'Custom', milestones: [] },
];

export const ProposalBuilder: React.FC<ProposalBuilderProps> = ({ project, onSubmit }) => {
  const [phases, setPhases] = useState<DraftPhase[]>([
    { title: 'Pre-Production', tasks: [''], deadline: '' },
  ]);
  const [deliverables, setDeliverables] = useState<string[]>(['']);
  const [price, setPrice] = useState(project.budget.replace(/[^0-9]/g, ''));
  const [notes, setNotes] = useState('');
  const [selectedSplit, setSelectedSplit] = useState(0);
  const [milestones, setMilestones] = useState<DraftMilestone[]>(PRESET_SPLITS[0].milestones);
  const [paymentType, setPaymentType] = useState<'instapay' | 'bank'>('instapay');
  const [instapayHandle, setInstapayHandle] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Phase helpers
  const addPhase = () => setPhases(prev => [...prev, { title: '', tasks: [''], deadline: '' }]);
  const removePhase = (idx: number) => { if (phases.length > 1) setPhases(prev => prev.filter((_, i) => i !== idx)); };
  const updatePhaseTitle = (idx: number, title: string) => setPhases(prev => prev.map((p, i) => i === idx ? { ...p, title } : p));
  const updatePhaseDeadline = (idx: number, deadline: string) => setPhases(prev => prev.map((p, i) => i === idx ? { ...p, deadline } : p));
  const addTask = (pi: number) => setPhases(prev => prev.map((p, i) => i === pi ? { ...p, tasks: [...p.tasks, ''] } : p));
  const removeTask = (pi: number, ti: number) => setPhases(prev => prev.map((p, i) => { if (i !== pi || p.tasks.length <= 1) return p; return { ...p, tasks: p.tasks.filter((_, j) => j !== ti) }; }));
  const updateTask = (pi: number, ti: number, text: string) => setPhases(prev => prev.map((p, i) => { if (i !== pi) return p; return { ...p, tasks: p.tasks.map((t, j) => j === ti ? text : t) }; }));

  // Deliverable helpers
  const addDeliverable = () => setDeliverables(prev => [...prev, '']);
  const removeDeliverable = (idx: number) => { if (deliverables.length > 1) setDeliverables(prev => prev.filter((_, i) => i !== idx)); };
  const updateDeliverable = (idx: number, val: string) => setDeliverables(prev => prev.map((d, i) => i === idx ? val : d));

  // Milestone helpers
  const selectPreset = (idx: number) => {
    setSelectedSplit(idx);
    if (idx < PRESET_SPLITS.length - 1) {
      setMilestones([...PRESET_SPLITS[idx].milestones]);
    }
  };
  const addMilestone = () => setMilestones(prev => [...prev, { label: '', percentage: '' }]);
  const removeMilestone = (idx: number) => { if (milestones.length > 1) setMilestones(prev => prev.filter((_, i) => i !== idx)); };
  const updateMilestone = (idx: number, field: 'label' | 'percentage', val: string) => {
    setMilestones(prev => prev.map((m, i) => i === idx ? { ...m, [field]: field === 'percentage' ? val.replace(/[^0-9]/g, '') : val } : m));
  };

  const totalPercentage = milestones.reduce((sum, m) => sum + (parseInt(m.percentage) || 0), 0);
  const numericPrice = parseInt(price) || 0;

  const paymentMethodValid = paymentType === 'instapay' ? instapayHandle.trim().length > 0 : (bankName.trim() && accountName.trim() && accountNumber.trim());

  const canSubmit = phases.every(p => p.title.trim() && p.tasks.some(t => t.trim())) &&
    deliverables.some(d => d.trim()) &&
    price.trim() &&
    totalPercentage === 100 &&
    milestones.every(m => m.label.trim() && parseInt(m.percentage) > 0) &&
    paymentMethodValid;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const phaseData: PhaseData[] = phases.map((p, i) => ({
      num: i + 1,
      title: p.title,
      status: 'locked' as const,
      tasks: p.tasks.filter(t => t.trim()).map(t => ({ text: t, done: false, due: p.deadline || project.deadline })),
    }));
    const cleanDeliverables = deliverables.filter(d => d.trim());
    const paymentMilestones: PaymentMilestone[] = milestones.map(m => ({
      label: m.label,
      percentage: parseInt(m.percentage),
      status: 'pending' as const,
    }));
    const paymentMethod: PaymentMethod = paymentType === 'instapay'
      ? { type: 'instapay', instapayHandle }
      : { type: 'bank', bankName, accountName, accountNumber };
    onSubmit(phaseData, cleanDeliverables, price, paymentMilestones, paymentMethod);
  };

  return (
    <div className="grid grid-cols-[1fr_340px] gap-6">
      {/* Main proposal form */}
      <div className="flex flex-col gap-6">
        {/* Header banner */}
        <div className="bg-otj-yellow-bg border border-otj-yellow-border rounded-[14px] p-4">
          <div className="text-[14px] font-extrabold text-otj-yellow mb-1">📝 Write Your Proposal</div>
          <div className="text-[12px] text-otj-text leading-relaxed">
            Define phases, tasks, deliverables and pricing based on the client's brief. Once sent, the client will review and approve before the project begins.
          </div>
        </div>

        {/* Phases */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[16px] font-extrabold tracking-[-0.03em]">Phases & Tasks</div>
            <button onClick={addPhase} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-card text-foreground cursor-pointer hover:border-foreground transition-all duration-150">+ Add Phase</button>
          </div>
          <div className="flex flex-col gap-3">
            {phases.map((phase, pi) => (
              <div key={pi} className="bg-card border-[1.5px] border-border rounded-[14px] overflow-hidden">
                <div className="p-3.5 px-4 flex items-center gap-3 border-b border-border bg-otj-off/50">
                  <div className="w-8 h-8 rounded-lg bg-otj-blue text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">{pi + 1}</div>
                  <input type="text" value={phase.title} onChange={e => updatePhaseTitle(pi, e.target.value)} placeholder="Phase title (e.g. Pre-Production)" className="flex-1 text-[13.5px] font-extrabold tracking-[-0.02em] bg-transparent border-none outline-none placeholder:text-otj-muted" />
                  <input type="text" value={phase.deadline} onChange={e => updatePhaseDeadline(pi, e.target.value)} placeholder="Deadline" className="w-[100px] text-[11px] font-bold text-otj-text bg-transparent border border-border rounded-lg px-2.5 py-1.5 outline-none placeholder:text-otj-muted text-center" />
                  {phases.length > 1 && (
                    <button onClick={() => removePhase(pi)} className="text-otj-muted hover:text-foreground text-sm cursor-pointer">✕</button>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {phase.tasks.map((task, ti) => (
                    <div key={ti} className="flex items-center gap-2.5">
                      <div className="w-[18px] h-[18px] rounded border-[1.5px] border-border shrink-0" />
                      <input type="text" value={task} onChange={e => updateTask(pi, ti, e.target.value)} placeholder="Add a task…" className="flex-1 text-[13px] font-medium bg-transparent border-none outline-none placeholder:text-otj-muted" />
                      {phase.tasks.length > 1 && (
                        <button onClick={() => removeTask(pi, ti)} className="text-otj-muted hover:text-foreground text-xs cursor-pointer">✕</button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addTask(pi)} className="text-[11.5px] font-semibold text-otj-blue cursor-pointer text-left mt-1 hover:underline">+ Add task</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[16px] font-extrabold tracking-[-0.03em]">Deliverables</div>
            <button onClick={addDeliverable} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-card text-foreground cursor-pointer hover:border-foreground transition-all duration-150">+ Add Deliverable</button>
          </div>
          <div className="bg-card border border-border rounded-[14px] p-4 flex flex-col gap-2">
            {deliverables.map((d, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-otj-off flex items-center justify-center text-sm shrink-0">📦</div>
                <input type="text" value={d} onChange={e => updateDeliverable(i, e.target.value)} placeholder="e.g. 20 edited product shots (high-res)" className="flex-1 text-[13px] font-medium bg-transparent border-none outline-none placeholder:text-otj-muted" />
                {deliverables.length > 1 && (
                  <button onClick={() => removeDeliverable(i)} className="text-otj-muted hover:text-foreground text-xs cursor-pointer">✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Payment Milestones */}
        <div>
          <div className="text-[16px] font-extrabold tracking-[-0.03em] mb-3">Pricing & Payment Schedule</div>
          <div className="bg-card border border-border rounded-[14px] p-4">
            {/* Total price */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">Total Price</div>
                <div className="flex items-center gap-1.5">
                  <input type="text" value={price} onChange={e => setPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="text-[22px] font-extrabold tracking-[-0.04em] bg-transparent border-none outline-none w-[120px]" />
                  <span className="text-[14px] font-bold text-otj-muted">EGP</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">Client's Budget</div>
                <div className="text-[16px] font-extrabold text-otj-text">{project.budget}</div>
              </div>
            </div>

            {/* Split presets */}
            <div className="border-t border-border pt-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2.5">Payment Split</div>
              <div className="flex gap-2 mb-3">
                {PRESET_SPLITS.map((preset, i) => (
                  <button key={i} onClick={() => selectPreset(i)} className={`text-[11px] font-bold px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-150 ${
                    selectedSplit === i ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-otj-text hover:border-foreground'
                  }`}>{preset.label}</button>
                ))}
              </div>

              {/* Milestone rows */}
              <div className="flex flex-col gap-2">
                {milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-otj-off/50 rounded-lg p-2.5 px-3">
                    <div className="w-6 h-6 rounded-md bg-otj-blue text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                    <input type="text" value={m.label} onChange={e => updateMilestone(i, 'label', e.target.value)} placeholder="Milestone label" className="flex-1 text-[12px] font-bold bg-transparent border-none outline-none placeholder:text-otj-muted" />
                    <div className="flex items-center gap-1">
                      <input type="text" value={m.percentage} onChange={e => updateMilestone(i, 'percentage', e.target.value)} placeholder="0" className="w-[40px] text-[13px] font-extrabold bg-transparent border-none outline-none text-right" />
                      <span className="text-[11px] font-bold text-otj-muted">%</span>
                    </div>
                    {numericPrice > 0 && parseInt(m.percentage) > 0 && (
                      <span className="text-[11px] font-bold text-otj-text min-w-[70px] text-right">{Math.round(numericPrice * parseInt(m.percentage) / 100).toLocaleString()} EGP</span>
                    )}
                    {milestones.length > 1 && (
                      <button onClick={() => removeMilestone(i)} className="text-otj-muted hover:text-foreground text-xs cursor-pointer">✕</button>
                    )}
                  </div>
                ))}
              </div>
              {selectedSplit === PRESET_SPLITS.length - 1 && (
                <button onClick={addMilestone} className="text-[11.5px] font-semibold text-otj-blue cursor-pointer text-left mt-2 hover:underline">+ Add milestone</button>
              )}
              {totalPercentage !== 100 && (
                <div className={`text-[11px] font-bold mt-2 ${totalPercentage > 100 ? 'text-destructive' : 'text-otj-yellow'}`}>
                  Total: {totalPercentage}% — must equal 100%
                </div>
              )}
              {totalPercentage === 100 && (
                <div className="text-[11px] font-bold mt-2 text-otj-green">✓ Total: 100%</div>
              )}
            </div>

            {/* OTJ Fee */}
            {numericPrice > 0 && (
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div className="text-[10px] text-otj-text">OTJ Fee (5%)</div>
                <div className="text-[14px] font-extrabold text-otj-muted">{Math.round(numericPrice * 0.05).toLocaleString()} EGP</div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <div className="text-[16px] font-extrabold tracking-[-0.03em] mb-3">Payment Method</div>
          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2.5">How will the client pay?</div>
            <div className="flex gap-2 mb-4">
              <button onClick={() => setPaymentType('instapay')} className={`text-[12px] font-bold px-4 py-2 rounded-lg border cursor-pointer transition-all duration-150 flex items-center gap-2 ${
                paymentType === 'instapay' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-otj-text hover:border-foreground'
              }`}>📱 InstaPay</button>
              <button onClick={() => setPaymentType('bank')} className={`text-[12px] font-bold px-4 py-2 rounded-lg border cursor-pointer transition-all duration-150 flex items-center gap-2 ${
                paymentType === 'bank' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-otj-text hover:border-foreground'
              }`}>🏦 Bank Transfer</button>
            </div>

            {paymentType === 'instapay' ? (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">InstaPay Handle / Phone</div>
                <input type="text" value={instapayHandle} onChange={e => setInstapayHandle(e.target.value)} placeholder="e.g. 01012345678" className="w-full text-[13px] font-medium bg-otj-off/50 border border-border rounded-lg p-2.5 px-3 outline-none placeholder:text-otj-muted" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">Bank Name</div>
                  <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. CIB, QNB, Banque Misr" className="w-full text-[13px] font-medium bg-otj-off/50 border border-border rounded-lg p-2.5 px-3 outline-none placeholder:text-otj-muted" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">Account Holder Name</div>
                  <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)} placeholder="Full name on the account" className="w-full text-[13px] font-medium bg-otj-off/50 border border-border rounded-lg p-2.5 px-3 outline-none placeholder:text-otj-muted" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">Account / IBAN Number</div>
                  <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Account number or IBAN" className="w-full text-[13px] font-medium bg-otj-off/50 border border-border rounded-lg p-2.5 px-3 outline-none placeholder:text-otj-muted" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <div className="text-[16px] font-extrabold tracking-[-0.03em] mb-3">Notes to Client</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional notes, terms, or conditions…" className="w-full bg-card border border-border rounded-[14px] p-4 text-[13px] font-medium outline-none resize-none min-h-[80px] placeholder:text-otj-muted" />
        </div>

        {/* Send to Client */}
        <div className="flex items-center gap-3 pb-6">
          <button onClick={handleSubmit} disabled={!canSubmit} className={`text-[13px] font-bold px-6 py-2.5 rounded-full border-none cursor-pointer transition-all duration-150 ${
            canSubmit ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-otj-off text-otj-muted cursor-not-allowed'
          }`}>
            Send to Client →
          </button>
          <span className="text-[11px] text-otj-muted">Client will be notified to review and approve your proposal</span>
        </div>
      </div>

      {/* Right sidebar — Brief summary */}
      <div className="flex flex-col gap-4">
        <div className="bg-otj-blue-bg border border-otj-blue-border rounded-[14px] p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-blue mb-3">Client's Brief</div>
          {[
            { label: 'Project Type', val: project.projectType },
            { label: 'Mood & Aesthetic', val: project.moodAesthetic || 'Not specified' },
            { label: 'Requested Deliverables', val: project.deliverables },
            { label: 'Usage Rights', val: project.usageRights || 'Not specified' },
            { label: 'Budget', val: project.budget },
            { label: 'Date', val: project.deadline },
          ].map((f, i) => (
            <div key={i} className="mb-2.5 last:mb-0">
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-0.5">{f.label}</div>
              <div className="text-[12px] font-medium text-foreground leading-snug">{f.val}</div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-[14px] p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Project Info</div>
          {[
            { label: 'Client', val: project.clientName },
            { label: 'Company', val: project.clientCompany },
            { label: 'Accepted', val: project.createdAt },
          ].map((f, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
              <div className="text-[11px] text-otj-text">{f.label}</div>
              <div className="text-[12px] font-bold">{f.val}</div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-[14px] p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Proposal Summary</div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <div className="text-[11px] text-otj-text">Phases</div>
            <div className="text-[12px] font-bold">{phases.filter(p => p.title.trim()).length}</div>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <div className="text-[11px] text-otj-text">Total Tasks</div>
            <div className="text-[12px] font-bold">{phases.reduce((acc, p) => acc + p.tasks.filter(t => t.trim()).length, 0)}</div>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <div className="text-[11px] text-otj-text">Deliverables</div>
            <div className="text-[12px] font-bold">{deliverables.filter(d => d.trim()).length}</div>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <div className="text-[11px] text-otj-text">Payment Split</div>
            <div className="text-[12px] font-bold">{milestones.map(m => `${m.percentage}%`).join(' / ')}</div>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <div className="text-[11px] text-otj-text">Payment Method</div>
            <div className="text-[12px] font-bold">{paymentType === 'instapay' ? '📱 InstaPay' : '🏦 Bank'}</div>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <div className="text-[11px] text-otj-text">Price</div>
            <div className="text-[12px] font-extrabold">{numericPrice ? `${numericPrice.toLocaleString()} EGP` : '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
