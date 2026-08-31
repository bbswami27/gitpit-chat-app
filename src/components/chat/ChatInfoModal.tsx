import React, { useState } from 'react';
import { 
  Bell,
  Clock,
  Volume2,
  VolumeX,
  X, 
  ShieldCheck, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Ban, 
  Phone, 
  Video, 
  Calendar, 
  Heart, 
  FileText,
  Crown,
  Star,
  Edit3,
  LogOut,
  Users,
  Check,
  UserCheck,
  UserX
} from 'lucide-react';
import { Chat, Contact } from '../../types';
import { useGitPitStore } from '../../store/gitPitStore';
import { soundEngine, triggerConfetti } from '../../utils/soundEffects';

interface ChatInfoModalProps {
  chat: Chat;
  onClose: () => void;
  onSelectWallpaper: (color: string) => void;
}

const WALLPAPER_PRESETS = [
  { name: 'Default Light White ⚪', value: 'bg-[var(--chat-bg)]' },
  { name: '🚀 Anime Cyberwave & Vaporwave', value: 'bg-gradient-to-br from-purple-900/40 via-fuchsia-900/40 to-pink-900/40' },
  { name: '🎮 Gaming RGB Matrix Neon', value: 'bg-gradient-to-b from-[#030712] via-[#090d16] to-[#030712]' },
  { name: '🦄 Gen Z Pastel Dream Cloud', value: 'bg-gradient-to-tr from-fuchsia-100/50 via-pink-100/50 to-purple-200/50' },
  { name: '👾 Gen Alpha 8-Bit Arcade', value: 'bg-gradient-to-b from-[#0f0c1b] via-[#18142b] to-[#0f0c1b]' },
  { name: '⚡ Skibidi Glitch Pop Energy', value: 'bg-gradient-to-tr from-indigo-950/60 via-slate-900/60 to-purple-950/60' },
  { name: '🌸 Aesthetic Anime Lofi Vibe', value: 'bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-rose-950/40' },
  { name: '🌌 Cosmic Galaxy Nebula', value: 'bg-gradient-to-b from-[#050515] via-[#100b2b] to-[#050515]' },
  { name: '🍵 Minimal Matcha Green Tea', value: 'bg-gradient-to-br from-emerald-950/40 via-teal-950/40 to-slate-950/40' },
  { name: 'Emerald WhatsApp 💚', value: 'bg-emerald-900/10' },
  { name: 'Festive Sunset 🌅', value: 'bg-gradient-to-b from-amber-500/10 via-rose-500/10 to-purple-500/10' },
  { name: 'Cyberpunk Grid 🎆', value: 'bg-[#080816]' },
  { name: 'Midnight Ocean 🌊', value: 'bg-[#030712]' }
];


