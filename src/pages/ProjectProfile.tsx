import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';
import { useProjects, PhaseData, PaymentMilestone, PaymentMethod, MeetingData, AttachmentData, ProjectData } from '../context/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { ProposalBuilder } from '../components/ProposalBuilder';
import { ReviewModal, ReviewPayload } from '../components/ReviewModal';
import { ClientProposalReview, ClientPhaseApproval, ClientPaymentTab } from '../components/ClientProjectActions';

const tabs = ['Phases & Tasks', 'Brief', 'Schedule', 'Deliverables', 'Payments'];

const ProjectProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { userRole, getProject, submitProposal, addMeeting, addAttachment, removeAttachment, renameAttachment, completeProject, addReview, clients, confirmPaymentReceipt, toggleTask } = useProjects();
  const isClient = userRole === 'client';

  const navigateToClient = (name: string) => {
    const client = clients.find(c => c.name === name);
    if (client) navigate(`/client/${client.id}`);
  };
  
  // Check for tab query param to auto-select tab
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'brief' ? 1 : tabParam ? parseInt(tabParam) || 0 : 0;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [expandedPhase, setExpandedPhase] = useState(0);
  const attachFileRef = useRef<HTMLInputElement>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewType, setReviewType] = useState<'creative' | 'client'>('client');

  const handleAttachFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !id) return;
    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const iconMap: Record<string, string> = { pdf: '📄', doc: '📄', docx: '📄', jpg: '🌆', jpeg: '🌆', png: '🌆', gif: '🌆', webp: '🌆', mp4: '🎥', mov: '🎥', psd: '🎨', ai: '🎨', fig: '🎨' };
      const icon = iconMap[ext] || '📎';
      const sizeKB = file.size / 1024;
      const size = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
      addAttachment(id, { name: file.name, size, type: file.type, url: URL.createObjectURL(file), uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), icon });
    });
    showToast(`📎 ${files.length} file${files.length > 1 ? 's' : ''} uploaded`);
    e.target.value = '';
  };

  const project = getProject(id || '');

  // Fallback for old hardcoded route /project/1
  const proj = project || {
    id: '1',
    icon: '📸',
    name: 'Edita Re-Branding',
    clientName: 'Randa Hatem',
    clientCompany: 'Edita Group',
    projectType: 'Full Day Campaign Shoot',
    budget: '3,500 EGP',
    deliverables: '40 edited photos (20 product, 10 lifestyle, 10 BTS)',
    date: 'March 5, 2026',
    deadline: 'March 20, 2026',
    moodAesthetic: 'Clean, modern, high-contrast product photography with lifestyle elements',
    usageRights: 'Social media + print ads · 12 months',
    status: 'active' as const,
    proposalDeliverables: [] as string[],
    paymentMilestones: [{ label: '50% Deposit', percentage: 50, status: 'paid' as const }, { label: '50% On Completion', percentage: 50, status: 'held' as const }],
    paymentMethod: undefined as PaymentMethod | undefined,
    proposalPrice: '3,500 EGP',
    phases: [
      { num: 1, title: 'Pre-Production', status: 'complete' as const, tasks: [
        { text: 'Confirm shoot location', done: true, due: 'Mar 5' },
        { text: 'Finalize mood board', done: true, due: 'Mar 7' },
        { text: 'Equipment checklist', done: true, due: 'Mar 8' },
      ]},
      { num: 2, title: 'Shoot Day', status: 'active' as const, tasks: [
        { text: 'Product shots (20 items)', done: true, due: 'Mar 15' },
        { text: 'Lifestyle shots (10 setups)', done: false, due: 'Mar 15' },
        { text: 'Behind-the-scenes content', done: false, due: 'Mar 15' },
      ]},
      { num: 3, title: 'Editing & Delivery', status: 'locked' as const, tasks: [
        { text: 'Color grade all selects', done: false, due: 'Mar 18' },
        { text: 'Retouch hero images', done: false, due: 'Mar 19' },
      ]},
      { num: 4, title: 'Final Delivery', status: 'locked' as const, tasks: [
        { text: 'Upload final files', done: false, due: 'Mar 20' },
        { text: 'Client sign-off', done: false, due: 'Mar 20' },
      ]},
    ],
    escrow: { total: '3,500 EGP', deposited: '1,750 EGP', held: '1,750 EGP', fee: '175 EGP' },
    timeline: [
      { label: 'Brief Created', date: 'Mar 5', status: 'complete' as const },
      { label: 'Brief Approved', date: 'Mar 10', status: 'complete' as const },
      { label: 'Phase 1 Complete', date: 'Mar 12', status: 'complete' as const },
      { label: 'Phase 2 Started', date: 'Mar 13', status: 'active' as const },
    ],
    createdAt: 'March 5, 2026',
    meetings: [] as MeetingData[],
    attachments: [] as AttachmentData[],
    reviews: [],
  };

  const isProposal = proj.status === 'proposal' || (isClient && proj.status === 'pending-deposit');

  const phaseDone = proj.phases.filter(p => p.status === 'complete').length;
  const phaseTotal = proj.phases.length || 1;
  const pctComplete = Math.round((phaseDone / phaseTotal) * 100);
  const currentPhase = proj.phases.find(p => p.status === 'active');
  const daysLeft = 18;
  const numericPrice = parseInt(proj.budget.replace(/[^0-9]/g, '')) || 0;

  const statusLabel = isProposal ? 'Proposal Draft' :
    proj.status === 'pending-deposit' ? 'Awaiting Deposit' :
    proj.status === 'complete' ? 'Completed ✓' :
    currentPhase ? `Phase ${currentPhase.num} · Active` : 'Active';

  const statusClass = isProposal ? 'bg-otj-yellow-bg text-otj-yellow border border-otj-yellow-border' :
    proj.status === 'pending-deposit' ? 'bg-otj-yellow-bg text-otj-yellow border border-otj-yellow-border' :
    proj.status === 'complete' ? 'bg-otj-green-bg text-otj-green border border-otj-green-border' :
    'bg-otj-blue-bg text-otj-blue border border-otj-blue-border';

  const handleCompleteProject = () => {
    completeProject(proj.id);
    showToast('🎉 Project completed!');
    setReviewType('client');
    setShowReviewModal(true);
  };

  const handleReviewSubmit = (review: ReviewPayload) => {
    addReview(proj.id, {
      projectId: proj.id,
      projectName: proj.name,
      reviewerName: reviewType === 'client' ? 'You' : proj.clientName,
      targetName: reviewType === 'client' ? proj.clientName : 'You',
      reviewType: review.reviewType,
      rating: review.rating,
      tags: review.tags,
      text: review.text,
    });
    setShowReviewModal(false);
    if (reviewType === 'client') {
      // After reviewing client, prompt to review as creative
      showToast('✓ Review submitted! Now leave a review as the creative.');
      setReviewType('creative');
      setTimeout(() => setShowReviewModal(true), 500);
    } else {
      showToast('✓ All reviews submitted! Thank you.');
    }
  };

  React.useEffect(() => {
    if (!isProposal) {
      const firstActive = proj.phases.find(p => p.status !== 'locked');
      if (firstActive) setExpandedPhase(firstActive.num);
    }
  }, [proj.id, isProposal]);

  const handleSubmitProposal = (phases: PhaseData[], deliverables: string[], price: string, milestones: PaymentMilestone[], paymentMethod: PaymentMethod) => {
    submitProposal(proj.id, phases, deliverables, price, milestones, paymentMethod);
    showToast('✓ Proposal sent to client for review!');
  };

  return (
    <>
      <NavBar />
      {/* Hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-6 pt-[72px]">
          <div className="flex items-center gap-2 text-[12px] text-otj-text mb-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
            ← Dashboard / Projects
          </div>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[14px] bg-otj-off flex items-center justify-center text-[24px] md:text-[28px] shrink-0">{proj.icon}</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                <div className="text-[18px] md:text-[22px] font-extrabold tracking-[-0.04em] text-foreground">{proj.name}</div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusClass}`}>{statusLabel}</span>
              </div>
              <div className="text-[12px] md:text-[13px] text-otj-text">Client: <span className="cursor-pointer hover:underline text-foreground font-semibold" onClick={() => navigateToClient(proj.clientName)}>{proj.clientName}</span> · {proj.clientCompany}</div>
            </div>
            {!isProposal && proj.status !== 'complete' && (
              <div className="flex gap-2 shrink-0 flex-wrap">
                <button onClick={() => navigate('/messages')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:bg-otj-off">💬 Message</button>
                {isClient ? (
                  <button onClick={() => setActiveTab(0)} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:bg-otj-off">📦 Review Deliverables</button>
                ) : (
                  <>
                    <button onClick={() => showToast('Opening deliverables…')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:bg-otj-off">📦 Deliverables</button>
                    <button onClick={handleCompleteProject} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border-none bg-otj-green text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90">✓ Complete Project</button>
                  </>
                )}
              </div>
            )}
            {proj.status === 'complete' && (
              <div className="flex gap-2 shrink-0 flex-wrap">
                <button onClick={() => { setReviewType('client'); setShowReviewModal(true); }} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:bg-otj-off">⭐ Leave Review</button>
              </div>
            )}
          </div>
          {!isProposal && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-5 pt-4 border-t border-border">
              {[
                { label: '% Complete', val: `${pctComplete}%` },
                { label: 'Days Left', val: String(daysLeft) },
                { label: 'Brief Status', val: 'Approved ✓' },
                { label: 'Phase', val: `${currentPhase?.num || 1} of ${phaseTotal}` },
                { label: 'Total Value', val: proj.budget },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-0.5">{s.label}</div>
                  <div className="text-[14px] font-extrabold tracking-[-0.02em] text-foreground">{s.val}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isProposal ? (
        /* Proposal: Client sees review, Creative sees builder */
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-6 pb-20">
          {isClient && proj.status === 'pending-deposit' ? (
            <ClientProposalReview project={proj} />
          ) : isClient ? (
            <div className="bg-otj-blue-bg border border-otj-blue-border rounded-[14px] p-6 text-center">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-[14px] font-bold text-otj-blue mb-1">Waiting for Creative's Proposal</div>
              <div className="text-[12px] text-otj-text">The creative is preparing their proposal. You'll be notified when it's ready for review.</div>
            </div>
          ) : (
            <ProposalBuilder project={proj} onSubmit={handleSubmitProposal} />
          )}
        </div>
      ) : (
        <>
          {/* Tab bar */}
          <div className="border-b border-border bg-card sticky top-[52px] z-10">
            <div className="max-w-[1100px] mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto hide-scrollbar py-2">
              {tabs.map((t, i) => (
                <button key={t} onClick={() => setActiveTab(i)} className={`text-[12.5px] font-semibold px-4 py-[7px] rounded-full border-[1.5px] cursor-pointer whitespace-nowrap transition-all duration-150 shrink-0 ${
                  activeTab === i ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground'
                }`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-6 pb-20 md:pb-6 flex flex-col md:grid md:grid-cols-[1fr_300px] gap-6">
            <div className="order-1 md:order-none">
              {activeTab === 0 && isClient && (
                <ClientPhaseApproval project={proj} onSwitchToPayments={() => setActiveTab(4)} />
              )}
              {activeTab === 0 && !isClient && (
                <div className="flex flex-col gap-3 animate-fade-up">
                  {proj.phases.map(p => {
                    const isExpanded = expandedPhase === p.num;
                    const borderColor = p.status === 'complete' ? 'border-otj-green' : p.status === 'active' ? 'border-otj-blue' : 'border-border';
                    const statusBadge = p.status === 'complete'
                      ? 'bg-otj-green-bg text-otj-green'
                      : p.status === 'active'
                        ? 'bg-otj-blue-bg text-otj-blue'
                        : 'bg-otj-off text-otj-muted';
                    const phaseStatusLabel = p.status === 'complete' ? '✓ Complete' : p.status === 'active' ? '● In Progress' : '🔒 Locked';

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
                          <div className="px-4 pb-3.5 flex flex-col gap-1.5 border-t border-border pt-3">
                            {p.tasks.map((task, j) => (
                              <div key={j} onClick={() => { if (!task.done && p.status === 'active') { toggleTask(proj.id, p.num, j); showToast('Task marked done ✓'); } }} className={`flex items-center gap-2.5 p-2 px-3 rounded-[9px] transition-all duration-150 hover:bg-otj-off ${!task.done && p.status === 'active' ? 'cursor-pointer' : ''}`}>
                                <div className={`w-[18px] h-[18px] rounded shrink-0 flex items-center justify-center ${task.done ? 'bg-otj-green' : 'border-[1.5px] border-border'}`}>
                                  {task.done && <span className="text-primary-foreground text-[10px]">✓</span>}
                                </div>
                                <div className={`flex-1 text-[13px] font-medium ${task.done ? 'text-otj-muted line-through' : 'text-foreground'}`}>{task.text}</div>
                                <div className="text-[11px] text-otj-muted">{task.due}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {p.status === 'locked' && (
                          <div className="px-4 pb-3.5 border-t border-border pt-3">
                            <div className="text-[12px] text-otj-muted bg-otj-off rounded-lg p-2.5 px-3">⚠️ Milestone Gate — Client must approve Phase {p.num - 1} before this unlocks</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 1 && (
                <div className="animate-fade-up flex flex-col gap-5">
                  {/* Brief Header */}
                  <div>
                    <div className="text-lg font-extrabold tracking-[-0.04em] mb-1">Brief Details</div>
                    <div className="text-[12px] text-otj-muted">Submitted {proj.createdAt}</div>
                  </div>

                  {/* Client Information */}
                  <div className="bg-card border border-border rounded-[14px] p-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">👤 Client Information</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Client Name</div>
                        <div className="text-[13px] font-semibold text-foreground cursor-pointer hover:underline" onClick={() => navigateToClient(proj.clientName)}>{proj.clientName}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Company</div>
                        <div className="text-[13px] font-semibold text-foreground">{proj.clientCompany}</div>
                      </div>
                    </div>
                  </div>

                  {/* Project Overview */}
                  <div className="bg-card border border-border rounded-[14px] p-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">📋 Project Overview</div>
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Project Type</div>
                        <div className="text-[13px] text-foreground">{proj.projectType}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Description</div>
                        <div className="text-[13px] text-foreground leading-relaxed">
                          {proj.name} project for {proj.clientCompany}. This involves creating high-quality deliverables that align with the client's brand vision and marketing objectives.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Creative Requirements */}
                  <div className="bg-card border border-border rounded-[14px] p-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">🎨 Creative Requirements</div>
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Mood & Aesthetic</div>
                        <div className="text-[13px] text-foreground">{proj.moodAesthetic || 'Not specified'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Deliverables</div>
                        <div className="text-[13px] text-foreground">{proj.deliverables}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Usage Rights</div>
                        <div className="text-[13px] text-foreground">{proj.usageRights || 'Not specified'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline & Budget */}
                  <div className="bg-card border border-border rounded-[14px] p-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">📅 Timeline & Budget</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Shoot / Start Date</div>
                        <div className="text-[13px] font-semibold text-foreground">{proj.date}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Final Deadline</div>
                        <div className="text-[13px] font-semibold text-foreground">{proj.deadline}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Proposed Budget</div>
                        <div className="text-[13px] font-extrabold text-otj-green">{proj.budget}</div>
                      </div>
                    </div>
                  </div>

                  {/* Reference Materials (if attachments exist) */}
                  {proj.attachments && proj.attachments.length > 0 && (
                    <div className="bg-card border border-border rounded-[14px] p-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">📎 Reference Materials</div>
                      <div className="flex flex-wrap gap-2">
                        {proj.attachments.slice(0, 4).map((att) => (
                          <div key={att.id} className="flex items-center gap-2 bg-otj-off rounded-lg px-3 py-2 text-[12px]">
                            <span>{att.icon}</span>
                            <span className="font-medium truncate max-w-[120px]">{att.name}</span>
                          </div>
                        ))}
                        {proj.attachments.length > 4 && (
                          <div className="flex items-center gap-2 bg-otj-off rounded-lg px-3 py-2 text-[12px] text-otj-muted">
                            +{proj.attachments.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status Banner */}
                  {proj.status !== 'pending-deposit' && proj.status !== 'proposal' && (
                    <div className="bg-otj-green-bg border border-otj-green-border rounded-[14px] p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-otj-green flex items-center justify-center text-primary-foreground text-lg">✓</div>
                      <div>
                        <div className="text-[13px] font-bold text-otj-green">Brief Approved</div>
                        <div className="text-[11px] text-otj-green/80">Client has approved this brief and the project is active</div>
                      </div>
                    </div>
                  )}
                  {proj.status === 'pending-deposit' && (
                    <div className="bg-otj-yellow-bg border border-otj-yellow-border rounded-[14px] p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-otj-yellow flex items-center justify-center text-primary-foreground text-lg">⏳</div>
                      <div>
                        <div className="text-[13px] font-bold text-otj-yellow">Awaiting Deposit</div>
                        <div className="text-[11px] text-otj-yellow/80">Client must pay 50% deposit before the project can begin</div>
                      </div>
                    </div>
                  )}
                  {proj.status === 'proposal' && (
                    <div className="bg-otj-blue-bg border border-otj-blue-border rounded-[14px] p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-otj-blue flex items-center justify-center text-primary-foreground text-lg">📝</div>
                      <div>
                        <div className="text-[13px] font-bold text-otj-blue">Pending Your Proposal</div>
                        <div className="text-[11px] text-otj-blue/80">Review this brief and submit your proposal with phases, tasks, and pricing</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 2 && (
                <div className="animate-fade-up">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-extrabold tracking-[-0.04em]">📅 Schedule</div>
                    <button onClick={() => showToast('Schedule a meeting from Messages')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-card cursor-pointer hover:border-foreground">+ Add Meeting</button>
                  </div>

                  {/* Meetings */}
                  {proj.meetings.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Meetings & Calls</div>
                      <div className="flex flex-col gap-2">
                        {proj.meetings.map((m, i) => (
                          <div key={i} className="bg-card border border-border rounded-[10px] p-3.5 px-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-otj-green-bg flex items-center justify-center text-sm shrink-0">
                              {m.type === 'call' ? '📞' : m.type === 'shoot' ? '📸' : '🤝'}
                            </div>
                            <div className="flex-1">
                              <div className="text-[13px] font-bold">{m.title}</div>
                              <div className="text-[11px] text-otj-text">{m.date} · {m.time}{m.location ? ` · ${m.location}` : ''}</div>
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green">Scheduled</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Phase deadlines */}
                  <div className="mb-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Phase Deadlines</div>
                    <div className="flex flex-col gap-2">
                      {proj.phases.map((p, i) => (
                        <div key={i} className="bg-card border border-border rounded-[10px] p-3.5 px-4 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                            p.status === 'complete' ? 'bg-otj-green text-primary-foreground' :
                            p.status === 'active' ? 'bg-otj-blue text-primary-foreground' :
                            'bg-otj-off text-otj-muted'
                          }`}>{p.status === 'complete' ? '✓' : p.num}</div>
                          <div className="flex-1">
                            <div className="text-[13px] font-bold">Phase {p.num} — {p.title}</div>
                            <div className="text-[11px] text-otj-text">{p.deadline || 'No deadline set'}</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            p.status === 'complete' ? 'bg-otj-green-bg text-otj-green' :
                            p.status === 'active' ? 'bg-otj-blue-bg text-otj-blue' :
                            'bg-otj-off text-otj-muted'
                          }`}>{p.status === 'complete' ? 'Done' : p.status === 'active' ? 'Active' : 'Locked'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming tasks */}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Upcoming Tasks</div>
                    <div className="flex flex-col gap-2">
                      {proj.phases.flatMap(ph => ph.tasks.filter(t => !t.done).map(t => ({ ...t, phase: ph.num, phaseTitle: ph.title }))).map((t, i) => (
                        <div key={i} className="bg-card border border-border rounded-[10px] p-3 px-4 flex items-center gap-3">
                          <div className="w-[18px] h-[18px] rounded border-[1.5px] border-border shrink-0" />
                          <div className="flex-1">
                            <div className="text-[13px] font-medium">{t.text}</div>
                            <div className="text-[11px] text-otj-text">Phase {t.phase} · Due {t.due}</div>
                          </div>
                        </div>
                      ))}
                      {proj.phases.flatMap(ph => ph.tasks.filter(t => !t.done)).length === 0 && (
                        <div className="text-[12px] text-otj-muted text-center py-3">All tasks complete 🎉</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="animate-fade-up">
                  {proj.proposalDeliverables.length > 0 ? (
                    <>
                      <div className="text-lg font-extrabold tracking-[-0.04em] mb-4">Deliverables</div>
                      <div className="flex flex-col gap-2">
                        {proj.proposalDeliverables.map((d, i) => (
                          <div key={i} className="bg-card border border-border rounded-[10px] p-3.5 px-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-otj-off flex items-center justify-center text-sm">📦</div>
                            <div className="text-[13px] font-medium text-foreground flex-1">{d}</div>
                            <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-otj-off text-otj-muted">Pending</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-otj-yellow-bg border border-otj-yellow-border rounded-[14px] p-4 mb-4">
                        <div className="text-[13px] font-bold text-otj-yellow mb-1">🔒 Deliverables Locked</div>
                        <div className="text-[12px] text-otj-text">Deliverables will be available after Phase 3 (Editing & Delivery) is complete and approved by the client.</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {['Final Product Shots', 'Lifestyle Gallery', 'BTS Content'].map((f, i) => (
                          <div key={i} className="bg-otj-off border border-border rounded-xl p-4 text-center opacity-50">
                            <div className="text-2xl mb-2">🔒</div>
                            <div className="text-[12px] font-bold text-otj-muted">{f}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === 4 && isClient && (
                <ClientPaymentTab project={proj} />
              )}
              {activeTab === 4 && !isClient && (
                <CreativePaymentView project={proj} numericPrice={numericPrice} confirmPaymentReceipt={confirmPaymentReceipt} />
              )}
            </div>

            {/* Right sidebar - shows below content on mobile */}
            <div className="flex flex-col gap-4 order-2 md:order-none">
              <div className="bg-card border border-border rounded-[14px] p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Project Info</div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-x-4">
                  {[
                    { label: 'Client', val: proj.clientName },
                    { label: 'Company', val: proj.clientCompany },
                    { label: 'Started', val: proj.createdAt },
                    { label: 'Deadline', val: proj.deadline },
                    { label: 'Type', val: proj.projectType },
                    { label: 'Budget', val: proj.budget },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0 md:last:border-0">
                      <div className="text-[11px] text-otj-text">{f.label}</div>
                      <div className="text-[12px] font-bold">{f.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-[14px] p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Phase Progress</div>
                {proj.phases.map(p => (
                  <div key={p.num} className="flex items-center gap-2 mb-2 last:mb-0">
                    <div className="text-[11px] font-bold text-otj-text w-3 shrink-0">{p.num}</div>
                    <div className="flex-1 h-1.5 rounded-full bg-otj-light overflow-hidden">
                      <div className={`h-full rounded-full ${
                        p.status === 'complete' ? 'bg-otj-green w-full' : p.status === 'active' ? 'bg-otj-blue w-1/2' : 'bg-otj-light w-0'
                      }`} />
                    </div>
                    <div className={`text-[10px] font-bold ${
                      p.status === 'complete' ? 'text-otj-green' : p.status === 'active' ? 'text-otj-blue' : 'text-otj-muted'
                    }`}>{p.status === 'complete' ? '✓' : p.status === 'active' ? '●' : '🔒'}</div>
                  </div>
                ))}
                {proj.phases.length === 0 && (
                  <div className="text-[12px] text-otj-muted text-center py-2">Define phases in your proposal</div>
                )}
              </div>

              <div className="bg-card border border-border rounded-[14px] p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Payment Summary</div>
                {[
                  { label: 'Total', val: proj.budget, bold: true },
                ].map((f, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <div className="text-[11px] text-otj-text">{f.label}</div>
                    <div className={`text-[12px] ${f.bold ? 'font-extrabold text-foreground' : 'font-bold text-otj-text'}`}>{f.val}</div>
                  </div>
                ))}
                {proj.paymentMilestones.map((m, i) => {
                  const amount = numericPrice > 0 ? `${Math.round(numericPrice * m.percentage / 100).toLocaleString()} EGP` : '—';
                  return (
                    <div key={i} className="flex items-center justify-between py-1.5 border-t border-border">
                      <div className="text-[11px] text-otj-text">{m.label} ({m.percentage}%)</div>
                      <div className="text-[12px] font-bold text-otj-text">{amount}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
      <Toast />
      <ReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
        projectName={proj.name}
        targetName={reviewType === 'client' ? proj.clientName : 'You'}
        reviewType={reviewType}
      />
    </>
  );
};

// ─── Creative Payment View ────────────────────────────────
const CreativePaymentView: React.FC<{
  project: ProjectData;
  numericPrice: number;
  confirmPaymentReceipt: (projectId: string, milestoneIndex: number) => void;
}> = ({ project, numericPrice, confirmPaymentReceipt }) => {
  const [confirmIdx, setConfirmIdx] = useState<number | null>(null);

  return (
    <div className="animate-fade-up">
      <div className="text-lg font-extrabold tracking-[-0.04em] mb-4">💰 Payment Milestones</div>
      {project.paymentMilestones.map((m, i) => {
        const amount = numericPrice > 0 ? `${Math.round(numericPrice * m.percentage / 100).toLocaleString()} EGP` : '—';
        const statusLabel = m.status === 'paid' ? 'Received ✓' : m.status === 'proof-submitted' ? '📎 Proof Uploaded — Confirm?' : 'Awaiting Payment';
        const statusClass = m.status === 'paid' ? 'text-otj-green' : m.status === 'proof-submitted' ? 'text-otj-blue' : 'text-otj-muted';

        return (
          <div key={i} className={`bg-card border rounded-[14px] p-4 mb-3 ${m.status === 'proof-submitted' ? 'border-otj-blue border-[1.5px]' : 'border-border'}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[13px] font-bold">{m.label} ({m.percentage}%)</div>
                <div className={`text-[11px] font-bold ${statusClass}`}>{statusLabel}</div>
              </div>
              <div className="text-[16px] font-extrabold">{amount}</div>
            </div>

            {/* Show proof screenshot from client */}
            {m.status === 'proof-submitted' && m.proofUrl && (
              <div className="border-t border-border pt-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-blue mb-2">📎 Client's Transfer Proof</div>
                <div className="flex items-center gap-3 bg-otj-blue-bg border border-otj-blue-border rounded-[10px] p-3">
                  <img src={m.proofUrl} alt="Transfer proof" className="w-16 h-16 rounded-lg object-cover border border-border cursor-pointer" onClick={() => window.open(m.proofUrl, '_blank')} />
                  <div className="flex-1">
                    <div className="text-[12px] font-bold text-foreground">{m.proofName || 'transfer-proof.jpg'}</div>
                    <div className="text-[10px] text-otj-muted">Click image to view full size</div>
                  </div>
                </div>
                <button
                  onClick={() => setConfirmIdx(i)}
                  className="w-full mt-3 text-[12px] font-bold py-2.5 rounded-full border-none bg-otj-green text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90"
                >
                  ✓ Confirm Payment Received
                </button>
              </div>
            )}

            {/* Confirmed payment */}
            {m.status === 'paid' && m.proofUrl && (
              <div className="border-t border-border pt-3 flex items-center gap-3">
                <img src={m.proofUrl} alt="Transfer proof" className="w-10 h-10 rounded-lg object-cover border border-border" />
                <div className="text-[11px] text-otj-green font-bold">✓ Payment received & confirmed</div>
              </div>
            )}
          </div>
        );
      })}

      {project.paymentMethod && (
        <div className="bg-otj-off rounded-[10px] p-3.5 px-4 mt-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">Your Payment Method</div>
          {project.paymentMethod.type === 'instapay' ? (
            <div className="text-[13px] font-bold">📱 InstaPay — {project.paymentMethod.instapayHandle}</div>
          ) : (
            <div className="text-[13px] font-bold">🏦 {project.paymentMethod.bankName} — {project.paymentMethod.accountName} · {project.paymentMethod.accountNumber}</div>
          )}
        </div>
      )}

      {/* Confirm Receipt Dialog */}
      <Dialog open={confirmIdx !== null} onOpenChange={() => setConfirmIdx(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-extrabold">Confirm Payment Received</DialogTitle>
            <DialogDescription className="text-[13px]">
              {confirmIdx !== null && `Confirm that you've received ${numericPrice > 0 ? `${Math.round(numericPrice * project.paymentMilestones[confirmIdx].percentage / 100).toLocaleString()} EGP` : '—'} for "${project.paymentMilestones[confirmIdx!]?.label}"?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setConfirmIdx(null)} className="rounded-full text-[12px] font-bold">Cancel</Button>
            <Button onClick={() => {
              if (confirmIdx !== null) {
                confirmPaymentReceipt(project.id, confirmIdx);
                setConfirmIdx(null);
                showToast('✓ Payment confirmed! Client has been notified.');
              }
            }} className="rounded-full text-[12px] font-bold bg-otj-green hover:bg-otj-green/90 text-primary-foreground">
              ✓ Confirm Received
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectProfile;
