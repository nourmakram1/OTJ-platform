import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Camera, Film, Palette, Sparkles, Code, TrendingUp,
  Scissors, PenTool, Package, CalendarDays, Building2,
  Search, Star, MapPin, ChevronRight, Check, Download,
  FileText, CreditCard, Clock, Users, Share2, Link2,
  Instagram, Mail, HelpCircle, MessageCircle, Filter,
  ChevronDown
} from 'lucide-react';

/* ── Category Data ── */
const categories = [
  { icon: Camera, name: 'Photography' },
  { icon: Film, name: 'Videography' },
  { icon: Palette, name: 'Design & Branding' },
  { icon: Sparkles, name: 'AI Creator' },
  { icon: Code, name: 'Tech Development' },
  { icon: TrendingUp, name: 'Business & Marketing' },
  { icon: Scissors, name: 'MUA & Styling' },
  { icon: PenTool, name: 'Creative Writing' },
  { icon: Package, name: 'Creation Production' },
  { icon: CalendarDays, name: 'Event Producers' },
  { icon: Building2, name: 'Space Design' },
];

/* ══════════════════════════════════════════════════════════════════════
   MOCK UI COMPONENTS — realistic mini-cards used inside walkthrough
   ══════════════════════════════════════════════════════════════════════ */

const MockBriefCard = () => (
  <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[10px] font-bold text-muted-foreground">NM</div>
        <div className="text-[12px] font-bold text-foreground">Nour Makram</div>
        <div className="text-[10px] text-muted-foreground">Fashion Photographer · Cairo</div>
      </div>
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-otj-blue-border bg-otj-blue-bg text-otj-blue">
        STEP 1/2
      </span>
    </div>
    {[
      { label: 'PROJECT NAME', value: 'Re-brand Campaign' },
      { label: 'PROJECT TYPE', value: 'Branding' },
    ].map((field) => (
      <div key={field.label}>
        <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{field.label}</div>
        <div className="w-full h-8 rounded-lg border border-border bg-background flex items-center px-3">
          <span className="text-[10px] text-muted-foreground/60">{field.value}</span>
        </div>
      </div>
    ))}
    <div>
      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">BUDGET RANGE</div>
      <div className="flex gap-2">
        <div className="flex-1 h-8 rounded-lg border border-border bg-background flex items-center px-3">
          <span className="text-[10px] text-muted-foreground/60">8,000 EGP</span>
        </div>
        <div className="flex-1 h-8 rounded-lg border border-border bg-background flex items-center px-3">
          <span className="text-[10px] text-muted-foreground/60">12,000 EGP</span>
        </div>
      </div>
    </div>
    <div>
      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">DESCRIPTION</div>
      <div className="w-full h-14 rounded-lg border border-border bg-background flex items-start px-3 pt-2">
        <span className="text-[10px] text-muted-foreground/60 leading-relaxed">Full visual identity refresh including logo, color palette, and brand guidelines…</span>
      </div>
    </div>
  </div>
);

