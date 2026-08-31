import React from 'react';
import { 
  Search, 
  Pin, 
  ShieldAlert, 
  Image as ImageIcon, 
  Mic, 
  MapPin, 
  CreditCard,
  Radio,
  Users
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';

export const ChatList: React.FC = () => {
  const { 
    chats, 
    activeChatId, 
    setActiveChatId, 
    activeTab, 
    searchQuery, 
    setSearchQuery 
  } = useGitPitStore();

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'unread') return (chat.unreadCount || 0) > 0;
    if (activeTab === 'groups') return chat.type === 'group';
    if (activeTab === 'broadcast') return chat.type === 'broadcast';
    return true;
  });

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const renderLastMessageSnippet = (chat: typeof chats[0]) => {
    const msg = chat.lastMessage;
    if (!msg) return <span className="italic opacity-60">No messages yet</span>;

    if (msg.type === 'location') {
      return (
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <MapPin className="w-3.5 h-3.5" /> Google Location
        </span>
      );
    }
    if (msg.type === 'audio') {
      return (
        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
          <Mic className="w-3.5 h-3.5" /> Voice Note ({msg.durationSeconds || 18}s)
        </span>
      );
    }
    if (msg.type === 'upi_payment') {
      return (
        <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
          <CreditCard className="w-3.5 h-3.5" /> UPI: ₹{msg.upiData?.amount}
        </span>
      );
    }
    if (msg.type === 'image') {
      return (
        <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium">
          <ImageIcon className="w-3.5 h-3.5" /> Photo / AI Art
        </span>
      );
    }

    return <span>{msg.content}</span>;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--sidebar-bg)]">
      {/* Search Input Bar */}
      <div className="p-2.5 border-b border-[var(--border-color)] bg-[var(--sidebar-bg)]">
        <div className="relative flex items-center bg-[var(--header-bg)] rounded-xl px-3 py-1.5 border border-transparent focus-within:border-[var(--accent)] transition-all">
          <Search className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start new chat..."
            className="w-full text-xs sm:text-sm bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Chat List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-color)]">
        {sortedChats.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-secondary)]">
            No conversations found for current filter.
          </div>
        ) : (
          sortedChats.map((chat) => {
            const isActive = activeChatId === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex items-center gap-1.5 px-1.5 py-1 transition-colors cursor-pointer select-none border-b border-[var(--border-color)]/30 ${
                  isActive
                    ? 'bg-black/10 dark:bg-white/10'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {/* Avatar with Stranger / Group Badge */}
                <div className="relative shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-7 h-7 rounded-full object-cover border border-[var(--border-color)]"
                  />
                  {chat.isStrangerChat ? (
                    <span 
                      className="absolute -bottom-0.5 -right-0.5 bg-red-500 text-white p-0.5 rounded-full shadow text-[7px]"
                      title="Stranger Shield Protection Active"
                    >
                      <ShieldAlert className="w-2 h-2" />
                    </span>
                  ) : chat.type === 'group' ? (
                    <span className="absolute -bottom-0.5 -right-0.5 bg-blue-500 text-white p-0.5 rounded-full shadow text-[7px]">
                      <Users className="w-2 h-2" />
                    </span>
                  ) : chat.type === 'broadcast' ? (
                    <span className="absolute -bottom-0.5 -right-0.5 bg-purple-500 text-white p-0.5 rounded-full shadow text-[7px]">
                      <Radio className="w-2 h-2" />
                    </span>
                  ) : null}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-[11px] text-[var(--text-primary)] truncate flex items-center gap-1">
                      {chat.name}
                    </span>

                    <span className={`text-[10px] ${chat.unreadCount > 0 ? 'text-[var(--badge-bg)] font-bold' : 'text-[var(--text-secondary)]'}`}>
                      {chat.updatedAt}
                    </span>
                  </div>



                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <div className="truncate pr-2 flex items-center gap-1">
                      {renderLastMessageSnippet(chat)}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {chat.isPinned && <Pin className="w-3.5 h-3.5 text-[var(--text-secondary)] fill-current rotate-45" />}
                      {chat.unreadCount > 0 && (
                        <span className="bg-[var(--badge-bg)] text-[var(--badge-text)] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};