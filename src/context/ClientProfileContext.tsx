import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ClientProfileData {
  name: string;
  company: string;
  industry: string;
  bio: string;
  email: string;
  phone: string;
  city: string;
  website: string;
  preferredCategories: string[];
  logoOrAvatar: string;
}

interface ClientProfileContextType {
  profile: ClientProfileData;
  updateProfile: (updates: Partial<ClientProfileData>) => void;
}

// Seeded so the client completeness indicator lands ~75% (a few fields missing).
const defaultProfile: ClientProfileData = {
  name: 'Randa Hatem',
  company: 'Edita Group',
  industry: 'FMCG / Food & Beverage',
  bio: 'Marketing director at Edita Group, sourcing photographers and videographers for seasonal campaigns and brand content.',
  email: 'randa.hatem@editagroup.com',
  phone: '+20 100 123 4567',
  city: 'Cairo',
  website: '',
  preferredCategories: [],
  logoOrAvatar: '',
};

const ClientProfileContext = createContext<ClientProfileContextType | null>(null);

export const useClientProfile = (): ClientProfileContextType => {
  const ctx = useContext(ClientProfileContext);
  if (!ctx) throw new Error('useClientProfile must be used within ClientProfileProvider');
  return ctx;
};

export const ClientProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ClientProfileData>(defaultProfile);
  const updateProfile = useCallback((updates: Partial<ClientProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);
  return (
    <ClientProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ClientProfileContext.Provider>
  );
};
