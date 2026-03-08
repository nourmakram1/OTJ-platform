import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';

const CreativeProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'packages'>('portfolio');

  return (
    <>
      <NavBar />
      <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 pt-[72px] pb-20 md:pb-8">
        {/* Back */}
        <div className="text-[12px] text-otj-text mb-6 cursor-pointer hover:text-foreground" onClick={() => navigate(-1)}>← Back to Explore</div>

        {/* Profile header */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-8">
          <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-[20px] bg-gradient-to-br from-[#2a2a2a] to-[#555] flex items-center justify-center text-[40px] md:text-[52px] shrink-0">👩‍🎨</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="text-[24px] font-extrabold tracking-[-0.04em]">Nour Makram</div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">✓ Verified</span>
            </div>
            <div className="text-[14px] text-otj-text mb-2">Fashion & E-commerce Photographer · Cairo</div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-[13px] font-bold">⭐ 4.9</span>
              <span className="w-1 h-1 rounded-full bg-otj-muted" />
              <span className="text-[13px] text-otj-text">127 jobs completed</span>
              <span className="w-1 h-1 rounded-full bg-otj-muted" />
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">Available now</span>
            </div>
            <div className="text-[13px] text-otj-text leading-relaxed max-w-[560px] mb-4">
              Cairo-based fashion and e-commerce photographer with 7+ years of experience. Specializing in product photography, lifestyle campaigns, and brand content for leading Egyptian and MENA brands.
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => showToast('Opening Quick Brief…')} className="text-[13px] font-bold px-6 py-2.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:bg-primary/90">Book Now →</button>
              <button onClick={() => navigate('/messages')} className="text-[13px] font-bold px-5 py-2.5 rounded-full border-[1.5px] border-border bg-card text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">💬 Message</button>
              <button onClick={() => showToast('♥ Saved to Collections')} className="w-10 h-10 rounded-full border-[1.5px] border-border bg-card cursor-pointer flex items-center justify-center text-sm transition-all duration-150 hover:border-foreground">♡</button>
            </div>
          </div>
        </div>

        {/* Skills & info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-[14px] p-3.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {['Photography', 'Product', 'Fashion', 'E-Commerce', 'Lifestyle', 'Branding'].map(s => (
                <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-otj-off border border-border text-otj-text">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-[14px] p-3.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Rates</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[12px]"><span className="text-otj-text">Half Day</span><span className="font-bold">2,000 EGP</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-otj-text">Full Day</span><span className="font-bold">3,500 EGP</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-otj-text">Multi-Day</span><span className="font-bold">6,500 EGP</span></div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-[14px] p-3.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Details</div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[12px]"><span className="text-otj-text">Location</span><span className="font-bold">Cairo</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-otj-text">Response</span><span className="font-bold">Under 1hr</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-otj-text">Experience</span><span className="font-bold">7+ years</span></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-5 overflow-x-auto hide-scrollbar pb-1">
          {(['portfolio', 'reviews', 'packages'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`text-[12.5px] font-semibold px-4 py-[7px] rounded-full border-[1.5px] cursor-pointer transition-all duration-150 capitalize ${
              activeTab === t ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-otj-text hover:border-otj-muted'
            }`}>{t === 'portfolio' ? `📸 Portfolio` : t === 'reviews' ? `⭐ Reviews (127)` : `📦 Packages`}</button>
          ))}
        </div>

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-3 gap-2.5 animate-fade-up">
            {['🌆', '👗', '🎭', '🌸', '🔥', '⚡'].map((e, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#555] flex items-center justify-center text-[48px] cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">{e}</div>
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

        {activeTab === 'packages' && (
          <div className="grid grid-cols-3 gap-3 animate-fade-up">
            {[
              { name: 'Starter · Half Day', price: '2,000 EGP', items: ['4 hours', '20 edited photos', '2 revisions'], popular: false },
              { name: 'Full Day Campaign', price: '3,500 EGP', items: ['8 hours', '40 edited photos', '3 revisions'], popular: true },
              { name: 'Premium Multi-Day', price: '6,500 EGP', items: ['2–3 days', '80+ photos', 'Unlimited revisions'], popular: false },
            ].map((pkg, i) => (
              <div key={i} className={`bg-card border-[1.5px] rounded-[14px] p-4 relative ${pkg.popular ? 'border-primary' : 'border-border'}`}>
                {pkg.popular && <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">Popular</div>}
                <div className="text-[13px] font-extrabold tracking-[-0.02em] mb-1">{pkg.name}</div>
                <div className="text-[20px] font-extrabold tracking-[-0.03em] mb-3">{pkg.price}</div>
                <div className="flex flex-col gap-1.5 mb-4">
                  {pkg.items.map((item, j) => (
                    <div key={j} className="text-[12px] text-otj-text flex items-center gap-1.5"><span className="text-otj-green text-[10px]">✓</span> {item}</div>
                  ))}
                </div>
                <button onClick={() => showToast('Opening Quick Brief…')} className="w-full py-2.5 rounded-full border-none bg-primary text-primary-foreground text-[12px] font-bold cursor-pointer hover:bg-primary/90">Book This Package</button>
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
