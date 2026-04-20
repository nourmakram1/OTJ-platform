import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Toast, showToast } from '../components/Toast';
import { ArrowLeft, Mail, MessageCircle, Instagram, ChevronDown, ChevronUp, LifeBuoy, BookOpen, Send } from 'lucide-react';

const faqs = [
  { q: 'Is OTJ free for creatives?', a: 'Yes — creating your profile, receiving briefs, and managing projects is completely free.' },
  { q: 'How do payments work?', a: 'Clients deposit funds in escrow. Payments are released as milestones are completed.' },
  { q: 'Can I set my own prices?', a: 'Absolutely. You set your rates, and clients can accept or negotiate.' },
  { q: 'What if a project goes wrong?', a: 'OTJ provides dispute resolution and escrow protection for both sides.' },
  { q: 'How do I get verified?', a: 'Complete your profile to 100% and your account will be reviewed within 48 hours.' },
  { q: 'Can I act as both client and creative?', a: 'Yes. Use the role switcher in the top nav to switch between booking creatives and receiving briefs.' },
];

const Help: React.FC = () => {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast('Please fill in both fields');
      return;
    }
    showToast('✓ Message sent — we\'ll reply within 24h');
    setSubject('');
    setMessage('');
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-[52px] bg-background">
        <div className="max-w-[760px] mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          {/* Hero */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">
              <LifeBuoy className="w-3 h-3" /> Help Center
            </div>
            <h1 className="text-[28px] font-extrabold tracking-[-0.04em] text-foreground mb-1">How can we help?</h1>
            <p className="text-[13px] text-muted-foreground">Browse FAQs or reach out directly — we usually reply within 24 hours.</p>
          </div>

          {/* Quick contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <a href="mailto:hello@otj.co" className="bg-card border border-border rounded-[14px] p-4 hover:border-foreground transition-colors flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Mail className="w-[18px] h-[18px] text-foreground" />
              </div>
              <div>
                <div className="text-[12.5px] font-bold text-foreground">Email us</div>
                <div className="text-[11px] text-muted-foreground">hello@otj.co</div>
              </div>
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="bg-card border border-border rounded-[14px] p-4 hover:border-foreground transition-colors flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <MessageCircle className="w-[18px] h-[18px] text-foreground" />
              </div>
              <div>
                <div className="text-[12.5px] font-bold text-foreground">WhatsApp</div>
                <div className="text-[11px] text-muted-foreground">Chat with support</div>
              </div>
            </a>
            <a href="https://instagram.com/otj.egypt" target="_blank" rel="noopener noreferrer" className="bg-card border border-border rounded-[14px] p-4 hover:border-foreground transition-colors flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Instagram className="w-[18px] h-[18px] text-foreground" />
              </div>
              <div>
                <div className="text-[12.5px] font-bold text-foreground">Instagram</div>
                <div className="text-[11px] text-muted-foreground">@otj.egypt</div>
              </div>
            </a>
          </div>

          {/* FAQ */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-foreground" />
              <h2 className="text-[15px] font-extrabold tracking-[-0.02em] text-foreground">Frequently asked</h2>
            </div>
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {faqs.map((faq, i) => {
                const open = openIdx === i;
                return (
                  <div key={faq.q} className={i < faqs.length - 1 ? 'border-b border-border' : ''}>
                    <button
                      onClick={() => setOpenIdx(open ? null : i)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-accent transition-colors"
                    >
                      <span className="text-[13px] font-bold text-foreground">{faq.q}</span>
                      {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </button>
                    {open && (
                      <div className="px-5 pb-4 text-[12.5px] text-muted-foreground leading-relaxed">{faq.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-card rounded-2xl border border-border p-5 mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-foreground" />
              <h2 className="text-[15px] font-extrabold tracking-[-0.02em] text-foreground">Still need help?</h2>
            </div>
            <p className="text-[12px] text-muted-foreground mb-4">Send us a message and the team will get back to you within 24 hours.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-background text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground placeholder:text-muted-foreground"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question…"
                rows={5}
                className="px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-background text-[13.5px] text-foreground outline-none transition-all duration-150 w-full focus:border-foreground placeholder:text-muted-foreground resize-none"
              />
              <button
                type="submit"
                className="self-end text-[12.5px] font-bold px-5 py-2 rounded-full bg-foreground text-background cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-95"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toast />
    </>
  );
};

export default Help;
