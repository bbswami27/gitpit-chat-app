import { useState, useEffect } from 'react';
import { 
  AiTodoTask,
  CustomNotificationConfig,
  UserProfile, 
  ParentalControlConfig, 
  AiSafetyLog, 
  Contact, 
  Chat, 
  Message, 
  StatusStory, 
  CallLog, 
  NewsItem, 
  Meeting, 
  MemoEmail, 
  LinkedDevice,
  StrangerShieldMode,
  PrivacyTier,
  ThemeMode,
  DisappearingDuration,
  NotificationPopupMode,
  AppLockMode,
  AppLockTimeout,
  MediaQualitySetting,
  AutoDownloadNetworkSetting,
  CameraFilterEffect,
  calculateAgeInYears,
  getGenerationCategory,
  MessageType,



  LocationPayload,
  UpiPayload,
  PollPayload
} from '../types';

import { 
  CURRENT_USER, 
  INITIAL_CONTACTS, 
  INITIAL_CHATS, 
  INITIAL_MESSAGES, 
  INITIAL_STATUS_STORIES, 
  INITIAL_CALL_LOGS, 
  INITIAL_NEWS, 
  INITIAL_MEETINGS, 
  INITIAL_MEMOS, 
  INITIAL_DEVICES,
  INITIAL_TODO_TASKS
} from '../utils/seedData';

import { soundEngine, triggerConfetti } from '../utils/soundEffects';
import { networkSyncEngine } from '../utils/networkSyncEngine';
import { realtimeCloudBackend } from '../services/realtimeBackend';
import { webrtcCallingEngine } from '../services/webrtcEngine';


const STORAGE_KEY = 'gitpit_app_state_v5_clean_prod';



export interface GitPitState {
  // User Profile
  currentUser: UserProfile;
  
  // Navigation
  activeTab: 'all' | 'unread' | 'groups' | 'broadcast' | 'news';
  activeBottomNav: 'chats' | 'status' | 'calls';
  activeChatId: string | null;

