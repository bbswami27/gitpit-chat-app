export type StrangerShieldMode = 'STRICT_ANTI_FRAUD' | 'MY_CONTACTS' | 'ONLY_TRUSTED' | 'OPEN_ALL';

export type PrivacyTier = 'MY_CONTACTS' | 'TRUSTED_USERS' | 'EVERYONE' | 'NOBODY';

export type ThemeMode = 
  | 'light' | 'light_sky' | 'light_rose' | 'light_mint' | 'light_amber' 
  | 'dark' | 'classic_green' | 'festival_special' | 'cyberpunk_neon' | 'midnight_sapphire'
  | 'anime_cyberwave' | 'gaming_rgb_matrix' | 'pastel_dream_genz' | 'pixel_retro_arcade' | 'skibidi_glitch_pop';

export type AppLockTimeout = 'IMMEDIATELY' | '1_MIN' | '15_MIN' | '1_HOUR';

export type DisappearingDuration = 'OFF' | '24_HOURS' | '7_DAYS' | '90_DAYS' | '180_DAYS';


export type MediaQualitySetting = 'HD_DEFAULT' | 'STANDARD' | 'DATA_SAVER';

export type AutoDownloadNetworkSetting = 'MOBILE_DATA' | 'WIFI_ONLY' | 'MOBILE_AND_WIFI' | 'OFF';

export type CameraFilterEffect = 'RAW_NATURAL' | 'HDR_CRISP' | 'AI_BEAUTY_GLOW' | 'RETRO_FILM' | 'CYBERPUNK_NEON';

export type NotificationPopupMode = 'FULL_SCREEN' | 'DETAILED_BANNER' | 'NOTIFICATION_ONLY';

export type AppLockMode = 'PIN' | 'PATTERN' | 'BIOMETRIC' | 'NONE';


export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  dob: string;
  anniversaryDate: string;
  gender: 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';
  isOnline: boolean;
  lastSeen: string;
  activeAvatarType?: 'actual' | 'ai_digital';
  ageYears?: number;
}

export function calculateAgeInYears(dob: string): number {
  if (!dob) return 25;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 25;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 25;
}

export function getGenerationCategory(ageYears: number): {
  generation: 'Gen Alpha' | 'Gen Z' | 'Millennial' | 'Senior';
  recommendedTheme: ThemeMode;
  badge: string;
  description: string;
} {
  if (ageYears <= 12) {
    return {
      generation: 'Gen Alpha',
      recommendedTheme: 'skibidi_glitch_pop',
      badge: '👾 Gen Alpha (Age 0-12)',
      description: 'High-energy glitch pop colors & child safety defaults'
    };
  } else if (ageYears <= 27) {
    return {
      generation: 'Gen Z',
      recommendedTheme: 'anime_cyberwave',
      badge: '⚡ Gen Z (Age 13-27)',
      description: 'Aesthetic cyberwave neon & pastel dream themes'
    };
  } else if (ageYears <= 45) {
    return {
      generation: 'Millennial',
      recommendedTheme: 'light_sky',
      badge: '💼 Millennial (Age 28-45)',
      description: 'Sleek sky blue & modern high-productivity themes'
    };
  } else {
    return {
      generation: 'Senior',
      recommendedTheme: 'light_amber',
      badge: '👓 Senior / Elder (Age 46+)',
      description: 'High-contrast warm amber & comfortable readable text'
    };
  }
}



export interface Contact {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  dob: string;
  anniversaryDate: string;
  gender: 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';
  isSaved: boolean;
  isTrusted: boolean;
  isBlocked: boolean;
  isStranger: boolean;
  hasGitPitBadge: boolean;
  isOnline: boolean;
  lastSeen: string;
  activeAvatarType?: 'actual' | 'ai_digital';
  actualPhotoUrl?: string;
  aiDigitalAvatarUrl?: string;
}


export interface LocationPayload {
  latitude: number;
  longitude: number;
  address: string;
  isGoogleVerified: boolean;
  mapPreviewUrl: string;
}

export interface UpiPayload {
  amount: number;
  upiId: string;
  payeeName: string;
  app: 'googlepay' | 'phonepe' | 'paytm' | 'bhim' | 'cred';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  note: string;
  txnId: string;
  timestamp: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // user IDs
}

export interface PollPayload {
  question: string;
  options: PollOption[];
  isMultiSelect: boolean;
  totalVotes: number;
}

