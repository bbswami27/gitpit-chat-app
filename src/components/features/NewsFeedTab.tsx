import React, { useState } from 'react';
import { 
  Newspaper, 
  Radio, 
  ExternalLink, 
  Share2 
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';

export const NewsFeedTab: React.FC = () => {
  const { newsItems, sendMessage, activeChatId } = useGitPitStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Tech', 'AI', 'Finance', 'India', 'Global'];

  const filteredNews = selectedCategory === 'All'
    ? newsItems
    : newsItems.filter((n) => n.category === selectedCategory);

  const handleShareToChat = (item: typeof newsItems[0]) => {
    if (activeChatId) {
      sendMessage({
        chatId: activeChatId,
        type: 'text',
        content: `📰 Shared News: ${item.title}\n${item.summary}\nSource: ${item.source}`
      });
      alert('News item shared to active conversation!');
    } else {
      alert('Please open a chat to share this news article.');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--sidebar-bg)] p-4 select-none space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-black text-[var(--text-primary)]">GitPit News Flash</h2>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase animate-pulse">
          <Radio className="w-3 h-3" /> Live Feed
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-red-500 text-white shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="p-4 rounded-2xl bg-[var(--panel-bg)] border border-[var(--border-color)] shadow-xs space-y-2 hover:border-red-500/50 transition-all"
          >
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
              <span className="font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md uppercase">
                {news.category}
              </span>
              <span>{news.source} • {news.timeAgo}</span>
            </div>

            <h3 className="font-extrabold text-sm text-[var(--text-primary)] leading-snug">
              {news.title}
            </h3>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {news.summary}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)] text-xs">
              <a
                href={news.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[var(--accent)] font-semibold hover:underline"
              >
                <span>Read Full Article</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => handleShareToChat(news)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-[var(--accent)] hover:text-white transition-colors cursor-pointer font-semibold text-[11px]"
                title="Share this article directly to chat"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share to Chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};