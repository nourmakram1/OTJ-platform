import React, { useState, useCallback } from 'react';
import { TopNavBooking } from '../components/TopNavBooking';
import { ExploreScreen } from '../components/ExploreScreen';
import { MessagesScreen } from '../components/MessagesScreen';
import { DashboardScreen } from '../components/DashboardScreen';
import { QuickBriefPopup, CounterOfferModal, NotifPopup } from '../components/BookingModals';
import { Toast, showToast } from '../components/Toast';

const BookingFlow = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [showNotif, setShowNotif] = useState(false);
  const [showBrief, setShowBrief] = useState(false);
  const [showCounter, setShowCounter] = useState(false);
  const [briefCreative, setBriefCreative] = useState<string | null>(null);

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
      <TopNavBooking
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNotifToggle={() => setShowNotif(prev => !prev)}
        onNewBrief={() => { setBriefCreative(null); setShowBrief(true); }}
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

      <NotifPopup
        visible={showNotif}
        onClose={() => setShowNotif(false)}
        onAcceptBrief={acceptBrief}
        onCounter={() => { setShowNotif(false); setShowCounter(true); }}
        onSwitchToMessages={() => { setShowNotif(false); setActiveTab('messages'); }}
      />

      <QuickBriefPopup visible={showBrief} onClose={() => setShowBrief(false)} creativeId={briefCreative} />
      <CounterOfferModal visible={showCounter} onClose={() => setShowCounter(false)} />
      <Toast />
    </>
  );
};

export default BookingFlow;
