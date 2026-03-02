import React, { useState } from 'react';
import { showToast } from './Toast';

const creatives = [
  { id: 'nour', emoji: '👩‍🎨', name: 'Nour Makram', role: 'Fashion & E-commerce Photographer', price: 'from 2,000 EGP', unit: '/ half day', rating: '4.9', jobs: '127 jobs', avail: 'Available now', bg: 'from-[#2a2a2a] to-[#555]' },
  { id: 'karim', emoji: '✏️', name: 'Karim Samy', role: 'Script Writer & Copywriter', price: 'from 1,500 EGP', unit: '/ project', rating: '4.8', jobs: '89 jobs', avail: 'Available now', bg: 'from-[#1a3a5c] to-[#2d5a8c]' },
  { id: 'sara', emoji: '🎨', name: 'Sara Ahmed', role: 'Brand Designer', price: 'from 3,000 EGP', unit: '/ project', rating: '5.0', jobs: '54 jobs', avail: 'Next week', bg: 'from-[#5c1a3a] to-[#8c2d5a]' },
  { id: 'omar', emoji: '🎥', name: 'Omar Hassan', role: 'Cinematographer & Editor', price: 'from 4,000 EGP', unit: '/ day', rating: '4.7', jobs: '203 jobs', avail: 'Available now', bg: 'from-[#3a1a5c] to-[#5a2d8c]' },
];

const moreCreatives = [
  { id: 'layla', emoji: '💄', name: 'Layla Nabil', role: 'MUA & Stylist', price: 'from 1,200 EGP', unit: '/ session', rating: '4.6', jobs: '78 jobs', avail: 'Available now', bg: 'from-[#5c3a1a] to-[#8c5a2d]' },
  { id: 'ahmed', emoji: '📱', name: 'Ahmed Karim', role: 'Social Media Manager', price: 'from 2,500 EGP', unit: '/ month', rating: '4.5', jobs: '45 jobs', avail: 'Available now', bg: 'from-[#1a5c3a] to-[#2d8c5a]' },
  { id: 'dina', emoji: '🎬', name: 'Dina Youssef', role: 'Creative Director', price: 'from 5,000 EGP', unit: '/ project', rating: '4.9', jobs: '112 jobs', avail: 'Next week', bg: 'from-[#4a2a1a] to-[#6a4a2a]' },
  { id: 'tarek', emoji: '🎪', name: 'Tarek Saad', role: 'Event Producer', price: 'from 6,000 EGP', unit: '/ event', rating: '4.8', jobs: '67 jobs', avail: 'Available now', bg: 'from-[#2a2a4a] to-[#3a3a6a]' },
];

const filters = ['All', '📸 Photography', '🎥 Videography', '🎨 Design & Branding', '✏️ Writing', '📊 Marketing', '👗 Fashion & Style', '💻 Tech & Digital'];

interface ExploreScreenProps {
  onOpenBrief: (creativeId: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onOpenBrief }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(saved);
    next.has(id) ? next.delete(id) : next.add(id);
    setSaved(next);
    showToast(next.has(id) ? '♥ Saved to Collections' : 'Removed from Collections');
  };

  const CreativeCard = ({ c }: { c: typeof creatives[0] }) => (
    <div onClick={() => onOpenBrief(c.id)} className="bg-card border border-border rounded-[18px] overflow-hidden cursor-pointer transition-all duration-200 relative group hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-0.5">
      <div className={`h-[180px] flex items-center justify-center text-[56px] relative bg-gradient-to-br ${c.bg}`}>
        <span>{c.emoji}</span>
        <button onClick={(e) => toggleSave(e, c.id)} className="absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-full bg-card/90 border-none cursor-pointer text-sm flex items-center justify-center transition-all duration-150 z-[2] hover:bg-card hover:scale-110">
          {saved.has(c.id) ? '♥' : '♡'}
        </button>
        {/* Hover preview */}
        <div className="absolute inset-0 rounded-[18px] bg-foreground/92 backdrop-blur-lg flex flex-col justify-end p-3.5 opacity-0 transition-opacity duration-200 z-[3] pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
          <div className="text-[15px] font-extrabold text-primary-foreground tracking-[-0.03em] mb-0.5">{c.name}</div>
          <div className="text-[11px] text-primary-foreground/50 mb-2">{c.role}</div>
          <div className="text-[13px] font-bold text-primary-foreground mb-2.5">{c.price} <span className="text-[10px] text-primary-foreground/40 font-medium">{c.unit}</span></div>
          <div className="flex gap-1.5">
            <button onClick={(e) => { e.stopPropagation(); showToast('Opening full profile…'); }} className="flex-1 py-2 rounded-full text-[11.5px] font-bold cursor-pointer transition-all duration-150 border-[1.5px] border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">View Profile</button>
            <button onClick={(e) => { e.stopPropagation(); onOpenBrief(c.id); }} className="flex-1 py-2 rounded-full text-[11.5px] font-bold cursor-pointer transition-all duration-150 border-[1.5px] border-primary-foreground bg-primary-foreground text-foreground hover:bg-otj-off">Quick Brief</button>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="text-sm font-extrabold tracking-[-0.03em] mb-0.5">{c.name}</div>
        <div className="text-[11px] text-otj-text mb-1.5">{c.role}</div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[11px] font-bold text-foreground">⭐ {c.rating}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-otj-muted" />
          <span className="text-[11px] text-otj-text">{c.jobs}</span>
        </div>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
          c.avail.includes('now') ? 'bg-otj-green-bg text-otj-green border border-otj-green-border' : 'bg-otj-orange-bg text-otj-orange'
        }`}>{c.avail}</div>
        <div className="flex gap-1.5 mt-2.5">
          <button onClick={(e) => { e.stopPropagation(); showToast('Opening full profile…'); }} className="flex-1 py-[7px] rounded-full border-[1.5px] border-border bg-transparent text-[11.5px] font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground">View</button>
          <button onClick={(e) => { e.stopPropagation(); onOpenBrief(c.id); }} className="flex-1 py-[7px] rounded-full border-[1.5px] border-primary bg-primary text-primary-foreground text-[11.5px] font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:bg-primary/90">Book</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-[20px_24px_80px]">
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 hide-scrollbar">
        {filters.map(f => (
          <div
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-[12.5px] font-semibold px-4 py-[7px] rounded-full border-[1.5px] cursor-pointer whitespace-nowrap transition-all duration-150 shrink-0 ${
              activeFilter === f
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground'
            }`}
          >
            {f}
          </div>
        ))}
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <div className="text-lg font-extrabold tracking-[-0.04em]">Featured This Week</div>
        <div className="text-xs font-semibold text-otj-text underline underline-offset-[3px] cursor-pointer">View all →</div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 mb-7">
        {creatives.map(c => <CreativeCard key={c.id} c={c} />)}
      </div>

      <div className="flex items-baseline justify-between mb-3">
        <div className="text-lg font-extrabold tracking-[-0.04em]">Recently Active</div>
        <div className="text-xs font-semibold text-otj-text underline underline-offset-[3px] cursor-pointer">View all →</div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 mb-7">
        {moreCreatives.map(c => <CreativeCard key={c.id} c={c} />)}
      </div>
    </div>
  );
};
