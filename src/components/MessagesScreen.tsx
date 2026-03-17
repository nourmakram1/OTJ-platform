import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { showToast } from './Toast';
import { useProjects } from '../context/ProjectContext';

const threads = [
  { id: 'randa', name: 'Randa Hatem', initials: 'RH', preview: 'Can we do 3,200 EGP?', time: '10:35 AM', unread: 2, projectId: 'proj-existing-1', clientId: 'client-randa' },
  { id: 'ahmed', name: 'Ahmed Karim', initials: 'AK', preview: 'Photos look great! Can we schedule…', time: 'Yesterday', unread: 1, projectId: 'proj-existing-2', clientId: 'client-ahmed' },
  { id: 'sara', name: 'Sara M.', initials: 'SM', preview: 'Sent you the brand guidelines', time: 'Mon', unread: 0, projectId: 'proj-existing-3', clientId: 'client-sara' },
];

interface Message {
  text: string;
  isMe: boolean;
  time: string;
  type?: 'calendar' | 'attachment';
  meetingData?: { title: string; date: string; time: string };
}

const initialMessages: Message[] = [
  { text: "Hi! I'd love to book you for our Ramadan campaign. Full day shoot, around 40 product and lifestyle shots. Does March 15 work?", isMe: false, time: 'Randa · 10:24 AM' },
  { text: "Hi Randa! March 15 works. My full day package is 3,500 EGP including editing. I'll send a formal brief now.", isMe: true, time: 'You · 10:31 AM · ✓✓' },
  { text: 'Looks great! Could we do 3,200 EGP? Budget is a bit tight this month.', isMe: false, time: 'Randa · 10:35 AM' },
];

