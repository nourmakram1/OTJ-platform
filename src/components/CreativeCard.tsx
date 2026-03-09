import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { showToast } from './Toast';
import type { Creative } from '../data/creatives';

const portfolioImages = [
  'from-[#2a2a2a] to-[#444]',
  'from-[#3a2a1a] to-[#5a4a3a]',
  'from-[#1a2a3a] to-[#3a4a5a]',
  'from-[#2a1a3a] to-[#4a3a5a]',
  'from-[#3a3a1a] to-[#5a5a3a]',
];

const ImageCarousel = ({ bg, emoji }: { bg: string; emoji: string }) => {
  const [current, setCurrent] = useState(0);
  const slides = [bg, ...portfolioImages.slice(0, 4)];

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(i => (i === 0 ? slides.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(i => (i === slides.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="h-[140px] md:h-[220px] relative overflow-hidden group/carousel">
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((gradient, i) => (
          <div
            key={i}
            className={`min-w-full h-full flex items-center justify-center text-[56px] bg-gradient-to-br ${gradient}`}
          >
            {i === 0 && <span>{emoji}</span>}
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 z-[2] hover:bg-card"
      >
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 z-[2] hover:bg-card"
      >
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-[2]">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              i === current ? 'bg-card w-3' : 'bg-card/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

interface CreativeCardProps {
  creative: Creative;
  onOpenBrief: (id: string) => void;
  saved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
}

export const CreativeCard: React.FC<CreativeCardProps> = ({ creative: c, onOpenBrief, saved, onToggleSave }) => {
  const navigate = useNavigate();
  return (
  <div
    onClick={() => onOpenBrief(c.id)}
    className="bg-card border border-border rounded-[18px] overflow-hidden cursor-pointer transition-all duration-200 relative hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 w-full h-full flex flex-col snap-start"
  >
    <div className="relative">
      <ImageCarousel bg={c.bg} emoji={c.emoji} />
      <div className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full z-[2] ${
        c.avail.includes('now') ? 'bg-otj-green-bg text-otj-green border border-otj-green-border' : 'bg-otj-orange-bg text-otj-orange'
      }`}>{c.avail}</div>
      <button onClick={(e) => onToggleSave(e, c.id)} className="absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-full bg-card/90 border-none cursor-pointer text-sm flex items-center justify-center transition-all duration-150 z-[2] hover:bg-card hover:scale-110">
        {saved ? '♥' : '♡'}
      </button>
    </div>
    <div className="p-2.5 md:p-3 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-0.5">
        <div className="text-[12px] md:text-sm font-extrabold tracking-[-0.03em] truncate">{c.name}</div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-foreground">⭐ {c.rating}</span>
          <span className="text-[11px] text-otj-text">({c.jobs.replace(' jobs', '')})</span>
        </div>
      </div>
      <div className="text-[11px] text-otj-text mb-1.5">{c.role}</div>
      <div className="flex items-center gap-2 text-[11px] text-otj-text mb-2.5 flex-wrap">
        <span className="flex items-center gap-1">👥 {c.jobs}</span>
        <span className="w-[3px] h-[3px] rounded-full bg-otj-muted" />
        <span className="flex items-center gap-1">📍 Cairo, EG</span>
        <span className="w-[3px] h-[3px] rounded-full bg-otj-muted" />
        <span className="flex items-center gap-1">🏅 {c.experience >= 10 ? 'Veteran 10+' : c.experience >= 5 ? 'Expert 5+' : 'Beginner 1-3'}</span>
      </div>
      <div className="flex gap-1.5">
        <button onClick={(e) => { e.stopPropagation(); onOpenBrief(c.id); }} className="flex-1 py-[7px] rounded-full border-[1.5px] border-primary bg-primary text-primary-foreground text-[11.5px] font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:bg-primary/90">Book Now</button>
        <button onClick={(e) => { e.stopPropagation(); navigate(`/creative/${c.id}`); }} className="flex-1 py-[7px] rounded-full border-[1.5px] border-border bg-transparent text-[11.5px] font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] hover:border-foreground hover:text-foreground">View Profile</button>
      </div>
    </div>
  </div>
  );
};
