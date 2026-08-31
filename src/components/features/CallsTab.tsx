import React, { useState } from 'react';
import { 
  Phone, 
  Video, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  Link as LinkIcon, 
  MessageSquare, 
  Plus 
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';

export const CallsTab: React.FC = () => {
  const { 
    callLogs, 
    contacts, 
    startCall, 
    setActiveChatId, 
    setActiveBottomNav 
  } = useGitPitStore();

  const [contactPickerOpen, setContactPickerOpen] = useState(false);

  const handleCreateCallLink = () => {
    const link = 'https://gitpit.meet/call/gpt-' + Math.random().toString(36).substring(2, 8);
    navigator.clipboard.writeText(link);
    alert(`🔗 GitPit Call Link Created & Copied: ${link}`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--sidebar-bg)] p-4 select-none">
      <div 
        onClick={handleCreateCallLink}
        className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-transparent border border-teal-500/30 hover:border-teal-500 transition-all cursor-pointer mb-4"
      >
        <div className="w-11 h-11 rounded-full bg-teal-500 text-white flex items-center justify-center shadow">
          <LinkIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-[var(--text-primary)]">Create Call Link</h4>
          <p className="text-xs text-[var(--text-secondary)]">Share a link for your GitPit voice/video call</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Recent Calls ({callLogs.length})
        </span>
        <button
          onClick={() => setContactPickerOpen(true)}
          className="flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:underline cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Call</span>
        </button>
      </div>

      <div className="divide-y divide-[var(--border-color)]">
        {callLogs.map((call) => {
          const isMissed = call.direction === 'missed';

          return (
            <div key={call.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img
                  src={call.contactAvatar}
                  alt={call.contactName}
                  className="w-11 h-11 rounded-full object-cover border border-[var(--border-color)]"
                />
                <div>
                  <h4 className={`font-bold text-sm ${isMissed ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                    {call.contactName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-0.5">
                    {call.direction === 'incoming' && <PhoneIncoming className="w-3.5 h-3.5 text-emerald-500" />}
                    {call.direction === 'outgoing' && <PhoneOutgoing className="w-3.5 h-3.5 text-blue-500" />}
                    {call.direction === 'missed' && <PhoneMissed className="w-3.5 h-3.5 text-red-500" />}
                    <span>{call.timestamp}</span>
                    {call.durationSeconds > 0 && <span>({call.durationSeconds}s)</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const matchedContact = contacts.find((c) => c.id === call.contactId);
                    if (matchedContact) {
                      setActiveChatId(call.contactId.replace('contact_', 'chat_'));
                      setActiveBottomNav('chats');
                    }
                  }}
                  className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                  title="Direct Message"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                {call.type === 'video' ? (
                  <button
                    onClick={() => {
                      const matched = contacts.find((c) => c.id === call.contactId);
                      if (matched) startCall(matched, 'video');
                    }}
                    className="p-2 rounded-full text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 cursor-pointer"
                    title="Video Call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const matched = contacts.find((c) => c.id === call.contactId);
                      if (matched) startCall(matched, 'audio');
                    }}
                    className="p-2 rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
                    title="Audio Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {contactPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-sm rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Select Contact to Call</h3>
              <button onClick={() => setContactPickerOpen(false)} className="text-[var(--text-secondary)] cursor-pointer">
                ✕
              </button>
            </div>

            <div className="divide-y divide-[var(--border-color)] max-h-60 overflow-y-auto">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <img src={c.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">{c.name}</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">{c.phoneNumber}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setContactPickerOpen(false); startCall(c, 'audio'); }}
                      className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-full cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setContactPickerOpen(false); startCall(c, 'video'); }}
                      className="p-1.5 text-teal-500 hover:bg-teal-500/10 rounded-full cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};