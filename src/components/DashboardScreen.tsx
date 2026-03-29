import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, getWeek } from 'date-fns';
import { showToast } from './Toast';
import { useProjects, MeetingData } from '../context/ProjectContext';
import { Star, PartyPopper, Zap, Sparkles, Calendar, Users2, CheckSquare2, Clock, Plus, Briefcase, Lock, RotateCcw } from 'lucide-react';
import { ProfileCompletenessCard, useProfileCompleteness } from './ProfileCompleteness';

interface DashboardScreenProps {
  onOpenBrief: () => void;
  onAcceptBrief: (briefId: string) => void;
  onOpenCounter: () => void;
  onSwitchToMessages: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onOpenBrief, onAcceptBrief, onOpenCounter, onSwitchToMessages }) => {
  const navigate = useNavigate();
  const { pendingBriefs, activeProjects, completedProjects, allMeetings } = useProjects();
  const { percentage } = useProfileCompleteness();
  const [projectTab, setProjectTab] = useState<'pending' | 'active' | 'complete'>('pending');
  const [roleFilter, setRoleFilter] = useState<'all' | 'hired' | 'booked'>('all');

  return (
    <div className="max-w-[1100px] mx-auto p-4 md:p-6 pb-20 md:pb-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
        <div>
          <div className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.04em]">Good morning, Nour</div>
          <div className="text-[12px] md:text-[13px] text-otj-text mt-0.5">Monday, March 2 · {pendingBriefs.length > 0 ? `${pendingBriefs.length} briefs need your attention` : 'All caught up!'}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-otj-yellow">
            <Star size={12} className="fill-current" />
            <span className="text-muted-foreground">4.9</span>
            <span className="text-otj-muted font-medium">(127)</span>
          </div>
          <button onClick={() => showToast('Profile link copied!')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer active:scale-95">Share Profile</button>
        </div>
      </div>
      {/* Profile Completeness */}
      {percentage < 100 && (
        <div className="mb-5">
          <ProfileCompletenessCard variant="compact" />
        </div>
      )}

      {/* Stats — 4 cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
        {(() => {
          const myBookings = activeProjects.filter(p => p.myRole === 'as-client').length;
          const hiredProjects = activeProjects.filter(p => p.myRole !== 'as-client').length;
          return [
            { label: 'Hired Projects', val: String(hiredProjects), delta: 'Working on', deltaClass: 'text-otj-green' },
            { label: 'My Bookings', val: String(myBookings), delta: myBookings > 0 ? 'You booked' : 'None yet', deltaClass: 'text-otj-blue' },
            { label: 'Revenue (Mar)', val: '14K', delta: '↑ 23% vs Feb', deltaClass: 'text-otj-green' },
            { label: 'Pending Briefs', val: String(pendingBriefs.length), delta: pendingBriefs.length > 0 ? 'Need response' : 'All clear', deltaClass: 'text-otj-text' },
          ];
        })().map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4 hover:shadow-sm transition-shadow">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">{s.label}</div>
            <div className="text-[26px] font-extrabold tracking-[-0.05em] leading-none text-foreground">{s.val}</div>
            <div className={`text-[11px] font-bold mt-1 ${s.deltaClass}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Projects with tabs */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-lg font-extrabold tracking-[-0.04em]">Projects</div>
            <div className="flex gap-1 ml-0 md:ml-3 overflow-x-auto hide-scrollbar">
              {[
                { key: 'pending' as const, label: `Pending (${pendingBriefs.length})` },
                { key: 'active' as const, label: `Active (${activeProjects.length})` },
                { key: 'complete' as const, label: `Complete (${completedProjects.length})` },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setProjectTab(tab.key)} className={`text-[12px] font-semibold px-3.5 py-[5px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 active:scale-95 ${
                  projectTab === tab.key ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-otj-text hover:border-foreground'
                }`}>{tab.label}</button>
              ))}
            </div>
            <div className="flex gap-1 ml-0 md:ml-2 overflow-x-auto hide-scrollbar">
              {[
                { key: 'all' as const, label: 'All' },
                { key: 'hired' as const, label: 'Hired' },
                { key: 'booked' as const, label: 'My Bookings' },
              ].map((f) => (
                <button key={f.key} onClick={() => setRoleFilter(f.key)} className={`text-[11px] font-semibold px-2.5 py-[4px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 active:scale-95 ${
                  roleFilter === f.key ? 'bg-muted border-border text-foreground' : 'bg-transparent border-transparent text-otj-muted hover:text-foreground'
                }`}>{f.label}</button>
              ))}
            </div>
          </div>
          
        </div>

        {projectTab === 'pending' && (() => {
          const filtered = pendingBriefs.filter(b => roleFilter === 'all' ? true : roleFilter === 'hired' ? b.myRole !== 'as-client' : b.myRole === 'as-client');
          return (
          <div className="flex flex-col gap-2 animate-fade-up">
            {filtered.length === 0 && (
              <div className="bg-card border border-border rounded-[14px] p-10 text-center flex flex-col items-center gap-2">
                <PartyPopper size={40} className="text-otj-muted" />
                <div className="text-[14px] font-extrabold text-foreground">No pending briefs!</div>
                <div className="text-[12px] text-muted-foreground max-w-[260px]">You're all caught up — sit back and relax until the next opportunity rolls in.</div>
              </div>
            )}
            {filtered.map((brief) => (
              <div key={brief.id} className="bg-card border border-border rounded-[14px] p-3.5 px-4 transition-all duration-150 flex flex-col md:flex-row md:items-center gap-2.5 hover:shadow-md hover:border-otj-muted active:shadow-sm cursor-pointer">
                {/* Content */}
                <div className="flex-1 min-w-0" onClick={() => navigate(`/brief/${brief.id}`)}>
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[13.5px] font-extrabold tracking-[-0.02em] truncate min-w-0">{brief.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {brief.myRole && (
                        <span className={`text-[9px] font-bold px-1.5 py-[1px] rounded-full border shrink-0 ${
                          brief.myRole === 'as-client'
                            ? 'bg-otj-blue-bg text-otj-blue border-otj-blue-border'
                            : 'bg-otj-green-bg text-otj-green border-otj-green-border'
                        }`}>
                          {brief.myRole === 'as-client' ? 'Booked by you' : 'Hired'}
                        </span>
                      )}
                      {/* Time — mobile only, plain text */}
                      <span className="md:hidden text-[10.5px] text-otj-muted whitespace-nowrap">{brief.time}</span>
                    </div>
                  </div>
                  <div className="text-[11.5px] text-otj-text mb-1.5">From: {brief.clientName} · {brief.clientCompany}</div>
                  <div className="flex gap-[5px] flex-wrap">
                    {brief.tags.map((t, j) => <span key={j} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-otj-off border border-border text-otj-text">{t}</span>)}
                  </div>
                </div>
                {/* Desktop: time above buttons, right-aligned */}
                <div className="hidden md:flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10.5px] text-otj-muted whitespace-nowrap">{brief.time}</span>
                  <div className="flex items-center gap-[5px]">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/brief/${brief.id}`); }} className="text-[11.5px] font-bold px-3 py-[5px] rounded-full bg-primary border-[1.5px] border-primary text-primary-foreground cursor-pointer transition-all duration-150 whitespace-nowrap active:scale-[0.98]">View Brief</button>
                    <button onClick={(e) => { e.stopPropagation(); showToast('Brief declined'); }} className="text-[11.5px] font-bold px-3 py-[5px] rounded-full border-[1.5px] border-border bg-card text-muted-foreground cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground whitespace-nowrap active:scale-95">Decline</button>
                  </div>
                </div>
                {/* Mobile: buttons below content */}
                <div className="flex md:hidden items-center gap-[5px]">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/brief/${brief.id}`); }} className="text-[11.5px] font-bold px-3 py-[5px] rounded-full bg-primary border-[1.5px] border-primary text-primary-foreground cursor-pointer transition-all duration-150 whitespace-nowrap active:scale-[0.98]">View Brief</button>
                  <button onClick={(e) => { e.stopPropagation(); showToast('Brief declined'); }} className="text-[11.5px] font-bold px-3 py-[5px] rounded-full border-[1.5px] border-border bg-card text-muted-foreground cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground whitespace-nowrap active:scale-95">Decline</button>
                </div>
              </div>
            ))}
          </div>
          );
        })()}

        {projectTab === 'active' && (() => {
          const filtered = activeProjects.filter(p => roleFilter === 'all' ? true : roleFilter === 'hired' ? p.myRole !== 'as-client' : p.myRole === 'as-client');
          return (
          <div className="flex flex-col gap-2 animate-fade-up">
            {filtered.length === 0 && (
              <div className="bg-card border border-border rounded-[14px] p-10 text-center flex flex-col items-center gap-2">
                <Zap size={40} className="text-otj-muted" />
                <div className="text-[14px] font-extrabold text-foreground">No {roleFilter === 'booked' ? 'bookings' : 'projects'} yet</div>
                <div className="text-[12px] text-muted-foreground max-w-[260px]">{roleFilter === 'booked' ? 'Book a creative and your projects will show here.' : 'Accept a brief and watch the magic begin!'}</div>
              </div>
            )}
            {filtered.map((proj) => {
              const phaseDone = proj.phases.filter(p => p.status === 'complete').length;
              const phaseTotal = proj.phases.length;
              const pct = Math.round((phaseDone / phaseTotal) * 100);
              const currentPhase = proj.phases.find(p => p.status === 'active');
              const statusLabel = currentPhase ? `Phase ${currentPhase.num} · ${currentPhase.title}` : 'Awaiting Deposit';
              const statusClass = proj.status === 'pending-deposit' ? 'bg-otj-yellow-bg text-otj-yellow' : 'bg-otj-blue-bg text-otj-blue';

              return (
                <div key={proj.id} onClick={() => navigate(`/project/${proj.id}`)} className="bg-card border border-border rounded-[14px] p-3.5 px-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-otj-muted active:shadow-sm">
                  {/* Row 1: Name + role badge right-aligned */}
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[13.5px] font-extrabold tracking-[-0.02em] truncate min-w-0">{proj.name}</span>
                    {proj.myRole && (
                      <span className={`text-[9px] font-bold px-1.5 py-[1px] rounded-full border shrink-0 ${
                        proj.myRole === 'as-client'
                          ? 'bg-otj-blue-bg text-otj-blue border-otj-blue-border'
                          : 'bg-otj-green-bg text-otj-green border-otj-green-border'
                      }`}>
                        {proj.myRole === 'as-client' ? 'Booked by you' : 'Hired'}
                      </span>
                    )}
                  </div>
                  {/* Row 2: Client info */}
                  <div className="text-[11.5px] text-otj-text mb-1.5">{proj.myRole === 'as-client' ? 'Creative' : 'Client'}: {proj.clientName} · {proj.clientCompany}</div>
                  {/* Row 3: Progress bars + percentage at the end */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex gap-[3px] flex-1">
                      {proj.phases.map((phase) => (
                        <div key={phase.num} className={`h-1 flex-1 rounded-full ${
                          phase.status === 'complete' ? 'bg-otj-green' :
                          phase.status === 'active' ? 'bg-otj-blue' : 'bg-otj-light'
                        }`} />
                      ))}
                    </div>
                    <span className="text-[11px] font-extrabold text-foreground shrink-0">{pct}%</span>
                  </div>
                  {/* Row 4: Phase tag + due date (left) + budget (right) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`text-[11px] font-bold px-2.5 py-[3px] rounded-full ${statusClass}`}>{statusLabel}</div>
                      <div className="text-[10.5px] text-otj-muted">Due {proj.deadline}</div>
                    </div>
                    <div className="text-[12px] font-extrabold text-foreground shrink-0">{proj.budget}</div>
                  </div>
                </div>
              );
            })}
          </div>
          );
        })()}

        {projectTab === 'complete' && (
          <div className="flex flex-col gap-2 animate-fade-up">
            {completedProjects.length === 0 && (
              <div className="bg-card border border-border rounded-[14px] p-10 text-center flex flex-col items-center gap-2">
                <Sparkles size={40} className="text-otj-muted" />
                <div className="text-[14px] font-extrabold text-foreground">No completed projects yet</div>
                <div className="text-[12px] text-muted-foreground max-w-[260px]">Your finished masterpieces will live here — keep creating amazing work!</div>
              </div>
            )}
            {completedProjects.map((proj, i) => (
              <div key={i} onClick={() => navigate(`/completed/${proj.id}`)} className="bg-card border border-border rounded-[14px] p-3.5 px-4 flex items-start justify-between gap-3 transition-all duration-150 hover:shadow-md hover:border-otj-muted group cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13.5px] font-extrabold tracking-[-0.02em] truncate">{proj.name}</span>
                    <Lock size={11} className="text-otj-muted shrink-0" />
                  </div>
                  <div className="text-[11.5px] text-otj-text">{proj.client}</div>
                  {proj.creativeName && (
                    <div
                      className="text-[11.5px] text-[hsl(var(--otj-blue))] font-semibold mt-0.5 cursor-pointer hover:underline w-fit"
                      onClick={() => navigate(`/creative/${proj.creativeId}`)}
                    >
                      {proj.creativeName} →
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[11px] font-bold px-2.5 py-[3px] rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border whitespace-nowrap">Complete</span>
                  <div className="text-[12px] font-extrabold text-otj-green whitespace-nowrap">{proj.earned}</div>
                  {proj.creativeName && (
                    <button
                      onClick={() => navigate(`/creative/${proj.creativeId}`)}
                      className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground border-none cursor-pointer transition-all duration-150 hover:opacity-90 opacity-0 group-hover:opacity-100"
                    >
                      <RotateCcw size={9} />
                      Rebook
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule */}
      <ScheduleSection projects={activeProjects} navigate={navigate} allMeetings={allMeetings} />

      {/* Collections */}
      <div className="mb-5">
        <div className="flex items-baseline justify-between mb-3">
          <div className="text-lg font-extrabold tracking-[-0.04em]">My Collections</div>
          <div className="text-xs font-semibold text-otj-text underline underline-offset-[3px] cursor-pointer" onClick={() => showToast('Opening all boards…')}>View all</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { name: 'Ramadan Campaign', count: '4 creatives saved', colors: ['bg-otj-purple-bg','bg-otj-blue-bg','bg-otj-green-bg','bg-otj-yellow-bg'] },
            { name: 'Product Launch', count: '2 creatives saved', colors: ['bg-otj-green-bg','bg-otj-blue-bg','bg-otj-off','bg-otj-off'] },
            { name: 'Fashion Week', count: '3 creatives saved', colors: ['bg-otj-orange-bg','bg-otj-purple-bg','bg-otj-blue-bg','bg-otj-off'] },
          ].map((coll, i) => (
            <div key={i} onClick={() => showToast(`Opening ${coll.name} board…`)} className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-150 hover:border-foreground">
              <div className="grid grid-cols-2 h-[60px]">
                {coll.colors.map((bg, j) => <div key={j} className={`${bg} border-r border-b border-border last:border-r-0`} />)}
              </div>
              <div className="p-2 px-2.5">
                <div className="text-xs font-extrabold tracking-[-0.02em] mb-px">{coll.name}</div>
                <div className="text-[10.5px] text-otj-text">{coll.count}</div>
              </div>
            </div>
          ))}
          <div onClick={() => showToast('Create new board…')} className="border-[1.5px] border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 min-h-[96px] cursor-pointer hover:border-foreground">
            <Plus className="w-5 h-5 text-otj-muted" />
            <div className="text-[11px] font-semibold text-otj-text">New Board</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Weekly time-grid schedule
type ScheduleItem = {
  label: string;
  sublabel: string;
  projectId: string;
  deadline: Date;
  type: 'phase' | 'task' | 'meeting' | 'call';
  status: string;
  hour: number; // 0-23
  duration: number; // hours
};

const typeConfig: Record<string, { bg: string; border: string; text: string; dot: string; label: string }> = {
  meeting: { bg: 'bg-otj-blue-bg', border: 'border-otj-blue-border', text: 'text-otj-blue', dot: 'bg-otj-blue', label: 'Meeting' },
  task: { bg: 'bg-otj-green-bg', border: 'border-otj-green-border', text: 'text-otj-green', dot: 'bg-otj-green', label: 'Task' },
  phase: { bg: 'bg-otj-yellow-bg', border: 'border-otj-yellow-border', text: 'text-otj-yellow', dot: 'bg-otj-yellow', label: 'Due' },
  call: { bg: 'bg-otj-blue-bg', border: 'border-otj-blue-border', text: 'text-otj-blue', dot: 'bg-otj-blue', label: 'Call' },
};

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const ScheduleSection: React.FC<{ projects: ReturnType<typeof useProjects>['activeProjects']; navigate: ReturnType<typeof useNavigate>; allMeetings: MeetingData[] }> = ({ projects, navigate }) => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const today = new Date();
  const weekNum = getWeek(weekStart, { weekStartsOn: 1 });

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const scheduleItems = useMemo(() => {
    const items: ScheduleItem[] = [];
    projects.forEach(proj => {
      proj.phases.forEach(phase => {
        if (phase.deadline) {
          try {
            const d = parseISO(phase.deadline);
            items.push({ label: `${proj.name.substring(0, 12)}…`, sublabel: `Phase ${phase.num} — ${phase.title}`, projectId: proj.id, deadline: d, type: 'phase', status: phase.status, hour: 11, duration: 1 });
          } catch {}
        }
        phase.tasks.forEach(task => {
          if (task.due && !task.done) {
            try {
              const parsed = new Date(`${task.due}, ${new Date().getFullYear()}`);
              if (!isNaN(parsed.getTime())) {
                items.push({ label: task.text, sublabel: `${proj.name} · Phase ${phase.num}`, projectId: proj.id, deadline: parsed, type: 'task', status: 'active', hour: 11, duration: 1 });
              }
            } catch {}
          }
        });
      });
      proj.meetings.forEach(meeting => {
        try {
          const d = parseISO(meeting.date);
          const hourMatch = meeting.time?.match(/(\d+)/);
          const isPM = meeting.time?.toLowerCase().includes('pm');
          let hour = hourMatch ? parseInt(hourMatch[1]) : 9;
          if (isPM && hour < 12) hour += 12;
          if (!isPM && hour === 12) hour = 0;
          items.push({ label: meeting.title, sublabel: `${proj.name}`, projectId: proj.id, deadline: d, type: meeting.type === 'call' ? 'call' : 'meeting', status: 'upcoming', hour, duration: meeting.type === 'call' ? 1 : 2 });
        } catch {}
      });
    });
    return items;
  }, [projects]);

  // Summary counts
  const weekItems = scheduleItems.filter(item => weekDays.some(d => isSameDay(item.deadline, d)));
  const meetingCount = weekItems.filter(i => i.type === 'meeting' || i.type === 'call').length;
  const taskCount = weekItems.filter(i => i.type === 'task').length;
  const dueCount = weekItems.filter(i => i.type === 'phase').length;

  return (
    <div className="mb-5">
      {/* Header */}
      <div className="bg-card border border-border rounded-[16px] overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 px-4 md:px-5 gap-2">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <Calendar className="w-[17px] h-[17px] text-foreground shrink-0" />
            <span className="text-[17px] font-extrabold tracking-[-0.04em]">Schedule</span>
            <div className="flex items-center gap-1 md:gap-2 ml-1 md:ml-3">
              <button onClick={() => setWeekStart(subWeeks(weekStart, 1))} className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer text-otj-text hover:border-foreground hover:text-foreground transition-all duration-150 text-sm">‹</button>
              <span className="text-[11px] md:text-[13px] font-extrabold tracking-[-0.02em] min-w-[120px] md:min-w-[160px] text-center">{format(weekStart, 'MMMM yyyy')} · Week {weekNum}</span>
              <button onClick={() => setWeekStart(addWeeks(weekStart, 1))} className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer text-otj-text hover:border-foreground hover:text-foreground transition-all duration-150 text-sm">›</button>
            </div>
            <div className="hidden md:flex items-center gap-3 ml-4">
              {[
                { key: 'meeting', color: 'bg-otj-blue', label: 'Meeting' },
                { key: 'task', color: 'bg-otj-green', label: 'Task' },
                { key: 'phase', color: 'bg-otj-yellow', label: 'Due' },
              ].map(l => (
                <div key={l.key} className="flex items-center gap-1.5">
                  <div className={`w-[7px] h-[7px] rounded-full ${l.color}`} />
                  <span className="text-[11px] font-semibold text-otj-text">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="text-[10px] md:text-[11px] font-bold px-2.5 md:px-3 py-[5px] rounded-full bg-primary border-[1.5px] border-primary text-primary-foreground cursor-pointer">Weekly</button>
            <button onClick={() => showToast('Monthly view coming soon!')} className="text-[10px] md:text-[11px] font-bold px-2.5 md:px-3 py-[5px] rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer hover:border-foreground transition-all">Monthly</button>
          </div>
        </div>

        {/* Day picker + List view (unified for both mobile and desktop) */}
        <div className="border-t border-border">
          <div className="flex overflow-x-auto hide-scrollbar border-b border-border">
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, today);
              const dayEvents = scheduleItems.filter(item => isSameDay(item.deadline, day));
              return (
                <div key={i} className={`flex-1 min-w-[48px] md:min-w-[80px] text-center py-2.5 md:py-3 border-r border-border last:border-r-0 cursor-pointer active:scale-95 transition-transform duration-100 ${isToday ? 'bg-otj-blue-bg' : ''}`}>
                  <div className={`text-[9px] md:text-[10px] font-bold uppercase ${isToday ? 'text-otj-blue' : 'text-otj-muted'}`}>{DAY_LABELS[i]}</div>
                  <div className={`text-[15px] md:text-[18px] font-extrabold mt-0.5 ${isToday ? 'text-otj-blue' : 'text-foreground'}`}>{format(day, 'd')}</div>
                  {dayEvents.length > 0 && <div className="flex justify-center mt-1 gap-[2px]">{dayEvents.slice(0, 3).map((ev, j) => <div key={j} className={`w-[5px] h-[5px] md:w-[6px] md:h-[6px] rounded-full ${typeConfig[ev.type]?.dot}`} />)}</div>}
                </div>
              );
            })}
          </div>
          <div className="p-3 md:p-4 flex flex-col gap-2 max-h-[300px] md:max-h-[400px] overflow-y-auto">
            {weekItems.length === 0 && <div className="text-center text-[12px] text-otj-muted py-4">No events this week</div>}
            {weekItems.slice(0, 10).map((item, i) => {
              const cfg = typeConfig[item.type];
              return (
                <div key={i} onClick={() => navigate(`/project/${item.projectId}`)} className="flex items-center gap-2.5 md:gap-3 p-2.5 md:p-3 rounded-[10px] md:rounded-[12px] border border-border bg-card cursor-pointer hover:border-otj-muted hover:shadow-sm transition-all">
                  <div className={`w-1.5 md:w-2 self-stretch rounded-full shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] md:text-[13px] font-extrabold tracking-[-0.02em] truncate">{item.label}</div>
                    <div className="text-[10px] md:text-[11px] text-otj-text truncate">{item.sublabel} · {format(item.deadline, 'EEE, MMM d')} · {item.hour <= 12 ? `${item.hour}:00 AM` : `${item.hour - 12}:00 PM`}</div>
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-[1px] md:py-[2px] rounded ${cfg.bg} ${cfg.text} shrink-0`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary footer */}
        <div className="flex items-center gap-5 md:gap-8 p-3 md:p-4 px-4 md:px-5 border-t border-border flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-otj-blue-bg flex items-center justify-center shrink-0">
              <Users2 className="w-[15px] h-[15px] text-otj-blue" />
            </div>
            <div>
              <div className="text-[13px] md:text-[14px] font-extrabold tracking-[-0.02em]">{meetingCount} Meeting{meetingCount !== 1 ? 's' : ''}</div>
              <div className="text-[10px] text-otj-text font-semibold">This week</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-otj-green-bg flex items-center justify-center shrink-0">
              <CheckSquare2 className="w-[15px] h-[15px] text-otj-green" />
            </div>
            <div>
              <div className="text-[13px] md:text-[14px] font-extrabold tracking-[-0.02em]">{taskCount} Task{taskCount !== 1 ? 's' : ''}</div>
              <div className="text-[10px] text-otj-text font-semibold">Scheduled</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-otj-yellow-bg flex items-center justify-center shrink-0">
              <Clock className="w-[15px] h-[15px] text-otj-yellow" />
            </div>
            <div>
              <div className="text-[13px] md:text-[14px] font-extrabold tracking-[-0.02em]">{dueCount} Due Date{dueCount !== 1 ? 's' : ''}</div>
              <div className="text-[10px] text-otj-text font-semibold">Coming up</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};