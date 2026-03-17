import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Pencil, Star, ExternalLink, MapPin, ArrowLeft, Heart, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';
import { useCreativeProfile } from '../context/CreativeProfileContext';
import { ProfileCompletenessCard } from '../components/ProfileCompleteness';

/* ── Hero carousel data ─────────────────────────────────────── */
const heroSlides = [
{ grad: 'from-[#1a1a2e] to-[#16213e]', emoji: '📸' },
{ grad: 'from-[#2d1b4e] to-[#11998e]', emoji: '' },
{ grad: 'from-[#2c3e50] to-[#3498db]', emoji: '' },
{ grad: 'from-[#1a1a2e] to-[#e44d26]', emoji: '' },
{ grad: 'from-[#0f2027] to-[#2c5364]', emoji: '' }];



const reviews = [
{ name: 'Randa Hatem', company: 'Edita Group', rating: 5, text: 'Nour delivered beyond expectations. The product shots were stunning and delivered on time. Highly recommend!', tags: ['Professional', 'On Time', 'Great Quality'], date: 'Feb 2026' },
{ name: 'Ahmed Karim', company: 'CIB', rating: 5, text: 'Amazing work on our campaign shoot. Very organised, creative, and easy to work with.', tags: ['Creative', 'Organised', 'Responsive'], date: 'Jan 2026' },
{ name: 'Tarek Saad', company: 'Vodafone', rating: 4, text: 'Great photographer with a keen eye for detail. Would book again for future campaigns.', tags: ['Detail-Oriented', 'Professional'], date: 'Jan 2026' }];