const MockSurveyCard = () => {
  const questions = [
    { q: 'What is the shoot purpose or campaign goal?', a: 'Ramadan campaign for social media + OOH' },
    { q: 'What mood or aesthetic are you going for?', a: 'Warm, earthy tones — modern Egyptian feel' },
    { q: 'How many final deliverables do you need?', a: '40 edited photos + 5 hero shots' },
    { q: 'Where will the content be used?', a: '' },
  ];
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-2.5 shadow-sm scale-[0.97] -mt-1 relative z-10">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-black tracking-wider text-muted-foreground/50 uppercase">Brief Questions</span>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-otj-blue-border bg-otj-blue-bg text-otj-blue">
          STEP 2/2
        </span>
      </div>
      <div className="text-[9px] text-muted-foreground leading-snug">
        Answer so the creative understands your project
      </div>
      <div className="flex items-center gap-1">
        {questions.map((_, i) => (
          <div key={i} className={`w-[5px] h-[5px] rounded-full ${i < 3 ? 'bg-otj-green' : 'bg-border'}`} />
        ))}
        <span className="text-[8px] text-muted-foreground ml-1">3/4</span>
      </div>
      {questions.map((item, i) => (
        <div key={i}>
          <div className="text-[10px] font-semibold text-foreground mb-1">{item.q}</div>
          <div className="w-full min-h-[28px] rounded-lg border border-border bg-background flex items-center px-3 py-1.5">
            <span className={`text-[9px] leading-relaxed ${item.a ? 'text-foreground' : 'text-muted-foreground/40'}`}>
              {item.a || 'Type your answer…'}
            </span>
          </div>
        </div>
      ))}
      <button className="w-full h-8 rounded-full bg-foreground text-background text-[10px] font-bold cursor-default flex items-center justify-center gap-1">
        Send Brief <span>→</span>
      </button>
    </div>
  );
};
const MockCreativeCard = () => (
  <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
    <div className="w-full h-28 rounded-lg bg-gradient-to-br from-muted to-accent mb-3" />
    <div className="flex items-start justify-between">
      <div>
        <div className="text-[12px] font-extrabold text-foreground">Sarah El-Naggar</div>
        <div className="text-[10px] text-muted-foreground">Brand Designer</div>
      </div>
      <div className="flex items-center gap-0.5 text-[10px] font-bold text-foreground">
        <Star className="w-3 h-3 fill-current" /> 4.9
      </div>
    </div>
    <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground">
      <MapPin className="w-2.5 h-2.5" /> Cairo · 3 yrs
    </div>
  </div>
);

const MockProposalCard = () => (
  <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="text-[11px] font-extrabold text-foreground">Proposal Summary</div>
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-otj-yellow-border bg-otj-yellow-bg text-otj-yellow">
        PENDING
      </span>
    </div>
    <div className="space-y-2">
      {[
        { phase: 'Phase 1 — Research', pct: '100%' },
        { phase: 'Phase 2 — Concepts', pct: '50%' },
        { phase: 'Phase 3 — Final Delivery', pct: '0%' },
      ].map((p) => (
        <div key={p.phase} className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">{p.phase}</span>
          <span className="font-bold text-foreground">{p.pct}</span>
        </div>
      ))}
    </div>
    <div className="border-t border-border pt-3 flex items-center justify-between">
      <div>
        <div className="text-[9px] text-muted-foreground uppercase font-bold">Total Price</div>
        <div className="text-[16px] font-black text-foreground">12,000 EGP</div>
      </div>
      <div>
        <div className="text-[9px] text-muted-foreground uppercase font-bold">Milestones</div>
        <div className="text-[12px] font-bold text-foreground">50 / 25 / 25</div>
      </div>
    </div>
    <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2">
      <PenTool className="w-3 h-3 text-muted-foreground flex-shrink-0" />
      <span className="text-[9px] text-muted-foreground">Counter-offer sent — <span className="font-bold text-foreground">10,500 EGP</span></span>
    </div>
  </div>
);
const MockCalendarCard = () => (
  <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
    <div className="text-[11px] font-extrabold text-foreground mb-3">April 2026</div>
    <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-muted-foreground font-bold mb-1">
      {['S','M','T','W','T','F','S'].map((d,i) => <div key={i}>{d}</div>)}
    </div>
    <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
      {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
        <div
          key={d}
          className={`h-6 w-6 mx-auto flex items-center justify-center rounded-full text-foreground ${
            d === 12 ? 'bg-foreground text-background font-bold' :
            d === 18 ? 'border border-otj-blue text-otj-blue font-bold' :
            d >= 12 && d <= 18 ? 'bg-muted' : ''
          }`}
        >
          {d}
        </div>
      ))}
    </div>
  </div>
);

