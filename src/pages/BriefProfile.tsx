import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';
import { useProjects } from '../context/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { cn } from '../lib/utils';

const BriefProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getBrief, acceptBrief } = useProjects();
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showCounterPanel, setShowCounterPanel] = useState(false);
  const [counterBudget, setCounterBudget] = useState('');
  const [counterDate, setCounterDate] = useState<Date | undefined>();
  const [counterDeliverables, setCounterDeliverables] = useState('');
  const [counterNotes, setCounterNotes] = useState('');

  const brief = getBrief(id || '');

  if (!brief) {
    return (
      <>
        <NavBar />
        <div className="max-w-[800px] mx-auto px-4 md:px-8 py-20 pt-[80px] text-center">
          <div className="text-[48px] mb-4">📋</div>
          <div className="text-lg font-extrabold mb-2">Brief Not Found</div>
          <div className="text-[13px] text-muted-foreground mb-6">This brief may have already been accepted or doesn't exist.</div>
          <button onClick={() => navigate('/dashboard')} className="text-[12px] font-bold px-5 py-2 rounded-full bg-primary text-primary-foreground border-none cursor-pointer">← Back to Dashboard</button>
        </div>
        <Toast />
      </>
    );
  }

  const handleAccept = () => {
    const projectId = acceptBrief(brief.id);
    showToast('✓ Brief accepted! Redirecting to project…');
    setTimeout(() => navigate(`/project/${projectId}`), 600);
  };

  const handleDecline = () => {
    showToast('Brief declined');
    setShowDeclineModal(false);
    setTimeout(() => navigate('/dashboard'), 600);
  };

  const handleOpenCounter = () => {
    setCounterBudget(brief.budget);
    setCounterDeliverables(brief.deliverables);
    setCounterNotes('');
    // Try to parse the brief date
    try {
      const parsed = new Date(brief.date);
      if (!isNaN(parsed.getTime())) setCounterDate(parsed);
    } catch { /* keep undefined */ }
    setShowCounterPanel(true);
  };

  const handleSubmitCounter = () => {
    showToast('✓ Counter offer sent to client');
    setShowCounterPanel(false);
    setTimeout(() => navigate('/dashboard'), 800);
  };

  return (
    <>
      <NavBar />
      {/* Hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 pt-[72px]">
          <div className="flex items-center gap-2 text-[12px] text-foreground mb-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
            ← Dashboard / Pending Briefs
          </div>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[14px] bg-accent flex items-center justify-center text-[24px] md:text-[28px] shrink-0">{brief.icon}</div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                <div className="text-[18px] md:text-[22px] font-extrabold tracking-[-0.04em] text-foreground">{brief.name}</div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground border border-border">Pending Brief</span>
              </div>
              <div className="text-[12px] md:text-[13px] text-foreground">From: {brief.clientName} · {brief.clientCompany}</div>
              <div className="text-[11px] text-muted-foreground mt-1">Received {brief.time}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Brief Content */}
      <div className="max-w-[800px] mx-auto px-4 md:px-8 py-6 pb-20 md:pb-6">
        <div className="flex flex-col gap-5">

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {brief.tags.map((t, j) => (
              <span key={j} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-muted border border-border text-foreground">{t}</span>
            ))}
          </div>

          {/* Client Information */}
          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">👤 Client Information</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Client Name</div>
                <div className="text-[13px] font-semibold text-foreground">{brief.clientName}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Company</div>
                <div className="text-[13px] font-semibold text-foreground">{brief.clientCompany}</div>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">📋 Project Overview</div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Project Type</div>
                <div className="text-[13px] text-foreground">{brief.projectType}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Description</div>
                <div className="text-[13px] text-foreground leading-relaxed">
                  {brief.name} project for {brief.clientCompany}. This involves creating high-quality deliverables that align with the client's brand vision and marketing objectives.
                </div>
              </div>
            </div>
          </div>

          {/* Creative Requirements */}
          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">🎨 Creative Requirements</div>
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Mood & Aesthetic</div>
                <div className="text-[13px] text-foreground">{brief.moodAesthetic || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Deliverables</div>
                <div className="text-[13px] text-foreground">{brief.deliverables}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Usage Rights</div>
                <div className="text-[13px] text-foreground">{brief.usageRights || 'Not specified'}</div>
              </div>
            </div>
          </div>

          {/* Timeline & Budget */}
          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">📅 Timeline & Budget</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Requested Date</div>
                <div className="text-[13px] font-semibold text-foreground">{brief.date}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-0.5">Proposed Budget</div>
                <div className="text-[13px] font-extrabold text-primary">{brief.budget}</div>
              </div>
            </div>
          </div>

          {/* Counter Offer Panel */}
          {showCounterPanel && (
            <div className="bg-card border-2 border-primary/30 rounded-[14px] p-5 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[18px]">↕</span>
                  <div>
                    <div className="text-[14px] font-bold text-foreground">Counter Offer</div>
                    <div className="text-[11px] text-muted-foreground">Propose different terms to the client</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCounterPanel(false)}
                  className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none"
                >✕ Cancel</button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Budget & Timeline row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1.5 block">Your Proposed Budget</label>
                    <div className="relative">
                      <Input
                        value={counterBudget}
                        onChange={(e) => setCounterBudget(e.target.value)}
                        placeholder="e.g., $3,500"
                        className="text-[13px] font-semibold"
                      />
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">Client offered: <span className="font-semibold text-foreground">{brief.budget}</span></div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1.5 block">Your Proposed Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left text-[13px] font-semibold",
                            !counterDate && "text-muted-foreground font-normal"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {counterDate ? format(counterDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={counterDate}
                          onSelect={setCounterDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="text-[10px] text-muted-foreground mt-1">Client requested: <span className="font-semibold text-foreground">{brief.date}</span></div>
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1.5 block">Adjusted Deliverables</label>
                  <Textarea
                    value={counterDeliverables}
                    onChange={(e) => setCounterDeliverables(e.target.value)}
                    placeholder="Describe what you'll deliver..."
                    className="min-h-[70px] text-[13px]"
                  />
                  <div className="text-[10px] text-muted-foreground mt-1">Original: <span className="font-semibold text-foreground">{brief.deliverables}</span></div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1.5 block">Notes to Client</label>
                  <Textarea
                    value={counterNotes}
                    onChange={(e) => setCounterNotes(e.target.value)}
                    placeholder="Explain your reasoning, availability, or any additional context..."
                    className="min-h-[80px] text-[13px]"
                  />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="text-[11px] text-muted-foreground">The client will be notified and can accept, decline, or continue negotiating.</div>
                  <Button onClick={handleSubmitCounter} className="rounded-full text-[12px] font-bold px-5">
                    Send Counter Offer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          {!showCounterPanel && (
            <div className="bg-card border border-border rounded-[14px] p-5 mt-4">
              <div className="text-[13px] font-bold text-foreground mb-1">Ready to respond?</div>
              <div className="text-[11px] text-muted-foreground mb-4">Accept this brief to start building your proposal, counter with different terms, or decline if it's not a good fit.</div>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleAccept} className="text-[12px] font-bold px-5 py-2.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90">✓ Accept Brief</button>
                <button onClick={handleOpenCounter} className="text-[12px] font-bold px-5 py-2.5 rounded-full border-2 border-primary text-primary bg-transparent cursor-pointer transition-all duration-150 hover:bg-primary/10">↕ Counter Offer</button>
                <button onClick={() => setShowDeclineModal(true)} className="text-[12px] font-bold px-5 py-2.5 rounded-full border border-border bg-transparent text-muted-foreground cursor-pointer transition-all duration-150 hover:bg-muted hover:text-foreground">✕ Decline Brief</button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Decline Modal */}
      <Dialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Decline Brief</DialogTitle>
            <DialogDescription>
              Let the client know why you're declining this brief. This feedback helps them improve future briefs.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="e.g., Schedule conflict, outside my expertise, budget doesn't align..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclineModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDecline}>Decline Brief</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toast />
    </>
  );
};

export default BriefProfile;
