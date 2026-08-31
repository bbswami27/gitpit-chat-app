import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Users, 
  Radio, 
  Check, 
  Search,
  UserPlus 
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';
import { soundEngine } from '../../utils/soundEffects';
import { networkSyncEngine } from '../../utils/networkSyncEngine';

export const NewChatModal: React.FC = () => {
  const { 
    contacts, 
    setActiveChatId, 
    createNewGroup, 
    createNewBroadcast, 
    syncPhonebookContacts,
    startChatWithContact,
    saveDirectNumberAndStartChat,
    addContact,
    updateStore 
  } = useGitPitStore();

  const [mode, setMode] = useState<'individual' | 'group' | 'broadcast'>('individual');
  const [search, setSearch] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [title, setTitle] = useState('');

  // Direct Number Save local state
  const [directName, setDirectName] = useState('');
  const [directPhone, setDirectPhone] = useState('');
  const [directCountryCode, setDirectCountryCode] = useState('+91');

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber.includes(search)
  );

  const toggleSelect = (id: string) => {
    soundEngine.playClick();
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter((c) => c !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const handleCreate = () => {
    if (mode === 'group') {
      if (!title.trim()) {
        alert('Please enter a group subject name');
        return;
      }
      createNewGroup(title.trim(), selectedContacts);
    } else if (mode === 'broadcast') {
      if (!title.trim()) {
        alert('Please enter a broadcast list name');
        return;
      }
      createNewBroadcast(title.trim(), selectedContacts);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-[var(--header-bg)]">
          <h3 className="font-extrabold text-base text-[var(--text-primary)]">
            Start New Communication
          </h3>
          <button 
            onClick={() => updateStore(() => ({ newChatModalOpen: false }))}
            className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-[var(--border-color)] bg-[var(--header-bg)] px-3">
          <button
            onClick={() => { setMode('individual'); setSelectedContacts([]); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer flex items-center justify-center gap-1 ${
              mode === 'individual' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-secondary)]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>

          <button
            onClick={() => { setMode('group'); setSelectedContacts([]); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer flex items-center justify-center gap-1 ${
              mode === 'group' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-secondary)]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>New Group</span>
          </button>

          <button
            onClick={() => { setMode('broadcast'); setSelectedContacts([]); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer flex items-center justify-center gap-1 ${
              mode === 'broadcast' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-secondary)]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Broadcast List</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(mode === 'group' || mode === 'broadcast') && (
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-1">
                {mode === 'group' ? 'Group Subject / Name' : 'Broadcast List Name'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={mode === 'group' ? "e.g. GitPit Sprint Team" : "e.g. Client VIP Updates"}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          )}

          {/* 1-Click Real Phonebook Sync Banner Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => syncPhonebookContacts()}
              className="py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-2xl shadow-xs cursor-pointer transition-all active:scale-95 flex items-center justify-between"
            >
              <span className="flex items-center gap-1">
                ⚡ Auto Sync Numbers
              </span>
              <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                Auto
              </span>
            </button>

            <button
              onClick={async () => {
                const nativeContact = await networkSyncEngine.pickNativeDeviceContact();
                if (nativeContact) {
                  addContact({
                    name: nativeContact.name,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    bio: 'Imported from Android Device Contacts',
                    countryCode: '+91',
                    phoneNumber: nativeContact.phoneNumber,
                    email: '',
                    dob: '',
                    anniversaryDate: '',
                    gender: 'Male',
                    isSaved: true,
                    isTrusted: true,
                    isBlocked: false,
                    isStranger: false,
                    hasGitPitBadge: true,
                    isOnline: true,
                    lastSeen: 'online'
                  });

                  alert(`📱 Contact ${nativeContact.name} (+91 ${nativeContact.phoneNumber}) imported from SIM/Device!`);
                }
              }}
              className="py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-xs cursor-pointer transition-all active:scale-95 flex items-center justify-between"
            >
              <span className="flex items-center gap-1">
                📱 Import Mobile SIM Contact
              </span>
              <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded-full font-bold">
                Device
              </span>
            </button>
          </div>

          {/* Direct Phone Number Save & Chat Form */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5">
            <span className="font-extrabold text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
              <UserPlus className="w-4 h-4 text-emerald-500" /> Save Direct Number & Start Chat
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                placeholder="Contact Name (e.g. Ramesh Kumar)"
                value={directName}
                onChange={(e) => setDirectName(e.target.value)}
                className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold focus:outline-none"
              />
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={directCountryCode}
                  onChange={(e) => setDirectCountryCode(e.target.value)}
                  className="w-16 p-2.5 text-center rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="10-Digit Mobile No."
                  value={directPhone}
                  onChange={(e) => setDirectPhone(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (!directPhone.trim()) { alert('Please enter 10-digit mobile number'); return; }
                saveDirectNumberAndStartChat({
                  name: directName,
                  phoneNumber: directPhone,
                  countryCode: directCountryCode
                });
                setDirectName('');
                setDirectPhone('');
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              ➕ Save Direct Number & Open 1-on-1 Chat
            </button>
          </div>

          <div className="relative flex items-center bg-black/5 dark:bg-white/5 rounded-xl px-3 py-1.5">
            <Search className="w-4 h-4 text-[var(--text-secondary)] mr-2" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full text-xs bg-transparent text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="space-y-4">
            {/* Total Contacts Count Breakdown Header */}
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-bold text-[var(--text-primary)] mb-1">
              <span>📊 Mobile Phonebook Total Contacts: 148</span>
              <span className="text-emerald-600 dark:text-emerald-400">🟢 GitPit Verified: {filteredContacts.filter(c => c.hasGitPitBadge || c.isSaved).length}</span>
            </div>

            {/* REGISTERED ON GITPIT SECTION */}
            <div className="space-y-1">
              <span className="font-extrabold text-[10px] uppercase tracking-wider text-[var(--accent)] block px-1">
                Registered on GitPit ({filteredContacts.filter(c => c.hasGitPitBadge || c.isSaved).length})
              </span>

              <div className="divide-y divide-[var(--border-color)]">
                {filteredContacts.filter(c => c.hasGitPitBadge || c.isSaved).map((contact) => {
                  const isSelected = selectedContacts.includes(contact.id);

                  return (
                    <div
                      key={contact.id}
                      onClick={() => {
                        if (mode === 'individual') {
                          startChatWithContact(contact.id);
                        } else {
                          toggleSelect(contact.id);
                        }
                      }}
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                    >

                      <div className="flex items-center gap-3 min-w-0">
                        <img src={contact.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 border" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">{contact.name}</h4>
                            <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-[9px] px-1.5 py-0.2 rounded-md shrink-0 flex items-center gap-0.5">
                              ⚡ GitPit Registered
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] font-semibold truncate">
                            📞 {contact.countryCode} {contact.phoneNumber}
                          </p>
                        </div>
                      </div>

                      {mode !== 'individual' && (
                        <div className={"w-5 h-5 rounded-full border flex items-center justify-center " + (
                          isSelected ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-gray-400'
                        )}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* UNREGISTERED CONTACTS (INVITE ONLY) */}
            {mode === 'individual' && filteredContacts.filter(c => !c.hasGitPitBadge && !c.isSaved).length > 0 && (
              <div className="space-y-1 pt-2">
                <span className="font-extrabold text-[10px] uppercase tracking-wider text-[var(--text-secondary)] block px-1">
                  Invite to GitPit ({filteredContacts.filter(c => !c.hasGitPitBadge && !c.isSaved).length})
                </span>

                <div className="divide-y divide-[var(--border-color)] opacity-70">
                  {filteredContacts.filter(c => !c.hasGitPitBadge && !c.isSaved).map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between py-2 px-2 rounded-xl bg-black/5 dark:bg-white/5"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={contact.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 border" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[var(--text-primary)] truncate">{contact.name}</h4>
                          <p className="text-[10px] text-[var(--text-secondary)]">📞 {contact.countryCode} {contact.phoneNumber}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('SMS Invite sent to ' + contact.name + ' (' + contact.phoneNumber + ')!');
                        }}
                        className="px-2.5 py-1 bg-black/10 dark:bg-white/10 hover:bg-[var(--accent)] hover:text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer shrink-0"
                      >
                        Invite SMS 📩
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        {(mode === 'group' || mode === 'broadcast') && (
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-1">
                {mode === 'group' ? 'Group Subject / Name' : 'Broadcast List Name'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={mode === 'group' ? "e.g. GitPit Sprint Team" : "e.g. Client VIP Updates"}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          )}

          <div className="relative flex items-center bg-black/5 dark:bg-white/5 rounded-xl px-3 py-1.5">
            <Search className="w-4 h-4 text-[var(--text-secondary)] mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full text-xs bg-transparent text-[var(--text-primary)] focus:outline-none"
            />
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {filteredContacts.map((contact) => {
              const isSelected = selectedContacts.includes(contact.id);

              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    if (mode === 'individual') {
                      setActiveChatId(contact.id.replace('contact_', 'chat_'));
                      updateStore(() => ({ newChatModalOpen: false }));
                    } else {
                      toggleSelect(contact.id);
                    }
                  }}
                  className="flex items-center justify-between py-2.5 px-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={contact.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">{contact.name}</h4>
                      <p className="text-[11px] text-[var(--text-secondary)]">{contact.bio || contact.phoneNumber}</p>
                    </div>
                  </div>

                  {mode !== 'individual' && (
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-gray-400'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {(mode === 'group' || mode === 'broadcast') && (
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--header-bg)]">
            <button
              onClick={handleCreate}
              disabled={selectedContacts.length === 0 || !title.trim()}
              className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
            >
              Create {mode === 'group' ? 'Group' : 'Broadcast'} ({selectedContacts.length} selected)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};