import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotifPopup } from './BookingModals';
import { showToast } from './Toast';

interface NavBarProps {
  onAcceptBrief?: () => void;
  onOpenCounter?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ onAcceptBrief, onOpenCounter }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navTabs = [
    { label: 'Explore', path: '/explore' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] h-[52px] backdrop-blur-[12px] border-b border-border flex items-center px-4 md:px-6 gap-3 md:gap-4 bg-card">
        {/* Logo */}
        <div onClick={() => navigate('/explore')} className="text-[17px] font-extrabold tracking-[-0.05em] text-foreground cursor-pointer">
          OTJ<sup className="text-[7px] align-super">™</sup>
        </div>

        <div className="w-px h-[18px] bg-border hidden md:block" />

        {/* Desktop nav tabs */}
        <div className="hidden md:flex gap-1">
          {navTabs.map((tab) =>
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`text-[12.5px] font-semibold px-4 py-[6px] rounded-full cursor-pointer transition-all duration-150 ${
                isActive(tab.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent text-otj-text hover:text-foreground hover:bg-otj-off'
              }`}
            >
              {tab.label}
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-2.5">
          {/* Messages icon */}
          <div onClick={() => navigate('/messages')} className="relative cursor-pointer p-1.5 rounded-lg transition-all duration-150 hover:bg-otj-off">
            <span className="text-lg">💬</span>
            <div className="absolute top-0.5 right-0.5 w-[8px] h-[8px] rounded-full bg-destructive border-2 border-card" />
          </div>

          {/* Notifications */}
          <div onClick={() => setShowNotif((prev) => !prev)} className="relative cursor-pointer p-1.5 rounded-lg transition-all duration-150 hover:bg-otj-off">
            <span className="text-lg">🔔</span>
            <div className="absolute top-0.5 right-0.5 w-[8px] h-[8px] rounded-full bg-destructive border-2 border-card" />
          </div>

          {/* Profile avatar */}
          <div onClick={() => setShowProfileMenu((prev) => !prev)} className="relative">
            <div className="w-8 h-8 rounded-full bg-otj-off flex items-center justify-center text-sm cursor-pointer border-2 border-border hover:border-foreground transition-all duration-150">👩‍🎨</div>
            {showProfileMenu && (
              <div className="absolute top-10 right-0 w-[180px] bg-card border border-border rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] py-1.5 z-[200]">
                <div onClick={() => { setShowProfileMenu(false); navigate('/creative/nour'); }} className="px-3.5 py-2 text-[12.5px] font-semibold text-foreground cursor-pointer hover:bg-otj-off">👤 My Profile</div>
                <div onClick={() => { setShowProfileMenu(false); navigate('/onboarding'); }} className="px-3.5 py-2 text-[12.5px] font-semibold text-foreground cursor-pointer hover:bg-otj-off">⚙️ Settings</div>
                <div className="h-px bg-border mx-2 my-1" />
                <div onClick={() => { setShowProfileMenu(false); navigate('/login'); showToast('Logged out'); }} className="px-3.5 py-2 text-[12.5px] font-semibold text-otj-text cursor-pointer hover:bg-otj-off">↩ Log Out</div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setShowMobileMenu(prev => !prev)}
            className="md:hidden w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer text-sm"
          >☰</button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] h-[56px] bg-card border-t border-border flex items-center justify-around px-2">
        {[
          { label: 'Explore', path: '/explore', icon: '🔍' },
          { label: 'Dashboard', path: '/dashboard', icon: '📊' },
          { label: 'Messages', path: '/messages', icon: '💬' },
        ].map(tab => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
              isActive(tab.path) ? 'text-foreground' : 'text-otj-muted'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[9px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile slide-down menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed top-[52px] left-0 right-0 bg-card border-b border-border z-[99] p-3 animate-fade-up shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          {navTabs.map(tab => (
            <div key={tab.path} onClick={() => { navigate(tab.path); setShowMobileMenu(false); }} className={`px-4 py-3 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors ${isActive(tab.path) ? 'bg-otj-off text-foreground' : 'text-otj-text hover:bg-otj-off'}`}>
              {tab.label}
            </div>
          ))}
        </div>
      )}

      <NotifPopup
        visible={showNotif}
        onClose={() => setShowNotif(false)}
        onAcceptBrief={() => { setShowNotif(false); onAcceptBrief?.(); }}
        onCounter={() => { setShowNotif(false); onOpenCounter?.(); }}
        onSwitchToMessages={() => { setShowNotif(false); navigate('/messages'); }}
      />
    </>
  );
};