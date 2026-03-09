import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface BriefData {
  id: string;
  icon: string;
  name: string;
  clientName: string;
  clientCompany: string;
  projectType: string;
  budget: string;
  deliverables: string;
  date: string;
  tags: string[];
  time: string;
  moodAesthetic: string;
  usageRights: string;
}

export interface PhaseData {
  num: number;
  title: string;
  status: 'complete' | 'active' | 'locked';
  deadline?: string; // ISO date string
  tasks: { text: string; done: boolean; due: string }[];
}

export interface PaymentMilestone {
  label: string;
  percentage: number;
  status: 'pending' | 'paid' | 'held';
}

export interface PaymentMethod {
  type: 'instapay' | 'bank';
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  instapayHandle?: string;
}

export interface MeetingData {
  id: string;
  title: string;
  date: string; // ISO date
  time: string;
  type: 'meeting' | 'call' | 'shoot';
  projectId?: string;
  clientName?: string;
  location?: string;
}

export interface AttachmentData {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedAt: string;
  icon: string;
}

export interface ReviewData {
  id: string;
  projectId: string;
  projectName: string;
  reviewerName: string;
  targetName: string;
  reviewType: 'creative' | 'client'; // who is being reviewed
  rating: number;
  tags: string[];
  text: string;
  createdAt: string;
}

export interface ProjectData {
  id: string;
  icon: string;
  name: string;
  clientName: string;
  clientCompany: string;
  projectType: string;
  budget: string;
  deliverables: string;
  date: string;
  deadline: string;
  moodAesthetic: string;
  usageRights: string;
  status: 'proposal' | 'pending-deposit' | 'active' | 'complete';
  phases: PhaseData[];
  proposalDeliverables: string[];
  proposalPrice: string;
  paymentMilestones: PaymentMilestone[];
  paymentMethod?: PaymentMethod;
  escrow: { total: string; deposited: string; held: string; fee: string };
  timeline: { label: string; date: string; status: 'complete' | 'active' | 'upcoming' | 'locked' }[];
  createdAt: string;
  meetings: MeetingData[];
  attachments: AttachmentData[];
  reviews: ReviewData[];
}

export interface NotificationData {
  id: string;
  icon: string;
  bg: string;
  title: string;
  sub: string;
  time: string;
  unread: boolean;
  type: 'counter-accepted' | 'message' | 'payment' | 'booking' | 'brief';
  briefId?: string;
  projectId?: string;
}

export interface ClientReviewData {
  id: string;
  creativeAvatar: string;
  creativeName: string;
  rating: number;
  comment: string;
  projectName: string;
  createdAt: string;
}

export interface ClientData {
  id: string;
  type: 'individual' | 'company';
  name: string;
  avatar: string;
  company?: string;
  industry: string;
  location: string;
  bio: string;
  website?: string;
  teamSize?: string;
  joinedDate: string;
  projectsCompleted: number;
  
  avgResponseTime: string;
  paymentReliability: number; // 0-100
  verified: boolean;
  reviews: ClientReviewData[];
}

export type UserRole = 'client' | 'creative';

interface ProjectContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  pendingBriefs: BriefData[];
  activeProjects: ProjectData[];
  completedProjects: { icon: string; name: string; client: string; earned: string }[];
  acceptBrief: (briefId: string) => string;
  getBrief: (id: string) => BriefData | undefined;
  getProject: (id: string) => ProjectData | undefined;
  submitProposal: (projectId: string, phases: PhaseData[], deliverables: string[], price: string, milestones: PaymentMilestone[], paymentMethod: PaymentMethod) => void;
  updateProject: (projectId: string, updates: Partial<ProjectData>) => void;
  addMeeting: (projectId: string, meeting: Omit<MeetingData, 'id'>) => void;
  addAttachment: (projectId: string, attachment: Omit<AttachmentData, 'id'>) => void;
  removeAttachment: (projectId: string, attachmentId: string) => void;
  renameAttachment: (projectId: string, attachmentId: string, newName: string) => void;
  allMeetings: MeetingData[];
  completeProject: (projectId: string) => void;
  addReview: (projectId: string, review: Omit<ReviewData, 'id' | 'createdAt'>) => void;
  reviews: ReviewData[];
  notifications: NotificationData[];
  addNotification: (notif: Omit<NotificationData, 'id'>) => void;
  markAllRead: () => void;
  unreadCount: number;
  submitCounterOffer: (briefId: string, budget: string, clientName: string, briefName: string) => void;
  clients: ClientData[];
  getClient: (id: string) => ClientData | undefined;
  addClientReview: (clientId: string, review: Omit<ClientReviewData, 'id' | 'createdAt'>) => void;
}