/* ── Component ─────────────────────────────────────────────── */
const CreativeProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isOwnProfile = id === 'nour';
  const [saved, setSaved] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const { profile } = useCreativeProfile();

  const displayName = isOwnProfile ? profile.name : 'Nour Makram';
  const displayTagline = isOwnProfile ? profile.tagline : 'Fashion · E-Commerce · Studio Photography';
  const displayBio = isOwnProfile ? profile.bio : 'Cairo-based fashion and e-commerce photographer with 7+ years of experience. Specialising in product photography, lifestyle campaigns, and brand content for leading Egyptian and MENA brands.';
  const displaySkills = isOwnProfile ? profile.skills : ['Photography', 'Product', 'Fashion', 'E-Commerce', 'Lifestyle', 'Branding'];
  const displayCity = isOwnProfile ? profile.city : 'Cairo, EG';

  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const heroPrev = (e: React.MouseEvent) => {e.stopPropagation();setHeroSlide((i) => i === 0 ? heroSlides.length - 1 : i - 1);};
  const heroNext = (e: React.MouseEvent) => {e.stopPropagation();setHeroSlide((i) => i === heroSlides.length - 1 ? 0 : i + 1);};

  const reviews = [
  { name: 'Sarah Chen', company: 'CEO, Stellar Creative Studio', rating: 5, text: 'Exceptional work! Alex delivered beyond our expectations. The branding project was completed on time with incredible attention to detail. Communication was seamless throughout.', tags: ['Professional', 'On Time', 'Great Quality'], date: 'Jan 2026' },
  { name: 'Randa Hatem', company: 'Marketing Director, Edita Group', rating: 5, text: 'Nour delivered beyond expectations. The product shots were stunning and delivered on time. Highly recommend!', tags: ['Creative', 'Organised', 'Responsive'], date: 'Feb 2026' },
  { name: 'Ahmed Karim', company: 'Brand Manager, CIB', rating: 4, text: 'Amazing work on our campaign shoot. Very organized, creative, and easy to work with.', tags: ['Detail-Oriented', 'Professional'], date: 'Jan 2026' }];


  const totalReviews = 47;
  const avgRating = 4.9;
  const ratingBreakdown = [
  { stars: 5, count: 43 },
  { stars: 4, count: 4 }];


  return (
    <>
      <NavBar />

      {/* ── Hero carousel — full bleed ───────────────────────── */}
      <div className="relative h-[290px] md:h-[370px] overflow-hidden group/hero">

        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${heroSlide * 100}%)` }}>
          
          {heroSlides.map((s, i) =>
          <div key={i} className={`min-w-full h-full bg-gradient-to-br ${s.grad} flex items-center justify-center`}>
              {s.emoji && <span className="text-7xl">{s.emoji}</span>}
            </div>
          )}
        </div>

        {/* Tap zones */}
        <button onClick={heroPrev} aria-label="Prev" className="absolute left-0 top-0 h-full w-2/5 z-[2]" />
        <button onClick={heroNext} aria-label="Next" className="absolute right-0 top-0 h-full w-2/5 z-[2]" />

        {/* Hover chevrons */}
        <button onClick={heroPrev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity z-[3] shadow-sm mt-6">
          <ChevronLeft className="w-4 h-4 text-gray-800" />
        </button>
        <button onClick={heroNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity z-[3] shadow-sm mt-6">
          <ChevronRight className="w-4 h-4 text-gray-800" />
        </button>

        {/* Top overlay: breadcrumb + action icons */}
        <div className="absolute top-0 left-0 right-0 pt-[62px] px-4 flex items-center justify-between z-[3]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90 bg-black/35 backdrop-blur-md px-3 py-[5px] rounded-full border border-white/10 cursor-pointer hover:bg-black/50 transition-colors">
            
            <ArrowLeft size={11} strokeWidth={2.5} />
            Explore
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {navigator.clipboard.writeText(window.location.href);showToast('Profile link copied!');}}
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white transition-colors active:scale-95">
              
              <Share2 size={13} className="text-gray-800" />
            </button>
            {isOwnProfile ?
            <button
              onClick={() => navigate('/settings')}
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white transition-colors active:scale-95">
              
                <Pencil size={13} className="text-gray-800" />
              </button> :

            <button
              onClick={() => {setSaved((v) => !v);showToast(saved ? 'Removed from Collections' : '♥ Saved to Collections');}}
              className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm cursor-pointer hover:bg-white transition-colors active:scale-95">
              
                <Heart size={13} className={saved ? 'fill-red-500 text-red-500' : 'text-gray-800'} />
              </button>
            }
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 items-center z-[3]">
          {heroSlides.map((_, i) =>
          <button
            key={i}
            onClick={(e) => {e.stopPropagation();setHeroSlide(i);}}
            className={`h-[3px] rounded-full transition-all duration-300 ${i === heroSlide ? 'bg-white w-3.5' : 'bg-white/45 w-[5px]'}`} />

          )}
        </div>
      </div>

      {/* ── Profile card — overlaps hero ─────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 md:px-8 -mt-9 relative z-10">
        <div className="bg-card border border-border rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="p-5">

            {/* Avatar + identity */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#555] flex items-center justify-center">
                  <span className="text-[22px] font-extrabold text-white/90 tracking-[-0.04em]">{initials}</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] rounded-full bg-otj-green border-2 border-card" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex flex-wrap items-baseline gap-2 mb-[3px]">
                  <h1 className="text-[20px] font-extrabold tracking-[-0.04em] leading-tight">{displayName}</h1>
                  
                </div>
                <div className="text-[12.5px] text-otj-text mb-1.5">{displayTagline}</div>
                {/* Inline meta — city · rating · response */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11.5px] text-otj-muted">
                  <span className="flex items-center gap-[3px]">
                    <MapPin size={10} className="text-otj-muted shrink-0" strokeWidth={2} />
                    {displayCity}
                  </span>
                  <span className="w-[3px] h-[3px] rounded-full bg-otj-muted/40 shrink-0" />
                  <span className="flex items-center gap-[3px]">
                    <Star size={10} className="fill-otj-yellow text-otj-yellow shrink-0" />
                    4.9 <span className="text-otj-muted/60">(127)</span>
                  </span>
                  <span className="w-[3px] h-[3px] rounded-full bg-otj-muted/40 shrink-0" />
                  <span className="flex items-center gap-[3px]">
                    <Briefcase size={10} className="text-otj-muted shrink-0" strokeWidth={2} />
                    127 jobs
                  </span>
                  <span className="w-[3px] h-[3px] rounded-full bg-otj-muted/40 shrink-0" />
                  <span>&lt; 1hr reply</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border my-4" />

            {/* About */}
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-otj-muted mb-2">About</div>
            <p className="text-[13px] text-otj-text leading-[1.65] tracking-[-0.01em]">{displayBio}</p>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {displaySkills.map((s: string) =>
              <span key={s} className="text-[11px] font-semibold px-2.5 py-[3.5px] rounded-full bg-otj-off border border-border text-otj-text">{s}</span>
              )}
            </div>

            <div className="border-t border-border my-4" />

            {/* CTAs */}
            <div className="flex gap-2">
              <button
                onClick={() => showToast('Opening Quick Brief…')}
                className="flex-1 text-[12.5px] font-bold py-[10px] rounded-full bg-foreground text-background border-none cursor-pointer transition-all hover:opacity-85 active:scale-[0.98]">
                
                Book Now
              </button>
              <button
                onClick={() => window.open('https://nourmakram.com', '_blank')}
                className="flex-1 text-[12.5px] font-bold py-[10px] rounded-full border-[1.5px] border-border text-otj-text cursor-pointer transition-all hover:border-foreground hover:text-foreground active:scale-[0.98] flex items-center justify-center gap-1.5">
                
                <ExternalLink size={13} />
                Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 md:px-8 pt-4 pb-24 md:pb-10 flex flex-col gap-4">

        {/* Profile Completeness */}
        {isOwnProfile && <ProfileCompletenessCard variant="compact" />}

        {/* Reviews */}
        <div className="flex flex-col gap-3">

            {/* Rating summary */}
            <div className="bg-card border border-border rounded-[14px] overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-otj-muted">Reviews</div>
                <button className="flex items-center gap-0.5 text-[11px] font-semibold text-otj-muted hover:text-foreground transition-colors cursor-pointer">
                  All 127 <ChevronRight size={12} />
                </button>
              </div>
              <div className="p-4 flex items-center gap-5">
                <div className="text-center shrink-0">
                  <div className="text-[32px] font-extrabold tracking-[-0.04em] leading-none">4.9</div>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-otj-yellow text-otj-yellow" />)}
                  </div>
                  <div className="text-[10px] text-otj-muted mt-1">127 reviews</div>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                  const pct = star === 5 ? 82 : star === 4 ? 14 : star === 3 ? 3 : 1;
                  return (
                    <div key={star} className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-otj-muted w-2 shrink-0">{star}</span>
                        <div className="flex-1 h-[5px] bg-otj-off rounded-full overflow-hidden">
                          <div className="h-full bg-otj-yellow rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-otj-muted w-6 text-right shrink-0">{pct}%</span>
                      </div>);

                })}
                </div>
              </div>
            </div>

            {/* Individual reviews */}
            {reviews.map((r, i) => {
            const rev_initials = r.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
            return (
              <div key={i} className="bg-card border border-border rounded-[14px] p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-otj-off border border-border flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-extrabold text-otj-muted">{rev_initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[13px] font-bold leading-snug">{r.name}</div>
                          <div className="text-[11px] text-otj-muted">{r.company} · {r.date}</div>
                        </div>
                        <div className="flex gap-0.5 shrink-0 pt-0.5">
                          {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-[11px] h-[11px] fill-otj-yellow text-otj-yellow" />)}
                          {[...Array(5 - r.rating)].map((_, j) => <Star key={j} className="w-[11px] h-[11px] text-border" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] text-otj-text leading-[1.65] mb-2.5">{r.text}</p>
                  {r.tags && r.tags.length > 0 &&
                <div className="flex gap-1.5 flex-wrap">
                      {r.tags.map((tag) =>
                  <span key={tag} className="text-[10px] font-semibold px-2 py-[3px] rounded-full bg-otj-off border border-border text-otj-text">{tag}</span>
                  )}
                    </div>
                }
                </div>);

          })}
        </div>
      </div>

      <Toast />
    </>);

};

export default CreativeProfile;