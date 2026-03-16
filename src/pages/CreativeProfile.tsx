import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Pencil, ArrowLeft, Star, CheckCircle, MapPin, Clock, Briefcase, Link, Heart, Camera, User, Image, FolderOpen } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';
import { useCreativeProfile } from '../context/CreativeProfileContext';
import { ProfileCompletenessCard } from '../components/ProfileCompleteness';

const CreativeProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isOwnProfile = id === 'nour';
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews'>('portfolio');
  const { profile } = useCreativeProfile();

  const displayName = isOwnProfile ? profile.name : 'Nour Makram';
  const displayTagline = isOwnProfile ? profile.tagline : 'Wedding · Event · Studio Photographer';
  const displayBio = isOwnProfile
    ? profile.bio
    : 'Award-winning wedding photographer based in Cairo. I specialize in documentary-style wedding photography, capturing genuine emotions and beautiful details. With 7 years of experience across Egypt and the GCC, I\'ve covered over 200 weddings.';
  const displaySkills = isOwnProfile ? profile.skills : ['Fashion', 'E-Commerce', 'Product', 'Food & Beverage', 'Corporate & Event'];
  const displayCity = isOwnProfile ? profile.city : 'Cai, EG';
  const displayExperience = isOwnProfile ? profile.experience : '7+ years';

  const reviews = [
    { name: 'Sarah Chen', company: 'CEO, Stellar Creative Studio', rating: 5, text: 'Exceptional work! Alex delivered beyond our expectations. The branding project was completed on time with incredible attention to detail. Communication was seamless throughout.', date: 'Jan 2026' },
    { name: 'Randa Hatem', company: 'Marketing Director, Edita Group', rating: 5, text: 'Nour delivered beyond expectations. The product shots were stunning and delivered on time. Highly recommend!', date: 'Feb 2026' },
    { name: 'Ahmed Karim', company: 'Brand Manager, CIB', rating: 4, text: 'Amazing work on our campaign shoot. Very organized, creative, and easy to work with.', date: 'Jan 2026' },
  ];

  const totalReviews = 47;
  const avgRating = 4.9;
  const ratingBreakdown = [
    { stars: 5, count: 43 },
    { stars: 4, count: 4 },
  ];

  return (
    <>
      <NavBar />
      <div className="pt-[56px]">
        {/* Immersive Hero Cover */}
        <div className="relative w-full h-[340px] md:h-[420px] bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a] overflow-hidden">
          {/* Placeholder cover grid */}
          <div className="absolute inset-0 grid grid-cols-5 gap-0.5 opacity-60">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="bg-gradient-to-b from-[#2a2a2a] to-[#444] flex items-center justify-center">
                <Image size={28} className="text-muted-foreground/40" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        </div>

        {/* Profile Card - overlapping hero */}
        <div className="max-w-[720px] mx-auto px-4 md:px-8 -mt-20 relative z-10">
          <div className="bg-card border border-border rounded-[18px] p-5 md:p-7 shadow-sm">
            {/* Avatar + Name Row */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-[88px] h-[88px] md:w-[100px] md:h-[100px] rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#666] flex items-center justify-center shrink-0 border-[3px] border-card -mt-14 shadow-lg">
                <Camera size={36} className="text-muted-foreground" />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-[22px] md:text-[26px] font-extrabold tracking-[-0.03em]">{displayName}</h1>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Profile link copied!'); }} className="w-8 h-8 rounded-full border-[1.5px] border-border bg-card cursor-pointer flex items-center justify-center transition-all duration-150 hover:border-foreground" title="Share Profile">
                      <Share2 size={14} className="text-otj-text" />
                    </button>
                    {isOwnProfile && (
                      <button onClick={() => navigate('/settings')} className="w-8 h-8 rounded-full border-[1.5px] border-border bg-card cursor-pointer flex items-center justify-center transition-all duration-150 hover:border-foreground" title="Edit Profile">
                        <Pencil size={13} className="text-otj-text" />
                      </button>
                    )}
                    {!isOwnProfile && (
                      <button onClick={() => showToast('♥ Saved to Collections')} className="w-8 h-8 rounded-full border-[1.5px] border-border bg-card cursor-pointer flex items-center justify-center transition-all duration-150 hover:border-foreground"><Heart size={14} className="text-otj-text" /></button>
                    )}
                  </div>
                </div>
                <div className="text-[13px] text-otj-text mb-1.5">{displayTagline}</div>
                <div className="flex items-center gap-2 text-[13px]">
                  <Star size={13} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-otj-text">· {totalReviews} jobs completed</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="border-t border-border pt-4 mb-4">
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">About</div>
              <p className="text-[13px] text-otj-text leading-relaxed max-w-[560px]">{displayBio}</p>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {displaySkills.map(s => (
                <span key={s} className="text-[12px] font-medium px-4 py-1.5 rounded-full border border-border text-otj-text">{s}</span>
              ))}
            </div>

            {/* Stats Row */}
            <div className="border-t border-border pt-4">
              <div className="grid grid-cols-4 divide-x divide-border text-center">
                <div>
                  <div className="text-[18px] font-bold">24</div>
                  <div className="text-[11px] text-otj-muted">Projects</div>
                </div>
                <div>
                  <div className="text-[18px] font-bold">{avgRating}</div>
                  <div className="text-[11px] text-otj-muted">Rating</div>
                </div>
                <div>
                  <div className="text-[18px] font-bold">{displayCity}</div>
                  <div className="text-[11px] text-otj-muted">Location</div>
                </div>
                <div>
                  <div className="text-[18px] font-bold">&gt;2 H</div>
                  <div className="text-[11px] text-otj-muted">Response</div>
                </div>
              </div>
            </div>

            {/* Book / Portfolio buttons */}
            <div className="flex gap-2 mt-5">
              <button onClick={() => showToast('Opening Quick Brief…')} className="text-[13px] font-bold px-6 py-2.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:bg-primary/90">Book Now</button>
              <button onClick={() => window.open('https://nourmakram.com', '_blank')} className="text-[13px] font-bold px-5 py-2.5 rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground flex items-center gap-1.5"><Link size={13} /> Portfolio</button>
            </div>
          </div>

          {/* Profile Completeness - own profile only */}
          {isOwnProfile && (
            <div className="mt-4">
              <ProfileCompletenessCard variant="compact" />
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-8 mb-16">
            {/* Rating Summary */}
            <div className="bg-card border border-border rounded-[18px] p-5 md:p-7 mb-4">
              <div className="flex items-start gap-6">
                <div className="text-center">
                  <div className="text-[42px] font-extrabold leading-none tracking-tight">{avgRating}</div>
                  <div className="flex items-center gap-0.5 mt-1 justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] text-otj-text mb-2">Based on {totalReviews} reviews</div>
                  <div className="space-y-1.5">
                    {ratingBreakdown.map(r => (
                      <div key={r.stars} className="flex items-center gap-2">
                        <span className="text-[12px] font-medium w-6 text-right">{r.stars} <Star size={10} className="inline text-foreground fill-foreground" /></span>
                        <div className="flex-1 h-2 bg-otj-light rounded-full overflow-hidden">
                          <div className="h-full bg-foreground rounded-full" style={{ width: `${(r.count / totalReviews) * 100}%` }} />
                        </div>
                        <span className="text-[12px] text-otj-muted w-6">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Reviews</div>
            <div className="flex flex-col gap-3 animate-fade-up">
              {reviews.map((r, i) => (
                <div key={i} className="bg-card border border-border rounded-[14px] p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[14px] font-bold">{r.name}</div>
                      <div className="text-[12px] text-otj-text">{r.company}</div>
                    </div>
                    <div className="text-[12px] text-otj-muted">{r.date}</div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={14} className="text-blue-600 fill-blue-600" />)}
                  </div>
                  <div className="text-[13px] text-foreground leading-relaxed">{r.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </>
  );
};

export default CreativeProfile;
