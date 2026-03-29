import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, ClipboardList, ArrowLeft, ChevronRight, Check, ArrowLeftRight, X, MapPin } from 'lucide-react';
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

const surveyQuestions = [
  'What is the shoot purpose or campaign goal?',
  'What mood or aesthetic are you going for?',
  'What is the subject or product being shot?',
  'How many final deliverables do you need?',
  'Where will the content be used? (Social, print, ads…)',
];

const CounterOfferForm = ({
  brief,
  counterBudget,
  setCounterBudget,
  counterDate,
  setCounterDate,
  counterDeliverables,
  setCounterDeliverables,
  counterNotes,
  setCounterNotes
}: {brief: {budget: string;date: string;deliverables: string;};counterBudget: string;setCounterBudget: (v: string) => void;counterDate: Date | undefined;setCounterDate: (v: Date | undefined) => void;counterDeliverables: string;setCounterDeliverables: (v: string) => void;counterNotes: string;setCounterNotes: (v: string) => void;}) =>
<div className="flex flex-col gap-4">
    <div className="bg-otj-off rounded-[10px] p-3 border border-border">
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">Original Terms</div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-[9px] font-bold uppercase text-otj-muted mb-0.5">Budget</div>
          <div className="text-[12px] font-extrabold text-foreground">{brief.budget}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase text-otj-muted mb-0.5">Date</div>
          <div className="text-[12px] font-semibold text-foreground">{brief.date}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase text-otj-muted mb-0.5">Deliverables</div>
          <div className="text-[12px] text-foreground truncate">{brief.deliverables}</div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-[11px] font-bold text-foreground mb-1.5 block">Your Budget</label>
        <Input
          value={counterBudget}
          onChange={(e) => setCounterBudget(e.target.value)}
          placeholder="e.g., $3,500"
          className="text-[13px] font-semibold rounded-[10px]" />
      </div>
      <div>
        <label className="text-[11px] font-bold text-foreground mb-1.5 block">Your Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left text-[13px] font-semibold rounded-[10px]",
                !counterDate && "text-muted-foreground font-normal"
              )}>
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
              className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <div>
      <label className="text-[11px] font-bold text-foreground mb-1.5 block">Adjusted Deliverables</label>
      <Textarea
        value={counterDeliverables}
        onChange={(e) => setCounterDeliverables(e.target.value)}
        placeholder="Describe what you'll deliver..."
        className="min-h-[60px] text-[13px] rounded-[10px]" />
    </div>

    <div>
      <label className="text-[11px] font-bold text-foreground mb-1.5 block">Notes to Client</label>
      <Textarea
        value={counterNotes}
        onChange={(e) => setCounterNotes(e.target.value)}
        placeholder="Explain your reasoning, availability, or any additional context..."
        className="min-h-[70px] text-[13px] rounded-[10px]" />
    </div>
  </div>;


const BriefProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{id: string;}>();
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
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-lg font-extrabold mb-2">Brief Not Found</div>
          <div className="text-[13px] text-muted-foreground mb-6">This brief may have already been accepted or doesn't exist.</div>
          <button onClick={() => navigate('/dashboard')} className="text-[12px] font-bold px-5 py-2 rounded-full bg-primary text-primary-foreground border-none cursor-pointer">← Back to Dashboard</button>
        </div>
        <Toast />
      </>);
  }

  const handleAccept = () => {
    const projectId = acceptBrief(brief.id);
    showToast('Brief accepted! Redirecting to project…');
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
    } catch {/* keep undefined */}
    setShowCounterPanel(true);
  };

  const handleSubmitCounter = () => {
    showToast('Counter offer sent to client');
    setShowCounterPanel(false);
    submitCounterOffer(brief.id, counterBudget, brief.clientName, brief.name);
  };

  const counterFormProps = {
    brief: { budget: brief.budget, date: brief.date, deliverables: brief.deliverables },
    counterBudget, setCounterBudget,
    counterDate, setCounterDate,
    counterDeliverables, setCounterDeliverables,
    counterNotes, setCounterNotes
  };

  return (
    <>
      <NavBar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[760px] mx-auto px-4 md:px-8 pt-[72px] pb-5">

          {/* Breadcrumb */}
          <div
            className="flex items-center gap-1 text-[11px] text-otj-muted mb-5 cursor-pointer hover:text-foreground transition-colors w-fit"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={12} />
            <span>Dashboard</span>
            <ChevronRight size={11} className="opacity-40" />
            <span>Pending Briefs</span>
          </div>

          {/* Title + badge inline */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 mb-2">
            <h1 className="text-[24px] md:text-[28px] font-extrabold tracking-[-0.04em] text-foreground leading-tight">{brief.name}</h1>
            <span className="text-[11px] font-bold px-2.5 py-[3px] rounded-full bg-otj-yellow-bg text-otj-yellow border border-otj-yellow-border shrink-0 self-center">Pending Brief</span>
            <span className="text-[11px] text-otj-muted self-center">{brief.time}</span>
          </div>

          {/* Client + location */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-otj-text mb-4">
            <span><span className="font-semibold text-foreground">{brief.clientName}</span> · {brief.clientCompany}</span>
            {brief.location && (
              <span className="flex items-center gap-1 text-otj-muted">
                <MapPin size={11} strokeWidth={2} />
                {brief.location}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 flex-wrap">
            {brief.tags.map((t, j) =>
              <span key={j} className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full bg-otj-off border border-border text-otj-text">{t}</span>
            )}
          </div>
        </div>

        {/* ── Key stats strip ── */}
        <div className="max-w-[760px] mx-auto px-4 md:px-8 pb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'Budget', value: brief.budget },
              { label: 'Deadline', value: brief.date },
              { label: 'Project Type', value: brief.projectType },
              { label: 'Usage Rights', value: brief.usageRights || '—' },
            ].map((stat) => (
              <div key={stat.label} className="bg-otj-off border border-border rounded-[12px] px-3.5 py-2.5">
                <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-0.5">{stat.label}</div>
                <div className="text-[13px] font-extrabold tracking-[-0.02em] text-foreground leading-snug">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 md:px-8 py-5 pb-28 md:pb-10 flex flex-col gap-4">

        {/* Project description */}
        {brief.description && (
          <div className="bg-card border border-border rounded-[14px] overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-otj-muted">Project Description</div>
            </div>
            <div className="px-5 py-4">
              <p className="text-[14px] text-foreground leading-[1.7] tracking-[-0.01em]">{brief.description}</p>
            </div>
          </div>
        )}

        {/* Survey Q&A */}
        {brief.surveyAnswers && brief.surveyAnswers.filter(Boolean).length > 0 && (
            <div className="bg-card border border-border rounded-[14px] overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
                <div>
                  <div className="text-[13px] font-extrabold tracking-[-0.03em]">Brief Survey</div>
                  <div className="text-[11px] text-otj-muted mt-[2px]">{brief.surveyAnswers.filter(Boolean).length} of {surveyQuestions.length} questions answered by client</div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-[3px] rounded-full border shrink-0 ${
                  brief.surveyAnswers.filter(Boolean).length === surveyQuestions.length
                    ? 'bg-otj-green-bg text-otj-green border-otj-green-border'
                    : 'bg-otj-yellow-bg text-otj-yellow border-otj-yellow-border'
                }`}>
                  {brief.surveyAnswers.filter(Boolean).length === surveyQuestions.length ? 'Complete' : `${brief.surveyAnswers.filter(Boolean).length}/${surveyQuestions.length}`}
                </span>
              </div>
              <div className="divide-y divide-border">
                {surveyQuestions.map((q, i) => (
                    <div key={i} className="px-5 py-5">
                      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2">{q}</div>
                      {brief.surveyAnswers?.[i] ? (
                        <p className="text-[14px] text-foreground leading-[1.75] tracking-[-0.015em]">{brief.surveyAnswers[i]}</p>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="h-[3px] w-5 rounded-full bg-border" />
                          <span className="text-[12px] text-otj-muted italic">Not answered</span>
                        </div>
                      )}
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* Client info */}
        <div className="bg-card border border-border rounded-[14px] overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-otj-muted">Client</div>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Name</div>
              <div className="text-[13px] font-semibold text-foreground">{brief.clientName}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Company</div>
              <div className="text-[13px] font-semibold text-foreground">{brief.clientCompany}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Email</div>
              <div className="text-[12px] text-otj-muted italic">Unlocked on accept</div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Phone</div>
              <div className="text-[12px] text-otj-muted italic">Unlocked on accept</div>
            </div>
          </div>
        </div>

        {/* CTA footer */}
        <div className="bg-card border border-border rounded-[14px] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[14px] font-extrabold tracking-[-0.02em] text-foreground">Ready to respond?</div>
              <div className="text-[11.5px] text-otj-muted mt-0.5">Accept, negotiate terms, or decline this brief.</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:shrink-0">
              <button
                onClick={handleAccept}
                className="flex items-center justify-center gap-1.5 text-[12px] font-bold px-5 py-2.5 rounded-full bg-primary text-primary-foreground border-none cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.98] whitespace-nowrap"
              >
                <Check size={13} strokeWidth={2.5} />
                Accept Brief
              </button>
              <button
                onClick={handleOpenCounter}
                className="flex items-center justify-center gap-1.5 text-[12px] font-bold px-5 py-2.5 rounded-full border-[1.5px] border-primary text-primary bg-transparent cursor-pointer transition-all duration-150 hover:bg-primary/10 active:scale-[0.98] whitespace-nowrap"
              >
                <ArrowLeftRight size={13} strokeWidth={2.5} />
                Counter Offer
              </button>
              <button
                onClick={() => setShowDeclineModal(true)}
                className="flex items-center justify-center gap-1.5 text-[12px] font-bold px-5 py-2.5 rounded-full border-[1.5px] border-border bg-transparent text-otj-muted cursor-pointer transition-all duration-150 hover:text-foreground hover:border-foreground active:scale-[0.98] whitespace-nowrap"
              >
                <X size={13} strokeWidth={2.5} />
                Decline
              </button>
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
              className="min-h-[100px] rounded-[10px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclineModal(false)} className="rounded-full">Cancel</Button>
            <Button variant="destructive" onClick={handleDecline} className="rounded-full">Decline Brief</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Counter Offer — Drawer on mobile, Dialog on desktop */}
      {isMobile ?
        <Drawer open={showCounterPanel} onOpenChange={setShowCounterPanel}>
          <DrawerContent className="px-4 pb-6 max-h-[90vh]">
            <DrawerHeader className="text-left px-0">
              <DrawerTitle className="flex items-center gap-2 text-[16px]">
                <ArrowLeftRight size={15} /> Counter Offer
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
        :
        <Dialog open={showCounterPanel} onOpenChange={setShowCounterPanel}>
          <DialogContent className="sm:max-w-[540px] rounded-[14px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[16px]">
                <ArrowLeftRight size={15} /> Counter Offer
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
      }

      <Toast />
    </>);
};

export default BriefProfile;
