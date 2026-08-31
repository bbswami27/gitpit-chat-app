import { realtimeCloudBackend, RealtimeSignal } from './realtimeBackend';

export interface WebRTCConnectionOptions {
  targetPhone: string;
  myPhone: string;
  myName: string;
  chatId: string;
  isVideo: boolean;
  onRemoteStream?: (stream: MediaStream) => void;
  onLocalStream?: (stream: MediaStream) => void;
  onCallEnded?: () => void;
}

class WebRTCCallingEngine {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private unsubscribeSignal: (() => void) | null = null;
  private options: WebRTCConnectionOptions | null = null;

  private rtcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  /**
   * Start an Outgoing WebRTC Voice or Video Call
   */
  public async startOutgoingCall(options: WebRTCConnectionOptions) {
    this.options = options;
    await this.setupLocalMedia(options.isVideo);

    this.peerConnection = new RTCPeerConnection(this.rtcConfig);
    this.attachLocalTracks();
    this.listenRemoteTracks();
    this.listenIceCandidates();

    // Listen to signals from cloud backend
    this.listenCloudSignals();

    // Create SDP Offer
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    // Send Offer Signal to Target Phone
    await realtimeCloudBackend.sendSignal({
      type: 'CALL_OFFER',
      senderPhone: options.myPhone,
      senderName: options.myName,
      targetPhone: options.targetPhone,
      chatId: options.chatId,
      payload: { sdp: offer, isVideo: options.isVideo }
    });
  }

  /**
   * Accept an Incoming WebRTC Call
   */
  public async acceptIncomingCall(options: WebRTCConnectionOptions, incomingOfferSdp: RTCSessionDescriptionInit) {
    this.options = options;
    await this.setupLocalMedia(options.isVideo);

    this.peerConnection = new RTCPeerConnection(this.rtcConfig);
    this.attachLocalTracks();
    this.listenRemoteTracks();
    this.listenIceCandidates();

    this.listenCloudSignals();

    // Set Remote Description from incoming offer
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(incomingOfferSdp));

    // Create SDP Answer
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    // Send Answer Signal back to caller
    await realtimeCloudBackend.sendSignal({
      type: 'CALL_ANSWER',
      senderPhone: options.myPhone,
      senderName: options.myName,
      targetPhone: options.targetPhone,
      chatId: options.chatId,
      payload: { sdp: answer }
    });
  }

  /**
   * Setup Local Microphone and Camera
   */
  private async setupLocalMedia(isVideo: boolean) {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: isVideo ? { facingMode: 'user' } : false
        });
        if (this.options?.onLocalStream) {
          this.options.onLocalStream(this.localStream);
        }
      }
    } catch (e) {
      console.warn('Microphone/Camera permission error:', e);
    }
  }

  private attachLocalTracks() {
    if (this.peerConnection && this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }
  }

  private listenRemoteTracks() {
    if (!this.peerConnection) return;
    this.remoteStream = new MediaStream();
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream?.addTrack(track);
      });
      if (this.options?.onRemoteStream && this.remoteStream) {
        this.options.onRemoteStream(this.remoteStream);
      }
    };
  }

  private listenIceCandidates() {
    if (!this.peerConnection) return;
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.options) {
        realtimeCloudBackend.sendSignal({
          type: 'ICE_CANDIDATE',
          senderPhone: this.options.myPhone,
          senderName: this.options.myName,
          targetPhone: this.options.targetPhone,
          chatId: this.options.chatId,
          payload: { candidate: event.candidate }
        });
      }
    };
  }

  private listenCloudSignals() {
    this.unsubscribeSignal = realtimeCloudBackend.subscribe(async (signal) => {
      if (!this.options || !this.peerConnection) return;

      if (signal.type === 'CALL_ANSWER' && signal.payload?.sdp) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.payload.sdp));
      } else if (signal.type === 'ICE_CANDIDATE' && signal.payload?.candidate) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.payload.candidate));
        } catch (e) {
          console.warn('Error adding ICE candidate', e);
        }
      } else if (signal.type === 'CALL_HANGUP') {
        this.endCall();
      }
    });
  }

  /**
   * End WebRTC Session & Release Camera/Mic
   */
  public endCall() {
    if (this.options) {
      realtimeCloudBackend.sendSignal({
        type: 'CALL_HANGUP',
        senderPhone: this.options.myPhone,
        senderName: this.options.myName,
        targetPhone: this.options.targetPhone,
        chatId: this.options.chatId,
        payload: {}
      });
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.unsubscribeSignal) {
      this.unsubscribeSignal();
      this.unsubscribeSignal = null;
    }

    if (this.options?.onCallEnded) {
      this.options.onCallEnded();
    }

    this.options = null;
  }
}

export const webrtcCallingEngine = new WebRTCCallingEngine();
