import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Clock, Star, Briefcase, Heart, ArrowUpRight } from 'lucide-react';
import { showToast } from './Toast';
import type { Creative } from '../data/creatives';

// Fashion
import portfolioFashion from '@/assets/portfolio-fashion.jpg';
import portfolioFashion2 from '@/assets/portfolio-fashion-2.jpg';
import portfolioFashion3 from '@/assets/portfolio-fashion-3.jpg';
// Product / E-commerce / Jewelry
import portfolioProduct from '@/assets/portfolio-product.jpg';
import portfolioProduct2 from '@/assets/portfolio-product-2.jpg';
import portfolioProduct3 from '@/assets/portfolio-product-3.jpg';
import portfolioEcommerce1 from '@/assets/portfolio-ecommerce-1.jpg';
import portfolioJewelry1 from '@/assets/portfolio-jewelry-1.jpg';
import portfolioJewelry2 from '@/assets/portfolio-jewelry-2.jpg';
import portfolioPackaging1 from '@/assets/portfolio-packaging-1.jpg';
// Food
import portfolioFood from '@/assets/portfolio-food.jpg';
import portfolioFood2 from '@/assets/portfolio-food-2.jpg';
import portfolioFood3 from '@/assets/portfolio-food-3.jpg';
// Event / Wedding / Real Estate
import portfolioEvent from '@/assets/portfolio-event.jpg';
import portfolioEvent2 from '@/assets/portfolio-event-2.jpg';
import portfolioEvent3 from '@/assets/portfolio-event-3.jpg';
import portfolioWedding1 from '@/assets/portfolio-wedding-1.jpg';
import portfolioWedding2 from '@/assets/portfolio-wedding-2.jpg';
import portfolioRealestate1 from '@/assets/portfolio-realestate-1.jpg';
import portfolioRealestate2 from '@/assets/portfolio-realestate-2.jpg';
// Beauty / Stylist
import portfolioMakeup from '@/assets/portfolio-makeup.jpg';
import portfolioMakeup2 from '@/assets/portfolio-makeup-2.jpg';
import portfolioMakeup3 from '@/assets/portfolio-makeup-3.jpg';
import portfolioStylist1 from '@/assets/portfolio-stylist-1.jpg';
// Video / Content / Motion
import portfolioVideo from '@/assets/portfolio-video.jpg';
import portfolioVideo2 from '@/assets/portfolio-video-2.jpg';
import portfolioVideo3 from '@/assets/portfolio-video-3.jpg';
import portfolioContent1 from '@/assets/portfolio-content-1.jpg';
import portfolioMotion1 from '@/assets/portfolio-motion-1.jpg';
// Design / UI/UX / Dev
import portfolioDesign from '@/assets/portfolio-design.jpg';
import portfolioDesign2 from '@/assets/portfolio-design-2.jpg';
import portfolioDesign3 from '@/assets/portfolio-design-3.jpg';
import portfolioUiux1 from '@/assets/portfolio-uiux-1.jpg';
import portfolioDev1 from '@/assets/portfolio-dev-1.jpg';
import portfolioDev2 from '@/assets/portfolio-dev-2.jpg';
// Marketing / Writing
import portfolioMarketing from '@/assets/portfolio-marketing.jpg';
import portfolioSocial1 from '@/assets/portfolio-social-1.jpg';
import portfolioAds1 from '@/assets/portfolio-ads-1.jpg';
import portfolioWriting1 from '@/assets/portfolio-writing-1.jpg';
import portfolioWriting2 from '@/assets/portfolio-writing-2.jpg';
import portfolioScript1 from '@/assets/portfolio-script-1.jpg';

// Niche → curated portfolio image pool (3-5 highly relevant shots each)
const NICHE_POOLS: Record<string, string[]> = {
  'Fashion Photographer':       [portfolioFashion, portfolioFashion2, portfolioFashion3, portfolioMakeup3, portfolioStylist1],
  'Product Photographer':       [portfolioProduct, portfolioProduct2, portfolioProduct3, portfolioPackaging1, portfolioJewelry1],
  'Food Photographer':          [portfolioFood, portfolioFood2, portfolioFood3, portfolioProduct],
  'E-commerce Photographer':    [portfolioEcommerce1, portfolioProduct, portfolioProduct2, portfolioPackaging1],
  'Event Photographer':         [portfolioEvent, portfolioEvent2, portfolioEvent3, portfolioWedding2],
  'Real Estate Photographer':   [portfolioRealestate1, portfolioRealestate2, portfolioRealestate1, portfolioRealestate2],
  'Jewelry Photographer':       [portfolioJewelry1, portfolioJewelry2, portfolioProduct2, portfolioProduct3],
  'Wedding Videographer':       [portfolioWedding1, portfolioWedding2, portfolioVideo, portfolioEvent],
  'Commercial Videographer':    [portfolioVideo, portfolioVideo2, portfolioVideo3, portfolioMotion1],
  'Content Creator':            [portfolioContent1, portfolioSocial1, portfolioVideo, portfolioMarketing],
  'Brand Designer':             [portfolioDesign, portfolioDesign2, portfolioDesign3, portfolioPackaging1],
  'UI/UX Designer':             [portfolioUiux1, portfolioDev2, portfolioDesign2, portfolioDesign3],
  'Packaging Designer':         [portfolioPackaging1, portfolioProduct3, portfolioDesign, portfolioDesign2],
  'Copywriter':                 [portfolioWriting2, portfolioWriting1, portfolioMarketing, portfolioSocial1],
  'Content Writer':             [portfolioWriting1, portfolioWriting2, portfolioMarketing],
  'Script Writer':              [portfolioScript1, portfolioWriting1, portfolioVideo3],
  'Social Media Manager':       [portfolioSocial1, portfolioContent1, portfolioMarketing, portfolioAds1],
  'Performance Marketer':       [portfolioAds1, portfolioMarketing, portfolioSocial1],
  'Fashion Stylist':            [portfolioStylist1, portfolioFashion2, portfolioFashion, portfolioMakeup],
  'Makeup Artist':              [portfolioMakeup, portfolioMakeup2, portfolioMakeup3, portfolioFashion],
  'Web Developer':              [portfolioDev1, portfolioDev2, portfolioUiux1, portfolioDesign2],
  'Motion Designer':            [portfolioMotion1, portfolioVideo3, portfolioDesign3, portfolioVideo2],
};

// Deterministic shuffle so each creative gets a unique-feeling rotation
const seededShuffle = <T,>(arr: T[], seed: string): T[] => {
  const a = [...arr];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 9301 + 49297) % 233280;
    const j = Math.abs(h) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const getPortfolioImages = (niche: string, id: string): string[] => {
  const pool = NICHE_POOLS[niche] ?? [portfolioFashion, portfolioProduct, portfolioDesign, portfolioVideo];
  // Dedupe while preserving order
  const unique = Array.from(new Set(pool));
  return seededShuffle(unique, id);
};

const ImageCarousel = ({ niche, id }: { niche: string; id: string }) => {
  const [current, setCurrent] = useState(0);
  const slides = useMemo(() => getPortfolioImages(niche, id), [niche, id]);

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
            alt={`${niche} portfolio work ${i + 1}`}
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
        <ImageCarousel niche={c.niche} id={c.id} />


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