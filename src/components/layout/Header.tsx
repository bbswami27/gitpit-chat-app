import React from 'react';
import { 
  Bell,

  ShieldAlert, 
  ShieldCheck, 

  QrCode, 
  MoreVertical, 
  Sparkles, 
  Zap, 
  CreditCard,
  Radio,
  X
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';

export const Header: React.FC = () => {
  const { 
    newsFlashTickerVisible, 
    newsItems, 
    strangerShieldMode,
    parentalControl,
    updateStore
  } = useGitPitStore();

  const isChildShieldActive = 
    !parentalControl ? false :
    parentalControl.activationMode === 'off' ? false :
    parentalControl.activationMode === 'parent_forced' ? parentalControl.isEnabled :
    (parentalControl.calculatedAge ?? 25) <= 15;




  const breakingNews = newsItems.find((n) => n.isBreaking) || newsItems[0];

  const getShieldBadge = () => {
    switch (strangerShieldMode) {
      case 'STRICT_ANTI_FRAUD':
        return {
          label: 'Stranger Shield: Strict Anti-Fraud',
          color: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        };
      case 'MY_CONTACTS':
        return {
          label: 'Shield: Contacts Only',
          color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
        };
      case 'ONLY_TRUSTED':
        return {
          label: 'Shield: Trusted Only',
          color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
        };
      default:
        return {
          label: 'Shield: Open Mode',
          color: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
        };
    }
  };

  const shield = getShieldBadge();

  return (
    <header className="flex flex-col border-b border-[var(--border-color)] bg-[var(--header-bg)] shrink-0 select-none z-20">
      {/* Live Breaking News Ticker (if enabled) */}
      {newsFlashTickerVisible && breakingNews && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs py-1 px-3 flex items-center justify-between overflow-hidden shadow-inner">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex items-center gap-1 bg-black/30 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase shrink-0 animate-pulse">
              <Radio className="w-3 h-3 text-red-300 animate-spin" /> Live News
            </span>
            <span 
              onClick={() => updateStore(() => ({ activeTab: 'news' }))}
              className="truncate cursor-pointer hover:underline font-medium text-[11px] sm:text-xs"
            >
              {breakingNews.title}
            </span>
          </div>
          <button 
            onClick={() => updateStore(() => ({ newsFlashTickerVisible: false }))}
            className="text-white/80 hover:text-white ml-2 p-0.5 rounded transition-colors cursor-pointer"
            title="Dismiss ticker (can re-enable in AI settings)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Header Bar - Ultra Compact Mobile Fit */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-[var(--border-color)] overflow-hidden">
        {/* Left Side: App Brand & Shield Indicator */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-7.5 h-7.5 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-base shadow-sm">
              <span>G</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-[var(--header-bg)] p-0.5 rounded-full">
              <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-black text-xs tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent truncate">
                GitPit
              </span>
              <span className="text-[9px] uppercase font-bold bg-[var(--accent)] text-white px-1 py-0.1 rounded-full shrink-0">
                v2.0
              </span>
            </div>

            {/* Stranger Shield Protection Badge */}
            <button 
              onClick={() => updateStore(() => ({ settingsModalOpen: true, settingsActiveBlock: 3 }))}
              className={`flex items-center gap-0.5 text-[9px] font-bold border px-1 py-0.1 rounded-full transition-all hover:scale-105 cursor-pointer shrink-0 max-w-[110px] sm:max-w-[160px] truncate ${shield.color}`}
              title="Click to manage Stranger Shield Anti-Fraud settings"
            >
              {shield.icon}
              <span className="truncate">{shield.label}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Notification Bell & 3-Dot Global Settings Hub (Guaranteed Mobile Fit) */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Quick Notification Settings Launcher */}
          <button
            onClick={() => updateStore(() => ({ settingsModalOpen: true, settingsActiveBlock: 11 }))}
            className="p-1.5 rounded-full text-amber-500 hover:bg-amber-500/10 active:scale-95 transition-all cursor-pointer relative"
            title="Notification & Sound Settings"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {/* 3-Dot Global Settings Hub Button */}
          <button
            onClick={() => updateStore(() => ({ settingsModalOpen: true }))}
            className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            title="Settings & Hub"
          >
            <MoreVertical className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

    </header>
  );
};