interface MessagesScreenProps {
  onOpenCounter: () => void;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({ onOpenCounter }) => {
  const { addMeeting, addAttachment, activeProjects } = useProjects();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeThread, setActiveThread] = useState('randa');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [offerLocked, setOfferLocked] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showCollabPanel, setShowCollabPanel] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [showZoomPicker, setShowZoomPicker] = useState(false);
  const [zoomDate, setZoomDate] = useState<Date | undefined>(undefined);
  const [zoomTime, setZoomTime] = useState('14:00');
  const [zoomTitle, setZoomTitle] = useState('');
  const threadRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentThread = threads.find(t => t.id === activeThread);
  const linkedProj = activeProjects.find(p => p.id === currentThread?.projectId);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, isMe: true, time: 'You · Just now · ✓' }]);
    const text = input;
    setInput('');

    const dateWords = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday','tomorrow','march','april','next week','pm','am','meeting','call','schedule'];
    if (dateWords.some(w => text.toLowerCase().includes(w))) {
      const meetingTitle = text.length > 40 ? text.substring(0, 40) + '…' : text;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: `Schedule detected: "${meetingTitle}"`,
          isMe: false,
          time: '',
          type: 'calendar',
          meetingData: { title: meetingTitle, date: dateStr, time: '10:00 AM' },
        }]);
      }, 800);
    }
  };

  const handleAddMeeting = (meetingData: { title: string; date: string; time: string }) => {
    const projectId = currentThread?.projectId;
    if (projectId) {
      addMeeting(projectId, {
        title: meetingData.title,
        date: meetingData.date,
        time: meetingData.time,
        type: 'meeting',
        projectId,
        clientName: currentThread?.name,
      });
      showToast('Meeting added to project schedule & calendar');
    } else {
      showToast('Added to calendar');
    }
  };

  const handleScheduleCall = () => {
    const projectId = currentThread?.projectId;
    if (projectId) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      addMeeting(projectId, {
        title: `Call with ${currentThread?.name}`,
        date: tomorrow.toISOString().split('T')[0],
        time: '3:00 PM',
        type: 'call',
        projectId,
        clientName: currentThread?.name,
      });
      showToast('Call scheduled & synced to calendar');
    }
    setShowPlusMenu(false);
  };

  const handleAddAttachment = () => {
    setShowPlusMenu(false);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const projectId = currentThread?.projectId;
    if (!projectId) return;

    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const iconMap: Record<string, string> = {
        pdf: '📄', doc: '📄', docx: '📄',
        jpg: '🌆', jpeg: '🌆', png: '🌆', gif: '🌆', webp: '🌆',
        mp4: '🎥', mov: '🎥',
        psd: '🎨', ai: '🎨', fig: '🎨',
      };
      const icon = iconMap[ext] || '📎';
      const sizeKB = file.size / 1024;
      const size = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`;
      const url = URL.createObjectURL(file);

      addAttachment(projectId, {
        name: file.name,
        size,
        type: file.type,
        url,
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        icon,
      });
    });

    showToast(`${files.length} file${files.length > 1 ? 's' : ''} added to project`);
    e.target.value = '';
  };

  const openZoomPicker = () => {
    setZoomTitle(`Zoom with ${currentThread?.name || 'Client'}`);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setZoomDate(tomorrow);
    setZoomTime('14:00');
    setShowZoomPicker(true);
    setShowPlusMenu(false);
  };

  const confirmZoomSchedule = () => {
    if (!zoomDate) return;
    const projectId = currentThread?.projectId;
    const h = parseInt(zoomTime.split(':')[0]);
    const m = zoomTime.split(':')[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const timeStr = `${h12}:${m} ${ampm}`;

    if (projectId) {
      addMeeting(projectId, {
        title: zoomTitle || `Zoom with ${currentThread?.name}`,
        date: format(zoomDate, 'yyyy-MM-dd'),
        time: timeStr,
        type: 'call',
        projectId,
        clientName: currentThread?.name,
      });
      showToast('Zoom call scheduled & synced to calendar');
    }
    setShowZoomPicker(false);
  };

  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const h = 8 + Math.floor(i / 2);
    const m = i % 2 === 0 ? '00' : '30';
    return `${h.toString().padStart(2, '0')}:${m}`;
  });

  return (
    <div className={`h-[calc(100vh-52px)] pb-14 md:pb-0 transition-all duration-200 ${showCollabPanel ? 'md:grid md:grid-cols-[280px_1fr_320px]' : 'md:grid md:grid-cols-[280px_1fr]'} flex flex-col md:flex`}>
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.psd,.ai,.fig,.mp4,.mov,.zip" className="hidden" onChange={handleFileSelected} />
      {/* Thread list — hidden on mobile when chat is open */}
      <div className={`bg-card border-r border-border overflow-y-auto ${mobileShowChat ? 'hidden md:block' : 'block'}`}>
        <div className="p-4 border-b border-border text-sm font-extrabold tracking-[-0.03em]">Messages</div>
        {threads.map(t => (
          <div
            key={t.id}
            onClick={() => { setActiveThread(t.id); setMobileShowChat(true); }}
            className={`p-3 px-4 border-b border-border cursor-pointer transition-colors duration-150 flex gap-2.5 items-start active:bg-accent ${
              activeThread === t.id ? 'bg-otj-blue-bg' : 'hover:bg-otj-off'
            }`}
          >
            <div onClick={(e) => { e.stopPropagation(); navigate(`/client/${t.clientId}`); }} className="w-9 h-9 rounded-full bg-otj-off flex items-center justify-center text-[11px] font-bold text-otj-text shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all">{t.initials}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-bold mb-px">{t.name}</div>
              <div className="text-[11.5px] text-otj-text whitespace-nowrap overflow-hidden text-ellipsis">{t.preview}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-[10.5px] text-otj-muted">{t.time}</div>
              {t.unread > 0 && <div className="w-[18px] h-[18px] rounded-full bg-otj-blue text-primary-foreground text-[9px] font-bold flex items-center justify-center">{t.unread}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Message area — hidden on mobile when threads list is showing */}
      <div className={`flex flex-col h-full ${mobileShowChat ? 'block' : 'hidden md:flex'}`}>
        {/* Header */}
        <div className="p-3.5 px-[18px] border-b border-border bg-card flex items-center gap-3">
          {/* Mobile back button */}
          <button onClick={() => setMobileShowChat(false)} className="md:hidden w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer text-sm text-otj-text shrink-0">←</button>
          <div onClick={() => navigate(`/client/${currentThread?.clientId}`)} className="w-9 h-9 rounded-full bg-otj-off flex items-center justify-center text-[11px] font-bold text-otj-text cursor-pointer hover:ring-2 hover:ring-primary transition-all">{currentThread?.initials || 'RH'}</div>
          <div
            onClick={() => setShowCollabPanel(prev => !prev)}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          >
            <div className="text-sm font-extrabold tracking-[-0.03em]">{currentThread?.name || 'Randa Hatem'}</div>
            <div className="text-[10px] font-semibold text-otj-blue uppercase tracking-[0.05em]">
              {linkedProj?.name || 'No Project'}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Plus button */}
            <div className="relative">
              <button
                onClick={() => setShowPlusMenu(prev => !prev)}
                className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer text-base text-otj-text hover:border-foreground hover:text-foreground transition-all duration-150 active:scale-95"
              >+</button>
              {showPlusMenu && (
                <div className="absolute top-10 right-0 w-[200px] bg-card border border-border rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] py-1.5 z-[200] animate-fade-up">
                  <div onClick={openZoomPicker} className="px-3.5 py-2.5 text-[12px] font-semibold text-foreground cursor-pointer hover:bg-otj-off flex items-center gap-2">
                    Schedule Zoom Call
                  </div>
                  <div onClick={handleScheduleCall} className="px-3.5 py-2.5 text-[12px] font-semibold text-foreground cursor-pointer hover:bg-otj-off flex items-center gap-2">
                    Schedule Phone Call
                  </div>
                  <div className="h-px bg-border mx-2 my-1" />
                  <div onClick={handleAddAttachment} className="px-3.5 py-2.5 text-[12px] font-semibold text-foreground cursor-pointer hover:bg-otj-off flex items-center gap-2">
                    Add Attachment to Project
                  </div>
                </div>
              )}
            </div>
            {/* View Project */}
            {linkedProj && (
              <button
                onClick={() => navigate(`/project/${linkedProj.id}`)}
                className="text-[11.5px] font-semibold px-3 py-[5px] rounded-full border border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground"
              >View Project</button>
            )}
          </div>
        </div>

        {/* Pinned offer card */}
        <div className={`mx-3 mt-3 p-3.5 px-4 rounded-[14px] border-[1.5px] relative ${
          offerLocked ? 'border-otj-green-border bg-otj-green-bg' : 'border-otj-yellow-border bg-otj-yellow-bg'
        }`}>
          <div className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5 ${offerLocked ? 'text-otj-green' : 'text-otj-yellow'}`}>
            {offerLocked ? 'OFFER LOCKED · READY TO PAY' : 'ACTIVE BRIEF · NEGOTIATING'}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2.5 text-center md:text-left">
            <div><div className="text-[9.5px] uppercase tracking-[0.08em] text-otj-text mb-0.5">Package</div><div className="text-[13px] font-extrabold tracking-[-0.02em]">Full Day</div></div>
            <div><div className="text-[9.5px] uppercase tracking-[0.08em] text-otj-text mb-0.5">Price</div><div className="text-[13px] font-extrabold tracking-[-0.02em]">3,500 EGP</div></div>
            <div><div className="text-[9.5px] uppercase tracking-[0.08em] text-otj-text mb-0.5">Timeline</div><div className="text-[13px] font-extrabold tracking-[-0.02em]">5 days</div></div>
          </div>
          {offerLocked ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div className="text-xs font-bold text-otj-green flex items-center gap-1.5 flex-wrap">Both parties agreed · 3,500 EGP · 5 days · 40 photos</div>
              <button onClick={() => showToast('Opening payment… 50% deposit: 1,750 EGP')} className="px-3 py-[7px] rounded-full bg-primary border-primary text-primary-foreground text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 active:scale-[0.98]">Pay 50% Deposit →</button>
            </div>
          ) : (
            <div className="flex gap-1.5">
              <button onClick={() => { setOfferLocked(true); showToast('Offer locked!'); }} className="flex-1 py-[7px] rounded-full text-xs font-bold cursor-pointer transition-all duration-150 bg-primary border-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]">Accept</button>
              <button onClick={onOpenCounter} className="flex-1 py-[7px] rounded-full text-xs font-bold cursor-pointer transition-all duration-150 border-[1.5px] border-otj-yellow text-otj-yellow bg-card hover:bg-otj-yellow-bg active:scale-[0.98]">Counter</button>
              <button onClick={() => showToast('Brief declined')} className="flex-1 py-[7px] rounded-full text-xs font-bold cursor-pointer transition-all duration-150 border-[1.5px] border-border bg-card hover:border-foreground active:scale-[0.98]">Decline</button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div ref={threadRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
          {messages.map((msg, i) => msg.type === 'calendar' ? (
            <div key={i} className="bg-otj-blue-bg border border-otj-blue-border rounded-[14px] p-3 px-4 max-w-[320px] self-start">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-blue">Calendar Mention Detected</span>
              </div>
              <div className="text-[14px] font-extrabold tracking-[-0.02em] text-foreground mb-2">
                {msg.meetingData ? `${msg.meetingData.title} · ${msg.meetingData.date}, ${msg.meetingData.time}` : msg.text}
              </div>
              <div className="flex gap-2">
                <button onClick={() => msg.meetingData && handleAddMeeting(msg.meetingData)} className="flex-1 text-[12px] font-bold py-[7px] rounded-full cursor-pointer transition-all duration-150 bg-otj-blue text-primary-foreground active:scale-[0.98]">+ Add to Calendar</button>
                <button className="flex-1 text-[12px] font-bold py-[7px] rounded-full cursor-pointer transition-all duration-150 border-[1.5px] border-otj-blue-border text-otj-blue bg-card">Dismiss</button>
              </div>
            </div>
          ) : (
            <div key={i} className={msg.isMe ? 'self-end' : 'self-start'}>
              <div className={`max-w-[70%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
                msg.isMe
                  ? 'bg-primary text-primary-foreground rounded-[14px_14px_4px_14px]'
                  : 'bg-card border border-border rounded-[4px_14px_14px_14px]'
              }`}>{msg.text}</div>
              <div className={`text-[10.5px] text-otj-muted mt-0.5 ${msg.isMe ? 'text-right' : ''}`}>{msg.time}</div>
            </div>
          ))}
        </div>

        {/* Input + Zoom picker side by side */}
        <div className="border-t border-border bg-card">
          {showZoomPicker && (
            <div className="mx-3 mt-3 p-4 bg-otj-blue-bg border border-otj-blue-border rounded-[14px] animate-fade-up overflow-x-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-otj-blue">Schedule Zoom Call</span>
                </div>
                <button onClick={() => setShowZoomPicker(false)} className="w-6 h-6 rounded-full border border-otj-blue-border flex items-center justify-center text-[10px] text-otj-blue cursor-pointer hover:bg-card">✕</button>
              </div>

              {/* Title */}
              <input
                value={zoomTitle}
                onChange={e => setZoomTitle(e.target.value)}
                placeholder="Meeting title…"
                className="w-full px-3 py-2 rounded-lg border border-otj-blue-border bg-card text-[13px] text-foreground outline-none mb-3 font-semibold"
              />

              <div className="flex flex-col md:flex-row gap-3">
                {/* Calendar */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={zoomDate}
                    onSelect={setZoomDate}
                    className={cn("p-2 pointer-events-auto text-xs")}
                  />
                </div>

                {/* Time slots */}
                <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto hide-scrollbar pr-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-muted mb-1">Time</div>
                  {timeSlots.map(slot => {
                    const h = parseInt(slot.split(':')[0]);
                    const m = slot.split(':')[1];
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
                    return (
                      <button
                        key={slot}
                        onClick={() => setZoomTime(slot)}
                        className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-100 whitespace-nowrap ${
                          zoomTime === slot
                            ? 'bg-otj-blue text-primary-foreground'
                            : 'bg-card border border-border text-foreground hover:border-otj-blue'
                        }`}
                      >{h12}:{m} {ampm}</button>
                    );
                  })}
                </div>
              </div>

              {/* Confirm */}
              <div className="flex gap-2 mt-3">
                <button onClick={confirmZoomSchedule} className="flex-1 text-[12px] font-bold py-[7px] rounded-full cursor-pointer bg-otj-blue text-primary-foreground transition-all duration-150 hover:opacity-90">
                  ✓ Schedule {zoomDate ? format(zoomDate, 'MMM d') : ''} {(() => { const h = parseInt(zoomTime.split(':')[0]); const m = zoomTime.split(':')[1]; return `${h > 12 ? h - 12 : h}:${m} ${h >= 12 ? 'PM' : 'AM'}`; })()}
                </button>
                <button onClick={() => setShowZoomPicker(false)} className="text-[12px] font-bold px-4 py-[7px] rounded-full cursor-pointer border border-otj-blue-border text-otj-blue bg-card transition-all duration-150">Cancel</button>
              </div>
            </div>
          )}

          <div className="p-3 px-3.5 flex gap-2 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message… (mention a date to auto-sync to calendar)"
              rows={1}
              className="flex-1 px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none resize-none transition-all duration-150 leading-relaxed focus:border-foreground focus:bg-card min-h-[44px]"
            />
            <button onClick={sendMessage} className="w-9 h-9 rounded-full border-none bg-primary text-primary-foreground cursor-pointer text-base flex items-center justify-center shrink-0 transition-all duration-150 hover:bg-primary/90 active:scale-95">↑</button>
          </div>
        </div>
      </div>

      {/* Right Collaboration Panel */}
      {showCollabPanel && (
        <div className="hidden md:block bg-card border-l border-border overflow-y-auto">
          {/* Panel header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-[15px] font-extrabold tracking-[-0.03em]">Collaboration</span>
            <button onClick={() => setShowCollabPanel(false)} className="w-7 h-7 rounded-full border border-border bg-card flex items-center justify-center cursor-pointer text-otj-text hover:border-foreground text-xs">✕</button>
          </div>

          <div className="p-4">
            {/* Client Profile */}
            <div className="mb-6">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Client Profile</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-otj-off flex items-center justify-center text-[13px] font-bold text-otj-text">{currentThread?.initials}</div>
                <div>
                  <div className="text-[14px] font-extrabold tracking-[-0.02em]">{currentThread?.name}</div>
                  <div className="text-[11px] text-otj-text">Creative Director</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-otj-muted w-12">Email:</span>
                  <span className="text-[11.5px] font-semibold text-foreground">{currentThread?.name.split(' ')[0].toLowerCase()}.{currentThread?.name.split(' ')[1]?.toLowerCase() || ''}@edita.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-otj-muted w-12">Phone:</span>
                  <span className="text-[11.5px] font-semibold text-foreground">+20 100 123 4567</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border mb-5" />

            {/* Project Overview */}
            {linkedProj && (
              <div className="mb-6">
                <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Project Overview</span>
                </div>
                <div className="text-[15px] font-extrabold tracking-[-0.02em] mb-1.5">{linkedProj.name}</div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className="w-[7px] h-[7px] rounded-full bg-otj-green" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-otj-green">Ongoing</span>
                </div>
                <div className="text-[12px] text-otj-text leading-relaxed mb-3">
                  Complete visual identity refresh for {linkedProj.clientCompany} including packaging, marketing materials, and digital assets.
                </div>
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-otj-muted">Start:</span>
                    <span className="text-[11.5px] font-semibold text-foreground">Feb 15, 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-otj-muted">Deadline:</span>
                    <span className="text-[11.5px] font-semibold text-foreground">{linkedProj.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-otj-muted">Budget:</span>
                    <span className="text-[11.5px] font-extrabold text-foreground">{linkedProj.budget}</span>
                  </div>
                </div>
                {/* Progress */}
                <div className="flex gap-[3px] mb-3">
                  {linkedProj.phases.map((phase) => (
                    <div key={phase.num} className={`h-1.5 flex-1 rounded-full ${
                      phase.status === 'complete' ? 'bg-otj-green' :
                      phase.status === 'active' ? 'bg-otj-blue' : 'bg-otj-light'
                    }`} />
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/project/${linkedProj.id}`)}
                  className="w-full text-[11.5px] font-bold py-2 rounded-full border border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground flex items-center justify-center gap-1.5"
                >↗ View Full Project</button>
              </div>
            )}

            <div className="h-px bg-border mb-5" />

            {/* Upcoming Schedule */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted">Upcoming</span>
              </div>
              {(() => {
                const meetings = linkedProj?.meetings || [];
                const tasks = linkedProj?.phases.flatMap(ph => ph.tasks.filter(t => !t.done).map(t => ({ text: t.text, due: t.due, phase: ph.num }))) || [];
                if (meetings.length === 0 && tasks.length === 0) return <div className="text-[12px] text-otj-muted py-2">No upcoming items</div>;
                return (
                  <div className="flex flex-col gap-[5px]">
                    {meetings.map((m, i) => (
                      <div key={`m-${i}`} className="flex items-center gap-2 p-[7px_10px] rounded-[9px] hover:bg-otj-off transition-colors">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${m.type === 'call' ? 'bg-otj-blue' : 'bg-otj-green'}`} />
                        <div className="flex-1">
                          <div className="text-[11.5px] font-bold tracking-[-0.01em]">{m.title}</div>
                          <div className="text-[10.5px] text-otj-text">{m.date} · {m.time}</div>
                        </div>
                      </div>
                    ))}
                    {tasks.slice(0, 3).map((t, i) => (
                      <div key={`t-${i}`} className="flex items-center gap-2 p-[7px_10px] rounded-[9px] hover:bg-otj-off transition-colors">
                        <div className="w-2 h-2 rounded-full shrink-0 bg-otj-yellow" />
                        <div className="flex-1">
                          <div className="text-[11.5px] font-bold tracking-[-0.01em]">{t.text}</div>
                          <div className="text-[10.5px] text-otj-text">Due {t.due} · Phase {t.phase}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-1.5">
              <button onClick={openZoomPicker} className="text-[11.5px] font-bold w-full py-2 rounded-full border border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground">Schedule Zoom</button>
              <button onClick={handleAddAttachment} className="text-[11.5px] font-bold w-full py-2 rounded-full border border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground">Add Attachment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
