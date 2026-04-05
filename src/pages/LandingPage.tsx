import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Film, Palette, Sparkles, Code, TrendingUp, Scissors, PenTool, Package, CalendarDays, Building2 } from 'lucide-react';

const categories = [
  { icon: Camera, name: 'Photography', sub: 'Wedding, Portrait, Editorial, Events' },
  { icon: Film, name: 'Videography', sub: 'Film, Commercial, Documentary' },
  { icon: Palette, name: 'Design & Branding', sub: 'Branding, Brand Identity, Packaging, Digital' },
  { icon: Sparkles, name: 'AI Creator', sub: 'Video, Images, Prompt, Automation' },
  { icon: Code, name: 'Tech Development', sub: 'Web, App, Frontend, Backend' },
  { icon: TrendingUp, name: 'Business & Marketing', sub: 'Web, App, Frontend, Backend' },
  { icon: Scissors, name: 'MUA & Styling', sub: 'Web, App, Frontend, Backend' },
  { icon: PenTool, name: 'Creative Writing', sub: 'Models, UGC, Voice Over, Musician' },
  { icon: Package, name: 'Creation Production', sub: 'Web, App, Frontend, Backend' },
  { icon: CalendarDays, name: 'Event Producers', sub: 'Wedding, Corporate, Festivals, Live' },
  { icon: Building2, name: 'Space Design', sub: 'Interior, Architecture, Exhibition' },
];

