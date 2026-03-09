import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from './Toast';
import { useProjects } from '../context/ProjectContext';
import { allCreatives } from '../data/creatives';
import { CreativeCard } from './CreativeCard';

interface ClientDashboardScreenProps {
  onOpenBrief: (creativeId: string) => void;
}

export const ClientDashboardScreen: React.FC<ClientDashboardScreenProps> = ({ onOpenBrief }) => {
  const navigate = useNavigate();
  const { activeProjects, completedProjects, pendingBriefs } = useProjects();
  const [tab, setTab] = useState<'briefs' | 'active' | 'complete' | 'discover'>('briefs');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast('Removed from saved'); }
      else { next.add(id); showToast('✓ Saved!'); }
      return next;
    });
  };

  // Client's briefs (sent to creatives)
  const clientBriefs = pendingBriefs;

  return (
    <div className="max-w-[1100px] mx-auto p-4 md:p-6 pb-20 md:pb-6">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
        <div>
          <div className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.04em]">Welcome back, Randa 👋</div>
          <div className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">
            {activeProjects.length > 0 ? `${activeProjects.length} active projects` : 'No active projects yet'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
        {[
          { label: 'Briefs Sent', val: String(clientBriefs.length), color: 'text-[hsl(var(--otj-yellow))]', delta: clientBriefs.length > 0 ? 'Awaiting response' : 'Send a brief', deltaClass: 'text-muted-foreground' },
          { label: 'Active Projects', val: String(activeProjects.length), color: 'text-[hsl(var(--otj-blue))]', delta: activeProjects.length > 0 ? 'In progress' : 'No active', deltaClass: 'text-muted-foreground' },
          { label: 'Completed', val: String(completedProjects.length), color: 'text-[hsl(var(--otj-green))]', delta: 'Total projects', deltaClass: 'text-muted-foreground' },
          { label: 'Creatives Hired', val: '5', color: '', delta: 'All time', deltaClass: 'text-muted-foreground' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-1.5">{s.label}</div>
            <div className={`text-[26px] font-extrabold tracking-[-0.05em] leading-none ${s.color}`}>{s.val}</div>
            <div className={`text-[11px] font-bold mt-1 ${s.deltaClass}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="text-lg font-extrabold tracking-[-0.04em]">Overview</div>
        <div className="flex gap-1 ml-0 md:ml-3 overflow-x-auto hide-scrollbar">
          {[
            { key: 'briefs' as const, label: `My Briefs (${clientBriefs.length})` },
            { key: 'active' as const, label: `Active (${activeProjects.length})` },
            { key: 'complete' as const, label: `Complete (${completedProjects.length})` },
            { key: 'discover' as const, label: 'Discover Creatives' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`text-[12px] font-semibold px-3.5 py-[5px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 whitespace-nowrap ${
              tab === t.key ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground hover:border-foreground hover:text-foreground'
            }`}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* My Briefs */}
      {tab === 'briefs' && (
        <div className="flex flex-col gap-2 animate-fade-up">
          {clientBriefs.length === 0 ? (
            <div className="bg-card border border-border rounded-[14px] p-8 text-center">
              <div className="text-[32px] mb-2">📋</div>
              <div className="text-[13px] font-bold text-foreground mb-1">No briefs sent yet</div>
              <div className="text-[11px] text-muted-foreground">Find a creative and send them a brief to get started.</div>
            </div>
          ) : (
            clientBriefs.map(brief => (
              <div key={brief.id} onClick={() => navigate(`/brief/${brief.id}`)} className="bg-card border border-border rounded-[14px] p-3.5 px-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-muted-foreground flex gap-3 items-start">
                <div className="w-10 h-10 rounded-[10px] bg-[hsl(var(--otj-yellow-bg))] flex items-center justify-center text-xl shrink-0">{brief.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-extrabold tracking-[-0.02em] truncate mb-0.5">{brief.name}</div>
                  <div className="text-[11.5px] text-muted-foreground mb-1.5">Sent to creative · {brief.projectType}</div>
                  <div className="flex gap-[5px] flex-wrap">
                    {brief.tags.map((t, j) => <span key={j} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">{t}</span>)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10.5px] text-muted-foreground">{brief.time}</div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[hsl(var(--otj-yellow-bg))] text-[hsl(var(--otj-yellow))] mt-1 inline-block">Pending</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Active Projects */}
      {tab === 'active' && (
        <div className="flex flex-col gap-2 animate-fade-up">
          {activeProjects.length === 0 ? (
            <div className="bg-card border border-border rounded-[14px] p-8 text-center">
              <div className="text-[32px] mb-2">🚀</div>
              <div className="text-[13px] font-bold text-foreground mb-1">No active projects</div>
              <div className="text-[11px] text-muted-foreground">Accept a proposal from a creative to start a project.</div>
            </div>
          ) : (
            activeProjects.map(proj => {
              const phaseDone = proj.phases.filter(p => p.status === 'complete').length;
              const phaseTotal = proj.phases.length;
              const pct = Math.round((phaseDone / phaseTotal) * 100);
              const currentPhase = proj.phases.find(p => p.status === 'active');
              const statusLabel = currentPhase ? `Phase ${currentPhase.num} · ${currentPhase.title}` : 'Awaiting Proposal';

              return (
                <div key={proj.id} onClick={() => navigate(`/project/${proj.id}`)} className="bg-card border border-border rounded-[14px] p-3.5 px-4 cursor-pointer transition-all duration-150 flex gap-3 items-start hover:shadow-md hover:border-muted-foreground">
                  <div className="w-10 h-10 rounded-[10px] bg-muted flex items-center justify-center text-xl shrink-0">{proj.icon}</div>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-extrabold tracking-[-0.02em] mb-0.5">{proj.name}</div>
                    <div className="text-[11.5px] text-muted-foreground mb-1.5">Creative: {proj.clientName}</div>
                    <div className="flex gap-[3px] mb-1.5">
                      {proj.phases.map(phase => (
                        <div key={phase.num} className={`h-1 flex-1 rounded-full ${
                          phase.status === 'complete' ? 'bg-[hsl(var(--otj-green))]' :
                          phase.status === 'active' ? 'bg-[hsl(var(--otj-blue))]' : 'bg-muted'
                        }`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-[hsl(var(--otj-blue-bg))] text-[hsl(var(--otj-blue))]">{statusLabel}</div>
                      <div className="text-[10.5px] text-muted-foreground">Due {proj.deadline}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-extrabold text-foreground">{pct}%</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{proj.budget}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Completed */}
      {tab === 'complete' && (
        <div className="flex flex-col gap-2 animate-fade-up">
          {completedProjects.length === 0 ? (
            <div className="bg-card border border-border rounded-[14px] p-8 text-center">
              <div className="text-[32px] mb-2">✅</div>
              <div className="text-[13px] font-bold text-foreground mb-1">No completed projects yet</div>
              <div className="text-[11px] text-muted-foreground">Completed projects will show up here.</div>
            </div>
          ) : (
            completedProjects.map((proj, i) => (
              <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4 flex items-center gap-3 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-muted-foreground">
                <div className="w-10 h-10 rounded-[10px] bg-[hsl(var(--otj-green-bg))] flex items-center justify-center text-xl shrink-0">{proj.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-extrabold tracking-[-0.02em] mb-0.5 truncate">{proj.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">{proj.client}</div>
                </div>
                <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-[hsl(var(--otj-green-bg))] text-[hsl(var(--otj-green))] border border-[hsl(var(--otj-green-border))] whitespace-nowrap">✓ Complete</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Discover Creatives */}
      {tab === 'discover' && (
        <div className="animate-fade-up">
          <div className="text-[13px] text-muted-foreground mb-4">Browse top creatives to hire for your next project.</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allCreatives.slice(0, 8).map(creative => (
              <CreativeCard
                key={creative.id}
                creative={creative}
                onOpenBrief={onOpenBrief}
                saved={saved.has(creative.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
