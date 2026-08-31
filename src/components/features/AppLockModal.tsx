import React, { useState } from 'react';
import { Lock, Fingerprint } from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';
import { soundEngine } from '../../utils/soundEffects';

export const AppLockModal: React.FC = () => {
  const { isAppLocked, unlockAppWithPin, lockPin } = useGitPitStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isAppLocked) return null;

  const handleUnlock = () => {
    const ok = unlockAppWithPin(pin);
    if (!ok) {
      setError(true);
      soundEngine.playClick();
      alert('Incorrect Security PIN. Default test PIN is: 1234');
    }
  };

  const handleSimulateBiometric = () => {
    soundEngine.playClick();
    unlockAppWithPin(lockPin);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c1317] text-white flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-5 bg-[#111b21] p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold tracking-tight">GitPit App Lock</h2>
          <p className="text-xs text-gray-400 mt-1">
            Protected with Screen PIN / Biometric Security
          </p>
        </div>

        <div className="w-full space-y-2">
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={(e) => { setError(false); setPin(e.target.value); }}
            placeholder="Enter 4-Digit PIN"
            className={`w-full text-center text-2xl tracking-widest py-3 rounded-2xl bg-black/40 border focus:outline-none ${
              error ? 'border-red-500 text-red-400' : 'border-gray-700 text-white focus:border-emerald-500'
            }`}
          />
          <span className="text-[10px] text-gray-500 block">Default PIN: 1234</span>
        </div>

        <button
          onClick={handleUnlock}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg cursor-pointer transition-all active:scale-95"
        >
          Unlock GitPit
        </button>

        <button
          onClick={handleSimulateBiometric}
          className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
        >
          <Fingerprint className="w-4 h-4" />
          <span>Use Fingerprint / Face ID</span>
        </button>
      </div>
    </div>
  );
};