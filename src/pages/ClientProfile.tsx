import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Star, Shield, ExternalLink, MapPin, Building2, Calendar,
  Pencil, Mail, Phone, ArrowLeft, Share2, CheckCircle2,
  Briefcase, Clock, ChevronRight,
} from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { Toast, showToast } from '../components/Toast';
import { useProjects } from '../context/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';


/* ── Star rating helpers ───────────────────────────────────── */
const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`w-[11px] h-[11px] ${i <= rating ? 'fill-otj-yellow text-otj-yellow' : 'text-border'} ${interactive ? 'cursor-pointer w-4 h-4' : ''}`}
        onClick={() => interactive && onRate?.(i)}
      />
    ))}
  </div>
);

/* ── Component ─────────────────────────────────────────────── */
const ClientProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getClient, addClientReview, updateClient, completedProjects, userRole } = useProjects();

  const [showReviewModal, setShowReviewModal]     = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const client = getClient(id || '');

  if (!client) {
    return (
      <>
        <NavBar />
        <div className="max-w-[800px] mx-auto px-4 md:px-8 py-20 pt-[80px] text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-lg font-extrabold mb-2">Client Not Found</div>
          <div className="text-[13px] text-muted-foreground mb-6">This client profile doesn't exist.</div>
          <button onClick={() => navigate(-1)} className="text-[12px] font-bold px-5 py-2 rounded-full bg-primary text-primary-foreground border-none cursor-pointer">← Go Back</button>
        </div>
        <Toast />
      </>
    );
  }

  const avgRating = client.reviews.length > 0
    ? (client.reviews.reduce((sum, r) => sum + r.rating, 0) / client.reviews.length).toFixed(1)
    : 'N/A';

  const isOwnClientProfile = userRole === 'client';
  const canReview = completedProjects.some(p => p.client === client.name);

  const initials = client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSubmitReview = () => {
    if (reviewRating === 0) return;
    addClientReview(client.id, {
      creativeAvatar: '👩‍🎨',
      creativeName: 'Nour Makram',
      rating: reviewRating,
      comment: reviewComment,
      projectName: 'Recent Project',
    });
    showToast('✓ Review submitted');
    setShowReviewModal(false);
    setReviewRating(0);
    setReviewComment('');
  };

  const handleOpenEditContact = () => {
    setEditEmail(client.email);
    setEditPhone(client.phone);
    setShowEditContactModal(true);
  };

  const handleSaveContact = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editEmail.trim() || !emailRegex.test(editEmail.trim())) { showToast('Please enter a valid email address'); return; }
    if (!editPhone.trim() || editPhone.trim().length < 8) { showToast('Please enter a valid phone number'); return; }
    updateClient(client.id, { email: editEmail.trim(), phone: editPhone.trim() });
    showToast('✓ Contact info updated');
    setShowEditContactModal(false);
  };

  return (
    <>
      <NavBar />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[760px] mx-auto px-4 md:px-8 py-6 pt-[72px]">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer active:opacity-70">
              <ArrowLeft size={13} strokeWidth={2} /> Back
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Profile link copied!'); }} className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer hover:border-foreground transition-colors active:scale-95">
                <Share2 size={13} className="text-foreground" />
              </button>
              {isOwnClientProfile && (
                <button onClick={handleOpenEditContact} className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer hover:border-foreground transition-colors active:scale-95">
                  <Pencil size={13} className="text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Avatar + identity row */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#555] flex items-center justify-center">
                <span className="text-[20px] font-extrabold text-white/90 tracking-[-0.04em]">{initials}</span>
              </div>
              {client.verified && (
                <span className="absolute -bottom-0.5 -right-0.5 w-[17px] h-[17px] rounded-full bg-[hsl(var(--otj-blue))] border-2 border-card flex items-center justify-center">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-2 mb-[3px]">
                <h1 className="text-[20px] font-extrabold tracking-[-0.04em] leading-tight">{client.name}</h1>
                {client.verified && (
                  <span className="text-[9.5px] font-bold px-2 py-[2px] rounded-full bg-[hsl(var(--otj-blue-bg))] text-[hsl(var(--otj-blue))] border border-[hsl(var(--otj-blue-border))] shrink-0">Verified</span>
                )}
                <span className="text-[9.5px] font-bold px-2 py-[2px] rounded-full bg-muted text-muted-foreground border border-border capitalize shrink-0">{client.type}</span>
              </div>
              {client.company && (
                <div className="text-[12.5px] text-otj-text flex items-center gap-1 mb-1">
                  <Building2 size={11} className="text-otj-muted shrink-0" /> {client.company}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11.5px] text-otj-muted">
                <span className="flex items-center gap-[3px]"><MapPin size={10} strokeWidth={2} /> {client.location}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-otj-muted/40 shrink-0" />
                {client.reviews.length > 0 && (
                  <>
                    <span className="flex items-center gap-[3px]"><Star size={10} className="fill-otj-yellow text-otj-yellow" /> {avgRating} <span className="text-otj-muted/60">({client.reviews.length})</span></span>
                    <span className="w-[3px] h-[3px] rounded-full bg-otj-muted/40 shrink-0" />
                  </>
                )}
                <span className="flex items-center gap-[3px]"><Briefcase size={10} strokeWidth={2} /> {client.projectsCompleted} projects</span>
                <span className="w-[3px] h-[3px] rounded-full bg-otj-muted/40 shrink-0" />
                <span className="flex items-center gap-[3px]"><Clock size={10} strokeWidth={2} /> {client.avgResponseTime} reply</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-5 pt-4 flex flex-col gap-3">
            {/* Bio */}
            <p className="text-[13px] text-otj-text leading-[1.65] tracking-[-0.01em]">{client.bio}</p>
            {/* Tags */}
            {client.industry && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] font-semibold px-2.5 py-[3.5px] rounded-full bg-otj-off border border-border text-otj-text">{client.industry}</span>
                {client.verified && (
                  <span className="text-[11px] font-semibold px-2.5 py-[3.5px] rounded-full bg-[hsl(var(--otj-green-bg))] border border-[hsl(var(--otj-green-border))] text-[hsl(var(--otj-green))] flex items-center gap-1">
                    <CheckCircle2 size={10} /> Verified Payments
                  </span>
                )}
              </div>
            )}
            {/* CTAs */}
            <div className="flex gap-2 pt-1">
              {!isOwnClientProfile ? (
                <>
                  <button onClick={() => showToast('Opening messages…')} className="flex-1 text-[12.5px] font-bold py-[9px] rounded-full bg-foreground text-background border-none cursor-pointer transition-all hover:opacity-85 active:scale-[0.98]">Message</button>
                  {client.website && (
                    <button onClick={() => window.open(`https://${client.website}`, '_blank')} className="flex-1 text-[12.5px] font-bold py-[9px] rounded-full border-[1.5px] border-border text-otj-text cursor-pointer transition-all hover:border-foreground hover:text-foreground active:scale-[0.98] flex items-center justify-center gap-1.5">
                      <ExternalLink size={13} /> Website
                    </button>
                  )}
                </>
              ) : (
                <button onClick={handleOpenEditContact} className="flex-1 text-[12.5px] font-bold py-[9px] rounded-full border-[1.5px] border-border text-otj-text cursor-pointer transition-all hover:border-foreground hover:text-foreground active:scale-[0.98] flex items-center justify-center gap-1.5">
                  <Pencil size={13} /> Edit Contact Info
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 md:px-8 pt-4 pb-24 md:pb-10 flex flex-col gap-4">

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Projects', value: String(client.projectsCompleted), color: 'text-[hsl(var(--otj-blue))]' },
            { label: 'Avg Response', value: client.avgResponseTime, color: 'text-[hsl(var(--otj-green))]' },
            { label: 'Rating', value: avgRating !== 'N/A' ? avgRating : '—', color: 'text-[hsl(var(--otj-yellow))]' },
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-[14px] p-3 text-center hover:shadow-sm transition-shadow">
              <div className={`text-[20px] font-extrabold tracking-[-0.04em] ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.08em] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Details & Contact */}
        <div className="bg-card border border-border rounded-[14px] overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-otj-muted">Details & Contact</div>
            {isOwnClientProfile && (
              <button onClick={handleOpenEditContact} className="flex items-center gap-1 text-[11px] font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity active:scale-95">
                <Pencil className="w-3 h-3" /> Edit
              </button>
            )}
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1">Industry</div>
              <div className="text-[13px] font-semibold text-foreground">{client.industry}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1">Location</div>
              <div className="text-[13px] font-semibold text-foreground flex items-center gap-1">
                <MapPin size={11} className="text-muted-foreground shrink-0" /> {client.location}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1">Member Since</div>
              <div className="text-[13px] font-semibold text-foreground flex items-center gap-1">
                <Calendar size={11} className="text-muted-foreground shrink-0" /> {client.joinedDate}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1">Email</div>
              <div className="text-[13px] font-semibold text-foreground flex items-center gap-1">
                <Mail size={11} className="text-muted-foreground shrink-0" /> {client.email}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1">Phone</div>
              <div className="text-[13px] font-semibold text-foreground flex items-center gap-1">
                <Phone size={11} className="text-muted-foreground shrink-0" /> {client.phone}
              </div>
            </div>
            {client.website && (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1">Website</div>
                <div className="text-[13px] font-semibold text-[hsl(var(--otj-blue))] flex items-center gap-1 cursor-pointer hover:underline active:opacity-70">
                  <ExternalLink size={11} className="shrink-0" /> {client.website}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Score */}
        <div className="bg-card border border-border rounded-[14px] overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-otj-muted">Trust Score</div>
          </div>
          <div className="p-4 flex items-center gap-5">
            <div className="relative w-[72px] h-[72px] shrink-0">
              <svg className="w-[72px] h-[72px] -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--otj-green))" strokeWidth="3" strokeDasharray={`${client.paymentReliability}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[15px] font-extrabold text-foreground">{client.paymentReliability}%</span>
              </div>
            </div>
            <div>
              <div className="text-[14px] font-extrabold text-foreground mb-0.5">
                {client.paymentReliability >= 90 ? 'Excellent Payer' : client.paymentReliability >= 70 ? 'Good Payer' : 'Fair'}
              </div>
              <div className="text-[11px] text-muted-foreground leading-relaxed max-w-[240px]">
                Based on payment history, response time, and project completion rate.
              </div>
              <div className="flex gap-2 mt-2">
                {client.paymentReliability >= 90 && (
                  <span className="text-[10px] font-bold px-2 py-[2px] rounded-full bg-[hsl(var(--otj-green-bg))] text-[hsl(var(--otj-green))] border border-[hsl(var(--otj-green-border))]">Fast Payer</span>
                )}
                {client.verified && (
                  <span className="text-[10px] font-bold px-2 py-[2px] rounded-full bg-[hsl(var(--otj-blue-bg))] text-[hsl(var(--otj-blue))] border border-[hsl(var(--otj-blue-border))]">ID Verified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="flex flex-col gap-3">

          {/* Rating summary */}
          <div className="bg-card border border-border rounded-[14px] overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-otj-muted">Reviews</div>
              {canReview && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center gap-0.5 text-[11px] font-semibold text-primary hover:opacity-80 transition-opacity cursor-pointer"
                >
                  Write Review <ChevronRight size={12} />
                </button>
              )}
            </div>
            {client.reviews.length > 0 ? (
              <div className="p-4 flex items-center gap-5">
                <div className="text-center shrink-0">
                  <div className="text-[32px] font-extrabold tracking-[-0.04em] leading-none">{avgRating}</div>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.round(Number(avgRating)) ? 'fill-otj-yellow text-otj-yellow' : 'text-border'}`} />
                    ))}
                  </div>
                  <div className="text-[10px] text-otj-muted mt-1">{client.reviews.length} reviews</div>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = client.reviews.filter(r => r.rating === star).length;
                    const pct = Math.round((count / client.reviews.length) * 100);
                    return (
                      <div key={star} className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-otj-muted w-2 shrink-0">{star}</span>
                        <div className="flex-1 h-[5px] bg-otj-off rounded-full overflow-hidden">
                          <div className="h-full bg-otj-yellow rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-otj-muted w-6 text-right shrink-0">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-[13px] font-bold text-foreground mb-1">No reviews yet</div>
                <div className="text-[11px] text-muted-foreground">Be the first to leave a review for this client.</div>
                {canReview && (
                  <button onClick={() => setShowReviewModal(true)} className="mt-3 text-[11.5px] font-bold px-4 py-1.5 rounded-full bg-primary text-primary-foreground border-none cursor-pointer transition-all hover:opacity-90 active:scale-[0.98]">
                    Write Review
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Individual review cards */}
          {client.reviews.map(review => {
            const rev_initials = review.creativeName.split(' ').map((n: string) => n[0]).join('').slice(0, 2);
            return (
              <div key={review.id} className="bg-card border border-border rounded-[14px] p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-otj-off border border-border flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-extrabold text-otj-muted">{rev_initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[13px] font-bold leading-snug">{review.creativeName}</div>
                        <div className="text-[11px] text-otj-muted">for {review.projectName} · {review.createdAt}</div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-otj-text leading-[1.65]">{review.comment}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-[425px] rounded-[14px]">
          <DialogHeader>
            <DialogTitle>Review {client.name}</DialogTitle>
            <DialogDescription>Share your experience working with this client.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-[11px] font-bold text-foreground mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star
                    key={i}
                    className={`w-6 h-6 cursor-pointer transition-colors ${i <= reviewRating ? 'fill-otj-yellow text-otj-yellow' : 'text-border hover:text-otj-yellow'}`}
                    onClick={() => setReviewRating(i)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-foreground mb-1.5 block">Your Review</label>
              <Textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="How was your experience? Communication, payments, professionalism..."
                className="min-h-[100px] text-[13px] rounded-[10px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewModal(false)} className="rounded-full active:scale-95">Cancel</Button>
            <Button onClick={handleSubmitReview} disabled={reviewRating === 0} className="rounded-full active:scale-95">Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog open={showEditContactModal} onOpenChange={setShowEditContactModal}>
        <DialogContent className="sm:max-w-[425px] rounded-[14px]">
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
            <DialogDescription>Update your email and phone number so creatives can reach you.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-[11px] font-bold text-foreground mb-1.5 block">Email</label>
              <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="your@email.com" type="email" maxLength={255} className="text-[13px] rounded-[10px]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-foreground mb-1.5 block">Phone</label>
              <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+20 100 123 4567" type="tel" maxLength={20} className="text-[13px] rounded-[10px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditContactModal(false)} className="rounded-full active:scale-95">Cancel</Button>
            <Button onClick={handleSaveContact} className="rounded-full active:scale-95">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toast />
    </>
  );
};

export default ClientProfile;
