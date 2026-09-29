import React, { useEffect } from 'react';
import { useGitPitStore } from './store/gitPitStore';
import { Header } from './components/layout/Header';
import { TopTabs } from './components/layout/TopTabs';
import { BottomNav } from './components/layout/BottomNav';
import { ChatList } from './components/chat/ChatList';
import { ChatWindow } from './components/chat/ChatWindow';
import { StatusView } from './components/features/StatusView';
import { CallsTab } from './components/features/CallsTab';
import { NewsFeedTab } from './components/features/NewsFeedTab';
import { UpiModal } from './components/features/UpiModal';
import { CallModal } from './components/features/CallModal';
import { NewChatModal } from './components/features/NewChatModal';
import { MediaLightbox } from './components/features/MediaLightbox';
import { AppLockModal } from './components/features/AppLockModal';
import { ParentalControlModal } from './components/features/ParentalControlModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { PhoneAuthModal } from './components/features/PhoneAuthModal';
import { realtimeCloudBackend } from './services/realtimeBackend';
import { networkSyncEngine } from './utils/networkSyncEngine';
import type { Chat, Contact, Message } from './types';

const cleanPhone = (value: string | undefined) =>
  value ? value.replace(/\D/g, '').slice(-10) : '';

export const App: React.FC = () => {
  const {
    theme,
    currentUser,
    activeTab,
    activeBottomNav,
    activeChatId,
    upiModalOpen,
    qrScannerOpen,
    newChatModalOpen,
    mediaLightboxData,
    authModalOpen,
    updateUserProfile,
    updateStore
  } = useGitPitStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const myPhone = cleanPhone(currentUser.phoneNumber);
    if (!myPhone) return;

    realtimeCloudBackend.setUserPhone(myPhone);
    networkSyncEngine.setMyPhoneNumber(myPhone);

    const unsubscribeMessages = realtimeCloudBackend.subscribe((signal) => {
      if (signal.type !== 'MESSAGE' || !signal.payload) return;

      const senderPhone = cleanPhone(signal.senderPhone);
      if (!senderPhone || senderPhone === myPhone) return;

      updateStore((prev) => {
        let contacts: Contact[] = [...prev.contacts];
        let contact = contacts.find(
          (item) => cleanPhone(item.phoneNumber) === senderPhone
        );

        if (!contact) {
          contact = {
            id: `contact_remote_${senderPhone}`,
            name: signal.senderName || `GitPit ${senderPhone}`,
            avatar:
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            bio: 'GitPit realtime test contact',
            countryCode: '+91',
            phoneNumber: senderPhone,
            email: '',
            dob: '',
            anniversaryDate: '',
            gender: 'Prefer not to say',
            isSaved: true,
            isTrusted: false,
            isBlocked: false,
            isStranger: false,
            hasGitPitBadge: true,
            isOnline: true,
            lastSeen: 'online'
          };
          contacts = [contact, ...contacts];
        }

        let chats: Chat[] = [...prev.chats];
        let chat = chats.find(
          (item) =>
            item.type === 'individual' && item.members.includes(contact!.id)
        );

        const mappedChatId = chat?.id || `chat_remote_${senderPhone}`;
        const original = signal.payload as Message;

        const incomingMessage: Message = {
          ...original,
          id:
            original.id ||
            `m_remote_${signal.timestamp}_${Math.random()
              .toString(36)
              .substring(2, 7)}`,
          chatId: mappedChatId,
          senderId: contact.id,
          senderName: signal.senderName || contact.name,
          status: 'delivered'
        };

        const existingMessages = prev.messages[mappedChatId] || [];
        if (existingMessages.some((item) => item.id === incomingMessage.id)) {
          return {};
        }

        if (!chat) {
          chat = {
            id: mappedChatId,
            type: 'individual',
            name: contact.name,
            avatar: contact.avatar,
            description: contact.bio,
            members: [prev.currentUser.id, contact.id],
            adminIds: [],
            lastMessage: incomingMessage,
            unreadCount: prev.activeChatId === mappedChatId ? 0 : 1,
            isPinned: false,
            isMuted: false,
            disappearingDuration: 'OFF',
            isStrangerChat: false,
            isFavorite: false,
            updatedAt: incomingMessage.formattedTime || 'Just now'
          };
          chats = [chat, ...chats];
        } else {
          chats = chats.map((item) =>
            item.id === mappedChatId
              ? {
                  ...item,
                  lastMessage: incomingMessage,
                  unreadCount:
                    prev.activeChatId === mappedChatId
                      ? item.unreadCount
                      : item.unreadCount + 1,
                  updatedAt: incomingMessage.formattedTime || 'Just now'
                }
              : item
          );
        }

        return {
          contacts,
          chats,
          messages: {
            ...prev.messages,
            [mappedChatId]: [...existingMessages, incomingMessage]
          }
        };
      });
    });

    const unsubscribeCalls = networkSyncEngine.subscribe((payload) => {
      const senderPhone = cleanPhone(payload.senderPhone);
      const targetPhone = cleanPhone(payload.targetPhone);

      if (!senderPhone || senderPhone === myPhone) return;
      if (targetPhone && targetPhone !== myPhone) return;

      if (payload.type === 'CALL_INITIATED') {
        updateStore((prev) => {
          let contacts: Contact[] = [...prev.contacts];
          let contact = contacts.find(
            (item) => cleanPhone(item.phoneNumber) === senderPhone
          );

          if (!contact) {
            contact = {
              id: `contact_remote_${senderPhone}`,
              name: payload.senderName || `GitPit ${senderPhone}`,
              avatar:
                payload.data?.callerAvatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              bio: 'GitPit realtime test contact',
              countryCode: '+91',
              phoneNumber: senderPhone,
              email: '',
              dob: '',
              anniversaryDate: '',
              gender: 'Prefer not to say',
              isSaved: true,
              isTrusted: false,
              isBlocked: false,
              isStranger: false,
              hasGitPitBadge: true,
              isOnline: true,
              lastSeen: 'online'
            };
            contacts = [contact, ...contacts];
          }

          return {
            contacts,
            activeCall: {
              contact,
              type: payload.data?.callType === 'video' ? 'video' : 'audio',
              direction: 'incoming',
              status: 'ringing',
              isMuted: false,
              isCameraOff: false,
              isScreenSharing: false,
              durationSeconds: 0
            }
          };
        });
      } else if (payload.type === 'CALL_ACCEPTED') {
        updateStore((prev) => {
          if (!prev.activeCall || prev.activeCall.direction !== 'outgoing') {
            return {};
          }

          return {
            activeCall: {
              ...prev.activeCall,
              status: 'connected'
            }
          };
        });
      } else if (payload.type === 'CALL_ENDED') {
        updateStore(() => ({ activeCall: null }));
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeCalls();
    };
  }, [currentUser.phoneNumber]);

  const renderMainLeftPanel = () => {
    if (activeBottomNav === 'status') return <StatusView />;
    if (activeBottomNav === 'calls') return <CallsTab />;
    if (activeTab === 'news') return <NewsFeedTab />;
    return <ChatList />;
  };

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[var(--app-bg)] text-[var(--text-primary)] font-sans antialiased select-none">
      <div className="flex h-full w-full max-w-[1600px] mx-auto shadow-2xl overflow-hidden md:border-x border-[var(--border-color)]">
        <div
          className={`flex flex-col h-full w-full md:w-[310px] lg:w-[340px] shrink-0 border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] ${
            activeChatId && activeBottomNav === 'chats'
              ? 'hidden md:flex'
              : 'flex'
          }`}
        >
          <Header />
          {activeBottomNav === 'chats' && <TopTabs />}
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderMainLeftPanel()}
          </div>
          <BottomNav />
        </div>

        <div
          className={`flex-1 flex flex-col h-full overflow-hidden bg-[var(--chat-bg)] ${
            !activeChatId && activeBottomNav === 'chats'
              ? 'hidden md:flex'
              : 'flex'
          }`}
        >
          <ChatWindow />
        </div>
      </div>

      {authModalOpen && (
        <PhoneAuthModal
          onSuccess={(countryCode, phone) => {
            updateUserProfile({ countryCode, phoneNumber: phone });
            updateStore(() => ({ authModalOpen: false }));
          }}
        />
      )}

      {(upiModalOpen || qrScannerOpen) && <UpiModal />}
      <CallModal />
      {newChatModalOpen && <NewChatModal />}
      {mediaLightboxData && <MediaLightbox />}
      <SettingsModal />
      <AppLockModal />
      <ParentalControlModal />
    </div>
  );
};

export default App;

