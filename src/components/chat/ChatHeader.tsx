import React, { useState } from 'react';
import { 
  ArrowLeft,
  Share2,
  Mail,
  Clock,
  BellOff,
  Bell, 
  Video, 
  Phone, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  UserPlus, 
  Trash2, 
  Ban, 
  Link as LinkIcon,
  Palette
} from 'lucide-react';
import { Chat } from '../../types';
import { soundEngine } from '../../utils/soundEffects';
import { useGitPitStore } from '../../store/gitPitStore';

interface ChatHeaderProps {
  chat: Chat;
  onOpenInfo: () => void;
  onOpenSearch: () => void;
  onOpenWallpaper: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onOpenInfo,
  onOpenSearch,
  onOpenWallpaper
}) => {
  const { 
    contacts, 
    messages,
    startCall, 
    setActiveChatId, 
    bulkClearChats, 
    strangerShieldMode,
    updateStore 
  } = useGitPitStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [disappearingModalOpen, setDisappearingModalOpen] = useState(false);

  const otherMemberId = chat.members.find((m) => m !== 'user_me');
  const contact = contacts.find((c) => c.id === otherMemberId);

  const isStranger = chat.isStrangerChat;
  const isStrictStranger = isStranger && strangerShieldMode === 'STRICT_ANTI_FRAUD';

  const handleAudioCall = () => {
    if (contact) {
      startCall(contact, 'audio');
    }
  };

  const handleVideoCall = () => {
    if (contact) {
      startCall(contact, 'video');
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-color)] bg-[var(--header-bg)] shrink-0 select-none z-20">
      {/* Left: Back (on mobile) + Avatar + Info */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <button
          onClick={() => setActiveChatId(null)}
          className="p-1.5 -ml-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] md:hidden rounded-full cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div onClick={onOpenInfo} className="relative cursor-pointer shrink-0">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-10 h-10 rounded-full object-cover border border-[var(--border-color)]"
          />
          {contact?.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--badge-bg)] rounded-full border-2 border-[var(--header-bg)]" />
          )}
        </div>

        <div onClick={onOpenInfo} className="flex flex-col min-w-0 cursor-pointer">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm sm:text-base text-[var(--text-primary)] truncate">
              {chat.name}
            </span>
            {chat.isMuted && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-0.5">
                <BellOff className="w-3 h-3" /> Muted
              </span>
            )}
            {isStranger ? (
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                <ShieldAlert className="w-3 h-3" /> Stranger
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> Protected
              </span>
            )}
          </div>

          <span className="text-xs text-[var(--text-secondary)] truncate">
            {isStranger 
              ? 'Unsaved contact • Stranger Shield Active'
              : (chat.type === 'group' ? `${chat.members.length} members` : (contact?.isOnline ? 'Online' : contact?.lastSeen || 'Tap for info'))
            }
          </span>
        </div>
      </div>

      {/* Right: Video Call, Audio Call & 3-Dot Chat Menu */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Video Call Button */}
        <button
          disabled={isStrictStranger}
          onClick={handleVideoCall}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isStrictStranger 
              ? 'opacity-30 cursor-not-allowed text-gray-400' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 active:scale-95'
          }`}
          title={isStrictStranger ? 'Video calls blocked by Stranger Shield Strict Mode' : 'Start Video Call'}
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Audio Call Button */}
        <button
          disabled={isStrictStranger}
          onClick={handleAudioCall}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isStrictStranger 
              ? 'opacity-30 cursor-not-allowed text-gray-400' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 active:scale-95'
          }`}
          title={isStrictStranger ? 'Audio calls blocked by Stranger Shield Strict Mode' : 'Start Audio Call'}
        >
          <Phone className="w-5 h-5" />
        </button>

        {/* 3-Dot Chat Menu Button */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            title="Chat settings & options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* 3-Dot Dropdown Menu for this Chat */}
          {menuOpen && (
            <div className="absolute right-0 top-10 z-50 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl py-1.5 w-56 text-xs font-semibold text-[var(--text-primary)] animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  updateStore((prev) => ({
                    chats: prev.chats.map((c) => c.id === chat.id ? { ...c, isMuted: !c.isMuted } : c)
                  }));
                  soundEngine.playClick();
                  alert(chat.isMuted ? '🔔 Notifications enabled for ' + chat.name : '🔕 ' + chat.name + ' is now Muted & Silent!');
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-black/5 dark:hover:bg-white/10 text-left cursor-pointer text-amber-600 dark:text-amber-400 font-bold"
              >
                <BellOff className="w-4 h-4" />
                <span>{chat.isMuted ? 'Unmute Notifications 🔔' : 'Mute & Silent Chat 🔕'}</span>
              </button>

              <button
                onClick={() => {
                  setDisappearingModalOpen(true);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-black/5 dark:hover:bg-white/10 text-left cursor-pointer text-purple-600 dark:text-purple-400 font-bold"
              >
                <Clock className="w-4 h-4" />
                <span>Disappearing Messages ({chat.disappearingDuration || 'OFF'})</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  const msgs = (messages[chat.id] || []).map((m: any) => `[${new Date(m.sentAt).toLocaleString()}] ${m.senderName}: ${m.content}`).join('\n');
                  const blob = new Blob([msgs], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `GitPit_${chat.name.replace(/\s+/g, '_')}_Chat_Export.txt`;
                  a.click();
                  alert(`📧 Exported ${chat.name} chat history! Ready to attach and send via Email.`);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-black/5 dark:hover:bg-white/10 text-left cursor-pointer text-blue-600 dark:text-blue-400 font-bold"
              >
                <Mail className="w-4 h-4" />
                <span>Export Chat via Email / File 📧</span>
              </button>

              <button
                onClick={() => { onOpenInfo(); setMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-black/5 dark:hover:bg-white/10 text-left cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>View Contact / Group Info</span>
              </button>

              <button
                onClick={() => { onOpenSearch(); setMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-black/5 dark:hover:bg-white/10 text-left cursor-pointer"
              >
                <Search className="w-4 h-4 text-blue-500" />
                <span>Search in Chat</span>
              </button>

              <button
                onClick={() => { onOpenWallpaper(); setMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-black/5 dark:hover:bg-white/10 text-left cursor-pointer"
              >
                <Palette className="w-4 h-4 text-purple-500" />
                <span>Change Wallpaper</span>
              </button>

              {isStranger && (
                <button
                  onClick={() => {
                    updateStore(() => ({ settingsModalOpen: true, settingsActiveBlock: 2 }));
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-left cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Save Contact to Phonebook</span>
                </button>
              )}

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://gitpit.meet/call/${chat.id}`);
                  alert('🔗 Sharable Call Link copied to clipboard!');
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-black/5 dark:hover:bg-white/10 text-left cursor-pointer"
              >
                <LinkIcon className="w-4 h-4 text-teal-500" />
                <span>Create Call Link</span>
              </button>

              <div className="my-1 border-t border-[var(--border-color)]" />

              <button
                onClick={() => {
                  bulkClearChats({ groups: chat.type === 'group', individuals: chat.type === 'individual' });
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-red-500/10 text-left text-red-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Chat History</span>
              </button>

              <button
                onClick={() => {
                  alert(`🚫 ${chat.name} has been reported & blocked.`);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-red-500/10 text-left text-red-600 font-bold cursor-pointer"
              >
                <Ban className="w-4 h-4" />
                <span>Block & Report</span>
              </button>
            </div>
          )}
        </div>
      </div>
    
      {/* 4 DISAPPEARING OPTIONS MODAL FOR THIS INDIVIDUAL / GROUP CHAT */}
      {disappearingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-150">
          <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-500" /> Disappearing Timer ({chat.name})
              </h3>
              <button onClick={() => setDisappearingModalOpen(false)} className="p-1 text-[var(--text-secondary)]">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              Choose disappearing message duration for this specific conversation:
            </p>

            <div className="space-y-2">
              {[
                { id: '24_HOURS', label: '24 Hours ⏱️' },
                { id: '7_DAYS', label: '7 Days 📅' },
                { id: '90_DAYS', label: '90 Days 🗓️' },
                { id: '180_DAYS', label: '180 Days 🕒' },
                { id: 'OFF', label: 'Off (Keep permanently)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    updateStore((prev) => ({
                      chats: prev.chats.map((c) => c.id === chat.id ? { ...c, disappearingDuration: opt.id as any } : c)
                    }));
                    soundEngine.playClick();
                    alert('⏳ Disappearing messages timer set to ' + opt.label + ' for ' + chat.name);
                    setDisappearingModalOpen(false);
                  }}
                  className={"w-full py-2.5 px-3 rounded-xl border text-left font-bold text-xs cursor-pointer flex items-center justify-between transition-all " + (
                    (chat.disappearingDuration || 'OFF') === opt.id
                      ? 'border-purple-500 bg-purple-500/20 text-[var(--text-primary)] shadow-xs'
                      : 'border-[var(--border-color)] bg-[var(--header-bg)] hover:bg-black/5'
                  )}
                >
                  <span>{opt.label}</span>
                  {(chat.disappearingDuration || 'OFF') === opt.id && <span>✓</span>}
                </button>
              ))}
            </div>

            <button
              onClick={() => setDisappearingModalOpen(false)}
              className="w-full py-2 bg-black/10 dark:bg-white/10 text-[var(--text-primary)] font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
  
</div>
  );
};