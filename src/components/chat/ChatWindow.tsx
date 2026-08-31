import React, { useState, useRef, useEffect } from 'react';
import { 
  Smile, 
  Paperclip, 
  Mic, 
  Send, 
  ShieldAlert, 
  UserPlus, 
  X, 
  Sparkles, 
  Check
} from 'lucide-react';
import { Message } from '../../types';
import { useGitPitStore } from '../../store/gitPitStore';
import { ChatHeader } from './ChatHeader';
import { MessageItem } from './MessageItem';
import { EmojiGifPicker } from './EmojiGifPicker';
import { AttachmentDrawer } from './AttachmentDrawer';
import { VoiceRecorder } from './VoiceRecorder';
import { ChatInfoModal } from './ChatInfoModal';
import { LocationPickerModal } from './LocationPickerModal';
import { ContactPickerModal } from './ContactPickerModal';
import { soundEngine } from '../../utils/soundEffects';

export const ChatWindow: React.FC = () => {
  const { 
    chats, 
    messages, 
    activeChatId, 
    sendMessage, 
    editMessage,
    strangerShieldMode,
    chatSearchQuery,
    setChatSearchQuery,
    updateStore 
  } = useGitPitStore();

  const [inputContent, setInputContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentDrawer, setShowAttachmentDrawer] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);

  
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [chatWallpaper, setChatWallpaper] = useState<string>('bg-[#efeae2] dark:bg-[#0b141a]');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  const displayedMessages = activeMessages.filter((m) => {
    if (!chatSearchQuery.trim()) return true;
    return m.content.toLowerCase().includes(chatSearchQuery.toLowerCase());
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[var(--chat-bg)] text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-3xl shadow-xl mb-4">
          G
        </div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">GitPit Web & Desktop</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mt-1">
          Select any conversation from the left to start chatting with Stranger Shield Anti-Fraud Protection.
        </p>
      </div>
    );
  }

  const isStranger = activeChat.isStrangerChat;
  const isStrictStranger = isStranger && strangerShieldMode === 'STRICT_ANTI_FRAUD';

  const handleSend = () => {
    if (!inputContent.trim()) return;

    if (editingMessage) {
      editMessage(activeChat.id, editingMessage.id, inputContent.trim());
      setEditingMessage(null);
      setInputContent('');
      return;
    }

    sendMessage({
      chatId: activeChat.id,
      type: 'text',
      content: inputContent.trim(),
      replyTo: replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        content: replyingTo.content,
        type: replyingTo.type
      } : undefined
    });

    setInputContent('');
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartEdit = (msg: Message) => {
    setEditingMessage(msg);
    setInputContent(msg.content);
  };

  const handleRealFileSelect = (e: React.ChangeEvent<HTMLInputElement>, category: 'camera' | 'media' | 'doc' | 'audio') => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeChat) return;

    const file = files[0];
    const reader = new FileReader();

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeMb} MB`;

    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;

      if (category === 'camera' || category === 'media' || file.type.startsWith('image/') || file.type.startsWith('video/')) {
        sendMessage({
          chatId: activeChat.id,
          type: file.type.startsWith('video/') ? 'video' : 'image',
          content: category === 'camera' ? '📷 Captured Photo' : file.name,
          mediaUrl: resultUrl,
          fileName: file.name,
          fileSize: sizeStr
        });
      } else if (category === 'audio' || file.type.startsWith('audio/')) {
        sendMessage({
          chatId: activeChat.id,
          type: 'audio',
          content: file.name,
          mediaUrl: resultUrl,
          fileName: file.name,
          fileSize: sizeStr,
          durationSeconds: 15,
          transcription: `Audio File: ${file.name}`
        });
      } else {
        sendMessage({
          chatId: activeChat.id,
          type: 'text',
          content: `📄 Shared Document: ${file.name} (${sizeStr})`,
          fileName: file.name,
          fileSize: sizeStr,
          mediaUrl: resultUrl
        });
      }
      soundEngine.playSentPop();
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectAttachment = (type: string) => {
    setShowAttachmentDrawer(false);

    if (type === 'location') {
      setShowLocationPicker(true);
    } else if (type === 'camera') {
      cameraInputRef.current?.click();
    } else if (type === 'gallery') {
      imageInputRef.current?.click();
    } else if (type === 'document') {
      docInputRef.current?.click();
    } else if (type === 'audio') {
      // Live Voice Mic Recorder for Audio Note!
      soundEngine.playClick();
      setIsRecordingVoice(true);
    } else if (type === 'contact') {
      setShowContactPicker(true);
    }
  };



  return (
    <div className={`flex-1 flex flex-col overflow-hidden relative ${chatWallpaper}`}>
      {/* Active Chat Header */}
      <ChatHeader
        chat={activeChat}
        onOpenInfo={() => setShowInfoModal(true)}
        onOpenSearch={() => setShowChatSearch(!showChatSearch)}
        onOpenWallpaper={() => setShowInfoModal(true)}
      />

      {/* In-Chat Search Bar if opened */}
      {showChatSearch && (
        <div className="p-2 border-b border-[var(--border-color)] bg-[var(--header-bg)] flex items-center justify-between z-10">
          <div className="flex items-center gap-2 flex-1 bg-black/5 dark:bg-white/5 rounded-xl px-3 py-1">
            <input
              type="text"
              value={chatSearchQuery}
              onChange={(e) => setChatSearchQuery(e.target.value)}
              placeholder="Search in this conversation..."
              className="w-full text-xs bg-transparent text-[var(--text-primary)] focus:outline-none"
              autoFocus
            />
          </div>
          <button onClick={() => { setShowChatSearch(false); setChatSearchQuery(''); }} className="ml-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">
            Cancel
          </button>
        </div>
      )}

      {/* Stranger Shield Banner for Unsaved Senders */}
      {isStranger && (
        <div className="mx-3 mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-red-500/15 via-rose-500/10 to-amber-500/10 border border-red-500/30 flex items-center justify-between shrink-0 shadow-sm z-10 backdrop-blur-xs">
          <div className="flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-500" />
            <div>
              <span className="font-bold block">Stranger Shield Protection: Strict Anti-Fraud Active</span>
              <span className="text-[11px] opacity-90">
                This sender is not saved. Only Text and Google-verified locations are permitted. Calls & files blocked.
              </span>
            </div>
          </div>

          <button
            onClick={() => updateStore(() => ({ settingsModalOpen: true, settingsActiveBlock: 2 }))}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow cursor-pointer transition-all shrink-0 ml-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Contact</span>
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
        {displayedMessages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            chatId={activeChat.id}
            isStrangerChat={isStranger}
            onReply={(m) => setReplyingTo(m)}
            onStartEdit={handleStartEdit}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Smart AI Quick Reply Chips */}
      <div className="px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-black/5 dark:bg-white/5 border-t border-[var(--border-color)]">
        <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] uppercase shrink-0">
          <Sparkles className="w-3 h-3" /> Smart Reply:
        </span>
        {['Sounds great! 👍', 'Sharing location now 📍', 'Let us connect at 5 PM', 'Thanks! 🙏', 'Call you shortly'].map((chip) => (
          <button
            key={chip}
            onClick={() => {
              soundEngine.playClick();
              setInputContent(chip);
            }}
            className="text-[11px] font-medium bg-[var(--panel-bg)] hover:bg-[var(--accent)] hover:text-white text-[var(--text-primary)] border border-[var(--border-color)] px-2.5 py-1 rounded-full whitespace-nowrap transition-all shadow-xs cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Quoted Reply Bar */}
      {replyingTo && (
        <div className="px-4 py-2 bg-[var(--header-bg)] border-t border-[var(--border-color)] flex items-center justify-between animate-in slide-in-from-bottom-2 duration-150">
          <div className="border-l-4 border-[var(--accent)] pl-2 text-xs">
            <span className="font-bold text-[var(--accent)] block text-[11px]">
              Replying to {replyingTo.senderName}
            </span>
            <p className="line-clamp-1 opacity-75 text-[11px]">{replyingTo.content}</p>
          </div>
          <button onClick={() => setReplyingTo(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1-Minute Edit Banner */}
      {editingMessage && (
        <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/30 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300">
          <div className="font-bold">
            ✏️ Editing message (Valid within 1 minute of sending)
          </div>
          <button 
            onClick={() => { setEditingMessage(null); setInputContent(''); }}
            className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
          >
            Cancel Edit
          </button>
        </div>
      )}

      {/* Emoji / GIF / Sticker / AI Art Drawer */}
      {showEmojiPicker && (
        <EmojiGifPicker
          onSelectEmoji={(emoji) => setInputContent((prev) => prev + emoji)}
          onSelectGif={(gifUrl) => {
            sendMessage({ chatId: activeChat.id, type: 'image', content: 'GIF Reaction', mediaUrl: gifUrl });
          }}
          onSelectSticker={(stickerUrl) => {
            sendMessage({ chatId: activeChat.id, type: 'image', content: 'GitPit Sticker', mediaUrl: stickerUrl });
          }}
          onSelectAiArt={(artUrl, prompt) => {
            sendMessage({ chatId: activeChat.id, type: 'image', content: `AI Art: "${prompt}"`, mediaUrl: artUrl });
          }}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* Attachment Drawer */}
      {showAttachmentDrawer && (
        <AttachmentDrawer
          onSelectType={handleSelectAttachment}
          onClose={() => setShowAttachmentDrawer(false)}
          isStrangerChat={isStranger}
          strangerShieldMode={strangerShieldMode}
        />
      )}

      {/* Lower Input Bar */}
      <div className="pt-2 pb-[max(10px,env(safe-area-inset-bottom))] px-2 sm:px-2.5 bg-[var(--header-bg)] border-t border-[var(--border-color)] flex items-center gap-1.5 sm:gap-2 shrink-0 select-none z-20">

        {isRecordingVoice ? (
          <VoiceRecorder
            onSendVoice={(durationSeconds, transcription) => {
              setIsRecordingVoice(false);
              sendMessage({
                chatId: activeChat.id,
                type: 'audio',
                content: `Voice Note (0:${durationSeconds < 10 ? '0' : ''}${durationSeconds})`,
                durationSeconds,
                transcription
              });
            }}
            onCancel={() => setIsRecordingVoice(false)}
          />
        ) : (
          <>
            {/* Emoji / GIF Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowEmojiPicker(!showEmojiPicker);
                setShowAttachmentDrawer(false);
              }}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Emojis, GIFs, Stickers & AI Art"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Attachment Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowAttachmentDrawer(!showAttachmentDrawer);
                setShowEmojiPicker(false);
              }}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Attach Document, Photo, Location or UPI Pay"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Text Typing Input */}
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={editingMessage ? "Edit message..." : "Type a message..."}
              className="flex-1 text-xs sm:text-sm bg-[var(--panel-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] px-3.5 py-2 rounded-2xl focus:outline-none focus:border-[var(--accent)] transition-all"
            />

            {/* Mic or Send Button */}
            {inputContent.trim() ? (
              <button
                onClick={handleSend}
                className="p-2.5 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-md active:scale-95 transition-all cursor-pointer"
                title={editingMessage ? "Save edit" : "Send message"}
              >
                {editingMessage ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              </button>
            ) : (
              <button
                disabled={isStrictStranger}
                onClick={() => {
                  if (isStrictStranger) {
                    alert('🛡️ Stranger Shield: Voice notes are blocked for unsaved senders in Strict mode.');
                    return;
                  }
                  soundEngine.playClick();
                  setIsRecordingVoice(true);
                }}
                className={`p-2.5 rounded-full transition-all cursor-pointer ${
                  isStrictStranger 
                    ? 'opacity-30 cursor-not-allowed text-gray-400' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 active:scale-95'
                }`}
                title={isStrictStranger ? "Voice notes blocked by Stranger Shield" : "Record voice note"}
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <ChatInfoModal
          chat={activeChat}
          onClose={() => setShowInfoModal(false)}
          onSelectWallpaper={(wp) => setChatWallpaper(wp)}
        />
      )}

      {/* Google-Verified Location Picker Modal */}
      {showLocationPicker && (
        <LocationPickerModal
          onSelectLocation={(payload, typeLabel) => {
            sendMessage({
              chatId: activeChat.id,
              type: 'location',
              content: typeLabel,
              locationData: payload
            });
          }}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
      {/* Actual Phonebook Contact Selector Modal */}
      {showContactPicker && (
        <ContactPickerModal
          onSelectContact={(contact) => {
            sendMessage({
              chatId: activeChat.id,
              type: 'text',
              content: `👤 Shared Contact Card: ${contact.name} (${contact.countryCode || '+91'} ${contact.phoneNumber})`
            });
            soundEngine.playSentPop();
          }}
          onClose={() => setShowContactPicker(false)}
        />
      )}

      {/* Live Camera Device Input (Direct Android Camera Launcher) */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={(e) => handleRealFileSelect(e, 'camera')}
        className="hidden"
      />

      {/* Hidden Real Mobile Device File Storage Inputs */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*,video/*"
        onChange={(e) => handleRealFileSelect(e, 'media')}
        className="hidden"
      />
      <input
        type="file"
        ref={docInputRef}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt,application/*"
        onChange={(e) => handleRealFileSelect(e, 'doc')}
        className="hidden"
      />
      <input
        type="file"
        ref={audioInputRef}
        accept="audio/*"
        onChange={(e) => handleRealFileSelect(e, 'audio')}
        className="hidden"
      />
    </div>
  );
};