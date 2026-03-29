import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Toast } from '../components/Toast';
import { showToast } from '../components/Toast';
import { useProjects } from '../context/ProjectContext';
import { Archive as ArchiveIcon, CheckCircle2, XCircle, Search, Download, RotateCcw, Calendar, DollarSign, Filter } from 'lucide-react';

type ArchiveFilter = 'all' | 'completed' | 'declined';

const Archive = () => {
  const navigate = useNavigate();
  const { completedProjects, activeProjects } = useProjects();
  const [filter, setFilter] = useState<ArchiveFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Build archive items from completed projects + simulated declined briefs
  const declinedBriefs = [
    { icon: '❌', name: 'Vodafone Holiday Promo', client: 'Declined Jan 20', earned: '—', status: 'declined' as const, clientName: 'Karim Nasser', reason: 'Schedule conflict' },
    { icon: '❌', name: 'Samsung Unboxing Video', client: 'Declined Dec 15', earned: '—', status: 'declined' as const, clientName: 'Mariam El-Sayed', reason: 'Budget misalignment' },
  ];

  const completedItems = completedProjects.map(p => ({
    ...p,
    status: 'completed' as const,
    clientName: p.client.replace('Completed ', ''),
    reason: undefined,
  }));

  const allItems = [...completedItems, ...declinedBriefs];

  const filtered = allItems
    .filter(item => filter === 'all' || item.status === filter)
    .filter(item =>
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const completedCount = completedItems.length;
  const declinedCount = declinedBriefs.length;
  const totalEarned = completedProjects.reduce((sum, p) => {
    const num = parseInt(p.earned.replace(/[^0-9]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <>
      <NavBar />
      <div className="max-w-[1100px] mx-auto p-4 md:p-6 pb-20 md:pb-6 pt-[72px]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ArchiveIcon className="w-5 h-5 text-foreground" />
              <h1 className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.04em]">Project Archive</h1>
            </div>
            <p className="text-[12px] md:text-[13px] text-otj-text mt-0.5">
              {allItems.length} archived projects · {completedCount} completed · {declinedCount} declined
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
          {[
            { label: 'Completed', val: String(completedCount), icon: <CheckCircle2 size={13} className="text-[hsl(var(--otj-green))]" />, sub: 'Projects' },
            { label: 'Declined', val: String(declinedCount), icon: <XCircle size={13} className="text-destructive" />, sub: 'Briefs' },
            { label: 'Total Earned', val: `${totalEarned.toLocaleString()} EGP`, icon: <DollarSign size={13} className="text-[hsl(var(--otj-blue))]" />, sub: 'From completed' },
            { label: 'Avg per Project', val: completedCount > 0 ? `${Math.round(totalEarned / completedCount).toLocaleString()} EGP` : '—', icon: <Calendar size={13} className="text-muted-foreground" />, sub: 'Revenue' },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-[14px] p-3.5 px-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                {s.icon}
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">{s.label}</span>
              </div>
              <div className="text-[18px] font-extrabold tracking-[-0.03em] text-foreground leading-tight">{s.val}</div>
              <div className="text-[10px] text-otj-muted mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Filter + Search bar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex gap-1.5">
            {([
              { key: 'all' as const, label: 'All', count: allItems.length },
              { key: 'completed' as const, label: 'Completed', count: completedCount },
              { key: 'declined' as const, label: 'Declined', count: declinedCount },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`text-[11.5px] font-bold px-3.5 py-[6px] rounded-full cursor-pointer transition-all duration-150 border ${
                  filter === f.key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-otj-text border-border hover:bg-otj-off hover:text-foreground'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
          <div className="relative flex-1 sm:max-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-otj-muted" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search archived projects…"
              className="w-full pl-8 pr-3 py-[7px] rounded-full border-[1.5px] border-border bg-card text-[12px] text-foreground outline-none transition-all duration-150 focus:border-foreground placeholder:text-otj-muted"
            />
          </div>
        </div>

        {/* Project list */}
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-[14px] p-10 text-center">
            <div className="text-3xl mb-3">📂</div>
            <div className="text-[14px] font-extrabold mb-1">No projects found</div>
            <div className="text-[12px] text-otj-muted">
              {searchQuery ? 'Try a different search term.' : 'No archived projects match this filter.'}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((item, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-[14px] p-4 hover:shadow-sm transition-all duration-150 group cursor-pointer"
                onClick={() => item.status === 'completed' && 'id' in item && navigate(`/completed/${(item as any).id}`)}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-otj-off flex items-center justify-center text-[18px] shrink-0">
                    {item.status === 'completed' ? item.icon : '❌'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-extrabold tracking-[-0.02em] text-foreground">{item.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-[2px] rounded-full border shrink-0 ${
                        item.status === 'completed'
                          ? 'bg-[hsl(var(--otj-green-bg))] text-[hsl(var(--otj-green))] border-[hsl(var(--otj-green-border))]'
                          : 'bg-destructive/10 text-destructive border-destructive/20'
                      }`}>
                        {item.status === 'completed' ? 'Completed' : 'Declined'}
                      </span>
                    </div>
                    <div className="text-[12px] text-otj-muted mt-0.5">{item.client}</div>
                    {item.reason && (
                      <div className="text-[11px] text-otj-text mt-1 italic">Reason: {item.reason}</div>
                    )}
                  </div>

                  {/* Earned + Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {item.status === 'completed' && (
                      <span className="text-[13px] font-extrabold text-foreground tracking-[-0.02em]">{item.earned}</span>
                    )}
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {item.status === 'completed' && (
                        <button
                          onClick={() => showToast('Downloading deliverables…')}
                          className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border border-border bg-otj-off text-otj-text hover:text-foreground hover:border-foreground cursor-pointer transition-all duration-150"
                        >
                          <Download size={10} />
                          Deliverables
                        </button>
                      )}
                      <button
                        onClick={() => {
                          showToast(item.status === 'completed' ? 'Rebooking creative…' : 'Creating new brief…');
                          setTimeout(() => navigate('/explore'), 600);
                        }}
                        className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground border-none cursor-pointer transition-all duration-150 hover:opacity-90"
                      >
                        <RotateCcw size={10} />
                        Rebook
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast />
    </>
  );
};

export default Archive;