const defaultBriefs: BriefData[] = [
  {
    id: 'brief-1',
    icon: '📸',
    name: 'Ramadan Campaign Shoot',
    clientName: 'Randa Hatem',
    clientCompany: 'Edita Group',
    projectType: 'Full Day Campaign Shoot',
    budget: '3,500 EGP',
    deliverables: '40 edited photos (20 product, 10 lifestyle, 10 BTS)',
    date: 'Mar 15',
    tags: ['Full Day', '3,500 EGP', 'Mar 15'],
    time: '3m ago',
    moodAesthetic: 'Clean, modern, high-contrast product photography with lifestyle elements',
    usageRights: 'Social media + print ads · 12 months',
  },
  {
    id: 'brief-2',
    icon: '📸',
    name: 'Product Launch Photography',
    clientName: 'Tarek Saad',
    clientCompany: 'Vodafone Egypt',
    projectType: '3-Day Event Photography',
    budget: 'Negotiable',
    deliverables: '120 shots minimum — event coverage, product close-ups, speaker portraits',
    date: 'Mar 22–24',
    tags: ['3 Days', 'Negotiable', 'Mar 22–24'],
    time: '1h ago',
    moodAesthetic: 'Corporate but energetic, brand-aligned colors, candid + posed mix',
    usageRights: 'All platforms · Unlimited',
  },
];

