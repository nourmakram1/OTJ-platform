import React, { useState, useMemo, useRef } from 'react';
import { showToast } from './Toast';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { categoryNiches } from '../data/niches';
import { allCreatives, categories, getFeaturedCreatives, getCreativesByNiche, getNichesForCategory } from '../data/creatives';
import { CreativeCard } from './CreativeCard';
import type { Creative } from '../data/creatives';

// ── Category label map (text only — no icons on pills) ────────────────────
const CAT_LABELS: Record<string, string> = {
  'All': 'All',
  '📸 Photography': 'Photography',
  '🎥 Videography': 'Videography',
  '🎨 Design & Branding': 'Design',
  '✏️ Writing': 'Writing',
  '📊 Marketing': 'Marketing',
  '👗 Fashion & Style': 'Fashion',
  '💻 Tech & Digital': 'Tech'
};
const getCatLabel = (cat: string) => CAT_LABELS[cat] ?? cat.replace(/^[\p{Emoji_Presentation}\s]+/u, '').trim();

// ── Clean section title ────────────────────────────────────────────────────
const sectionTitle = (cat: string) => getCatLabel(cat);

// ── Types ──────────────────────────────────────────────────────────────────
interface ExploreScreenProps {
  onOpenBrief: (creativeId: string) => void;
  searchQuery?: string;
}

interface Filters {
  profession: string;
  category: string;
  minExperience: number;
  availableNow: boolean;
}

const defaultFilters: Filters = { profession: '', category: '', minExperience: 0, availableNow: false };

// ── Horizontal scroll row (Netflix-style) with expandable full grid ────────
const CreativeRow: React.FC<{
  title: string;
  creatives: Creative[];
  onOpenBrief: (id: string) => void;
  saved: Set<string>;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
}> = ({ title, creatives, onOpenBrief, saved, onToggleSave }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -(scrollRef.current.clientWidth * 0.75) : scrollRef.current.clientWidth * 0.75, behavior: 'smooth' });
  };

  if (creatives.length === 0) return null;

  return (
    <div className="mb-7">
      {/* Section title — plain text only, no icons */}
      <div className="flex items-baseline justify-between mb-3 px-0">
        <h3 className="text-[14px] md:text-[15px] font-extrabold tracking-[-0.04em]">{title}</h3>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[11px] font-semibold text-otj-muted hover:text-foreground transition-colors cursor-pointer active:scale-95">
          
          {expanded ? '↑ Collapse' : `See all (${creatives.length}) →`}
        </button>
      </div>

      {expanded ? (
      /* ── Expanded full grid ──────────────────────────────────────── */
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 animate-fade-up">
          {creatives.map((c) =>
        <CreativeCard
          key={c.id}
          creative={c}
          onOpenBrief={onOpenBrief}
          saved={saved.has(c.id)}
          onToggleSave={onToggleSave} />

        )}
        </div>) : (

      /* ── Horizontal scroll strip ─────────────────────────────────── */
      <div className="relative group/row">
          {/* Left scroll arrow */}
          <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card border border-border shadow-md items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-accent">
          
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          {/* Right scroll arrow */}
          <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card border border-border shadow-md items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-accent">
          
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>

          {/* Scrollable cards */}
          <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-1 gap-[7px]">
            {creatives.map((c) =>
          <div key={c.id} className="w-[240px] md:w-[300px] shrink-0">
                <CreativeCard
              creative={c}
              onOpenBrief={onOpenBrief}
              saved={saved.has(c.id)}
              onToggleSave={onToggleSave} />
            
              </div>
          )}
          </div>
        </div>)
      }
    </div>);

};

