import React from 'react';
import { 
  MessageSquare, 
  Bell, 
  Users, 
  Radio, 
  Newspaper 
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';

export const TopTabs: React.FC = () => {
  const { activeTab, setActiveTab, chats } = useGitPitStore();

  const totalUnread = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const groupCount = chats.filter((c) => c.type === 'group').length;
  const broadcastCount = chats.filter((c) => c.type === 'broadcast').length;

  const tabs = [
    {
      id: 'all' as const,
      label: 'All',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: null
    },
    {
      id: 'unread' as const,
      label: 'Unread',
      icon: <Bell className="w-4 h-4" />,
      badge: totalUnread > 0 ? totalUnread : null
    },
    {
      id: 'groups' as const,
      label: 'Groups',
      icon: <Users className="w-4 h-4" />,
      badge: groupCount > 0 ? groupCount : null
    },
    {
      id: 'broadcast' as const,
      label: 'Broadcasts',
      icon: <Radio className="w-4 h-4" />,
      badge: broadcastCount > 0 ? broadcastCount : null
    },
    {
      id: 'news' as const,
      label: 'News Flash',
      icon: <Newspaper className="w-4 h-4" />,
      badge: 'LIVE'
    }
  ];

  return (
    <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--header-bg)] px-1 sm:px-3 overflow-x-auto no-scrollbar shrink-0 select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center justify-center gap-1.5 py-2.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              isActive
                ? 'text-[var(--accent)] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== null && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  typeof tab.badge === 'string'
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[var(--badge-bg)] text-[var(--badge-text)]'
                }`}
              >
                {tab.badge}
              </span>
            )}

            {/* Active Indicator Underline */}
            {isActive && (
              <div className="absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-[var(--accent)] rounded-t-full shadow-sm" />
            )}
          </button>
        );
      })}
    </div>
  );
};