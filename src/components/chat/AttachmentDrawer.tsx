import React from 'react';
import { 
  FileText, 
  Camera, 
  Image as ImageIcon, 
  Mic, 
  MapPin, 
  User, 
  CreditCard, 
  X, 
  ShieldAlert 
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';

interface AttachmentDrawerProps {
  onSelectType: (type: 'document' | 'camera' | 'gallery' | 'audio' | 'location' | 'contact') => void;

  onClose: () => void;
  isStrangerChat: boolean;
  strangerShieldMode: string;
}

export const AttachmentDrawer: React.FC<AttachmentDrawerProps> = ({
  onSelectType,
  onClose,
  isStrangerChat,
  strangerShieldMode
}) => {
  const isStrictStranger = isStrangerChat && strangerShieldMode === 'STRICT_ANTI_FRAUD';

  const items = [
    {
      id: 'document' as const,
      label: 'Document',
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      color: 'bg-indigo-500/10 hover:bg-indigo-500/20',
      allowedForStranger: false
    },
    {
      id: 'camera' as const,
      label: 'Camera',
      icon: <Camera className="w-6 h-6 text-rose-500" />,
      color: 'bg-rose-500/10 hover:bg-rose-500/20',
      allowedForStranger: false
    },
    {
      id: 'gallery' as const,
      label: 'Photos & Video',
      icon: <ImageIcon className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-500/10 hover:bg-purple-500/20',
      allowedForStranger: false
    },
    {
      id: 'audio' as const,
      label: 'Audio Note',
      icon: <Mic className="w-6 h-6 text-amber-500" />,
      color: 'bg-amber-500/10 hover:bg-amber-500/20',
      allowedForStranger: false
    },
    {
      id: 'location' as const,
      label: 'Google Location',
      icon: <MapPin className="w-6 h-6 text-emerald-500" />,
      color: 'bg-emerald-500/10 hover:bg-emerald-500/20',
      allowedForStranger: true // ALLOWED for stranger!
    },
    {
      id: 'contact' as const,
      label: 'Contact Card',
      icon: <User className="w-6 h-6 text-blue-500" />,
      color: 'bg-blue-500/10 hover:bg-blue-500/20',
      allowedForStranger: false
    }
  ];


  return (
    <div className="absolute bottom-16 left-2 sm:left-4 z-40 bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-4 w-[92vw] sm:w-[360px] animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Share Attachment
        </span>
        <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {isStrictStranger && (
        <div className="mb-3 p-2 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2 text-[11px] text-red-600 dark:text-red-400">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Stranger Shield Active:</strong> File attachments, voice notes & media are restricted. Only Google Verified Location & Text are allowed.
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => {
          const isBlocked = isStrictStranger && !item.allowedForStranger;
          return (
            <button
              key={item.id}
              disabled={isBlocked}
              onClick={() => {
                soundEngine.playClick();
                onSelectType(item.id);
                onClose();
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all cursor-pointer ${item.color} ${
                isBlocked ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95'
              }`}
              title={isBlocked ? 'Blocked by Stranger Shield' : item.label}
            >
              <div className="mb-1.5">{item.icon}</div>
              <span className="text-[11px] font-semibold text-[var(--text-primary)] text-center leading-tight">
                {item.label}
              </span>
              {isBlocked && (
                <span className="text-[9px] text-red-500 font-bold uppercase mt-0.5">Blocked</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};