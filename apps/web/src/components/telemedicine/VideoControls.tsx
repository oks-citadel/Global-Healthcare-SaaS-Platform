'use client';

import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare } from 'lucide-react';

interface VideoControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleChat?: () => void;
  showChatToggle?: boolean;
}

export function VideoControls({
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onToggleChat,
  showChatToggle = true,
}: VideoControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-gray-800 bg-opacity-90 rounded-lg">
      {/* Mute/Unmute button */}
      <button
        onClick={onToggleMute}
        className={`p-4 rounded-full transition-all ${
          isMuted
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Video on/off button */}
      <button
        onClick={onToggleVideo}
        className={`p-4 rounded-full transition-all ${
          isVideoOff
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
        title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
      >
        {isVideoOff ? (
          <VideoOff className="w-6 h-6 text-white" />
        ) : (
          <Video className="w-6 h-6 text-white" />
        )}
      </button>

      {/* End call button */}
      <button
        onClick={onEndCall}
        className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
        title="End call"
      >
        <PhoneOff className="w-6 h-6 text-white" />
      </button>

      {/* Chat toggle button */}
      {showChatToggle && onToggleChat && (
        <button
          onClick={onToggleChat}
          className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
          title="Toggle chat"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}
