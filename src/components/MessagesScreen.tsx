import React, { useState, useRef, useEffect } from 'react';
import { showToast } from './Toast';
import { useProjects } from '../context/ProjectContext';

const threads = [
  { id: 'randa', name: 'Randa Hatem', emoji: '👩‍💼', preview: 'Can we do 3,200 EGP?', time: '10:35 AM', unread: 2, projectId: 'proj-existing-1' },
  { id: 'ahmed', name: 'Ahmed Karim', emoji: '👨‍💼', preview: 'Photos look great! Can we schedule…', time: 'Yesterday', unread: 1, projectId: 'proj-existing-2' },
  { id: 'sara', name: 'Sara M.', emoji: '🎨', preview: 'Sent you the brand guidelines', time: 'Mon', unread: 0, projectId: 'proj-existing-3' },
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
  const { addMeeting, activeProjects } = useProjects();
  const [activeThread, setActiveThread] = useState('randa');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [offerLocked, setOfferLocked] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  const currentThread = threads.find(t => t.id === activeThread);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, isMe: true, time: 'You · Just now · ✓' }]);
    const text = input;
    setInput('');

    // Detect date/meeting mentions
    const dateWords = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday','tomorrow','march','april','next week','pm','am','meeting','call','schedule'];
    if (dateWords.some(w => text.toLowerCase().includes(w))) {
      // Extract a rough meeting title
      const meetingTitle = text.length > 40 ? text.substring(0, 40) + '…' : text;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: `📅 Schedule detected: "${meetingTitle}"`,
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
      showToast('📅 Meeting added to project schedule & calendar');
    } else {
      showToast('📅 Added to calendar');
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
      showToast('📞 Call scheduled & added to project');
    }
  };

  return (
    <div className="grid grid-cols-[280px_1fr_300px] h-[calc(100vh-52px)]">
      {/* Thread list */}
      <div className="bg-card border-r border-border overflow-y-auto">
        <div className="p-4 border-b border-border text-sm font-extrabold tracking-[-0.03em]">Messages</div>
        {threads.map(t => (
          <div
            key={t.id}
            onClick={() => { setActiveThread(t.id); showToast('Opening conversation with ' + t.name + '…'); }}
            className={`p-3 px-4 border-b border-border cursor-pointer transition-colors duration-150 flex gap-2.5 items-start ${
              activeThread === t.id ? 'bg-otj-blue-bg' : 'hover:bg-otj-off'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-otj-off flex items-center justify-center text-lg shrink-0">{t.emoji}</div>
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

      {/* Message area */}
      <div className="flex flex-col h-full">
        <div className="p-3.5 px-[18px] border-b border-border bg-card flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-otj-off flex items-center justify-center text-lg">{currentThread?.emoji || '👩‍💼'}</div>
          <div>
            <div className="text-sm font-extrabold tracking-[-0.03em]">{currentThread?.name || 'Randa Hatem'}</div>
            <div className="text-[11px] text-otj-green">Online</div>
          </div>
          <div className="ml-auto flex gap-1.5">
            <button onClick={() => showToast('Opening profile…')} className="text-[11.5px] font-semibold px-3 py-[5px] rounded-full border border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">View Profile</button>
            <button onClick={handleScheduleCall} className="text-[11.5px] font-semibold px-3 py-[5px] rounded-full border border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">📞 Schedule Call</button>
            <button onClick={() => showToast('Creating brief…')} className="text-[11.5px] font-semibold px-3 py-[5px] rounded-full border border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground hover:text-foreground">New Brief</button>
          </div>
        </div>

        {/* Pinned offer card */}
        <div className={`mx-3 mt-3 p-3.5 px-4 rounded-[14px] border-[1.5px] relative ${
          offerLocked ? 'border-otj-green-border bg-otj-green-bg' : 'border-otj-yellow-border bg-otj-yellow-bg'
        }`}>
          <div className={`text-[10px] font-bold uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5 ${offerLocked ? 'text-otj-green' : 'text-otj-yellow'}`}>
            {offerLocked ? '🔒 OFFER LOCKED · READY TO PAY' : '📋 ACTIVE BRIEF · NEGOTIATING'}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-2.5">
            <div><div className="text-[9.5px] uppercase tracking-[0.08em] text-otj-text mb-0.5">Package</div><div className="text-[13px] font-extrabold tracking-[-0.02em]">Full Day</div></div>
            <div><div className="text-[9.5px] uppercase tracking-[0.08em] text-otj-text mb-0.5">Price</div><div className="text-[13px] font-extrabold tracking-[-0.02em]">3,500 EGP</div></div>
            <div><div className="text-[9.5px] uppercase tracking-[0.08em] text-otj-text mb-0.5">Timeline</div><div className="text-[13px] font-extrabold tracking-[-0.02em]">5 days</div></div>
          </div>
          {offerLocked ? (
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-otj-green flex items-center gap-1.5">✓ Both parties agreed · 3,500 EGP · 5 days · 40 photos</div>
              <button onClick={() => showToast('Opening payment… 50% deposit: 1,750 EGP')} className="px-3 py-[7px] rounded-full bg-primary border-primary text-primary-foreground text-xs font-bold cursor-pointer">Pay 50% Deposit →</button>
            </div>
          ) : (
            <div className="flex gap-1.5">
              <button onClick={() => { setOfferLocked(true); showToast('🔒 Offer locked!'); }} className="flex-1 py-[7px] rounded-full text-xs font-bold cursor-pointer transition-all duration-150 bg-primary border-primary text-primary-foreground hover:bg-primary/90">✓ Accept</button>
              <button onClick={onOpenCounter} className="flex-1 py-[7px] rounded-full text-xs font-bold cursor-pointer transition-all duration-150 border-[1.5px] border-otj-yellow text-otj-yellow bg-card hover:bg-otj-yellow-bg">↕ Counter</button>
              <button onClick={() => showToast('Brief declined')} className="flex-1 py-[7px] rounded-full text-xs font-bold cursor-pointer transition-all duration-150 border-[1.5px] border-border bg-card hover:border-foreground">✕ Decline</button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div ref={threadRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
          {messages.map((msg, i) => msg.type === 'calendar' ? (
            <div key={i} className="bg-otj-blue-bg border border-otj-blue-border rounded-[14px] p-3 px-4 max-w-[320px] self-start">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[14px]">📅</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-otj-blue">Calendar Mention Detected</span>
              </div>
              <div className="text-[14px] font-extrabold tracking-[-0.02em] text-foreground mb-2">
                {msg.meetingData ? `${msg.meetingData.title} · ${msg.meetingData.date}, ${msg.meetingData.time}` : msg.text}
              </div>
              <div className="flex gap-2">
                <button onClick={() => msg.meetingData && handleAddMeeting(msg.meetingData)} className="flex-1 text-[12px] font-bold py-[7px] rounded-full cursor-pointer transition-all duration-150 bg-otj-blue text-primary-foreground">+ Add to Calendar</button>
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

        {/* Input */}
        <div className="p-3 px-3.5 border-t border-border bg-card flex gap-2 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type a message… (mention a date to auto-sync to calendar)"
            rows={1}
            className="flex-1 px-3.5 py-2.5 rounded-xl border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none resize-none transition-all duration-150 leading-relaxed focus:border-foreground focus:bg-card"
          />
          <button onClick={sendMessage} className="w-9 h-9 rounded-full border-none bg-primary text-primary-foreground cursor-pointer text-base flex items-center justify-center shrink-0 transition-all duration-150 hover:bg-primary/90">↑</button>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="bg-card border-l border-border overflow-y-auto p-4">
        <div className="mb-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2.5">Linked Project</div>
          {(() => {
            const linkedProj = activeProjects.find(p => p.id === currentThread?.projectId);
            if (!linkedProj) return <div className="text-[12px] text-otj-muted">No linked project</div>;
            const activePhase = linkedProj.phases.find(ph => ph.status === 'active');
            const phaseDone = linkedProj.phases.filter(p => p.status === 'complete').length;
            const pct = linkedProj.phases.length ? Math.round((phaseDone / linkedProj.phases.length) * 100) : 0;
            return (
              <div className="p-3 rounded-xl border border-border bg-otj-off cursor-pointer transition-all duration-150 hover:border-foreground">
                <div className="text-[13px] font-bold tracking-[-0.02em] mb-0.5">{linkedProj.name}</div>
                <div className="text-[11px] text-otj-blue mb-1.5">{activePhase ? `Phase ${activePhase.num} · ${activePhase.title}` : 'Awaiting Start'}</div>
                <div className="h-1 rounded-full bg-otj-light overflow-hidden"><div className="h-full rounded-full bg-otj-blue" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })()}
        </div>

        {/* Upcoming schedule for linked project */}
        <div className="mb-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-2.5">Project Schedule</div>
          {(() => {
            const linkedProj = activeProjects.find(p => p.id === currentThread?.projectId);
            const meetings = linkedProj?.meetings || [];
            const tasks = linkedProj?.phases.flatMap(ph => ph.tasks.filter(t => !t.done).map(t => ({ text: t.text, due: t.due, phase: ph.num }))) || [];

            return (
              <div className="flex flex-col gap-[5px]">
                {meetings.map((m, i) => (
                  <div key={`m-${i}`} className="flex items-center gap-2 p-[7px_10px] rounded-[9px] cursor-pointer transition-all duration-150 hover:bg-otj-off">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${m.type === 'call' ? 'bg-otj-orange' : 'bg-otj-green'}`} />
                    <div className="flex-1">
                      <div className="text-[11.5px] font-bold tracking-[-0.01em]">{m.title}</div>
                      <div className="text-[10.5px] text-otj-text">{m.date} · {m.time}</div>
                    </div>
                  </div>
                ))}
                {tasks.slice(0, 3).map((t, i) => (
                  <div key={`t-${i}`} className="flex items-center gap-2 p-[7px_10px] rounded-[9px] cursor-pointer transition-all duration-150 hover:bg-otj-off">
                    <div className="w-2 h-2 rounded-full shrink-0 bg-otj-yellow" />
                    <div className="flex-1">
                      <div className="text-[11.5px] font-bold tracking-[-0.01em]">{t.text}</div>
                      <div className="text-[10.5px] text-otj-text">Due {t.due} · Phase {t.phase}</div>
                    </div>
                  </div>
                ))}
                {meetings.length === 0 && tasks.length === 0 && (
                  <div className="text-[12px] text-otj-muted text-center py-2">No upcoming items</div>
                )}
              </div>
            );
          })()}
        </div>

        <div className="flex flex-col gap-1.5">
          <button onClick={handleScheduleCall} className="text-[11.5px] font-bold w-full py-2 rounded-full border border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground">📞 Schedule Call</button>
          <button onClick={() => showToast('Attachment upload coming soon')} className="text-[11.5px] font-bold w-full py-2 rounded-full border border-border bg-card cursor-pointer transition-all duration-150 hover:border-foreground">📎 Add Attachment to Project</button>
        </div>
      </div>
    </div>
  );
};