export const ChatInfoModal: React.FC<ChatInfoModalProps> = ({
  chat,
  onClose,
  onSelectWallpaper
}) => {
  const { 
    contacts, 
    messages,
    currentUser,
    strangerShieldMode, 
    startCall, 
    bulkClearChats,
    updateStore,
    updateChatNotificationConfig,
    chats
  } = useGitPitStore();

  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'media' | 'wallpaper'>('info');
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState(chat.name);
  const [groupDescInput, setGroupDescInput] = useState(chat.description || '');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const otherMemberId = chat.members.find((m) => m !== currentUser.id);
  const contact = contacts.find((c) => c.id === otherMemberId);
  const isStranger = chat.isStrangerChat;

  const isAdmin = chat.type === 'group' && (
    (chat.adminIds && chat.adminIds.includes(currentUser.id)) ||
    (chat.creatorId === currentUser.id) ||
    (!chat.creatorId && chat.adminIds?.length === 0)
  );

  const isCreator = chat.type === 'group' && (
    chat.creatorId === currentUser.id || (!chat.creatorId && chat.members[0] === currentUser.id)
  );

  const maxCap = chat.maxCapacity || 1000;

  // Resolve member list details with phone numbers
  const memberDetails = chat.members.map((mId) => {
    if (mId === currentUser.id) {
      return {
        id: currentUser.id,
        name: currentUser.name + ' (You)',
        avatar: currentUser.avatar,
        phoneNumber: currentUser.phoneNumber,
        countryCode: currentUser.countryCode,
        isCreator: isCreator,
        isAdmin: isAdmin
      };
    }
    const c = contacts.find((cnt) => cnt.id === mId);
    return {
      id: mId,
      name: c ? c.name : mId,
      avatar: c ? c.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      phoneNumber: c ? c.phoneNumber : '9876543210',
      countryCode: c ? c.countryCode : '+91',
      isCreator: chat.creatorId === mId,
      isAdmin: chat.adminIds ? chat.adminIds.includes(mId) : false
    };
  });

  const handleSaveGroupEdit = () => {
    if (!groupNameInput.trim()) return;
    soundEngine.playSentPop();

    const updatedChats = chats.map((c) => {
      if (c.id === chat.id) {
        return {
          ...c,
          name: groupNameInput.trim(),
          description: groupDescInput.trim()
        };
      }
      return c;
    });

    updateStore(() => ({ chats: updatedChats }));
    setIsEditingGroup(false);
    triggerConfetti();
    alert('✅ Group details updated successfully!');
  };

  const handleRemoveMember = (memberId: string) => {
    if (!isAdmin) {
      alert('🔒 Only Group Creator or Admins can remove members.');
      return;
    }
    soundEngine.playClick();

    const updatedChats = chats.map((c) => {
      if (c.id === chat.id) {
        return {
          ...c,
          members: c.members.filter((m) => m !== memberId),
          adminIds: c.adminIds.filter((a) => a !== memberId)
        };
      }
      return c;
    });

    updateStore(() => ({ chats: updatedChats }));
    alert('Member removed from group.');
  };

  const handleToggleAdmin = (memberId: string, currentIsAdmin: boolean) => {
    if (!isAdmin) {
      alert('🔒 Only Group Admins can modify Admin rights.');
      return;
    }
    soundEngine.playClick();

    const updatedChats = chats.map((c) => {
      if (c.id === chat.id) {
        const newAdminIds = currentIsAdmin 
          ? c.adminIds.filter((a) => a !== memberId)
          : [...c.adminIds, memberId];
        return {
          ...c,
          adminIds: newAdminIds
        };
      }
      return c;
    });

    updateStore(() => ({ chats: updatedChats }));
    triggerConfetti();
    alert(currentIsAdmin ? 'Admin rights demoted.' : 'Member promoted to Group Admin! ⭐');
  };

  const handleAddMemberToGroup = (contactId: string) => {
    if (chat.members.length >= maxCap) {
      alert(`⚠️ Group limit reached (${maxCap} max capacity).`);
      return;
    }


    const updatedChats = chats.map((c) => {
      if (c.id === chat.id && !c.members.includes(contactId)) {
        return {
          ...c,
          members: [...c.members, contactId]
        };
      }
      return c;
    });

    updateStore(() => ({ chats: updatedChats }));
    setShowAddMemberModal(false);
    triggerConfetti();
    alert('Member added to group!');
  };

  const handleLeaveGroup = () => {
    if (isAdmin && chat.members.length > 1) {
      const otherMembers = chat.members.filter((m) => m !== currentUser.id);
      const nextAdmin = otherMembers[0];
      const updatedChats = chats.map((c) => {
        if (c.id === chat.id) {
          return {
            ...c,
            members: c.members.filter((m) => m !== currentUser.id),
            adminIds: Array.from(new Set([...c.adminIds.filter((a) => a !== currentUser.id), nextAdmin]))
          };
        }
        return c;
      });
      updateStore(() => ({ chats: updatedChats }));
      alert('You left the group. Admin rights transferred to next active member.');
    } else {
      const updatedChats = chats.map((c) => {
        if (c.id === chat.id) {
          return {
            ...c,
            members: c.members.filter((m) => m !== currentUser.id)
          };
        }
        return c;
      });
      updateStore(() => ({ chats: updatedChats }));
      alert('You left the group.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--header-bg)]">
          <span className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
            <span>{chat.type === 'group' ? 'Group Info & Members' : 'Contact Information'}</span>
            {chat.type === 'group' && (
              <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                Max {maxCap} Members
              </span>
            )}
          </span>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[var(--border-color)] bg-[var(--header-bg)] px-2">
          <button
            onClick={() => setActiveTab('info')}
            className={"flex-1 py-2 text-xs font-bold text-center border-b-2 cursor-pointer " + (
              activeTab === 'info' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-secondary)]'
            )}
          >
            Overview
          </button>

          {(chat.type === 'group' || chat.type === 'broadcast') && (
            <button
              onClick={() => setActiveTab('members')}
              className={"flex-1 py-2 text-xs font-bold text-center border-b-2 cursor-pointer " + (
                activeTab === 'members' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-secondary)]'
              )}
            >
              {chat.type === 'broadcast' ? 'Recipients' : 'Members'} ({chat.members.length}/{maxCap})
            </button>
          )}


          <button
            onClick={() => setActiveTab('media')}
            className={"flex-1 py-2 text-xs font-bold text-center border-b-2 cursor-pointer " + (
              activeTab === 'media' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-secondary)]'
            )}
          >
            Media
          </button>

          <button
            onClick={() => setActiveTab('wallpaper')}
            className={"flex-1 py-2 text-xs font-bold text-center border-b-2 cursor-pointer " + (
              activeTab === 'wallpaper' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-secondary)]'
            )}
          >
            Wallpaper
          </button>
        </div>

        {/* TAB 1: OVERVIEW & EDIT DETAILS */}
        {activeTab === 'info' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            <div className="flex flex-col items-center text-center">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[var(--accent)] shadow-md mb-2"
              />
              
              {!isEditingGroup ? (
                <>
                  <h3 className="font-extrabold text-lg text-[var(--text-primary)] flex items-center gap-1.5">
                    <span>{chat.name}</span>
                    {isAdmin && (
                      <button 
                        onClick={() => setIsEditingGroup(true)}
                        className="p-1 text-[var(--accent)] hover:scale-110 cursor-pointer"
                        title="Edit Group Name & Description"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] max-w-xs mt-0.5">
                    {chat.description || (contact?.bio || 'GitPit Community Group')}
                  </p>
                </>
              ) : (
                <div className="w-full space-y-2 max-w-xs mt-2">
                  <input
                    type="text"
                    value={groupNameInput}
                    onChange={(e) => setGroupNameInput(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-xs font-bold text-center text-[var(--text-primary)]"
                  />
                  <input
                    type="text"
                    value={groupDescInput}
                    onChange={(e) => setGroupDescInput(e.target.value)}
                    placeholder="Group Description..."
                    className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-xs text-center text-[var(--text-primary)]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveGroupEdit}
                      className="flex-1 py-1.5 bg-[var(--accent)] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingGroup(false)}
                      className="px-3 py-1.5 border border-[var(--border-color)] text-xs font-bold text-[var(--text-secondary)] rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Call Buttons for 1-on-1 */}
              {contact && !isStranger && chat.type === 'individual' && (
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => { onClose(); startCall(contact, 'audio'); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] font-bold text-xs rounded-full cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Audio Call</span>
                  </button>
                  <button
                    onClick={() => { onClose(); startCall(contact, 'video'); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] font-bold text-xs rounded-full cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Call</span>
                  </button>
                </div>
              )}
            </div>

            {/* EXPORT CHAT VIA EMAIL / FILE CARD */}
            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-500" /> Export Chat via Email (.txt / JSON):
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Export full conversation transcript of {chat.name} formatted for Email attachment.
              </p>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  triggerConfetti();
                  const msgs = (messages[chat.id] || []).map((m: any) => `[${new Date(m.sentAt).toLocaleString()}] ${m.senderName}: ${m.content}`).join('\n');
                  const blob = new Blob([msgs], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `GitPit_${chat.name.replace(/\s+/g, '_')}_Chat_Export.txt`;
                  a.click();
                  alert(`📧 Chat history of ${chat.name} exported! File downloaded for Email sharing.`);
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                📧 Export & Send via Email
              </button>
            </div>

            {/* DISAPPEARING MESSAGES TIMER CARD FOR THIS INDIVIDUAL / GROUP CHAT */}
            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-500" /> Disappearing Messages Timer for this Chat:
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300">
                  {chat.disappearingDuration || 'OFF'}
                </span>
              </div>
              <select
                value={chat.disappearingDuration || 'OFF'}
                onChange={(e) => {
                  const val = e.target.value;
                  updateStore((prev) => ({
                    chats: prev.chats.map((c) => c.id === chat.id ? { ...c, disappearingDuration: val as any } : c)
                  }));
                  soundEngine.playClick();
                  alert('⏳ Disappearing messages timer set to ' + val + ' for ' + chat.name);
                }}
                className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs cursor-pointer"
              >
                <option value="OFF">Off (Keep messages permanently)</option>
                <option value="24_HOURS">24 Hours ⏱️</option>
                <option value="7_DAYS">7 Days 📅</option>
                <option value="90_DAYS">90 Days 🗓️</option>
                <option value="180_DAYS">180 Days 🕒</option>
              </select>
            </div>

            {/* INDIVIDUAL CHAT MUTE NOTIFICATIONS & SILENT MODE CARD */}
            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {chat.isMuted ? <VolumeX className="w-5 h-5 text-amber-500" /> : <Volume2 className="w-5 h-5 text-emerald-500" />}
                  <div>
                    <span className="font-bold text-xs text-[var(--text-primary)] block">Mute Notifications & Silent Mode</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {chat.isMuted ? '🔕 Muted & Silent (No sound or alerts for this chat)' : '🔔 Notifications Active'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={chat.isMuted || false}
                  onChange={(e) => {
                    const val = e.target.checked;
                    updateStore((prev) => ({
                      chats: prev.chats.map((c) => c.id === chat.id ? { ...c, isMuted: val } : c)
                    }));
                    soundEngine.playClick();
                    alert(val ? '🔕 ' + chat.name + ' is now Muted & Silent!' : '🔔 Notifications enabled for ' + chat.name);
                  }}
                  className="w-5 h-5 accent-amber-500 cursor-pointer"
                />
              </div>

              {chat.isMuted && (
                <div className="pt-2 border-t border-[var(--border-color)] space-y-1.5">
                  <span className="font-bold text-[10px] uppercase text-[var(--text-secondary)] block">Silent Mute Duration:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: '8_HOURS', label: '8 Hours' },
                      { id: '1_WEEK', label: '1 Week' },
                      { id: 'ALWAYS', label: 'Always Silent' }
                    ].map((dur) => (
                      <button
                        key={dur.id}
                        onClick={() => {
                          updateChatNotificationConfig(chat.id, { muteDuration: dur.id as any });
                          soundEngine.playClick();
                          alert('🔕 Mute duration set to ' + dur.label + ' for ' + chat.name);
                        }}
                        className={"py-1.5 px-2 rounded-xl text-center font-bold text-[11px] cursor-pointer border " + (
                          ((chat as any).muteDuration || 'ALWAYS') === dur.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300'
                            : 'bg-[var(--header-bg)] border-[var(--border-color)] text-[var(--text-primary)]'
                        )}
                      >
                        {dur.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stranger Shield Status */}
            <div className={"p-3.5 rounded-2xl border flex items-start gap-3 " + (
              isStranger ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            )}>
              {isStranger ? <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-500" /> : <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />}
              <div className="text-xs space-y-1">
                <div className="font-bold">
                  {isStranger ? 'Stranger Shield Protection Active' : 'Verified GitPit Chat'}
                </div>
                <p className="opacity-90 leading-relaxed text-[11px]">
                  {isStranger 
                    ? `Currently under ${strangerShieldMode}. Text & Google-verified location allowed. Media blocked.`
                    : 'Full communication, multi-media attachments & calling are enabled.'
                  }
                </p>

              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1.5 pt-2">
              {chat.type === 'group' && (
                <button
                  onClick={handleLeaveGroup}
                  className="w-full py-2.5 px-3 rounded-xl hover:bg-rose-500/10 text-rose-500 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Leave Group & Transfer Admin Rights</span>
                </button>
              )}

              <button
                onClick={() => {
                  bulkClearChats({ groups: chat.type === 'group', individuals: chat.type === 'individual' });
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl hover:bg-red-500/10 text-red-500 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Messages in Chat</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MEMBERS LIST WITH PHONE NUMBERS & CREATOR/ADMIN BADGES */}
        {activeTab === 'members' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[var(--text-secondary)] uppercase tracking-wider text-[11px]">
                {chat.type === 'broadcast' ? 'Broadcast Recipients' : 'Group Members'} ({memberDetails.length} / {maxCap} Capacity)
              </span>

              {(isAdmin || chat.type === 'broadcast') && (
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="flex items-center gap-1 bg-[var(--accent)] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{chat.type === 'broadcast' ? '+ Add Recipient' : '+ Add Member'}</span>
                </button>
              )}
            </div>

            {/* Member List */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {memberDetails.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={m.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 border" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1 truncate">
                        <span>{m.name}</span>
                        {m.isCreator && (
                          <span className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-[9px] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Crown className="w-3 h-3 text-amber-500 fill-amber-500" /> Creator
                          </span>
                        )}
                        {m.isAdmin && !m.isCreator && (
                          <span className="bg-blue-500/20 text-blue-600 dark:text-blue-400 font-black text-[9px] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-blue-500 fill-blue-500" /> Admin
                          </span>
                        )}
                      </div>

                      {/* Display Phone Number */}
                      <div className="text-[11px] text-[var(--text-secondary)] font-semibold">
                        📞 {m.countryCode} {m.phoneNumber}
                      </div>
                    </div>
                  </div>

                  {/* Creator / Admin / Broadcast Action Buttons */}
                  {(isAdmin || chat.type === 'broadcast') && m.id !== currentUser.id && (
                    <div className="flex items-center gap-1 shrink-0">
                      {chat.type === 'group' && (
                        <button
                          onClick={() => handleToggleAdmin(m.id, m.isAdmin)}
                          className={"p-1.5 rounded-lg border cursor-pointer text-[10px] font-bold flex items-center gap-0.5 " + (
                            m.isAdmin ? 'border-amber-500/50 bg-amber-500/10 text-amber-600' : 'border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-secondary)]'
                          )}
                          title={m.isAdmin ? 'Demote Admin' : 'Make Group Admin'}
                        >
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveMember(m.id)}
                        className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                        title={chat.type === 'broadcast' ? 'Remove recipient from broadcast' : 'Remove member from group'}
                      >
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>


          </div>
        )}

        {/* Tab 3: Media */}
        {activeTab === 'media' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
              Shared Photos & Videos
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80'
              ].map((img, i) => (
                <img key={i} src={img} alt="media" className="rounded-xl h-20 w-full object-cover cursor-pointer hover:scale-105 transition-transform" />
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Wallpaper */}
        {activeTab === 'wallpaper' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
              Choose Chat Wallpaper
            </span>
            <div className="grid grid-cols-2 gap-3">
              {WALLPAPER_PRESETS.map((wp) => (
                <button
                  key={wp.name}
                  onClick={() => {
                    onSelectWallpaper(wp.value);
                    alert(`Wallpaper updated to ${wp.name}`);
                  }}
                  className="flex flex-col items-center p-3 rounded-2xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5 hover:border-[var(--accent)] transition-all cursor-pointer"
                >
                  <div className={`w-full h-16 rounded-xl mb-2 border border-[var(--border-color)] ${wp.value}`} />

                  <span className="text-xs font-bold text-[var(--text-primary)]">{wp.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-3">
          <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-sm rounded-3xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[var(--text-primary)]">Add Contact to Group</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-[var(--text-secondary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {contacts.filter((c) => !chat.members.includes(c.id)).map((cnt) => (
                <div key={cnt.id} className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <img src={cnt.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-xs text-[var(--text-primary)]">{cnt.name}</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">📞 {cnt.phoneNumber}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddMemberToGroup(cnt.id)}
                    className="px-2.5 py-1 bg-[var(--accent)] text-white font-bold text-[10px] rounded-lg shadow cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};