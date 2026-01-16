import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  RTCView,
  MediaStream,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import io, { Socket } from 'socket.io-client';

const { width: _width, height: _height } = Dimensions.get('window');

interface VideoCallScreenProps {
  visitId: string;
  userRole: 'doctor' | 'patient';
  token: string;
  apiUrl: string;
  onEndCall: () => void;
}

interface Peer {
  id: string;
  userId: string;
  socketId: string;
  role: 'doctor' | 'patient';
}

export default function VideoCallScreen({
  visitId,
  userRole,
  token,
  apiUrl,
  onEndCall,
}: VideoCallScreenProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const roomIdRef = useRef<string | null>(null);

  // ICE servers configuration
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // Initialize socket connection
  useEffect(() => {
    const socket = io(apiUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      initializeCall();
    });

    socket.on('connect_error', (_err) => {
      setError('Failed to connect to server');
    });

    socket.on('webrtc-offer', handleReceiveOffer);
    socket.on('webrtc-answer', handleReceiveAnswer);
    socket.on('ice-candidate', handleReceiveIceCandidate);
    socket.on('peer-joined', handlePeerJoined);
    socket.on('peer-left', handlePeerLeft);

    return () => {
      cleanup();
    };
  }, []);

  // Get user media
  const getUserMedia = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 1280,
          height: 720,
          frameRate: 30,
          facingMode: 'user',
        },
      });

      setLocalStream(stream);
      return stream;
    } catch (err) {
      setError('Failed to access camera/microphone');
      throw err;
    }
  };

  // Initialize call
  const initializeCall = async () => {
    try {
      setIsConnecting(true);
      const stream = await getUserMedia();

      // Join room
      socketRef.current?.emit(
        'join-room',
        { visitId, role: userRole },
        (response: any) => {
          if (response.error) {
            setError(response.error);
            setIsConnecting(false);
            return;
          }

          roomIdRef.current = response.roomId;
          setIsConnecting(false);
          setIsConnected(true);

          // If there are other peers, initiate connection
          if (response.otherPeers && response.otherPeers.length > 0) {
            const remotePeer = response.otherPeers[0];
            createPeerConnection(remotePeer.socketId, true, stream);
          }
        }
      );
    } catch (err) {
      setIsConnecting(false);
    }
  };

  // Create peer connection
  const createPeerConnection = async (
    remoteSocketId: string,
    initiator: boolean,
    stream: MediaStream
  ) => {
    try {
      const peerConnection = new RTCPeerConnection(iceServers);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      (peerConnection as any).ontrack = (event: any) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      // Handle ICE candidates
      (peerConnection as any).onicecandidate = (event: any) => {
        if (event.candidate) {
          socketRef.current?.emit('ice-candidate', {
            to: remoteSocketId,
            signal: event.candidate,
          });
        }
      };

      // Handle connection state changes
      (peerConnection as any).onconnectionstatechange = () => {
        if (peerConnection.connectionState === 'connected') {
          setIsConnected(true);
        } else if (peerConnection.connectionState === 'disconnected') {
          setIsConnected(false);
        }
      };

      // Create offer if initiator
      if (initiator) {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socketRef.current?.emit('webrtc-offer', {
          to: remoteSocketId,
          signal: offer,
        });
      }
    } catch (err) {
      setError('Failed to establish connection');
    }
  };

  // Handle receiving offer
  const handleReceiveOffer = async ({ from, signal }: any) => {
    try {
      if (!localStream) return;

      const peerConnection = new RTCPeerConnection(iceServers);
      peerConnectionRef.current = peerConnection;

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      (peerConnection as any).ontrack = (event: any) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      (peerConnection as any).onicecandidate = (event: any) => {
        if (event.candidate) {
          socketRef.current?.emit('ice-candidate', {
            to: from,
            signal: event.candidate,
          });
        }
      };

      await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socketRef.current?.emit('webrtc-answer', {
        to: from,
        signal: answer,
      });
    } catch (err) {
      // Offer handling failed
    }
  };

  // Handle receiving answer
  const handleReceiveAnswer = async ({ signal }: any) => {
    try {
      await peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(signal)
      );
    } catch (err) {
      // Answer handling failed
    }
  };

  // Handle receiving ICE candidate
  const handleReceiveIceCandidate = async ({ signal }: any) => {
    try {
      await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(signal));
    } catch (err) {
      // ICE candidate handling failed
    }
  };

  // Handle peer joined
  const handlePeerJoined = ({ peer }: { peer: Peer }) => {
    if (localStream) {
      createPeerConnection(peer.socketId, true, localStream);
    }
  };

  // Handle peer left
  const handlePeerLeft = () => {
    setRemoteStream(null);
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
  };

  // Toggle mute
  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  // End call
  const handleEndCall = () => {
    cleanup();
    onEndCall();
  };

  // Cleanup
  const cleanup = () => {
    if (roomIdRef.current && socketRef.current) {
      socketRef.current.emit('leave-room', { roomId: roomIdRef.current });
    }

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    setRemoteStream(null);

    socketRef.current?.disconnect();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Remote video (full screen) */}
      <View style={styles.remoteVideoContainer}>
        {remoteStream ? (
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.remoteVideo}
            objectFit="cover"
            mirror={false}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            {isConnecting ? (
              <>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.placeholderText}>Connecting...</Text>
              </>
            ) : (
              <Text style={styles.placeholderText}>
                Waiting for {userRole === 'doctor' ? 'patient' : 'doctor'}...
              </Text>
            )}
          </View>
        )}

        {/* Connection status */}
        {isConnected && (
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Connected</Text>
          </View>
        )}
      </View>

      {/* Local video (picture-in-picture) */}
      <View style={styles.localVideoContainer}>
        {localStream && !isVideoOff ? (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
            mirror={true}
          />
        ) : (
          <View style={styles.localVideoPlaceholder}>
            <Text style={styles.localVideoPlaceholderText}>Camera off</Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={toggleMute}
        >
          <Text style={styles.controlButtonText}>{isMuted ? '🔇' : '🎤'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
          onPress={toggleVideo}
        >
          <Text style={styles.controlButtonText}>{isVideoOff ? '📷' : '📹'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Text style={styles.controlButtonText}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  remoteVideoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  localVideoContainer: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  localVideoPlaceholder: {
    flex: 1,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideoPlaceholderText: {
    color: '#fff',
    fontSize: 12,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4a4a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#ef4444',
  },
  controlButtonText: {
    fontSize: 24,
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
});
