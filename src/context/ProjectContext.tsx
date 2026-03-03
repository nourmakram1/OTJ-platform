import React, { createContext, useContext, useState, useCallback } from 'react';

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
  status: 'pending-deposit' | 'active' | 'complete';
  phases: {
    num: number;
    title: string;
    status: 'complete' | 'active' | 'locked';
    tasks: { text: string; done: boolean; due: string }[];
  }[];
  escrow: { total: string; deposited: string; held: string; fee: string };
  timeline: { label: string; date: string; status: 'complete' | 'active' | 'upcoming' | 'locked' }[];
  createdAt: string;
}

interface ProjectContextType {
  pendingBriefs: BriefData[];
  activeProjects: ProjectData[];
  completedProjects: { icon: string; name: string; client: string; earned: string }[];
  acceptBrief: (briefId: string) => string; // returns new project ID
  getProject: (id: string) => ProjectData | undefined;
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
    escrow: { total: '3,500 EGP', deposited: '1,750 EGP', held: '1,750 EGP', fee: '175 EGP' },
    timeline: [
      { label: 'Brief Created', date: 'Mar 5', status: 'complete' },
      { label: 'Brief Approved', date: 'Mar 10', status: 'complete' },
      { label: 'Phase 1 Complete', date: 'Mar 12', status: 'complete' },
      { label: 'Phase 2 Started', date: 'Mar 13', status: 'active' },
    ],
    createdAt: 'March 5, 2026',
  },
  {
    id: 'proj-existing-2',
    icon: '🎥', name: 'CIB Campaign Assets',
    clientName: 'Ahmed Karim', clientCompany: 'CIB',
    projectType: 'Campaign Video', budget: '5,200 EGP',
    deliverables: 'Campaign video assets', date: 'Mar 10', deadline: 'Mar 25',
    moodAesthetic: '', usageRights: '',
    status: 'active',
    phases: [
      { num: 1, title: 'Pre-Production', status: 'complete', tasks: [] },
      { num: 2, title: 'Production', status: 'complete', tasks: [] },
      { num: 3, title: 'Post-Production', status: 'active', tasks: [
        { text: 'Edit rough cut', done: false, due: 'Mar 22' },
      ]},
      { num: 4, title: 'Final Delivery', status: 'locked', tasks: [] },
    ],
    escrow: { total: '5,200 EGP', deposited: '2,600 EGP', held: '2,600 EGP', fee: '260 EGP' },
    timeline: [],
    createdAt: 'March 10, 2026',
  },
  {
    id: 'proj-existing-3',
    icon: '📸', name: 'Vodafone Brand Refresh',
    clientName: 'Tarek Saad', clientCompany: 'Vodafone',
    projectType: 'Brand Photography', budget: '4,800 EGP',
    deliverables: 'Brand refresh photos', date: 'Mar 20', deadline: 'Apr 5',
    moodAesthetic: '', usageRights: '',
    status: 'active',
    phases: [
      { num: 1, title: 'Pre-Production', status: 'active', tasks: [
        { text: 'Creative brief review', done: false, due: 'Mar 22' },
      ]},
      { num: 2, title: 'Shoot Day', status: 'locked', tasks: [] },
      { num: 3, title: 'Editing', status: 'locked', tasks: [] },
      { num: 4, title: 'Final Delivery', status: 'locked', tasks: [] },
    ],
    escrow: { total: '4,800 EGP', deposited: '2,400 EGP', held: '2,400 EGP', fee: '240 EGP' },
    timeline: [],
    createdAt: 'March 20, 2026',
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

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingBriefs, setPendingBriefs] = useState<BriefData[]>(defaultBriefs);
  const [activeProjects, setActiveProjects] = useState<ProjectData[]>(defaultActiveProjects);
  const [completedProjects] = useState(defaultCompleted);

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
      status: 'pending-deposit',
      phases: [
        { num: 1, title: 'Pre-Production', status: 'active', tasks: [
          { text: 'Review brief & requirements', done: false, due: brief.date },
          { text: 'Prepare equipment & logistics', done: false, due: brief.date },
          { text: 'Confirm location & schedule', done: false, due: brief.date },
        ]},
        { num: 2, title: 'Production', status: 'locked', tasks: [
          { text: brief.deliverables, done: false, due: brief.date },
        ]},
        { num: 3, title: 'Editing & Delivery', status: 'locked', tasks: [
          { text: 'Edit and retouch selects', done: false, due: brief.date },
        ]},
        { num: 4, title: 'Final Delivery', status: 'locked', tasks: [
          { text: 'Upload final files', done: false, due: brief.date },
          { text: 'Client sign-off', done: false, due: brief.date },
        ]},
      ],
      escrow: {
        total: brief.budget,
        deposited: '0 EGP',
        held: '0 EGP',
        fee: brief.budget !== 'Negotiable' ? `${Math.round(parseInt(brief.budget.replace(/[^0-9]/g, '')) * 0.05)} EGP` : 'TBD',
      },
      timeline: [
        { label: 'Brief Accepted', date: dateStr, status: 'complete' },
        { label: 'Awaiting Deposit', date: dateStr, status: 'active' },
        { label: 'Phase 1 — Pre-Production', date: brief.date, status: 'upcoming' },
        { label: 'Production', date: brief.date, status: 'locked' },
        { label: 'Final Delivery', date: brief.date, status: 'locked' },
      ],
      createdAt: dateStr,
    };

    setPendingBriefs(prev => prev.filter(b => b.id !== briefId));
    setActiveProjects(prev => [newProject, ...prev]);
    return projectId;
  }, [pendingBriefs]);

  const getProject = useCallback((id: string): ProjectData | undefined => {
    return activeProjects.find(p => p.id === id);
  }, [activeProjects]);

  return (
    <ProjectContext.Provider value={{ pendingBriefs, activeProjects, completedProjects, acceptBrief, getProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
