import React, { useState, useRef, useEffect } from 'react';
import { useProjects, ProjectData } from '../context/ProjectContext';
import { showToast } from './Toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

// ─── Proposal Review ───────────────────────────────────────
export const ClientProposalReview: React.FC<{ project: ProjectData }> = ({ project }) => {
  const { acceptProposal, rejectProposal } = useProjects();
  const numericPrice = parseInt(project.proposalPrice.replace(/[^0-9]/g, '')) || 0;

  return (
    <div className="animate-fade-up flex flex-col gap-5">
      <div>
        <div className="text-lg font-extrabold tracking-[-0.04em] mb-1">📋 Proposal from Creative</div>
        <div className="text-[12px] text-otj-muted">Review the creative's proposed plan, deliverables, and pricing</div>
      </div>

      {/* Phases */}
      {project.phases.length > 0 && (
        <div className="bg-card border border-border rounded-[14px] p-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">📌 Proposed Phases</div>
          <div className="flex flex-col gap-2">
            {project.phases.map(p => (
              <div key={p.num} className="flex items-center gap-3 p-2.5 px-3 rounded-[10px] bg-otj-off">
                <div className="w-7 h-7 rounded-lg bg-otj-blue-bg flex items-center justify-center text-[12px] font-bold text-otj-blue shrink-0">{p.num}</div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold">{p.title}</div>
                  <div className="text-[11px] text-otj-muted">{p.tasks.length} task{p.tasks.length !== 1 ? 's' : ''}{p.deadline ? ` · Due ${p.deadline}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deliverables */}
      {project.proposalDeliverables.length > 0 && (
        <div className="bg-card border border-border rounded-[14px] p-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">📦 Deliverables</div>
          <div className="flex flex-col gap-1.5">
            {project.proposalDeliverables.map((d, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 px-3 rounded-[9px] bg-otj-off">
                <span className="text-otj-green text-[12px]">✓</span>
                <span className="text-[13px] font-medium">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing & Milestones */}
      <div className="bg-card border border-border rounded-[14px] p-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">💰 Pricing & Payment</div>
        <div className="text-[22px] font-extrabold tracking-[-0.04em] text-foreground mb-3">{project.proposalPrice}</div>
        {project.paymentMilestones.map((m, i) => {
          const amount = numericPrice > 0 ? `${Math.round(numericPrice * m.percentage / 100).toLocaleString()} EGP` : '—';
          return (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="text-[13px] font-medium">{m.label}</div>
              <div className="text-[13px] font-bold">{amount} ({m.percentage}%)</div>
            </div>
          );
        })}
      </div>

      {/* Payment Method */}
      {project.paymentMethod && (
        <div className="bg-otj-off rounded-[14px] p-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Payment Method</div>
          {project.paymentMethod.type === 'instapay' ? (
            <div className="text-[13px] font-bold">📱 InstaPay — {project.paymentMethod.instapayHandle}</div>
          ) : (
            <div className="text-[13px] font-bold">🏦 {project.paymentMethod.bankName} — {project.paymentMethod.accountName}</div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => acceptProposal(project.id)}
          className="text-[12px] font-bold px-5 py-2.5 rounded-full border-none bg-otj-green text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90"
        >
          ✓ Accept Proposal
        </button>
        <button
          onClick={() => showToast('💬 Opening messages to discuss changes…')}
          className="text-[12px] font-bold px-5 py-2.5 rounded-full border-[1.5px] border-otj-blue bg-otj-blue-bg text-otj-blue cursor-pointer transition-all duration-150 hover:bg-otj-blue hover:text-primary-foreground"
        >
          ↩ Counter Proposal
        </button>
        <button
          onClick={() => rejectProposal(project.id)}
          className="text-[12px] font-bold px-5 py-2.5 rounded-full border-[1.5px] border-destructive bg-card text-destructive cursor-pointer transition-all duration-150 hover:bg-destructive hover:text-destructive-foreground"
        >
          ✕ Reject
        </button>
      </div>
    </div>
  );
};

// ─── Phase Approval ────────────────────────────────────────
export const ClientPhaseApproval: React.FC<{ project: ProjectData; onSwitchToPayments?: () => void }> = ({ project, onSwitchToPayments }) => {
  const { approvePhase, requestAmends } = useProjects();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [approvedPhaseNum, setApprovedPhaseNum] = useState<number | null>(null);
  const [amendsPhaseNum, setAmendsPhaseNum] = useState<number | null>(null);
  const [amendNote, setAmendNote] = useState('');
  const [amendDeadline, setAmendDeadline] = useState('');
  const [expandedPhase, setExpandedPhase] = useState(() => {
    const first = project.phases.find(p => p.status === 'active');
    return first?.num || 0;
  });

  const numericPrice = parseInt(project.budget.replace(/[^0-9]/g, '')) || 0;

  // Find the next unpaid milestone
  const nextMilestoneIndex = project.paymentMilestones.findIndex(m => m.status !== 'paid' && m.status !== 'proof-submitted');

  const handleApprovePhase = (phaseNum: number) => {
    approvePhase(project.id, phaseNum);
    setApprovedPhaseNum(phaseNum);
    // Auto-suggest payment proof upload
    if (nextMilestoneIndex >= 0) {
      setTimeout(() => setPaymentModalOpen(true), 600);
    }
  };

  const handleGoToPayments = () => {
    setPaymentModalOpen(false);
    setApprovedPhaseNum(null);
    onSwitchToPayments?.();
  };

  const openAmendsModal = (phaseNum: number) => {
    const phase = project.phases.find(ph => ph.num === phaseNum);
    setAmendsPhaseNum(phaseNum);
    setAmendNote('');
    setAmendDeadline(phase?.deadline ? phase.deadline.slice(0, 10) : '');
  };

  const submitAmends = () => {
    if (amendsPhaseNum === null || !amendNote.trim()) return;
    requestAmends(project.id, amendsPhaseNum, amendNote.trim(), amendDeadline || undefined);
    showToast('Amends requested ✓ Creative will be notified.');
    setAmendsPhaseNum(null);
    setAmendNote('');
    setAmendDeadline('');
  };

  const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  return (
    <div className="flex flex-col gap-3 animate-fade-up">
      {project.phases.map(p => {
        const isExpanded = expandedPhase === p.num;
        const canApprove = p.status === 'active' && !!p.readyForReview;
        const amends = p.amends || [];
        const latestAmend = amends.length > 0 ? amends[amends.length - 1] : null;
        const hasOpenAmend = !!latestAmend && p.status === 'active' && !p.readyForReview;
        const borderColor = p.status === 'complete'
          ? 'border-otj-green'
          : hasOpenAmend
            ? 'border-otj-yellow'
            : p.status === 'active' ? 'border-otj-blue' : 'border-border';
        const statusBadge = p.status === 'complete'
          ? 'bg-otj-green-bg text-otj-green'
          : p.status === 'active'
            ? (p.readyForReview ? 'bg-otj-yellow-bg text-otj-yellow' : hasOpenAmend ? 'bg-otj-yellow-bg text-otj-yellow' : 'bg-otj-blue-bg text-otj-blue')
            : 'bg-otj-off text-otj-muted';
        const phaseStatusLabel = p.status === 'complete'
          ? '✓ Approved'
          : p.status === 'active'
            ? (p.readyForReview ? '⏳ Ready for Review' : hasOpenAmend ? `↻ Amends Requested${amends.length > 1 ? ` · R${amends.length}` : ''}` : '● In Progress')
            : '🔒 Locked';

        return (
          <div key={p.num} className={`bg-card border-[1.5px] ${borderColor} rounded-[14px] overflow-hidden transition-all duration-200`}>
            <div onClick={() => p.status !== 'locked' && setExpandedPhase(isExpanded ? 0 : p.num)} className={`p-3.5 px-4 flex items-center gap-3 ${p.status !== 'locked' ? 'cursor-pointer' : 'opacity-60'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                p.status === 'complete' ? 'bg-otj-green text-primary-foreground' :
                p.status === 'active' ? 'bg-otj-blue text-primary-foreground' :
                'bg-otj-off text-otj-muted'
              }`}>{p.status === 'complete' ? '✓' : p.num}</div>
              <div className="flex-1">
                <div className="text-[13.5px] font-extrabold tracking-[-0.02em]">Phase {p.num} — {p.title}</div>
              </div>
              <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${statusBadge}`}>{phaseStatusLabel}</span>
              {p.status !== 'locked' && <span className="text-otj-muted text-sm">{isExpanded ? '▾' : '▸'}</span>}
            </div>
            {isExpanded && p.status !== 'locked' && (
              <div className="px-4 pb-4 border-t border-border pt-3 flex flex-col gap-3">
                {p.description ? (
                  <p className="text-[13px] text-foreground leading-[1.7] tracking-[-0.005em]">{p.description}</p>
                ) : (
                  <p className="text-[12.5px] text-otj-muted italic">The creative hasn't added a description for this phase yet.</p>
                )}
                {p.deadline && (
                  <div className="text-[11px] text-otj-muted">Deadline: <span className="font-semibold text-otj-text">{fmtDate(p.deadline)}</span></div>
                )}

                {/* Amends history */}
                {amends.length > 0 && (
                  <div className="bg-otj-off rounded-[12px] p-3 flex flex-col gap-2">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Amends History</div>
                    {amends.map(a => {
                      const shownDeadline = a.acceptedDeadline || a.newDeadline;
                      return (
                        <div key={a.round} className="bg-card border border-border rounded-[10px] p-2.5 px-3">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="text-[11.5px] font-extrabold">Round {a.round}</div>
                            {shownDeadline ? (
                              <span className="text-[10.5px] font-bold text-otj-green">Confirmed deadline: {fmtDate(shownDeadline)}</span>
                            ) : a.proposedDeadline ? (
                              <span className="text-[10.5px] font-bold text-otj-muted">You suggested: {fmtDate(a.proposedDeadline)} · awaiting creative</span>
                            ) : null}
                          </div>
                          <p className="text-[12px] text-foreground leading-[1.55] whitespace-pre-wrap">{a.note}</p>
                          {a.acceptedNote && (
                            <div className="mt-1.5 pt-1.5 border-t border-border">
                              <div className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Note from creative</div>
                              <p className="text-[11.5px] text-foreground leading-[1.5] whitespace-pre-wrap italic">{a.acceptedNote}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {canApprove && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApprovePhase(p.num); }}
                      className="flex-1 text-[12px] font-bold py-2.5 rounded-full border-none bg-otj-green text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90"
                    >
                      ✓ Approve Phase {p.num}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); openAmendsModal(p.num); }}
                      className="flex-1 text-[12px] font-bold py-2.5 rounded-full border-[1.5px] border-otj-yellow bg-otj-yellow-bg text-otj-yellow cursor-pointer transition-all duration-150 hover:opacity-90"
                    >
                      ↻ Request Amends
                    </button>
                  </div>
                )}
                {p.status === 'active' && !canApprove && hasOpenAmend && (
                  <div className="text-[11.5px] text-otj-text bg-otj-yellow-bg border border-otj-yellow-border rounded-lg p-2.5 px-3">
                    ↻ Waiting for the creative to address your amends and re-submit for review.
                  </div>
                )}
                {p.status === 'active' && !canApprove && !hasOpenAmend && (
                  <div className="text-[11px] text-otj-muted text-center py-2 bg-otj-off rounded-lg">
                    ⏳ Waiting for the creative to mark this phase as ready for your review
                  </div>
                )}
              </div>
            )}
            {p.status === 'locked' && (
              <div className="px-4 pb-3.5 border-t border-border pt-3">
                <div className="text-[12px] text-otj-muted bg-otj-off rounded-lg p-2.5 px-3">🔒 Previous phase must be approved first</div>
              </div>
            )}
          </div>
        );
      })}

      {/* Request Amends Modal */}
      <Dialog open={amendsPhaseNum !== null} onOpenChange={(open) => !open && setAmendsPhaseNum(null)}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-extrabold tracking-[-0.03em]">
              ↻ Request Amends — Phase {amendsPhaseNum}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-otj-text">
              Describe the changes you need and propose a new deadline. The creative will be notified and can re-submit for review.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 my-1">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">What needs to change</div>
              <Textarea
                value={amendNote}
                onChange={(e) => setAmendNote(e.target.value)}
                placeholder="e.g. Lifestyle shots feel too cool — please re-grade with warmer tones and reshoot the 3 hero frames against a lighter backdrop."
                rows={5}
                className="text-[13px]"
              />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">Suggested deadline (optional)</div>
              <Input
                type="date"
                value={amendDeadline}
                onChange={(e) => setAmendDeadline(e.target.value)}
                className="text-[13px]"
              />
              <div className="text-[10.5px] text-otj-muted mt-1.5 leading-snug">The creative will confirm the actual deadline based on the scope of changes.</div>
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setAmendsPhaseNum(null)} className="rounded-full text-[12px] font-bold">
              Cancel
            </Button>
            <Button
              onClick={submitAmends}
              disabled={!amendNote.trim()}
              className="rounded-full text-[12px] font-bold bg-otj-yellow hover:bg-otj-yellow/90 text-primary-foreground disabled:opacity-50"
            >
              ↻ Send Amend Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Proof Prompt Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-extrabold tracking-[-0.03em]">
              📎 Upload Payment Proof
            </DialogTitle>
            <DialogDescription className="text-[13px] text-otj-text">
              Phase {approvedPhaseNum} has been approved! Please transfer the milestone payment and upload the bank transfer screenshot as proof.
            </DialogDescription>
          </DialogHeader>
          {nextMilestoneIndex >= 0 && (
            <div className="bg-otj-blue-bg border border-otj-blue-border rounded-[12px] p-4 my-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-otj-blue mb-1">Amount Due</div>
              <div className="text-[18px] font-extrabold text-foreground">
                {numericPrice > 0 ? `${Math.round(numericPrice * project.paymentMilestones[nextMilestoneIndex].percentage / 100).toLocaleString()} EGP` : '—'}
              </div>
              <div className="text-[12px] text-otj-text mt-0.5">
                {project.paymentMilestones[nextMilestoneIndex].label} ({project.paymentMilestones[nextMilestoneIndex].percentage}%)
              </div>
              {project.paymentMethod && (
                <div className="mt-2 pt-2 border-t border-border text-[11px] text-otj-muted">
                  {project.paymentMethod.type === 'instapay'
                    ? `📱 InstaPay — ${project.paymentMethod.instapayHandle}`
                    : `🏦 ${project.paymentMethod.bankName} — ${project.paymentMethod.accountName}`}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setPaymentModalOpen(false)} className="rounded-full text-[12px] font-bold">
              Later
            </Button>
            <Button onClick={handleGoToPayments} className="rounded-full text-[12px] font-bold bg-otj-green hover:bg-otj-green/90 text-primary-foreground">
              📎 Go to Payments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Client Payment Tab ────────────────────────────────────
export const ClientPaymentTab: React.FC<{ project: ProjectData }> = ({ project }) => {
  const { submitPaymentProof } = useProjects();
  const numericPrice = parseInt(project.budget.replace(/[^0-9]/g, '')) || 0;
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);
  const [localProofs, setLocalProofs] = useState<Record<number, { url: string; name: string }>>({});
  const [autoPromptShown, setAutoPromptShown] = useState(false);
  const [autoPromptOpen, setAutoPromptOpen] = useState(false);
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Find the first pending (unpaid, no proof) milestone
  const pendingMilestoneIndex = project.paymentMilestones.findIndex(m => m.status !== 'paid' && m.status !== 'proof-submitted');

  // Auto-prompt on mount if there's a pending milestone
  useEffect(() => {
    if (!autoPromptShown && pendingMilestoneIndex >= 0) {
      const timer = setTimeout(() => {
        setAutoPromptOpen(true);
        setAutoPromptShown(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPromptShown, pendingMilestoneIndex]);

  const handleProofUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalProofs(prev => ({ ...prev, [idx]: { url, name: file.name } }));
    showToast('📎 Transfer screenshot attached');
    e.target.value = '';
  };

  const handleConfirmPayment = () => {
    if (confirmIdx === null) return;
    const proof = localProofs[confirmIdx];
    if (proof) {
      submitPaymentProof(project.id, confirmIdx, proof.url, proof.name);
    }
    setConfirmIdx(null);
    showToast('✓ Payment proof submitted! Creative will be notified.');
  };

  return (
    <div className="animate-fade-up">
      <div className="text-lg font-extrabold tracking-[-0.04em] mb-4">💰 Payment Milestones</div>
      <div className="bg-otj-off rounded-[14px] p-4 mb-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Total Project Value</div>
        <div className="text-[22px] font-extrabold text-foreground">{project.budget}</div>
        <div className="text-[11px] text-otj-muted mt-0.5">External payment — attach bank transfer proof below</div>
      </div>

      {project.paymentMilestones.map((m, i) => {
        const amount = numericPrice > 0 ? `${Math.round(numericPrice * m.percentage / 100).toLocaleString()} EGP` : '—';
        const statusLabel = m.status === 'paid' ? 'Confirmed ✓' : m.status === 'proof-submitted' ? '⏳ Awaiting Confirmation' : 'Awaiting Payment';
        const statusClass = m.status === 'paid' ? 'text-otj-green' : m.status === 'proof-submitted' ? 'text-otj-yellow' : 'text-otj-muted';
        const proof = localProofs[i] || (m.proofUrl ? { url: m.proofUrl, name: m.proofName || 'proof.jpg' } : null);

        return (
          <div key={i} className="bg-card border border-border rounded-[14px] p-4 mb-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[13px] font-bold">{m.label} ({m.percentage}%)</div>
                <div className={`text-[11px] font-bold ${statusClass}`}>{statusLabel}</div>
              </div>
              <div className="text-[16px] font-extrabold">{amount}</div>
            </div>

            {/* Upload area — only when not yet submitted */}
            {m.status !== 'paid' && m.status !== 'proof-submitted' && (
              <div className="border-t border-border pt-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-2">📎 Attach Bank Transfer Screenshot</div>
                <input
                  ref={el => { fileRefs.current[i] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleProofUpload(i, e)}
                />
                {proof ? (
                  <div className="flex items-center gap-3 bg-otj-green-bg border border-otj-green-border rounded-[10px] p-2.5 px-3">
                    <img src={proof.url} alt="Transfer proof" className="w-12 h-12 rounded-lg object-cover border border-border" />
                    <div className="flex-1">
                      <div className="text-[12px] font-bold text-otj-green">Screenshot Attached</div>
                      <div className="text-[10px] text-otj-muted truncate max-w-[180px]">{proof.name}</div>
                    </div>
                    <button
                      onClick={() => fileRefs.current[i]?.click()}
                      className="text-[10px] font-bold px-3 py-1 rounded-full border border-border bg-card text-otj-text cursor-pointer hover:border-foreground"
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRefs.current[i]?.click()}
                    className="w-full border-2 border-dashed border-border rounded-[10px] p-4 text-center cursor-pointer transition-all duration-150 hover:border-primary hover:bg-accent/30"
                  >
                    <div className="text-xl mb-1">📷</div>
                    <div className="text-[11px] font-semibold text-otj-text">Tap to upload transfer screenshot</div>
                    <div className="text-[9px] text-otj-muted mt-0.5">JPG, PNG accepted</div>
                  </button>
                )}

                {proof && (
                  <button
                    onClick={() => setConfirmIdx(i)}
                    className="w-full mt-2.5 text-[12px] font-bold py-2.5 rounded-full border-none bg-otj-green text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90"
                  >
                    ✓ Submit Payment Proof
                  </button>
                )}
              </div>
            )}

            {/* Proof submitted — awaiting creative confirmation */}
            {m.status === 'proof-submitted' && proof && (
              <div className="border-t border-border pt-3">
                <div className="flex items-center gap-3 bg-otj-yellow-bg border border-otj-yellow-border rounded-[10px] p-2.5 px-3">
                  <img src={proof.url} alt="Transfer proof" className="w-12 h-12 rounded-lg object-cover border border-border" />
                  <div className="flex-1">
                    <div className="text-[12px] font-bold text-otj-yellow">Proof Sent — Awaiting Confirmation</div>
                    <div className="text-[10px] text-otj-muted">Creative will review and confirm receipt</div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmed */}
            {m.status === 'paid' && proof && (
              <div className="border-t border-border pt-3 flex items-center gap-3">
                <img src={proof.url} alt="Transfer proof" className="w-10 h-10 rounded-lg object-cover border border-border" />
                <div className="text-[11px] text-otj-green font-bold">✓ Payment confirmed by creative</div>
              </div>
            )}
          </div>
        );
      })}

      {project.paymentMethod && (
        <div className="bg-otj-off rounded-[14px] p-4 mt-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">Payment Method</div>
          {project.paymentMethod.type === 'instapay' ? (
            <div className="text-[13px] font-bold">📱 InstaPay — {project.paymentMethod.instapayHandle}</div>
          ) : (
            <div className="text-[13px] font-bold">🏦 {project.paymentMethod.bankName} — {project.paymentMethod.accountName} · {project.paymentMethod.accountNumber}</div>
          )}
        </div>
      )}

      {/* Confirm Payment Dialog */}
      <Dialog open={confirmIdx !== null} onOpenChange={() => setConfirmIdx(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-extrabold">Submit Payment Proof</DialogTitle>
            <DialogDescription className="text-[13px]">
              {confirmIdx !== null && `Submit transfer proof for ${numericPrice > 0 ? `${Math.round(numericPrice * project.paymentMilestones[confirmIdx].percentage / 100).toLocaleString()} EGP` : '—'} (${project.paymentMilestones[confirmIdx!]?.label})? The creative will be notified to confirm receipt.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setConfirmIdx(null)} className="rounded-full text-[12px] font-bold">Cancel</Button>
            <Button onClick={handleConfirmPayment} className="rounded-full text-[12px] font-bold bg-otj-green hover:bg-otj-green/90 text-primary-foreground">
              ✓ Submit Proof
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto-prompt Payment Reminder */}
      <Dialog open={autoPromptOpen} onOpenChange={setAutoPromptOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-extrabold tracking-[-0.03em]">
              📎 Payment Proof Required
            </DialogTitle>
            <DialogDescription className="text-[13px] text-otj-text">
              You have a pending milestone payment. Please transfer the amount and upload your bank transfer screenshot as proof.
            </DialogDescription>
          </DialogHeader>
          {pendingMilestoneIndex >= 0 && (
            <div className="bg-otj-blue-bg border border-otj-blue-border rounded-[12px] p-4 my-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-otj-blue mb-1">Amount Due</div>
              <div className="text-[18px] font-extrabold text-foreground">
                {numericPrice > 0 ? `${Math.round(numericPrice * project.paymentMilestones[pendingMilestoneIndex].percentage / 100).toLocaleString()} EGP` : '—'}
              </div>
              <div className="text-[12px] text-otj-text mt-0.5">
                {project.paymentMilestones[pendingMilestoneIndex].label} ({project.paymentMilestones[pendingMilestoneIndex].percentage}%)
              </div>
              {project.paymentMethod && (
                <div className="mt-2 pt-2 border-t border-border text-[11px] text-otj-muted">
                  {project.paymentMethod.type === 'instapay'
                    ? `📱 InstaPay — ${project.paymentMethod.instapayHandle}`
                    : `🏦 ${project.paymentMethod.bankName} — ${project.paymentMethod.accountName}`}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setAutoPromptOpen(false)} className="rounded-full text-[12px] font-bold">
              Later
            </Button>
            <Button onClick={() => { setAutoPromptOpen(false); if (pendingMilestoneIndex >= 0) fileRefs.current[pendingMilestoneIndex]?.click(); }} className="rounded-full text-[12px] font-bold bg-otj-green hover:bg-otj-green/90 text-primary-foreground">
              📷 Upload Proof Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
