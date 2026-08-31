import { 
  UserProfile, 
  Contact, 
  Chat, 
  Message, 
  StatusStory, 
  CallLog, 
  NewsItem, 
  Meeting, 
  MemoEmail, 
  LinkedDevice 
} from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'user_me',
  name: 'Bharat Bhushan',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Exploring the future with GitPit Chat & AI 🚀',
  countryCode: '+91',
  phoneNumber: '9876543210',
  email: 'bharat.bhushan@gitpit.social',
  dob: '1996-10-15',
  anniversaryDate: '2022-04-20',
  gender: 'Male',
  isOnline: true,
  lastSeen: 'online'
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact_aarav',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Engineer @ GitPit • Coffee & Code ☕',
    countryCode: '+91',
    phoneNumber: '9811122334',
    email: 'aarav.sharma@gitpit.social',
    dob: '1995-08-25',
    anniversaryDate: '2021-11-12',
    gender: 'Male',
    isSaved: true,
    isTrusted: true,
    isBlocked: false,
    isStranger: false,
    hasGitPitBadge: true,
    isOnline: true,
    lastSeen: 'online'
  },
  {
    id: 'contact_priya',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Product Designer & UI Specialist 🎨',
    countryCode: '+91',
    phoneNumber: '9822233445',
    email: 'priya.patel@designstudio.io',
    dob: '1998-04-14',
    anniversaryDate: '',
    gender: 'Female',
    isSaved: true,
    isTrusted: true,
    isBlocked: false,
    isStranger: false,
    hasGitPitBadge: true,
    isOnline: true,
    lastSeen: 'online'
  },
  {
    id: 'contact_vikram',
    name: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Building decentralized protocols & UPI gateways ⚡',
    countryCode: '+91',
    phoneNumber: '9833344556',
    email: 'vikram.singh@fintech.in',
    dob: '1992-12-05',
    anniversaryDate: '2019-02-18',
    gender: 'Male',
    isSaved: true,
    isTrusted: false,
    isBlocked: false,
    isStranger: false,
    hasGitPitBadge: true,
    isOnline: false,
    lastSeen: 'Today at 05:42 AM'
  },
  {
    id: 'contact_neha',
    name: 'Neha Gupta',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Growth & Brand Marketing @ GitPit 📈',
    countryCode: '+91',
    phoneNumber: '9844455667',
    email: 'neha.gupta@marketinghub.com',
    dob: '1997-09-30',
    anniversaryDate: '2023-01-26',
    gender: 'Female',
    isSaved: true,
    isTrusted: false,
    isBlocked: false,
    isStranger: false,
    hasGitPitBadge: true,
    isOnline: false,
    lastSeen: 'Yesterday at 11:15 PM'
  },
  // STRANGER CONTACT (Unsaved, to demonstrate Stranger Shield Anti-Fraud Protection!)
  {
    id: 'contact_stranger_1',
    name: '+91 91234 56789',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Hey there! I am using GitPit.',
    countryCode: '+91',
    phoneNumber: '9123456789',
    email: 'unknown.user@external.com',
    dob: '',
    anniversaryDate: '',
    gender: 'Prefer not to say',
    isSaved: false, // STRANGER
    isTrusted: false,
    isBlocked: false,
    isStranger: true,
    hasGitPitBadge: true,
    isOnline: true,
    lastSeen: 'online'
  },
  // STRANGER CONTACT 2 (Suspicious International Caller)
  {
    id: 'contact_stranger_2',
    name: '+44 7700 900077',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    bio: 'Business enquiry & financial offers',
    countryCode: '+44',
    phoneNumber: '7700900077',
    email: '',
    dob: '',
    anniversaryDate: '',
    gender: 'Prefer not to say',
    isSaved: false, // STRANGER
    isTrusted: false,
    isBlocked: false,
    isStranger: true,
    hasGitPitBadge: false,
    isOnline: false,
    lastSeen: 'Yesterday at 04:20 PM'
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  chat_aarav: [
    {
      id: 'm_aarav_1',
      chatId: 'chat_aarav',
      senderId: 'contact_aarav',
      senderName: 'Aarav Sharma',
      type: 'text',
      content: 'Hey Bharat! Did you check the new Stranger Shield anti-fraud algorithm in GitPit?',
      isStarred: false,
      isEdited: false,
      sentAt: Date.now() - 3600000,
      formattedTime: '05:30 AM',
      status: 'read',
      reactions: { '👍': ['Bharat Bhushan'] }
    },
    {
      id: 'm_aarav_2',
      chatId: 'chat_aarav',
      senderId: 'user_me',
      senderName: 'Bharat Bhushan',
      type: 'text',
      content: 'Yes! It completely blocks calls and file attachments from unsaved numbers by default in Strict Mode. Only text & Google-verified maps are allowed.',
      isStarred: true,
      isEdited: false,
      sentAt: Date.now() - 3000000,
      formattedTime: '05:40 AM',
      status: 'read',
      reactions: { '🔥': ['Aarav Sharma'] }
    },
    {
      id: 'm_aarav_3',
      chatId: 'chat_aarav',
      senderId: 'contact_aarav',
      senderName: 'Aarav Sharma',
      type: 'location',
      content: 'Our meeting location for today',
      locationData: {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'Connaught Place, Central Delhi, India (Google Verified)',
        isGoogleVerified: true,
        mapPreviewUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&auto=format&fit=crop&q=80'
      },
      isStarred: false,
      isEdited: false,
      sentAt: Date.now() - 1800000,
      formattedTime: '06:00 AM',
      status: 'read',
      reactions: {}
    },
    {
      id: 'm_aarav_4',
      chatId: 'chat_aarav',
      senderId: 'contact_aarav',
      senderName: 'Aarav Sharma',
      type: 'audio',
      content: 'Voice note (0:18)',
      durationSeconds: 18,
      transcription: "Hey Bharat, I have reviewed the UPI payment gateway integration. It looks super crisp and works with GPay and Paytm seamlessly.",
      isStarred: false,
      isEdited: false,
      sentAt: Date.now() - 900000,
      formattedTime: '06:15 AM',
      status: 'read',
      reactions: { '❤️': ['Bharat Bhushan'] }
    },
    {
      id: 'm_aarav_5',
      chatId: 'chat_aarav',
      senderId: 'user_me',
      senderName: 'Bharat Bhushan',
      type: 'upi_payment',
      content: 'UPI Payment Sent',
      upiData: {
        amount: 2500,
        upiId: 'aarav@okaxis',
        payeeName: 'Aarav Sharma',
        app: 'googlepay',
        status: 'SUCCESS',
        note: 'GitPit Cloud Server Share',
        txnId: 'UPI-GPT-8839201948',
        timestamp: 'Today at 06:22 AM'
      },
      isStarred: false,
      isEdited: false,
      sentAt: Date.now() - 300000,
      formattedTime: '06:22 AM',
      status: 'read',
      reactions: { '🙏': ['Aarav Sharma'] }
    }
  ],
  chat_priya: [
    {
      id: 'm_priya_1',
      chatId: 'chat_priya',
      senderId: 'contact_priya',
      senderName: 'Priya Patel',
      type: 'text',
      content: 'Good morning! Here is the poll for our team outing theme.',
      isStarred: false,
      isEdited: false,
      sentAt: Date.now() - 7200000,
      formattedTime: '04:30 AM',
      status: 'read',
      reactions: {}
    },
    {
      id: 'm_priya_2',
      chatId: 'chat_priya',
      senderId: 'contact_priya',
      senderName: 'Priya Patel',
      type: 'poll',
      content: 'GitPit Hackathon Location',
      pollData: {
        question: 'Where should we host the GitPit Hackathon 2026?',
        options: [
          { id: 'opt_1', text: 'Bengaluru Tech Hub', votes: ['user_me', 'contact_priya', 'contact_aarav'] },
          { id: 'opt_2', text: 'Goa Beach Resort', votes: ['contact_neha', 'contact_vikram'] },
          { id: 'opt_3', text: 'Delhi NCR Innovation Campus', votes: [] }
        ],
        isMultiSelect: false,
        totalVotes: 5
      },
      isStarred: true,
      isEdited: false,
      sentAt: Date.now() - 7100000,
      formattedTime: '04:32 AM',
      status: 'read',
      reactions: { '🔥': ['Bharat Bhushan'] }
    },
    {
      id: 'm_priya_3',
      chatId: 'chat_priya',
      senderId: 'contact_priya',
      senderName: 'Priya Patel',
      type: 'text',
      content: 'Let me know what you think of the new 6-theme color palette!',
      isStarred: false,
      isEdited: false,
      sentAt: Date.now() - 1200000,
      formattedTime: '06:10 AM',
      status: 'delivered',
      reactions: {}
    }
  ],
  chat_group_core: [
    {
      id: 'm_grp_1',
      chatId: 'chat_group_core',
      senderId: 'contact_aarav',
      senderName: 'Aarav Sharma',
      type: 'text',
      content: 'Welcome everyone to the GitPit Core Engineering group! 🚀',
      isStarred: false,
      isEdited: false,
      sentAt: Date.now() - 14400000,
      formattedTime: '02:30 AM',
      status: 'read',
      reactions: { '👏': ['Priya Patel', 'Bharat Bhushan'] }
    },
    {
      id: 'm_grp_2',
      chatId: 'chat_group_core',
      senderId: 'contact_vikram',
      senderName: 'Vikram Singh',
      type: 'text',
      content: 'GitPit Meeting room is configured for up to 100 participants with low-latency screen sharing.',
      isStarred: false,
      isEdited: false,
      sentAt: Date.now() - 3600000,
      formattedTime: '05:30 AM',
      status: 'read',
      reactions: { '🚀': ['Bharat Bhushan'] }
    }
  ],
  chat_broadcast_vip: [
    {
      id: 'm_bcast_1',
      chatId: 'chat_broadcast_vip',
      senderId: 'user_me',
      senderName: 'Bharat Bhushan',
      type: 'text',
      content: '📢 VIP Announcement: GitPit v2.0 is now live with Stranger Shield Anti-Fraud Protection and AI Meeting Assistants!',
      isStarred: true,
      isEdited: false,
      sentAt: Date.now() - 86400000,
      formattedTime: 'Yesterday',
      status: 'read',
      reactions: {}
    }
  ],
  // STRANGER CHAT (Demonstrating Stranger Shield Banner & Strict Protection!)
  chat_stranger_1: [
    {
      id: 'm_stranger_1',
      chatId: 'chat_stranger_1',
      senderId: 'contact_stranger_1',
      senderName: '+91 91234 56789',
      type: 'text',
      content: 'Hello, I saw your listing on the tech portal. Can you share the project details?',
      isStarred: false,
      isEdited: false,
      sentAt: Date.now() - 1800000,
      formattedTime: '06:05 AM',
      status: 'delivered',
      reactions: {},
      isStrangerMessage: true
    },
    {
      id: 'm_stranger_2',
      chatId: 'chat_stranger_1',
      senderId: 'contact_stranger_1',
      senderName: '+91 91234 56789',
      type: 'location',
      content: 'Office location in Gurgaon',
      locationData: {
        latitude: 28.4595,
        longitude: 77.0266,
        address: 'Cyber City, Sector 24, Gurugram, Haryana (Google Verified)',
        isGoogleVerified: true,
        mapPreviewUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&auto=format&fit=crop&q=80'
      },
      isStarred: false,
      isEdited: false,
      sentAt: Date.now() - 600000,
      formattedTime: '06:25 AM',
      status: 'delivered',
      reactions: {},
      isStrangerMessage: true
    }
  ]
};

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_aarav',
    type: 'individual',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    description: 'Lead Engineer @ GitPit',
    members: ['user_me', 'contact_aarav'],
    adminIds: [],
    lastMessage: INITIAL_MESSAGES.chat_aarav[INITIAL_MESSAGES.chat_aarav.length - 1],
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    disappearingDuration: 'OFF',
    isStrangerChat: false,
    isFavorite: true,
    updatedAt: '06:22 AM'
  },
  {
    id: 'chat_priya',
    type: 'individual',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    description: 'Product Designer & UI Specialist',
    members: ['user_me', 'contact_priya'],
    adminIds: [],
    lastMessage: INITIAL_MESSAGES.chat_priya[INITIAL_MESSAGES.chat_priya.length - 1],
    unreadCount: 1,
    isPinned: true,
    isMuted: false,
    disappearingDuration: 'OFF',
    isStrangerChat: false,
    isFavorite: true,
    updatedAt: '06:10 AM'
  },
  {
    id: 'chat_group_core',
    type: 'group',
    name: 'GitPit Core Team 🚀',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    description: 'Official group for GitPit core architecture & sprint tasks',
    members: ['user_me', 'contact_aarav', 'contact_priya', 'contact_vikram', 'contact_neha'],
    adminIds: ['user_me', 'contact_aarav'],
    lastMessage: INITIAL_MESSAGES.chat_group_core[INITIAL_MESSAGES.chat_group_core.length - 1],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    disappearingDuration: 'OFF',
    isStrangerChat: false,
    isFavorite: false,
    updatedAt: '05:30 AM'
  },
  {
    id: 'chat_stranger_1',
    type: 'individual',
    name: '+91 91234 56789',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    description: 'Unsaved Contact • Protected by Stranger Shield',
    members: ['user_me', 'contact_stranger_1'],
    adminIds: [],
    lastMessage: INITIAL_MESSAGES.chat_stranger_1[INITIAL_MESSAGES.chat_stranger_1.length - 1],
    unreadCount: 2,
    isPinned: false,
    isMuted: false,
    disappearingDuration: 'OFF',
    isStrangerChat: true, // STRANGER CHAT
    isFavorite: false,
    updatedAt: '06:25 AM'
  },
  {
    id: 'chat_broadcast_vip',
    type: 'broadcast',
    name: 'VIP Tech Broadcast 📢',
    avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
    description: 'Broadcast updates sent to 34 selected clients',
    members: ['user_me', 'contact_aarav', 'contact_priya', 'contact_vikram', 'contact_neha'],
    adminIds: ['user_me'],
    lastMessage: INITIAL_MESSAGES.chat_broadcast_vip[INITIAL_MESSAGES.chat_broadcast_vip.length - 1],
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    disappearingDuration: 'OFF',
    isStrangerChat: false,
    isFavorite: false,
    updatedAt: 'Yesterday'
  }
];

