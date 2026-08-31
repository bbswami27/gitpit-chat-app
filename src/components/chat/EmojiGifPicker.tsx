import React, { useState } from 'react';
import { Smile, Image as ImageIcon, Sparkles, Sticker, Send } from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';

interface EmojiGifPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onSelectGif: (gifUrl: string) => void;
  onSelectSticker: (stickerUrl: string) => void;
  onSelectAiArt: (artUrl: string, prompt: string) => void;
  onClose: () => void;
}

const EMOJI_CATEGORIES = [
  { name: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😋', '😎', '🥳', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🤠', '🤡', '🥳', '🥴', '🥺', '🤥', '🤫', '🤭', '🧐', '🤓'] },
  { name: 'Gestures', emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄'] },
  { name: 'Hearts & Fire', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '🔥', '✨', '🌟', '💫', '💥', '💯', '💢', '🎉', '🎊', '🏆', '🥇', '🥈', '🥉', '🚀', '⭐', '🌈'] },
  { name: 'Festive & India', emojis: ['🪔', '🕉️', '🇮🇳', '🎆', '🎇', '🪅', '🌺', '🌸', '🌼', '🌻', '🎁', '🎂', '🎈', '🍬', '🍭', '🪷', '🫖', '🍛', '🥘', '🍲', '🍚', '🥻', '🏏', '🦚', '🐘', '🐅', '🕉️', '📿'] }
];

const POPULAR_GIFS = [
  { title: 'Thumbs Up', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { title: 'Celebrate Party', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&auto=format&fit=crop&q=80' },
  { title: 'Mind Blown', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { title: 'Coding Rocket', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80' },
  { title: 'Namaste', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80' },
  { title: 'Heart Love', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&auto=format&fit=crop&q=80' }
];

const STICKERS = [
  { name: 'GitPit Cool', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80' },
  { name: 'Super Star', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80' },
  { name: 'Coffee Cup', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80' },
  { name: 'Rocket Launch', url: 'https://images.unsplash.com/photo-1517976487507-5b6533d8b34c?w=200&auto=format&fit=crop&q=80' }
];

export const EmojiGifPicker: React.FC<EmojiGifPickerProps> = ({
  onSelectEmoji,
  onSelectGif,
  onSelectSticker,
  onSelectAiArt,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'emojis' | 'gifs' | 'stickers' | 'ai_art'>('emojis');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiArt = () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    soundEngine.playClick();

    setTimeout(() => {
      setIsGeneratingAi(false);
      const generatedUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
      onSelectAiArt(generatedUrl, aiPrompt);
      onClose(); // Auto closes after selection as requested!
    }, 1200);
  };

  return (
    <div className="absolute bottom-16 left-2 sm:left-4 z-40 w-[95vw] sm:w-[380px] max-h-[380px] bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-lg animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* 4 Tabs Header: Emojis, GIFs, Stickers, AI Pictures */}
      <div className="flex items-center justify-around border-b border-[var(--border-color)] bg-[var(--header-bg)] p-1.5 shrink-0">
        <button
          onClick={() => { soundEngine.playClick(); setActiveTab('emojis'); }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'emojis' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>Emojis</span>
        </button>

        <button
          onClick={() => { soundEngine.playClick(); setActiveTab('gifs'); }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gifs' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>GIFs</span>
        </button>

        <button
          onClick={() => { soundEngine.playClick(); setActiveTab('stickers'); }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'stickers' ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sticker className="w-3.5 h-3.5" />
          <span>Stickers</span>
        </button>

        <button
          onClick={() => { soundEngine.playClick(); setActiveTab('ai_art'); }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ai_art' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Art</span>
        </button>
      </div>

      {/* Tab 1: Emojis */}
      {activeTab === 'emojis' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[300px]">
          {EMOJI_CATEGORIES.map((cat) => (
            <div key={cat.name}>
              <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                {cat.name}
              </div>
              <div className="grid grid-cols-8 gap-1">
                {cat.emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectEmoji(emoji);
                      onClose(); // Auto closes after selection!
                    }}
                    className="w-8 h-8 flex items-center justify-center text-xl hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-transform hover:scale-125 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: GIFs */}
      {activeTab === 'gifs' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[300px]">
          <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Trending Reactions</div>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_GIFS.map((gif, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectGif(gif.url);
                  onClose(); // Auto closes!
                }}
                className="relative rounded-xl overflow-hidden cursor-pointer group aspect-video bg-black/20"
              >
                <img src={gif.url} alt={gif.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs">
                  {gif.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Stickers */}
      {activeTab === 'stickers' && (
        <div className="flex-1 overflow-y-auto p-3 max-h-[300px]">
          <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2">GitPit Sticker Pack</div>
          <div className="grid grid-cols-3 gap-3">
            {STICKERS.map((stk, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectSticker(stk.url);
                  onClose(); // Auto closes!
                }}
                className="p-2 bg-black/5 dark:bg-white/5 rounded-xl hover:bg-[var(--accent)]/20 transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <img src={stk.url} alt={stk.name} className="w-16 h-16 object-cover rounded-lg" />
                <span className="text-[10px] font-semibold text-[var(--text-secondary)]">{stk.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: AI Pictures & Generator */}
      {activeTab === 'ai_art' && (
        <div className="flex-1 p-3 flex flex-col justify-between max-h-[300px]">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>GitPit AI Image Generator</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mb-3">
              Describe any picture, avatar, celebration, or 3D art to generate & send instantly.
            </p>

            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. Cyberpunk futuristic Diwali celebration in Delhi, 4k 3D render..."
              rows={3}
              className="w-full text-xs p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--header-bg)] focus:outline-none focus:border-purple-500 text-[var(--text-primary)] resize-none"
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-1">
              {['Diwali 🪔', 'Tech Bot 🤖', 'Party 🎊'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setAiPrompt(tag)}
                  className="text-[10px] px-2 py-0.5 bg-black/5 dark:bg-white/10 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerateAiArt}
              disabled={isGeneratingAi || !aiPrompt.trim()}
              className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              {isGeneratingAi ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate & Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};