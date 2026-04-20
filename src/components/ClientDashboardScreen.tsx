import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, getWeek } from 'date-fns';
import { showToast } from './Toast';
import { useProjects, MeetingData } from '../context/ProjectContext';
import { ClipboardList, Zap, Sparkles, Calendar, Users2, Clock, SendHorizonal, FileText } from 'lucide-react';
import { ClientProfileCompletenessCard, useClientProfileCompleteness } from './ClientProfileCompleteness';
import { ProfileIncompleteBanner } from './ProfileIncompleteBanner';

export const ClientDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { activeProjects, completedProjects, pendingBriefs, allMeetings } = useProjects();
  const { percentage: clientPct } = useClientProfileCompleteness();
  const [tab, setTab] = useState<'briefs' | 'active' | 'complete'>('briefs');

  const clientBriefs = pendingBriefs;

  return (
    <div className="max-w-[1100px] mx-auto p-4 md:p-6 pb-20 md:pb-6">

      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
        <div>
          <div className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.04em]">Welcome back, Randa 👋</div>
          <div className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">
            {activeProjects.length > 0 ?
            `${activeProjects.length} active project${activeProjects.length !== 1 ? 's' : ''} in progress` :
            'No active projects yet'}
          </div>
        </div>
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-1.5 text-[11.5px] font-bold px-3.5 py-1.5 rounded-full bg-primary border-none text-primary-foreground cursor-pointer active:scale-95 self-start md:self-auto">
          
          <SendHorizonal size={12} />
          Send a Brief
        </button>
      </div>

      {/* Profile incomplete nudges (banner + one-shot toast) */}
      <ProfileIncompleteBanner percentage={clientPct} ctaPath="/client-onboarding" storageKey="profile-banner:client" roleLabel="client" />


      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
        {
          label: 'Briefs Sent',
          val: String(clientBriefs.length),
          color: 'text-[hsl(var(--otj-yellow))]',
          delta: clientBriefs.length > 0 ? 'Awaiting response' : 'Send your first brief',
          deltaClass: 'text-muted-foreground'
        },
        {
          label: 'Active Projects',
          val: String(activeProjects.length),
          color: 'text-[hsl(var(--otj-blue))]',
          delta: activeProjects.length > 0 ? 'In progress' : 'None yet',
          deltaClass: 'text-muted-foreground'
        },
        {
          label: 'Completed',
          val: String(completedProjects.length),
          color: 'text-[hsl(var(--otj-green))]',
          delta: 'Total projects',
          deltaClass: 'text-muted-foreground'
        }].
        map((s, i) =>
        <div key={i} className="bg-card border border-border rounded-[14px] p-3.5 px-4 hover:shadow-sm transition-shadow">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-1.5">{s.label}</div>
            <div className={`text-[26px] font-extrabold tracking-[-0.05em] leading-none ${s.color}`}>{s.val}</div>
            <div className={`text-[11px] font-bold mt-1 ${s.deltaClass}`}>{s.delta}</div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="text-lg font-extrabold tracking-[-0.04em]">Projects</div>
        <div className="flex gap-1 ml-0 md:ml-3 overflow-x-auto hide-scrollbar">
          {[
          { key: 'briefs' as const, label: `My Briefs (${clientBriefs.length})` },
          { key: 'active' as const, label: `Active (${activeProjects.length})` },
          { key: 'complete' as const, label: `Complete (${completedProjects.length})` }].
          map((t) =>
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-[12px] font-semibold px-3.5 py-[5px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 active:scale-95 whitespace-nowrap ${
            tab === t.key ?
            'bg-primary border-primary text-primary-foreground' :
            'bg-card border-border text-muted-foreground hover:border-foreground hover:text-foreground'}`
            }>
            
              {t.label}
            </button>
          )}
        </div>
      </div>

      {/* My Briefs */}
      {tab === 'briefs' &&
      <div className="flex flex-col gap-2 animate-fade-up">
          {clientBriefs.length === 0 ?
        <div className="bg-card border border-border rounded-[14px] p-10 text-center flex flex-col items-center gap-2">
              <ClipboardList size={40} className="text-muted-foreground" />
              <div className="text-[14px] font-extrabold text-foreground">No briefs sent yet</div>
              <div className="text-[12px] text-muted-foreground max-w-[260px]">
                Ready to bring your vision to life? Find a creative and send your first brief!
              </div>
            </div> :

        clientBriefs.map((brief) =>
        <div
          key={brief.id}
          onClick={() => navigate(`/brief/${brief.id}`)}
          className="bg-card border border-border rounded-[14px] p-3.5 px-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-muted-foreground active:shadow-sm flex gap-3 items-start">
          
                

          
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[13.5px] font-extrabold tracking-[-0.02em] truncate min-w-0">{brief.name}</span>
                    <span className="text-[10.5px] text-muted-foreground whitespace-nowrap shrink-0">{brief.time}</span>
                  </div>
                  <div className="text-[11.5px] text-muted-foreground mb-1.5">
                    Sent to creative · {brief.projectType}
                  </div>
                  <div className="flex gap-[5px] flex-wrap">
                    {brief.tags.map((t, j) =>
              <span key={j} className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                        {t}
                      </span>
              )}
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[hsl(var(--otj-yellow-bg))] text-[hsl(var(--otj-yellow))]">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
        )
        }
        </div>
      }

      {/* Active Projects */}
      {tab === 'active' &&
      <div className="flex flex-col gap-2 animate-fade-up">
          {activeProjects.length === 0 ?
        <div className="bg-card border border-border rounded-[14px] p-10 text-center flex flex-col items-center gap-2">
              <Zap size={40} className="text-muted-foreground" />
              <div className="text-[14px] font-extrabold text-foreground">No active projects</div>
              <div className="text-[12px] text-muted-foreground max-w-[260px]">
                Your creative journey starts here — accept a proposal and let's get building!
              </div>
            </div> :

        activeProjects.map((proj) => {
          const phaseDone = proj.phases.filter((p) => p.status === 'complete').length;
          const phaseTotal = proj.phases.length;
          const pct = Math.round(phaseDone / phaseTotal * 100);
          const currentPhase = proj.phases.find((p) => p.status === 'active');
          const statusLabel = currentPhase ? `Phase ${currentPhase.num} · ${currentPhase.title}` : 'Awaiting Proposal';
          const statusClass = proj.status === 'pending-deposit' ?
          'bg-[hsl(var(--otj-yellow-bg))] text-[hsl(var(--otj-yellow))]' :
          'bg-[hsl(var(--otj-blue-bg))] text-[hsl(var(--otj-blue))]';

          return (
            <div
              key={proj.id}
              onClick={() => navigate(`/project/${proj.id}`)}
              className="bg-card border border-border rounded-[14px] p-3.5 px-4 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-muted-foreground active:shadow-sm">
              
                  {/* Row 1: Name + badge */}
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[13.5px] font-extrabold tracking-[-0.02em] truncate min-w-0">{proj.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-[1px] rounded-full border shrink-0 bg-[hsl(var(--otj-blue-bg))] text-[hsl(var(--otj-blue))] border-[hsl(var(--otj-blue-border))]">
                      Booked by you
                    </span>
                  </div>
                  {/* Row 2: Creative name */}
                  <div className="text-[11.5px] text-muted-foreground mb-1.5">
                    Creative: {proj.clientName}
                    {proj.clientCompany ? ` · ${proj.clientCompany}` : ''}
                  </div>
                  {/* Row 3: Progress bars + pct */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex gap-[3px] flex-1">
                      {proj.phases.map((phase) =>
                  <div
                    key={phase.num}
                    className={`h-1 flex-1 rounded-full ${
                    phase.status === 'complete' ? 'bg-[hsl(var(--otj-green))]' :
                    phase.status === 'active' ? 'bg-[hsl(var(--otj-blue))]' : 'bg-muted'}`
                    } />

                  )}
                    </div>
                    <span className="text-[11px] font-extrabold text-foreground shrink-0">{pct}%</span>
                  </div>
                  {/* Row 4: Phase tag + due + budget */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`text-[11px] font-bold px-2.5 py-[3px] rounded-full ${statusClass}`}>{statusLabel}</div>
                      <div className="text-[10.5px] text-muted-foreground">Due {proj.deadline}</div>
                    </div>
                    <div className="text-[12px] font-extrabold text-foreground shrink-0">{proj.budget}</div>
                  </div>
                </div>);

        })
        }
        </div>
      }

      {/* Completed */}
      {tab === 'complete' &&
      <div className="flex flex-col gap-2 animate-fade-up">
          {completedProjects.length === 0 ?
        <div className="bg-card border border-border rounded-[14px] p-10 text-center flex flex-col items-center gap-2">
              <Sparkles size={40} className="text-muted-foreground" />
              <div className="text-[14px] font-extrabold text-foreground">No completed projects yet</div>
              <div className="text-[12px] text-muted-foreground max-w-[260px]">
                Your success stories will shine here — every great project starts with a single step!
              </div>
            </div> :

        completedProjects.map((proj, i) =>
        <div
          key={i}
          onClick={() => showToast('Project archived — full details coming soon')}
          className="bg-card border border-border rounded-[14px] p-3.5 px-4 flex items-start justify-between gap-3 cursor-pointer transition-all duration-150 hover:shadow-md hover:border-muted-foreground active:shadow-sm">
          
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-extrabold tracking-[-0.02em] mb-0.5 truncate">{proj.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">{proj.client}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[11px] font-bold px-2.5 py-[3px] rounded-full bg-[hsl(var(--otj-green-bg))] text-[hsl(var(--otj-green))] border border-[hsl(var(--otj-green-border))] whitespace-nowrap">
                    Complete
                  </span>
                </div>
              </div>
        )
        }
        </div>
      }

      {/* Schedule */}
      <ClientScheduleSection projects={activeProjects} navigate={navigate} />
    </div>);

};

// ─── Types ────────────────────────────────────────────────────────────────────

type ClientScheduleItem = {
  label: string;
  sublabel: string;
  projectId: string;
  deadline: Date;
  type: 'phase' | 'meeting' | 'call' | 'deadline';
  hour: number;
  duration: number;
};

const clientTypeConfig: Record<string, {bg: string;border: string;text: string;dot: string;label: string;}> = {
  meeting: { bg: 'bg-otj-blue-bg', border: 'border-otj-blue-border', text: 'text-otj-blue', dot: 'bg-otj-blue', label: 'Meeting' },
  phase: { bg: 'bg-otj-yellow-bg', border: 'border-otj-yellow-border', text: 'text-otj-yellow', dot: 'bg-otj-yellow', label: 'Due' },
  call: { bg: 'bg-otj-blue-bg', border: 'border-otj-blue-border', text: 'text-otj-blue', dot: 'bg-otj-blue', label: 'Call' },
  deadline: { bg: 'bg-otj-yellow-bg', border: 'border-otj-yellow-border', text: 'text-otj-yellow', dot: 'bg-otj-yellow', label: 'Amend Due' }
};

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// ─── Client Schedule Section ──────────────────────────────────────────────────

const ClientScheduleSection: React.FC<{
  projects: ReturnType<typeof useProjects>['activeProjects'];
  navigate: ReturnType<typeof useNavigate>;
}> = ({ projects, navigate }) => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const today = new Date();
  const weekNum = getWeek(weekStart, { weekStartsOn: 1 });

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const scheduleItems = useMemo(() => {
    const items: ClientScheduleItem[] = [];
    projects.forEach((proj) => {
      // Phase due dates
      proj.phases.forEach((phase) => {
        if (phase.deadline) {
          try {
            const d = parseISO(phase.deadline);
            items.push({
              label: `${proj.name.substring(0, 14)}…`,
              sublabel: `Phase ${phase.num} — ${phase.title}`,
              projectId: proj.id,
              deadline: d,
              type: 'phase',
              hour: 11,
              duration: 1
            });
          } catch {}
        }
      });
      // Meetings
      proj.meetings.forEach((meeting) => {
        try {
          const d = parseISO(meeting.date);
          const hourMatch = meeting.time?.match(/(\d+)/);
          const isPM = meeting.time?.toLowerCase().includes('pm');
          let hour = hourMatch ? parseInt(hourMatch[1]) : 9;
          if (isPM && hour < 12) hour += 12;
          if (!isPM && hour === 12) hour = 0;
          const mappedType: ClientScheduleItem['type'] = meeting.type === 'call' ? 'call' : meeting.type === 'deadline' ? 'deadline' : 'meeting';
          items.push({
            label: meeting.title,
            sublabel: proj.name,
            projectId: proj.id,
            deadline: d,
            type: mappedType,
            hour,
            duration: meeting.type === 'call' ? 1 : 2
          });
        } catch {}
      });
    });
    return items;
  }, [projects]);

  const weekItems = scheduleItems.filter((item) => weekDays.some((d) => isSameDay(item.deadline, d)));
  const meetingCount = weekItems.filter((i) => i.type === 'meeting' || i.type === 'call').length;
  const dueCount = weekItems.filter((i) => i.type === 'phase').length;

  return (
    <div className="mt-5">
      <div className="bg-card border border-border rounded-[16px] overflow-hidden">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 px-4 md:px-5 gap-2">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <Calendar className="w-[17px] h-[17px] text-foreground shrink-0" />
            <span className="text-[17px] font-extrabold tracking-[-0.04em]">Schedule</span>
            <div className="flex items-center gap-1 md:gap-2 ml-1 md:ml-3">
              <button
                onClick={() => setWeekStart(subWeeks(weekStart, 1))}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-150 text-sm">
                ‹</button>
              <span className="text-[11px] md:text-[13px] font-extrabold tracking-[-0.02em] min-w-[120px] md:min-w-[160px] text-center">
                {format(weekStart, 'MMMM yyyy')} · Week {weekNum}
              </span>
              <button
                onClick={() => setWeekStart(addWeeks(weekStart, 1))}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-150 text-sm">
                ›</button>
            </div>
            <div className="hidden md:flex items-center gap-3 ml-4">
              {[
              { key: 'meeting', color: 'bg-otj-blue', label: 'Meeting' },
              { key: 'phase', color: 'bg-otj-yellow', label: 'Due' }].
              map((l) =>
              <div key={l.key} className="flex items-center gap-1.5">
                  <div className={`w-[7px] h-[7px] rounded-full ${l.color}`} />
                  <span className="text-[11px] font-semibold text-muted-foreground">{l.label}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="text-[10px] md:text-[11px] font-bold px-2.5 md:px-3 py-[5px] rounded-full bg-primary border-[1.5px] border-primary text-primary-foreground cursor-pointer">
              Weekly
            </button>
            <button
              onClick={() => showToast('Monthly view coming soon!')}
              className="text-[10px] md:text-[11px] font-bold px-2.5 md:px-3 py-[5px] rounded-full border-[1.5px] border-border bg-card text-muted-foreground cursor-pointer hover:border-foreground transition-all">
              
              Monthly
            </button>
          </div>
        </div>

        {/* Day picker + list */}
        <div className="border-t border-border">
          <div className="flex overflow-x-auto hide-scrollbar border-b border-border">
            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, today);
              const dayEvents = scheduleItems.filter((item) => isSameDay(item.deadline, day));
              return (
                <div
                  key={i}
                  className={`flex-1 min-w-[48px] md:min-w-[80px] text-center py-2.5 md:py-3 border-r border-border last:border-r-0 ${isToday ? 'bg-[hsl(var(--otj-blue-bg))]' : ''}`}>
                  
                  <div className={`text-[9px] md:text-[10px] font-bold uppercase ${isToday ? 'text-[hsl(var(--otj-blue))]' : 'text-muted-foreground'}`}>
                    {DAY_LABELS[i]}
                  </div>
                  <div className={`text-[15px] md:text-[18px] font-extrabold mt-0.5 ${isToday ? 'text-[hsl(var(--otj-blue))]' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </div>
                  {dayEvents.length > 0 &&
                  <div className="flex justify-center mt-1 gap-[2px]">
                      {dayEvents.slice(0, 3).map((ev, j) =>
                    <div key={j} className={`w-[5px] h-[5px] md:w-[6px] md:h-[6px] rounded-full ${clientTypeConfig[ev.type]?.dot}`} />
                    )}
                    </div>
                  }
                </div>);

            })}
          </div>

          <div className="p-3 md:p-4 flex flex-col gap-2 max-h-[300px] md:max-h-[400px] overflow-y-auto">
            {weekItems.length === 0 &&
            <div className="text-center text-[12px] text-muted-foreground py-4">No events this week</div>
            }
            {weekItems.slice(0, 10).map((item, i) => {
              const cfg = clientTypeConfig[item.type];
              return (
                <div
                  key={i}
                  onClick={() => navigate(`/project/${item.projectId}`)}
                  className="flex items-center gap-2.5 md:gap-3 p-2.5 md:p-3 rounded-[10px] md:rounded-[12px] border border-border bg-card cursor-pointer hover:border-muted-foreground hover:shadow-sm transition-all">
                  
                  <div className={`w-1.5 md:w-2 self-stretch rounded-full shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] md:text-[13px] font-extrabold tracking-[-0.02em] truncate">{item.label}</div>
                    <div className="text-[10px] md:text-[11px] text-muted-foreground truncate">
                      {item.sublabel} · {format(item.deadline, 'EEE, MMM d')} · {item.hour <= 12 ? `${item.hour}:00 AM` : `${item.hour - 12}:00 PM`}
                    </div>
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-[1px] md:py-[2px] rounded ${cfg.bg} ${cfg.text} shrink-0`}>
                    {cfg.label}
                  </span>
                </div>);

            })}
          </div>
        </div>

        {/* Summary footer */}
        <div className="flex items-center gap-5 md:gap-8 p-3 md:p-4 px-4 md:px-5 border-t border-border flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--otj-blue-bg))] flex items-center justify-center shrink-0">
              <Users2 className="w-[15px] h-[15px] text-[hsl(var(--otj-blue))]" />
            </div>
            <div>
              <div className="text-[13px] md:text-[14px] font-extrabold tracking-[-0.02em]">
                {meetingCount} Meeting{meetingCount !== 1 ? 's' : ''}
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold">This week</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--otj-yellow-bg))] flex items-center justify-center shrink-0">
              <Clock className="w-[15px] h-[15px] text-[hsl(var(--otj-yellow))]" />
            </div>
            <div>
              <div className="text-[13px] md:text-[14px] font-extrabold tracking-[-0.02em]">
                {dueCount} Due Date{dueCount !== 1 ? 's' : ''}
              </div>
              <div className="text-[10px] text-muted-foreground font-semibold">Coming up</div>
            </div>
          </div>
        </div>

      </div>
    </div>);

};