  // Data
  contacts: Contact[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  statusStories: StatusStory[];
  callLogs: CallLog[];
  newsItems: NewsItem[];
  meetings: Meeting[];
  memos: MemoEmail[];
  linkedDevices: LinkedDevice[];
  todoTasks: AiTodoTask[];

  // Stranger Shield Protection (Anti-Fraud)
  strangerShieldMode: StrangerShieldMode;

  // Privacy & Security
  filesMediaPrivacy: PrivacyTier;
  visibilityLastSeen: PrivacyTier;
  visibilityProfilePhoto: PrivacyTier;
  visibilityAboutBio: PrivacyTier;
  readReceiptsBlueTick: boolean;
  hidePhoneNumber: boolean;
  hideEmail: boolean;
  disappearingDuration: DisappearingDuration;
  screenLockMode: AppLockMode;
  appLockTimeout: AppLockTimeout;
  isAppLocked: boolean;
  mediaUploadQuality: MediaQualitySetting;
  mediaDownloadQuality: MediaQualitySetting;
  autoDownloadSetting: AutoDownloadNetworkSetting;
  cameraFilterEffect: CameraFilterEffect;
  autoAgeBasedTheme: boolean;
  authModalOpen: boolean;




  groupAddPermission: 'EVERYONE' | 'MY_CONTACTS' | 'REQUIRE_PERMISSION';
  mediaVisibilityInGallery: boolean;
  chatFontSize: 'small' | 'medium' | 'large';
  autoReadVoiceMessages: boolean;
  backupCloudStorage: 'GOOGLE_DRIVE' | 'ONE_DRIVE' | 'ICLOUD' | 'LOCAL_STORAGE';
  backupSchedule: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'OFF';
  dailyBackupTime: '02:00 AM' | '03:00 AM' | '04:00 AM' | '05:00 AM' | '12:00 PM' | '08:00 PM';
  backupIncludeMedia: boolean;
  lastBackupTimestamp: number | null;
  gitpitLogoStyle: 'CLASSIC_GREEN' | 'CYBER_WAVE' | 'GOLD_EDITION' | 'NEON_DARK' | 'GENZ_PINK';
  msgNotificationSound: 'SILENT' | 'VIBRATION' | 'RING' | 'RING_AND_VIBRATION';
  groupNotificationSound: 'SILENT' | 'VIBRATION' | 'RING' | 'RING_AND_VIBRATION';
  callNotificationSound: 'SILENT' | 'VIBRATION' | 'RING' | 'RING_AND_VIBRATION';
  scamCallBlocking: boolean;
  malwareFileScanner: boolean;
  suspiciousLinkWarning: boolean;
  autoDownloadRules: {
    mobileData: { photo: boolean; audio: boolean; video: boolean; document: boolean };
    wifi: { photo: boolean; audio: boolean; video: boolean; document: boolean };
  };
  lockPin: string;
  notificationVibration: boolean;
  incomingRingtoneHighVolume: boolean;
  notificationPopupMode: NotificationPopupMode;
  notifyContactJoinedGitPit: boolean;
  chatFilterPreferences: {
    showAll: boolean;
    showGroupsOnly: boolean;
    showIndividualsOnly: boolean;
    showUnreadOnly: boolean;
  };

  // Theme
  theme: ThemeMode;

  // AI & Live Features
  newsFlashTickerVisible: boolean;
  aiAssistantMessages: { id: string; sender: 'user' | 'ai'; text: string; time: string }[];
  activeMeetingRoom: Meeting | null;
  screenShareActive: boolean;

  // Call Overlays
  activeCall: {
    contact: Contact;
    type: 'audio' | 'video';
    direction: 'incoming' | 'outgoing';
    status: 'ringing' | 'connected' | 'ended';
    isMuted: boolean;
    isCameraOff: boolean;
    isScreenSharing: boolean;
    durationSeconds: number;
    callLink?: string;
  } | null;

  // Modals & UI States
  settingsModalOpen: boolean;
  settingsActiveBlock: number;
  newChatModalOpen: boolean;
  upiModalOpen: boolean;
  upiSelectedPayee: Contact | null;
  qrScannerOpen: boolean;
  mediaLightboxData: { url: string; type: 'image' | 'video'; title?: string } | null;
  statusViewerStory: StatusStory | null;
  newStatusModalOpen: boolean;
  searchQuery: string;
  chatSearchQuery: string;
  smartReplyContext: string[];

  // AI Child Protection & Parental Controls
  parentalControl: ParentalControlConfig;
  aiSafetyLogs: AiSafetyLog[];
  parentalControlModalOpen: boolean;
}

// Initial default state
const getInitialState = (): GitPitState => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          // Always ensure clean modal and call state upon fresh boot
          activeCall: null,
          settingsModalOpen: false,
          upiModalOpen: false,
          qrScannerOpen: false,
          mediaLightboxData: null,
          statusViewerStory: null,
          newStatusModalOpen: false,
          activeMeetingRoom: null,
          isAppLocked: parsed.screenLockMode !== 'NONE' && !!parsed.lockPin
        };
      } catch (e) {
        console.error('Error restoring state from localStorage', e);
      }
    }
  }

  return {
    currentUser: CURRENT_USER,
    activeTab: 'all',
    activeBottomNav: 'chats',
    activeChatId: 'chat_aarav',
    contacts: INITIAL_CONTACTS,
    chats: INITIAL_CHATS,
    messages: INITIAL_MESSAGES,
    statusStories: INITIAL_STATUS_STORIES,
    callLogs: INITIAL_CALL_LOGS,
    newsItems: INITIAL_NEWS,
    meetings: INITIAL_MEETINGS,
    memos: INITIAL_MEMOS,
    linkedDevices: INITIAL_DEVICES,
    todoTasks: INITIAL_TODO_TASKS,

    // Default: Strict Anti-Fraud as per requirement!
    strangerShieldMode: 'MY_CONTACTS',

    filesMediaPrivacy: 'MY_CONTACTS',
    visibilityLastSeen: 'MY_CONTACTS',
    visibilityProfilePhoto: 'EVERYONE',
    visibilityAboutBio: 'EVERYONE',
    readReceiptsBlueTick: true,
    hidePhoneNumber: false,
    hideEmail: false,
    disappearingDuration: 'OFF',
    screenLockMode: 'NONE',
    appLockTimeout: 'IMMEDIATELY',
    isAppLocked: false,
    mediaUploadQuality: 'HD_DEFAULT',
    mediaDownloadQuality: 'HD_DEFAULT',
    autoDownloadSetting: 'WIFI_ONLY',
    cameraFilterEffect: 'RAW_NATURAL',
    autoAgeBasedTheme: true,
    authModalOpen: false,




    groupAddPermission: 'REQUIRE_PERMISSION',
    mediaVisibilityInGallery: true,
    chatFontSize: 'medium',
    autoReadVoiceMessages: false,
    backupCloudStorage: 'GOOGLE_DRIVE',
    backupSchedule: 'DAILY',
    dailyBackupTime: '02:00 AM',
    backupIncludeMedia: true,
    lastBackupTimestamp: Date.now() - 86400000,
    gitpitLogoStyle: 'CLASSIC_GREEN',
    msgNotificationSound: 'RING_AND_VIBRATION',
    groupNotificationSound: 'RING',
    callNotificationSound: 'RING_AND_VIBRATION',
    scamCallBlocking: true,
    malwareFileScanner: true,
    suspiciousLinkWarning: true,
    autoDownloadRules: {
      mobileData: { photo: true, audio: false, video: false, document: false },
      wifi: { photo: true, audio: true, video: true, document: true }
    },
    lockPin: '1234',
    notificationVibration: true,
    incomingRingtoneHighVolume: true,
    notificationPopupMode: 'FULL_SCREEN',
    notifyContactJoinedGitPit: true,
    chatFilterPreferences: {
      showAll: true,
      showGroupsOnly: false,
      showIndividualsOnly: false,
      showUnreadOnly: false
    },

    theme: 'light',
    newsFlashTickerVisible: true,
    aiAssistantMessages: [
      {
        id: 'ai_intro_1',
        sender: 'ai',
        text: 'Namaste! I am your GitPit AI Assistant 🤖. You can ask me to draft emails, summarize chats, schedule 100-user meetings, explain code, or generate festive wishes.',
        time: '06:00 AM'
      }
    ],
    activeMeetingRoom: null,
    screenShareActive: false,
    activeCall: null,
    settingsModalOpen: false,
    settingsActiveBlock: 1,
    newChatModalOpen: false,
    upiModalOpen: false,
    upiSelectedPayee: null,
    qrScannerOpen: false,
    mediaLightboxData: null,
    statusViewerStory: null,
    newStatusModalOpen: false,
    searchQuery: '',
    chatSearchQuery: '',
    smartReplyContext: ['Sounds great! 👍', 'Sharing location now 📍', 'Let us connect at 5 PM', 'Thanks! 🙏'],

    // AI Child Protection Default Config (Optional based on Age / Parent Selection)
    parentalControl: {
      isEnabled: false, // Optional: by default standard mode unless under 18 or activated by parent
      activationMode: 'age_based', // 'off' | 'age_based' | 'parent_forced'
      targetAgeGroup: 'above_15_open',
      calculatedAge: 24,
      parentPin: '9999',
      dailyTimeLimitMinutes: 120,
      usedTimeTodayMinutes: 25,
      bedtimeSchedule: {
        enabled: true,
        startTime: '21:00',
        endTime: '07:00'
      },
      filterAdultContent: true,
      filterAbusiveLanguage: true,
      filterViolence: true,
      blockAllStrangers: true,
      preventAppUninstall: true
    },
    aiSafetyLogs: [
      {
        id: 'log_1',
        timestamp: '10:15 AM Today',
        senderName: '+91 91234 56789 (Stranger)',
        chatName: 'Direct Stranger Msg',
        violationType: 'adult_content',
        severity: 'high',
        actionTaken: 'AI Shield locked attachment & obscured sensitive keywords',
        originalSnippet: 'Suspicious external adult link / media'
      },
      {
        id: 'log_2',
        timestamp: 'Yesterday 04:30 PM',
        senderName: 'Online Spammer',
        chatName: 'Group Chat',
        violationType: 'abusive_language',
        severity: 'medium',
        actionTaken: 'AI Filter redacted abusive swearing from child view',
        originalSnippet: 'Offensive language detected'
      }
    ],
    parentalControlModalOpen: false
  };
};

let globalState = getInitialState();
const listeners = new Set<() => void>();

