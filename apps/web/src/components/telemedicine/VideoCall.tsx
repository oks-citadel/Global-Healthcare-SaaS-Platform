'use client';

import { useRef, useEffect } from 'react';
import { CallState } from '@/hooks/useVideoCall';

interface VideoCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callState: CallState;
  isVideoOff: boolean;
  remoteUserRole?: 'doctor' | 'patient';
}

export function VideoCall({
  localStream,
  remoteStream,
  callState,
  isVideoOff,
  remoteUserRole,
}: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Set local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Set remote video stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Remote video (main view) */}
      <div className="w-full h-full relative">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <p className="text-gray-300 text-lg font-medium">
                {callState === 'connecting'
                  ? 'Connecting...'
                  : callState === 'connected'
                  ? `Waiting for ${remoteUserRole || 'participant'}...`
                  : 'No one else in call'}
              </p>
              {callState === 'connecting' && (
                <div className="mt-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connection status overlay */}
        {callState === 'connecting' && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            Connecting...
          </div>
        )}

        {callState === 'connected' && remoteStream && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            Connected
          </div>
        )}

        {callState === 'error' && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            Connection Error
          </div>
        )}
      </div>

      {/* Local video (picture-in-picture) */}
      <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-2xl border-2 border-white">
        {localStream && !isVideoOff ? (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-8 h-8 text-gray-400 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
                <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} />
              </svg>
              <p className="text-xs text-gray-400 mt-1">Camera off</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white px-2 py-0.5 rounded text-xs">
          You
        </div>
      </div>
    </div>
  );
}
