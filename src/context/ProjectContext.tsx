import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type ProjectRole = 'as-creative' | 'as-client';

export interface BriefData {
  id: string;
  icon: string;
  name: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  projectType: string;
  budget: string;
  deliverables: string;
  date: string;
  location?: string;
  description?: string;
  tags: string[];
  time: string;
  moodAesthetic: string;
  usageRights: string;
  surveyAnswers?: string[];
  myRole?: ProjectRole;
}

export interface PhaseData {
  num: number;
  title: string;
  status: 'complete' | 'active' | 'locked';
  deadline?: string; // ISO date string
  /** Paragraph describing what this phase covers — preferred over `tasks` for display. */
  description?: string;
  /** Creative has marked this phase as ready for client review/approval. */
  readyForReview?: boolean;
  /** Legacy task checklist. Kept for backward compatibility but no longer rendered in phase views. */
  tasks: { text: string; done: boolean; due: string }[];
}

export interface PaymentMilestone {
  label: string;
  percentage: number;
  status: 'pending' | 'paid' | 'held' | 'proof-submitted';
  proofUrl?: string;
  proofName?: string;
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
  clientEmail: string;
  clientPhone: string;
  projectType: string;
  budget: string;
  deliverables: string;
  date: string;
  deadline: string;
  location?: string;
  description?: string;
  tags?: string[];
  moodAesthetic: string;
  usageRights: string;
  surveyAnswers?: string[];
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
  myRole?: ProjectRole;
}

export interface CompletedProjectData {
  id: string;
  icon: string;
  name: string;
  client: string;
  earned: string;
  creativeName?: string;
  creativeId?: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  projectType: string;
  location?: string;
  description?: string;
  tags?: string[];
  moodAesthetic: string;
  deliverables: string;
  proposalDeliverables: string[];
  phases: PhaseData[];
  paymentMilestones: PaymentMilestone[];
  paymentMethod?: PaymentMethod;
  completedDate: string;
  startedDate: string;
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
  email: string;
  phone: string;
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
  coverGrad?: string; // Tailwind gradient classes for profile hero
}

export type UserRole = 'client' | 'creative';

interface ProjectContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  pendingBriefs: BriefData[];
  activeProjects: ProjectData[];
  completedProjects: CompletedProjectData[];
  getCompletedProject: (id: string) => CompletedProjectData | undefined;
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
  updateClient: (clientId: string, updates: Partial<ClientData>) => void;
  addClientReview: (clientId: string, review: Omit<ClientReviewData, 'id' | 'createdAt'>) => void;
  approvePhase: (projectId: string, phaseNum: number) => void;
  releasePayment: (projectId: string, milestoneIndex: number) => void;
  submitPaymentProof: (projectId: string, milestoneIndex: number, proofUrl: string, proofName: string) => void;
  confirmPaymentReceipt: (projectId: string, milestoneIndex: number) => void;
  acceptProposal: (projectId: string) => void;
  rejectProposal: (projectId: string) => void;
  toggleTask: (projectId: string, phaseNum: number, taskIndex: number) => void;
  setPhaseReady: (projectId: string, phaseNum: number, ready: boolean) => void;
}

