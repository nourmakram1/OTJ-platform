import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';
import { useProjects } from '../context/ProjectContext';

const BriefProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getBrief, acceptBrief, pendingBriefs } = useProjects();

  const brief = getBrief(id || '');

  if (!brief) {
    return (
      <>
        <NavBar />
        <div className="max-w-[800px] mx-auto px-4 md:px-8 py-20 pt-[80px] text-center">
          <div className="text-[48px] mb-4">📋</div>
          <div className="text-lg font-extrabold mb-2">Brief Not Found</div>
          <div className="text-[13px] text-otj-muted mb-6">This brief may have already been accepted or doesn't exist.</div>
          <button onClick={() => navigate('/dashboard')} className="text-[12px] font-bold px-5 py-2 rounded-full bg-primary text-primary-foreground border-none cursor-pointer">← Back to Dashboard</button>
        </div>
        <Toast />
      </>
    );
  }

  const handleAccept = () => {
    const projectId = acceptBrief(brief.id);
    showToast('✓ Brief accepted! Redirecting to project…');
    setTimeout(() => navigate(`/project/${projectId}`), 600);
  };

  return (
    <>
      <NavBar />
      {/* Hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 pt-[72px]">
          <div className="flex items-center gap-2 text-[12px] text-otj-text mb-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
            ← Dashboard / Pending Briefs
          </div>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[14px] bg-otj-yellow-bg flex items-center justify-center text-[24px] md:text-[28px] shrink-0">{brief.icon}</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                <div className="text-[18px] md:text-[22px] font-extrabold tracking-[-0.04em] text-foreground">{brief.name}</div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-otj-yellow-bg text-otj-yellow border border-otj-yellow-border">Pending Brief</span>
              </div>
              <div className="text-[12px] md:text-[13px] text-otj-text">From: {brief.clientName} · {brief.clientCompany}</div>
              <div className="text-[11px] text-otj-muted mt-1">Received {brief.time}</div>
            </div>
            <div className="flex gap-2 shrink-0 flex-wrap">
              <button onClick={handleAccept} className="text-[11.5px] font-bold px-4 py-1.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90">✓ Accept Brief</button>
              <button onClick={() => { showToast('Opening counter proposal…'); }} className="text-[11.5px] font-bold px-4 py-1.5 rounded-full border-[1.5px] border-otj-yellow text-otj-yellow bg-transparent cursor-pointer transition-all duration-150 hover:bg-otj-yellow-bg">↕ Counter</button>
              <button onClick={() => navigate('/messages')} className="text-[11.5px] font-bold px-4 py-1.5 rounded-full border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:bg-otj-off">💬 Message Client</button>
            </div>
          </div>
        </div>
      </div>

      {/* Brief Content */}
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 pb-20 md:pb-6">
        <div className="flex flex-col gap-5">

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {brief.tags.map((t, j) => (
              <span key={j} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-otj-off border border-border text-otj-text">{t}</span>
            ))}
          </div>

          {/* Client Information */}
          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">👤 Client Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Client Name</div>
                <div className="text-[13px] font-semibold text-foreground">{brief.clientName}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Company</div>
                <div className="text-[13px] font-semibold text-foreground">{brief.clientCompany}</div>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">📋 Project Overview</div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Project Type</div>
                <div className="text-[13px] text-foreground">{brief.projectType}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Description</div>
                <div className="text-[13px] text-foreground leading-relaxed">
                  {brief.name} project for {brief.clientCompany}. This involves creating high-quality deliverables that align with the client's brand vision and marketing objectives.
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
                <div className="text-[13px] text-foreground">{brief.moodAesthetic || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Deliverables</div>
                <div className="text-[13px] text-foreground">{brief.deliverables}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Usage Rights</div>
                <div className="text-[13px] text-foreground">{brief.usageRights || 'Not specified'}</div>
              </div>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">📅 Timeline & Budget</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Requested Date</div>
                <div className="text-[13px] font-semibold text-foreground">{brief.date}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-0.5">Proposed Budget</div>
                <div className="text-[13px] font-extrabold text-otj-green">{brief.budget}</div>
              </div>
            </div>
          </div>

          {/* Action Banner */}
          <div className="bg-otj-yellow-bg border border-otj-yellow-border rounded-[14px] p-4 flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-otj-yellow flex items-center justify-center text-primary-foreground text-lg shrink-0">📝</div>
            <div className="flex-1">
              <div className="text-[13px] font-bold text-otj-yellow">Action Required</div>
              <div className="text-[11px] text-otj-yellow/80">Accept this brief to create a new project profile and start building your proposal with phases, tasks, and pricing.</div>
            </div>
            <button onClick={handleAccept} className="text-[11.5px] font-bold px-4 py-2 rounded-full border-none bg-otj-yellow text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90 whitespace-nowrap shrink-0">✓ Accept & Start Proposal</button>
          </div>

        </div>
      </div>
      <Toast />
    </>
  );
};

export default BriefProfile;
