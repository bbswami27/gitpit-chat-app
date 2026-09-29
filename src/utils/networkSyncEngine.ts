import { Message, Chat, Contact } from '../types';

type SyncPayloadType =
  | 'MESSAGE_SENT'
  | 'CONTACT_ADDED'
  | 'CALL_INITIATED'
  | 'CALL_ACCEPTED'
  | 'CALL_ENDED'
  | 'REACTION_ADDED'
  | 'TYPING_STATUS';

export interface SyncPayload {
  type: SyncPayloadType;
  senderPhone: string;
  senderName: string;
  targetPhone?: string;
  chatId: string;
  data: any;
  timestamp: number;
}

const RENDER_SIGNAL_ENDPOINT = 'https://gitpit-chat-app.onrender.com/api/signal';

class NetworkSyncEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: ((payload: SyncPayload) => void)[] = [];
  private lastPolledTimestamp = Date.now() - 5000;
  private myPhone = '';
  private pollTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('gitpit_realtime_network_channel_v2');
        this.channel.onmessage = (event) => {
          this.handleIncomingPayload(event.data);
        };
      } catch (error) {
        console.warn('BroadcastChannel error', error);
      }
    }
  }

  private getSignalEndpoint() {
    if (typeof window === 'undefined') return RENDER_SIGNAL_ENDPOINT;

    const host = window.location.hostname;
    const protocol = window.location.protocol;
    const isViteDev =
      (host === 'localhost' || host === '127.0.0.1') &&
      window.location.port === '5173';

    const isNativeShell =
      protocol === 'capacitor:' ||
      protocol === 'ionic:' ||
      ((host === 'localhost' || host === '127.0.0.1') && !isViteDev);

    return isNativeShell
      ? RENDER_SIGNAL_ENDPOINT
      : `${window.location.origin}/api/signal`;
  }

  public setMyPhoneNumber(phone: string) {
    const nextPhone = phone ? phone.replace(/\D/g, '').slice(-10) : '';

    if (nextPhone !== this.myPhone) {
      this.lastPolledTimestamp = Date.now() - 2000;
    }

    this.myPhone = nextPhone;
    this.startHttpSignalingPoller();
  }

  private startHttpSignalingPoller() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }

    if (typeof window === 'undefined' || !this.myPhone) return;

    this.pollTimer = setInterval(async () => {
      try {
        const endpoint = this.getSignalEndpoint();
        const url =
          `${endpoint}?since=${this.lastPolledTimestamp}` +
          `&phone=${encodeURIComponent(this.myPhone)}`;

        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) return;

        const data = await response.json();
        if (!Array.isArray(data.signals)) return;

        for (const signal of data.signals as SyncPayload[]) {
          if (
            typeof signal.timestamp === 'number' &&
            signal.timestamp > this.lastPolledTimestamp
          ) {
            this.lastPolledTimestamp = signal.timestamp;
          }

          if (
            signal.type === 'CALL_INITIATED' ||
            signal.type === 'CALL_ACCEPTED' ||
            signal.type === 'CALL_ENDED'
          ) {
            this.handleIncomingPayload(signal);
          }
        }
      } catch {
        // Retry after a network change.
      }
    }, 1200);
  }

  private handleIncomingPayload(payload: SyncPayload) {
    if (!payload || !payload.type) return;

    const senderPhone = payload.senderPhone
      ? payload.senderPhone.replace(/\D/g, '').slice(-10)
      : '';

    if (this.myPhone && senderPhone === this.myPhone) return;

    for (const listener of this.listeners) {
      try {
        listener(payload);
      } catch (error) {
        console.error('Network sync listener error', error);
      }
    }
  }

  public subscribe(listener: (payload: SyncPayload) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  public async broadcast(payload: SyncPayload) {
    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch {}
    }

    try {
      await fetch(this.getSignalEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.warn('GitPit signal POST error', error);
    }
  }

  public async pickNativeDeviceContact(): Promise<{
    name: string;
    phoneNumber: string;
  } | null> {
    if (
      typeof window !== 'undefined' &&
      'contacts' in navigator &&
      'select' in (navigator as any).contacts
    ) {
      try {
        const props = ['name', 'tel'];
        const opts = { multiple: false };
        const contacts = await (navigator as any).contacts.select(props, opts);

        if (contacts && contacts.length > 0) {
          const contact = contacts[0];
          const name =
            contact.name && contact.name[0] ? contact.name[0] : 'Saved Contact';
          const phone =
            contact.tel && contact.tel[0]
              ? contact.tel[0].replace(/\D/g, '')
              : '';

          if (phone) {
            return { name, phoneNumber: phone.slice(-10) };
          }
        }
      } catch (error) {
        console.warn('Native Contacts Picker cancelled', error);
      }
    }

    return null;
  }
}

export const networkSyncEngine = new NetworkSyncEngine();

