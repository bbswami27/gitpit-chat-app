import React from 'react';
import { X, Download } from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';

export const MediaLightbox: React.FC = () => {
  const { mediaLightboxData, updateStore } = useGitPitStore();

  if (!mediaLightboxData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-between p-4 animate-in fade-in duration-200">
      <div className="w-full flex items-center justify-between text-white z-10">
        <span className="text-xs font-semibold text-white/80">{mediaLightboxData.title || 'Media Preview'}</span>
        <button
          onClick={() => updateStore(() => ({ mediaLightboxData: null }))}
          className="p-2 rounded-full hover:bg-white/10 text-white cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center my-auto p-2 max-h-[80vh]">
        <img
          src={mediaLightboxData.url}
          alt="Preview"
          className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl object-contain"
        />
      </div>

      <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full text-white">
        <button 
          onClick={() => window.open(mediaLightboxData.url, '_blank')}
          className="flex items-center gap-1.5 text-xs font-bold hover:text-[var(--accent)] cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Save Full Quality</span>
        </button>
      </div>
    </div>
  );
};