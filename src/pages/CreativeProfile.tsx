import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Pencil, ArrowLeft, Star, CheckCircle, MapPin, Clock, Briefcase, Link, Heart, Camera, User, Image } from 'lucide-react';
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
  const displayTagline = isOwnProfile ? profile.tagline : 'Fashion & E-commerce Photographer · Cairo';
  const displayBio = isOwnProfile
    ? profile.bio
    : 'Cairo-based fashion and e-commerce photographer with 7+ years of experience. Specializing in product photography, lifestyle campaigns, and brand content for leading Egyptian and MENA brands.';
  const displaySkills = isOwnProfile ? profile.skills : ['Photography', 'Product', 'Fashion', 'E-Commerce', 'Lifestyle', 'Branding'];
  const displayCity = isOwnProfile ? profile.city : 'Cairo';
  const displayExperience = isOwnProfile ? profile.experience : '7+ years';

  return (
    <>
      <NavBar />
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 pt-[72px] pb-20 md:pb-8">
        {/* Back */}
        <div className="text-[12px] text-otj-text mb-6 cursor-pointer hover:text-foreground flex items-center gap-1" onClick={() => navigate(-1)}><ArrowLeft size={12} /> Back to Explore</div>

        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-8">
          <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-[20px] bg-gradient-to-br from-[#2a2a2a] to-[#555] flex items-center justify-center shrink-0"><Camera size={40} className="text-muted-foreground" /></div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="text-[24px] font-extrabold tracking-[-0.04em]">{displayName}</div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border flex items-center gap-1"><CheckCircle size={10} /> Verified</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Profile link copied!'); }} className="w-8 h-8 rounded-full border-[1.5px] border-border bg-card cursor-pointer flex items-center justify-center transition-all duration-150 hover:border-foreground" title="Share Profile">
                  <Share2 size={14} className="text-otj-text" />
                </button>
                {isOwnProfile && (
                  <button onClick={() => navigate('/settings')} className="w-8 h-8 rounded-full border-[1.5px] border-border bg-card cursor-pointer flex items-center justify-center transition-all duration-150 hover:border-foreground" title="Edit Profile">
                    <Pencil size={13} className="text-otj-text" />
                  </button>
                )}
              </div>
            </div>
            <div className="text-[14px] text-otj-text mb-2">{displayTagline}</div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-[13px] font-bold flex items-center gap-1"><Star size={13} className="text-yellow-500 fill-yellow-500" /> 4.9</span>
              <span className="w-1 h-1 rounded-full bg-otj-muted" />
              <span className="text-[13px] text-otj-text">127 jobs completed</span>
              <span className="w-1 h-1 rounded-full bg-otj-muted" />
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">Available now</span>
            </div>
            <div className="text-[13px] text-otj-text leading-relaxed max-w-[560px] mb-4">
              {displayBio}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => showToast('Opening Quick Brief…')} className="text-[13px] font-bold px-6 py-2.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:bg-primary/90">Book Now</button>
              <button onClick={() => window.open('https://nourmakram.com', '_blank')} className="text-[13px] font-bold px-5 py-2.5 rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground flex items-center gap-1.5"><Link size={13} /> Portfolio</button>
              {!isOwnProfile && (
                <button onClick={() => showToast('♥ Saved to Collections')} className="w-10 h-10 rounded-full border-[1.5px] border-border bg-card cursor-pointer flex items-center justify-center text-sm transition-all duration-150 hover:border-foreground"><Heart size={16} className="text-otj-text" /></button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completeness - own profile only */}
        {isOwnProfile && (
          <div className="mb-6">
            <ProfileCompletenessCard variant="compact" />
          </div>
        )}

        {/* Skills & info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="bg-card border border-border rounded-[14px] p-3.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {displaySkills.map(s => (
                <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-otj-off border border-border text-otj-text">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-[14px] p-3.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Details</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[12px]"><span className="text-otj-text flex items-center gap-1"><MapPin size={11} /> Location</span><span className="font-bold">{displayCity}</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-otj-text flex items-center gap-1"><Clock size={11} /> Response</span><span className="font-bold">Under 1hr</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-otj-text flex items-center gap-1"><Briefcase size={11} /> Experience</span><span className="font-bold">{displayExperience}</span></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 overflow-x-auto hide-scrollbar pb-1">
          {(['portfolio', 'reviews'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`text-[12.5px] font-semibold px-4 py-[7px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 capitalize whitespace-nowrap shrink-0 ${
              activeTab === t ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-otj-text hover:border-otj-muted'
            }`}>{t === 'portfolio' ? <span className="flex items-center gap-1"><Camera size={12} /> Portfolio</span> : <span className="flex items-center gap-1"><Star size={12} /> Reviews (127)</span>}</button>
          ))}
        </div>

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 animate-fade-up">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#555] flex items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"><Image size={32} className="text-muted-foreground" /></div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="flex flex-col gap-3 animate-fade-up">
            {[
              { name: 'Randa Hatem', company: 'Edita Group', rating: 5, text: 'Nour delivered beyond expectations. The product shots were stunning and delivered on time. Highly recommend!', tags: ['Professional', 'On Time', 'Great Quality'], date: 'Feb 2026' },
              { name: 'Ahmed Karim', company: 'CIB', rating: 5, text: 'Amazing work on our campaign shoot. Very organized, creative, and easy to work with.', tags: ['Creative', 'Organized', 'Responsive'], date: 'Jan 2026' },
              { name: 'Tarek Saad', company: 'Vodafone', rating: 4, text: 'Great photographer with a keen eye for detail. Would book again for future campaigns.', tags: ['Detail-Oriented', 'Professional'], date: 'Jan 2026' },
            ].map((r, i) => (
              <div key={i} className="bg-card border border-border rounded-[14px] p-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-full bg-otj-off flex items-center justify-center text-sm">👤</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold">{r.name} <span className="text-otj-text font-medium">· {r.company}</span></div>
                    <div className="text-[11px] text-otj-muted">{r.date}</div>
                  </div>
                  <div className="text-[13px] font-bold">{'⭐'.repeat(r.rating)}</div>
                </div>
                <div className="text-[13px] text-foreground leading-relaxed mb-2">{r.text}</div>
                <div className="flex gap-1.5">
                  {r.tags.map(t => <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-otj-off border border-border text-otj-text">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
      <Toast />
    </>
  );
};

export default CreativeProfile;
