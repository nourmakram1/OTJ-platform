import React from 'react';
import { showToast } from './Toast';

interface CalendarConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  event?: { title: string; date: string; time: string; location: string };
}

export const CalendarConfirmModal: React.FC<CalendarConfirmModalProps> = ({
  visible, onClose,
  event = { title: 'Edita Campaign Shoot', date: 'March 15, 2026', time: '9:00 AM – 5:00 PM', location: 'Cairo Studio' }
}) => {
  if (!visible) return null;

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} className={`fixed inset-0 z-[200] flex items-center justify-center bg-foreground/40 backdrop-blur-[6px] transition-opacity duration-250 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-card rounded-[22px] w-full max-w-[400px] p-6 text-center transition-all duration-300 ${visible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[0.98]'}`}>
        <div className="text-[48px] mb-3">📅</div>
        <div className="text-[20px] font-extrabold tracking-[-0.04em] mb-1.5">Add to Calendar?</div>
        <div className="text-[13px] text-otj-text mb-5">Both you and the client will receive a calendar notification and reminder.</div>

        <div className="bg-otj-blue-bg border border-otj-blue-border rounded-[14px] p-4 mb-5 text-left">
          <div className="text-[13px] font-extrabold tracking-[-0.02em] mb-1">{event.title}</div>
          <div className="text-[12px] text-otj-text">{event.date}</div>
          <div className="text-[12px] text-otj-text">{event.time}</div>
          <div className="text-[12px] text-otj-text">{event.location}</div>
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-full border-[1.5px] border-border bg-transparent text-[13px] font-bold text-otj-text cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">Skip</button>
          <button onClick={() => { onClose(); showToast('📅 Added to both calendars — client notified'); }} className="flex-[2] py-2.5 rounded-full border-none bg-primary text-primary-foreground text-[13px] font-bold cursor-pointer transition-all duration-150 hover:bg-primary/90">✓ Add to Both Calendars</button>
        </div>
      </div>
    </div>
  );
};
