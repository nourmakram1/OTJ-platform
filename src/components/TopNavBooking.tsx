import React from 'react';

interface TopNavBookingProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNotifToggle: () => void;
  onNewBrief: () => void;
}

export const TopNavBooking: React.FC<TopNavBookingProps> = ({ activeTab, onTabChange, onNotifToggle, onNewBrief }) => {
  const tabs = ['Explore', 'Messages', 'Dashboard'];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[52px] bg-card/97 backdrop-blur-[12px] border-b border-border flex items-center px-6 gap-3.5">
      <div className="text-[17px] font-extrabold tracking-[-0.05em]">OTJ<sup className="text-[7px] align-super">™</sup></div>
      <div className="w-px h-[18px] bg-border" />
      <div className="flex gap-0.5">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab.toLowerCase())}
            className={`text-xs font-semibold px-3 py-[5px] rounded-full border-none cursor-pointer transition-all duration-150 ${
              activeTab === tab.toLowerCase()
                ? 'bg-primary text-primary-foreground'
                : 'bg-transparent text-otj-text hover:bg-otj-off hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div onClick={onNotifToggle} className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer text-sm relative">
          🔔<div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive border-2 border-card" />
        </div>
        <button onClick={() => onTabChange('dashboard')} className="text-[11.5px] font-bold px-3.5 py-[5px] rounded-full border border-border bg-card cursor-pointer tracking-[-0.01em] transition-all duration-150 hover:border-foreground">My Boards</button>
        <button onClick={onNewBrief} className="text-[11.5px] font-bold px-3.5 py-[5px] rounded-full border border-primary bg-primary text-primary-foreground cursor-pointer tracking-[-0.01em]">+ New Brief</button>
      </div>
    </nav>
  );
};