export type MessageType = 
  | 'text' 
  | 'location' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'document' 
  | 'upi_payment' 
  | 'poll' 
  | 'contact_card'
  | 'call_event';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
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
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
    type: MessageType;
  };
  isStarred: boolean;
  isEdited: boolean;
  editedAt?: string;
  sentAt: number; // Unix timestamp for 1-minute edit check
  formattedTime: string;
  status: 'sent' | 'delivered' | 'read';
  reactions: Record<string, string[]>; // emoji -> array of user names
  isDisappearing?: boolean;
  disappearAt?: number;
  isStrangerMessage?: boolean;
  isAiCensored?: boolean;
  censorshipReason?: string;
  originalCensoredContent?: string;
}


export interface CustomNotificationConfig {
  isMuted: boolean;
  muteDuration: '8_hours' | '1_week' | 'always' | 'none';
  customRingtone: 'default' | 'gitpit_chime' | 'gentle_bell' | 'high_priority_alarm' | 'vibrate_only';
  popupStyle: 'full_screen' | 'detailed_banner' | 'silent_badge';
  notifyMentionsOnly?: boolean;
}

export interface Chat {
  id: string;
  type: 'individual' | 'group' | 'broadcast';
  name: string;
  avatar: string;
  description?: string;
  members: string[]; // contact or user IDs
  adminIds: string[];
  creatorId?: string;
  maxCapacity?: number; // Default 1000
  lastMessage?: Message;

  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  wallpaper?: string;
  disappearingDuration: DisappearingDuration;
  isStrangerChat: boolean;
  isFavorite: boolean;
  updatedAt: string;
  notificationConfig?: CustomNotificationConfig;
}


export interface Meeting {
  id: string;
  title: string;
  agenda: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  hostId: string;
  hostName: string;
  inviteeIds: string[];
  maxParticipants: number;
  hasAlarm: boolean;
  screenShareActive: boolean;
  meetingLink: string;
  status: 'upcoming' | 'live' | 'completed';
}

export interface MemoEmail {
  id: string;
  subject: string;
  body: string;
  recipients: string[];
  priority: 'urgent' | 'routine';
  followUpDate?: string;
  reminderSet: boolean;
  createdAt: string;
  status: 'sent' | 'draft';
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaType: 'text' | 'image' | 'video';
  content: string;
  caption?: string;
  bgGradient?: string;
  sizeMb?: number;


  createdAt: number;
  formattedTime: string;
  expiresAt: number;
  viewers: {
    userId: string;
    userName: string;
    userAvatar: string;
    viewedAt: string;
  }[];
}

export interface CallLog {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  durationSeconds: number;
  callLink?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: 'Tech' | 'Global' | 'India' | 'Finance' | 'AI';
  timeAgo: string;
  url: string;
  isBreaking?: boolean;
}

export interface LinkedDevice {
  id: string;
  deviceName: string;
  osName: string;
  browserName: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface BirthdayReminder {
  contactId: string;
  contactName: string;
  contactAvatar: string;
  date: string;
  type: 'birthday' | 'anniversary';
  daysLeft: number;
  suggestedWish: string;
}

export interface AiSafetyLog {
  id: string;
  timestamp: string;
  senderName: string;
  chatName: string;
  violationType: 'adult_content' | 'abusive_language' | 'toxic_media' | 'violence' | 'unknown_stranger_contact';
  severity: 'high' | 'critical' | 'medium';
  actionTaken: string;
  originalSnippet: string;
}

export interface ParentalControlConfig {
  isEnabled: boolean;
  activationMode: 'off' | 'age_based' | 'parent_forced';
  targetAgeGroup: 'child_under_13' | 'teen_13_15' | 'above_15_open';
  calculatedAge: number;

  parentPin: string;
  dailyTimeLimitMinutes: number;
  usedTimeTodayMinutes: number;
  bedtimeSchedule: {
    enabled: boolean;
    startTime: string; // e.g. "21:00" (9 PM)
    endTime: string;   // e.g. "07:00" (7 AM)
  };
  filterAdultContent: boolean;
  filterAbusiveLanguage: boolean;
  filterViolence: boolean;
  blockAllStrangers: boolean;
  preventAppUninstall: boolean;
}

export interface AntiFraudConfig {
  blockUnsavedCallerScams: boolean;
  restrictStrangerAttachments: boolean;
  requireVerifiedGpsLocation: boolean;
  autoFlagInternationalFraudCodes: boolean;
  highRiskVibrationAlert: boolean;
  csamAutoStopAndReport: boolean;
}

export interface AiTodoTask {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
  createdAt: string;
}