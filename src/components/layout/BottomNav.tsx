import React from 'react';
import { 
  MessageCirclePlus, 
  CircleDot, 
  PhoneCall 
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';

export const BottomNav: React.FC = () => {
  const { 
    activeBottomNav, 
    setActiveBottomNav, 
    updateStore, 
    statusStories, 
    callLogs 
  } = useGitPitStore();

  const unseenStories = statusStories.filter(
    (s) => s.userId !== 'user_me' && !s.viewers.some((v) => v.userId === 'user_me')
  ).length;

  const missedCalls = callLogs.filter((c) => c.direction === 'missed').length;

  return (
    <nav className="flex items-center justify-around border-t border-[var(--border-color)] bg-[var(--header-bg)] pt-2 pb-[max(12px,env(safe-area-inset-bottom))] px-3 shrink-0 select-none z-10">

      {/* 1. New Chat Button / Tab */}
      <button
        onClick={() => {
          setActiveBottomNav('chats');
          updateStore(() => ({ newChatModalOpen: true }));
        }}
        className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-4 rounded-xl transition-all cursor-pointer ${
          activeBottomNav === 'chats'
            ? 'text-[var(--accent)] bg-[var(--accent)]/10 font-bold scale-105'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        title="Start New Chat, Create New Group, or New Broadcast List"
      >
        <div className="relative">
          <MessageCirclePlus className="w-5 h-5" />
        </div>
        <span>New Chat</span>
      </button>

      {/* 2. Status Button / Tab */}
      <button
        onClick={() => setActiveBottomNav('status')}
        className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-4 rounded-xl transition-all cursor-pointer relative ${
          activeBottomNav === 'status'
            ? 'text-[var(--accent)] bg-[var(--accent)]/10 font-bold scale-105'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        title="Set status and view contacts' 24h statuses"
      >
        <div className="relative">
          <CircleDot className="w-5 h-5" />
          {unseenStories > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--badge-bg)] rounded-full border-2 border-[var(--header-bg)] animate-pulse" />
          )}
        </div>
        <span>Status</span>
      </button>

      {/* 3. Calls Button / Tab */}
      <button
        onClick={() => setActiveBottomNav('calls')}
        className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-4 rounded-xl transition-all cursor-pointer relative ${
          activeBottomNav === 'calls'
            ? 'text-[var(--accent)] bg-[var(--accent)]/10 font-bold scale-105'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
        title="View audio/video call history, start calls & direct message"
      >
        <div className="relative">
          <PhoneCall className="w-5 h-5" />
          {missedCalls > 0 && (
            <span className="absolute -top-1 -right-1 text-[9px] bg-red-500 text-white font-bold px-1 rounded-full">
              {missedCalls}
            </span>
          )}
        </div>
        <span>Calls</span>
      </button>
    </nav>
  );
};