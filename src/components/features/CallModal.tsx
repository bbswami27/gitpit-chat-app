import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  ShieldCheck
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';

export const CallModal: React.FC = () => {
  const { 
    activeCall, 
    endCall, 
    toggleCallMute, 
    toggleCallCamera, 
    toggleCallScreenShare 
  } = useGitPitStore();

  const [callSeconds, setCallSeconds] = useState(0);

  useEffect(() => {
    let interval: number;
    if (activeCall?.status === 'connected') {
      interval = window.setInterval(() => {
        setCallSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall?.status]);

  if (!activeCall) return null;

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090e11] text-white flex flex-col items-center justify-between p-6 select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>GitPit End-to-End Encrypted Call</span>
        </div>

        {activeCall.status === 'connected' && (
          <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full">
            {formatTimer(callSeconds)}
          </span>
        )}
      </div>

      {/* Center Hero */}
      <div className="flex flex-col items-center justify-center space-y-4 my-auto w-full max-w-sm">
        {activeCall.type === 'video' && !activeCall.isCameraOff ? (
          <div className="relative w-full aspect-video sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/50 bg-black">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
              alt="Video Feed"
              className="w-full h-full object-cover"
            />
            {activeCall.isScreenSharing && (
              <div className="absolute inset-0 bg-blue-900/90 flex flex-col items-center justify-center p-4 text-center">
                <Monitor className="w-12 h-12 text-teal-400 mb-2 animate-bounce" />
                <span className="font-bold text-sm">Screen Sharing Active</span>
                <span className="text-xs text-white/70">Broadcasting live presentation feed</span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl shadow-emerald-500/20">
              <img
                src={activeCall.contact.avatar}
                alt={activeCall.contact.name}
                className="w-full h-full object-cover"
              />
            </div>
            {activeCall.status === 'connected' && (
              <div className="absolute -inset-3 rounded-full border-2 border-emerald-400/40 animate-ping pointer-events-none" />
            )}
          </div>
        )}

        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight">{activeCall.contact.name}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {activeCall.status === 'ringing' 
              ? (activeCall.direction === 'outgoing' ? 'Ringing...' : 'Incoming call...') 
              : `GitPit HD ${activeCall.type === 'video' ? 'Video' : 'Audio'} Call Active`
            }
          </p>
        </div>
      </div>

      {/* Bottom Control Actions */}
      <div className="flex items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full shadow-2xl z-10">
        <button
          onClick={toggleCallMute}
          className={`p-3.5 rounded-full transition-all cursor-pointer ${
            activeCall.isMuted ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
          title={activeCall.isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {activeCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {activeCall.type === 'video' && (
          <button
            onClick={toggleCallCamera}
            className={`p-3.5 rounded-full transition-all cursor-pointer ${
              activeCall.isCameraOff ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title={activeCall.isCameraOff ? 'Turn camera on' : 'Turn camera off'}
          >
            {activeCall.isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </button>
        )}

        <button
          onClick={toggleCallScreenShare}
          className={`p-3.5 rounded-full transition-all cursor-pointer ${
            activeCall.isScreenSharing ? 'bg-teal-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
          title="Share Screen (One-to-Many)"
        >
          <Monitor className="w-6 h-6" />
        </button>

        <button
          onClick={endCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="End Call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};