import React, { useState, useMemo, useRef } from 'react';
import { showToast } from './Toast';
import { SlidersHorizontal, X } from 'lucide-react';
import { categoryNiches } from '../data/niches';
import { allCreatives, categories, getFeaturedCreatives, getCreativesByNiche, getNichesForCategory } from '../data/creatives';
import { CreativeCard } from './CreativeCard';
import type { Creative } from '../data/creatives';

interface ExploreScreenProps {
  onOpenBrief: (creativeId: string) => void;
  searchQuery?: string;
}

interface Filters {
  profession: string;
  category: string;
  minExperience: number;
}

const defaultFilters: Filters = {
  profession: '',
  category: '',
  minExperience: 0,
};

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

  const activeFilterCount = (filters.profession ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.minExperience > 0 ? 1 : 0);

  const clearFilters = () => { setFilters(defaultFilters); setSortBy(''); };

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

  const applyFilters = (list: Creative[]): Creative[] => {
    return list.filter(c => {
      if (filters.profession && c.niche !== filters.profession) return false;
      if (filters.category && c.category !== filters.category) return false;
      if (filters.minExperience > 0 && c.experience < filters.minExperience) return false;
      return true;
    });
  };

  const allProfessions = useMemo(() => {
    const set = new Set<string>();
    allCreatives.forEach(c => set.add(c.niche));
    return Array.from(set).sort();
  }, []);

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
    return applySort(applyFilters(results)).slice(0, 4);
  }, [searchQuery, filters, sortBy]);

  // Main display: max 4 creatives
  const displayCreatives = useMemo(() => {
    let list = activeFilter === 'All'
      ? allCreatives
      : allCreatives.filter(c => c.category === activeFilter);
    list = applyFilters(list);
    list = applySort(list);
    return list.slice(0, 4);
  }, [activeFilter, filters, sortBy]);

  return (
    <div className="p-6 md:p-10 lg:p-14 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-[24px] md:text-[32px] font-bold tracking-[-0.04em] text-foreground">
          Explore Creatives
        </h1>
        <p className="text-[13px] md:text-[15px] text-muted-foreground mt-1.5">
          Discover top talent for your next project
        </p>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 hide-scrollbar">
        {categories.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-[12px] font-semibold px-4 py-2 rounded-full border-[1.5px] cursor-pointer whitespace-nowrap transition-all duration-150 shrink-0 ${
              activeFilter === f
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-card border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Filter controls */}
      <div className="flex items-center gap-2.5 mb-8 md:mb-10">
        <div className="relative" ref={filterPopupRef}>
          <button
            onClick={() => setShowFilterPopup(s => !s)}
            className={`flex items-center gap-1.5 text-[12px] font-bold px-4 py-2 rounded-full border-[1.5px] cursor-pointer transition-all duration-150 whitespace-nowrap ${
              activeFilterCount > 0
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-card border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-primary-foreground text-primary text-[10px] font-bold flex items-center justify-center ml-0.5">
                {activeFilterCount}
              </span>
            )}
          </button>

          {showFilterPopup && (
            <div className="absolute top-full left-0 mt-2 z-[50] w-[280px] bg-card border border-border rounded-[18px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-5 animate-fade-up">
              <div className="flex items-center justify-between mb-5">
                <div className="text-[14px] font-bold">Filters</div>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer">
                    Clear all
                  </button>
                )}
              </div>

              <div className="mb-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2.5">Profession</div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.filter(c => c !== 'All').map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters(prev => ({ ...prev, category: prev.category === cat ? '' : cat }))}
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-150 ${
                        filters.category === cat
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-muted border-border text-muted-foreground hover:border-foreground/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2.5">Niche</div>
                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
                  {allProfessions.map(niche => (
                    <button
                      key={niche}
                      onClick={() => setFilters(prev => ({ ...prev, profession: prev.profession === niche ? '' : niche }))}
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-150 ${
                        filters.profession === niche
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-muted border-border text-muted-foreground hover:border-foreground/30'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2.5">Experience</div>
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
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-150 ${
                        filters.minExperience === opt.value
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'bg-muted border-border text-muted-foreground hover:border-foreground/30'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowFilterPopup(false)}
                className="w-full text-[12px] font-bold py-2.5 rounded-full bg-primary text-primary-foreground cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>

        {/* Active filter tags */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {filters.category && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border whitespace-nowrap">
                {filters.category}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, category: '' }))} />
              </span>
            )}
            {filters.profession && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border whitespace-nowrap">
                {filters.profession}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, profession: '' }))} />
              </span>
            )}
            {filters.minExperience > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border whitespace-nowrap">
                {filters.minExperience}+ yrs
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, minExperience: 0 }))} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Cards grid — max 4 */}
      {searchResults ? (
        <>
          <div className="text-[12px] text-muted-foreground mb-6">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "<span className="text-foreground font-semibold">{searchQuery}</span>"
          </div>
          {searchResults.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-[14px] font-bold text-foreground mb-1">No creatives found</div>
              <div className="text-[12px] text-muted-foreground">Try adjusting your search or filters</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
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
      ) : (
        <>
          {displayCreatives.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-[14px] font-bold text-foreground mb-1">No creatives match your filters</div>
              <div className="text-[12px] text-muted-foreground">Try adjusting your filters</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {displayCreatives.map(c => (
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
      )}
    </div>
  );
};