const defaultBriefs: BriefData[] = [
  {
    id: 'brief-1',
    icon: '📸',
    name: 'Ramadan Campaign Shoot',
    clientName: 'Randa Hatem',
    clientCompany: 'Edita Group',
    clientEmail: 'randa.hatem@editagroup.com',
    clientPhone: '+20 100 123 4567',
    projectType: 'Full Day Campaign Shoot',
    budget: '3,500 EGP',
    deliverables: '40 edited photos (20 product, 10 lifestyle, 10 BTS)',
    date: 'Mar 15',
    location: 'Cairo, Egypt',
    description: 'We are launching a Ramadan-themed campaign for our seasonal snack range. Looking for a photographer who can capture both studio product shots and lifestyle moments with models. The shoot will take place over one full day at our Cairo studio.',
    tags: ['Full Day', '3,500 EGP', 'Mar 15'],
    time: '3m ago',
    moodAesthetic: 'Clean, modern, high-contrast product photography with lifestyle elements',
    usageRights: 'Social media + print ads · 12 months',
    surveyAnswers: [
      'Ramadan promotional campaign for Edita Group\'s seasonal snack product range — goal is to drive sales and brand awareness across Egypt.',
      'Clean, modern, high-contrast look. Think editorial product photography with warm Ramadan tones — golden light, soft shadows, celebratory mood.',
      'Edita snack products (BiscoMisr, Molto) alongside lifestyle scenes with 2–3 models in a home setting.',
      '40 final edited photos: 20 hero product shots, 10 lifestyle scenes, 10 BTS behind-the-scenes.',
      'Instagram, Facebook, out-of-home print ads, and in-store displays. Usage rights needed for 12 months.',
    ],
    myRole: 'as-creative',
  },
  {
    id: 'brief-2',
    icon: '📸',
    name: 'Product Launch Photography',
    clientName: 'Tarek Saad',
    clientCompany: 'Vodafone Egypt',
    clientEmail: 'tarek.saad@vodafone.eg',
    clientPhone: '+20 101 987 6543',
    projectType: '3-Day Event Photography',
    budget: 'Negotiable',
    deliverables: '120 shots minimum — event coverage, product close-ups, speaker portraits',
    date: 'Mar 22–24',
    location: 'Cairo, Egypt',
    description: 'Vodafone Egypt is launching a new product line over a 3-day press and consumer event. We need a photographer who can handle both the formal press conference moments and the energetic consumer activation areas.',
    tags: ['3 Days', 'Negotiable', 'Mar 22–24'],
    time: '1h ago',
    moodAesthetic: 'Corporate but energetic, brand-aligned colors, candid + posed mix',
    usageRights: 'All platforms · Unlimited',
    surveyAnswers: [
      'Vodafone Egypt product launch event — 3 days covering press day, consumer activation, and influencer evening. Goal is full PR and media coverage.',
      'Corporate but energetic. Brand-aligned reds and whites. Mix of candid candid energy shots and polished posed portraits.',
      'New Vodafone devices and accessories, keynote speakers on stage, brand activation booths, and event attendees.',
      '120 shots minimum — 40 per day covering event keynote, product close-ups, speaker portraits, and crowd energy.',
      'All digital and print platforms — PR releases, social media, internal reports, and Vodafone\'s global brand library. Unlimited usage.',
    ],
    myRole: 'as-creative',
  },
  {
    id: 'brief-3',
    icon: '🎨',
    name: 'Brand Identity Design',
    clientName: 'Omar El-Sherif',
    clientCompany: 'Photographer',
    clientEmail: 'omar.elsherif@gmail.com',
    clientPhone: '+20 109 876 5432',
    projectType: 'Logo & Brand Guidelines',
    budget: '4,000 EGP',
    deliverables: 'Logo, brand guidelines, social media templates',
    date: 'Mar 28',
    location: 'Cairo, Egypt',
    description: 'I am a portrait and fashion photographer based in Cairo and need a complete brand identity that reflects my work style. I want something that stands out and feels premium but approachable.',
    tags: ['Branding', '4,000 EGP', 'Mar 28'],
    time: '25m ago',
    moodAesthetic: 'Minimalist, contemporary, bold typography',
    usageRights: 'Full ownership transfer',
    surveyAnswers: [
      'Complete brand identity for my photography business — Omar El-Sherif Photography. Goal is to attract high-end clients in fashion and portrait segments.',
      'Minimalist, contemporary, bold serif or modern sans-serif typography. References: Misan Harriman, Paolo Roversi. Dark or neutral palette.',
      'My name as the primary brand mark, supported by a secondary logomark. All brand assets for a photography business.',
      'Primary logo, secondary logomark, brand guidelines document (10–15 pages), and 5 customizable social media post templates.',
      'Full ownership and usage rights transferred. Will be used across website, social media, print, and all business materials.',
    ],
    myRole: 'as-client',
  },
];

