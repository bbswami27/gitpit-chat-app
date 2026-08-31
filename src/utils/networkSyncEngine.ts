import { Message, Chat, Contact } from '../types';
import { soundEngine } from './soundEffects';

type SyncPayloadType = 'MESSAGE_SENT' | 'CONTACT_ADDED' | 'CALL_INITIATED' | 'CALL_ACCEPTED' | 'CALL_ENDED' | 'REACTION_ADDED' | 'TYPING_STATUS';

export interface SyncPayload {
  type: SyncPayloadType;
  senderPhone: string;
  senderName: string;
  targetPhone?: string;
  chatId: string;
  data: any;
  timestamp: number;
}

class NetworkSyncEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: ((payload: SyncPayload) => void)[] = [];
  private lastPolledTimestamp: number = Date.now() - 5000;
  private myPhone: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('gitpit_realtime_network_channel_v1');
        this.channel.onmessage = (event) => {
          this.handleIncomingPayload(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel error', e);
      }
    }

    // Start HTTP Signaling Poller for cross-device communication
    this.startHttpSignalingPoller();
  }

  public setMyPhoneNumber(phone: string) {
    this.myPhone = phone ? phone.replace(/\D/g, '').slice(-10) : '';
  }

  private startHttpSignalingPoller() {
    if (typeof window === 'undefined') return;

    setInterval(async () => {
      try {
        const host = window.location.hostname || '192.168.29.100';
        const url = `http://${host}:5173/api/signal?since=${this.lastPolledTimestamp}&phone=${this.myPhone}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.signals && data.signals.length > 0) {
            data.signals.forEach((sig: SyncPayload) => {
              if (sig.timestamp > this.lastPolledTimestamp) {
                this.lastPolledTimestamp = sig.timestamp;
              }
              this.handleIncomingPayload(sig);
            });
          }
        }
      } catch (e) {
        // Silent network fallback
      }
    }, 1200);
  }

  private handleIncomingPayload(payload: SyncPayload) {
    if (!payload || !payload.type) return;
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (e) {
        console.error('Error in sync listener', e);
      }
    });
  }

  public subscribe(listener: (payload: SyncPayload) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public async broadcast(payload: SyncPayload) {
    // 1. BroadcastChannel local tab/window sync
    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (e) {}
    }

    // 2. HTTP Signal Server Post for Cross-Device Real Phones
    try {
      const host = typeof window !== 'undefined' ? window.location.hostname : '192.168.29.100';
      await fetch(`http://${host}:5173/api/signal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn('Signal POST error', e);
    }
  }

  public async pickNativeDeviceContact(): Promise<{ name: string; phoneNumber: string } | null> {
    if (typeof window !== 'undefined' && 'contacts' in navigator && 'select' in (navigator as any).contacts) {
      try {
        const props = ['name', 'tel'];
        const opts = { multiple: false };
        const contacts = await (navigator as any).contacts.select(props, opts);
        if (contacts && contacts.length > 0) {
          const c = contacts[0];
          const name = c.name && c.name[0] ? c.name[0] : 'Saved Contact';
          const tel = c.tel && c.tel[0] ? c.tel[0].replace(/\D/g, '') : '';
          if (tel) {
            return { name, phoneNumber: tel.slice(-10) };
          }
        }
      } catch (e) {
        console.warn('Native Contacts Picker cancelled', e);
      }
    }
    return null;
  }
}

export const networkSyncEngine = new NetworkSyncEngine();
