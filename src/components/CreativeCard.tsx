import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Clock, Briefcase, User } from 'lucide-react';
import type { Creative } from '../data/creatives';

interface CreativeCardProps {
  creative: Creative;
  onOpenBrief: (id: string) => void;
  saved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
}

export const CreativeCard: React.FC<CreativeCardProps> = ({ creative: c, onOpenBrief, saved, onToggleSave }) => {
  const navigate = useNavigate();

  const experienceLabel = c.experience >= 10 ? '10+ yrs' : c.experience >= 5 ? `${c.experience} yrs` : `${c.experience} yrs`;

  return (
    <div className="bg-card border border-border rounded-[22px] overflow-hidden cursor-pointer transition-all duration-300 relative hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] hover:-translate-y-1 w-full h-full flex flex-col group">
      {/* Image area */}
      <div className="relative h-[200px] md:h-[260px] bg-muted overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-br ${c.bg} flex items-center justify-center`}>
          <User className="w-16 h-16 text-muted-foreground/30" strokeWidth={1} />
        </div>

        {/* Save button */}
        <button
          onClick={(e) => onToggleSave(e, c.id)}
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-[2] ${
            saved
              ? 'bg-primary text-primary-foreground'
              : 'bg-foreground/70 backdrop-blur-md text-card hover:bg-foreground/90'
          }`}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>
      </div>

      {/* Info area */}
      <div className="p-4 md:p-5 flex flex-col flex-1 gap-3">
        {/* Name & profession */}
        <div>
          <h3 className="text-[15px] md:text-[17px] font-bold tracking-[-0.03em] text-foreground truncate">{c.name}</h3>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5 truncate">{c.role}</p>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1 text-[11px] md:text-[12px]">
            <MapPin size={12} strokeWidth={2.5} />
            Cairo
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-1 text-[11px] md:text-[12px]">
            <Briefcase size={12} strokeWidth={2.5} />
            {experienceLabel}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-auto flex gap-2 pt-1">
          <button
            onClick={(e) => { e.stopPropagation(); onOpenBrief(c.id); }}
            className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground text-[12px] font-bold tracking-[-0.01em] transition-all duration-200 hover:opacity-90"
          >
            Book Now
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/creative/${c.id}`); }}
            className="flex-1 py-2.5 rounded-full border-[1.5px] border-border text-foreground text-[12px] font-bold tracking-[-0.01em] transition-all duration-200 hover:border-foreground"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};