const defaultActiveProjects: ProjectData[] = [
  {
    id: 'proj-existing-1',
    icon: '📸', name: 'Edita Re-Branding',
    clientName: 'Randa Hatem', clientCompany: 'Edita Group',
    projectType: 'Full Day Campaign Shoot', budget: '3,500 EGP',
    deliverables: '40 edited photos', date: 'Mar 5', deadline: 'Mar 20',
    moodAesthetic: '', usageRights: '',
    status: 'active',
    proposalDeliverables: ['40 edited photos', '10 lifestyle shots', '10 BTS shots'],
    proposalPrice: '3,500 EGP',
    phases: [
      { num: 1, title: 'Pre-Production', status: 'complete', tasks: [
        { text: 'Confirm shoot location', done: true, due: 'Mar 5' },
        { text: 'Finalize mood board', done: true, due: 'Mar 7' },
        { text: 'Equipment checklist', done: true, due: 'Mar 8' },
      ]},
      { num: 2, title: 'Shoot Day', status: 'active', tasks: [
        { text: 'Product shots (20 items)', done: true, due: 'Mar 15' },
        { text: 'Lifestyle shots (10 setups)', done: false, due: 'Mar 15' },
        { text: 'Behind-the-scenes content', done: false, due: 'Mar 15' },
      ]},
      { num: 3, title: 'Editing & Delivery', status: 'locked', tasks: [
        { text: 'Color grade all selects', done: false, due: 'Mar 18' },
        { text: 'Retouch hero images', done: false, due: 'Mar 19' },
      ]},
      { num: 4, title: 'Final Delivery', status: 'locked', tasks: [
        { text: 'Upload final files', done: false, due: 'Mar 20' },
        { text: 'Client sign-off', done: false, due: 'Mar 20' },
      ]},
    ],
    paymentMilestones: [{ label: '50% Deposit', percentage: 50, status: 'paid' }, { label: '50% On Completion', percentage: 50, status: 'held' }],
    escrow: { total: '3,500 EGP', deposited: '1,750 EGP', held: '1,750 EGP', fee: '175 EGP' },
    timeline: [
      { label: 'Brief Created', date: 'Mar 5', status: 'complete' },
      { label: 'Brief Approved', date: 'Mar 10', status: 'complete' },
      { label: 'Phase 1 Complete', date: 'Mar 12', status: 'complete' },
      { label: 'Phase 2 Started', date: 'Mar 13', status: 'active' },
    ],
    createdAt: 'March 5, 2026',
    meetings: [
      { id: 'meet-1', title: 'Shoot Day Briefing', date: '2026-03-14', time: '10:00 AM', type: 'meeting', projectId: 'proj-existing-1', clientName: 'Randa Hatem', location: 'Studio A' },
    ],
    attachments: [
      { id: 'att-1', name: 'Mood Board v1.jpg', size: '2.4 MB', type: 'image/jpeg', url: '', uploadedAt: 'Mar 5', icon: '🌆' },
      { id: 'att-2', name: 'Shot List.pdf', size: '340 KB', type: 'application/pdf', url: '', uploadedAt: 'Mar 6', icon: '📄' },
    ],
    reviews: [],
  },
  {
    id: 'proj-existing-2',
    icon: '🎥', name: 'CIB Campaign Assets',
    clientName: 'Ahmed Karim', clientCompany: 'CIB',
    projectType: 'Campaign Video', budget: '5,200 EGP',
    deliverables: 'Campaign video assets', date: 'Mar 10', deadline: 'Mar 25',
    moodAesthetic: '', usageRights: '',
    status: 'active',
    proposalDeliverables: ['Campaign video assets'],
    proposalPrice: '5,200 EGP',
    phases: [
      { num: 1, title: 'Pre-Production', status: 'complete', tasks: [] },
      { num: 2, title: 'Production', status: 'complete', tasks: [] },
      { num: 3, title: 'Post-Production', status: 'active', tasks: [
        { text: 'Edit rough cut', done: false, due: 'Mar 22' },
      ]},
      { num: 4, title: 'Final Delivery', status: 'locked', tasks: [] },
    ],
    paymentMilestones: [{ label: '50% Deposit', percentage: 50, status: 'paid' }, { label: '50% On Completion', percentage: 50, status: 'held' }],
    escrow: { total: '5,200 EGP', deposited: '2,600 EGP', held: '2,600 EGP', fee: '260 EGP' },
    timeline: [],
    createdAt: 'March 10, 2026',
    meetings: [
      { id: 'meet-2', title: 'Rough Cut Review Call', date: '2026-03-21', time: '2:00 PM', type: 'call', projectId: 'proj-existing-2', clientName: 'Ahmed Karim' },
    ],
    attachments: [],
    reviews: [],
  },
  {
    id: 'proj-existing-3',
    icon: '📸', name: 'Vodafone Brand Refresh',
    clientName: 'Tarek Saad', clientCompany: 'Vodafone',
    projectType: 'Brand Photography', budget: '4,800 EGP',
    deliverables: 'Brand refresh photos', date: 'Mar 20', deadline: 'Apr 5',
    moodAesthetic: '', usageRights: '',
    status: 'active',
    proposalDeliverables: ['Brand refresh photos'],
    proposalPrice: '4,800 EGP',
    phases: [
      { num: 1, title: 'Pre-Production', status: 'active', tasks: [
        { text: 'Creative brief review', done: false, due: 'Mar 22' },
      ]},
      { num: 2, title: 'Shoot Day', status: 'locked', tasks: [] },
      { num: 3, title: 'Editing', status: 'locked', tasks: [] },
      { num: 4, title: 'Final Delivery', status: 'locked', tasks: [] },
    ],
    paymentMilestones: [{ label: '50% Deposit', percentage: 50, status: 'paid' }, { label: '50% On Completion', percentage: 50, status: 'held' }],
    escrow: { total: '4,800 EGP', deposited: '2,400 EGP', held: '2,400 EGP', fee: '240 EGP' },
    timeline: [],
    createdAt: 'March 20, 2026',
    meetings: [],
    attachments: [],
    reviews: [],
  },
];

