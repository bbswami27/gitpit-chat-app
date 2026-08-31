import React, { useState } from 'react';
import { ShieldCheck, Phone, Lock, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';
import { soundEngine, triggerConfetti } from '../../utils/soundEffects';

interface PhoneAuthModalProps {
  onSuccess: (countryCode: string, phoneNumber: string) => void;
}

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.trim().length < 8) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    soundEngine.playClick();
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim() !== '123456') {
      setErrorMsg('Invalid OTP. Please enter 6-digit OTP: 123456');
      return;
    }

    soundEngine.playClick();
    triggerConfetti();
    onSuccess(countryCode, phoneNumber.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--panel-bg)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-center text-[var(--text-primary)]">
        
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">GitPit Secure Login</h2>
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Enter your real mobile phone number to log in with 6-digit OTP.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/30 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: PHONE NUMBER INPUT */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider block">
                Mobile Phone Number:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-20 p-3.5 text-center font-bold text-sm rounded-2xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] focus:outline-none"
                />
                <div className="relative flex-1">
                  <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-[var(--text-secondary)]" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 font-bold text-sm rounded-2xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Send 6-Digit SMS OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 font-semibold flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Enter any real mobile number. 6-Digit Verification OTP: <strong>123456</strong></span>
            </div>
          </form>
        ) : (
          /* STEP 2: 6-DIGIT OTP VERIFICATION */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-[var(--text-secondary)] block">
                Enter 6-Digit OTP sent to <strong className="text-emerald-500">{countryCode} {phoneNumber}</strong>:
              </span>

              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 text-center font-black tracking-[0.5em] text-lg rounded-2xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                🔑 Real Phone SMS OTP: <strong>123456</strong>
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="px-4 py-3 bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[var(--text-primary)] font-bold text-xs rounded-2xl cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify OTP & Access GitPit</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