// ── Main screen ────────────────────────────────────────────────────────────
export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onOpenBrief, searchQuery = '' }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [sortBy, setSortBy] = useState<'' | 'rating' | 'experience' | 'price-low' | 'price-high'>('');
  const filterPopupRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!showFilterPopup) return;
    const handler = (e: MouseEvent) => {
      if (filterPopupRef.current && !filterPopupRef.current.contains(e.target as Node))
      setShowFilterPopup(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showFilterPopup]);

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(saved);
    next.has(id) ? next.delete(id) : next.add(id);
    setSaved(next);
    showToast(next.has(id) ? '♥ Saved to Collections' : 'Removed from Collections');
  };

  const activeFilterCount =
  (filters.availableNow ? 1 : 0) + (
  filters.profession ? 1 : 0) + (
  filters.category ? 1 : 0) + (
  filters.minExperience > 0 ? 1 : 0) + (
  sortBy ? 1 : 0);

  const clearFilters = () => {setFilters(defaultFilters);setSortBy('');};

  const applySort = (list: Creative[]): Creative[] => {
    if (!sortBy) return list;
    const sorted = [...list];
    const p = (s: string) => parseInt(s.replace(/[^0-9]/g, '')) || 0;
    switch (sortBy) {
      case 'rating':return sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      case 'experience':return sorted.sort((a, b) => b.experience - a.experience);
      case 'price-low':return sorted.sort((a, b) => p(a.price) - p(b.price));
      case 'price-high':return sorted.sort((a, b) => p(b.price) - p(a.price));
      default:return sorted;
    }
  };

  const applyFilters = (list: Creative[]): Creative[] =>
  list.filter((c) => {
    if (filters.availableNow && !c.avail.toLowerCase().includes('now')) return false;
    if (filters.profession && c.niche !== filters.profession) return false;
    if (filters.category && c.category !== filters.category) return false;
    if (filters.minExperience > 0 && c.experience < filters.minExperience) return false;
    return true;
  });

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return applySort(applyFilters(
      allCreatives.filter((c) =>
      c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) ||
      c.niche.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
      )
    ));
  }, [searchQuery, filters, sortBy]);

  const nicheRows = useMemo(() => {
    if (activeFilter === 'All') return null;
    const rows = getCreativesByNiche(activeFilter);
    const filtered: Record<string, Creative[]> = {};
    Object.entries(rows).forEach(([niche, list]) => {
      const result = applySort(applyFilters(list));
      if (result.length > 0) filtered[niche] = result;
    });
    return filtered;
  }, [activeFilter, filters, sortBy]);

  const featured = useMemo(() => applySort(applyFilters(getFeaturedCreatives())), [filters, sortBy]);

  const allProfessions = useMemo(() => {
    const set = new Set<string>();
    allCreatives.forEach((c) => set.add(c.niche));
    return Array.from(set).sort();
  }, []);

  // Profession chips — only for the selected category (empty when All)
  const professionChips = useMemo(() => {
    if (activeFilter === 'All') return [];
    return (categoryNiches[activeFilter] || []).map((n) => n.label);
  }, [activeFilter]);

  const showSubBar = activeFilter !== 'All' && professionChips.length > 0;
  const showActiveBar = filters.category || filters.minExperience > 0 || sortBy || filters.availableNow;

  return (
    <>
      {/* ── Sticky filter strip — full bleed, no side clip ─────────────────── */}
      <div className="sticky top-[52px] z-[90] backdrop-blur-md">
        {/* ── Bar 1: Category pills + filter button ── */}
        <div className="flex items-center gap-0 px-4 md:px-6 py-2.5 border-b border-border bg-card/95">

          {/* Scrollable pills — text only, no icons */}
          <div className="flex-1 min-w-0 relative">
            <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pr-1">
              {categories.map((f) => {
                const isActive = activeFilter === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`text-[11.5px] font-semibold px-3.5 py-[6.5px] rounded-full border-[1.5px] cursor-pointer whitespace-nowrap transition-all duration-150 shrink-0 active:scale-95 ${
                    isActive ?
                    'bg-foreground border-foreground text-background' :
                    'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground'}`
                    }>
                    
                    {getCatLabel(f)}
                  </button>);

              })}
            </div>
            {/* Right fade into filter button */}
            <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>

          {/* Pinned filter button */}
          <div className="shrink-0 pl-2 relative" ref={filterPopupRef}>
          <button
              onClick={() => setShowFilterPopup((s) => !s)}
              className={`flex items-center gap-1.5 text-[11.5px] font-bold px-3.5 py-[6.5px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 active:scale-95 ${
              activeFilterCount > 0 || showFilterPopup ?
              'bg-foreground border-foreground text-background' :
              'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground'}`
              }>
              
            <SlidersHorizontal className="w-[11px] h-[11px]" strokeWidth={2} />
            {activeFilterCount > 0 &&
              <span className="w-4 h-4 rounded-full bg-background text-foreground text-[9px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
              }
          </button>

          {/* Filter popup — right-aligned */}
          {showFilterPopup &&
            <div className="absolute top-full right-0 mt-2 z-[50] w-[280px] max-w-[calc(100vw-32px)] bg-card border border-border rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-4 animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[14px] font-extrabold tracking-[-0.03em]">Filters</div>
                {activeFilterCount > 0 &&
                <button onClick={clearFilters} className="text-[11px] font-semibold text-otj-text hover:text-foreground cursor-pointer">Clear all</button>
                }
              </div>

              {/* Profession */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Profession</div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.filter((c) => c !== 'All').map((cat) =>
                  <button key={cat}
                  onClick={() => setFilters((prev) => ({ ...prev, category: prev.category === cat ? '' : cat }))}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                  filters.category === cat ? 'bg-foreground border-foreground text-background' : 'bg-otj-off border-border text-otj-text hover:border-otj-muted'}`
                  }>
                    {getCatLabel(cat)}</button>
                  )}
                </div>
              </div>

              {/* Niche */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Niche</div>
                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
                  {allProfessions.map((niche) =>
                  <button key={niche}
                  onClick={() => setFilters((prev) => ({ ...prev, profession: prev.profession === niche ? '' : niche }))}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                  filters.profession === niche ? 'bg-foreground border-foreground text-background' : 'bg-otj-off border-border text-otj-text hover:border-otj-muted'}`
                  }>
                    {niche}</button>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Experience</div>
                <div className="flex flex-wrap gap-1.5">
                  {[{ value: 0, label: 'Any' }, { value: 1, label: '1+ yrs' }, { value: 3, label: '3+ yrs' }, { value: 5, label: '5+ yrs' }, { value: 10, label: '10+ yrs' }].map((opt) =>
                  <button key={opt.value}
                  onClick={() => setFilters((prev) => ({ ...prev, minExperience: opt.value }))}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                  filters.minExperience === opt.value ? 'bg-foreground border-foreground text-background' : 'bg-otj-off border-border text-otj-text hover:border-otj-muted'}`
                  }>
                    {opt.label}</button>
                  )}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Sort by</div>
                <div className="flex flex-wrap gap-1.5">
                  {[{ value: '', label: 'Default' }, { value: 'rating', label: 'Top Rated' }, { value: 'experience', label: 'Experience' }, { value: 'price-low', label: 'Price ↑' }, { value: 'price-high', label: 'Price ↓' }].map((opt) =>
                  <button key={opt.value}
                  onClick={() => setSortBy(opt.value as typeof sortBy)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                  sortBy === opt.value ? 'bg-foreground border-foreground text-background' : 'bg-otj-off border-border text-otj-text hover:border-otj-muted'}`
                  }>
                    {opt.label}</button>
                  )}
                </div>
              </div>

              <button onClick={() => setShowFilterPopup(false)}
              className="w-full text-[12px] font-bold py-2 rounded-full bg-foreground text-background cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
                Apply</button>
            </div>
            }
          </div>
        </div>

        {/* ── Bar 2: Sub-profession chips — only when a category is selected ── */}
        {showSubBar &&
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar px-4 md:px-6 py-2 border-b border-border bg-background/95">
            {professionChips.map((prof) => {
            const isActive = filters.profession === prof;
            return (
              <button
                key={prof}
                onClick={() => setFilters((p) => ({ ...p, profession: p.profession === prof ? '' : prof }))}
                className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-[6px] rounded-full border whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 ${
                isActive ?
                'bg-foreground text-background border-foreground' :
                'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground'}`
                }>
                
                  {prof}
                  {isActive && <X className="w-3 h-3 ml-0.5" />}
                </button>);

          })}
          </div>
        }

        {/* ── Bar 3: Active filter chips — only when filters applied ─────── */}
        {showActiveBar &&
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar px-4 md:px-6 py-2 border-b border-border">
            {filters.availableNow &&
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Available Now
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters((p) => ({ ...p, availableNow: false }))} />
              </span>
          }
            {filters.category &&
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-otj-blue-bg text-otj-blue border border-otj-blue-border whitespace-nowrap">
                {getCatLabel(filters.category)}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters((p) => ({ ...p, category: '' }))} />
              </span>
          }
            {filters.minExperience > 0 &&
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-otj-yellow-bg text-otj-yellow border border-otj-yellow-border whitespace-nowrap">
                {filters.minExperience}+ yrs exp
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters((p) => ({ ...p, minExperience: 0 }))} />
              </span>
          }
            {sortBy &&
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-otj-purple-bg text-otj-purple border border-border whitespace-nowrap">
                {sortBy === 'rating' ? 'Top Rated' : sortBy === 'experience' ? 'Most Experienced' : sortBy === 'price-low' ? 'Price ↑' : 'Price ↓'}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSortBy('')} />
              </span>
          }
            <button
            onClick={clearFilters}
            className="text-[11px] font-semibold text-otj-muted hover:text-foreground whitespace-nowrap transition-colors cursor-pointer shrink-0 ml-auto pl-2">
            
              Clear all
            </button>
          </div>
        }
      </div>{/* /sticky strip */}

      {/* ── Scrollable content ─────────────────────────────────────── */}
      <div className="p-[16px_16px_88px] md:p-[20px_24px_88px] pt-5">

      {/* ── Search results ──────────────────────────────────────────── */}
      {searchResults ?
        <>
          <div className="text-[12px] text-otj-muted mb-4">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "<span className="text-foreground font-semibold">{searchQuery}</span>"
          </div>
          {searchResults.length === 0 ?
          <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-sm font-bold mb-1">No creatives found</div>
              <div className="text-[12px] text-otj-text">Try adjusting your search or filters</div>
            </div> :

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {searchResults.map((c) =>
            <CreativeCard key={c.id} creative={c} onOpenBrief={onOpenBrief} saved={saved.has(c.id)} onToggleSave={toggleSave} />
            )}
            </div>
          }
        </> :

        activeFilter === 'All' ? (
        /* ── All — Featured + one row per category ──────────────────── */
        <>
          <CreativeRow title="Featured This Week" creatives={featured} onOpenBrief={onOpenBrief} saved={saved} onToggleSave={toggleSave} />
          {categories.filter((c) => c !== 'All').map((cat) =>
          <CreativeRow
            key={cat}
            title={sectionTitle(cat)}
            creatives={applySort(applyFilters(allCreatives.filter((c) => c.category === cat)))}
            onOpenBrief={onOpenBrief}
            saved={saved}
            onToggleSave={toggleSave} />

          )}
        </>) : (


        /* ── Category — one row per niche ────────────────────────────── */
        <>
          {nicheRows && Object.entries(nicheRows).map(([niche, nicheCreatives]) => {
            const nicheData = (categoryNiches[activeFilter] || []).find((n) => n.label === niche);
            return (
              <div key={niche}>
                <CreativeRow title={niche} creatives={nicheCreatives} onOpenBrief={onOpenBrief} saved={saved} onToggleSave={toggleSave} />
                {nicheData &&
                <div className="mb-6 -mt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {nicheData.skills.map((skill) =>
                    <span key={skill} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-otj-off border border-border text-otj-text">{skill}</span>
                    )}
                    </div>
                  </div>
                }
              </div>);

          })}
          {nicheRows && Object.keys(nicheRows).length === 0 &&
          <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-sm font-bold mb-1">No creatives match your filters</div>
              <div className="text-[12px] text-otj-text">Try adjusting your filters</div>
            </div>
          }
        </>)
        }
      </div>{/* /content */}
    </>);

};