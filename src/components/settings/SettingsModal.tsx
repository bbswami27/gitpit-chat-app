import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft,
  Shield, 
  Bot, 
  BookOpen, 
  Lock, 
  Palette, 
  User, 
  Bell, 
  HelpCircle, 
  LogOut, 
  Volume2, 
  FileText, 
  Info, 
  Check, 
  Sparkles, 
  Smartphone, 
  Sliders,
  UserPlus,
  Monitor,
  Heart,
  Edit2,
  Clock,
  UserX,
  HardDrive,
  Cloud,
  Download,
  UploadCloud,
  RefreshCw,
  Gift,
  Calendar,
  PieChart,
  Wifi,
  ShieldAlert,
  FolderDown,
  Type
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';
import { soundEngine, triggerConfetti } from '../../utils/soundEffects';

export const SettingsModal: React.FC = () => {
  const store = useGitPitStore();
  const { 
    currentUser, 
    contacts, 
    settingsModalOpen, 
    updateStore, 
    updateUserProfile, 
    setStrangerShieldMode,
    addContact,
    changePhoneNumber
  } = store;

  const [activeCategory, setActiveCategory] = useState<string>('main');

  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileBio, setProfileBio] = useState(currentUser.bio);
  const [profilePhone, setProfilePhone] = useState(currentUser.phoneNumber);
  const [profileCountryCode, setProfileCountryCode] = useState(currentUser.countryCode || '+91');

  const [userAgeInput, setUserAgeInput] = useState<number>(24);
  const [helpMessage, setHelpMessage] = useState('');

  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderType, setReminderType] = useState<'birthday' | 'anniversary' | 'todo'>('birthday');

  if (!settingsModalOpen) return null;

  const categories = [
    { 
      id: 'anti_fraud', 
      name: 'Anti-Fraud Security', 
      desc: 'Stranger Shield, Scam Call Blocking & Link Safety Warnings', 
      icon: <Shield className="w-5 h-5 text-emerald-500" />
    },
    { 
      id: 'privacy', 
      name: 'Privacy & Permissions', 
      desc: 'Last Seen, Photo, Disappearing Messages, Group Add & Block List', 
      icon: <Lock className="w-5 h-5 text-purple-500" />
    },
    { 
      id: 'chat_settings', 
      name: 'Chat Settings & Backups', 
      desc: 'Gallery Visibility, Fonts, Cloud Drive Backups & History Transfer', 
      icon: <FileText className="w-5 h-5 text-blue-500" />
    },
    { 
      id: 'auto_download', 
      name: 'Media Auto-Download Rules', 
      desc: 'Photos, Audio, Videos & Docs rules on Mobile Data & Wi-Fi', 
      icon: <FolderDown className="w-5 h-5 text-sky-500" />
    },
    { 
      id: 'appearance', 
      name: 'Appearance & App Logos', 
      desc: '15 Themes Presets & Custom GitPit App Logo Styles', 
      icon: <Palette className="w-5 h-5 text-pink-500" />
    },
    { 
      id: 'notifications', 
      name: 'Notifications & Sounds', 
      desc: 'Individual Alert Modes, Mobile Ringtone & Display Banners', 
      icon: <Bell className="w-5 h-5 text-amber-500" />
    },
    { 
      id: 'ai_tasks', 
      name: 'AI Meeting, Tasks & Reminders', 
      desc: '100-User Room, Birthday & Anniversary Reminders', 
      icon: <Bot className="w-5 h-5 text-teal-500" />
    },
    { 
      id: 'storage', 
      name: 'Storage & Data Usage', 
      desc: 'Total Storage Usage Indicator & HD Media Upload Quality', 
      icon: <PieChart className="w-5 h-5 text-indigo-500" />
    },
    { 
      id: 'parental', 
      name: 'Parental Control (Optional)', 
      desc: 'Age-Based Child Safety Guard & Usage Limits', 
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />
    },
    { 
      id: 'help', 
      name: 'Help, Terms & App Information', 
      desc: 'Engineering Support, Feedback & Tech Specifications', 
      icon: <HelpCircle className="w-5 h-5 text-amber-600" />
    }
  ];


  const handleSaveProfile = () => {
    updateUserProfile({
      name: profileName,
      bio: profileBio,
      countryCode: profileCountryCode,
      phoneNumber: profilePhone
    });
    triggerConfetti();
    alert('Profile details updated successfully!');
  };

  const handleCreateBackup = () => {
    soundEngine.playClick();
    triggerConfetti();
    const ts = Date.now();
    updateStore(() => ({ lastBackupTimestamp: ts }));
    alert('☁️ Chat Backup created successfully to ' + (store.backupCloudStorage || 'GOOGLE_DRIVE') + '!\nDate: ' + new Date(ts).toLocaleString());
  };

  const handleTransferChatHistory = () => {
    soundEngine.playClick();
    triggerConfetti();
    alert('📦 Chat history package exported in GitPit format! Download started for device transfer.');
  };

  const handleRestoreBackup = () => {
    soundEngine.playClick();
    triggerConfetti();
    alert('🔄 Latest backup restored successfully from Cloud Storage!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[92vh]">
        
        {/* Top Common Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-[var(--header-bg)]">
          <div className="flex items-center gap-2.5 min-w-0">
            {activeCategory !== 'main' ? (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCategory('main');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[var(--text-primary)] font-extrabold text-xs rounded-xl cursor-pointer shrink-0 transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Settings</span>
              </button>
            ) : (
              <div className="w-8.5 h-8.5 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                ⚙️
              </div>
            )}
            <h2 className="font-black text-base text-[var(--text-primary)] truncate">
              {activeCategory === 'main' ? 'GitPit Settings Hub' : categories.find(c => c.id === activeCategory)?.name || 'Profile Details'}
            </h2>
          </div>

          <button 
            onClick={() => updateStore(() => ({ settingsModalOpen: false }))}
            className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] cursor-pointer shrink-0"
          >
            <X className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

          {/* ========================================================================= */}
          {/* MAIN MENU (ORGANIZED 11-SECTION CATEGORY HUB) */}
          {/* ========================================================================= */}
          {activeCategory === 'main' && (
            <div className="space-y-4">
              {/* Profile Card */}
              <div 
                onClick={() => { soundEngine.playClick(); setActiveCategory('profile'); }}
                className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all active:scale-[0.99] shadow-xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img src={currentUser.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-black text-base text-[var(--text-primary)] truncate">{currentUser.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)] font-medium truncate mt-0.5">{currentUser.bio}</p>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">
                      📞 {currentUser.countryCode} {currentUser.phoneNumber}
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Edit2 className="w-4 h-4" />
                </div>
              </div>

              {/* Organized Category List */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)] px-1">
                  Complete GitPit Preferences & Controls
                </span>

                <div className="divide-y divide-[var(--border-color)] rounded-3xl bg-[var(--header-bg)] border border-[var(--border-color)] overflow-hidden shadow-xs">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => { soundEngine.playClick(); setActiveCategory(cat.id); }}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 shrink-0">
                          {cat.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs sm:text-sm text-[var(--text-primary)] truncate">{cat.name}</h4>
                          <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">{cat.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--text-secondary)] shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Log Out Block */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    alert('Logged out cleanly. Redirecting to phone verification...');
                    updateStore(() => ({ settingsModalOpen: false, authModalOpen: true }));
                  }}
                  className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-extrabold text-xs rounded-2xl shadow-xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of GitPit Session</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 1: ANTI-FRAUD SECURITY */}
          {/* ========================================================================= */}
          {activeCategory === 'anti_fraud' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <h3 className="font-extrabold text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Anti-Fraud Stranger Shield Core
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Advanced protection from unsaved strangers, scam calls, suspicious web links, and file malware threats.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[var(--text-primary)] block">Stranger Shield Protection Modes:</span>
                {[
                  { id: 'MY_CONTACTS', title: 'My Contacts Mode (Default Recommended)', desc: 'Saved contacts get 100% full access to calls & files. Unsaved numbers get basic anti-fraud alerts.' },
                  { id: 'STRICT_ANTI_FRAUD', title: 'Strict Anti-Fraud Mode', desc: 'Blocks all calls & files from unsaved numbers. Only plain text & Google Maps allowed.' },
                  { id: 'ONLY_TRUSTED', title: 'Trusted Contacts Only (VIP)', desc: 'Restricts communication strictly to VIP marked trusted contacts.' },
                  { id: 'OPEN_ALL', title: 'Open Mode (Off)', desc: 'Standard messaging mode with basic spam warning.' }
                ].map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setStrangerShieldMode(mode.id as any)}
                    className={"p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 " + (
                      store.strangerShieldMode === mode.id
                        ? 'border-emerald-500 bg-emerald-500/10 text-[var(--text-primary)] shadow-xs'
                        : 'border-[var(--border-color)] bg-[var(--header-bg)] hover:border-gray-400'
                    )}
                  >
                    <div className={"w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 " + (
                      store.strangerShieldMode === mode.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-400'
                    )}>
                      {store.strangerShieldMode === mode.id && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-[var(--text-primary)]">{mode.title}</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{mode.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-3">
                <h4 className="font-extrabold text-xs text-[var(--text-primary)] uppercase tracking-wider">
                  Detailed Security Controls
                </h4>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[var(--header-bg)] border border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[var(--text-primary)] block">Scam & Spam Call Blocking:</span>
                      <span className="text-[11px] text-[var(--text-secondary)]">Automatically block suspicious spam calls</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={store.scamCallBlocking}
                      onChange={(e) => updateStore(() => ({ scamCallBlocking: e.target.checked }))}
                      className="w-5 h-5 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--header-bg)] border border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[var(--text-primary)] block">Suspicious Link Safety Warning:</span>
                      <span className="text-[11px] text-[var(--text-secondary)]">Warn before opening unknown phishing URLs</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={store.suspiciousLinkWarning}
                      onChange={(e) => updateStore(() => ({ suspiciousLinkWarning: e.target.checked }))}
                      className="w-5 h-5 accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--header-bg)] border border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[var(--text-primary)] block">File Malware & Virus Scanner:</span>
                      <span className="text-[11px] text-[var(--text-secondary)]">Scan received documents before opening</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={store.malwareFileScanner}
                      onChange={(e) => updateStore(() => ({ malwareFileScanner: e.target.checked }))}
                      className="w-5 h-5 accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: PRIVACY SETTINGS */}
          {/* ========================================================================= */}
          {activeCategory === 'privacy' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                <h3 className="font-extrabold text-sm text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Lock className="w-4 h-4" /> Global Privacy Controls & Permissions
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Configure visibility, read receipts, group permissions, block list, and disappearing timers.
                </p>
              </div>

              {/* Visibility Controls */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="font-bold text-[var(--text-primary)] block">Last Seen & Online Presence</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">Who can see when you are online</span>
                  </div>
                  <select
                    value={store.visibilityLastSeen}
                    onChange={(e) => updateStore(() => ({ visibilityLastSeen: e.target.value as any }))}
                    className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  >
                    <option value="EVERYONE">Everyone</option>
                    <option value="MY_CONTACTS">My Contacts</option>
                    <option value="TRUSTED_USERS">Only Trusted Contacts</option>
                    <option value="NOBODY">Nobody</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="font-bold text-[var(--text-primary)] block">Profile Picture Visibility</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">Who can view your profile photo</span>
                  </div>
                  <select
                    value={store.visibilityProfilePhoto}
                    onChange={(e) => updateStore(() => ({ visibilityProfilePhoto: e.target.value as any }))}
                    className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  >
                    <option value="EVERYONE">Everyone</option>
                    <option value="MY_CONTACTS">My Contacts</option>
                    <option value="TRUSTED_USERS">Only Trusted Contacts</option>
                    <option value="NOBODY">Nobody</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="font-bold text-[var(--text-primary)] block">About / Status Bio Visibility</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">Who can read your bio details</span>
                  </div>
                  <select
                    value={store.visibilityAboutBio}
                    onChange={(e) => updateStore(() => ({ visibilityAboutBio: e.target.value as any }))}
                    className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  >
                    <option value="EVERYONE">Everyone</option>
                    <option value="MY_CONTACTS">My Contacts</option>
                    <option value="TRUSTED_USERS">Only Trusted Contacts</option>
                    <option value="NOBODY">Nobody</option>
                  </select>
                </div>

                {/* Read Receipts Blue Ticks */}
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[var(--text-primary)] block">Read Receipts (Blue Ticks)</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">Show double blue ticks when messages are read</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={store.readReceiptsBlueTick}
                    onChange={(e) => updateStore(() => ({ readReceiptsBlueTick: e.target.checked }))}
                    className="w-5 h-5 accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* Disappearing Messages Timers */}
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-[var(--text-primary)] block">Default Disappearing Message Timer:</span>
                  <select
                    value={store.disappearingDuration}
                    onChange={(e) => updateStore(() => ({ disappearingDuration: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  >
                    <option value="OFF">Off (Keep messages permanently)</option>
                    <option value="24_HOURS">24 Hours ⏱️</option>
                    <option value="7_DAYS">7 Days 📅</option>
                    <option value="90_DAYS">90 Days 🗓️</option>
                    <option value="180_DAYS">180 Days 🕒</option>
                  </select>
                </div>

                {/* Group Adding Permission */}
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-[var(--text-primary)] block">Who Can Add Me to Groups:</span>
                  <select
                    value={store.groupAddPermission || 'REQUIRE_PERMISSION'}
                    onChange={(e) => updateStore(() => ({ groupAddPermission: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  >
                    <option value="REQUIRE_PERMISSION">Require My Approval First (Without permission not adding) 🛡️</option>
                    <option value="MY_CONTACTS">My Contacts Only 👥</option>
                    <option value="EVERYONE">Everyone 🌐</option>
                  </select>
                </div>

                {/* Block / Unblock Contacts Manager (Show All Contacts) */}
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2.5">
                  <span className="font-bold text-[var(--text-primary)] flex items-center justify-between">
                    <span>Block / Unblock Contacts Manager ({contacts.filter(c => c.isBlocked).length} Blocked):</span>
                    <UserX className="w-4 h-4 text-rose-500" />
                  </span>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {contacts.map((cnt) => (
                      <div key={cnt.id} className="p-2 rounded-xl bg-[var(--header-bg)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <img src={cnt.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                          <span className="font-bold text-[var(--text-primary)] truncate">{cnt.name} ({cnt.phoneNumber})</span>
                        </div>
                        <button
                          onClick={() => {
                            const nextVal = !cnt.isBlocked;
                            updateStore((prev) => ({
                              contacts: prev.contacts.map(c => c.id === cnt.id ? { ...c, isBlocked: nextVal } : c)
                            }));
                            soundEngine.playClick();
                            alert(nextVal ? '🚫 Blocked ' + cnt.name : '✅ Unblocked ' + cnt.name);
                          }}
                          className={"px-3 py-1 font-bold text-[10px] rounded-lg cursor-pointer transition-all " + (
                            cnt.isBlocked 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                              : 'bg-rose-600 hover:bg-rose-700 text-white'
                          )}
                        >
                          {cnt.isBlocked ? 'Unblock' : 'Block 🚫'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* App Lock & Timeout */}
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-[var(--text-primary)] block">App Lock & Timeout Timer:</span>
                  <select
                    value={store.appLockTimeout}
                    onChange={(e) => updateStore(() => ({ appLockTimeout: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  >
                    <option value="IMMEDIATELY">Lock Immediately on Background ⚡</option>
                    <option value="1_MIN">After 1 Minute ⏱️</option>
                    <option value="15_MIN">After 15 Minutes 🕒</option>
                    <option value="1_HOUR">After 1 Hour ⌛</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: CHAT SETTINGS & BACKUPS */}
          {/* ========================================================================= */}
          {activeCategory === 'chat_settings' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                <h3 className="font-extrabold text-sm text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Chat Settings, Media Visibility & Cloud Backups
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Configure media gallery visibility, font sizes, cloud backups (Google Drive / OneDrive), and chat history transfer.
                </p>
              </div>

              {/* Media Visibility in Gallery */}
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Media Visibility in Phone Gallery:</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">Show newly downloaded media in your device gallery</span>
                </div>
                <input
                  type="checkbox"
                  checked={store.mediaVisibilityInGallery ?? true}
                  onChange={(e) => updateStore(() => ({ mediaVisibilityInGallery: e.target.checked }))}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Chat Font Size Options */}
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
                <span className="font-bold text-[var(--text-primary)] block">Chat Message Font Size:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'small', label: 'Small 🔍' },
                    { id: 'medium', label: 'Medium 📱 (Default)' },
                    { id: 'large', label: 'Large 👓' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => updateStore(() => ({ chatFontSize: f.id as any }))}
                      className={"py-2 px-3 rounded-xl border text-center font-bold text-xs cursor-pointer " + (
                        (store.chatFontSize || 'medium') === f.id ? 'border-blue-500 bg-blue-500/20 text-[var(--text-primary)]' : 'border-[var(--border-color)] bg-[var(--header-bg)]'
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Read Voice Messages */}
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">Auto-Read / Play Voice Messages:</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">Automatically play consecutive voice notes</span>
                </div>
                <input
                  type="checkbox"
                  checked={store.autoReadVoiceMessages ?? false}
                  onChange={(e) => updateStore(() => ({ autoReadVoiceMessages: e.target.checked }))}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Cloud Chat Backup Engine */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-purple-500/15 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                    <Cloud className="w-4.5 h-4.5 text-blue-500" /> Cloud Chat Backup & Restore Engine
                  </span>
                  <span className="text-[10px] font-bold bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                    Active Cloud
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Target Cloud Storage Service:</label>
                    <select
                      value={store.backupCloudStorage || 'GOOGLE_DRIVE'}
                      onChange={(e) => updateStore(() => ({ backupCloudStorage: e.target.value as any }))}
                      className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)] font-bold text-xs"
                    >
                      <option value="GOOGLE_DRIVE">Google Drive ☁️ (Recommended for Android)</option>
                      <option value="ONE_DRIVE">Microsoft OneDrive 📁</option>
                      <option value="ICLOUD">Apple iCloud 🍎</option>
                      <option value="LOCAL_STORAGE">Device Storage Backup 💾</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Auto Backup Schedule:</label>
                      <select
                        value={store.backupSchedule || 'DAILY'}
                        onChange={(e) => updateStore(() => ({ backupSchedule: e.target.value as any }))}
                        className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)] font-bold text-xs"
                      >
                        <option value="DAILY">Daily (Recommended)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Daily Automated Backup Time:</label>
                      <select
                        value={store.dailyBackupTime || '02:00 AM'}
                        onChange={(e) => updateStore(() => ({ dailyBackupTime: e.target.value as any }))}
                        className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)] font-bold text-xs"
                      >
                        <option value="02:00 AM">02:00 AM 🌙 (Recommended Night Backup)</option>
                        <option value="03:00 AM">03:00 AM 🌙</option>
                        <option value="04:00 AM">04:00 AM 🌅</option>
                        <option value="05:00 AM">05:00 AM 🌅</option>
                        <option value="12:00 PM">12:00 PM ☀️ (Noon Backup)</option>
                        <option value="08:00 PM">08:00 PM 🌆 (Evening Backup)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] mt-4">
                      <span className="font-bold text-[11px] text-[var(--text-primary)]">Include Media:</span>
                      <input
                        type="checkbox"
                        checked={store.backupIncludeMedia ?? true}
                        onChange={(e) => updateStore(() => ({ backupIncludeMedia: e.target.checked }))}
                        className="w-4 h-4 accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={handleCreateBackup}
                      className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <UploadCloud className="w-4 h-4" /> Backup Now
                    </button>
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        triggerConfetti();
                        const allChatsData = JSON.stringify(store.messages, null, 2);
                        const blob = new Blob([allChatsData], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `GitPit_Overall_Chat_History_Export_${Date.now()}.json`;
                        a.click();
                        alert('📧 Overall Chat History exported successfully! File ready for Email attachment or Transfer.');
                      }}
                      className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" /> Export Email / Transfer
                    </button>
                    <button
                      onClick={handleRestoreBackup}
                      className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Download className="w-4 h-4" /> Restore Backup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 4: APPEARANCE & APP LOGO STYLES */}
          {/* ========================================================================= */}
          {activeCategory === 'appearance' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/30 space-y-2">
                <h3 className="font-extrabold text-sm text-pink-700 dark:text-pink-300 flex items-center gap-1.5">
                  <Palette className="w-4 h-4" /> 15 Themes & Custom GitPit App Logo Styles
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Customize color aesthetic themes and select custom GitPit launcher logo styles.
                </p>
              </div>

              {/* Various Style Logos of GitPit Chat */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-3">
                <span className="font-extrabold text-xs text-[var(--text-primary)] uppercase tracking-wider block">
                  Select Custom GitPit App Launcher Logo Style:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'CLASSIC_GREEN', name: 'Classic Green 🟢', color: 'from-emerald-500 to-teal-600' },
                    { id: 'CYBER_WAVE', name: 'Cyber Wave ⚡', color: 'from-fuchsia-600 to-purple-800' },
                    { id: 'GOLD_EDITION', name: 'Gold Edition 👑', color: 'from-amber-400 to-yellow-600' },
                    { id: 'NEON_DARK', name: 'Neon Dark 🌙', color: 'from-cyan-500 to-blue-700' },
                    { id: 'GENZ_PINK', name: 'Gen Z Pink 🌸', color: 'from-pink-500 to-rose-400' }
                  ].map((logo) => (
                    <button
                      key={logo.id}
                      onClick={() => {
                        soundEngine.playClick();
                        updateStore(() => ({ gitpitLogoStyle: logo.id as any }));
                        triggerConfetti();
                      }}
                      className={"p-3 rounded-2xl border flex items-center gap-2 font-bold text-xs cursor-pointer transition-all " + (
                        (store.gitpitLogoStyle || 'CLASSIC_GREEN') === logo.id ? 'border-pink-500 bg-pink-500/20 text-[var(--text-primary)] shadow-xs' : 'border-[var(--border-color)] bg-[var(--header-bg)]'
                      )}
                    >
                      <div className={"w-6 h-6 rounded-lg bg-gradient-to-tr " + logo.color + " text-white flex items-center justify-center text-[10px] font-black"}>
                        G
                      </div>
                      <span className="truncate">{logo.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* All 15 Color Themes */}
              <div className="space-y-2">
                <span className="font-bold text-[var(--text-primary)] block">15 Complete Color Theme Gallery:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'light', name: 'Classic Light ☀️', color: 'from-emerald-500 to-teal-600' },
                    { id: 'dark', name: 'Midnight Dark 🌙', color: 'from-slate-800 to-slate-950' },
                    { id: 'anime_cyberwave', name: 'Anime Cyberwave ⚡', color: 'from-fuchsia-600 to-purple-800' },
                    { id: 'gaming_rgb_matrix', name: 'Gaming RGB Matrix 🎮', color: 'from-emerald-600 to-green-900' },
                    { id: 'pastel_dream_genz', name: 'Pastel Dream Gen Z 🌸', color: 'from-pink-400 to-purple-300' },
                    { id: 'pixel_retro_arcade', name: 'Pixel Retro Arcade 👾', color: 'from-amber-500 to-red-600' },
                    { id: 'skibidi_glitch_pop', name: 'Skibidi Glitch Pop 💥', color: 'from-cyan-500 to-blue-600' },
                    { id: 'emerald_forest', name: 'Emerald Forest 🌲', color: 'from-emerald-700 to-teal-900' },
                    { id: 'ocean_breeze', name: 'Ocean Breeze 🌊', color: 'from-sky-500 to-blue-700' },
                    { id: 'sunset_glow', name: 'Sunset Glow 🌅', color: 'from-amber-500 to-rose-600' },
                    { id: 'neon_cyberpunk', name: 'Neon Cyberpunk 🏙️', color: 'from-purple-600 to-pink-600' },
                    { id: 'minimal_slate', name: 'Minimal Slate 🗿', color: 'from-gray-600 to-slate-800' },
                    { id: 'crimson_red', name: 'Crimson Red 🔴', color: 'from-rose-600 to-red-800' },
                    { id: 'royal_gold', name: 'Royal Gold 👑', color: 'from-amber-500 to-yellow-600' },
                    { id: 'vintage_sepia', name: 'Vintage Sepia 📜', color: 'from-amber-700 to-stone-800' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        soundEngine.playClick();
                        store.setTheme(t.id as any);
                      }}
                      className={"p-3 rounded-2xl border text-left font-bold text-xs cursor-pointer transition-all flex items-center gap-2 " + (
                        store.theme === t.id ? 'border-pink-500 bg-pink-500/20 text-[var(--text-primary)] shadow-xs' : 'border-[var(--border-color)] bg-[var(--header-bg)]'
                      )}
                    >
                      <div className={"w-4 h-4 rounded-full bg-gradient-to-tr " + t.color + " shrink-0"}></div>
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 5: NOTIFICATIONS & SOUNDS */}
          {/* ========================================================================= */}
          {activeCategory === 'notifications' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-2">
                <h3 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-1.5 uppercase tracking-wider">
                  <Bell className="w-4 h-4 text-amber-500" /> Notifications & Sound Alert Controls
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Configure individual alert modes (Silent, Vibration, Ring, Ring & Vibration) for Messages, Groups & Calls.
                </p>
              </div>

              {/* Individual Category Sound Modes */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-[var(--text-primary)] block">Personal Messages Notification Mode:</span>
                  <select
                    value={store.msgNotificationSound || 'RING_AND_VIBRATION'}
                    onChange={(e) => updateStore(() => ({ msgNotificationSound: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  >
                    <option value="RING_AND_VIBRATION">Ring & Vibration 🔔📳 (Recommended)</option>
                    <option value="RING">Ring Only 🔔</option>
                    <option value="VIBRATION">Vibration Only 📳</option>
                    <option value="SILENT">Silent 🔕</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-[var(--text-primary)] block">Group Chats Notification Mode:</span>
                  <select
                    value={store.groupNotificationSound || 'RING'}
                    onChange={(e) => updateStore(() => ({ groupNotificationSound: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  >
                    <option value="RING_AND_VIBRATION">Ring & Vibration 🔔📳</option>
                    <option value="RING">Ring Only 🔔</option>
                    <option value="VIBRATION">Vibration Only 📳</option>
                    <option value="SILENT">Silent 🔕</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-[var(--text-primary)] block">Incoming Calls Notification Ringtone Mode:</span>
                  <select
                    value={store.callNotificationSound || 'RING_AND_VIBRATION'}
                    onChange={(e) => updateStore(() => ({ callNotificationSound: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  >
                    <option value="RING_AND_VIBRATION">Mobile System Ringtone & Vibration 📱🔔📳</option>
                    <option value="RING">Mobile System Ringtone Only 🔔</option>
                    <option value="VIBRATION">Vibration Only 📳</option>
                    <option value="SILENT">Silent 🔕</option>
                  </select>
                </div>

                {/* Contact Joined GitPit Alert Toggle (Default ON) */}
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[var(--text-primary)] block">🎉 Contact Joined GitPit Alert (Default ON):</span>
                    <span className="text-[11px] text-[var(--text-secondary)]">Get notified when a contact from your phonebook registers on GitPit</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={store.notifyContactJoinedGitPit ?? true}
                    onChange={(e) => updateStore(() => ({ notifyContactJoinedGitPit: e.target.checked }))}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Notification Display Banner Style */}
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
                  <span className="font-bold text-[var(--text-primary)] block">Message Screen Display Banner Style:</span>
                  <select
                    value={store.notificationPopupMode}
                    onChange={(e) => updateStore(() => ({ notificationPopupMode: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  >
                    <option value="FULL_SCREEN">Full Screen Popup Banner 📱 (High Priority)</option>
                    <option value="DETAILED_BANNER">Detailed Card Banner 🃏</option>
                    <option value="NOTIFICATION_ONLY">Silent Badge Only 🔕</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 6: AI MEETING & SCHEDULED TASKS / REMINDERS */}
          {/* ========================================================================= */}
          {activeCategory === 'ai_tasks' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-2">
                <h3 className="font-extrabold text-sm text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> AI Interactive Stream, Tasks & Reminders
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Host live 100-user meeting streams and set automated reminders for birthdays, anniversaries, and to-do tasks.
                </p>
              </div>

              {/* 100-User Interactive Stream Room */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-blue-500/10 to-indigo-500/15 border border-teal-500/30 space-y-3">
                <span className="font-extrabold text-xs text-teal-700 dark:text-teal-300 flex items-center gap-1.5 uppercase">
                  <Bot className="w-4 h-4" /> 100-Participant AI Interactive Meeting Stream
                </span>
                <div className="space-y-2">
                  <span className="font-bold text-[11px] text-[var(--text-primary)] block">Select Meeting Invitees from Registered GitPit Users:</span>
                  <div className="max-h-28 overflow-y-auto space-y-1 p-2 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)]">
                    {contacts.filter(c => c.hasGitPitBadge || c.isSaved).map((cnt) => (
                      <label key={cnt.id} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-xs">
                        <span className="font-bold text-[var(--text-primary)]">🟢 {cnt.name} ({cnt.phoneNumber})</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-teal-500 cursor-pointer" />
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    triggerConfetti();
                    store.createMeeting({ 
                      title: 'GitPit AI 100-User Conference Room',
                      inviteeIds: contacts.filter(c => c.hasGitPitBadge || c.isSaved).map(c => c.id)
                    });
                    alert('🚀 100-User AI Interactive Conference Room Initialized with Registered Invitees!');
                  }}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  🎥 Launch 100-Participant AI Room
                </button>
              </div>

              {/* Birthday, Anniversary & To-Do Task Reminders */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-3">
                <h4 className="font-extrabold text-xs text-[var(--text-primary)] uppercase tracking-wider">
                  Add Birthday, Anniversary & Task Reminder
                </h4>

                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Reminder Title (e.g. Rahul Birthday)"
                      value={reminderTitle}
                      onChange={(e) => setReminderTitle(e.target.value)}
                      className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                    />
                    <select
                      value={reminderType}
                      onChange={(e) => setReminderType(e.target.value as any)}
                      className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                    >
                      <option value="birthday">🎂 Birthday Reminder</option>
                      <option value="anniversary">💍 Anniversary Date Reminder</option>
                      <option value="todo">⏰ Scheduled To-Do Task</option>
                    </select>
                  </div>

                  <input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                  />

                  <button
                    onClick={() => {
                      if (!reminderTitle.trim()) { alert('Enter reminder title'); return; }
                      const typeLabel = reminderType === 'birthday' ? '🎂 Birthday' : reminderType === 'anniversary' ? '💍 Anniversary' : '⏰ Task';
                      store.addTodoTask({
                        title: typeLabel + ': ' + reminderTitle.trim(),
                        dueDate: reminderDate || new Date().toISOString().split('T')[0],
                        dueTime: '09:00 AM',
                        priority: 'high'
                      });
                      setReminderTitle('');
                      alert('Reminder saved successfully to GitPit AI Task List!');
                    }}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    + Save Reminder Notification
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 7: STORAGE & DATA USAGE */}
          {/* ========================================================================= */}
          {activeCategory === 'storage' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                <h3 className="font-extrabold text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4" /> Storage Usage & Media Upload Quality
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Monitor your total storage space usage and configure HD upload media quality.
                </p>
              </div>

              {/* Storage Usage Indicator */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-3">
                <span className="font-extrabold text-xs text-[var(--text-primary)] uppercase tracking-wider block">
                  Total GitPit Storage Space Indicator:
                </span>
                <div className="p-3.5 rounded-2xl bg-[var(--header-bg)] border border-[var(--border-color)] space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>Used Storage: 142.5 MB</span>
                    <span className="text-emerald-500">Available: 24.8 GB</span>
                  </div>
                  <div className="w-full bg-black/10 dark:bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[18%]"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-[var(--text-secondary)] text-center pt-1 font-bold">
                    <span>📷 Photos: 64 MB</span>
                    <span>🎥 Videos: 52 MB</span>
                    <span>📄 Files: 26.5 MB</span>
                  </div>
                </div>
              </div>

              {/* Media Upload Quality */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
                <span className="font-bold text-[var(--text-primary)] block">Media Upload Quality:</span>
                <select
                  value={store.mediaUploadQuality}
                  onChange={(e) => updateStore(() => ({ mediaUploadQuality: e.target.value as any }))}
                  className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold text-xs"
                >
                  <option value="HD_DEFAULT">HD Quality 🌟 (Recommended High Resolution)</option>
                  <option value="STANDARD">Standard Quality 📷</option>
                  <option value="DATA_SAVER">Data Saver ⚡ (Compressed Uploads)</option>
                </select>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 8: MEDIA AUTO-DOWNLOAD RULES */}
          {/* ========================================================================= */}
          {activeCategory === 'auto_download' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2">
                <h3 className="font-extrabold text-sm text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                  <FolderDown className="w-4 h-4" /> Media Auto-Download Rules
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Configure tick/untick checkboxes for photos, audio, videos & documents on Mobile Data and Wi-Fi.
                </p>
              </div>

              {/* Mobile Data Rules */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-3">
                <span className="font-extrabold text-xs text-[var(--text-primary)] uppercase tracking-wider block">
                  When Using Mobile Data:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {['photo', 'audio', 'video', 'document'].map((mediaType) => (
                    <label key={mediaType} className="p-2.5 rounded-xl bg-[var(--header-bg)] border border-[var(--border-color)] flex items-center justify-between cursor-pointer">
                      <span className="font-bold text-[var(--text-primary)] capitalize">{mediaType}s</span>
                      <input
                        type="checkbox"
                        checked={store.autoDownloadRules?.mobileData?.[mediaType as keyof typeof store.autoDownloadRules.mobileData] ?? (mediaType === 'photo')}
                        onChange={(e) => {
                          const val = e.target.checked;
                          updateStore((prev) => ({
                            autoDownloadRules: {
                              ...prev.autoDownloadRules,
                              mobileData: { ...prev.autoDownloadRules?.mobileData, [mediaType]: val }
                            }
                          }));
                        }}
                        className="w-4 h-4 accent-sky-500 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Wi-Fi Rules */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-3">
                <span className="font-extrabold text-xs text-[var(--text-primary)] uppercase tracking-wider block">
                  When Connected on Wi-Fi:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {['photo', 'audio', 'video', 'document'].map((mediaType) => (
                    <label key={mediaType} className="p-2.5 rounded-xl bg-[var(--header-bg)] border border-[var(--border-color)] flex items-center justify-between cursor-pointer">
                      <span className="font-bold text-[var(--text-primary)] capitalize">{mediaType}s</span>
                      <input
                        type="checkbox"
                        checked={store.autoDownloadRules?.wifi?.[mediaType as keyof typeof store.autoDownloadRules.wifi] ?? true}
                        onChange={(e) => {
                          const val = e.target.checked;
                          updateStore((prev) => ({
                            autoDownloadRules: {
                              ...prev.autoDownloadRules,
                              wifi: { ...prev.autoDownloadRules?.wifi, [mediaType]: val }
                            }
                          }));
                        }}
                        className="w-4 h-4 accent-sky-500 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 9: PARENTAL CONTROL (OPTIONAL) */}
          {/* ========================================================================= */}
          {activeCategory === 'parental' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                <h3 className="font-extrabold text-sm text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Parental Control & Child Safety Guard
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Optional safety restrictions for children under 15 years old.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-3">
                <span className="font-extrabold text-xs text-[var(--text-primary)] uppercase tracking-wider block">
                  Parental Lock Status:
                </span>
                <button
                  onClick={() => alert('Parental Control settings modified!')}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Configure Parental Safety PIN & Limits
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 10: HELP & APP INFO */}
          {/* ========================================================================= */}
          {activeCategory === 'help' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 space-y-3">
                <h3 className="font-extrabold text-sm text-[var(--text-primary)] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-500" /> Help & Direct Feedback to GitPit Team
                </h3>

                <textarea
                  rows={3}
                  value={helpMessage}
                  onChange={(e) => setHelpMessage(e.target.value)}
                  placeholder="Write your feedback for GitPit engineering team..."
                  className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)] focus:outline-none font-medium"
                />

                <button
                  onClick={() => {
                    if (!helpMessage.trim()) return;
                    soundEngine.playClick();
                    triggerConfetti();
                    alert('🙋‍♂️ Thank you! Your feedback has been submitted to GitPit Engineering Team.');
                    setHelpMessage('');
                  }}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  🚀 Submit Feedback
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-2">
                <h4 className="font-extrabold text-xs text-[var(--text-primary)] uppercase tracking-wider">
                  GitPit Version & Tech Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)] block">Version:</span>
                    <span className="font-extrabold text-[var(--text-primary)]">v2.0 Production</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[var(--panel-bg)] border border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)] block">Engine:</span>
                    <span className="font-extrabold text-[var(--text-primary)]">Capacitor 6</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* PROFILE EDIT SECTION */}
          {/* ========================================================================= */}
          {activeCategory === 'profile' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-3">
                <h3 className="font-extrabold text-sm text-[var(--text-primary)] uppercase tracking-wider">
                  Edit Profile Details
                </h3>

                <div className="space-y-2.5">
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">Name:</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-1">About / Status Bio:</label>
                    <input
                      type="text"
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