export const INITIAL_STATUS_STORIES: StatusStory[] = [
  {
    id: 'story_aarav_1',
    userId: 'contact_aarav',
    userName: 'Aarav Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    content: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    bgGradient: 'from-blue-600 to-indigo-900',
    createdAt: Date.now() - 7200000,
    formattedTime: '2 hours ago',
    expiresAt: Date.now() + 79200000,
    viewers: [
      { userId: 'contact_aarav', userName: 'Aarav Sharma', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', viewedAt: '10m ago' },
      { userId: 'contact_priya', userName: 'Priya Patel', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', viewedAt: '45m ago' },
      { userId: 'contact_vikram', userName: 'Vikram Singh', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', viewedAt: '2h ago' }
    ]
  },
  {
    id: 'story_priya_1',
    userId: 'contact_priya',
    userName: 'Priya Patel',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    mediaType: 'text',
    content: '🎉 Celebrating the launch of GitPit Chat v2 with Stranger Shield Anti-Fraud Protection! Experience true privacy.',
    bgGradient: 'from-emerald-600 via-teal-700 to-cyan-800',
    createdAt: Date.now() - 14400000,
    formattedTime: '4 hours ago',
    expiresAt: Date.now() + 72000000,
    viewers: []
  },
  {
    id: 'story_vikram_1',
    userId: 'contact_vikram',
    userName: 'Vikram Singh',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    mediaType: 'image',
    content: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
    bgGradient: 'from-purple-600 to-pink-700',
    createdAt: Date.now() - 28800000,
    formattedTime: '8 hours ago',
    expiresAt: Date.now() + 57600000,
    viewers: []
  }
];

export const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: 'call_1',
    contactId: 'contact_aarav',
    contactName: 'Aarav Sharma',
    contactAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    type: 'video',
    direction: 'incoming',
    timestamp: 'Today, 05:15 AM',
    durationSeconds: 342,
    callLink: 'https://gitpit.meet/call/gpt-88291'
  },
  {
    id: 'call_2',
    contactId: 'contact_priya',
    contactName: 'Priya Patel',
    contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'audio',
    direction: 'outgoing',
    timestamp: 'Yesterday, 07:45 PM',
    durationSeconds: 128,
    callLink: 'https://gitpit.meet/call/gpt-77123'
  },
  {
    id: 'call_3',
    contactId: 'contact_stranger_2',
    contactName: '+44 7700 900077 (Stranger Blocked by Shield)',
    contactAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    type: 'audio',
    direction: 'missed',
    timestamp: 'Yesterday, 04:20 PM',
    durationSeconds: 0
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news_1',
    title: '⚡ GitPit introduces Revolutionary "Stranger Shield" Anti-Fraud Architecture for Instant Messaging',
    summary: 'GitPit announces an industry-first anti-fraud shield that restricts unknown contacts to text & Google-verified locations only, eliminating scam calls and malicious attachments.',
    source: 'TechCrunch India',
    category: 'Tech',
    timeAgo: '10 min ago',
    url: 'https://techcrunch.com',
    isBreaking: true
  },
  {
    id: 'news_2',
    title: '🌐 Reserve Bank of India & NPCI expand Global UPI Payments across 12 countries',
    summary: 'Seamless cross-border UPI payments now active across Europe, UAE, and Singapore with real-time conversion rates.',
    source: 'Economic Times',
    category: 'Finance',
    timeAgo: '45 min ago',
    url: 'https://economictimes.com',
    isBreaking: false
  },
  {
    id: 'news_3',
    title: '🤖 Next-Gen Conversational AI Assistants integrate directly into Corporate Meetings & Memos',
    summary: 'AI agents can now auto-generate meeting minutes, screen share annotations, and priority memo summaries in seconds.',
    source: 'AI Insider',
    category: 'AI',
    timeAgo: '2 hours ago',
    url: 'https://aiinsider.org',
    isBreaking: true
  },
  {
    id: 'news_4',
    title: '🇮🇳 India Tech Summit 2026 showcases cutting-edge Cloud & Cybersecurity solutions',
    summary: 'Over 500 startups and global tech giants assemble in Bengaluru to discuss next-gen zero-trust communication platforms.',
    source: 'Mint India',
    category: 'India',
    timeAgo: '4 hours ago',
    url: 'https://livemint.com',
    isBreaking: false
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet_1',
    title: 'GitPit Architecture & Anti-Fraud Sprint Review',
    agenda: '1. Stranger Shield strict mode deployment\n2. UPI multi-app deep link testing\n3. Screen sharing room up to 100 participants\n4. AI Birthday reminders integration',
    scheduledDate: '2026-08-20',
    scheduledTime: '10:00 AM',
    durationMinutes: 45,
    hostId: 'user_me',
    hostName: 'Bharat Bhushan',
    inviteeIds: ['contact_aarav', 'contact_priya', 'contact_vikram', 'contact_neha'],
    maxParticipants: 100,
    hasAlarm: true,
    screenShareActive: true,
    meetingLink: 'https://gitpit.meet/room/gitpit-core-sprint',
    status: 'upcoming'
  }
];

export const INITIAL_MEMOS: MemoEmail[] = [
  {
    id: 'memo_1',
    subject: 'URGENT: GitPit Stranger Shield Default Policy Enforcement',
    body: 'Attention Team,\n\nPlease ensure all client apps are updated to enable Stranger Shield Mode 1 (Strict Anti-Fraud) by default. Any unknown sender should strictly only be permitted to send text and Google-verified locations.\n\nFollow-up review scheduled for Friday.',
    recipients: ['aarav.sharma@gitpit.social', 'priya.patel@designstudio.io', 'vikram.singh@fintech.in'],
    priority: 'urgent',
    followUpDate: '2026-08-22',
    reminderSet: true,
    createdAt: 'Today, 05:00 AM',
    status: 'sent'
  }
];

export const INITIAL_DEVICES: LinkedDevice[] = [
  {
    id: 'dev_1',
    deviceName: 'Windows 11 PC (GitPit Desktop)',
    osName: 'Windows 11',
    browserName: 'GitPit Client v2.4',
    ipAddress: '192.168.1.104',
    location: 'Delhi, India',
    lastActive: 'Active Now',
    isCurrent: true
  },
  {
    id: 'dev_2',
    deviceName: 'MacBook Pro 16" (Chrome)',
    osName: 'macOS Sonoma',
    browserName: 'Chrome 128.0',
    ipAddress: '103.21.14.88',
    location: 'Bengaluru, India',
    lastActive: 'Yesterday at 08:30 PM',
    isCurrent: false
  },
  {
    id: 'dev_3',
    deviceName: 'iPad Air Companion App',
    osName: 'iPadOS 18',
    browserName: 'GitPit Tablet App',
    ipAddress: '103.21.14.92',
    location: 'Delhi, India',
    lastActive: '3 days ago',
    isCurrent: false
  }
];

export const INITIAL_TODO_TASKS = [
  {
    id: 'task_1',
    title: 'Review Anti-Fraud Security Logs & Stranger Restrictions',
    dueDate: '2026-08-24',
    dueTime: '10:30 AM',
    priority: 'high' as const,
    isCompleted: false,
    createdAt: 'Today 09:00 AM'
  },
  {
    id: 'task_2',
    title: 'Sync Contacts & Verify Trusted Numbers',
    dueDate: '2026-08-24',
    dueTime: '02:15 PM',
    priority: 'medium' as const,
    isCompleted: false,
    createdAt: 'Today 09:15 AM'
  },
  {
    id: 'task_3',
    title: 'Weekly Backup of Chat Data & Status Uploads',
    dueDate: '2026-08-25',
    dueTime: '06:00 PM',
    priority: 'low' as const,
    isCompleted: true,
    createdAt: 'Yesterday'
  }
];