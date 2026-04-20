import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CreativeProfileData {
  name: string;
  tagline: string;
  bio: string;
  profession: string;
  selectedNiches: string[];
  skills: string[];
  city: string;
  experience: string;
  instagram: string;
  links: { label: string; url: string }[];
}

interface CreativeProfileContextType {
  profile: CreativeProfileData;
  updateProfile: (updates: Partial<CreativeProfileData>) => void;
}

// Seeded so ProfileCompletenessCard reports ~75% — 3 of 10 steps left
// (instagram, portfolio link, fewer skills). Used for demo / onboarding nudges.
const defaultProfile: CreativeProfileData = {
  name: 'Nour Makram',
  tagline: 'Fashion & E-commerce Photographer · Cairo',
  bio: 'Cairo-based fashion and e-commerce photographer with 7+ years of experience. Specializing in product photography, lifestyle campaigns, and brand content for leading Egyptian and MENA brands.',
  profession: 'Photographer',
  selectedNiches: ['Fashion Editorial', 'E-Commerce'],
  skills: ['Photography', 'Product', 'Fashion'],
  city: 'Cairo',
  experience: '5–8 years',
  instagram: '',
  links: [{ label: 'Portfolio', url: '' }],
};

const CreativeProfileContext = createContext<CreativeProfileContextType | null>(null);

export const useCreativeProfile = (): CreativeProfileContextType => {
  const ctx = useContext(CreativeProfileContext);
  if (!ctx) throw new Error('useCreativeProfile must be used within CreativeProfileProvider');
  return ctx;
};

export const CreativeProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<CreativeProfileData>(defaultProfile);

  const updateProfile = useCallback((updates: Partial<CreativeProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <CreativeProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </CreativeProfileContext.Provider>
  );
};
