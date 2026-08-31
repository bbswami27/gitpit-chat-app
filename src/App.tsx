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

export const App: React.FC = () => {
  const { 
    theme, 
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


  // Apply theme to html document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Determine what to render on the main panel
  const renderMainLeftPanel = () => {
    // If user selected bottom navigation tabs: Status or Calls
    if (activeBottomNav === 'status') {
      return <StatusView />;
    }
    if (activeBottomNav === 'calls') {
      return <CallsTab />;
    }

    // If user selected Top Tab: News Flash
    if (activeTab === 'news') {
      return <NewsFeedTab />;
    }

    // Default: Chat List (All, Unread, Groups, Broadcasts)
    return <ChatList />;
  };

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[var(--app-bg)] text-[var(--text-primary)] font-sans antialiased select-none">

      {/* App Container */}
      <div className="flex h-full w-full max-w-[1600px] mx-auto shadow-2xl overflow-hidden md:border-x border-[var(--border-color)]">
        
        {/* Left Master Column: Header + Top Tabs + Main Left Panel + Bottom Nav */}
        <div 
          className={`flex flex-col h-full w-full md:w-[310px] lg:w-[340px] shrink-0 border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] ${
            activeChatId && activeBottomNav === 'chats' ? 'hidden md:flex' : 'flex'
          }`}
        >

          {/* 1. App Header with Brand, Shield, UPI, 3-Dots */}
          <Header />

          {/* 2. Top 5 Tabs: All, Unread, Groups, Broadcasts, News Flash */}
          {activeBottomNav === 'chats' && <TopTabs />}

          {/* 3. Dynamic Center Body: ChatList / Status / Calls / News */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderMainLeftPanel()}
          </div>

          {/* 4. Bottom 3 Nav Buttons: New Chat, Status, Calls */}
          <BottomNav />
        </div>

        {/* Right Detail Column: Active Chat Window (Desktop always visible, Mobile when activeChatId is set) */}
        <div 
          className={`flex-1 flex flex-col h-full overflow-hidden bg-[var(--chat-bg)] ${
            !activeChatId && activeBottomNav === 'chats' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <ChatWindow />
        </div>

      </div>

      {/* Global Overlays & Modals */}
      {authModalOpen && (
        <PhoneAuthModal
          onSuccess={(cCode, phone) => {
            updateUserProfile({ countryCode: cCode, phoneNumber: phone });
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