const defaultCompleted = [
  { icon: '📸', name: 'Pepsi Ramadan Campaign', client: 'Completed Feb 10', earned: '3,500 EGP' },
  { icon: '🎥', name: 'OPPO Brand Launch Video', client: 'Completed Feb 2', earned: '5,200 EGP' },
  { icon: '👗', name: 'Cairo Fashion Week SS26', client: 'Completed Jan 25', earned: '6,000 EGP' },
  { icon: '📸', name: 'Edita Product Shoot Q4', client: 'Completed Jan 14', earned: '2,800 EGP' },
  { icon: '📱', name: 'Juhayna Social Campaign', client: 'Completed Jan 7', earned: '4,100 EGP' },
];

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProjects = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
};

const defaultNotifications: NotificationData[] = [
  { id: 'notif-1', icon: '💬', bg: 'bg-muted', title: 'Ahmed Karim sent you a message', sub: 'Can we schedule a call for Thursday?', time: '12m ago', unread: true, type: 'message' },
  { id: 'notif-2', icon: '💳', bg: 'bg-[hsl(var(--otj-green-bg))]', title: 'Payment released — 3,325 EGP', sub: 'Edita Campaign · Phase 2 approved by client', time: '2h ago', unread: true, type: 'payment' },
  { id: 'notif-3', icon: '📅', bg: 'bg-[hsl(var(--otj-blue-bg))]', title: 'Booking confirmed · March 15', sub: 'Edita Group campaign — added to your calendar', time: 'Yesterday', unread: false, type: 'booking' },
];