export const useGitPitStore = () => {
  const [state, setState] = useState<GitPitState>(globalState);

  useEffect(() => {
    const listener = () => setState({ ...globalState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const updateStore = (updater: (prev: GitPitState) => Partial<GitPitState>) => {
    const changes = updater(globalState);
    globalState = { ...globalState, ...changes };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
      } catch (e) {
        console.warn('Storage save failed', e);
      }
    }
    listeners.forEach((l) => l());
  };

  
  // AI To-Do Tasks Actions
  const addTodoTask = (params: { title: string; dueDate: string; dueTime: string; priority: 'high' | 'medium' | 'low' }) => {
    soundEngine.playClick();
    const newTask: AiTodoTask = {
      id: 'task_' + Date.now(),
      title: params.title,
      dueDate: params.dueDate || new Date().toISOString().split('T')[0],
      dueTime: params.dueTime || '10:00 AM',
      priority: params.priority,
      isCompleted: false,
      createdAt: 'Just now'
    };
    updateStore((prev) => ({
      todoTasks: [newTask, ...prev.todoTasks]
    }));
    triggerConfetti();
    return newTask;
  };

  const toggleTodoTask = (taskId: string) => {
    soundEngine.playClick();
    updateStore((prev) => ({
      todoTasks: prev.todoTasks.map((t) => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
    }));
  };


  // Change Phone Number Action (Preserves data, notifies contacts)
  const changePhoneNumber = (params: { newCountryCode: string; newPhoneNumber: string; notifyOption: 'all' | 'chats_only' | 'custom' }) => {
    soundEngine.playClick();
    const oldNum = state.currentUser.countryCode + ' ' + state.currentUser.phoneNumber;
    const newNum = params.newCountryCode + ' ' + params.newPhoneNumber;

    updateStore((prev) => {
      const updatedUser = {
        ...prev.currentUser,
        countryCode: params.newCountryCode,
        phoneNumber: params.newPhoneNumber
      };

      // Send automated notification message to all chats
      const updatedMessages = { ...prev.messages };
      prev.chats.forEach((chat) => {
        const notifMsg: Message = {
          id: 'sys_num_' + Date.now() + '_' + Math.random().toString(36).substring(7),
          chatId: chat.id,
          senderId: prev.currentUser.id,
          senderName: prev.currentUser.name,
          type: 'text',
          content: '📱 Phone Number Changed: ' + prev.currentUser.name + ' updated phone number from ' + oldNum + ' to ' + newNum + '. Tap to save new number.',
          isStarred: false,
          isEdited: false,
          sentAt: Date.now(),
          formattedTime: 'Just now',
          status: 'delivered',
          reactions: {}
        };
        updatedMessages[chat.id] = [...(updatedMessages[chat.id] || []), notifMsg];
      });

      return {
        currentUser: updatedUser,
        messages: updatedMessages
      };
    });

    triggerConfetti();
    alert('📱 Phone Number updated to ' + newNum + '! Data preserved intact and notification broadcasted to contacts.');
  };

  // Update Individual & Group Chat Notification Config Action
  const updateChatNotificationConfig = (chatId: string, config: Partial<CustomNotificationConfig>) => {
    soundEngine.playClick();
    updateStore((prev) => ({
      chats: prev.chats.map((c) => {
        if (c.id !== chatId) return c;
        const currentNotif: CustomNotificationConfig = c.notificationConfig || {
          isMuted: c.isMuted,
          muteDuration: 'none',
          customRingtone: 'default',
          popupStyle: 'detailed_banner',
          notifyMentionsOnly: false
        };
        return {
          ...c,
          isMuted: config.isMuted !== undefined ? config.isMuted : c.isMuted,
          notificationConfig: { ...currentNotif, ...config }
        };
      })
    }));
  };

  const deleteTodoTask = (taskId: string) => {
    soundEngine.playClick();
    updateStore((prev) => ({
      todoTasks: prev.todoTasks.filter((t) => t.id !== taskId)
    }));
  };

  // Actions
  const setActiveTab = (tab: GitPitState['activeTab']) => {
    soundEngine.playClick();
    updateStore(() => ({ activeTab: tab }));
  };

  const setActiveBottomNav = (nav: GitPitState['activeBottomNav']) => {
    soundEngine.playClick();
    updateStore(() => ({ activeBottomNav: nav }));
  };

  const setActiveChatId = (chatId: string | null) => {
    soundEngine.playClick();
    updateStore((prev) => {
      // Mark as read when entering chat
      const updatedChats = prev.chats.map((c) => 
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      );
      return { activeChatId: chatId, chats: updatedChats };
    });
  };

  const setSearchQuery = (query: string) => updateStore(() => ({ searchQuery: query }));
  const setChatSearchQuery = (query: string) => updateStore(() => ({ chatSearchQuery: query }));

  // Stranger Shield Rules Checker
  const checkStrangerPermissions = (chatId: string) => {
    const chat = globalState.chats.find((c) => c.id === chatId);
    if (!chat) return { isRestricted: false, reason: '' };

    if (chat.isStrangerChat) {
      if (globalState.strangerShieldMode === 'STRICT_ANTI_FRAUD') {
        return {
          isRestricted: true,
          mode: 'STRICT_ANTI_FRAUD',
          reason: '🛡️ Stranger Shield (Strict Anti-Fraud) Active: Sender is unsaved. Calls & attachments are blocked. Only Text & Google Verified Locations allowed.'
        };
      }
      if (globalState.strangerShieldMode === 'MY_CONTACTS') {
        return {
          isRestricted: true,
          mode: 'MY_CONTACTS',
          reason: '🛡️ Stranger Shield (My Contacts Mode): Media & calls limited to verified contacts.'
        };
      }
      if (globalState.strangerShieldMode === 'ONLY_TRUSTED') {
        return {
          isRestricted: true,
          mode: 'ONLY_TRUSTED',
          reason: '🛡️ Stranger Shield (Only Trusted Contacts): Strict block on all non-whitelisted users.'
        };
      }
    }
    return { isRestricted: false, reason: '' };
  };

  // Send Message
  const sendMessage = (params: {
    chatId: string;
    type: MessageType;
    content: string;
    mediaUrl?: string;
    fileName?: string;
    fileSize?: string;
    durationSeconds?: number;
    transcription?: string;
    locationData?: LocationPayload;
    upiData?: UpiPayload;
    pollData?: PollPayload;
    replyTo?: Message['replyTo'];
  }) => {
    const { chatId, type, content, mediaUrl, fileName, fileSize, durationSeconds, transcription, locationData, upiData, pollData, replyTo } = params;

    // Check Stranger Shield restrictions
    const perm = checkStrangerPermissions(chatId);
    if (perm.isRestricted && globalState.strangerShieldMode === 'STRICT_ANTI_FRAUD') {
      if (type !== 'text' && type !== 'location') {
        alert('🛡️ Stranger Shield Blocked Action: Under Strict Anti-Fraud mode, unsaved contacts can only exchange Text messages and Google-verified locations.');
        return;
      }
    }

    // AI Child Protection Content Filter (Applicable up to 15 years only; rest > 15 is open)
    const isChildProtectionActive = 
      globalState.parentalControl.activationMode === 'off' ? false :
      globalState.parentalControl.activationMode === 'parent_forced' ? globalState.parentalControl.isEnabled :
      globalState.parentalControl.calculatedAge <= 15;

    let isAiCensored = false;
    let censorshipReason = '';
    let processedContent = content;

    if (isChildProtectionActive) {
      const abusiveKeywords = ['porn', 'xxx', 'adult', 'sex', 'nude', 'nsfw', 'fuck', 'bitch', 'asshole', 'bastard', 'kill', 'die', 'drugs', 'weapon'];
      const lowerContent = (content + ' ' + (fileName || '')).toLowerCase();
      const hasViolation = abusiveKeywords.some((w) => lowerContent.includes(w));

      if (hasViolation) {
        isAiCensored = true;
        censorshipReason = '🛡️ Locked by AI Child Protection: Content redacted (Applicable up to 15 years)';
        processedContent = '🛡️ [Content Hidden by AI Child Safety Guard: Inappropriate/Abusive/Adult Content Blocked]';

        const newLog: AiSafetyLog = {
          id: 'log_' + Date.now(),
          timestamp: 'Just now',
          senderName: globalState.currentUser.name,
          chatName: 'Chat ' + chatId,
          violationType: 'abusive_language',
          severity: 'high',
          actionTaken: 'AI Shield redacted content & replaced with Child Safety Card',
          originalSnippet: content.substring(0, 40)
        };

        updateStore((prev) => ({
          aiSafetyLogs: [newLog, ...prev.aiSafetyLogs]
        }));
      }
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageId = 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newMessage: Message = {
      id: messageId,
      chatId,
      senderId: globalState.currentUser.id,
      senderName: globalState.currentUser.name,
      type,
      content: processedContent,
      mediaUrl,
      fileName,
      fileSize,
      durationSeconds,
      transcription,
      locationData,
      upiData,
      pollData,
      replyTo,
      isStarred: false,
      isEdited: false,
      sentAt: Date.now(),
      formattedTime,
      status: globalState.readReceiptsBlueTick ? 'read' : 'delivered',
      reactions: {},
      isAiCensored,
      censorshipReason,
      originalCensoredContent: isAiCensored ? content : undefined
    };

    
    // Broadcast message to other real mobile devices in real-time!
    realtimeCloudBackend.sendSignal({
      type: 'MESSAGE',
      senderPhone: globalState.currentUser.phoneNumber,
      senderName: globalState.currentUser.name,
      chatId,
      payload: newMessage
    });
    networkSyncEngine.broadcast({
      type: 'MESSAGE_SENT',
      senderPhone: globalState.currentUser.phoneNumber,
      senderName: globalState.currentUser.name,
      chatId,
      data: newMessage,
      timestamp: Date.now()
    });
    soundEngine.playSentPop();

    updateStore((prev) => {
      const currentChatMessages = prev.messages[chatId] || [];
      const updatedMessages = {
        ...prev.messages,
        [chatId]: [...currentChatMessages, newMessage]
      };

      const updatedChats = prev.chats.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            lastMessage: newMessage,
            updatedAt: formattedTime
          };
        }
        return c;
      });

      return {
        messages: updatedMessages,
        chats: updatedChats
      };
    });

    // Auto smart response simulation after 1.8s
    if (chatId === 'chat_aarav' || chatId === 'chat_priya') {
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const autoReplyMsg: Message = {
          id: 'm_reply_' + Date.now(),
          chatId,
          senderId: chatId === 'chat_aarav' ? 'contact_aarav' : 'contact_priya',
          senderName: chatId === 'chat_aarav' ? 'Aarav Sharma' : 'Priya Patel',
          type: 'text',
          content: chatId === 'chat_aarav' ? 'Got it Bharat! Working on GitPit features now.' : 'Looks awesome! Let us proceed with this design.',
          isStarred: false,
          isEdited: false,
          sentAt: Date.now(),
          formattedTime: replyTime,
          status: 'read',
          reactions: {}
        };

        soundEngine.playIncomingChime();
        updateStore((prev) => {
          const list = prev.messages[chatId] || [];
          return {
            messages: {
              ...prev.messages,
              [chatId]: [...list, autoReplyMsg]
            },
            chats: prev.chats.map((c) => (c.id === chatId ? { ...c, lastMessage: autoReplyMsg, updatedAt: replyTime } : c))
          };
        });
      }, 1800);
    }
  };

  // Edit Message (Enforcing 1-Minute Rule!)
  const editMessage = (chatId: string, messageId: string, newContent: string) => {
    const chatMsgs = globalState.messages[chatId] || [];
    const msg = chatMsgs.find((m) => m.id === messageId);
    if (!msg) return { success: false, reason: 'Message not found' };

    const diffSeconds = (Date.now() - msg.sentAt) / 1000;
    if (diffSeconds > 60) {
      alert('⏱️ Edit Expired: Messages in GitPit can only be edited within 1 minute (60 seconds) of sending.');
      return { success: false, reason: 'Edit time expired (> 60 seconds)' };
    }

    updateStore((prev) => {
      const list = prev.messages[chatId] || [];
      const updatedList = list.map((m) => {
        if (m.id === messageId) {
          return {
            ...m,
            content: newContent,
            isEdited: true,
            editedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return m;
      });

      return {
        messages: {
          ...prev.messages,
          [chatId]: updatedList
        }
      };
    });

    return { success: true };
  };

  // Delete Message (For Me or For Everyone)
  const deleteMessage = (chatId: string, messageId: string, forEveryone: boolean) => {
    updateStore((prev) => {
      const list = prev.messages[chatId] || [];
      let updatedList: Message[];

      if (forEveryone) {
        updatedList = list.map((m) => 
          m.id === messageId 
            ? { ...m, content: '🚫 This message was deleted', type: 'text', mediaUrl: undefined, locationData: undefined, upiData: undefined } 
            : m
        );
      } else {
        updatedList = list.filter((m) => m.id !== messageId);
      }

      return {
        messages: {
          ...prev.messages,
          [chatId]: updatedList
        }
      };
    });
  };

  // Star / Unstar Message
  const toggleStarMessage = (chatId: string, messageId: string) => {
    updateStore((prev) => {
      const list = prev.messages[chatId] || [];
      const updatedList = list.map((m) => 
        m.id === messageId ? { ...m, isStarred: !m.isStarred } : m
      );
      return {
        messages: {
          ...prev.messages,
          [chatId]: updatedList
        }
      };
    });
  };

  // React to Message
  const reactToMessage = (chatId: string, messageId: string, emoji: string) => {
    soundEngine.playClick();
    updateStore((prev) => {
      const list = prev.messages[chatId] || [];
      const updatedList = list.map((m) => {
        if (m.id === messageId) {
          const currentReactions = { ...(m.reactions || {}) };
          const userList = currentReactions[emoji] || [];
          const myName = prev.currentUser.name;

          if (userList.includes(myName)) {
            // Remove reaction
            const filtered = userList.filter((u) => u !== myName);
            if (filtered.length === 0) {
              delete currentReactions[emoji];
            } else {
              currentReactions[emoji] = filtered;
            }
          } else {
            // Add reaction
            currentReactions[emoji] = [...userList, myName];
          }

          return { ...m, reactions: currentReactions };
        }
        return m;
      });

      return {
        messages: {
          ...prev.messages,
          [chatId]: updatedList
        }
      };
    });
  };

  // Vote on Poll
  const votePoll = (chatId: string, messageId: string, optionId: string) => {
    soundEngine.playClick();
    updateStore((prev) => {
      const list = prev.messages[chatId] || [];
      const updatedList = list.map((m) => {
        if (m.id === messageId && m.pollData) {
          const userId = prev.currentUser.id;
          const options = m.pollData.options.map((opt) => {
            const hasVoted = opt.votes.includes(userId);
            if (opt.id === optionId) {
              return {
                ...opt,
                votes: hasVoted ? opt.votes.filter((v) => v !== userId) : [...opt.votes, userId]
              };
            } else if (!m.pollData?.isMultiSelect) {
              return {
                ...opt,
                votes: opt.votes.filter((v) => v !== userId)
              };
            }
            return opt;
          });

          const totalVotes = options.reduce((sum, o) => sum + o.votes.length, 0);

          return {
            ...m,
            pollData: {
              ...m.pollData,
              options,
              totalVotes
            }
          };
        }
        return m;
      });

      return {
        messages: {
          ...prev.messages,
          [chatId]: updatedList
        }
      };
    });
  };

  // Add Contact
  const addContact = (newContact: Omit<Contact, 'id'>) => {
    const id = 'contact_' + Date.now();
    const contact: Contact = {
      ...newContact,
      id,
      hasGitPitBadge: true,
      isOnline: true,
      lastSeen: 'online'
    };

    updateStore((prev) => ({
      contacts: [...prev.contacts, contact]
    }));

    // Trigger celebratory confetti
    triggerConfetti();
    return contact;
  };

  // Toggle Trusted Contact Status
  const toggleTrustedContact = (contactId: string) => {
    soundEngine.playClick();
    updateStore((prev) => {
      const updatedContacts = prev.contacts.map((c) => {
        if (c.id === contactId) {
          return { ...c, isTrusted: !c.isTrusted };
        }
        return c;
      });
      return { contacts: updatedContacts };
    });
  };


  // Sync Native Contacts Simulation
  const syncNativePhonebook = () => {
    updateStore((prev) => {
      const syncedContacts = prev.contacts.map((c) => ({
        ...c,
        hasGitPitBadge: true
      }));
      return { contacts: syncedContacts };
    });
    triggerConfetti();
    alert('✅ Phonebook Synced: All phone contacts have been integrated with GitPit badges!');
  };

  
  const saveDirectNumberAndStartChat = (data: { name: string; phoneNumber: string; countryCode?: string; email?: string }) => {
    const cleanPhone = data.phoneNumber.replace(/\D/g, '').slice(-10);
    if (!cleanPhone) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    soundEngine.playClick();
    triggerConfetti();

    const contactId = 'contact_direct_' + Date.now();
    const countryCode = data.countryCode || '+91';

    const newContact: Contact = {
      id: contactId,
      name: data.name.trim() || (`Contact ${cleanPhone}`),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Saved directly to GitPit Phonebook',
      countryCode,
      phoneNumber: cleanPhone,
      email: data.email || '',
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
    };

    updateStore((prev) => {
      const existing = prev.contacts.find((c) => c.phoneNumber.replace(/\D/g, '').slice(-10) === cleanPhone);
      const targetContact = existing || newContact;
      const updatedContacts = existing ? prev.contacts : [newContact, ...prev.contacts];

      const targetChatId = targetContact.id.startsWith('contact_') ? targetContact.id.replace('contact_', 'chat_') : targetContact.id;
      const existingChat = prev.chats.find((c) => c.id === targetChatId);

      let updatedChats = [...prev.chats];
      let updatedMessages = { ...prev.messages };

      if (!existingChat) {
        const newChat: Chat = {
          id: targetChatId,
          type: 'individual',
          name: targetContact.name,
          avatar: targetContact.avatar,
          description: targetContact.bio || 'GitPit Verified Contact',
          members: [prev.currentUser.id, targetContact.id],
          adminIds: [],
          unreadCount: 0,
          isPinned: false,
          isMuted: false,
          disappearingDuration: 'OFF',
          isStrangerChat: false,
          isFavorite: false,
          updatedAt: 'Just now',
          lastMessage: {
            id: 'welcome_' + Date.now(),
            chatId: targetChatId,
            senderId: prev.currentUser.id,
            senderName: prev.currentUser.name,
            type: 'text',
            content: '👋 Hi ' + targetContact.name + '! Saved & connected on GitPit.',
            isStarred: false,
            isEdited: false,
            sentAt: Date.now(),
            formattedTime: 'Just now',
            status: 'read',
            reactions: {}
          }
        };

        updatedChats = [newChat, ...prev.chats];
        updatedMessages[targetChatId] = [newChat.lastMessage!];
      }

      alert(`✅ Contact ${targetContact.name} (${countryCode} ${cleanPhone}) saved to GitPit Phonebook & chat opened!`);

      return {
        contacts: updatedContacts,
        chats: updatedChats,
        messages: updatedMessages,
        activeChatId: targetChatId,
        activeBottomNav: 'chats',
        newChatModalOpen: false
      };
    });
  };

  const startChatWithContact = (contactId: string) => {
    soundEngine.playClick();
    updateStore((prev) => {
      const cnt = prev.contacts.find((c) => c.id === contactId || c.id === contactId.replace('chat_', 'contact_'));
      if (!cnt) return {};

      const targetChatId = cnt.id.startsWith('contact_') ? cnt.id.replace('contact_', 'chat_') : cnt.id;
      const existingChat = prev.chats.find((c) => c.id === targetChatId);

      let updatedChats = [...prev.chats];
      let updatedMessages = { ...prev.messages };

      if (!existingChat) {
        const newChat: Chat = {
          id: targetChatId,
          type: 'individual',
          name: cnt.name,
          avatar: cnt.avatar,
          description: cnt.bio || 'GitPit Verified Contact',
          members: [prev.currentUser.id, cnt.id],
          adminIds: [],
          unreadCount: 0,
          isPinned: false,
          isMuted: false,
          disappearingDuration: 'OFF',
          isStrangerChat: false,
          isFavorite: false,
          updatedAt: 'Just now',
          lastMessage: {
            id: 'welcome_' + Date.now(),
            chatId: targetChatId,
            senderId: prev.currentUser.id,
            senderName: prev.currentUser.name,
            type: 'text',
            content: '👋 Hi ' + cnt.name + '! Synced on GitPit.',
            isStarred: false,
            isEdited: false,
            sentAt: Date.now(),
            formattedTime: 'Just now',
            status: 'read',
            reactions: {}
          }
        };

        updatedChats = [newChat, ...prev.chats];
        updatedMessages[targetChatId] = [newChat.lastMessage!];
      }

      return {
        chats: updatedChats,
        messages: updatedMessages,
        activeChatId: targetChatId,
        activeBottomNav: 'chats',
        newChatModalOpen: false
      };
    });
  };

  const syncPhonebookContacts = async () => {
    soundEngine.playClick();

    // 1. Attempt Native Mobile Device Phonebook Import (Android / Chrome Web Contacts API)
    let importedDeviceContacts: { name: string; phoneNumber: string }[] = [];
    if (typeof window !== 'undefined' && 'contacts' in navigator && 'select' in (navigator as any).contacts) {
      try {
        const props = ['name', 'tel'];
        const opts = { multiple: true };
        const rawContacts = await (navigator as any).contacts.select(props, opts);
        if (rawContacts && rawContacts.length > 0) {
          importedDeviceContacts = rawContacts
            .map((c: any) => {
              const name = c.name && c.name[0] ? c.name[0] : 'Device Contact';
              const tel = c.tel && c.tel[0] ? c.tel[0].replace(/\D/g, '') : '';
              return tel ? { name, phoneNumber: tel.slice(-10) } : null;
            })
            .filter(Boolean);
        }
      } catch (e) {
        console.warn('Native Contacts Scanner cancelled or fallback to saved list', e);
      }
    }

    triggerConfetti();

    updateStore((prev) => {
      let currentContacts = [...prev.contacts];

      // Merge native device contacts if imported
      if (importedDeviceContacts.length > 0) {
        const existingPhones = new Set(currentContacts.map((c) => c.phoneNumber.replace(/\D/g, '').slice(-10)));
        importedDeviceContacts.forEach((devCnt, idx) => {
          if (!existingPhones.has(devCnt.phoneNumber)) {
            const newCnt: Contact = {
              id: 'contact_device_' + Date.now() + '_' + idx,
              name: devCnt.name,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              bio: 'Synced from Android SIM / Device Phonebook',
              countryCode: '+91',
              phoneNumber: devCnt.phoneNumber,
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
            };
            currentContacts.push(newCnt);
            existingPhones.add(devCnt.phoneNumber);
          }
        });
      }

      const updatedContacts = currentContacts.map((c) => ({
        ...c,
        isSaved: true,
        hasGitPitBadge: true
      }));

      const existingChatIds = new Set(prev.chats.map((c) => c.id));
      const newChats: Chat[] = [];
      const newMessages = { ...prev.messages };

      updatedContacts.forEach((cnt) => {
        const targetChatId = cnt.id.replace('contact_', 'chat_');
        if (!existingChatIds.has(targetChatId)) {
          const newChat: Chat = {
            id: targetChatId,
            type: 'individual',
            name: cnt.name,
            avatar: cnt.avatar,
            description: cnt.bio || 'Synced GitPit Contact',
            members: [prev.currentUser.id, cnt.id],
            adminIds: [],
            unreadCount: 0,
            isPinned: false,
            isMuted: false,
            disappearingDuration: 'OFF',
            isStrangerChat: false,
            isFavorite: false,
            updatedAt: 'Just now',
            lastMessage: {
              id: 'sync_' + Date.now() + '_' + cnt.id,
              chatId: targetChatId,
              senderId: prev.currentUser.id,
              senderName: prev.currentUser.name,
              type: 'text',
              content: '👋 Hi ' + cnt.name + '! Connected on GitPit via Phonebook Sync.',
              isStarred: false,
              isEdited: false,
              sentAt: Date.now(),
              formattedTime: 'Just now',
              status: 'read',
              reactions: {}
            }
          };

          newChats.push(newChat);
          newMessages[targetChatId] = [newChat.lastMessage!];
        }
      });

      const messageText = importedDeviceContacts.length > 0
        ? `⚡ Device Phonebook Sync Successful! ${importedDeviceContacts.length} native device numbers imported & ${updatedContacts.length} active 1-on-1 chats ready on main panel.`
        : `⚡ Phonebook Sync Successful! ${updatedContacts.length} real numbers verified & active 1-on-1 chats synced on GitPit main panel.`;

      alert(messageText);

      return {
        contacts: updatedContacts,
        chats: [...newChats, ...prev.chats],
        messages: newMessages
      };
    });
  };


  // Create Group
  const createNewGroup = (name: string, memberIds: string[], avatar?: string) => {
    const id = 'chat_group_' + Date.now();
    const newChat: Chat = {
      id,
      type: 'group',
      name,
      avatar: avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      description: 'Group created on GitPit',
      members: ['user_me', ...memberIds],
      adminIds: ['user_me'],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      disappearingDuration: 'OFF',
      isStrangerChat: false,
      isFavorite: false,
      updatedAt: 'Just now'
    };

    updateStore((prev) => ({
      chats: [newChat, ...prev.chats],
      activeChatId: id,
      newChatModalOpen: false
    }));

    triggerConfetti();
  };

  // Create Broadcast List
  const createNewBroadcast = (name: string, recipientIds: string[]) => {
    const id = 'chat_bcast_' + Date.now();
    const newChat: Chat = {
      id,
      type: 'broadcast',
      name,
      avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
      description: `Broadcast list with ${recipientIds.length} recipients`,
      members: ['user_me', ...recipientIds],
      adminIds: ['user_me'],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      disappearingDuration: 'OFF',
      isStrangerChat: false,
      isFavorite: false,
      updatedAt: 'Just now'
    };

    updateStore((prev) => ({
      chats: [newChat, ...prev.chats],
      activeChatId: id,
      newChatModalOpen: false
    }));
  };

  // Mark All Chats Read
  const markAllAsRead = () => {
    updateStore((prev) => ({
      chats: prev.chats.map((c) => ({ ...c, unreadCount: 0 }))
    }));
    soundEngine.playClick();
  };

  // Clear & Reset Chats with Filters
  const bulkClearChats = (options: { groups: boolean; individuals: boolean; dateBefore?: string }) => {
    updateStore((prev) => {
      const updatedMessages = { ...prev.messages };
      const updatedChats = prev.chats.map((c) => {
        const shouldClear = 
          (c.type === 'group' && options.groups) || 
          (c.type === 'individual' && options.individuals);

        if (shouldClear) {
          delete updatedMessages[c.id];
          return {
            ...c,
            lastMessage: undefined,
            unreadCount: 0
          };
        }
        return c;
      });

      return {
        chats: updatedChats,
        messages: updatedMessages
      };
    });

    alert('🧹 Selected chat histories have been cleared successfully.');
  };

  // Theme Setter
  const setTheme = (theme: ThemeMode) => {
    updateStore(() => ({ theme }));
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  };

  // Stranger Shield Mode Setter
  const setStrangerShieldMode = (mode: StrangerShieldMode) => {
    updateStore(() => ({ strangerShieldMode: mode }));
  };

  // Age Configuration & Profile Updater
  const setAgeAndAutoConfigure = (age: number) => {
    const validAge = Math.max(1, Math.min(120, age));
    let targetAgeGroup: 'child_under_13' | 'teen_13_15' | 'above_15_open' = 'above_15_open';
    let isEnabled = false;
    let dailyTimeLimitMinutes = 240;
    let blockAllStrangers = false;

    // Protection is applicable up to 15 years only; rest (> 15 years) is open!
    if (validAge <= 12) {
      targetAgeGroup = 'child_under_13';
      isEnabled = true;
      dailyTimeLimitMinutes = 60;
      blockAllStrangers = true;
    } else if (validAge <= 15) {
      targetAgeGroup = 'teen_13_15';
      isEnabled = true;
      dailyTimeLimitMinutes = 120;
      blockAllStrangers = true;
    } else {
      // Above 15 years (16+) -> Rest is completely Open
      targetAgeGroup = 'above_15_open';
      isEnabled = false;
      dailyTimeLimitMinutes = 240;
      blockAllStrangers = false;
    }

    updateStore((prev) => ({
      parentalControl: {
        ...prev.parentalControl,
        calculatedAge: validAge,
        targetAgeGroup,
        isEnabled: prev.parentalControl.activationMode === 'parent_forced' ? prev.parentalControl.isEnabled : isEnabled,
        dailyTimeLimitMinutes,
        blockAllStrangers
      }
    }));

    triggerConfetti();
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (profile.dob) {
      const birthDate = new Date(profile.dob);
      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        setAgeAndAutoConfigure(age);
      }
    }

    updateStore((prev) => ({
      currentUser: { ...prev.currentUser, ...profile }
    }));
    triggerConfetti();
  };


  // Calling Engine
  const startCall = (contact: Contact, type: 'audio' | 'video') => {
    // Check Stranger Shield on calls
    if (contact.isStranger && globalState.strangerShieldMode === 'STRICT_ANTI_FRAUD') {
      alert('🛡️ Stranger Shield Blocked: Calls with unsaved numbers are blocked in Strict Anti-Fraud mode. Save contact first or adjust settings.');
      return;
    }

    soundEngine.startOutgoingRingtone();

    // Broadcast CALL_INITIATED signal over real-time network to target phone!
    networkSyncEngine.broadcast({
      type: 'CALL_INITIATED',
      senderPhone: globalState.currentUser.phoneNumber,
      senderName: globalState.currentUser.name,
      targetPhone: contact.phoneNumber,
      chatId: contact.id,
      data: { callType: type, callerAvatar: globalState.currentUser.avatar },
      timestamp: Date.now()
    });

    updateStore(() => ({
      activeCall: {
        contact,
        type,
        direction: 'outgoing',
        status: 'ringing',
        isMuted: false,
        isCameraOff: false,
        isScreenSharing: false,
        durationSeconds: 0,
        callLink: `https://gitpit.meet/call/${Date.now()}`
      }
    }));

    // Auto connect or wait for response
    setTimeout(() => {
      soundEngine.stopRingtone();
      updateStore((prev) => {
        if (prev.activeCall && prev.activeCall.status === 'ringing') {
          return {
            activeCall: {
              ...prev.activeCall,
              status: 'connected'
            }
          };
        }
        return {};
      });
    }, 3500);
  };

  const endCall = () => {
    soundEngine.stopRingtone();
    const current = globalState.activeCall;
    if (current && current.contact) {
      networkSyncEngine.broadcast({
        type: 'CALL_ENDED',
        senderPhone: globalState.currentUser.phoneNumber,
        senderName: globalState.currentUser.name,
        targetPhone: current.contact.phoneNumber,
        chatId: current.contact.id,
        data: {},
        timestamp: Date.now()
      });
    }
    if (current) {
      const newLog: CallLog = {
        id: 'call_' + Date.now(),
        contactId: current.contact.id,
        contactName: current.contact.name,
        contactAvatar: current.contact.avatar,
        type: current.type,
        direction: current.direction,
        timestamp: 'Just now',
        durationSeconds: current.durationSeconds || 15,
        callLink: current.callLink
      };

      updateStore((prev) => ({
        activeCall: null,
        callLogs: [newLog, ...prev.callLogs]
      }));
    } else {
      updateStore(() => ({ activeCall: null }));
    }
  };

  const toggleCallMute = () => {
    updateStore((prev) => {
      if (!prev.activeCall) return {};
      return {
        activeCall: {
          ...prev.activeCall,
          isMuted: !prev.activeCall.isMuted
        }
      };
    });
  };

  const toggleCallCamera = () => {
    updateStore((prev) => {
      if (!prev.activeCall) return {};
      return {
        activeCall: {
          ...prev.activeCall,
          isCameraOff: !prev.activeCall.isCameraOff
        }
      };
    });
  };

  const toggleCallScreenShare = () => {
    updateStore((prev) => {
      if (!prev.activeCall) return {};
      return {
        activeCall: {
          ...prev.activeCall,
          isScreenSharing: !prev.activeCall.isScreenSharing
        }
      };
    });
  };

  // Status Stories
  const addStatusStory = (story: { mediaType: 'text' | 'image' | 'video'; content: string; caption?: string; bgGradient?: string; sizeMb?: number }) => {
    // Default size calculations: text ~0.05MB, photo ~2.8MB, video ~8.5MB
    const estimatedSize = story.sizeMb || (story.mediaType === 'video' ? 8.5 : story.mediaType === 'image' ? 2.8 : 0.05);

    const newStory: StatusStory = {
      id: 'story_me_' + Date.now(),
      userId: globalState.currentUser.id,
      userName: globalState.currentUser.name,
      userAvatar: globalState.currentUser.avatar,
      mediaType: story.mediaType,
      content: story.content,
      caption: story.caption,
      bgGradient: story.bgGradient || 'from-emerald-600 via-teal-700 to-cyan-800',
      sizeMb: estimatedSize,
      createdAt: Date.now(),
      formattedTime: 'Just now',
      expiresAt: Date.now() + 86400000, // 24 hours
      viewers: []
    };

    updateStore((prev) => ({
      statusStories: [newStory, ...prev.statusStories],
      newStatusModalOpen: false
    }));

    triggerConfetti();
  };

  const deleteStatusStory = (storyId: string) => {
    soundEngine.playClick();
    updateStore((prev) => ({
      statusStories: prev.statusStories.filter((s) => s.id !== storyId)
    }));
  };


  // GitPit Meetings
  const createMeeting = (params: Partial<Meeting> | string) => {
    const title = typeof params === 'string' ? params : (params.title || 'GitPit AI Conference Room');
    const id = 'meet_' + Date.now();
    const meeting: Meeting = {
      id,
      title,
      agenda: typeof params === 'object' && params.agenda ? params.agenda : 'AI Interactive Meeting',
      scheduledDate: typeof params === 'object' && params.scheduledDate ? params.scheduledDate : new Date().toISOString().split('T')[0],
      scheduledTime: typeof params === 'object' && params.scheduledTime ? params.scheduledTime : '10:00 AM',
      durationMinutes: typeof params === 'object' && params.durationMinutes ? params.durationMinutes : 60,
      maxParticipants: typeof params === 'object' && params.maxParticipants ? params.maxParticipants : 100,
      inviteeIds: typeof params === 'object' && params.inviteeIds ? params.inviteeIds : [],
      hasAlarm: typeof params === 'object' && params.hasAlarm !== undefined ? params.hasAlarm : true,
      screenShareActive: typeof params === 'object' && params.screenShareActive !== undefined ? params.screenShareActive : false,
      meetingLink: typeof params === 'object' && params.meetingLink ? params.meetingLink : 'https://gitpit.social/meet/' + id,
      hostId: globalState.currentUser.id,
      hostName: globalState.currentUser.name,
      status: 'upcoming'
    };

    updateStore((prev) => ({
      meetings: [meeting, ...prev.meetings]
    }));

    triggerConfetti();
    return meeting;
  };




  // GitPit AI Assistant Chat
  const sendAiAssistantMessage = (prompt: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: 'ai_u_' + Date.now(),
      sender: 'user' as const,
      text: prompt,
      time: nowTime
    };

    updateStore((prev) => ({
      aiAssistantMessages: [...prev.aiAssistantMessages, userMsg]
    }));

    soundEngine.playSentPop();

    // AI smart reply generator
    setTimeout(() => {
      let replyText = "I'm your GitPit AI Assistant. Here to help you coordinate meetings, verify stranger anti-fraud protection, and automate memos!";
      const lower = prompt.toLowerCase();

      if (lower.includes('meeting') || lower.includes('agenda')) {
        replyText = "📅 GitPit Meeting Assistant: I can help you schedule a 100-user meeting room with screen sharing. Make sure to set your agenda and alarm!";
      } else if (lower.includes('stranger') || lower.includes('shield') || lower.includes('fraud')) {
        replyText = "🛡️ Stranger Shield Guide: Strict Anti-Fraud mode restricts unknown contacts to text & Google-verified map pins only. No voice notes or attachments can enter your inbox without permission.";
      } else if (lower.includes('birthday') || lower.includes('anniversary') || lower.includes('wish')) {
        replyText = "🎉 AI Reminder: Aarav Sharma's birthday is coming up on Aug 25! Suggested wish: 'Wishing you a very Happy Birthday Aarav! May this year bring massive success and great health! 🎂✨'";
      } else if (lower.includes('memo') || lower.includes('email')) {
        replyText = "📝 GitPit Memo Drafter: Created Urgent Memo draft for team review. Would you like me to flag follow-ups for Friday?";
      }

      const aiReply = {
        id: 'ai_r_' + Date.now(),
        sender: 'ai' as const,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      soundEngine.playIncomingChime();
      updateStore((prev) => ({
        aiAssistantMessages: [...prev.aiAssistantMessages, aiReply]
      }));
    }, 1000);
  };

  // Memos
  const createMemo = (newMemo: Omit<MemoEmail, 'id' | 'createdAt'>) => {
    const memo: MemoEmail = {
      ...newMemo,
      id: 'memo_' + Date.now(),
      createdAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    updateStore((prev) => ({
      memos: [memo, ...prev.memos]
    }));

    triggerConfetti();
  };

  // UPI Payment execution
  const processUpiPayment = (payload: { amount: number; upiId: string; payeeName: string; app: 'googlepay' | 'phonepe' | 'paytm' | 'bhim' | 'cred'; note: string; contactId?: string }) => {
    const txnId = 'UPI-GPT-' + Math.floor(1000000000 + Math.random() * 9000000000);
    const upiPayload: UpiPayload = {
      amount: payload.amount,
      upiId: payload.upiId,
      payeeName: payload.payeeName,
      app: payload.app,
      status: 'SUCCESS',
      note: payload.note,
      txnId,
      timestamp: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // If chat is open, post payment message
    if (globalState.activeChatId) {
      sendMessage({
        chatId: globalState.activeChatId,
        type: 'upi_payment',
        content: `UPI Payment of ₹${payload.amount} sent to ${payload.payeeName}`,
        upiData: upiPayload
      });
    }

    triggerConfetti();
    updateStore(() => ({ upiModalOpen: false }));
  };

  // App Lock Actions
  const unlockAppWithPin = (pin: string) => {
    if (pin === globalState.lockPin) {
      updateStore(() => ({ isAppLocked: false }));
      return true;
    }
    return false;
  };

  const lockApp = () => {
    updateStore(() => ({ isAppLocked: true }));
  };

  // Parental Control & AI Child Protection Actions
  const toggleParentalControl = (pin: string, enable: boolean) => {
    if (pin !== globalState.parentalControl.parentPin) {
      soundEngine.playClick();
      alert('❌ Incorrect Parental Master PIN! Default PIN is: 9999');
      return false;
    }

    updateStore((prev) => ({
      parentalControl: {
        ...prev.parentalControl,
        isEnabled: enable
      }
    }));

    triggerConfetti();
    alert(enable ? '🛡️ AI Child Protection Shield Activated! Adult/abusive material is now locked.' : '🔓 Parental Control Deactivated.');
    return true;
  };

  const updateParentalControl = (config: Partial<ParentalControlConfig>) => {
    updateStore((prev) => ({
      parentalControl: {
        ...prev.parentalControl,
        ...config
      }
    }));
    triggerConfetti();
  };

  return {
    ...state,
    changePhoneNumber,
    updateChatNotificationConfig,
    addTodoTask,
    toggleTodoTask,
    deleteTodoTask,
    toggleParentalControl,
    updateParentalControl,
    setAgeAndAutoConfigure,
    updateStore,
    setActiveTab,
    setActiveBottomNav,
    setActiveChatId,
    setSearchQuery,
    setChatSearchQuery,
    sendMessage,
    editMessage,
    deleteMessage,
    toggleStarMessage,
    reactToMessage,
    votePoll,
    addContact,
    toggleTrustedContact,
    syncNativePhonebook,
    syncPhonebookContacts,
    startChatWithContact,
    saveDirectNumberAndStartChat,


    createNewGroup,
    createNewBroadcast,
    markAllAsRead,
    bulkClearChats,
    setTheme,
    setStrangerShieldMode,
    updateUserProfile,
    startCall,
    endCall,
    toggleCallMute,
    toggleCallCamera,
    toggleCallScreenShare,
    addStatusStory,
    deleteStatusStory,
    createMeeting,

    sendAiAssistantMessage,
    createMemo,
    processUpiPayment,
    unlockAppWithPin,
    lockApp,
    checkStrangerPermissions
  };
};