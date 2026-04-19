import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Clock, Star, Briefcase, Heart, ArrowUpRight } from 'lucide-react';
import { showToast } from './Toast';
import type { Creative } from '../data/creatives';
import portfolioFashion from '@/assets/portfolio-fashion.jpg';
import portfolioProduct from '@/assets/portfolio-product.jpg';
import portfolioFood from '@/assets/portfolio-food.jpg';
import portfolioEvent from '@/assets/portfolio-event.jpg';
import portfolioDesign from '@/assets/portfolio-design.jpg';
import portfolioVideo from '@/assets/portfolio-video.jpg';
import portfolioMakeup from '@/assets/portfolio-makeup.jpg';
import portfolioMarketing from '@/assets/portfolio-marketing.jpg';

// Map a creative's niche/category to a curated set of portfolio images
const getPortfolioImages = (niche: string, category: string): string[] => {
  const n = niche.toLowerCase();
  const c = category.toLowerCase();

  if (n.includes('fashion')) return [portfolioFashion, portfolioMakeup, portfolioProduct, portfolioDesign];
  if (n.includes('product') || n.includes('e-commerce') || n.includes('jewelry')) return [portfolioProduct, portfolioFashion, portfolioDesign, portfolioFood];
  if (n.includes('food')) return [portfolioFood, portfolioProduct, portfolioEvent, portfolioFashion];
  if (n.includes('event') || n.includes('wedding') || n.includes('real estate')) return [portfolioEvent, portfolioVideo, portfolioFashion, portfolioFood];
  if (n.includes('makeup') || n.includes('stylist')) return [portfolioMakeup, portfolioFashion, portfolioProduct, portfolioEvent];
  if (c.includes('videography') || n.includes('content creator') || n.includes('motion')) return [portfolioVideo, portfolioEvent, portfolioFashion, portfolioMarketing];
  if (c.includes('design') || n.includes('developer') || n.includes('ui/ux') || n.includes('packaging')) return [portfolioDesign, portfolioProduct, portfolioMarketing, portfolioFashion];
  if (c.includes('marketing') || c.includes('writing')) return [portfolioMarketing, portfolioDesign, portfolioVideo, portfolioProduct];

  return [portfolioFashion, portfolioProduct, portfolioDesign, portfolioVideo];
};

const ImageCarousel = ({ niche, category }: { niche: string; category: string }) => {
  const [current, setCurrent] = useState(0);
  const slides = getPortfolioImages(niche, category);

  const prev = (e: React.MouseEvent) => {e.stopPropagation();setCurrent((i) => i === 0 ? slides.length - 1 : i - 1);};
  const next = (e: React.MouseEvent) => {e.stopPropagation();setCurrent((i) => i === slides.length - 1 ? 0 : i + 1);};

  return (
    <div className="aspect-[4/3] relative overflow-hidden group/carousel bg-muted">
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}>

        {slides.map((src, i) =>
          <img
            key={i}
            src={src}
            alt={`Portfolio work ${i + 1}`}
            loading="lazy"
            width={800}
            height={640}
            className="min-w-full h-full object-cover"
          />
        )}
      </div>

      {/* Tap zones */}
      <button onClick={prev} aria-label="Prev" className="absolute left-0 top-0 h-full w-2/5 z-[2] cursor-pointer" />
      <button onClick={next} aria-label="Next" className="absolute right-0 top-0 h-full w-2/5 z-[2] cursor-pointer" />

      {/* Hover arrows */}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-[3] shadow-sm">
        <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-[3] shadow-sm">
        <ChevronRight className="w-3.5 h-3.5 text-foreground" />
      </button>

      {/* Pill dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 items-center z-[3]">
        {slides.map((_, i) =>
        <button key={i} onClick={(e) => {e.stopPropagation();setCurrent(i);}}
        className={`h-[3px] rounded-full transition-all duration-300 ${i === current ? 'bg-foreground w-3.5' : 'bg-foreground/40 w-[5px]'}`} />

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
        <ImageCarousel niche={c.niche} category={c.category} />


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