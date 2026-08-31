import React, { useState, useEffect } from 'react';
import { 
  Check, 
  CheckCheck, 
  Star, 
  MapPin, 
  Play, 
  Pause, 
  CreditCard, 
  ShieldCheck, 
  ShieldAlert, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  CornerUpLeft, 
  Copy, 
  Clock, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Message } from '../../types';
import { useGitPitStore } from '../../store/gitPitStore';
import { soundEngine } from '../../utils/soundEffects';

interface MessageItemProps {
  message: Message;
  chatId: string;
  isStrangerChat: boolean;
  onReply: (msg: Message) => void;
  onStartEdit: (msg: Message) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  chatId,
  isStrangerChat,
  onReply,
  onStartEdit
}) => {
  const { 
    currentUser, 
    readReceiptsBlueTick, 
    toggleStarMessage, 
    deleteMessage, 
    reactToMessage, 
    votePoll,
    updateStore 
  } = useGitPitStore();

  const isMe = message.senderId === currentUser.id;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [showTranscription, setShowTranscription] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [secondsRemainingForEdit, setSecondsRemainingForEdit] = useState<number>(0);
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);


  // 1-minute countdown timer check for sender
  useEffect(() => {
    if (!isMe) return;
    const calculateSeconds = () => {
      const diff = Math.floor((Date.now() - message.sentAt) / 1000);
      const remaining = Math.max(0, 60 - diff);
      setSecondsRemainingForEdit(remaining);
    };

    calculateSeconds();
    const interval = setInterval(calculateSeconds, 1000);
    return () => clearInterval(interval);
  }, [message.sentAt, isMe]);

  const canEdit = isMe && message.type === 'text';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setShowMenu(false);
    alert('📋 Message text copied to clipboard');
  };


  const handleTogglePlayAudio = () => {
    soundEngine.playClick();
    setIsPlayingAudio(!isPlayingAudio);
  };

  const cycleSpeed = () => {
    soundEngine.playClick();
    if (playbackSpeed === 1) setPlaybackSpeed(1.5);
    else if (playbackSpeed === 1.5) setPlaybackSpeed(2);
    else setPlaybackSpeed(1);
  };

  return (
    <div className={`flex flex-col mb-2.5 group relative ${isMe ? 'items-end' : 'items-start'}`}>
      {/* Stranger Warning Badge for message from unsaved number */}
      {message.isStrangerMessage && !isMe && (
        <div className="flex items-center gap-1 text-[10px] text-red-500 font-semibold mb-0.5 px-2 py-0.5 bg-red-500/10 rounded-full border border-red-500/20">
          <ShieldAlert className="w-3 h-3 text-red-500" />
          <span>Unsaved Contact • Stranger Shield Filtered</span>
        </div>
      )}

      {/* Main Bubble Container */}
      <div className="relative max-w-[85%] sm:max-w-[70%]">
        {/* Hover Quick Action / Reaction Bar */}
        <div 
          className={`absolute -top-7 ${isMe ? 'right-0' : 'left-0'} hidden group-hover:flex items-center gap-1 bg-[var(--panel-bg)] border border-[var(--border-color)] px-2 py-1 rounded-full shadow-lg z-30 animate-in fade-in zoom-in-90 duration-150`}
        >
          {['❤️', '😂', '🔥', '👍', '🙏'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => reactToMessage(chatId, message.id, emoji)}
              className="hover:scale-130 transition-transform text-sm cursor-pointer p-0.5"
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-0.5 ml-1 border-l border-[var(--border-color)] pl-1 cursor-pointer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-3.5 py-2 shadow-sm text-sm relative transition-all ${
            isMe
              ? 'bg-[var(--bubble-outgoing)] text-[var(--text-primary)] rounded-tr-xs'
              : 'bg-[var(--bubble-incoming)] text-[var(--text-primary)] rounded-tl-xs'
          }`}
        >
          {/* Sender Name in Group Chat */}
          {!isMe && (
            <div className="text-[11px] font-bold text-[var(--accent)] mb-1">
              {message.senderName}
            </div>
          )}

          {/* Quoted Reply if any */}
          {message.replyTo && (
            <div className="mb-2 p-2 rounded-lg bg-black/5 dark:bg-white/10 border-l-4 border-[var(--accent)] text-xs">
              <span className="font-bold text-[var(--accent)] block text-[11px]">
                {message.replyTo.senderName}
              </span>
              <p className="line-clamp-2 opacity-80 text-[11px]">
                {message.replyTo.content}
              </p>
            </div>
          )}

          {/* AI Child Protection Censored Content Card */}
          {message.isAiCensored && !isParentUnlocked ? (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-500/15 via-rose-500/10 to-amber-500/15 border border-red-500/30 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-black text-red-600 dark:text-red-400">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>AI Child Protection: Content Locked</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {message.censorshipReason || 'This message or media has been identified as containing abusive, adult, or sensitive material and is hidden for child safety.'}
              </p>
              <button
                onClick={() => {
                  const pin = prompt('Enter Parental Master PIN (Default: 9999) to unlock original content:');
                  if (pin === '9999') {
                    setIsParentUnlocked(true);
                    alert('Parental authorization granted. Original message revealed.');
                  } else if (pin !== null) {
                    alert('Incorrect Parental PIN.');
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 font-bold text-[10px] cursor-pointer transition-colors"
              >
                🔓 Parental Unlock (Enter PIN)
              </button>
            </div>
          ) : (
            <>
              {/* Type: Text */}
              {message.type === 'text' && (
                <p className="whitespace-pre-wrap break-words leading-relaxed">
                  {isParentUnlocked && message.originalCensoredContent ? message.originalCensoredContent : message.content}
                </p>
              )}

              {/* Type: Image / AI Art / GIF */}
              {(message.type === 'image') && message.mediaUrl && (
                <div className="space-y-1.5">
                  <div 
                    onClick={() => updateStore(() => ({ mediaLightboxData: { url: message.mediaUrl!, type: 'image', title: message.content } }))}
                    className="rounded-xl overflow-hidden cursor-pointer max-h-72 group/img relative"
                  >
                    <img 
                      src={message.mediaUrl} 
                      alt="Attachment" 
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  {message.content && message.content !== 'Image' && (
                    <p className="text-xs text-[var(--text-secondary)] italic">
                      ✨ {message.content}
                    </p>
                  )}
                </div>
              )}
            </>
          )}


          {/* Type: Google Verified Location */}
          {message.type === 'location' && message.locationData && (
            <div className="rounded-xl overflow-hidden border border-emerald-500/30 bg-emerald-500/5 p-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Google-Verified Location</span>
                </div>
                <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">
                  GPS Live
                </span>
              </div>

              <div 
                onClick={() => window.open(`https://www.google.com/maps?q=${message.locationData?.latitude},${message.locationData?.longitude}`, '_blank')}
                className="rounded-lg overflow-hidden relative cursor-pointer group/map h-36 bg-black/10"
              >
                <img 
                  src={message.locationData.mapPreviewUrl} 
                  alt="Google Map" 
                  className="w-full h-full object-cover group-hover/map:scale-105 transition-transform" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover/map:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="bg-white/90 dark:bg-black/90 px-3 py-1 rounded-full shadow flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 text-[var(--text-secondary)]" />
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold text-[var(--text-primary)]">
                📍 {message.locationData.address}
              </p>
            </div>
          )}

          {/* Type: Audio Voice Note */}
          {message.type === 'audio' && (
            <div className="space-y-2 min-w-[220px] sm:min-w-[260px]">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlayAudio}
                  className="w-10 h-10 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer shrink-0"
                >
                  {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                {/* Interactive Waveform */}
                <div className="flex-1 flex items-center gap-0.5 h-7">
                  {[20, 50, 80, 40, 90, 60, 100, 70, 30, 85, 45, 95, 65, 35, 75, 55, 90, 30].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all ${
                        isPlayingAudio && i < 10 ? 'bg-[var(--accent)]' : 'bg-gray-400 dark:bg-gray-500'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                {/* Speed Toggle (1x, 1.5x, 2x) */}
                <button
                  onClick={cycleSpeed}
                  className="text-[11px] font-bold bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full hover:bg-[var(--accent)] hover:text-white transition-colors cursor-pointer"
                >
                  {playbackSpeed}x
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                <span>0:{message.durationSeconds ? (message.durationSeconds < 10 ? `0${message.durationSeconds}` : message.durationSeconds) : '18'}</span>
                
                {message.transcription && (
                  <button
                    onClick={() => setShowTranscription(!showTranscription)}
                    className="flex items-center gap-1 text-[var(--accent)] font-semibold hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{showTranscription ? 'Hide Text' : 'AI Transcribe'}</span>
                  </button>
                )}
              </div>

              {/* AI Voice-to-Text Transcription */}
              {showTranscription && message.transcription && (
                <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-xs text-[var(--text-primary)] italic animate-in fade-in duration-200">
                  <span className="font-bold text-[10px] text-[var(--accent)] uppercase block not-italic">
                    AI Speech-to-Text Transcription:
                  </span>
                  "{message.transcription}"
                </div>
              )}
            </div>
          )}

          {/* Type: UPI Payment Card */}
          {message.type === 'upi_payment' && message.upiData && (
            <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-3 space-y-2 min-w-[240px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400">
                  <CreditCard className="w-4 h-4" />
                  <span>UPI Payment Successful</span>
                </div>
                <span className="text-[10px] bg-teal-600 text-white font-black px-2 py-0.5 rounded-full uppercase">
                  {message.upiData.app}
                </span>
              </div>

              <div className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                ₹{message.upiData.amount.toLocaleString('en-IN')}
              </div>

              <div className="text-xs space-y-0.5 text-[var(--text-secondary)]">
                <div>To: <strong className="text-[var(--text-primary)]">{message.upiData.payeeName}</strong> ({message.upiData.upiId})</div>
                {message.upiData.note && <div>Note: {message.upiData.note}</div>}
                <div className="text-[10px] opacity-70">Txn: {message.upiData.txnId}</div>
              </div>
            </div>
          )}

          {/* Type: Interactive Poll */}
          {message.type === 'poll' && message.pollData && (
            <div className="space-y-3 min-w-[260px]">
              <div className="font-bold text-sm text-[var(--text-primary)]">
                📊 {message.pollData.question}
              </div>

              <div className="space-y-2">
                {message.pollData.options.map((opt) => {
                  const hasVoted = opt.votes.includes(currentUser.id);
                  const percentage = message.pollData?.totalVotes 
                    ? Math.round((opt.votes.length / message.pollData.totalVotes) * 100) 
                    : 0;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => votePoll(chatId, message.id, opt.id)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                        hasVoted 
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 font-bold' 
                          : 'border-[var(--border-color)] bg-black/5 dark:bg-white/5 hover:border-[var(--accent)]/50'
                      }`}
                    >
                      {/* Progress Bar Background */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-[var(--accent)]/20 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${hasVoted ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-gray-400'}`}>
                            {hasVoted && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span>{opt.text}</span>
                        </div>
                        <span className="font-bold">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-[var(--text-secondary)] text-right font-medium">
                {message.pollData.totalVotes} total votes
              </div>
            </div>
          )}

          {/* Bubble Footer: Timestamp, Edited Badge, Star, 1-Min Timer, Read Receipts */}
          <div className="flex items-center justify-end gap-1.5 mt-1 pt-0.5 text-[10px] text-[var(--text-secondary)] select-none">
            {message.isStarred && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}

            {message.isEdited && (
              <span className="italic text-[10px] text-[var(--accent)]">
                Edited
              </span>
            )}

            {/* 1-Minute Edit Countdown Badge for Sender */}
            {canEdit && (
              <span 
                onClick={() => onStartEdit(message)}
                className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-1.5 py-0.2 rounded-full cursor-pointer transition-colors"
                title="Click to edit message before 1 minute expires"
              >
                <Clock className="w-2.5 h-2.5" />
                <span>Edit ({secondsRemainingForEdit}s)</span>
              </span>
            )}

            <span>{message.formattedTime}</span>

            {/* Read Receipt Ticks (Single grey, Double grey, Double Blue Tick) */}
            {isMe && (
              <span>
                {message.status === 'sent' && <Check className="w-3.5 h-3.5 text-gray-400" />}
                {message.status === 'delivered' && <CheckCheck className="w-3.5 h-3.5 text-gray-400" />}
                {message.status === 'read' && (
                  <CheckCheck className={`w-3.5 h-3.5 ${readReceiptsBlueTick ? 'text-sky-500' : 'text-gray-400'}`} />
                )}
              </span>
            )}
          </div>
        </div>

        {/* Reactions Bar Pills on bottom of bubble */}
        {Object.keys(message.reactions || {}).length > 0 && (
          <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
            {Object.entries(message.reactions).map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => reactToMessage(chatId, message.id, emoji)}
                className="flex items-center gap-1 bg-[var(--panel-bg)] border border-[var(--border-color)] px-1.5 py-0.5 rounded-full text-[11px] shadow-sm hover:scale-110 transition-transform cursor-pointer"
                title={users.join(', ')}
              >
                <span>{emoji}</span>
                <span className="text-[10px] font-bold text-[var(--text-secondary)]">{users.length}</span>
              </button>
            ))}
          </div>
        )}

        {/* Action Menu Dropdown */}
        {showMenu && (
          <div className={`absolute top-2 ${isMe ? 'right-0' : 'left-0'} z-50 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-2 w-52 text-xs font-semibold text-[var(--text-primary)] animate-in fade-in zoom-in-95 duration-150 space-y-1`}>
            {/* Quick Reaction Bar */}
            <div className="flex items-center justify-between p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-color)]">
              {['❤️', '👍', '😂', '😮', '😢', '🙏'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => { reactToMessage(chatId, message.id, emoji); setShowMenu(false); }}
                  className="hover:scale-125 transition-transform p-1 text-sm cursor-pointer"
                  title={`React ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <button
              onClick={() => { onReply(message); setShowMenu(false); }}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 text-left rounded-lg cursor-pointer"
            >
              <CornerUpLeft className="w-4 h-4 text-blue-500" />
              <span>Reply Message</span>
            </button>

            <button
              onClick={() => { toggleStarMessage(chatId, message.id); setShowMenu(false); }}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 text-left rounded-lg cursor-pointer"
            >
              <Star className={`w-4 h-4 ${message.isStarred ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
              <span>{message.isStarred ? 'Unstar Message' : 'Star Message'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2.5 w-full px-2.5 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 text-left rounded-lg cursor-pointer"
            >
              <Copy className="w-4 h-4 text-emerald-500" />
              <span>Copy Text</span>
            </button>

            {/* Permanent Edit Option */}
            {canEdit && (
              <button
                onClick={() => { onStartEdit(message); setShowMenu(false); }}
                className="flex items-center gap-2.5 w-full px-2.5 py-1.5 hover:bg-black/5 dark:hover:bg-white/10 text-left text-amber-600 dark:text-amber-400 font-bold rounded-lg cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Message</span>
              </button>
            )}


            <div className="my-1 border-t border-[var(--border-color)]" />

            <button
              onClick={() => { deleteMessage(chatId, message.id, false); setShowMenu(false); }}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-red-500/10 text-left text-red-500 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete for Me</span>
            </button>

            {isMe && (
              <button
                onClick={() => { deleteMessage(chatId, message.id, true); setShowMenu(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2 hover:bg-red-500/10 text-left text-red-600 font-bold cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete for Everyone</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};