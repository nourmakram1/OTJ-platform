import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NotifPopup } from './BookingModals';
import { showToast } from './Toast';
import { Search, X, Bell, MessageCircle } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

interface NavBarProps {
  onAcceptBrief?: () => void;
  onOpenCounter?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const NotifBell = ({ onClick }: { onClick: () => void }) => {
  const { unreadCount, userRole } = useProjects();
  return (
    <div onClick={onClick} className="relative cursor-pointer p-2 rounded-lg transition-all duration-150 hover:bg-muted">
      <Bell className="w-[18px] h-[18px] text-foreground" />
      {unreadCount > 0 && (
        <div className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-destructive flex items-center justify-center px-1">
          <span className="text-[9px] font-bold text-destructive-foreground leading-none">{unreadCount}</span>
        </div>
      )}
    </div>
  );
};

export const NavBar: React.FC<NavBarProps> = ({ onAcceptBrief, onOpenCounter, searchQuery = '', onSearchChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useProjects();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isExplore = location.pathname === '/explore';

  useEffect(() => {
    if (showSearch && searchInputRef.current) searchInputRef.current.focus();
  }, [showSearch]);

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

        {/* Desktop search bar (explore only) */}
        {isExplore && (
          <div className="hidden md:flex items-center flex-1 ml-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-otj-muted" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => onSearchChange?.(e.target.value)}
                placeholder="Search creatives, skills…"
                className="w-full pl-8 pr-8 py-[7px] rounded-full border-[1.5px] border-border bg-otj-off text-[12.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange?.('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-otj-muted hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2 md:gap-2.5">
          {/* Mobile search toggle (explore only) */}
          {isExplore && (
            <button
              onClick={() => setShowSearch(prev => !prev)}
              className="md:hidden p-1.5 rounded-lg transition-all duration-150 hover:bg-otj-off"
            >
              <Search className="w-[18px] h-[18px] text-otj-text" />
            </button>
          )}
          {/* Messages icon */}
          <div onClick={() => navigate('/messages')} className="relative cursor-pointer p-2 rounded-lg transition-all duration-150 hover:bg-muted">
            <MessageCircle className="w-[18px] h-[18px] text-foreground" />
            <div className="absolute top-1 right-1 w-[8px] h-[8px] rounded-full bg-destructive border-2 border-card" />
          </div>

          {/* Notifications */}
          <NotifBell onClick={() => setShowNotif((prev) => !prev)} />

          {/* Profile avatar */}
          <div onClick={() => setShowProfileMenu((prev) => !prev)} className="relative">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm cursor-pointer border-2 border-border hover:border-foreground transition-all duration-150">{userRole === 'client' ? '🏢' : '👩‍🎨'}</div>
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

      {/* Mobile search bar dropdown */}
      {showSearch && isExplore && (
        <div className="md:hidden fixed top-[52px] left-0 right-0 bg-card border-b border-border z-[99] p-3 animate-fade-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-otj-muted" />
            <input
              autoFocus
              value={searchQuery}
              onChange={e => onSearchChange?.(e.target.value)}
              placeholder="Search creatives, skills…"
              className="w-full pl-8 pr-8 py-2.5 rounded-full border-[1.5px] border-border bg-otj-off text-[13px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted"
            />
            {searchQuery ? (
              <button onClick={() => onSearchChange?.('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-otj-muted hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button onClick={() => setShowSearch(false)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-otj-muted hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

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
        onCounter={() => { setShowNotif(false); navigate('/brief/brief-1'); }}
        onSwitchToMessages={() => { setShowNotif(false); navigate('/messages'); }}
        onNavigate={(path) => { setShowNotif(false); navigate(path); }}
      />
    </>
  );
};