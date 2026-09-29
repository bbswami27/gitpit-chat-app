/**
 * GitPit real-time cloud relay client.
 * Test mode: fixed OTP remains handled by PhoneAuthModal.
 * One-to-one messages are routed by the target 10-digit phone number.
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

const RENDER_SIGNAL_ENDPOINT = 'https://gitpit-chat-app.onrender.com/api/signal';

class RealtimeCloudBackend {
  private listeners: ((signal: RealtimeSignal) => void)[] = [];
  private myPhone = '';
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private lastTimestamp = Date.now() - 10000;
  private cloudEndpoint = '';

  constructor() {
    this.initCloudEndpoint();
  }

  private initCloudEndpoint() {
    if (typeof window === 'undefined') return;

    const host = window.location.hostname;
    const protocol = window.location.protocol;
    const isViteDev =
      (host === 'localhost' || host === '127.0.0.1') &&
      window.location.port === '5173';

    const isNativeShell =
      protocol === 'capacitor:' ||
      protocol === 'ionic:' ||
      ((host === 'localhost' || host === '127.0.0.1') && !isViteDev);

    this.cloudEndpoint = isNativeShell
      ? RENDER_SIGNAL_ENDPOINT
      : `${window.location.origin}/api/signal`;
  }

  public setUserPhone(phone: string) {
    const nextPhone = phone ? phone.replace(/\D/g, '').slice(-10) : '';

    if (nextPhone !== this.myPhone) {
      this.lastTimestamp = Date.now() - 2000;
    }

    this.myPhone = nextPhone;
    this.startPolling();
  }

  public subscribe(callback: (signal: RealtimeSignal) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  }

  private notifyListeners(signal: RealtimeSignal) {
    for (const listener of this.listeners) {
      try {
        listener(signal);
      } catch (error) {
        console.error('GitPit signal listener error:', error);
      }
    }
  }

  public async sendSignal(
    signal: Omit<RealtimeSignal, 'id' | 'timestamp'>
  ): Promise<boolean> {
    if (!this.cloudEndpoint) return false;

    const fullSignal: RealtimeSignal = {
      ...signal,
      id: `sig_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now()
    };

    try {
      const response = await fetch(this.cloudEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullSignal)
      });

      return response.ok;
    } catch (error) {
      console.warn('GitPit cloud signal send error:', error);
      return false;
    }
  }

  private startPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    if (!this.myPhone || !this.cloudEndpoint) return;

    this.pollInterval = setInterval(async () => {
      try {
        const url =
          `${this.cloudEndpoint}?since=${this.lastTimestamp}` +
          `&phone=${encodeURIComponent(this.myPhone)}`;

        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        if (!Array.isArray(data.signals)) return;

        for (const signal of data.signals as RealtimeSignal[]) {
          if (
            typeof signal.timestamp === 'number' &&
            signal.timestamp > this.lastTimestamp
          ) {
            this.lastTimestamp = signal.timestamp;
          }

          const senderPhone = signal.senderPhone
            ? signal.senderPhone.replace(/\D/g, '').slice(-10)
            : '';

          if (senderPhone && senderPhone !== this.myPhone) {
            this.notifyListeners(signal);
          }
        }
      } catch {
        // Retry silently on the next polling cycle.
      }
    }, 1000);
  }
}

export const realtimeCloudBackend = new RealtimeCloudBackend();

