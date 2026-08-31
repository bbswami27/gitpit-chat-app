import React, { useState, useEffect } from 'react';
import { Trash2, Send } from 'lucide-react';
import { soundEngine } from '../../utils/soundEffects';

interface VoiceRecorderProps {
  onSendVoice: (durationSeconds: number, transcription: string) => void;
  onCancel: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSendVoice, onCancel }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(true);

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSend = () => {
    soundEngine.playSentPop();
    const duration = seconds || 5;
    const sampleTranscript = "Hey, checking in regarding the GitPit updates! Everything is looking smooth.";
    onSendVoice(duration, sampleTranscript);
  };

  return (
    <div className="flex items-center justify-between w-full px-3 py-2 bg-[var(--header-bg)] rounded-2xl border border-[var(--border-color)] animate-in fade-in duration-200">
      {/* Recording Indicator & Timer */}
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-red-500 animate-ping shrink-0" />
        <span className="text-sm font-bold text-red-500 tracking-wider">
          {formatTimer(seconds)}
        </span>

        {/* Animated Sound Wave Bars */}
        <div className="flex items-center gap-0.5 h-6">
          {[40, 70, 90, 60, 30, 80, 100, 50, 65, 85, 45, 95].map((height, i) => (
            <div
              key={i}
              className="w-1 bg-[var(--accent)] rounded-full transition-all duration-150 animate-pulse"
              style={{ height: `${height}%`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons: Cancel / Send */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { soundEngine.playClick(); onCancel(); }}
          className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
          title="Cancel recording"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <button
          onClick={handleSend}
          className="p-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-full shadow-md active:scale-95 transition-transform cursor-pointer"
          title="Send voice note"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};