const steps = ['BRIEF SURVEY', 'BROWSE & BOOK', 'CONFIRM & KICK OFF', 'PROJECT & DELIVERY'];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="text-[22px] font-extrabold tracking-[-0.04em]">
            OTJ<sup className="text-[8px] align-super font-bold">™</sup>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {['About', 'Service', 'Subscription', 'Get in touch'].map((item) => (
              <button
                key={item}
                className="px-4 py-1.5 rounded-full border border-border text-[12px] font-semibold text-otj-text hover:border-foreground hover:text-foreground transition-all duration-150 cursor-pointer bg-transparent"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-[1200px] mx-auto px-6 pt-16 md:pt-24 pb-10 text-center">
        <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black tracking-[-0.05em] leading-[0.9] uppercase mb-8">
          A Creative Created<br className="hidden md:block" /> A Creation
          <br />To All Creators
        </h1>
        <button
          onClick={() => navigate('/login')}
          className="px-10 py-3.5 rounded-full bg-foreground text-background text-[13px] font-bold cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
        >
          Join The Waitlist
        </button>
      </section>

      {/* ── Subtitle ── */}
      <section className="max-w-[700px] mx-auto px-6 py-12 text-center">
        <p className="text-[13px] md:text-[14px] text-otj-text leading-relaxed tracking-wide uppercase">
          OTJ is the platform where egypt's creative work gets done. brief a creative,
          <br className="hidden md:block" /> book them, manage the project
        </p>
      </section>

      {/* ── Process Steps ── */}
      <section className="border-y border-border">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step}
              className={`px-4 py-4 text-center text-[11px] md:text-[12px] font-extrabold tracking-[0.08em] uppercase ${
                i < steps.length - 1 ? 'border-r border-border' : ''
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </section>

      {/* ── Big Display Text ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
        <div className="text-[clamp(3rem,12vw,9rem)] font-black tracking-[-0.04em] leading-[0.95] italic text-center">
          One Time Job
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="max-w-[1200px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="border border-border rounded-xl p-4 hover:border-foreground transition-all duration-150 cursor-pointer group"
            >
              <cat.icon className="w-5 h-5 mb-2.5 text-otj-muted group-hover:text-foreground transition-colors" strokeWidth={1.5} />
              <div className="text-[13px] font-extrabold tracking-[-0.01em] mb-0.5">{cat.name}</div>
              <div className="text-[10.5px] text-otj-muted leading-snug">{cat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
        <p className="text-[clamp(1rem,2.5vw,1.35rem)] font-extrabold tracking-[-0.02em] leading-snug uppercase max-w-[700px]">
          The brief shouldn't be a PDF attachment. The booking shouldn't be
          on WhatsApp or Instagram. The project shouldn't be managed over
          email or phone.
        </p>
      </section>

      {/* ── Feature Showcase ── */}
      <section className="max-w-[1200px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Brief Survey Card */}
          <div className="bg-otj-off border border-border rounded-2xl overflow-hidden">
            <div className="p-5 pb-3">
              <p className="text-[12px] text-otj-text leading-relaxed mb-4">
                fill a structured brief — scope, references,
                budget, and timeline. built to eliminate back-
                and-forth from the start. the brief is the
                contract before the contract.
              </p>
            </div>
            <div className="px-4 pb-4">
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-otj-muted">NM</div>
                    <div className="text-[12px] font-bold">Nour Makram</div>
                    <div className="text-[10px] text-otj-muted">Fashion Photographer · Cairo</div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-otj-blue-border bg-otj-blue-bg text-otj-blue">STEP 1/2</span>
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-otj-muted mb-1">PROJECT NAME</div>
                  <div className="w-full h-8 rounded-lg border border-border bg-otj-off" />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-otj-muted mb-1">PROJECT TYPE</div>
                  <div className="w-full h-8 rounded-lg border border-border bg-otj-off" />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-otj-muted mb-1">DESCRIPTION</div>
                  <div className="w-full h-16 rounded-lg border border-border bg-otj-off" />
                </div>
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="text-[1.3rem] font-black italic tracking-[-0.02em]">Brief Survey</div>
            </div>
          </div>

          {/* Dashboard Card */}
          <div className="bg-otj-off border border-border rounded-2xl overflow-hidden">
            <div className="px-4 pt-5 pb-4">
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[9px] text-otj-muted font-bold uppercase">HIRED PROJECTS</div>
                    <div className="text-[22px] font-black">3</div>
                    <div className="text-[9px] text-otj-muted">Working on</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-otj-muted font-bold uppercase">MY BOOKINGS</div>
                    <div className="text-[22px] font-black">1</div>
                    <div className="text-[9px] text-otj-blue font-bold">You booked</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[9px] text-otj-muted font-bold uppercase">BOOKING RATE</div>
                    <div className="text-[18px] font-black">14K</div>
                    <div className="text-[9px] text-otj-muted">↓ 20% on Feb</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-otj-muted font-bold uppercase">PENDING BRIEFS</div>
                    <div className="text-[18px] font-black">3</div>
                    <div className="text-[9px] text-otj-muted">Need responses</div>
                  </div>
                </div>
                <div className="pt-1">
                  <div className="flex gap-1 text-[9px] font-bold mb-2">
                    <span className="text-foreground">Projects</span>
                    <span className="text-otj-muted">Pending (3)</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-otj-blue-bg text-otj-blue border border-otj-blue-border">Active (4)</span>
                    <span className="text-otj-muted">Complete (5)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-otj-off border border-border rounded-lg p-2.5">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <div className="text-[11px] font-bold">Edita Re-Branding</div>
                          <div className="text-[9px] text-otj-muted">Client: Randa Hatem · Edita Group</div>
                        </div>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">Hired</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5 flex-1">
                          <div className="h-1 flex-1 rounded-full bg-otj-blue" />
                          <div className="h-1 flex-1 rounded-full bg-border" />
                          <div className="h-1 flex-1 rounded-full bg-border" />
                        </div>
                        <span className="text-[9px] font-bold">57%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="text-[1.3rem] font-black italic tracking-[-0.02em]">Dashboard</div>
            </div>
          </div>

          {/* Project Overview Card */}
          <div className="bg-otj-off border border-border rounded-2xl overflow-hidden">
            <div className="px-4 pt-5 pb-4">
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[9px] text-otj-muted font-bold uppercase">HIRED PROJECTS</div>
                    <div className="text-[22px] font-black">3</div>
                    <div className="text-[9px] text-otj-muted">Working on</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-otj-muted font-bold uppercase">MY BOOKINGS</div>
                    <div className="text-[22px] font-black">1</div>
                    <div className="text-[9px] text-otj-blue font-bold">You booked</div>
                  </div>
                </div>
                <div className="pt-1">
                  <div className="flex gap-1 text-[9px] font-bold mb-2">
                    <span className="text-foreground">Projects</span>
                    <span className="text-otj-muted">Pending (3)</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-otj-blue-bg text-otj-blue border border-otj-blue-border">Active (4)</span>
                    <span className="text-otj-muted">Complete (5)</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-otj-off border border-border rounded-lg p-2.5">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <div className="text-[11px] font-bold">Edita Re-Branding</div>
                          <div className="text-[9px] text-otj-muted">Client: Randa Hatem · Edita Group</div>
                        </div>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">Hired</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5 flex-1">
                          <div className="h-1 flex-1 rounded-full bg-otj-blue" />
                          <div className="h-1 flex-1 rounded-full bg-border" />
                          <div className="h-1 flex-1 rounded-full bg-border" />
                        </div>
                        <span className="text-[9px] font-bold">57%</span>
                      </div>
                    </div>
                    <div className="bg-otj-off border border-border rounded-lg p-2.5">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <div className="text-[11px] font-bold">CIB Campaign Assets</div>
                          <div className="text-[9px] text-otj-muted">Client: Ahmed Ayubi · CIB</div>
                        </div>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">Hired</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5 flex-1">
                          <div className="h-1 flex-1 rounded-full bg-otj-blue" />
                          <div className="h-1 flex-1 rounded-full bg-otj-blue" />
                          <div className="h-1 flex-1 rounded-full bg-border" />
                        </div>
                        <span className="text-[9px] font-bold">88%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="text-[1.3rem] font-black italic tracking-[-0.02em]">Project Overview</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Welcome / CTA Section ── */}
      <section className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
          <div className="max-w-[600px] mx-auto md:mx-0">
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black tracking-[-0.04em] leading-[1.1] mb-4">
              Hello, Welcome<br />to One Time Job
            </h2>
            <p className="text-[14px] text-otj-text leading-relaxed mb-8 max-w-[440px]">
              OTJ is what happens when you build the tool
              creative professionals always needed. one
              structured flow — from the first brief to the
              final file. no context switching. no lost threads.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 rounded-full border-[1.5px] border-foreground bg-transparent text-[13px] font-bold cursor-pointer transition-all duration-150 hover:bg-foreground hover:text-background active:scale-[0.98]"
              >
                Login In
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

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-between">
          <div className="text-[18px] font-extrabold tracking-[-0.04em]">
            OTJ<sup className="text-[7px] align-super font-bold">™</sup>
          </div>
          <div className="text-[11px] text-otj-muted">
            Built for Egypt's creative economy
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
