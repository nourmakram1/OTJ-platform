import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Toast, showToast } from '../components/Toast';
import { useProjects } from '../context/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Star, Shield, ExternalLink, MapPin, Building2, Calendar, Pencil, Mail, Phone } from 'lucide-react';

const tabs = ['About', 'Reviews'];

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`w-4 h-4 ${i <= rating ? 'fill-[hsl(var(--otj-yellow))] text-[hsl(var(--otj-yellow))]' : 'text-border'} ${interactive ? 'cursor-pointer' : ''}`}
        onClick={() => interactive && onRate?.(i)}
      />
    ))}
  </div>
);

const ClientProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getClient, addClientReview, updateClient, completedProjects, userRole } = useProjects();
  const [activeTab, setActiveTab] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
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
          <div className="text-[48px] mb-4">👤</div>
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

  const isOwnClientProfile = userRole === 'client';

  const handleOpenEditContact = () => {
    setEditEmail(client.email);
    setEditPhone(client.phone);
    setShowEditContactModal(true);
  };

  const handleSaveContact = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editEmail.trim() || !emailRegex.test(editEmail.trim())) {
      showToast('Please enter a valid email address');
      return;
    }
    if (!editPhone.trim() || editPhone.trim().length < 8) {
      showToast('Please enter a valid phone number');
      return;
    }
    updateClient(client.id, { email: editEmail.trim(), phone: editPhone.trim() });
    showToast('✓ Contact info updated');
    setShowEditContactModal(false);
  };

  return (
    <>
      <NavBar />
      {/* Hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 pt-[72px]">
          <div className="flex items-center gap-2 text-[12px] text-foreground mb-4 cursor-pointer" onClick={() => navigate(-1)}>
            ← Back
          </div>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent flex items-center justify-center text-[28px] md:text-[32px] shrink-0 border-2 border-border">
              {client.avatar}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                <div className="text-[18px] md:text-[22px] font-extrabold tracking-[-0.04em] text-foreground">{client.name}</div>
                {client.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[hsl(var(--otj-blue-bg))] text-[hsl(var(--otj-blue))] border border-[hsl(var(--otj-blue-border))]">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border capitalize">
                  {client.type}
                </span>
              </div>
              {client.company && (
                <div className="text-[12px] md:text-[13px] text-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> {client.company}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {client.location}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {client.joinedDate}</span>
                {client.reviews.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[hsl(var(--otj-yellow))] text-[hsl(var(--otj-yellow))]" /> {avgRating} · {client.reviews.length} reviews
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border sticky top-[52px] z-[50]">
        <div className="max-w-[800px] mx-auto px-4 md:px-8">
          <div className="flex gap-0 overflow-x-auto hide-scrollbar">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`text-[12px] font-semibold px-4 py-3 border-b-2 cursor-pointer transition-all duration-150 whitespace-nowrap ${
                  activeTab === i
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 pb-20 md:pb-6">
        <div className="flex flex-col gap-5">

          {/* About Tab */}
          {activeTab === 0 && (
            <>
              <div className="bg-card border border-border rounded-[14px] p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">📝 About</div>
                <div className="text-[13px] text-foreground leading-relaxed">{client.bio}</div>
              </div>

              <div className="bg-card border border-border rounded-[14px] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">🏢 Details & Contact</div>
                  {isOwnClientProfile && (
                    <button onClick={handleOpenEditContact} className="flex items-center gap-1 text-[11px] font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Industry</div>
                    <div className="text-[13px] font-semibold text-foreground">{client.industry}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Location</div>
                    <div className="text-[13px] font-semibold text-foreground">{client.location}</div>
                  </div>
                  {client.website && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Website</div>
                      <div className="text-[13px] font-semibold text-[hsl(var(--otj-blue))] flex items-center gap-1 cursor-pointer hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" /> {client.website}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Email</div>
                    <div className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {client.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Phone</div>
                    <div className="text-[13px] font-semibold text-foreground flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" /> {client.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Projects', value: String(client.projectsCompleted), icon: '📋' },
                  { label: 'Avg Response', value: client.avgResponseTime, icon: '⏱️' },
                  { label: 'Rating', value: avgRating, icon: '⭐' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card border border-border rounded-[14px] p-3 text-center">
                    <div className="text-[18px] mb-1">{stat.icon}</div>
                    <div className="text-[15px] font-extrabold text-foreground">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-[0.08em]">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Trust Score */}
              <div className="bg-card border border-border rounded-[14px] p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-4">🛡️ Trust Score</div>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--otj-green))" strokeWidth="3" strokeDasharray={`${client.paymentReliability}, 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[16px] font-extrabold text-foreground">{client.paymentReliability}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[14px] font-extrabold text-foreground mb-0.5">
                      {client.paymentReliability >= 90 ? 'Excellent' : client.paymentReliability >= 70 ? 'Good' : 'Fair'}
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      Based on payment history, response time, and project completion rate.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Reviews Tab */}
          {activeTab === 1 && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[15px] font-extrabold text-foreground">{avgRating} <span className="text-muted-foreground font-normal text-[13px]">/ 5.0</span></div>
                  <div className="text-[11px] text-muted-foreground">{client.reviews.length} reviews from creatives</div>
                </div>
                {completedProjects.some(p => p.client === client.name) && (
                  <button onClick={() => setShowReviewModal(true)} className="text-[11.5px] font-bold px-4 py-1.5 rounded-full bg-primary text-primary-foreground border-none cursor-pointer transition-all duration-150 hover:opacity-90">✍ Write Review</button>
                )}
              </div>

              {client.reviews.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {client.reviews.map(review => (
                    <div key={review.id} className="bg-card border border-border rounded-[14px] p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-[16px] shrink-0">{review.creativeAvatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-[13px] font-bold text-foreground">{review.creativeName}</div>
                            <StarRating rating={review.rating} />
                          </div>
                          <div className="text-[11px] text-muted-foreground mb-2">for {review.projectName} · {review.createdAt}</div>
                          <div className="text-[13px] text-foreground leading-relaxed">{review.comment}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-border rounded-[14px] p-8 text-center">
                  <div className="text-[32px] mb-2">⭐</div>
                  <div className="text-[13px] font-bold text-foreground mb-1">No reviews yet</div>
                  <div className="text-[11px] text-muted-foreground">Be the first to leave a review for this client.</div>
                </div>
              )}
            </>
          )}

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
              <StarRating rating={reviewRating} onRate={setReviewRating} interactive />
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
            <Button variant="outline" onClick={() => setShowReviewModal(false)} className="rounded-full">Cancel</Button>
            <Button onClick={handleSubmitReview} disabled={reviewRating === 0} className="rounded-full">Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toast />
    </>
  );
};

export default ClientProfile;
