import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Clock, Star, Briefcase, Heart, ArrowUpRight } from 'lucide-react';
import { showToast } from './Toast';
import type { Creative } from '../data/creatives';

const portfolioImages = [
'from-[#2a2a2a] to-[#444]',
'from-[#3a2a1a] to-[#5a4a3a]',
'from-[#1a2a3a] to-[#3a4a5a]',
'from-[#2a1a3a] to-[#4a3a5a]'];


const ImageCarousel = ({ bg, emoji }: {bg: string;emoji: string;}) => {
  const [current, setCurrent] = useState(0);
  const slides = [bg, ...portfolioImages];

  const prev = (e: React.MouseEvent) => {e.stopPropagation();setCurrent((i) => i === 0 ? slides.length - 1 : i - 1);};
  const next = (e: React.MouseEvent) => {e.stopPropagation();setCurrent((i) => i === slides.length - 1 ? 0 : i + 1);};

  return (
    <div className="aspect-[4/3] relative overflow-hidden group/carousel">
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}>
        
        {slides.map((gradient, i) =>
        <div key={i} className={`min-w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br ${gradient}`}>
            {i === 0 && <span>{emoji}</span>}
          </div>
        )}
      </div>

      {/* Tap zones */}
      <button onClick={prev} aria-label="Prev" className="absolute left-0 top-0 h-full w-2/5 z-[2] cursor-pointer" />
      <button onClick={next} aria-label="Next" className="absolute right-0 top-0 h-full w-2/5 z-[2] cursor-pointer" />

      {/* Hover arrows */}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-[3] shadow-sm">
        <ChevronLeft className="w-3.5 h-3.5 text-gray-800" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-[3] shadow-sm">
        <ChevronRight className="w-3.5 h-3.5 text-gray-800" />
      </button>

      {/* Pill dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 items-center z-[3]">
        {slides.map((_, i) =>
        <button key={i} onClick={(e) => {e.stopPropagation();setCurrent(i);}}
        className={`h-[3px] rounded-full transition-all duration-300 ${i === current ? 'bg-white w-3.5' : 'bg-white/45 w-[5px]'}`} />

        )}
      </div>
    </div>);

};

interface CreativeCardProps {
  creative: Creative;
  onOpenBrief: (id: string) => void;
  saved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
}

export const CreativeCard: React.FC<CreativeCardProps> = ({ creative: c, onOpenBrief, saved, onToggleSave }) => {
  const navigate = useNavigate();
  const expLabel = c.experience >= 10 ? '10+ yrs' : c.experience === 1 ? '1 yr' : `${c.experience} yrs`;

  return (
    <div
      onClick={() => onOpenBrief(c.id)}
      className="bg-card border border-border rounded-[18px] overflow-hidden cursor-pointer transition-all duration-200 w-full snap-start hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] hover:-translate-y-[2px] flex flex-col"
      style={{ fontFamily: "'Neue Haas Grotesk Display Pro','NeueHaasDisplay','Helvetica Neue',Helvetica,Arial,sans-serif" }}>
      
      {/* ── Inset image ─────────────────────────────────────────────── */}
      <div className="relative">
        <ImageCarousel bg={c.bg} emoji={c.emoji} />


        {/* Save — white circle top-right */}
        <button
          onClick={(e) => {e.stopPropagation();onToggleSave(e, c.id);showToast(saved ? 'Removed from Collections' : '♥ Saved');}}
          className="absolute top-[15px] right-[15px] w-[26px] h-[26px] rounded-full bg-white shadow-sm flex items-center justify-center z-[4] transition-all hover:scale-110 active:scale-95">
          
          <Heart className={`w-[12px] h-[12px] transition-all ${saved ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
      </div>

      {/* ── Info — clear 4-level hierarchy ──────────────────────────── */}
      <div className="px-[11px] pt-[10px] pb-[11px] flex flex-col gap-[7px] flex-1">

        {/* 1 — Identity + rating */}
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="font-bold tracking-[-0.025em] truncate leading-snug text-sm">{c.name}</div>
            <div className="text-[10px] text-otj-text truncate mt-[1px] tracking-[-0.01em]">{c.role}</div>
          </div>
          <div className="flex items-center gap-[4px] shrink-0 pt-[1.5px]">
            <Star className="w-[10px] h-[10px] fill-otj-yellow text-otj-yellow shrink-0" />
            <span className="text-[10.5px] font-bold tracking-[-0.02em]">{c.rating}</span>
          </div>
        </div>

        {/* 2 — Context: location · experience · jobs */}
        <div className="text-[9.5px] text-otj-muted gap-[6px] flex items-center justify-start">
          <span className="flex items-center gap-[3px]">
            <MapPin className="w-[9px] h-[9px] shrink-0" strokeWidth={2.2} />
            Cairo, EG
          </span>
          <span className="w-[3px] h-[3px] rounded-full bg-otj-muted/40 shrink-0" />
          <span className="flex items-center gap-[3px]">
            <Clock className="w-[9px] h-[9px] shrink-0" strokeWidth={2.2} />
            {expLabel}
          </span>
          <span className="w-[3px] h-[3px] rounded-full bg-otj-muted/40 shrink-0" />
          <span className="flex items-center gap-[3px]">
            <Briefcase className="w-[9px] h-[9px] shrink-0" strokeWidth={2.2} />
            {c.jobs}
          </span>
        </div>

        {/* 4 — Actions */}
        <div className="flex gap-[6px] mt-auto pt-[2px]">
          <button
            onClick={(e) => {e.stopPropagation();onOpenBrief(c.id);}}
            className="flex-1 flex items-center justify-center gap-[3px] py-[6.5px] rounded-full bg-foreground text-background text-[9.5px] font-bold tracking-[-0.01em] cursor-pointer hover:opacity-85 active:scale-[0.97] transition-all">
            
            Book Now <ArrowUpRight className="w-[9px] h-[9px] opacity-80" strokeWidth={2.5} />
          </button>
          <button
            onClick={(e) => {e.stopPropagation();navigate(`/creative/${c.id}`);}}
            className="flex-1 py-[6.5px] rounded-full border-[1.5px] border-border text-[9.5px] font-bold tracking-[-0.01em] cursor-pointer text-otj-text hover:border-foreground hover:text-foreground active:scale-[0.97] transition-all">
            
            View Profile
          </button>
        </div>
      </div>
    </div>);

};