import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Lock, MapPin, Package, Star, MessageCircle, Download, RotateCcw, CreditCard } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import { showToast, Toast } from '../components/Toast';
import { useProjects } from '../context/ProjectContext';

const tabs = ['Phases & Tasks', 'Brief', 'Deliverables', 'Payments', 'Reviews'];

const CompletedProjectProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getCompletedProject, clients } = useProjects();
  const [activeTab, setActiveTab] = useState(0);

  const proj = getCompletedProject(id || '');

  if (!proj) {
    return (
      <>
        <NavBar />
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 pt-[80px] text-center">
          <div className="text-[40px] mb-3">📂</div>
          <div className="text-[18px] font-extrabold mb-1">Project not found</div>
          <div className="text-[13px] text-otj-text mb-4">This completed project doesn't exist or has been removed.</div>
          <button onClick={() => navigate('/dashboard')} className="text-[12px] font-bold px-4 py-2 rounded-full bg-primary text-primary-foreground cursor-pointer">Back to Dashboard</button>
        </div>
      </>
    );
  }

  const numericPrice = parseInt(proj.earned.replace(/[^0-9]/g, '')) || 0;

  const navigateToClient = (name: string) => {
    const client = clients.find(c => c.name === name);
    if (client) navigate(`/client/${client.id}`);
  };

  return (
    <>
      <NavBar />

      {/* ── Hero card ── */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-6 pt-[72px]">
          <div className="flex items-center gap-2 text-[12px] text-otj-text mb-4 cursor-pointer hover:text-foreground transition-colors active:opacity-70" onClick={() => navigate('/dashboard')}>
            ← Dashboard / Completed Projects
          </div>
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                <div className="text-[18px] md:text-[22px] font-extrabold tracking-[-0.04em] text-foreground">{proj.name}</div>
                <span className="text-[11px] font-bold px-2.5 py-[3px] rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">Completed ✓</span>
                <CheckCircle2 className="w-4 h-4 text-[hsl(var(--otj-green))]" />
                <Lock size={13} className="text-otj-muted" />
              </div>
              <div className="text-[12px] md:text-[13px] text-otj-text">
                Client: <span className="cursor-pointer hover:underline text-foreground font-semibold" onClick={() => navigateToClient(proj.clientName)}>{proj.clientName}</span> · {proj.clientCompany}
              </div>
            </div>
            <div className="flex gap-2 shrink-0 flex-wrap mt-3 md:mt-0">
              <button onClick={() => showToast('Downloading deliverables…')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-transparent text-foreground cursor-pointer transition-all duration-150 hover:bg-otj-off active:scale-[0.98] flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Download</button>
              {proj.creativeId && (
                <button onClick={() => navigate(`/creative/${proj.creativeId}`)} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border-none bg-primary text-primary-foreground cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-[0.98] flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> Rebook</button>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-5 pt-4 border-t border-border">
            {[
              { label: '% Complete', val: '100%', green: true },
              { label: 'Status', val: 'Done ✓', green: true },
              { label: 'Phases', val: `${proj.phases.length} of ${proj.phases.length}` },
              { label: 'Total Earned', val: proj.earned, green: true },
              { label: 'Completed', val: proj.completedDate.split(',')[0] },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-0.5">{s.label}</div>
                <div className={`text-[14px] font-extrabold tracking-[-0.02em] ${s.green ? 'text-[hsl(var(--otj-green))]' : 'text-foreground'}`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Archived banner ── */}
      <div className="bg-otj-off border-b border-border">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-2.5 flex items-center gap-2">
          <Lock size={12} className="text-otj-muted" />
          <span className="text-[11.5px] text-otj-text font-medium">This project is archived and read-only. All data is preserved for your records.</span>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="border-b border-border bg-card sticky top-[52px] z-[50]">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto hide-scrollbar py-2">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)} className={`text-[12.5px] font-semibold px-4 py-[7px] rounded-full border-[1.5px] cursor-pointer whitespace-nowrap shrink-0 transition-all duration-150 ${
              activeTab === i ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-otj-text hover:border-otj-muted hover:text-foreground'
            }`}>{t}</button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-6 pb-20 md:pb-6 flex flex-col md:grid md:grid-cols-[1fr_300px] gap-6">
        <div className="order-1 md:order-none">

          {/* Phases & Tasks — read-only, all complete */}
          {activeTab === 0 && (
            <div className="flex flex-col gap-3 animate-fade-up">
              {proj.phases.map(p => (
                <div key={p.num} className="bg-card border-[1.5px] border-otj-green rounded-[14px] overflow-hidden">
                  <div className="p-3.5 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 bg-otj-green text-primary-foreground">✓</div>
                    <div className="flex-1">
                      <div className="text-[13.5px] font-extrabold tracking-[-0.02em]">Phase {p.num} — {p.title}</div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-[3px] rounded-full bg-otj-green-bg text-otj-green">✓ Complete</span>
                  </div>
                  <div className="px-4 pb-3.5 flex flex-col gap-1.5 border-t border-border pt-3">
                    {p.tasks.map((task, j) => (
                      <div key={j} className="flex items-center gap-2.5 p-2 px-3 rounded-[9px]">
                        <div className="w-[18px] h-[18px] rounded shrink-0 flex items-center justify-center bg-otj-green">
                          <span className="text-primary-foreground text-[10px]">✓</span>
                        </div>
                        <div className="flex-1 min-w-0 break-words text-[13px] font-medium text-otj-muted line-through">{task.text}</div>
                        <div className="text-[11px] text-otj-muted">{task.due}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Brief tab */}
          {activeTab === 1 && (
            <div className="animate-fade-up flex flex-col gap-4">
              <div className="bg-card border border-border rounded-[14px] overflow-hidden">
                <div className="px-5 pt-5 pb-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 mb-2">
                    <h2 className="text-[24px] md:text-[28px] font-extrabold tracking-[-0.04em] text-foreground leading-tight">{proj.name}</h2>
                    <span className="text-[11px] font-bold px-2.5 py-[3px] rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border shrink-0 self-center">Completed</span>
                    <span className="text-[11px] text-otj-muted self-center">{proj.startedDate}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-otj-text mb-4">
                    <span>
                      <span className="font-semibold text-foreground cursor-pointer hover:underline" onClick={() => navigateToClient(proj.clientName)}>{proj.clientName}</span>
                      {proj.clientCompany && <span> · {proj.clientCompany}</span>}
                    </span>
                    {proj.location && (
                      <span className="flex items-center gap-1 text-otj-muted"><MapPin size={11} strokeWidth={2} />{proj.location}</span>
                    )}
                  </div>
                  {proj.tags && proj.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {proj.tags.map((t, j) => (
                        <span key={j} className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full bg-otj-off border border-border text-otj-text">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Total Earned', value: proj.earned },
                  { label: 'Completed', value: proj.completedDate.split(',')[0] },
                  { label: 'Project Type', value: proj.projectType },
                  { label: 'Location', value: proj.location || '—' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-otj-off border border-border rounded-[12px] px-3.5 py-2.5">
                    <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-0.5">{stat.label}</div>
                    <div className="text-[13px] font-extrabold tracking-[-0.02em] text-foreground leading-snug">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {(proj.description || proj.moodAesthetic) && (
                <div className="bg-card border border-border rounded-[14px] overflow-hidden">
                  <div className="px-5 py-3 border-b border-border">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-otj-muted">Project Description</div>
                  </div>
                  <div className="px-5 py-4 flex flex-col gap-4">
                    {proj.description && <p className="text-[14px] text-foreground leading-[1.7] tracking-[-0.01em]">{proj.description}</p>}
                    {proj.moodAesthetic && (
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Mood & Aesthetic</div>
                        <p className="text-[13px] text-foreground leading-relaxed">{proj.moodAesthetic}</p>
                      </div>
                    )}
                    {proj.deliverables && (
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Deliverables</div>
                        <p className="text-[13px] text-foreground leading-relaxed">{proj.deliverables}</p>
                      </div>
                    )}
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
                    <div className="text-[13px] font-semibold text-foreground cursor-pointer hover:underline" onClick={() => navigateToClient(proj.clientName)}>{proj.clientName}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Company</div>
                    <div className="text-[13px] font-semibold text-foreground">{proj.clientCompany}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Email</div>
                    <div className="text-[13px] font-semibold text-foreground">{proj.clientEmail}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1">Phone</div>
                    <div className="text-[13px] font-semibold text-foreground">{proj.clientPhone}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deliverables tab */}
          {activeTab === 2 && (
            <div className="animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-extrabold tracking-[-0.04em]">Deliverables</div>
                <button onClick={() => showToast('Downloading all deliverables…')} className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border border-border bg-card cursor-pointer hover:border-foreground active:scale-[0.98] flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Download All</button>
              </div>
              <div className="flex flex-col gap-2">
                {proj.proposalDeliverables.map((d, i) => (
                  <div key={i} className="bg-card border border-border rounded-[10px] p-3.5 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-otj-green-bg flex items-center justify-center"><Package className="w-4 h-4 text-otj-green" /></div>
                    <div className="text-[13px] font-medium text-foreground flex-1">{d}</div>
                    <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-otj-green-bg text-otj-green">Delivered</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments tab */}
          {activeTab === 3 && (
            <div className="animate-fade-up">
              <div className="text-lg font-extrabold tracking-[-0.04em] mb-4">Payment Summary</div>

              {/* Total earned card */}
              <div className="bg-otj-green-bg border border-otj-green-border rounded-[14px] p-5 mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-green mb-1">Total Earned</div>
                  <div className="text-[24px] font-extrabold text-otj-green tracking-[-0.03em]">{proj.earned}</div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-[hsl(var(--otj-green))] opacity-40" />
              </div>

              {proj.paymentMilestones.map((m, i) => {
                const amount = numericPrice > 0 ? `${Math.round(numericPrice * m.percentage / 100).toLocaleString()} EGP` : '—';
                return (
                  <div key={i} className="bg-card border border-border rounded-[14px] p-4 mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-bold">{m.label} ({m.percentage}%)</div>
                        <div className="text-[11px] font-bold text-otj-green">Received ✓</div>
                      </div>
                      <div className="text-[16px] font-extrabold">{amount}</div>
                    </div>
                  </div>
                );
              })}

              {proj.paymentMethod && (
                <div className="bg-otj-off rounded-[10px] p-3.5 px-4 mt-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-1.5">Payment Method</div>
                  {proj.paymentMethod.type === 'instapay' ? (
                    <div className="text-[13px] font-bold">InstaPay — {proj.paymentMethod.instapayHandle}</div>
                  ) : (
                    <div className="text-[13px] font-bold">{proj.paymentMethod.bankName} — {proj.paymentMethod.accountName} · {proj.paymentMethod.accountNumber}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === 4 && (
            <div className="animate-fade-up">
              <div className="text-lg font-extrabold tracking-[-0.04em] mb-4">Reviews</div>
              {proj.reviews.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {proj.reviews.map(r => (
                    <div key={r.id} className="bg-card border border-border rounded-[14px] p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-otj-off flex items-center justify-center text-[14px] font-bold">{r.reviewerName.charAt(0)}</div>
                        <div className="flex-1">
                          <div className="text-[13px] font-extrabold">{r.reviewerName}</div>
                          <div className="text-[11px] text-otj-text">{r.createdAt}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={13} className={i < r.rating ? 'fill-[hsl(var(--otj-yellow))] text-[hsl(var(--otj-yellow))]' : 'text-otj-light'} />
                          ))}
                        </div>
                      </div>
                      {r.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {r.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] font-bold px-2 py-[2px] rounded-full bg-otj-green-bg text-otj-green border border-otj-green-border">{tag}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-[13px] text-foreground leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-border rounded-[14px] p-10 text-center">
                  <div className="text-[32px] mb-2">💬</div>
                  <div className="text-[14px] font-extrabold mb-1">No reviews yet</div>
                  <div className="text-[12px] text-otj-text">No reviews were left for this project.</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4 order-2 md:order-none">
          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Project Info</div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-x-4">
              {[
                { label: 'Client', val: proj.clientName },
                { label: 'Company', val: proj.clientCompany },
                { label: 'Started', val: proj.startedDate },
                { label: 'Completed', val: proj.completedDate },
                { label: 'Type', val: proj.projectType },
                { label: 'Earned', val: proj.earned },
              ].map((f, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0 md:last:border-0">
                  <div className="text-[11px] text-otj-text">{f.label}</div>
                  <div className="text-[12px] font-bold">{f.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Phase Progress</div>
            {proj.phases.map(p => (
              <div key={p.num} className="flex items-center gap-2 mb-2 last:mb-0">
                <div className="text-[11px] font-bold text-otj-text w-3 shrink-0">{p.num}</div>
                <div className="flex-1 h-1.5 rounded-full bg-otj-light overflow-hidden">
                  <div className="h-full rounded-full bg-otj-green w-full" />
                </div>
                <div className="text-[10px] font-bold text-otj-green">✓</div>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-[14px] p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Payment Summary</div>
            <div className="flex items-center justify-between py-1.5">
              <div className="text-[11px] text-otj-text">Total Earned</div>
              <div className="text-[12px] font-extrabold text-otj-green">{proj.earned}</div>
            </div>
            {proj.paymentMilestones.map((m, i) => {
              const amount = numericPrice > 0 ? `${Math.round(numericPrice * m.percentage / 100).toLocaleString()} EGP` : '—';
              return (
                <div key={i} className="flex items-center justify-between py-1.5 border-t border-border">
                  <div className="text-[11px] text-otj-text">{m.label} ({m.percentage}%)</div>
                  <div className="text-[12px] font-bold text-otj-text">{amount}</div>
                </div>
              );
            })}
          </div>

          {proj.reviews.length > 0 && (
            <div className="bg-card border border-border rounded-[14px] p-4">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-3">Client Rating</div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < proj.reviews[0].rating ? 'fill-[hsl(var(--otj-yellow))] text-[hsl(var(--otj-yellow))]' : 'text-otj-light'} />
                  ))}
                </div>
                <span className="text-[13px] font-extrabold">{proj.reviews[0].rating}.0</span>
              </div>
              <div className="text-[11px] text-otj-text mt-1">by {proj.reviews[0].reviewerName}</div>
            </div>
          )}
        </div>
      </div>

      <Toast />
    </>
  );
};

export default CompletedProjectProfile;
