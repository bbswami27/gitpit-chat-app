import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Send, 
  ShieldCheck, 
  Zap, 
  Camera, 
  ExternalLink, 
  Smartphone, 
  CheckCircle2, 
  Copy 
} from 'lucide-react';
import { useGitPitStore } from '../../store/gitPitStore';
import { soundEngine, triggerConfetti } from '../../utils/soundEffects';

export const UpiModal: React.FC = () => {
  const { 
    currentUser, 
    contacts, 
    processUpiPayment, 
    updateStore 
  } = useGitPitStore();

  const [mode, setMode] = useState<'pay' | 'scan' | 'qr_code'>('pay');
  const [selectedApp, setSelectedApp] = useState<'googlepay' | 'phonepe' | 'paytm' | 'bhim' | 'cred'>('googlepay');
  const [amount, setAmount] = useState<string>('500');
  const [payeeUpiId, setPayeeUpiId] = useState<string>('aarav@okaxis');
  const [payeeName, setPayeeName] = useState<string>('Aarav Sharma');
  const [note, setNote] = useState<string>('GitPit Instant Transfer');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // App Configurations with respective Deep-Link Schemes & Logos
  const upiApps = [
    { 
      id: 'googlepay' as const, 
      name: 'Google Pay', 
      shortName: 'GPay', 
      color: 'from-blue-500 to-emerald-500', 
      borderColor: 'border-blue-500',
      scheme: 'tez://upi/pay',
      fallbackScheme: 'gpay://upi/pay',
      icon: '🌐'
    },
    { 
      id: 'phonepe' as const, 
      name: 'PhonePe', 
      shortName: 'PhonePe', 
      color: 'from-purple-600 to-indigo-600', 
      borderColor: 'border-purple-500',
      scheme: 'phonepe://pay',
      fallbackScheme: 'phonepe://upi/pay',
      icon: '📱'
    },
    { 
      id: 'paytm' as const, 
      name: 'Paytm UPI', 
      shortName: 'Paytm', 
      color: 'from-sky-500 to-blue-600', 
      borderColor: 'border-sky-500',
      scheme: 'paytmmp://pay',
      fallbackScheme: 'paytm://upi/pay',
      icon: '💳'
    },
    { 
      id: 'bhim' as const, 
      name: 'BHIM UPI', 
      shortName: 'BHIM', 
      color: 'from-amber-500 to-orange-600', 
      borderColor: 'border-amber-500',
      scheme: 'bhim://pay',
      fallbackScheme: 'upi://pay',
      icon: '🇮🇳'
    },
    { 
      id: 'cred' as const, 
      name: 'CRED UPI', 
      shortName: 'CRED', 
      color: 'from-rose-500 to-pink-600', 
      borderColor: 'border-rose-500',
      scheme: 'cred://upi/pay',
      fallbackScheme: 'cred://pay',
      icon: '⚡'
    }
  ];

  const currentAppConfig = upiApps.find((a) => a.id === selectedApp) || upiApps[0];

  const genericUpiUrl = 'upi://pay?pa=' + payeeUpiId + '&pn=' + encodeURIComponent(payeeName) + '&am=' + amount + '&cu=INR&tn=' + encodeURIComponent(note);
  const qrCodeApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(genericUpiUrl);

  const handleLaunchRespectiveApp = (appId?: typeof selectedApp) => {
    const targetApp = appId ? upiApps.find((a) => a.id === appId) || currentAppConfig : currentAppConfig;
    const intentUrl = targetApp.scheme + '?pa=' + payeeUpiId + '&pn=' + encodeURIComponent(payeeName) + '&am=' + amount + '&cu=INR&tn=' + encodeURIComponent(note);
    const standardUrl = genericUpiUrl;

    soundEngine.playClick();

    // Launch native application deep-link protocol
    try {
      window.location.href = intentUrl;
    } catch (e) {
      window.location.href = standardUrl;
    }

    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount > 0) {
      processUpiPayment({
        amount: numericAmount,
        upiId: payeeUpiId,
        payeeName,
        app: targetApp.id,
        note
      });
      triggerConfetti();
    }
  };

  const handleCopyUpiLink = () => {
    navigator.clipboard.writeText(genericUpiUrl);
    setCopied(true);
    soundEngine.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    soundEngine.playClick();
    setTimeout(() => {
      setIsScanning(false);
      setPayeeUpiId('merchant.gitpit@hdfcbank');
      setPayeeName('GitPit Verified Merchant');
      setAmount('1250');
      setNote('QR Code Payment');
      setMode('pay');
      alert('QR Code Scanned: Verified Merchant Details Loaded!');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-[var(--panel-bg)] border border-[var(--border-color)] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-[var(--header-bg)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-primary)]">
                GitPit UPI Payment Hub
              </h3>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> NPCI Verified 256-Bit Encrypted
              </span>
            </div>
          </div>
          <button 
            onClick={() => updateStore(() => ({ upiModalOpen: false, qrScannerOpen: false }))}
            className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Top Modes */}
        <div className="flex border-b border-[var(--border-color)] bg-[var(--header-bg)] px-3">
          <button
            onClick={() => setMode('pay')}
            className={"flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center justify-center gap-1 " + (
              mode === 'pay' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-[var(--text-secondary)]'
            )}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pay with App</span>
          </button>

          <button
            onClick={() => setMode('qr_code')}
            className={"flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center justify-center gap-1 " + (
              mode === 'qr_code' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-[var(--text-secondary)]'
            )}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Generate QR</span>
          </button>

          <button
            onClick={() => { setMode('scan'); handleSimulateScan(); }}
            className={"flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center justify-center gap-1 " + (
              mode === 'scan' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-[var(--text-secondary)]'
            )}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan QR</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* 1. DIRECT APP PAYMENT */}
          {mode === 'pay' && (
            <>
              {/* Select Respective App */}
              <div>
                <label className="text-xs font-extrabold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                  Select Respective UPI App to Open:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {upiApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => { 
                        soundEngine.playClick(); 
                        setSelectedApp(app.id); 
                      }}
                      className={"flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer " + (
                        selectedApp === app.id 
                          ? 'border-2 border-teal-500 bg-teal-500/15 text-teal-700 dark:text-teal-300 scale-105 shadow-md font-black' 
                          : 'border-[var(--border-color)] bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:border-gray-400'
                      )}
                    >
                      <span className="text-lg mb-1">{app.icon}</span>
                      <span className="text-[10px] leading-tight font-bold">{app.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-1">
                  Enter Payment Amount (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-2xl font-black text-[var(--text-primary)]">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-2xl font-black rounded-2xl border border-[var(--border-color)] bg-[var(--header-bg)] text-[var(--text-primary)] focus:outline-none focus:border-teal-500"
                    placeholder="0"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex gap-1.5 mt-2">
                  {['100', '500', '1000', '2000', '5000'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => { soundEngine.playClick(); setAmount(preset); }}
                      className="text-xs font-bold px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 hover:bg-teal-500 hover:text-white text-[var(--text-secondary)] transition-colors cursor-pointer"
                    >
                      +₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payee Info */}
              <div className="space-y-2.5 bg-black/5 dark:bg-white/5 p-3.5 rounded-2xl border border-[var(--border-color)] text-xs">
                <div>
                  <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-0.5">
                    Payee Name:
                  </label>
                  <input
                    type="text"
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)] focus:outline-none focus:border-teal-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-0.5">
                    UPI ID / VPA:
                  </label>
                  <input
                    type="text"
                    value={payeeUpiId}
                    onChange={(e) => setPayeeUpiId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)] focus:outline-none focus:border-teal-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--text-secondary)] block mb-0.5">
                    Note / Purpose:
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[var(--border-color)] bg-[var(--panel-bg)] text-[var(--text-primary)] focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Main Action: Launch Respective UPI App */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleLaunchRespectiveApp()}
                  className={"w-full py-3.5 bg-gradient-to-r " + currentAppConfig.color + " text-white font-black text-sm rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in {currentAppConfig.name} (Pay ₹{amount || '0'})</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyUpiLink}
                    className="flex-1 py-2 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'UPI Link Copied!' : 'Copy UPI Link'}</span>
                  </button>
                  
                  <button
                    onClick={() => setMode('qr_code')}
                    className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Show QR</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* 2. GENERATE DYNAMIC QR CODE */}
          {mode === 'qr_code' && (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
              <div className="p-4 rounded-3xl bg-white shadow-xl border border-gray-200">
                <img
                  src={qrCodeApiUrl}
                  alt="Dynamic Payment QR Code"
                  className="w-52 h-52 object-contain"
                />
              </div>

              <div>
                <h4 className="font-extrabold text-base text-[var(--text-primary)]">
                  Scan & Pay ₹{amount}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Scan using Google Pay, PhonePe, Paytm, or BHIM
                </p>
                <div className="mt-1 font-mono text-[11px] text-teal-600 dark:text-teal-400 font-bold">
                  {payeeUpiId}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  onClick={() => handleLaunchRespectiveApp('googlepay')}
                  className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Launch GPay
                </button>
                <button
                  onClick={() => handleLaunchRespectiveApp('phonepe')}
                  className="py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Launch PhonePe
                </button>
              </div>
            </div>
          )}

          {/* 3. CAMERA SCANNER SIMULATION */}
          {mode === 'scan' && (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="relative w-56 h-56 rounded-2xl bg-black/90 border-2 border-teal-500 overflow-hidden flex flex-col items-center justify-center p-4">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse shadow-lg shadow-teal-500" />
                <QrCode className="w-28 h-28 text-white/40 mb-2" />
                <span className="text-xs font-semibold text-white/80">
                  {isScanning ? 'Scanning Payment QR...' : 'Point camera at any UPI QR'}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] max-w-xs">
                Scan any QR code from BharatPe, Google Pay, PhonePe, Paytm, or BHIM.
              </p>

              <button
                onClick={handleSimulateScan}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Simulate Camera Scan</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};