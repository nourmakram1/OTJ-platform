import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';
import { useProjects } from '../context/ProjectContext';

const tabs = ['Phases & Tasks', 'Brief', 'Attachments', 'Deliverables', 'Payments', 'Timeline', 'Team'];

const ProjectProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getProject } = useProjects();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedPhase, setExpandedPhase] = useState(0);

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
      { label: 'Phase 2 Shoot Day', date: 'Mar 15', status: 'upcoming' as const },
      { label: 'Phase 3 Editing', date: 'Mar 16–19', status: 'locked' as const },
      { label: 'Final Delivery', date: 'Mar 20', status: 'locked' as const },
    ],
    createdAt: 'March 5, 2026',
  };

  const phaseDone = proj.phases.filter(p => p.status === 'complete').length;
  const phaseTotal = proj.phases.length;
  const pctComplete = Math.round((phaseDone / phaseTotal) * 100);
  const currentPhase = proj.phases.find(p => p.status === 'active');
  const daysLeft = 18; // simplified
  const statusLabel = currentPhase ? `Phase ${currentPhase.num} · Active` : proj.status === 'pending-deposit' ? 'Awaiting Deposit' : 'Active';
  const statusClass = proj.status === 'pending-deposit' ? 'bg-otj-yellow-bg text-otj-yellow border border-otj-yellow-border' : 'bg-otj-blue-bg text-otj-blue border border-otj-blue-border';

  // Auto-expand first non-locked phase
  React.useEffect(() => {
    const firstActive = proj.phases.find(p => p.status !== 'locked');
    if (firstActive) setExpandedPhase(firstActive.num);
  }, [proj.id]);

  return (
    <>
      <NavBar />
      {/* Hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[1100px] mx-auto px-8 py-6 pt-[72px]">
          <div className="flex items-center gap-2 text-[12px] text-otj-text mb-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
            ← Dashboard / Projects
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-[14px] bg-otj-off flex items-center justify-center text-[28px] shrink-0">{proj.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="text-[22px] font-extrabold tracking-[-0.04em] text-foreground">{proj.name}</div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusClass}`}>{statusLabel}</span>
              </div>
              <div className="text-[13px] text-otj-text">Client: {proj.clientName} · {proj.clientCompany}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => navigate('/messages')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:bg-otj-off">💬 Message</button>
              <button onClick={() => showToast('Opening deliverables…')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:bg-otj-off">📦 Deliverables</button>
              <button onClick={() => showToast('Marking phase done…')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:bg-primary/90">✓ Mark Phase Done</button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3 mt-5 pt-4 border-t border-border">
            {[
              { label: '% Complete', val: `${pctComplete}%` },
              { label: 'Days Left', val: String(daysLeft) },
              { label: 'Brief Status', val: 'Approved ✓' },
              { label: 'Phase', val: `${currentPhase?.num || 1} of ${phaseTotal}` },
              { label: 'Total Value', val: proj.budget },
              { label: 'In Escrow', val: proj.escrow.held },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-0.5">{s.label}</div>
                <div className="text-[14px] font-extrabold tracking-[-0.02em] text-foreground">{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-border bg-card sticky top-[52px] z-10">
        <div className="max-w-[1100px] mx-auto px-8 flex gap-1 overflow-x-auto hide-scrollbar py-2">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)} className={`text-[12.5px] font-semibold px-4 py-[7px] rounded-full border-[1.5px] cursor-pointer whitespace-nowrap transition-all duration-150 shrink-0 ${
              activeTab === i ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground'
            }`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-8 py-6 grid grid-cols-[1fr_300px] gap-6">
        <div>
          {activeTab === 0 && (
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
                          <div key={j} onClick={() => !task.done && showToast('Task marked done ✓')} className="flex items-center gap-2.5 p-2 px-3 rounded-[9px] cursor-pointer transition-all duration-150 hover:bg-otj-off">
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
            <div className="animate-fade-up flex flex-col gap-3">
              <div className="text-lg font-extrabold tracking-[-0.04em] mb-2">Brief Details</div>
              {[
                { label: 'Project Type', val: proj.projectType },
                { label: 'Mood & Aesthetic', val: proj.moodAesthetic || 'Not specified' },
                { label: 'Deliverables', val: proj.deliverables },
                { label: 'Usage Rights', val: proj.usageRights || 'Not specified' },
                { label: 'Budget', val: proj.budget },
                { label: 'Date', val: proj.deadline },
              ].map((f, i) => (
                <div key={i} className="bg-otj-off rounded-[10px] p-3.5 px-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">{f.label}</div>
                  <div className="text-[13px] text-foreground">{f.val}</div>
                </div>
              ))}
              {proj.status !== 'pending-deposit' && (
                <div className="bg-otj-green-bg border border-otj-green-border rounded-[10px] p-3 px-4 text-[12px] font-bold text-otj-green mt-2">✓ Brief approved by client</div>
              )}
              {proj.status === 'pending-deposit' && (
                <div className="bg-otj-yellow-bg border border-otj-yellow-border rounded-[10px] p-3 px-4 text-[12px] font-bold text-otj-yellow mt-2">⏳ Awaiting 50% deposit to begin project</div>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div className="animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-extrabold tracking-[-0.04em]">Attachments</div>
                <button onClick={() => showToast('Upload coming soon')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-card cursor-pointer hover:border-foreground">+ Upload</button>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {['🌆 Mood Board 1', '👗 Reference Shot', '📄 Shot List.pdf', '🎨 Brand Colors'].map((f, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:border-foreground">
                    <div className="h-[90px] bg-otj-off flex items-center justify-center text-3xl">{f.split(' ')[0]}</div>
                    <div className="p-2 px-2.5 text-[11px] font-bold tracking-[-0.01em]">{f.substring(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="animate-fade-up">
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
            </div>
          )}

          {activeTab === 4 && (
            <div className="animate-fade-up">
              <div className="bg-otj-blue-bg border border-otj-blue-border rounded-[14px] p-4 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-blue mb-2">Escrow Summary</div>
                <div className="grid grid-cols-3 gap-3">
                  <div><div className="text-[10px] text-otj-text mb-0.5">Total</div><div className="text-[16px] font-extrabold text-foreground">{proj.escrow.total}</div></div>
                  <div><div className="text-[10px] text-otj-text mb-0.5">In Escrow</div><div className="text-[16px] font-extrabold text-otj-blue">{proj.escrow.held}</div></div>
                  <div><div className="text-[10px] text-otj-text mb-0.5">OTJ Fee (5%)</div><div className="text-[16px] font-extrabold text-otj-muted">{proj.escrow.fee}</div></div>
                </div>
              </div>
              {[
                { label: '50% Deposit', amount: proj.escrow.deposited, status: proj.status === 'pending-deposit' ? 'Awaiting Payment' : 'Received', statusClass: proj.status === 'pending-deposit' ? 'text-otj-yellow' : 'text-otj-green', icon: proj.status === 'pending-deposit' ? '⏳' : '✓' },
                { label: '50% Final Payment', amount: proj.escrow.held, status: 'In Escrow · Held', statusClass: 'text-otj-muted', icon: '🔒' },
              ].map((p, i) => (
                <div key={i} className="bg-card border border-border rounded-[10px] p-3.5 px-4 mb-2 flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-bold">{p.label}</div>
                    <div className={`text-[11px] font-bold ${p.statusClass}`}>{p.icon} {p.status}</div>
                  </div>
                  <div className="text-[14px] font-extrabold">{p.amount}</div>
                </div>
              ))}
              <button onClick={() => showToast('Fund release requested')} className="mt-3 text-[12px] font-bold px-4 py-2 rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer hover:border-foreground hover:text-foreground">Request Fund Release →</button>
            </div>
          )}

          {activeTab === 5 && (
            <div className="animate-fade-up">
              <div className="text-lg font-extrabold tracking-[-0.04em] mb-4">Timeline</div>
              <div className="relative pl-6">
                <div className="absolute left-[9px] top-0 bottom-0 w-[2px] bg-border" />
                {proj.timeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4 relative">
                    <div className={`w-[20px] h-[20px] rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold absolute left-[-16px] ${
                      item.status === 'complete' ? 'bg-otj-green text-primary-foreground' :
                      item.status === 'active' ? 'bg-otj-blue text-primary-foreground' :
                      item.status === 'upcoming' ? 'bg-otj-blue-bg text-otj-blue border-2 border-otj-blue' :
                      'bg-otj-off text-otj-muted border-2 border-dashed border-border'
                    }`}>{item.status === 'complete' ? '✓' : ''}</div>
                    <div className="ml-3">
                      <div className="text-[13px] font-bold">{item.label}</div>
                      <div className="text-[11px] text-otj-muted">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 6 && (
            <div className="animate-fade-up">
              <div className="text-lg font-extrabold tracking-[-0.04em] mb-4">Team</div>
              {[
                { emoji: '👩‍💼', name: proj.clientName, role: `${proj.clientCompany}`, badge: 'Client', badgeClass: 'bg-otj-blue-bg text-otj-blue' },
                { emoji: '👩‍🎨', name: 'Nour Makram', role: 'Fashion & E-commerce Photographer', badge: 'Creative', badgeClass: 'bg-otj-green-bg text-otj-green' },
              ].map((p, i) => (
                <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4 mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-otj-off flex items-center justify-center text-xl shrink-0">{p.emoji}</div>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-extrabold tracking-[-0.02em]">{p.name}</div>
                    <div className="text-[11.5px] text-otj-text">{p.role}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${p.badgeClass}`}>{p.badge}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Project Info</div>
            {[
              { label: 'Client', val: proj.clientName },
              { label: 'Company', val: proj.clientCompany },
              { label: 'Started', val: proj.createdAt },
              { label: 'Deadline', val: proj.deadline },
              { label: 'Type', val: proj.projectType },
              { label: 'Budget', val: proj.budget },
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <div className="text-[11px] text-otj-text">{f.label}</div>
                <div className="text-[12px] font-bold">{f.val}</div>
              </div>
            ))}
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
          </div>

          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Payment Summary</div>
            {[
              { label: 'Total', val: proj.budget, bold: true },
              { label: 'Deposit', val: proj.escrow.deposited, bold: false },
              { label: 'In Escrow', val: proj.escrow.held, bold: false },
              { label: 'OTJ Fee (5%)', val: `-${proj.escrow.fee}`, bold: false },
            ].map((f, i) => (
              <div key={i} className={`flex items-center justify-between py-1.5 ${i < 3 ? 'border-b border-border' : ''}`}>
                <div className="text-[11px] text-otj-text">{f.label}</div>
                <div className={`text-[12px] ${f.bold ? 'font-extrabold text-foreground' : 'font-bold text-otj-text'}`}>{f.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toast />
    </>
  );
};

export default ProjectProfile;
