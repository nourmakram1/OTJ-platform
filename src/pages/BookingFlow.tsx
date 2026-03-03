import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { ExploreScreen } from '../components/ExploreScreen';
import { MessagesScreen } from '../components/MessagesScreen';
import { DashboardScreen } from '../components/DashboardScreen';
import { QuickBriefPopup, CounterOfferModal } from '../components/BookingModals';
import { CalendarConfirmModal } from '../components/CalendarConfirmModal';
import { Toast, showToast } from '../components/Toast';

const BookingFlow = () => {
  const location = useLocation();
  const getTabFromPath = () => {
    if (location.pathname === '/messages') return 'messages';
    if (location.pathname === '/dashboard') return 'dashboard';
    return 'explore';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath);
  const [showBrief, setShowBrief] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [briefCreative, setBriefCreative] = useState<string | null>(null);

  // Sync tab with route
  React.useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const openBrief = useCallback((creativeId: string) => {
    setBriefCreative(creativeId);
    setShowBrief(true);
  }, []);

  const acceptBrief = useCallback(() => {
    showToast('✓ Brief accepted! Project created → Dashboard');
    setTimeout(() => showToast('📅 March 15 added to your calendar'), 1500);
  }, []);

  return (
    <>
      <NavBar
        onAcceptBrief={acceptBrief}
        onOpenCounter={() => setShowCounter(true)}
      />

      <div className="min-h-screen pt-[52px]">
        {activeTab === 'explore' && <ExploreScreen onOpenBrief={openBrief} />}
        {activeTab === 'messages' && <MessagesScreen onOpenCounter={() => setShowCounter(true)} />}
        {activeTab === 'dashboard' && (
          <DashboardScreen
            onOpenBrief={() => { setBriefCreative(null); setShowBrief(true); }}
            onAcceptBrief={acceptBrief}
            onOpenCounter={() => setShowCounter(true)}
            onSwitchToMessages={() => setActiveTab('messages')}
          />
        )}
      </div>

      <QuickBriefPopup visible={showBrief} onClose={() => setShowBrief(false)} creativeId={briefCreative} />
      <CounterOfferModal visible={showCounter} onClose={() => setShowCounter(false)} />
      <CalendarConfirmModal visible={showCalendar} onClose={() => setShowCalendar(false)} />
      <Toast />
    </>
  );
};

export default BookingFlow;
