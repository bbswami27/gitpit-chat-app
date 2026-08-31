/**
 * GitPit Real-Time Production Cloud Signaling Engine
 * Connects physical devices across 4G/5G/Wi-Fi for Real Messages, WebRTC Calls & Contact Sync
 */

export interface RealtimeSignal {
  id: string;
  type: 'MESSAGE' | 'CALL_OFFER' | 'CALL_ANSWER' | 'ICE_CANDIDATE' | 'CALL_HANGUP' | 'PRESENCE';
  senderPhone: string;
  senderName: string;
  targetPhone?: string;
  chatId: string;
  payload: any;
  timestamp: number;
}

class RealtimeCloudBackend {
  private listeners: ((signal: RealtimeSignal) => void)[] = [];
  private myPhone: string = '';
  private pollInterval: any = null;
  private lastTimestamp: number = Date.now() - 10000;

  // Cloud Gateway Endpoint (Fallback to Vite Dev Server / Cloud Relay)
  private cloudEndpoint: string = '';

  constructor() {
    this.initCloudEndpoint();
  }

  private initCloudEndpoint() {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname || '192.168.29.100';
      const port = window.location.port || '5173';
      const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
      this.cloudEndpoint = `${protocol}//${host}:${port}/api/signal`;
    }
  }

  public setUserPhone(phone: string) {
    this.myPhone = phone ? phone.replace(/\D/g, '').slice(-10) : '';
    this.startPolling();
  }

  public subscribe(callback: (signal: RealtimeSignal) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(signal: RealtimeSignal) {
    this.listeners.forEach((l) => {
      try {
        l(signal);
      } catch (e) {
        console.error('Error in signal listener:', e);
      }
    });
  }

  /**
   * Broadcast message / WebRTC signal to cloud backend
   */
  public async sendSignal(signal: Omit<RealtimeSignal, 'id' | 'timestamp'>): Promise<boolean> {
    const fullSignal: RealtimeSignal = {
      ...signal,
      id: 'sig_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now()
    };

    try {
      if (this.cloudEndpoint) {
        await fetch(this.cloudEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullSignal)
        });
      }
      return true;
    } catch (e) {
      console.warn('Cloud signal send error:', e);
      return false;
    }
  }

  /**
   * Continuous real-time signal poller
   */
  private startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);

    this.pollInterval = setInterval(async () => {
      if (!this.cloudEndpoint || !this.myPhone) return;

      try {
        const url = `${this.cloudEndpoint}?since=${this.lastTimestamp}&phone=${this.myPhone}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.signals && Array.isArray(data.signals)) {
            data.signals.forEach((sig: RealtimeSignal) => {
              if (sig.timestamp > this.lastTimestamp) {
                this.lastTimestamp = sig.timestamp;
              }
              // Ignore own signals
              const senderClean = sig.senderPhone ? sig.senderPhone.replace(/\D/g, '').slice(-10) : '';
              if (senderClean !== this.myPhone) {
                this.notifyListeners(sig);
              }
            });
          }
        }
      } catch (e) {
        // Silent retry
      }
    }, 1000);
  }
}

export const realtimeCloudBackend = new RealtimeCloudBackend();
