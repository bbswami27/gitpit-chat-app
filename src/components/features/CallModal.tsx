import React, { useState, useEffect } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Radio
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';

export const CallModal: React.FC = () => {
  const {
    activeCall,
    acceptIncomingCall,
    endCall,
    toggleCallMute,
    toggleCallCamera,
    toggleCallScreenShare
  } = useGitPitStore();

  const [callSeconds, setCallSeconds] = useState(0);

  useEffect(() => {
    let interval: number | undefined;

    if (activeCall?.status === 'connected') {
      interval = window.setInterval(() => {
        setCallSeconds((previous) => previous + 1);
      }, 1000);
    } else {
      setCallSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall?.status]);

  if (!activeCall) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isIncomingRinging =
    activeCall.direction === 'incoming' && activeCall.status === 'ringing';

  return (
    <div className="fixed inset-0 z-50 bg-[#090e11] text-white flex flex-col items-center justify-between p-6 select-none animate-in fade-in duration-300">
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <Radio className="w-4 h-4" />
          <span>GitPit Realtime Call Signaling Test</span>
        </div>

        {activeCall.status === 'connected' && (
          <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full">
            {formatTimer(callSeconds)}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 my-auto w-full max-w-sm">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl shadow-emerald-500/20">
            <img
              src={activeCall.contact.avatar}
              alt={activeCall.contact.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight">
            {activeCall.contact.name}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {activeCall.status === 'ringing'
              ? activeCall.direction === 'outgoing'
                ? 'Ringing on the other test phone...'
                : 'Incoming GitPit test call...'
              : `GitPit ${activeCall.type === 'video' ? 'Video' : 'Audio'} call signaling connected`}
          </p>
        </div>
      </div>

      {isIncomingRinging ? (
        <div className="flex items-center gap-8 bg-white/10 backdrop-blur-md px-8 py-5 rounded-full shadow-2xl z-10">
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            <PhoneOff className="w-7 h-7" />
          </button>

          <button
            onClick={acceptIncomingCall}
            className="p-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            <Phone className="w-7 h-7" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full shadow-2xl z-10">
          <button
            onClick={toggleCallMute}
            className={`p-3.5 rounded-full transition-all cursor-pointer ${
              activeCall.isMuted
                ? 'bg-red-500 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            {activeCall.isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          {activeCall.type === 'video' && (
            <button
              onClick={toggleCallCamera}
              className={`p-3.5 rounded-full transition-all cursor-pointer ${
                activeCall.isCameraOff
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {activeCall.isCameraOff ? (
                <VideoOff className="w-6 h-6" />
              ) : (
                <Video className="w-6 h-6" />
              )}
            </button>
          )}

          <button
            onClick={toggleCallScreenShare}
            className={`p-3.5 rounded-full transition-all cursor-pointer ${
              activeCall.isScreenSharing
                ? 'bg-teal-500 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Monitor className="w-6 h-6" />
          </button>

          <button
            onClick={endCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