const defaultActiveProjects: ProjectData[] = [
  {
    id: 'proj-existing-1',
    icon: '📸', name: 'Edita Re-Branding',
    clientName: 'Randa Hatem', clientCompany: 'Edita Group',
    clientEmail: 'randa.hatem@editagroup.com', clientPhone: '+20 100 123 4567',
    projectType: 'Full Day Campaign Shoot', budget: '3,500 EGP',
    deliverables: '40 edited photos (20 product, 10 lifestyle, 10 BTS)',
    date: 'Mar 5', deadline: 'Mar 20',
    location: 'Cairo, Egypt',
    description: 'A full-day campaign shoot for Edita Group\'s summer product line. The focus is on creating a cohesive visual identity across product and lifestyle imagery that can be used across digital and print channels.',
    tags: ['Photography', 'Campaign', 'Product', 'Lifestyle'],
    moodAesthetic: 'Clean, modern, high-contrast product photography with bright natural light and minimal props. Think premium FMCG.',
    usageRights: 'Social media + print ads · 12 months',
    surveyAnswers: [
      'Summer product launch campaign for Edita\'s new snack line — targeting young adults on social media.',
      'Clean, modern, high-contrast look with bright natural light and minimal props. Think premium FMCG.',
      '12 SKUs across 3 product variants — packaged snack products, both individual and multipack formats.',
      '40 final edited images: 20 product hero shots, 10 lifestyle setups, 10 BTS stills.',
      'Instagram feed, Facebook ads, and print POS materials across Egypt.',
    ],
    status: 'active',
    proposalDeliverables: ['40 edited photos', '10 lifestyle shots', '10 BTS shots'],
    proposalPrice: '3,500 EGP',
    phases: [
      { num: 1, title: 'Pre-Production', status: 'complete', description: 'Locked in the shoot location, finalised the mood board with the client, and prepped the full equipment checklist so the team can hit the ground running on shoot day.', tasks: [
        { text: 'Confirm shoot location', done: true, due: 'Mar 5' },
        { text: 'Finalize mood board', done: true, due: 'Mar 7' },
        { text: 'Equipment checklist', done: true, due: 'Mar 8' },
      ]},
      { num: 2, title: 'Shoot Day', status: 'active', description: 'Capturing the full set on location — 20 product hero shots in studio lighting, 10 lifestyle setups with talent, plus behind-the-scenes content for the client\'s social channels.', tasks: [
        { text: 'Product shots (20 items)', done: true, due: 'Mar 15' },
        { text: 'Lifestyle shots (10 setups)', done: false, due: 'Mar 15' },
        { text: 'Behind-the-scenes content', done: false, due: 'Mar 15' },
      ]},
      { num: 3, title: 'Editing & Delivery', status: 'locked', description: 'Color grading every selected frame to match the campaign look, then retouching the hero images for print and digital use.', tasks: [
        { text: 'Color grade all selects', done: false, due: 'Mar 18' },
        { text: 'Retouch hero images', done: false, due: 'Mar 19' },
      ]},
      { num: 4, title: 'Final Delivery', status: 'locked', description: 'Uploading the final files to the shared drive and walking the client through the gallery for sign-off.', tasks: [
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
    myRole: 'as-creative',
  },
  {
    id: 'proj-existing-2',
    icon: '🎥', name: 'CIB Campaign Assets',
    clientName: 'Ahmed Karim', clientCompany: 'CIB',
    clientEmail: 'ahmed.karim@cib.com.eg', clientPhone: '+20 102 555 7890',
    projectType: 'Campaign Video', budget: '5,200 EGP',
    deliverables: '1 hero campaign video (60s), 3 cut-downs (30s, 15s, 9s), 5 static key visuals',
    date: 'Mar 10', deadline: 'Mar 25',
    location: 'Cairo, Egypt',
    description: 'CIB needs a full campaign video suite for their upcoming financial product launch. The deliverables include a hero spot and platform-optimised cut-downs for TV, digital, and social media.',
    tags: ['Video', 'Campaign', 'Finance', 'Social Media'],
    moodAesthetic: 'Corporate but human — warm, trustworthy tones with motion graphics overlays. Think premium banking but approachable.',
    usageRights: 'All platforms · TV + Digital · Unlimited',
    surveyAnswers: [
      'Campaign launch for CIB\'s new digital banking product — goal is to drive app downloads and increase brand trust among 25–40 year olds.',
      'Corporate but warm and human. Premium feel with motion graphics. Reference: CIB\'s existing brand palette — navy, white, gold accents.',
      'CIB branding, app UI screens, diverse talent (professionals aged 25–45), and urban Cairo lifestyle settings.',
      '1 hero video (60s), 3 cut-downs (30s/15s/9s for social), and 5 static key visuals adapted from video frames.',
      'TV broadcast, YouTube pre-roll, Instagram & TikTok ads, digital out-of-home screens, and internal communications.',
    ],
    status: 'active',
    proposalDeliverables: ['Campaign video assets'],
    proposalPrice: '5,200 EGP',
    phases: [
      { num: 1, title: 'Pre-Production', status: 'complete', description: 'Aligned with the CIB marketing team on creative direction, locked the storyboard, cast diverse on-camera talent, and scouted urban Cairo locations for the campaign shoot.', tasks: [] },
      { num: 2, title: 'Production', status: 'complete', description: 'Two-day production across three locations capturing the hero spot footage, B-roll for the cut-downs, and key visual stills.', tasks: [] },
      { num: 3, title: 'Post-Production', status: 'active', description: 'Editing the rough cut of the 60s hero film, layering in motion graphics, and preparing the platform-optimised cut-downs for client review.', tasks: [
        { text: 'Edit rough cut', done: false, due: 'Mar 22' },
      ]},
      { num: 4, title: 'Final Delivery', status: 'locked', description: 'Final color grade, sound mix, master exports for TV and digital, and handoff of all source files to CIB.', tasks: [] },
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
    myRole: 'as-creative',
  },
  {
    id: 'proj-existing-3',
    icon: '📸', name: 'Vodafone Brand Refresh',
    clientName: 'Tarek Saad', clientCompany: 'Vodafone',
    clientEmail: 'tarek.saad@vodafone.eg', clientPhone: '+20 101 987 6543',
    projectType: 'Brand Photography', budget: '4,800 EGP',
    deliverables: '60 brand photos: team portraits, office environment, product lifestyle',
    date: 'Mar 20', deadline: 'Apr 5',
    location: 'Cairo, Egypt',
    description: 'Vodafone Egypt is refreshing its brand imagery for the upcoming year. We need a photographer to capture authentic, modern portraits of our team alongside energetic workspace and product-in-use lifestyle photography.',
    tags: ['Photography', 'Brand', 'Corporate', 'Lifestyle'],
    moodAesthetic: 'Bold, energetic, human-centered. Vodafone red accents, bright modern office spaces, diverse talent aged 20–35.',
    usageRights: 'All platforms · Internal + external · 24 months',
    surveyAnswers: [
      'Brand refresh for Vodafone Egypt — new visual identity imagery for website, social media, and internal comms for 2026.',
      'Bold and human. Vodafone red accents throughout. Modern, energetic, diverse — capture real moments not staged poses.',
      'Vodafone Egypt staff (20–35), office and meeting spaces, Vodafone devices and accessories in real-use scenarios.',
      '60 final edited photos: 20 team portraits, 20 workspace environment shots, 20 product lifestyle images.',
      'Corporate website refresh, LinkedIn, Instagram, internal presentations, and print materials for retail stores across Egypt.',
    ],
    status: 'active',
    proposalDeliverables: ['Brand refresh photos'],
    proposalPrice: '4,800 EGP',
    phases: [
      { num: 1, title: 'Pre-Production', status: 'active', description: 'Reviewing the brand brief with Vodafone, mapping shot lists across team portraits, workspace, and product lifestyle, and casting internal talent for authentic on-camera moments.', tasks: [
        { text: 'Creative brief review', done: false, due: 'Mar 22' },
      ]},
      { num: 2, title: 'Shoot Day', status: 'locked', description: 'Multi-day on-site shoot across Vodafone\'s Cairo HQ — capturing 20 portraits, 20 environment shots, and 20 product-in-use lifestyle frames with Vodafone red threaded throughout.', tasks: [] },
      { num: 3, title: 'Editing', status: 'locked', description: 'Selecting the strongest 60 frames, retouching portraits, and color-grading the full set to match Vodafone\'s refreshed brand palette.', tasks: [] },
      { num: 4, title: 'Final Delivery', status: 'locked', description: 'Packaging the final assets in web, social, and print resolutions and walking the marketing team through usage guidelines.', tasks: [] },
    ],
    paymentMilestones: [{ label: '50% Deposit', percentage: 50, status: 'paid' }, { label: '50% On Completion', percentage: 50, status: 'held' }],
    escrow: { total: '4,800 EGP', deposited: '2,400 EGP', held: '2,400 EGP', fee: '240 EGP' },
    timeline: [],
    createdAt: 'March 20, 2026',
    meetings: [],
    attachments: [],
    reviews: [],
    myRole: 'as-creative',
  },
  {
    id: 'proj-booked-1',
    icon: '🎨', name: 'My Portfolio Redesign',
    clientName: 'Yara Mansour', clientCompany: 'Freelance',
    clientEmail: 'yara.mansour@gmail.com', clientPhone: '+20 112 345 6789',
    projectType: 'UI/UX Design', budget: '6,000 EGP',
    deliverables: 'Full portfolio website redesign — desktop + mobile, up to 8 pages, design handoff file',
    date: 'Mar 8', deadline: 'Apr 1',
    location: 'Cairo, Egypt',
    description: 'Yara is a fashion and portrait photographer looking to redesign her online portfolio. She needs a clean, editorial-style website that showcases her work and converts visitors into clients.',
    tags: ['UI/UX', 'Design', 'Portfolio', 'Web'],
    moodAesthetic: 'Minimal editorial — large imagery, generous whitespace, refined typography. References: Tim Walker, Petra Collins portfolio sites.',
    usageRights: 'Full ownership transfer to client',
    surveyAnswers: [
      'Redesign my photography portfolio website to attract high-end fashion and portrait clients in Cairo and internationally.',
      'Minimal editorial — think luxury fashion magazine online. Large full-bleed images, minimal text, elegant serif typography, mostly black and white with occasional color pops.',
      'My photography portfolio — fashion, portrait, and editorial work. Approximately 80 images across 5 gallery series.',
      'Full website design: home, about, portfolio galleries (x3), services/rates page, contact — desktop and mobile responsive. Plus Figma handoff file.',
      'Primary use is my public website (yaramsour.com). Will also share on Instagram bio and LinkedIn. No print usage needed.',
    ],
    status: 'active',
    proposalDeliverables: ['Portfolio website redesign', 'Mobile responsive design'],
    proposalPrice: '6,000 EGP',
    phases: [
      { num: 1, title: 'Discovery', status: 'complete', description: 'Audited the existing portfolio site, interviewed Yara about her ideal clients, and defined the editorial direction for the redesign.', tasks: [
        { text: 'Review current portfolio', done: true, due: 'Mar 10' },
      ]},
      { num: 2, title: 'Design', status: 'active', description: 'Designing the full website in Figma — homepage, three gallery series, services page, and contact — with a minimal editorial layout system and refined typography.', tasks: [
        { text: 'Wireframes approval', done: false, due: 'Mar 20' },
      ]},
      { num: 3, title: 'Development', status: 'locked', description: 'Building out the responsive site, integrating the galleries, and prepping the Figma handoff file with components and design tokens.', tasks: [] },
    ],
    paymentMilestones: [{ label: '50% Deposit', percentage: 50, status: 'paid' }, { label: '50% On Completion', percentage: 50, status: 'held' }],
    escrow: { total: '6,000 EGP', deposited: '3,000 EGP', held: '3,000 EGP', fee: '300 EGP' },
    timeline: [],
    createdAt: 'March 8, 2026',
    meetings: [],
    attachments: [],
    reviews: [],
    myRole: 'as-client',
  },
];

const defaultCompleted: CompletedProjectData[] = [
  {
    id: 'completed-1',
    icon: '📸', name: 'Pepsi Ramadan Campaign', client: 'Completed Feb 10', earned: '3,500 EGP', creativeName: 'Omar Hassan', creativeId: 'omar-hassan',
    clientName: 'Randa Hatem', clientCompany: 'Edita Group', clientEmail: 'randa.hatem@editagroup.com', clientPhone: '+20 100 123 4567',
    projectType: 'Full Day Campaign Shoot', location: 'Cairo, Egypt',
    description: 'A full-day Ramadan campaign shoot for Pepsi featuring lifestyle and product imagery for social and digital channels.',
    tags: ['Photography', 'Campaign', 'Lifestyle'],
    moodAesthetic: 'Warm, festive Ramadan tones with rich golden light and communal dining setups.',
    deliverables: '30 edited photos (15 product, 10 lifestyle, 5 BTS)',
    proposalDeliverables: ['15 product hero shots', '10 lifestyle setups', '5 BTS stills', 'Final Lightroom presets'],
    phases: [
      { num: 1, title: 'Pre-Production', status: 'complete', description: 'Finalised the Ramadan mood board with the Edita team and scouted the location to lock in the festive set design ahead of the shoot.', tasks: [{ text: 'Mood board finalization', done: true, due: 'Jan 20' }, { text: 'Location scout', done: true, due: 'Jan 22' }] },
      { num: 2, title: 'Shoot Day', status: 'complete', description: 'Captured the full Pepsi Ramadan set in one day — product hero shots and warm communal lifestyle setups featuring the campaign talent.', tasks: [{ text: 'Product shots', done: true, due: 'Jan 28' }, { text: 'Lifestyle setups', done: true, due: 'Jan 28' }] },
      { num: 3, title: 'Post-Production', status: 'complete', description: 'Color graded all selects to match the festive Ramadan palette and retouched the hero images for both digital and print use.', tasks: [{ text: 'Color grading', done: true, due: 'Feb 5' }, { text: 'Retouching', done: true, due: 'Feb 7' }] },
      { num: 4, title: 'Final Delivery', status: 'complete', description: 'Delivered the final 30 edited frames plus a Lightroom preset pack, and walked the client through the gallery for sign-off.', tasks: [{ text: 'Upload finals', done: true, due: 'Feb 9' }, { text: 'Client sign-off', done: true, due: 'Feb 10' }] },
    ],
    paymentMilestones: [{ label: '50% Deposit', percentage: 50, status: 'paid' }, { label: '50% On Completion', percentage: 50, status: 'paid' }],
    paymentMethod: { type: 'instapay', instapayHandle: '@nour.creative' },
    completedDate: 'February 10, 2026', startedDate: 'January 15, 2026',
    reviews: [{ id: 'rev-c1', projectId: 'completed-1', projectName: 'Pepsi Ramadan Campaign', reviewerName: 'Randa Hatem', targetName: 'You', reviewType: 'creative', rating: 5, tags: ['Professional', 'On Time', 'Creative'], text: 'Exceptional work! Nour delivered beyond expectations with stunning visuals. Highly recommended.', createdAt: 'Feb 11, 2026' }],
  },
  {
    id: 'completed-2',
    icon: '🎥', name: 'OPPO Brand Launch Video', client: 'Completed Feb 2', earned: '5,200 EGP', creativeName: 'Layla Mostafa', creativeId: 'layla-mostafa',
    clientName: 'Ahmed Fathi', clientCompany: 'OPPO Egypt', clientEmail: 'ahmed.f@oppo.eg', clientPhone: '+20 111 987 6543',
    projectType: 'Brand Launch Video', location: 'Cairo, Egypt',
    description: 'A cinematic brand launch video for OPPO\'s latest smartphone, targeting Gen Z audiences on social media.',
    tags: ['Video', 'Brand', 'Tech', 'Social'],
    moodAesthetic: 'Sleek, futuristic tech aesthetic with neon accents and fast-paced editing.',
    deliverables: '1 hero video (60s), 3 cutdowns (15s), BTS reel',
    proposalDeliverables: ['60s hero video', '3x 15s social cutdowns', 'BTS reel', 'Raw footage drive'],
    phases: [
      { num: 1, title: 'Creative Brief & Storyboard', status: 'complete', description: 'Aligned with OPPO on the launch narrative, locked the storyboard and shot list, and cast Gen Z talent for the hero film.', tasks: [{ text: 'Storyboard approval', done: true, due: 'Jan 10' }] },
      { num: 2, title: 'Production', status: 'complete', description: 'Two-day production with full crew capturing the hero spot, BTS reel, and additional coverage for the social cut-downs.', tasks: [{ text: 'Shoot day 1', done: true, due: 'Jan 18' }, { text: 'Shoot day 2', done: true, due: 'Jan 19' }] },
      { num: 3, title: 'Post-Production', status: 'complete', description: 'Edited the rough cut, locked picture with OPPO, then color-graded and sound-designed the final hero film plus all three social cut-downs.', tasks: [{ text: 'Rough cut', done: true, due: 'Jan 25' }, { text: 'Final edit + color', done: true, due: 'Jan 30' }] },
    ],
    paymentMilestones: [{ label: '30% Deposit', percentage: 30, status: 'paid' }, { label: '40% On Rough Cut', percentage: 40, status: 'paid' }, { label: '30% Final Delivery', percentage: 30, status: 'paid' }],
    paymentMethod: { type: 'bank', bankName: 'CIB', accountName: 'Nour Makram', accountNumber: '1234567890' },
    completedDate: 'February 2, 2026', startedDate: 'January 5, 2026',
    reviews: [{ id: 'rev-c2', projectId: 'completed-2', projectName: 'OPPO Brand Launch Video', reviewerName: 'Ahmed Fathi', targetName: 'You', reviewType: 'creative', rating: 5, tags: ['Fast Delivery', 'High Quality'], text: 'Incredible production quality. The video exceeded our expectations and performed amazingly on social.', createdAt: 'Feb 3, 2026' }],
  },
  {
    id: 'completed-3',
    icon: '👗', name: 'Cairo Fashion Week SS26', client: 'Completed Jan 25', earned: '6,000 EGP', creativeName: 'Sara Ahmed', creativeId: 'sara-ahmed',
    clientName: 'Mona El-Said', clientCompany: 'CFW Productions', clientEmail: 'mona@cfwproductions.com', clientPhone: '+20 122 555 8888',
    projectType: 'Event Photography', location: 'Cairo, Egypt',
    description: 'Full event coverage of Cairo Fashion Week SS26 including runway, backstage, and VIP moments.',
    tags: ['Photography', 'Fashion', 'Event'],
    moodAesthetic: 'High-fashion editorial — dramatic lighting, candid backstage energy, bold compositions.',
    deliverables: '150 edited photos, 20 hero selects, social media gallery',
    proposalDeliverables: ['150 edited event photos', '20 hero selects', 'Social media gallery package', 'Press-ready high-res files'],
    phases: [
      { num: 1, title: 'Pre-Event Prep', status: 'complete', description: 'Walked through the full CFW schedule with the producer, mapped runway and backstage angles, and coordinated press accreditation across all designer shows.', tasks: [{ text: 'Schedule walkthrough', done: true, due: 'Jan 15' }] },
      { num: 2, title: 'Event Coverage', status: 'complete', description: 'Two full days of coverage — runway shows, backstage candid moments with designers and models, plus VIP arrivals and front-row portraits.', tasks: [{ text: 'Day 1 runway', done: true, due: 'Jan 20' }, { text: 'Day 2 backstage', done: true, due: 'Jan 21' }] },
      { num: 3, title: 'Editing & Delivery', status: 'complete', description: 'Culled and edited 150 final frames, picked 20 hero selects for press use, and packaged the social media gallery for immediate publishing.', tasks: [{ text: 'Cull & select', done: true, due: 'Jan 23' }, { text: 'Final delivery', done: true, due: 'Jan 25' }] },
    ],
    paymentMilestones: [{ label: '50% Deposit', percentage: 50, status: 'paid' }, { label: '50% On Delivery', percentage: 50, status: 'paid' }],
    completedDate: 'January 25, 2026', startedDate: 'January 10, 2026',
    reviews: [],
  },
  {
    id: 'completed-4',
    icon: '📸', name: 'Edita Product Shoot Q4', client: 'Completed Jan 14', earned: '2,800 EGP', creativeName: 'Nour Makram', creativeId: 'nour-makram',
    clientName: 'Randa Hatem', clientCompany: 'Edita Group', clientEmail: 'randa.hatem@editagroup.com', clientPhone: '+20 100 123 4567',
    projectType: 'Product Photography', location: 'Cairo, Egypt',
    description: 'Q4 product photography for Edita\'s snack line refresh — clean pack shots and lifestyle imagery.',
    tags: ['Photography', 'Product', 'FMCG'],
    moodAesthetic: 'Clean, bright product photography on white with lifestyle complementary shots.',
    deliverables: '25 edited product shots',
    proposalDeliverables: ['25 product hero shots', 'White background packshots', 'Lifestyle flatlays'],
    phases: [
      { num: 1, title: 'Setup & Prep', status: 'complete', description: 'Took inventory of all 25 SKUs, prepped the white cyc and lighting setup, and locked the shot list with the Edita brand team.', tasks: [{ text: 'Product inventory', done: true, due: 'Jan 5' }] },
      { num: 2, title: 'Shoot', status: 'complete', description: 'Two days of clean white-background packshots followed by complementary lifestyle flatlays styled to match the Q4 brand refresh.', tasks: [{ text: 'Packshots', done: true, due: 'Jan 8' }, { text: 'Lifestyle shots', done: true, due: 'Jan 9' }] },
      { num: 3, title: 'Delivery', status: 'complete', description: 'Edited and color-corrected all 25 final frames and delivered web-ready and print-ready versions to the Edita team.', tasks: [{ text: 'Editing & delivery', done: true, due: 'Jan 14' }] },
    ],
    paymentMilestones: [{ label: 'Full Payment', percentage: 100, status: 'paid' }],
    paymentMethod: { type: 'instapay', instapayHandle: '@nour.creative' },
    completedDate: 'January 14, 2026', startedDate: 'January 3, 2026',
    reviews: [{ id: 'rev-c4', projectId: 'completed-4', projectName: 'Edita Product Shoot Q4', reviewerName: 'Randa Hatem', targetName: 'You', reviewType: 'creative', rating: 4, tags: ['Reliable', 'Clean Work'], text: 'Consistent quality as always. Great to work with Nour on product shoots.', createdAt: 'Jan 15, 2026' }],
  },
  {
    id: 'completed-5',
    icon: '📱', name: 'Juhayna Social Campaign', client: 'Completed Jan 7', earned: '4,100 EGP', creativeName: 'Ahmed Karim', creativeId: 'ahmed-karim',
    clientName: 'Yasmin Nour', clientCompany: 'Juhayna', clientEmail: 'yasmin.n@juhayna.com', clientPhone: '+20 100 444 3333',
    projectType: 'Social Media Content', location: 'Cairo, Egypt',
    description: 'Social media content creation for Juhayna\'s winter dairy campaign across Instagram and TikTok.',
    tags: ['Social Media', 'Content', 'FMCG'],
    moodAesthetic: 'Warm, cozy winter vibes — soft lighting, earth tones, comfort food styling.',
    deliverables: '20 social posts, 5 reels, content calendar',
    proposalDeliverables: ['20 static posts', '5 short-form reels', 'Content calendar', 'Caption copy'],
    phases: [
      { num: 1, title: 'Strategy & Planning', status: 'complete', description: 'Built a six-week winter content calendar across Instagram and TikTok, aligning posts with Juhayna\'s seasonal product push and key cultural moments.', tasks: [{ text: 'Content calendar', done: true, due: 'Dec 20' }] },
      { num: 2, title: 'Content Creation', status: 'complete', description: 'Full studio shoot for the static posts followed by a separate reel production day capturing short-form recipe and lifestyle content.', tasks: [{ text: 'Photo shoot', done: true, due: 'Dec 28' }, { text: 'Reel production', done: true, due: 'Jan 2' }] },
      { num: 3, title: 'Final Delivery', status: 'complete', description: 'Delivered all 20 static posts, 5 final reels, written captions, and the scheduled content calendar ready for Juhayna\'s social team to publish.', tasks: [{ text: 'All assets delivered', done: true, due: 'Jan 7' }] },
    ],
    paymentMilestones: [{ label: '50% Deposit', percentage: 50, status: 'paid' }, { label: '50% On Completion', percentage: 50, status: 'paid' }],
    completedDate: 'January 7, 2026', startedDate: 'December 15, 2025',
    reviews: [],
  },
];

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProjects = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
};

const defaultNotifications: NotificationData[] = [
  { id: 'notif-1', icon: '', bg: 'bg-muted', title: 'Ahmed Karim sent you a message', sub: 'Can we schedule a call for Thursday?', time: '12m ago', unread: true, type: 'message' },
  { id: 'notif-2', icon: '', bg: 'bg-[hsl(var(--otj-green-bg))]', title: 'Payment released — 3,325 EGP', sub: 'Edita Campaign · Phase 2 approved by client', time: '2h ago', unread: true, type: 'payment' },
  { id: 'notif-3', icon: '', bg: 'bg-[hsl(var(--otj-blue-bg))]', title: 'Booking confirmed · March 15', sub: 'Edita Group campaign — added to your calendar', time: 'Yesterday', unread: false, type: 'booking' },
];

const defaultClients: ClientData[] = [
  {
    id: 'client-randa',
    type: 'company',
    name: 'Randa Hatem',
    avatar: '👩‍💼',
    company: 'Edita Group',
    email: 'randa.hatem@editagroup.com',
    phone: '+20 100 123 4567',
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
    coverGrad: 'from-[#c8452a] via-[#e8703a] to-[#f5a623]',
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
    email: 'ahmed.karim@fintech.eg',
    phone: '+20 102 555 7890',
    industry: 'Tech / Startups',
    location: 'Cairo, Egypt',
    bio: 'Founder of a fast-growing fintech startup. Looking for creatives to help build our brand identity and marketing campaigns. Values speed and quality.',
    joinedDate: 'Mar 2024',
    projectsCompleted: 5,
    
    avgResponseTime: '< 4 hours',
    paymentReliability: 88,
    verified: true,
    coverGrad: 'from-[#0f2027] via-[#203a43] to-[#2c5364]',
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
    email: 'sara@studionoir.eg',
    phone: '+20 111 222 3344',
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
    coverGrad: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
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
      clientEmail: brief.clientEmail,
      clientPhone: brief.clientPhone,
      projectType: brief.projectType,
      budget: brief.budget,
      deliverables: brief.deliverables,
      date: dateStr,
      deadline: brief.date,
      location: brief.location,
      description: brief.description,
      tags: brief.tags,
      moodAesthetic: brief.moodAesthetic,
      usageRights: brief.usageRights,
      surveyAnswers: brief.surveyAnswers,
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
        timeline: [...p.timeline, { label: meeting.title, date: meeting.date, status: 'upcoming' as const }],
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
        icon: '',
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

  const approvePhase = useCallback((projectId: string, phaseNum: number) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const updatedPhases = p.phases.map(ph => {
        if (ph.num === phaseNum) return { ...ph, status: 'complete' as const, tasks: ph.tasks.map(t => ({ ...t, done: true })) };
        if (ph.num === phaseNum + 1 && ph.status === 'locked') return { ...ph, status: 'active' as const };
        return ph;
      });
      return {
        ...p,
        phases: updatedPhases,
        timeline: [...p.timeline, { label: `Phase ${phaseNum} Approved by Client`, date: today, status: 'complete' as const }],
      };
    }));
    // Add notification
    const proj = activeProjects.find(p => p.id === projectId);
    const phaseName = proj?.phases.find(ph => ph.num === phaseNum)?.title || `Phase ${phaseNum}`;
    addNotification({
      icon: '',
      bg: 'bg-[hsl(var(--otj-green-bg))]',
      title: `Phase ${phaseNum} approved`,
      sub: `${phaseName} on ${proj?.name || 'project'} has been approved`,
      time: 'Just now',
      unread: true,
      type: 'payment',
      projectId,
    });
  }, [activeProjects, addNotification]);

  const releasePayment = useCallback((projectId: string, milestoneIndex: number) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const updatedMilestones = p.paymentMilestones.map((m, i) => i === milestoneIndex ? { ...m, status: 'paid' as const } : m);
      const milestone = p.paymentMilestones[milestoneIndex];
      const numericPrice = parseInt(p.budget.replace(/[^0-9]/g, '')) || 0;
      const amount = numericPrice > 0 ? `${Math.round(numericPrice * milestone.percentage / 100).toLocaleString()} EGP` : '';
      return {
        ...p,
        paymentMilestones: updatedMilestones,
        timeline: [...p.timeline, { label: `Payment Released — ${amount}`, date: today, status: 'complete' as const }],
      };
    }));
    // Add notification
    const proj = activeProjects.find(p => p.id === projectId);
    const milestone = proj?.paymentMilestones[milestoneIndex];
    const numericPrice = parseInt(proj?.budget.replace(/[^0-9]/g, '') || '0') || 0;
    const amount = milestone && numericPrice > 0 ? `${Math.round(numericPrice * milestone.percentage / 100).toLocaleString()} EGP` : '';
    addNotification({
      icon: '',
      bg: 'bg-[hsl(var(--otj-green-bg))]',
      title: `Payment released — ${amount}`,
      sub: `${milestone?.label || 'Milestone'} for ${proj?.name || 'project'}`,
      time: 'Just now',
      unread: true,
      type: 'payment',
      projectId,
    });
  }, [activeProjects, addNotification]);

  const submitPaymentProof = useCallback((projectId: string, milestoneIndex: number, proofUrl: string, proofName: string) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedMilestones = p.paymentMilestones.map((m, i) =>
        i === milestoneIndex ? { ...m, status: 'proof-submitted' as const, proofUrl, proofName } : m
      );
      return { ...p, paymentMilestones: updatedMilestones };
    }));
    // Notify creative
    const proj = activeProjects.find(p => p.id === projectId);
    const milestone = proj?.paymentMilestones[milestoneIndex];
    const numericPrice = parseInt(proj?.budget.replace(/[^0-9]/g, '') || '0') || 0;
    const amount = milestone && numericPrice > 0 ? `${Math.round(numericPrice * milestone.percentage / 100).toLocaleString()} EGP` : '';
    addNotification({
      icon: '',
      bg: 'bg-[hsl(var(--otj-blue-bg))]',
      title: `Payment proof uploaded — ${amount}`,
      sub: `${proj?.clientName || 'Client'} attached a bank transfer screenshot for ${milestone?.label || 'milestone'} on ${proj?.name || 'project'}. Please confirm receipt.`,
      time: 'Just now',
      unread: true,
      type: 'payment',
      projectId,
    });
  }, [activeProjects, addNotification]);

  const confirmPaymentReceipt = useCallback((projectId: string, milestoneIndex: number) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedMilestones = p.paymentMilestones.map((m, i) =>
        i === milestoneIndex ? { ...m, status: 'paid' as const } : m
      );
      return { ...p, paymentMilestones: updatedMilestones };
    }));
    // Notify client
    const proj = activeProjects.find(p => p.id === projectId);
    const milestone = proj?.paymentMilestones[milestoneIndex];
    const numericPrice = parseInt(proj?.budget.replace(/[^0-9]/g, '') || '0') || 0;
    const amount = milestone && numericPrice > 0 ? `${Math.round(numericPrice * milestone.percentage / 100).toLocaleString()} EGP` : '';
    addNotification({
      icon: '',
      bg: 'bg-[hsl(var(--otj-green-bg))]',
      title: `Payment confirmed — ${amount}`,
      sub: `Creative confirmed receipt of ${milestone?.label || 'milestone'} for ${proj?.name || 'project'}`,
      time: 'Just now',
      unread: true,
      type: 'payment',
      projectId,
    });
  }, [activeProjects, addNotification]);

  const acceptProposal = useCallback((projectId: string) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return {
        ...p,
        status: 'active' as const,
        phases: p.phases.map((ph, i) => ({ ...ph, status: (i === 0 ? 'active' : 'locked') as 'active' | 'locked' })),
        paymentMilestones: p.paymentMilestones.map((m, i) => i === 0 ? { ...m, status: 'paid' as const } : m),
        timeline: [...p.timeline.map(t => ({ ...t, status: 'complete' as const })), { label: 'Proposal Accepted', date: today, status: 'complete' as const }, { label: 'Project Started', date: today, status: 'active' as const }],
      };
    }));
    addNotification({
      icon: '',
      bg: 'bg-[hsl(var(--otj-green-bg))]',
      title: 'Proposal accepted!',
      sub: `You accepted the proposal for ${activeProjects.find(p => p.id === projectId)?.name || 'project'}`,
      time: 'Just now',
      unread: true,
      type: 'brief',
      projectId,
    });
  }, [activeProjects, addNotification]);

  const rejectProposal = useCallback((projectId: string) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return {
        ...p,
        status: 'proposal' as const,
        timeline: [...p.timeline, { label: 'Proposal Rejected', date: today, status: 'complete' as const }],
      };
    }));
    addNotification({
      icon: '',
      bg: 'bg-destructive/10',
      title: 'Proposal rejected',
      sub: `You rejected the proposal for ${activeProjects.find(p => p.id === projectId)?.name || 'project'}`,
      time: 'Just now',
      unread: true,
      type: 'brief',
      projectId,
    });
  }, [activeProjects, addNotification]);

  const toggleTask = useCallback((projectId: string, phaseNum: number, taskIndex: number) => {
    setActiveProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedPhases = p.phases.map(ph => {
        if (ph.num !== phaseNum) return ph;
        const updatedTasks = ph.tasks.map((t, i) => i === taskIndex ? { ...t, done: !t.done } : t);
        return { ...ph, tasks: updatedTasks };
      });
      return { ...p, phases: updatedPhases };
    }));
  }, []);

  const updateClient = useCallback((clientId: string, updates: Partial<ClientData>) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updates } : c));
  }, []);

  const getCompletedProject = useCallback((id: string) => completedProjects.find(p => p.id === id), [completedProjects]);

  return (
    <ProjectContext.Provider value={{ userRole, setUserRole, pendingBriefs, activeProjects, completedProjects, getCompletedProject, acceptBrief, getBrief, getProject, submitProposal, updateProject, addMeeting, addAttachment, removeAttachment, renameAttachment, allMeetings, completeProject, addReview, reviews: allReviews, notifications, addNotification, markAllRead, unreadCount, submitCounterOffer, clients, getClient, updateClient, addClientReview, approvePhase, releasePayment, submitPaymentProof, confirmPaymentReceipt, acceptProposal, rejectProposal, toggleTask }}>
      {children}
    </ProjectContext.Provider>
  );
};