const MockDashboardCard = () => (
  <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="text-[9px] text-muted-foreground font-bold uppercase">ACTIVE PROJECTS</div>
        <div className="text-[22px] font-black text-foreground">4</div>
      </div>
      <div>
        <div className="text-[9px] text-muted-foreground font-bold uppercase">PENDING BRIEFS</div>
        <div className="text-[22px] font-black text-foreground">3</div>
      </div>
    </div>
    <div className="space-y-2">
      {[
        { name: 'Edita Re-Branding', client: 'Randa Hatem', pct: 57 },
        { name: 'CIB Campaign Assets', client: 'Ahmed Ayubi', pct: 88 },
      ].map((proj) => (
        <div key={proj.name} className="bg-background border border-border rounded-lg p-2.5">
          <div className="flex justify-between items-start mb-1">
            <div>
              <div className="text-[11px] font-bold text-foreground">{proj.name}</div>
              <div className="text-[9px] text-muted-foreground">Client: {proj.client}</div>
            </div>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">
              Hired
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 flex-1">
              {[0, 1, 2].map((seg) => (
                <div key={seg} className={`h-1 flex-1 rounded-full ${seg < Math.ceil(proj.pct / 34) ? 'bg-otj-blue' : 'bg-border'}`} />
              ))}
            </div>
            <span className="text-[9px] font-bold text-foreground">{proj.pct}%</span>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-background border border-border rounded-lg p-2.5 flex items-start gap-2">
      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <Users className="w-2.5 h-2.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] font-bold text-foreground">Sarah El-Naggar</div>
        <div className="text-[9px] text-muted-foreground truncate">Updated concepts attached ✓</div>
      </div>
      <div className="text-[8px] text-muted-foreground flex-shrink-0">2m ago</div>
    </div>
  </div>
);
const MockCompletedCard = () => (
  <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="text-[11px] font-extrabold text-foreground">Edita Re-Branding</div>
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">
        Completed
      </span>
    </div>
    <div className="space-y-1.5">
      {['Brand Guidelines.pdf', 'Logo Pack.zip', 'Social Templates.fig'].map((f) => (
        <div key={f} className="flex items-center justify-between bg-background border border-border rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-[10px] text-foreground font-medium">
            <FileText className="w-3 h-3 text-muted-foreground" /> {f}
          </div>
          <Download className="w-3 h-3 text-muted-foreground" />
        </div>
      ))}
    </div>
    <div className="border-t border-border pt-3">
      <div className="text-[9px] text-muted-foreground uppercase font-bold mb-1">Client Review</div>
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map((s) => (
          <Star key={s} className={`w-3.5 h-3.5 ${s <= 5 ? 'fill-otj-yellow text-otj-yellow' : 'text-border'}`} />
        ))}
        <span className="text-[10px] font-bold text-foreground ml-1">5.0</span>
      </div>
      <div className="text-[10px] text-muted-foreground mt-1 italic">"Exceeded expectations — delivered on time with outstanding quality."</div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   STEP SECTION — alternating layout
   ══════════════════════════════════════════════════════════════════════ */

interface StepProps {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  children: React.ReactNode;
  reverse?: boolean;
}

const StepSection: React.FC<StepProps> = ({ number, title, description, bullets, children, reverse }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 items-center`}
  >
    {/* Text side */}
    <motion.div
      initial={{ opacity: 0, x: reverse ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex-1 space-y-4"
    >
      <div className="text-[clamp(3rem,8vw,5rem)] font-black text-border leading-none tracking-[-0.04em]">
        {number}
      </div>
      <h3 className="text-[clamp(1.4rem,3vw,2rem)] font-black tracking-[-0.03em] leading-tight text-foreground">
        {title}
      </h3>
      <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed max-w-[420px]">
        {description}
      </p>
      <ul className="space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-[12px] text-foreground font-medium">
            <Check className="w-3.5 h-3.5 mt-0.5 text-otj-green flex-shrink-0" strokeWidth={2.5} />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
    {/* Mock UI side */}
    <motion.div
      initial={{ opacity: 0, x: reverse ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex-1 w-full max-w-[440px]"
    >
      {children}
    </motion.div>
  </motion.div>
);
/* ══════════════════════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════════════════════ */

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── 1. Nav ── */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="text-[22px] font-extrabold tracking-[-0.04em]">
            OTJ<sup className="text-[8px] align-super font-bold">™</sup>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {['About', 'Service', 'Subscription', 'Get in touch'].map((item) => (
              <button
                key={item}
                className="px-4 py-1.5 rounded-full border border-border text-[12px] font-semibold text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-150 cursor-pointer bg-transparent"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── 2. Hero ── */}
      <section className="max-w-[1200px] mx-auto px-6 pt-20 md:pt-32 pb-12 text-center">
        <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black tracking-[-0.05em] leading-[0.9] uppercase mb-6">
          Where Egypt's<br />Creative Work<br />Gets Done
        </h1>
        <p className="text-[13px] md:text-[15px] text-muted-foreground max-w-[500px] mx-auto mb-10 leading-relaxed tracking-wide uppercase">
          Brief a creative. Book them. Manage the project. One platform — from first idea to final file.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-3.5 rounded-full bg-foreground text-background text-[13px] font-bold cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          >
            Join The Waitlist
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-3.5 rounded-full border-[1.5px] border-foreground text-foreground text-[13px] font-bold cursor-pointer transition-all duration-150 hover:bg-foreground hover:text-background active:scale-[0.98] bg-transparent"
          >
            Log In
          </button>
        </div>
      </section>

      {/* ── 3. Category Pills ── */}
      <section className="max-w-[1200px] mx-auto px-6 pb-16">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-[12px] font-semibold text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-150 cursor-pointer"
            >
              <cat.icon className="w-3.5 h-3.5" strokeWidth={1.8} />
              {cat.name}
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── 4. How It Works — 4 Steps ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-28 space-y-24 md:space-y-32">
        <div className="text-center mb-4">
          <div className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-muted-foreground mb-3">
            How It Works
          </div>
          <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black tracking-[-0.04em] leading-tight text-foreground">
            From First Brief to Final File
          </h2>
        </div>

        {/* Step 01 */}
        <StepSection
          number="01"
          title="Discover & Brief"
          description="Browse Egypt's top creatives by category — photographers, designers, AI creators, developers, and more. Found the right one? Send a structured brief with your scope, references, budget, and timeline."
          bullets={[
            'Search by niche, location, and availability',
            'Structured brief form — no PDFs or WhatsApp',
            'Attach references and mood boards',
            'Set your budget range and deadline',
          ]}
        >
          <div className="space-y-3">
            <MockCreativeCard />
            <MockBriefCard />
            <MockSurveyCard />
          </div>
        </StepSection>

        {/* Step 02 */}
        <StepSection
          number="02"
          title="Book & Confirm"
          description="The creative reviews your brief and sends back a full proposal — phases, tasks, deliverables, pricing, and payment milestones. Accept, negotiate, or counter-offer. Once agreed, the project kicks off."
          bullets={[
            'Receive a detailed proposal with phases & tasks',
            'Clear payment milestones (50/25/25, etc.)',
            'Calendar-based scheduling for deadlines',
            'Accept or counter-offer in one click',
          ]}
          reverse
        >
          <div className="space-y-3">
            <MockCalendarCard />
            <MockProposalCard />
          </div>
        </StepSection>

        {/* Step 03 */}
        <StepSection
          number="03"
          title="Manage & Track"
          description="Your dashboard is your command center. Track every project's progress in real-time — phases, tasks, meetings, payments, and files. No email chains. No lost threads."
          bullets={[
            'Real-time project progress with phase tracking',
            'Built-in messaging between client & creative',
            'Schedule meetings and manage attachments',
            'Release payments as milestones are completed',
          ]}
        >
          <MockDashboardCard />
        </StepSection>

        {/* Step 04 */}
        <StepSection
          number="04"
          title="Deliver & Archive"
          description="When the work is done, deliverables are uploaded, final payments released, and both sides leave reviews. Every completed project is archived — a portfolio piece for creatives, a receipt for clients."
          bullets={[
            'Download all deliverables in one place',
            'Mutual review system — stars, tags, and text',
            'Full project archive with payment history',
            'Re-book your favorite creatives instantly',
          ]}
          reverse
        >
          <MockCompletedCard />
        </StepSection>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── 5. Share Your Profile ── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-[1200px] mx-auto px-6 py-20 md:py-28"
      >
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
          <div className="flex-1 space-y-4">
            <div className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-muted-foreground">Your Profile, Everywhere</div>
            <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black tracking-[-0.04em] leading-tight text-foreground">
              Share Your OTJ<br />Profile Link
            </h2>
            <p className="text-[13px] md:text-[14px] text-muted-foreground leading-relaxed max-w-[420px]">
              Every creative gets a shareable profile link. Drop it in your Instagram bio, LinkedIn, Twitter, or email signature — clients land on your full portfolio and can book you instantly.
            </p>
            <ul className="space-y-2">
              {[
                'One link for your entire creative portfolio',
                'Put it in your bio, stories, or email signature',
                'Clients see your work, reviews & availability',
                'Book directly — no DMs, no back-and-forth',
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[12px] text-foreground font-medium">
                  <Check className="w-3.5 h-3.5 mt-0.5 text-otj-green flex-shrink-0" strokeWidth={2.5} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full max-w-[440px]">
            <div className="bg-card border border-border rounded-xl p-4 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-accent flex items-center justify-center">
                  <span className="text-[14px] font-black text-foreground">SE</span>
                </div>
                <div>
                  <div className="text-[13px] font-extrabold text-foreground">Sarah El-Naggar</div>
                  <div className="text-[10px] text-muted-foreground">Brand Designer · Cairo</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2.5">
                <Link2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-[11px] text-foreground font-medium flex-1 truncate">otj.co/sarah-elnaggar</span>
                <button className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-foreground text-background cursor-default">Copy</button>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Share on</div>
              <div className="flex gap-2">
                {[
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Share2, label: 'LinkedIn' },
                  { icon: MessageCircle, label: 'WhatsApp' },
                  { icon: Mail, label: 'Email' },
                ].map((s) => (
                  <div key={s.label} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border text-[9px] font-semibold text-muted-foreground hover:border-foreground hover:text-foreground transition-all cursor-default">
                    <s.icon className="w-3 h-3" />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── 6. Filtration System / Niche Discovery ── */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-[1200px] mx-auto px-6 py-20 md:py-28"
      >
        <div className="text-center mb-12">
          <div className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-muted-foreground mb-3">
            Smart Discovery
          </div>
          <h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-black tracking-[-0.04em] leading-tight text-foreground mb-3">
            Find Exactly Who You Need
          </h2>
          <p className="text-[13px] md:text-[14px] text-muted-foreground max-w-[500px] mx-auto leading-relaxed">
            Not just "photographer" — filter by niche, skill set, location, availability, and budget. Every creative is categorized by what they actually do.
          </p>
        </div>

        {/* Mock filter UI */}
        <div className="max-w-[600px] mx-auto">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
            {/* Category selector */}
            <div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Category</div>
              <div className="flex gap-1.5 flex-wrap">
                {['Photography', 'Videography', 'Design', 'Writing'].map((cat, i) => (
                  <div key={cat} className={`text-[10px] font-bold px-3 py-1.5 rounded-full border cursor-default transition-all ${i === 0 ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground'}`}>
                    {cat}
                  </div>
                ))}
              </div>
            </div>

            {/* Niche drill-down */}
            <div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Niche</div>
              <div className="flex gap-1.5 flex-wrap">
                {['Fashion', 'Product', 'Food', 'E-commerce', 'Event', 'Real Estate', 'Jewelry'].map((n, i) => (
                  <div key={n} className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border cursor-default transition-all ${i === 0 ? 'border-otj-blue bg-otj-blue-bg text-otj-blue' : 'border-border text-muted-foreground'}`}>
                    {n}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Skills</div>
              <div className="flex gap-1.5 flex-wrap">
                {['Lighting', 'Retouching', 'Studio', 'Color Grading', 'Editorial', 'Posing Direction'].map((s, i) => (
                  <div key={s} className={`text-[10px] font-semibold px-3 py-1.5 rounded-full border cursor-default transition-all ${i < 2 ? 'border-otj-green bg-otj-green-bg text-otj-green' : 'border-border text-muted-foreground'}`}>
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Filters row */}
            <div className="flex gap-2">
              {['Cairo', 'Available Now', '3,000–8,000 EGP'].map((f) => (
                <div key={f} className="flex items-center gap-1 text-[9px] font-semibold px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground">
                  <Filter className="w-2.5 h-2.5" />
                  {f}
                </div>
              ))}
            </div>

            {/* Results hint */}
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                <span className="font-bold text-foreground">23</span> Fashion Photographers in Cairo
              </span>
              <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-foreground text-background cursor-default">
                View Results →
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── 7. Manifesto ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
        <p className="text-[clamp(1rem,2.5vw,1.35rem)] font-extrabold tracking-[-0.02em] leading-snug uppercase max-w-[700px]">
          The brief shouldn't be a PDF attachment. The booking shouldn't be
          on WhatsApp. The project shouldn't live in email threads.
          OTJ is the operating system for Egypt's creative economy.
        </p>
      </section>

      {/* ── Big Display ── */}
      <section className="max-w-[1200px] mx-auto px-6 pb-16">
        <div className="text-[clamp(3rem,12vw,9rem)] font-black tracking-[-0.04em] leading-[0.95] italic text-center">
          One Time Job
        </div>
      </section>

      {/* ── 8. CTA ── */}
      <section className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
          <div className="max-w-[600px] mx-auto md:mx-0">
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.04em] leading-[1.1] mb-4 text-foreground">
              Hello, Welcome<br />to One Time Job
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-8 max-w-[440px]">
              OTJ is what happens when you build the tool creative
              professionals always needed. One structured flow — from
              the first brief to the final file. No context switching.
              No lost threads.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 rounded-full border-[1.5px] border-foreground bg-transparent text-foreground text-[13px] font-bold cursor-pointer transition-all duration-150 hover:bg-foreground hover:text-background active:scale-[0.98]"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 rounded-full border-[1.5px] border-foreground bg-foreground text-background text-[13px] font-bold cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Footer ── */}
      <footer className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="text-[22px] font-extrabold tracking-[-0.04em] mb-3">
                OTJ<sup className="text-[8px] align-super font-bold">™</sup>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[240px]">
                The operating system for Egypt's creative economy. From first brief to final file.
              </p>
            </div>

            {/* Platform */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">Platform</div>
              <ul className="space-y-2">
                {['How It Works', 'Explore Creatives', 'Pricing', 'For Businesses'].map((item) => (
                  <li key={item} className="text-[12px] text-foreground font-medium cursor-pointer hover:text-muted-foreground transition-colors">{item}</li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">Support</div>
              <ul className="space-y-2">
                {['Contact Us', 'FAQ', 'Terms of Service', 'Privacy Policy'].map((item) => (
                  <li key={item} className="text-[12px] text-foreground font-medium cursor-pointer hover:text-muted-foreground transition-colors">{item}</li>
                ))}
              </ul>
            </div>

            {/* Get in Touch */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">Get in Touch</div>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-[12px] text-foreground font-medium">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> hello@otj.co
                </li>
                <li className="flex items-center gap-2 text-[12px] text-foreground font-medium">
                  <Instagram className="w-3.5 h-3.5 text-muted-foreground" /> @otj.egypt
                </li>
                <li className="flex items-center gap-2 text-[12px] text-foreground font-medium">
                  <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" /> WhatsApp Support
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ Teaser */}
          <div className="border-t border-border pt-8 mb-8">
            <div className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-muted-foreground mb-4 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { q: 'Is OTJ free for creatives?', a: 'Yes — creating your profile, receiving briefs, and managing projects is completely free.' },
                { q: 'How do payments work?', a: 'Clients deposit funds in escrow. Payments are released as milestones are completed.' },
                { q: 'Can I set my own prices?', a: 'Absolutely. You set your rates, and clients can accept or negotiate.' },
                { q: 'What if a project goes wrong?', a: 'OTJ provides dispute resolution and escrow protection for both sides.' },
              ].map((faq) => (
                <div key={faq.q} className="bg-card border border-border rounded-lg p-3.5">
                  <div className="text-[11px] font-bold text-foreground mb-1">{faq.q}</div>
                  <div className="text-[10px] text-muted-foreground leading-relaxed">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-muted-foreground">
              © 2026 One Time Job. All rights reserved.
            </div>
            <div className="text-[11px] text-muted-foreground">
              Built for Egypt's creative economy
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
