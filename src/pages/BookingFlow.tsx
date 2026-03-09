import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { ExploreScreen } from '../components/ExploreScreen';
import { MessagesScreen } from '../components/MessagesScreen';
import { DashboardScreen } from '../components/DashboardScreen';
import { ClientDashboardScreen } from '../components/ClientDashboardScreen';
import { QuickBriefPopup, CounterOfferModal } from '../components/BookingModals';
import { CalendarConfirmModal } from '../components/CalendarConfirmModal';
import { Toast, showToast } from '../components/Toast';
import { useProjects } from '../context/ProjectContext';

const BookingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { acceptBrief, userRole } = useProjects();

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
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const openBrief = useCallback((creativeId: string) => {
    setBriefCreative(creativeId);
    setShowBrief(true);
  }, []);

  const handleAcceptBrief = useCallback((briefId: string) => {
    const projectId = acceptBrief(briefId);
    if (projectId) {
      showToast('✓ Brief accepted! Project created');
      setTimeout(() => {
        navigate(`/project/${projectId}`);
      }, 800);
    }
  }, [acceptBrief, navigate]);

  const isClient = userRole === 'client';

  return (
    <>
      <NavBar
        onAcceptBrief={() => {}}
        onOpenCounter={() => setShowCounter(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="min-h-screen pt-[52px]">
        {activeTab === 'explore' && <ExploreScreen onOpenBrief={openBrief} searchQuery={searchQuery} />}
        {activeTab === 'messages' && <MessagesScreen onOpenCounter={() => setShowCounter(true)} />}
        {activeTab === 'dashboard' && (
          isClient ? (
            <ClientDashboardScreen />
          ) : (
            <DashboardScreen
              onOpenBrief={() => { setBriefCreative(null); setShowBrief(true); }}
              onAcceptBrief={handleAcceptBrief}
              onOpenCounter={() => setShowCounter(true)}
              onSwitchToMessages={() => setActiveTab('messages')}
            />
          )
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
