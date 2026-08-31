import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Clock, 
  Moon, 
  Calendar, 
  Sparkles, 
  UserCheck, 
  Activity, 
  KeyRound, 
  Sliders, 
  Baby, 
  User, 
  GraduationCap,
  CheckCircle2
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';
import { soundEngine, triggerConfetti } from '../../utils/soundEffects';

export const ParentalControlModal: React.FC = () => {
  const { 
    parentalControl, 
    aiSafetyLogs, 
    parentalControlModalOpen, 
    toggleParentalControl, 
    updateParentalControl, 
    setAgeAndAutoConfigure,
    updateStore 
  } = useGitPitStore();

  const [pinInput, setPinInput] = useState('');
  const [isUnlockedForEditing, setIsUnlockedForEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'mode_selection' | 'controls' | 'limits' | 'logs' | 'pin'>('mode_selection');
  const [newPin, setNewPin] = useState('');

  if (!parentalControlModalOpen) return null;

  // Exact Rule: Protection is applicable up to 15 years only (Age <= 15); rest (> 15) is open!
  const isCurrentlyActive = 
    !parentalControl ? false :
    parentalControl.activationMode === 'off' ? false :
    parentalControl.activationMode === 'parent_forced' ? parentalControl.isEnabled :
    (parentalControl.calculatedAge ?? 25) <= 15;

  const currentAge = parentalControl?.calculatedAge ?? 24;

  const handleAuthorizePin = () => {
    if (pinInput === (parentalControl?.parentPin || '9999')) {
      soundEngine.playSentPop();
      setIsUnlockedForEditing(true);
      setPinInput('');
    } else {
      soundEngine.playClick();
      alert('❌ Incorrect Parental PIN! Default PIN is: 9999');
    }
  };

  const handleSetActivationMode = (mode: 'off' | 'age_based' | 'parent_forced') => {
    soundEngine.playClick();
    let isEnabled = parentalControl?.isEnabled ?? false;
    if (mode === 'off') isEnabled = false;
    if (mode === 'age_based') isEnabled = currentAge <= 15; // Up to 15 years only!
    
    updateParentalControl({ activationMode: mode, isEnabled });
    triggerConfetti();
  };

  const handleChangePin = () => {
    if (newPin.length !== 4) {
      alert('PIN must be exactly 4 digits');
      return;
    }
    updateParentalControl({ parentPin: newPin });
    setNewPin('');
    alert('✅ Parental Master PIN updated to: ' + newPin);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-[var(--header-bg)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white font-bold shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-primary)] flex items-center gap-2">
                <span>AI Child Protection & Parental Controls</span>
                <span className={"text-[10px] font-black px-2 py-0.5 rounded-full text-white " + (isCurrentlyActive ? 'bg-emerald-600' : 'bg-gray-600')}>
                  {isCurrentlyActive ? 'ACTIVE (≤15 YRS) 🛡️' : 'OPEN (>15 YRS)'}
                </span>
              </h3>
              <span className="text-[10px] text-[var(--text-secondary)] font-semibold">
                Applicable up to 15 years only &bull; Rest is Open & Unrestricted
              </span>
            </div>
          </div>

          <button 
            onClick={() => updateStore(() => ({ parentalControlModalOpen: false }))} 
            className="p-1.5 text-[var(--text-secondary)] hover:bg-black/10 dark:hover:bg-white/10 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Authorization Screen if not unlocked */}
        {!isUnlockedForEditing ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/30 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-black text-lg text-[var(--text-primary)]">Parental PIN Verification</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs">
                To configure age-based protection, modify AI filters, or view blocked logs, enter your Parental Master PIN.
              </p>
            </div>

            <div className="w-full max-w-xs space-y-2">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAuthorizePin()}
                placeholder="Enter 4-Digit Parent PIN"
                className="w-full text-center text-2xl tracking-widest py-2.5 rounded-2xl bg-[var(--header-bg)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-rose-500 font-black"
              />
              <span className="text-[10px] text-[var(--text-secondary)] block">Default Test PIN: <strong>9999</strong></span>
            </div>

            <button
              onClick={handleAuthorizePin}
              className="w-full max-w-xs py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all active:scale-95"
            >
              Authorize & Access Parental Hub
            </button>
          </div>
        ) : (
          <>
            {/* 5 Navigation Tabs */}
            <div className="flex border-b border-[var(--border-color)] bg-[var(--header-bg)] px-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('mode_selection')}
                className={"py-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1 shrink-0 " + (
                  activeTab === 'mode_selection' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-transparent text-[var(--text-secondary)]'
                )}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Activation Basis</span>
              </button>

              <button
                onClick={() => setActiveTab('controls')}
                className={"py-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1 shrink-0 " + (
                  activeTab === 'controls' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-transparent text-[var(--text-secondary)]'
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AI Filters</span>
              </button>

              <button
                onClick={() => setActiveTab('limits')}
                className={"py-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1 shrink-0 " + (
                  activeTab === 'limits' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-transparent text-[var(--text-secondary)]'
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Screen Limits</span>
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={"py-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1 shrink-0 " + (
                  activeTab === 'logs' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-transparent text-[var(--text-secondary)]'
                )}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Safety Logs</span>
              </button>

              <button
                onClick={() => setActiveTab('pin')}
                className={"py-2.5 px-3 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center gap-1 shrink-0 " + (
                  activeTab === 'pin' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-transparent text-[var(--text-secondary)]'
                )}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>PIN</span>
              </button>

            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              
              {/* TAB 1: ACTIVATION BASIS (UP TO 15 YEARS ONLY VS PARENTAL OVERRIDE VS OFF) */}
              {activeTab === 'mode_selection' && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>Rule: Protection is active up to 15 years old only. Above 15 years (&gt; 15) is completely open.</span>
                  </div>

                  {/* 3 Core Options */}
                  <div className="space-y-2.5">
                    
                    {/* Option A: Age-Based Auto Trigger (Up to 15 Years Only) */}
                    <div 
                      onClick={() => handleSetActivationMode('age_based')}
                      className={"p-4 rounded-2xl border-2 cursor-pointer transition-all " + (
                        parentalControl.activationMode === 'age_based' 
                          ? 'border-emerald-500 bg-emerald-500/10' 
                          : 'border-[var(--border-color)] bg-black/5 dark:bg-white/5 hover:border-gray-400'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-500" />
                          <span className="font-extrabold text-sm text-[var(--text-primary)]">
                            Option A: Age-Based (Applicable Up to 15 Years Only)
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                          ACTIVE RULE
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        AI automatically activates Child Protection for ages &le; 15 years (Child &amp; Teen tiers). Anyone above 15 years (&gt; 15) is <strong>completely open and unrestricted</strong>.
                      </p>
                    </div>

                    {/* Option B: Explicit Selection by Parents */}
                    <div 
                      onClick={() => handleSetActivationMode('parent_forced')}
                      className={"p-4 rounded-2xl border-2 cursor-pointer transition-all " + (
                        parentalControl.activationMode === 'parent_forced' 
                          ? 'border-purple-500 bg-purple-500/10' 
                          : 'border-[var(--border-color)] bg-black/5 dark:bg-white/5 hover:border-gray-400'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-purple-500" />
                          <span className="font-extrabold text-sm text-[var(--text-primary)]">
                            Option B: Explicit Override by Parents (Forced Mode)
                          </span>
                        </div>
                        <span className="text-[10px] font-bold bg-purple-500/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                          MANUAL OVERRIDE
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        Parents can manually force Child Protection ON or OFF regardless of age, locked with Parental PIN.
                      </p>
                    </div>

                    {/* Option C: Completely OFF */}
                    <div 
                      onClick={() => handleSetActivationMode('off')}
                      className={"p-4 rounded-2xl border-2 cursor-pointer transition-all " + (
                        parentalControl.activationMode === 'off' 
                          ? 'border-rose-500 bg-rose-500/10' 
                          : 'border-[var(--border-color)] bg-black/5 dark:bg-white/5 hover:border-gray-400'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-sm text-[var(--text-primary)]">
                          Option C: Disabled / Open for All
                        </span>
                        <span className="text-[10px] font-bold bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full">
                          OPEN
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        No AI filtering or screen time limits applied.
                      </p>
                    </div>

                  </div>

                  {/* Dynamic Age Configuration & 1-Click Simulation Tiers */}
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-[var(--text-primary)]">
                        Current Profile Age: <strong>{currentAge} Years Old</strong>
                      </span>
                      <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full text-white " + (
                        currentAge <= 12 ? 'bg-rose-500' : currentAge <= 15 ? 'bg-amber-500' : 'bg-emerald-600'
                      )}>
                        Status: {currentAge <= 12 ? 'Child (≤12 yrs - Protected)' : currentAge <= 15 ? 'Teen (13-15 yrs - Protected)' : 'Above 15 yrs (REST IS OPEN)'}
                      </span>
                    </div>

                    {/* Quick Age Preset Buttons: Under 13, 13-15, and Above 15 */}
                    <div>
                      <span className="text-[11px] font-bold text-[var(--text-secondary)] block mb-1.5">
                        Test Age Tiers (Up to 15 yrs vs Above 15 yrs):
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setAgeAndAutoConfigure(10)}
                          className={"p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer " + (
                            currentAge === 10 ? 'border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400 shadow' : 'border-[var(--border-color)] bg-[var(--panel-bg)]'
                          )}
                        >
                          <Baby className="w-4 h-4 mx-auto mb-1 text-rose-500" />
                          <span className="block text-[11px]">10-Yr Child</span>
                          <span className="text-[9px] text-gray-500 block">Strict (≤12 yrs)</span>
                        </button>

                        <button
                          onClick={() => setAgeAndAutoConfigure(14)}
                          className={"p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer " + (
                            currentAge === 14 ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 shadow' : 'border-[var(--border-color)] bg-[var(--panel-bg)]'
                          )}
                        >
                          <GraduationCap className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                          <span className="block text-[11px]">14-Yr Teen</span>
                          <span className="text-[9px] text-amber-600 dark:text-amber-400 block font-bold">Moderate (13-15 yrs)</span>
                        </button>

                        <button
                          onClick={() => setAgeAndAutoConfigure(16)}
                          className={"p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer " + (
                            currentAge === 16 ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow ring-2 ring-emerald-500/30' : 'border-[var(--border-color)] bg-[var(--panel-bg)]'
                          )}
                        >
                          <User className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                          <span className="block text-[11px]">16-Yr &amp; Above</span>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block font-bold">REST IS OPEN</span>
                        </button>
                      </div>
                    </div>

                    {/* Manual Age Adjuster */}
                    <div className="pt-2 flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[var(--text-secondary)]">Or Set Custom Age (Years):</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={currentAge}
                        onChange={(e) => setAgeAndAutoConfigure(parseInt(e.target.value) || 16)}
                        className="w-20 p-1.5 text-center font-bold text-xs rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AI FILTERS & PROTECTION CONTROLS */}
              {activeTab === 'controls' && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--text-primary)] block">Block Adult &amp; Pornographic Content (AI Vision)</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">Automatically redacts NSFW media, adult links and photos (Active &le; 15 yrs)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={parentalControl.filterAdultContent}
                        onChange={(e) => updateParentalControl({ filterAdultContent: e.target.checked })}
                        className="w-5 h-5 accent-rose-500 cursor-pointer"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--text-primary)] block">Block Abusive &amp; Toxic Language (AI NLP Guard)</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">Redacts offensive slurs, swearing and cyberbullying attempts (Active &le; 15 yrs)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={parentalControl.filterAbusiveLanguage}
                        onChange={(e) => updateParentalControl({ filterAbusiveLanguage: e.target.checked })}
                        className="w-5 h-5 accent-rose-500 cursor-pointer"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--text-primary)] block">Block Extreme Violence &amp; Weaponry</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">Hides depictions of violence, weapons, or hate speech</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={parentalControl.filterViolence}
                        onChange={(e) => updateParentalControl({ filterViolence: e.target.checked })}
                        className="w-5 h-5 accent-rose-500 cursor-pointer"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[var(--text-primary)] block">Strict Stranger &amp; Unknown Contact Lock</span>
                        <span className="text-[10px] text-[var(--text-secondary)]">Children can ONLY communicate with verified phonebook contacts</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={parentalControl.blockAllStrangers}
                        onChange={(e) => updateParentalControl({ blockAllStrangers: e.target.checked })}
                        className="w-5 h-5 accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TIME LIMITS & BEDTIME SCHEDULE */}
              {activeTab === 'limits' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Daily Screen Time Usage
                      </span>
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {parentalControl.usedTimeTodayMinutes} / {parentalControl.dailyTimeLimitMinutes} mins today
                      </span>
                    </div>

                    <div className="w-full h-2 bg-blue-950/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: ((parentalControl.usedTimeTodayMinutes / parentalControl.dailyTimeLimitMinutes) * 100) + '%' }} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[var(--text-secondary)]">Max Daily Allowance:</label>
                      <select
                        value={parentalControl.dailyTimeLimitMinutes}
                        onChange={(e) => updateParentalControl({ dailyTimeLimitMinutes: parseInt(e.target.value) })}
                        className="p-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)] font-bold"
                      >
                        <option value={60}>1 Hour / Day (Child &le; 12 yrs)</option>
                        <option value={120}>2 Hours / Day (Teen 13-15 yrs)</option>
                        <option value={180}>3 Hours / Day</option>
                        <option value={240}>4 Hours / Day (Above 15 yrs Open)</option>
                      </select>
                    </div>
                  </div>

                  {/* Bedtime Lock Schedule */}
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                        <Moon className="w-4 h-4" /> Scheduled Bedtime Lock
                      </span>
                      <input
                        type="checkbox"
                        checked={parentalControl.bedtimeSchedule.enabled}
                        onChange={(e) => updateParentalControl({
                          bedtimeSchedule: { ...parentalControl.bedtimeSchedule, enabled: e.target.checked }
                        })}
                        className="w-4 h-4 accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Locks chat &amp; calling functions during sleeping hours (Active for ages &le; 15).
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="font-bold text-[var(--text-secondary)] block mb-1">Start Bedtime:</label>
                        <input
                          type="time"
                          value={parentalControl.bedtimeSchedule.startTime}
                          onChange={(e) => updateParentalControl({
                            bedtimeSchedule: { ...parentalControl.bedtimeSchedule, startTime: e.target.value }
                          })}
                          className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-[var(--text-secondary)] block mb-1">End Bedtime:</label>
                        <input
                          type="time"
                          value={parentalControl.bedtimeSchedule.endTime}
                          onChange={(e) => updateParentalControl({
                            bedtimeSchedule: { ...parentalControl.bedtimeSchedule, endTime: e.target.value }
                          })}
                          className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REAL-TIME AI SAFETY AUDIT LOGS */}
              {activeTab === 'logs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[var(--text-secondary)]">AI Interceptions &amp; Content Redactions (&le; 15 yrs)</span>
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                      {aiSafetyLogs.length} Events Flagged
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {aiSafetyLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-[var(--border-color)] space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                          <span className="font-extrabold text-rose-600 dark:text-rose-400 uppercase bg-rose-500/15 px-1.5 py-0.5 rounded">
                            {log.violationType.replace('_', ' ')}
                          </span>
                          <span>{log.timestamp}</span>
                        </div>

                        <div className="font-bold text-xs text-[var(--text-primary)]">
                          Sender: {log.senderName} ({log.chatName})
                        </div>

                        <div className="text-[11px] text-[var(--text-secondary)] leading-tight">
                          Action: {log.actionTaken}
                        </div>

                        <div className="text-[10px] italic text-gray-500 truncate">
                          Snippet: "{log.originalSnippet}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CHANGE PARENT PIN */}
              {activeTab === 'pin' && (
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] space-y-3 max-w-sm mx-auto">
                  <h4 className="font-extrabold text-sm text-[var(--text-primary)]">Change Parental Master PIN</h4>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Keep this PIN secret so children cannot alter protection rules.
                  </p>

                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Enter New 4-Digit PIN"
                    className="w-full text-center text-xl font-black tracking-widest p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)]"
                  />

                  <button
                    onClick={handleChangePin}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                  >
                    Update Parental PIN
                  </button>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};