import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';
import { useProjects } from '../context/ProjectContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '../components/ui/drawer';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { cn } from '../lib/utils';
import { useIsMobile } from '../hooks/use-mobile';

const CounterOfferForm = ({
  brief,
  counterBudget,
  setCounterBudget,
  counterDate,
  setCounterDate,
  counterDeliverables,
  setCounterDeliverables,
  counterNotes,
  setCounterNotes,
}: {
  brief: { budget: string; date: string; deliverables: string };
  counterBudget: string;
  setCounterBudget: (v: string) => void;
  counterDate: Date | undefined;
  setCounterDate: (v: Date | undefined) => void;
  counterDeliverables: string;
  setCounterDeliverables: (v: string) => void;
  counterNotes: string;
  setCounterNotes: (v: string) => void;
}) => (
  <div className="flex flex-col gap-4">
    {/* Comparison header */}
    <div className="bg-muted/50 rounded-[10px] p-3 border border-border">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">📊 Original Terms</div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-[9px] font-bold uppercase text-muted-foreground">Budget</div>
          <div className="text-[12px] font-extrabold text-foreground">{brief.budget}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase text-muted-foreground">Date</div>
          <div className="text-[12px] font-semibold text-foreground">{brief.date}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase text-muted-foreground">Deliverables</div>
          <div className="text-[12px] text-foreground truncate">{brief.deliverables}</div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-[11px] font-bold text-foreground mb-1.5 block">💰 Your Budget</label>
        <Input
          value={counterBudget}
          onChange={(e) => setCounterBudget(e.target.value)}
          placeholder="e.g., $3,500"
          className="text-[13px] font-semibold rounded-[10px]"
        />
      </div>
      <div>
        <label className="text-[11px] font-bold text-foreground mb-1.5 block">📅 Your Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left text-[13px] font-semibold rounded-[10px]",
                !counterDate && "text-muted-foreground font-normal"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {counterDate ? format(counterDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-[100]" align="start">
            <Calendar
              mode="single"
              selected={counterDate}
              onSelect={setCounterDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <div>
      <label className="text-[11px] font-bold text-foreground mb-1.5 block">📦 Adjusted Deliverables</label>
      <Textarea
        value={counterDeliverables}
        onChange={(e) => setCounterDeliverables(e.target.value)}
        placeholder="Describe what you'll deliver..."
        className="min-h-[60px] text-[13px] rounded-[10px]"
      />
    </div>

    <div>
      <label className="text-[11px] font-bold text-foreground mb-1.5 block">💬 Notes to Client</label>
      <Textarea
        value={counterNotes}
        onChange={(e) => setCounterNotes(e.target.value)}
        placeholder="Explain your reasoning, availability, or any additional context..."
        className="min-h-[70px] text-[13px] rounded-[10px]"
      />
    </div>
  </div>
);

const BriefProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getBrief, acceptBrief, submitCounterOffer } = useProjects();
  const isMobile = useIsMobile();
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
    try {
      const parsed = new Date(brief.date);
      if (!isNaN(parsed.getTime())) setCounterDate(parsed);
    } catch { /* keep undefined */ }
    setShowCounterPanel(true);
  };

  const handleSubmitCounter = () => {
    showToast('✓ Counter offer sent to client');
    setShowCounterPanel(false);
    submitCounterOffer(brief.id, counterBudget, brief.clientName, brief.name);
  };

  const counterFormProps = {
    brief: { budget: brief.budget, date: brief.date, deliverables: brief.deliverables },
    counterBudget, setCounterBudget,
    counterDate, setCounterDate,
    counterDeliverables, setCounterDeliverables,
    counterNotes, setCounterNotes,
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

          {/* Action Footer */}
          <div className="bg-card border border-border rounded-[14px] p-5 mt-4">
            <div className="text-[13px] font-bold text-foreground mb-1">Ready to respond?</div>
            <div className="text-[11px] text-muted-foreground mb-4">Accept this brief to start building your proposal, counter with different terms, or decline if it's not a good fit.</div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleAccept} className="text-[12px] font-bold px-5 py-2.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90">✓ Accept Brief</button>
              <button onClick={handleOpenCounter} className="text-[12px] font-bold px-5 py-2.5 rounded-full border-2 border-primary text-primary bg-transparent cursor-pointer transition-all duration-150 hover:bg-primary/10">↕ Counter Offer</button>
              <button onClick={() => setShowDeclineModal(true)} className="text-[12px] font-bold px-5 py-2.5 rounded-full border border-border bg-transparent text-muted-foreground cursor-pointer transition-all duration-150 hover:bg-muted hover:text-foreground">✕ Decline Brief</button>
            </div>
          </div>

        </div>
      </div>

      {/* Decline Modal */}
      <Dialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
        <DialogContent className="sm:max-w-[425px] rounded-[14px]">
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
              className="min-h-[100px] rounded-[10px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclineModal(false)} className="rounded-full">Cancel</Button>
            <Button variant="destructive" onClick={handleDecline} className="rounded-full">Decline Brief</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Counter Offer — Drawer on mobile, Dialog on desktop */}
      {isMobile ? (
        <Drawer open={showCounterPanel} onOpenChange={setShowCounterPanel}>
          <DrawerContent className="px-4 pb-6 max-h-[90vh]">
            <DrawerHeader className="text-left px-0">
              <DrawerTitle className="flex items-center gap-2 text-[16px]">
                <span>↕</span> Counter Offer
              </DrawerTitle>
              <DrawerDescription className="text-[12px]">
                Propose different terms to the client.
              </DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto flex-1 px-0">
              <CounterOfferForm {...counterFormProps} />
            </div>
            <DrawerFooter className="px-0 pt-4 flex-row gap-3">
              <Button variant="outline" onClick={() => setShowCounterPanel(false)} className="rounded-full flex-1">Cancel</Button>
              <Button onClick={handleSubmitCounter} className="rounded-full flex-1 text-[12px] font-bold">Send Counter Offer</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showCounterPanel} onOpenChange={setShowCounterPanel}>
          <DialogContent className="sm:max-w-[540px] rounded-[14px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[16px]">
                <span>↕</span> Counter Offer
              </DialogTitle>
              <DialogDescription className="text-[12px]">
                Propose different terms to the client. They'll be notified and can accept, decline, or continue negotiating.
              </DialogDescription>
            </DialogHeader>
            <CounterOfferForm {...counterFormProps} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCounterPanel(false)} className="rounded-full">Cancel</Button>
              <Button onClick={handleSubmitCounter} className="rounded-full text-[12px] font-bold px-5">Send Counter Offer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Counter Accepted Notification */}
      {counterAcceptedNotif && counterAcceptedBrief && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-20 px-4" onClick={() => setCounterAcceptedNotif(false)}>
          <div className="bg-card border border-border rounded-[14px] shadow-[0_8px_40px_rgba(0,0,0,0.15)] p-5 max-w-[420px] w-full animate-in slide-in-from-top-4 fade-in duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--otj-green-bg))] border border-[hsl(var(--otj-green-border))] flex items-center justify-center text-[18px] shrink-0">🎉</div>
              <div className="flex-1">
                <div className="text-[13px] font-extrabold text-foreground mb-0.5">Counter Offer Accepted!</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">{counterAcceptedBrief.clientName}</span> accepted your counter offer for <span className="font-semibold text-foreground">{counterAcceptedBrief.name}</span> at <span className="font-extrabold text-[hsl(var(--otj-green))]">{counterAcceptedBrief.budget}</span>.
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setCounterAcceptedNotif(false);
                      const projectId = acceptBrief(brief.id);
                      showToast('✓ Project created! Redirecting…');
                      setTimeout(() => navigate(`/project/${projectId}`), 500);
                    }}
                    className="text-[11px] font-bold px-4 py-1.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90"
                  >
                    View Project →
                  </button>
                  <button
                    onClick={() => setCounterAcceptedNotif(false)}
                    className="text-[11px] font-bold px-4 py-1.5 rounded-full border border-border bg-transparent text-muted-foreground cursor-pointer transition-all duration-150 hover:bg-muted"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast />
    </>
  );
};

export default BriefProfile;
