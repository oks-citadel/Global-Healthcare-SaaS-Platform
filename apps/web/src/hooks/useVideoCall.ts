import { useState, useEffect, useRef, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { io, Socket } from 'socket.io-client';

interface Peer {
  id: string;
  userId: string;
  socketId: string;
  role: 'doctor' | 'patient';
}

interface VideoCallConfig {
  visitId: string;
  role: 'doctor' | 'patient';
  token: string;
  apiUrl: string;
}

interface ConnectionQuality {
  bitrate: number;
  packetsLost: number;
  jitter: number;
  latency: number;
}

export type CallState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

export function useVideoCall(config: VideoCallConfig) {
  const [callState, setCallState] = useState<CallState>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality | null>(null);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<SimplePeer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!config.token || !config.apiUrl) {
      return;
    }

    const socket = io(config.apiUrl, {
      auth: {
        token: config.token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      // Connection established
    });

    socket.on('connect_error', (err) => {
      setError('Failed to connect to server');
      setCallState('error');
    });

    socket.on('disconnect', (reason) => {
      setCallState('disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [config.token, config.apiUrl]);

  // Get user media
  const getUserMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      setError('Failed to access camera/microphone');
      throw err;
    }
  }, []);

  // Join room
  const joinRoom = useCallback(async () => {
    if (!socketRef.current) {
      setError('Socket not connected');
      return;
    }

    setCallState('connecting');
    setError(null);

    try {
      // Get local stream first
      const stream = await getUserMedia();

      // Join room via socket
      socketRef.current.emit(
        'join-room',
        {
          visitId: config.visitId,
          role: config.role,
        },
        (response: any) => {
          if (response.error) {
            setError(response.error);
            setCallState('error');
            return;
          }

          setRoomId(response.roomId);
          setPeers(response.otherPeers || []);

          // If there are other peers, initiate connection
          if (response.otherPeers && response.otherPeers.length > 0) {
            const remotePeer = response.otherPeers[0];
            createPeerConnection(remotePeer.socketId, true, stream);
          }

          setCallState('connected');
        }
      );
    } catch (err) {
      setCallState('error');
    }
  }, [config.visitId, config.role, getUserMedia]);

  // Create peer connection
  const createPeerConnection = useCallback(
    (remoteSocketId: string, initiator: boolean, stream: MediaStream) => {
      if (!socketRef.current) return;

      const peer = new SimplePeer({
        initiator,
        trickle: true,
        stream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      });

      peer.on('signal', (signal) => {
        const eventType = signal.type === 'offer' ? 'webrtc-offer' : 'webrtc-answer';
        socketRef.current?.emit(
          eventType,
          {
            to: remoteSocketId,
            signal,
          },
          (response: any) => {
            // Handle signaling response silently
          }
        );
      });

      peer.on('stream', (remoteStream) => {
        setRemoteStream(remoteStream);
      });

      peer.on('connect', () => {
        setCallState('connected');
        startStatsCollection(peer);
      });

      peer.on('error', (err) => {
        setError('Connection error occurred');
      });

      peer.on('close', () => {
        setCallState('disconnected');
        stopStatsCollection();
      });

      peerConnectionRef.current = peer;

      return peer;
    },
    []
  );

  // Handle incoming WebRTC signals
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on('webrtc-offer', ({ from, signal }: any) => {
      if (!localStreamRef.current) return;

      const peer = createPeerConnection(from, false, localStreamRef.current);
      peer?.signal(signal);
    });

    socket.on('webrtc-answer', ({ from, signal }: any) => {
      peerConnectionRef.current?.signal(signal);
    });

    socket.on('ice-candidate', ({ from, signal }: any) => {
      peerConnectionRef.current?.signal(signal);
    });

    socket.on('peer-joined', ({ peer }: any) => {
      setPeers((prev) => [...prev, peer]);

      // Initiate connection if we have local stream
      if (localStreamRef.current) {
        createPeerConnection(peer.socketId, true, localStreamRef.current);
      }
    });

    socket.on('peer-left', ({ peerId }: any) => {
      setPeers((prev) => prev.filter((p) => p.id !== peerId));
      setRemoteStream(null);
      peerConnectionRef.current?.destroy();
      peerConnectionRef.current = null;
    });

    return () => {
      socket.off('webrtc-offer');
      socket.off('webrtc-answer');
      socket.off('ice-candidate');
      socket.off('peer-joined');
      socket.off('peer-left');
    };
  }, [createPeerConnection]);

  // Stats collection
  const startStatsCollection = useCallback((peer: SimplePeer.Instance) => {
    statsIntervalRef.current = setInterval(async () => {
      try {
        // @ts-ignore - SimplePeer internal API
        const stats = await peer._pc?.getStats();
        if (!stats) return;

        let bitrate = 0;
        let packetsLost = 0;
        let jitter = 0;

        stats.forEach((report: any) => {
          if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
            bitrate = report.bytesReceived || 0;
            packetsLost = report.packetsLost || 0;
            jitter = report.jitter || 0;
          }
        });

        const quality: ConnectionQuality = {
          bitrate,
          packetsLost,
          jitter,
          latency: 0, // Could be calculated from RTT
        };

        setConnectionQuality(quality);

        // Send to server for monitoring
        if (roomId && socketRef.current) {
          socketRef.current.emit('call-quality', {
            roomId,
            quality,
          });
        }
      } catch (err) {
        // Stats collection error - non-critical
      }
    }, 5000); // Every 5 seconds
  }, [roomId]);

  const stopStatsCollection = useCallback(() => {
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (!localStreamRef.current) return;

    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  }, []);

  // Leave room
  const leaveRoom = useCallback(() => {
    if (roomId && socketRef.current) {
      socketRef.current.emit('leave-room', { roomId }, () => {
        // Room left successfully
      });
    }

    // Clean up peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.destroy();
      peerConnectionRef.current = null;
    }

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    stopStatsCollection();
    setLocalStream(null);
    setRemoteStream(null);
    setCallState('idle');
    setRoomId(null);
    setPeers([]);
  }, [roomId, stopStatsCollection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, [leaveRoom]);

  return {
    callState,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    peers,
    roomId,
    connectionQuality,
    error,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo,
  };
}
