import React, { useState, useMemo, useRef } from 'react';
import { showToast } from './Toast';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categoryNiches } from '../data/niches';
import { allCreatives, categories, getFeaturedCreatives, getCreativesByNiche } from '../data/creatives';
import { CreativeCard } from './CreativeCard';
import type { Creative } from '../data/creatives';

interface ExploreScreenProps {
  onOpenBrief: (creativeId: string) => void;
  searchQuery?: string;
}

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
        {/* Scroll buttons — desktop only */}
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

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onOpenBrief, searchQuery = '' }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [saved, setSaved] = useState<Set<string>>(new Set());

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

  // Search results — flat grid when searching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return allCreatives.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.niche.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Build niche rows for selected category
  const nicheRows = useMemo(() => {
    if (activeFilter === 'All') return null;
    return getCreativesByNiche(activeFilter);
  }, [activeFilter]);

  const featured = useMemo(() => getFeaturedCreatives(), []);

  return (
    <div className="p-[16px_16px_80px] md:p-[20px_24px_80px]">
      {/* Category filters */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 hide-scrollbar">
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
              <div className="text-[12px] text-otj-text">Try adjusting your search query</div>
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
            const catCreatives = allCreatives.filter(c => c.category === cat);
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
                {/* Skill tags under each niche */}
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
              <div className="text-sm font-bold text-foreground mb-1">No creatives in this category yet</div>
              <div className="text-[12px] text-otj-text">Check back soon!</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
