import React, { useState, useMemo, useRef } from 'react';
import { showToast } from './Toast';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, ChevronDown, ArrowUpDown } from 'lucide-react';
import { categoryNiches } from '../data/niches';
import { allCreatives, categories, getFeaturedCreatives, getCreativesByNiche, getNichesForCategory } from '../data/creatives';
import { CreativeCard } from './CreativeCard';
import type { Creative } from '../data/creatives';

interface ExploreScreenProps {
  onOpenBrief: (creativeId: string) => void;
  searchQuery?: string;
}

interface Filters {
  profession: string; // niche
  category: string; // profession category
  minExperience: number; // 0 means no filter
}

const defaultFilters: Filters = {
  profession: '',
  category: '',
  minExperience: 0,
};

/** Horizontal scrollable row — Netflix-style */
const CreativeRow: React.FC<{
  title: string;
  creatives: Creative[];
  onOpenBrief: (id: string) => void;
  saved: Set<string>;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
}> = ({ title, creatives, onOpenBrief, saved, onToggleSave }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (creatives.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-2.5 px-1">
        <h3 className="text-[15px] md:text-lg font-extrabold tracking-[-0.04em]">{title}</h3>
        <span className="text-xs font-semibold text-otj-text underline underline-offset-[3px] cursor-pointer">View all →</span>
      </div>
      <div className="relative group/row">
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow-md items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-accent"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow-md items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-accent"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-2.5 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-1"
        >
          {creatives.map(c => (
            <div key={c.id} className="w-[170px] md:w-[210px] shrink-0">
              <CreativeCard
                creative={c}
                onOpenBrief={onOpenBrief}
                saved={saved.has(c.id)}
                onToggleSave={onToggleSave}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** Filter dropdown chip */
const FilterChip: React.FC<{
  label: string;
  active: boolean;
  children: React.ReactNode;
}> = ({ label, active, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 text-[12px] font-semibold px-3 py-[6px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 whitespace-nowrap ${
          active
            ? 'bg-primary border-primary text-primary-foreground'
            : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground'
        }`}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 md:left-0 mt-1.5 z-[50] min-w-[200px] max-w-[calc(100vw-32px)] bg-card border border-border rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-3 animate-fade-up">
          {children}
        </div>
      )}
    </div>
  );
};

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onOpenBrief, searchQuery = '' }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [sortBy, setSortBy] = useState<'' | 'rating' | 'experience' | 'price-low' | 'price-high'>('');
  const filterPopupRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  React.useEffect(() => {
    if (!showFilterPopup) return;
    const handler = (e: MouseEvent) => {
      if (filterPopupRef.current && !filterPopupRef.current.contains(e.target as Node)) setShowFilterPopup(false);
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

  const handleFilterChange = (f: string) => {
    setActiveFilter(f);
  };

  const activeFilterCount = (filters.profession ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.minExperience > 0 ? 1 : 0);

  const clearFilters = () => { setFilters(defaultFilters); setSortBy(''); };

  const sortLabel = sortBy === 'rating' ? 'Rating' : sortBy === 'experience' ? 'Experience' : sortBy === 'price-low' ? 'Price ↑' : sortBy === 'price-high' ? 'Price ↓' : 'Sort by';

  const applySort = (list: Creative[]): Creative[] => {
    if (!sortBy) return list;
    const sorted = [...list];
    const parsePrice = (p: string) => parseInt(p.replace(/[^0-9]/g, '')) || 0;
    switch (sortBy) {
      case 'rating': return sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      case 'experience': return sorted.sort((a, b) => b.experience - a.experience);
      case 'price-low': return sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      case 'price-high': return sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      default: return sorted;
    }
  };

  // Available niches based on active category
  const availableNiches = useMemo(() => getNichesForCategory(activeFilter), [activeFilter]);

  // Apply all filters to a creative list
  const applyFilters = (list: Creative[]): Creative[] => {
    return list.filter(c => {
      if (filters.profession && c.niche !== filters.profession) return false;
      if (filters.category && c.category !== filters.category) return false;
      if (filters.minExperience > 0 && c.experience < filters.minExperience) return false;
      return true;
    });
  };

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results = allCreatives.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.niche.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
    return applySort(applyFilters(results));
  }, [searchQuery, filters, sortBy]);

  // Build niche rows for selected category
  const nicheRows = useMemo(() => {
    if (activeFilter === 'All') return null;
    const rows = getCreativesByNiche(activeFilter);
    // Apply filters to each row
    const filtered: Record<string, Creative[]> = {};
    Object.entries(rows).forEach(([niche, creatives]) => {
      const result = applySort(applyFilters(creatives));
      if (result.length > 0) filtered[niche] = result;
    });
    return filtered;
  }, [activeFilter, filters, sortBy]);

  const featured = useMemo(() => applySort(applyFilters(getFeaturedCreatives())), [filters, sortBy]);

  // Get all unique professions (niches) for filter popup
  const allProfessions = useMemo(() => {
    const set = new Set<string>();
    allCreatives.forEach(c => set.add(c.niche));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="p-[16px_16px_80px] md:p-[20px_24px_80px]">
      {/* Category filters */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 hide-scrollbar">
        {categories.map(f => (
          <div
            key={f}
            onClick={() => handleFilterChange(f)}
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

      {/* Filter button */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative" ref={filterPopupRef}>
          <button
            onClick={() => setShowFilterPopup(s => !s)}
            className={`flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-[7px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 whitespace-nowrap ${
              activeFilterCount > 0
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary-foreground text-primary text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filter popup */}
          {showFilterPopup && (
            <div className="absolute top-full left-0 mt-2 z-[50] w-[280px] bg-card border border-border rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-4 animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[14px] font-extrabold">Filters</div>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-[11px] font-semibold text-otj-text hover:text-foreground cursor-pointer">
                    Clear all
                  </button>
                )}
              </div>

              {/* Profession (Category) */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Profession</div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.filter(c => c !== 'All').map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters(prev => ({ ...prev, category: prev.category === cat ? '' : cat }))}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all duration-150 ${
                        filters.category === cat
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-otj-off border-border text-otj-text hover:border-otj-muted'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Niche */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Niche</div>
                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
                  {allProfessions.map(niche => (
                    <button
                      key={niche}
                      onClick={() => setFilters(prev => ({ ...prev, profession: prev.profession === niche ? '' : niche }))}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all duration-150 ${
                        filters.profession === niche
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-otj-off border-border text-otj-text hover:border-otj-muted'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Experience</div>
                <div className="flex flex-wrap gap-1.5">
                  {([
                    { value: 0, label: 'Any' },
                    { value: 1, label: '1+ yrs' },
                    { value: 3, label: '3+ yrs' },
                    { value: 5, label: '5+ yrs' },
                    { value: 10, label: '10+ yrs' },
                  ]).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFilters(prev => ({ ...prev, minExperience: opt.value }))}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all duration-150 ${
                        filters.minExperience === opt.value
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-otj-off border-border text-otj-text hover:border-otj-muted'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowFilterPopup(false)}
                className="w-full text-[12px] font-bold py-2 rounded-full bg-primary text-primary-foreground cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>

        {/* Active filter tags */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
            {filters.category && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-otj-blue-bg text-otj-blue border border-otj-blue-border whitespace-nowrap">
                {filters.category}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, category: '' }))} />
              </span>
            )}
            {filters.profession && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border whitespace-nowrap">
                {filters.profession}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, profession: '' }))} />
              </span>
            )}
            {filters.minExperience > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-otj-yellow-bg text-otj-yellow border border-otj-yellow-border whitespace-nowrap">
                {filters.minExperience}+ yrs
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, minExperience: 0 }))} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Search mode — flat grid */}
      {searchResults ? (
        <>
          <div className="text-[12px] text-otj-muted mb-3">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "<span className="text-foreground font-semibold">{searchQuery}</span>"
          </div>
          {searchResults.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-sm font-bold text-foreground mb-1">No creatives found</div>
              <div className="text-[12px] text-otj-text">Try adjusting your search or filters</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 md:gap-2.5">
              {searchResults.map(c => (
                <CreativeCard
                  key={c.id}
                  creative={c}
                  onOpenBrief={onOpenBrief}
                  saved={saved.has(c.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          )}
        </>
      ) : activeFilter === 'All' ? (
        /* ALL tab — Featured + one row per category */
        <>
          <CreativeRow
            title="⭐ Featured This Week"
            creatives={featured}
            onOpenBrief={onOpenBrief}
            saved={saved}
            onToggleSave={toggleSave}
          />
          {categories.filter(c => c !== 'All').map(cat => {
            const catCreatives = applySort(applyFilters(allCreatives.filter(c => c.category === cat)));
            if (catCreatives.length === 0) return null;
            return (
              <CreativeRow
                key={cat}
                title={cat}
                creatives={catCreatives}
                onOpenBrief={onOpenBrief}
                saved={saved}
                onToggleSave={toggleSave}
              />
            );
          })}
        </>
      ) : (
        /* Category tab — one row per niche */
        <>
          {nicheRows && Object.entries(nicheRows).map(([niche, creatives]) => {
            const nicheData = (categoryNiches[activeFilter] || []).find(n => n.label === niche);
            return (
              <div key={niche}>
                <CreativeRow
                  title={niche}
                  creatives={creatives}
                  onOpenBrief={onOpenBrief}
                  saved={saved}
                  onToggleSave={toggleSave}
                />
                {nicheData && (
                  <div className="mb-5 -mt-3 px-1">
                    <div className="flex flex-wrap gap-1.5">
                      {nicheData.skills.map(skill => (
                        <span
                          key={skill}
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-otj-off border border-border text-otj-text"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {nicheRows && Object.keys(nicheRows).length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-sm font-bold text-foreground mb-1">No creatives match your filters</div>
              <div className="text-[12px] text-otj-text">Try adjusting your filters</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
