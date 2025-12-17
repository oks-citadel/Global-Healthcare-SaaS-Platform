'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useChat } from '@/hooks/useChat';
import {
  VideoCall,
  VideoControls,
  ChatPanel,
  WaitingRoom,
  CallQuality,
} from '@/components/telemedicine';

interface VisitData {
  id: string;
  patientName: string;
  doctorName: string;
  scheduledAt: string;
  status: string;
}

export default function VirtualVisitPage() {
  const params = useParams();
  const router = useRouter();
  const visitId = params.id as string;

  const [visitData, setVisitData] = useState<VisitData | null>(null);
  const [userRole, setUserRole] = useState<'doctor' | 'patient'>('patient');
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [hasJoined, setHasJoined] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showQuality, setShowQuality] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Initialize video call
  const videoCall = useVideoCall({
    visitId,
    role: userRole,
    token,
    apiUrl,
  });

  // Initialize chat
  const chat = useChat({
    roomId: videoCall.roomId,
    token,
    apiUrl,
    userId,
  });

  // Load visit data and user info
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get auth token from storage or context
        const storedToken = localStorage.getItem('auth_token') || '';
        const storedUserId = localStorage.getItem('user_id') || '';
        const storedUserRole =
          (localStorage.getItem('user_role') as 'doctor' | 'patient') || 'patient';

        setToken(storedToken);
        setUserId(storedUserId);
        setUserRole(storedUserRole);

        // Fetch visit data
        const response = await fetch(`${apiUrl}/api/v1/visits/${visitId}`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVisitData(data);
        }
      } catch (error) {
        console.error('Error loading visit data:', error);
      }
    };

    loadData();
  }, [visitId, apiUrl]);

  const handleJoinCall = async () => {
    try {
      await videoCall.joinRoom();
      setHasJoined(true);
    } catch (error) {
      console.error('Error joining call:', error);
    }
  };

  const handleEndCall = async () => {
    try {
      await videoCall.leaveRoom();

      // Update visit status to completed
      if (token) {
        await fetch(`${apiUrl}/api/v1/visits/${visitId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'completed' }),
        });
      }

      // Redirect to visit summary or dashboard
      router.push(`/dashboard/visits/${visitId}/summary`);
    } catch (error) {
      console.error('Error ending call:', error);
      router.push('/dashboard');
    }
  };

  // Show waiting room if not joined yet
  if (!hasJoined) {
    return (
      <WaitingRoom
        onJoin={handleJoinCall}
        isLoading={videoCall.callState === 'connecting'}
        visitInfo={
          visitData
            ? {
                patientName: visitData.patientName,
                doctorName: visitData.doctorName,
                appointmentTime: visitData.scheduledAt,
              }
            : undefined
        }
      />
    );
  }

  // Main call interface
  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Virtual Visit</h1>
          {visitData && (
            <p className="text-sm text-gray-400">
              {userRole === 'doctor'
                ? `Patient: ${visitData.patientName}`
                : `Doctor: ${visitData.doctorName}`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Call quality indicator */}
          <button
            onClick={() => setShowQuality(!showQuality)}
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            Connection Quality
          </button>

          {/* Call duration timer */}
          <div className="text-sm text-gray-400">
            <CallTimer />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video section */}
        <div className="flex-1 relative p-4">
          <VideoCall
            localStream={videoCall.localStream}
            remoteStream={videoCall.remoteStream}
            callState={videoCall.callState}
            isVideoOff={videoCall.isVideoOff}
            remoteUserRole={userRole === 'doctor' ? 'patient' : 'doctor'}
          />

          {/* Video controls overlay */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <VideoControls
              isMuted={videoCall.isMuted}
              isVideoOff={videoCall.isVideoOff}
              onToggleMute={videoCall.toggleMute}
              onToggleVideo={videoCall.toggleVideo}
              onEndCall={handleEndCall}
              onToggleChat={() => setShowChat(!showChat)}
              showChatToggle={true}
            />
          </div>

          {/* Call quality overlay */}
          {showQuality && (
            <div className="absolute top-4 right-4">
              <CallQuality quality={videoCall.connectionQuality} />
            </div>
          )}

          {/* Error message */}
          {videoCall.error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg">
              {videoCall.error}
            </div>
          )}
        </div>

        {/* Chat panel */}
        {showChat && (
          <div className="w-96 border-l border-gray-700">
            <ChatPanel
              messages={chat.messages}
              typingUsers={chat.typingUsers}
              currentUserId={userId}
              currentUserRole={userRole}
              onSendMessage={chat.sendMessage}
              onStartTyping={chat.startTyping}
              onStopTyping={chat.stopTyping}
              onClose={() => setShowChat(false)}
            />
          </div>
        )}
      </div>

      {/* Footer with additional info */}
      <div className="bg-gray-800 text-gray-400 px-6 py-2 text-xs flex items-center justify-between">
        <div>
          {videoCall.peers.length > 0 ? (
            <span>
              {videoCall.peers.length} other participant{videoCall.peers.length > 1 ? 's' : ''}{' '}
              in call
            </span>
          ) : (
            <span>Waiting for others to join...</span>
          )}
        </div>
        <div>Room ID: {videoCall.roomId?.slice(0, 8)}...</div>
      </div>
    </div>
  );
}

// Simple timer component
function CallTimer() {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <span>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}
