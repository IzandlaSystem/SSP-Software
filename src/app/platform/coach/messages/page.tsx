'use client';

import * as React from 'react';
import * as Icons from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'coach' | 'contact';
  text: string;
  timestamp: string;
}

interface ChatThread {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  messages: ChatMessage[];
}

export default function MessagesPage() {
  const [activeThreadId, setActiveThreadId] = React.useState<string>('1');
  const [inputText, setInputText] = React.useState<string>('');

  // Initial mock threads and historical messages
  const [threads, setThreads] = React.useState<ChatThread[]>([
    {
      id: '1',
      name: 'Lucas Sterling',
      role: 'Midfielder #8',
      initials: 'LS',
      avatarColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      lastMessage: 'Should I skip tomorrow\'s high-speed repeats?',
      lastTime: '10:45 AM',
      unread: true,
      messages: [
        { id: '1-1', sender: 'contact', text: 'Hey Coach, I saw my ACWR is up to 1.62 in the overview dashboard today.', timestamp: '10:40 AM' },
        { id: '1-2', sender: 'coach', text: 'Yes, Lucas. We noticed your chronic strain levels are hitting warning boundaries. How are your hamstrings feeling?', timestamp: '10:42 AM' },
        { id: '1-3', sender: 'contact', text: 'A bit tight from Saturday\'s training match play. Should I skip tomorrow\'s high-speed repeats?', timestamp: '10:45 AM' }
      ]
    },
    {
      id: '2',
      name: 'Marcus Vane',
      role: 'Forward #9',
      initials: 'MV',
      avatarColor: 'bg-brand-blue/10 text-brand-blue border-brand-blue/20',
      lastMessage: 'Got it coach, heading to the recovery pool now.',
      lastTime: 'Yesterday',
      unread: false,
      messages: [
        { id: '2-1', sender: 'coach', text: 'Marcus, your workload distance today was outstanding but max speed limits were below cohort average. All good?', timestamp: '4:15 PM' },
        { id: '2-2', sender: 'contact', text: 'All good coach, focused on short speed turns rather than absolute peak velocity loops.', timestamp: '4:30 PM' },
        { id: '2-3', sender: 'coach', text: 'Makes sense. Make sure to complete today\'s workload status update tonight.', timestamp: '4:32 PM' },
        { id: '2-4', sender: 'contact', text: 'Got it coach, heading to the recovery pool now.', timestamp: '4:35 PM' }
      ]
    },
    {
      id: '3',
      name: 'Coach Dan (Scout)',
      role: 'Assistant Coach',
      initials: 'CD',
      avatarColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      lastMessage: 'The conditioning targets look solid for this week.',
      lastTime: 'Yesterday',
      unread: false,
      messages: [
        { id: '3-1', sender: 'contact', text: 'Dan, did you review the sessional logs from the high-velocity conditioning block?', timestamp: 'Yesterday' },
        { id: '3-2', sender: 'contact', text: 'The conditioning targets look solid for this week.', timestamp: 'Yesterday' }
      ]
    },
    {
      id: '4',
      name: 'Son Heung-min',
      role: 'Forward #7',
      initials: 'SH',
      avatarColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      lastMessage: 'Tracker is in locker 3, sync completed.',
      lastTime: '2 days ago',
      unread: false,
      messages: [
        { id: '4-1', sender: 'contact', text: 'Coach, completed the post-session sync. Tracker is in locker 3, sync completed.', timestamp: '2 days ago' }
      ]
    }
  ]);

  const activeThread = React.useMemo(() => {
    return threads.find((t) => t.id === activeThreadId) || threads[0];
  }, [threads, activeThreadId]);

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: ChatMessage = {
      id: `${activeThread.id}-${activeThread.messages.length + 1}`,
      sender: 'coach',
      text: inputText.trim(),
      timestamp: timeStr
    };

    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.id === activeThread.id) {
          return {
            ...thread,
            lastMessage: inputText.trim(),
            lastTime: timeStr,
            unread: false,
            messages: [...thread.messages, newMessage]
          };
        }
        return thread;
      })
    );

    setInputText('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-blue font-extrabold text-xs mb-1">
            <Icons.MessageSquare className="h-4 w-4" />
            <span>Communications Hub</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950">
            Roster & Staff Messaging
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Maintain direct channels with athletes and assistant coaches. Synchronise subjective readiness reflections.
          </p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl shadow-xl h-[550px] flex overflow-hidden">
        
        {/* Left Side: Threads list */}
        <div className="w-full md:w-80 border-r border-zinc-300 flex flex-col shrink-0">
          <div className="p-4 border-b border-zinc-300">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                className="w-full bg-zinc-100 border border-zinc-200 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-blue font-semibold"
                placeholder="Search conversations..."
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
            {threads.map((thread) => {
              const isSelected = thread.id === activeThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    // Mark as read when selected
                    setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: false } : t));
                  }}
                  className={`w-full p-4 flex items-start space-x-3 transition-colors cursor-pointer text-left ${
                    isSelected ? 'bg-zinc-100' : 'hover:bg-zinc-100/45'
                  }`}
                >
                  {/* Initials Circle */}
                  <div className={`h-9 w-9 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 select-none ${thread.avatarColor}`}>
                    {thread.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-black text-zinc-800 truncate">{thread.name}</h4>
                      <span className="text-[9px] text-zinc-500">{thread.lastTime}</span>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-medium block mt-0.5">{thread.role}</span>
                    <p className={`text-[10px] truncate mt-1 leading-normal ${
                      thread.unread && !isSelected ? 'text-white font-extrabold' : 'text-zinc-600 font-semibold'
                    }`}>
                      {thread.lastMessage}
                    </p>
                  </div>

                  {thread.unread && !isSelected && (
                    <span className="h-2 w-2 bg-brand-blue rounded-full inline-block shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Messages feed */}
        <div className="hidden md:flex flex-col flex-1 bg-zinc-100">
          {/* Thread Header */}
          <div className="h-16 border-b border-zinc-300 px-6 flex items-center justify-between shrink-0 bg-zinc-50/20">
            <div className="flex items-center space-x-3">
              <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-bold text-[10px] ${activeThread.avatarColor}`}>
                {activeThread.initials}
              </div>
              <div>
                <h3 className="text-xs font-black text-zinc-950">{activeThread.name}</h3>
                <span className="text-[9px] font-bold text-zinc-500 block">{activeThread.role}</span>
              </div>
            </div>

            <span className="text-[10px] text-zinc-500 font-bold flex items-center space-x-1">
              <Icons.Shield className="h-3.5 w-3.5 text-zinc-600" />
              <span>Channel Encrypted</span>
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col justify-end bg-[radial-gradient(ellipse_at_top,#1f293708,transparent_50%)]">
            <div className="space-y-4 overflow-y-auto max-h-[360px] pr-2">
              {activeThread.messages.map((message) => {
                const isCoach = message.sender === 'coach';
                return (
                  <div 
                    key={message.id} 
                    className={`flex ${isCoach ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md rounded-2xl p-3.5 border text-xs leading-relaxed ${
                      isCoach 
                        ? 'bg-brand-blue border-brand-blue text-white font-semibold rounded-tr-none' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-800 font-semibold rounded-tl-none'
                    }`}>
                      <p>{message.text}</p>
                      <span className={`text-[8px] mt-1.5 block text-right ${
                        isCoach ? 'text-red-200' : 'text-zinc-500'
                      }`}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Input Box */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-4 border-t border-zinc-300 bg-zinc-50/30 shrink-0 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-zinc-100 border border-zinc-200 focus:border-brand-blue rounded-xl px-4 py-3 text-xs text-white focus:outline-none font-semibold"
              placeholder={`Send message to ${activeThread.name.split(' ')[0]}...`}
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 bg-brand-blue hover:bg-brand-blue/90 disabled:bg-zinc-800 text-white disabled:text-zinc-500 rounded-xl transition-all cursor-pointer shadow shadow-brand-blue/10 flex items-center justify-center shrink-0"
            >
              <Icons.Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>

        {/* Responsive placeholder in mobile view to alert about full interface */}
        <div className="flex md:hidden flex-col items-center justify-center p-8 text-center flex-1 bg-zinc-100">
          <Icons.MessageSquare className="h-10 w-10 text-zinc-700 animate-bounce mb-2" />
          <h4 className="text-xs font-black text-zinc-950">Mobile Chat Active</h4>
          <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
            Select a thread in the sidebar to engage. For dual pane layout, rotate to landscape.
          </p>
        </div>

      </div>

    </div>
  );
}