const defaultClients: ClientData[] = [
  {
    id: 'client-randa',
    type: 'company',
    name: 'Randa Hatem',
    avatar: '👩‍💼',
    company: 'Edita Group',
    industry: 'FMCG / Food & Beverage',
    location: 'Cairo, Egypt',
    bio: 'Senior Marketing Manager at Edita Group, overseeing visual content for seasonal campaigns across multiple brands including Molto, Bake Rolz, and Tiger. Passionate about bold, high-quality creative work that connects with young audiences.',
    website: 'edita.com.eg',
    teamSize: '50+',
    joinedDate: 'Jan 2024',
    projectsCompleted: 12,
    
    avgResponseTime: '< 2 hours',
    paymentReliability: 96,
    verified: true,
    reviews: [
      { id: 'cr-1', creativeAvatar: '🎥', creativeName: 'Omar Hassan', rating: 5, comment: 'Randa is an amazing client to work with. Clear briefs, fast payments, and gives great creative freedom. Highly recommend!', projectName: 'Ramadan Campaign 2025', createdAt: 'Feb 2025' },
      { id: 'cr-2', creativeAvatar: '🎨', creativeName: 'Sara Ahmed', rating: 4, comment: 'Professional and responsive. Sometimes tight deadlines but always fair on budget. Would work with again.', projectName: 'Bake Rolz Rebrand', createdAt: 'Jan 2025' },
    ],
  },
  {
    id: 'client-ahmed',
    type: 'individual',
    name: 'Ahmed Karim',
    avatar: '👨‍💼',
    industry: 'Tech / Startups',
    location: 'Cairo, Egypt',
    bio: 'Founder of a fast-growing fintech startup. Looking for creatives to help build our brand identity and marketing campaigns. Values speed and quality.',
    joinedDate: 'Mar 2024',
    projectsCompleted: 5,
    
    avgResponseTime: '< 4 hours',
    paymentReliability: 88,
    verified: true,
    reviews: [
      { id: 'cr-3', creativeAvatar: '📸', creativeName: 'Nour Makram', rating: 4, comment: 'Good communicator and pays on time. Briefs could be more detailed but overall a great experience.', projectName: 'Product Shoot', createdAt: 'Dec 2024' },
    ],
  },
  {
    id: 'client-sara',
    type: 'company',
    name: 'Sara M.',
    avatar: '🎨',
    company: 'Studio Noir',
    industry: 'Fashion / Retail',
    location: 'Alexandria, Egypt',
    bio: 'Creative Director at Studio Noir, a luxury fashion brand. Looking for photographers and videographers for seasonal lookbooks and social content.',
    website: 'studionoir.eg',
    teamSize: '10-25',
    joinedDate: 'Jun 2024',
    projectsCompleted: 3,
    
    avgResponseTime: '< 1 hour',
    paymentReliability: 100,
    verified: true,
    reviews: [],
  },
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('creative');
  const [pendingBriefs, setPendingBriefs] = useState<BriefData[]>(defaultBriefs);
  const [activeProjects, setActiveProjects] = useState<ProjectData[]>(defaultActiveProjects);
  const [completedProjects] = useState(defaultCompleted);
  const [notifications, setNotifications] = useState<NotificationData[]>(defaultNotifications);
  const [clients, setClients] = useState<ClientData[]>(defaultClients);

  const acceptBrief = useCallback((briefId: string): string => {
    const brief = pendingBriefs.find(b => b.id === briefId);
    if (!brief) return '';

    const projectId = `proj-${Date.now()}`;
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const newProject: ProjectData = {
      id: projectId,
      icon: brief.icon,
      name: brief.name,
      clientName: brief.clientName,
      clientCompany: brief.clientCompany,
      projectType: brief.projectType,
      budget: brief.budget,
      deliverables: brief.deliverables,
      date: dateStr,
      deadline: brief.date,
      moodAesthetic: brief.moodAesthetic,
      usageRights: brief.usageRights,
      status: 'proposal',
      phases: [],
      proposalDeliverables: [],
      proposalPrice: brief.budget,
      paymentMilestones: [],
      escrow: {
        total: brief.budget,
        deposited: '0 EGP',
        held: '0 EGP',
        fee: 'TBD',
      },
      timeline: [
        { label: 'Brief Accepted', date: dateStr, status: 'complete' },
        { label: 'Proposal in Progress', date: dateStr, status: 'active' },
      ],
      createdAt: dateStr,
      meetings: [],
      attachments: [],
      reviews: [],
    };

    setPendingBriefs(prev => prev.filter(b => b.id !== briefId));
    setActiveProjects(prev => [newProject, ...prev]);
    return projectId;
  }, [pendingBriefs]);

  const submitProposal = useCallback((projectId: string, phases: PhaseData[], deliverables: string[], price: string, milestones: PaymentMilestone[], paymentMethod: PaymentMethod) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));
      const fee = isNaN(numericPrice) ? 'TBD' : `${Math.round(numericPrice * 0.05)} EGP`;
      const formattedPrice = isNaN(numericPrice) ? price : `${numericPrice.toLocaleString()} EGP`;
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const firstMilestoneLabel = milestones.length > 0 ? milestones[0].label : 'First Payment';

      return {
        ...p,
        status: 'pending-deposit' as const,
        phases: phases.map((ph, i) => ({
          ...ph,
          status: (i === 0 ? 'active' : 'locked') as 'active' | 'locked',
        })),
        proposalDeliverables: deliverables,
        proposalPrice: formattedPrice,
        budget: formattedPrice,
        paymentMilestones: milestones,
        paymentMethod,
        escrow: {
          total: formattedPrice,
          deposited: '0 EGP',
          held: '0 EGP',
          fee,
        },
        timeline: [
          ...p.timeline.map(t => ({ ...t, status: 'complete' as const })),
          { label: 'Proposal Sent to Client', date: today, status: 'complete' as const },
          { label: 'Awaiting Client Approval', date: today, status: 'active' as const },
          { label: `Awaiting ${firstMilestoneLabel}`, date: '', status: 'locked' as const },
          ...phases.map(ph => ({ label: `Phase ${ph.num} — ${ph.title}`, date: '', status: 'locked' as const })),
        ],
      };
    }));
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<ProjectData>) => {
    setActiveProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
  }, []);

  const addMeeting = useCallback((projectId: string, meeting: Omit<MeetingData, 'id'>) => {
    const newMeeting: MeetingData = { ...meeting, id: `meet-${Date.now()}` };
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        meetings: [...p.meetings, newMeeting],
        timeline: [...p.timeline, { label: `📅 ${meeting.title}`, date: meeting.date, status: 'upcoming' as const }],
      };
    }));
  }, []);

  const allMeetings = useMemo(() => {
    return activeProjects.flatMap(p => p.meetings.map(m => ({ ...m, projectId: p.id })));
  }, [activeProjects]);

  const addAttachment = useCallback((projectId: string, attachment: Omit<AttachmentData, 'id'>) => {
    const newAtt: AttachmentData = { ...attachment, id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, attachments: [...p.attachments, newAtt] };
    }));
  }, []);

  const removeAttachment = useCallback((projectId: string, attachmentId: string) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, attachments: p.attachments.filter(a => a.id !== attachmentId) };
    }));
  }, []);

  const renameAttachment = useCallback((projectId: string, attachmentId: string, newName: string) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, attachments: p.attachments.map(a => a.id === attachmentId ? { ...a, name: newName } : a) };
    }));
  }, []);

  const completeProject = useCallback((projectId: string) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return {
        ...p,
        status: 'complete' as const,
        phases: p.phases.map(ph => ({ ...ph, status: 'complete' as const, tasks: ph.tasks.map(t => ({ ...t, done: true })) })),
        timeline: [...p.timeline.map(t => ({ ...t, status: 'complete' as const })), { label: 'Project Completed', date: today, status: 'complete' as const }],
      };
    }));
  }, []);

  const [allReviews, setAllReviews] = useState<ReviewData[]>([]);

  const addReview = useCallback((projectId: string, review: Omit<ReviewData, 'id' | 'createdAt'>) => {
    const newReview: ReviewData = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    setAllReviews(prev => [...prev, newReview]);
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, reviews: [...p.reviews, newReview] };
    }));
  }, []);

  const getProject = useCallback((id: string): ProjectData | undefined => {
    return activeProjects.find(p => p.id === id);
  }, [activeProjects]);

  const getBrief = useCallback((id: string): BriefData | undefined => {
    return pendingBriefs.find(b => b.id === id);
  }, [pendingBriefs]);

  const addNotification = useCallback((notif: Omit<NotificationData, 'id'>) => {
    const newNotif: NotificationData = { ...notif, id: `notif-${Date.now()}` };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => n.unread).length, [notifications]);

  const submitCounterOffer = useCallback((briefId: string, budget: string, clientName: string, briefName: string) => {
    // Simulate client accepting the counter offer after 4 seconds
    setTimeout(() => {
      const acceptNotif: Omit<NotificationData, 'id'> = {
        icon: '🎉',
        bg: 'bg-[hsl(var(--otj-green-bg))]',
        title: `Counter offer accepted!`,
        sub: `${clientName} accepted your counter for ${briefName} at ${budget}`,
        time: 'Just now',
        unread: true,
        type: 'counter-accepted',
        briefId,
      };
      setNotifications(prev => [{ ...acceptNotif, id: `notif-${Date.now()}` }, ...prev]);
    }, 4000);
  }, []);

  const getClient = useCallback((id: string): ClientData | undefined => {
    return clients.find(c => c.id === id);
  }, [clients]);

  const addClientReview = useCallback((clientId: string, review: Omit<ClientReviewData, 'id' | 'createdAt'>) => {
    const newReview: ClientReviewData = {
      ...review,
      id: `cr-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return { ...c, reviews: [...c.reviews, newReview] };
    }));
  }, []);

  return (
    <ProjectContext.Provider value={{ userRole, setUserRole, pendingBriefs, activeProjects, completedProjects, acceptBrief, getBrief, getProject, submitProposal, updateProject, addMeeting, addAttachment, removeAttachment, renameAttachment, allMeetings, completeProject, addReview, reviews: allReviews, notifications, addNotification, markAllRead, unreadCount, submitCounterOffer, clients, getClient, addClientReview }}>
      {children}
    </ProjectContext.Provider>
  );
};
