# Telemedicine Video/Chat Implementation

## Overview

This document describes the complete telemedicine implementation for virtual visits using WebRTC and Socket.io. The implementation provides real-time video calling and chat functionality for both web and mobile platforms.

## Architecture

### Backend (API Service)

#### 1. Socket.io Setup (`services/api/src/lib/socket.ts`)
- WebSocket server initialization with authentication middleware
- JWT token validation for secure connections
- Room management helpers for joining/leaving rooms
- User-specific and room-specific event emitters

#### 2. WebRTC Service (`services/api/src/services/webrtc.service.ts`)
- Peer-to-peer connection management
- Room creation and lifecycle management
- WebRTC signaling (offer/answer/ICE candidate exchange)
- Connection quality monitoring
- Automatic cleanup of inactive rooms

#### 3. Realtime Controller (`services/api/src/controllers/realtime.controller.ts`)
- Socket event handlers for video calls
- Chat message handling
- Typing indicators
- Call quality reporting
- Peer join/leave notifications

#### 4. Server Integration (`services/api/src/index.ts`)
- HTTP server creation with Socket.io attachment
- Graceful shutdown handling
- WebSocket endpoint exposure

### Frontend (Web Application)

#### 1. Video Call Hook (`apps/web/src/hooks/useVideoCall.ts`)
- WebRTC peer connection management using SimplePeer
- Local and remote media stream handling
- Connection state management
- Audio/video controls (mute/unmute, camera on/off)
- Connection quality monitoring with stats collection
- Automatic reconnection handling

#### 2. Chat Hook (`apps/web/src/hooks/useChat.ts`)
- Socket.io client for real-time messaging
- Message history management
- Typing indicators
- Connection state tracking

#### 3. UI Components (`apps/web/src/components/telemedicine/`)

**VideoCall.tsx**
- Main video display component
- Picture-in-picture layout for local video
- Connection status indicators
- Placeholder views when video is off

**VideoControls.tsx**
- Mute/unmute microphone button
- Camera on/off toggle
- End call button
- Chat panel toggle

**ChatPanel.tsx**
- Message list with auto-scroll
- Message input with typing indicators
- Timestamp formatting
- Role-based message styling

**WaitingRoom.tsx**
- Pre-call device testing
- Camera/microphone preview
- Permission checks
- Visit information display
- Join call button

**CallQuality.tsx**
- Real-time connection quality display
- Bitrate, packet loss, jitter metrics
- Quality score calculation
- Visual quality indicators

#### 4. Virtual Visit Page (`apps/web/src/app/(dashboard)/visit/[id]/page.tsx`)
- Complete video consultation interface
- Integration of all components
- Visit data management
- Call duration tracking
- End-of-call workflow

### Mobile Application (React Native)

#### 1. Video Call Screen (`apps/mobile/src/components/telemedicine/VideoCallScreen.tsx`)
- React Native WebRTC integration
- Native media device access
- Full-screen video layout
- Mobile-optimized controls
- Connection state management

#### 2. Chat Screen (`apps/mobile/src/components/telemedicine/ChatScreen.tsx`)
- Mobile chat interface
- Keyboard-aware layout
- Native scroll behavior
- Touch-optimized UI

## Dependencies

### Backend
```json
{
  "socket.io": "^4.6.1",
  "mediasoup": "^3.13.8",
  "mediasoup-client": "^3.7.0"
}
```

### Web Frontend
```json
{
  "socket.io-client": "^4.6.1",
  "simple-peer": "^9.11.1",
  "lucide-react": "^0.300.0"
}
```

### Mobile
```json
{
  "socket.io-client": "^4.6.1",
  "react-native-webrtc": "^118.0.0"
}
```

## Features

### Video Call Features
- ✅ HD video quality (720p/1080p)
- ✅ Echo cancellation and noise suppression
- ✅ Automatic gain control
- ✅ Picture-in-picture local video
- ✅ Camera on/off toggle
- ✅ Microphone mute/unmute
- ✅ Connection quality monitoring
- ✅ Automatic reconnection
- ✅ Graceful disconnect handling

### Chat Features
- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Message timestamps
- ✅ Role-based message styling
- ✅ Auto-scroll to latest message
- ✅ Message delivery confirmation

### Security
- ✅ JWT authentication for WebSocket connections
- ✅ Room-based isolation
- ✅ Encrypted signaling
- ✅ STUN/TURN server support for NAT traversal

## Usage

### Starting a Video Visit (Web)

```typescript
// Navigate to visit page
router.push(`/dashboard/visit/${visitId}`);

// The page will:
// 1. Load visit information
// 2. Show waiting room with device preview
// 3. Request camera/microphone permissions
// 4. Join call on button click
```

### Using Video Controls

```typescript
const {
  localStream,
  remoteStream,
  isMuted,
  isVideoOff,
  toggleMute,
  toggleVideo,
  leaveRoom,
} = useVideoCall(config);

// Toggle microphone
<button onClick={toggleMute}>
  {isMuted ? 'Unmute' : 'Mute'}
</button>

// Toggle camera
<button onClick={toggleVideo}>
  {isVideoOff ? 'Camera On' : 'Camera Off'}
</button>

// End call
<button onClick={leaveRoom}>
  End Call
</button>
```

### Sending Chat Messages

```typescript
const { messages, sendMessage, startTyping, stopTyping } = useChat(config);

// Send a message
sendMessage('Hello, doctor!');

// Show typing indicator
<input
  onChange={(e) => {
    if (e.target.value) startTyping();
    else stopTyping();
  }}
/>
```

## Configuration

### Environment Variables

```env
# API URL for WebSocket connections
NEXT_PUBLIC_API_URL=http://localhost:4000

# STUN/TURN servers (optional)
WEBRTC_STUN_SERVER=stun:stun.l.google.com:19302
WEBRTC_TURN_SERVER=turn:your-turn-server.com:3478
WEBRTC_TURN_USERNAME=username
WEBRTC_TURN_PASSWORD=password
```

### WebRTC Configuration

The default configuration uses Google's public STUN servers:

```typescript
const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];
```

For production, consider adding TURN servers for better NAT traversal:

```typescript
const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  {
    urls: 'turn:your-turn-server.com:3478',
    username: 'username',
    credential: 'password'
  },
];
```

## API Endpoints

### Socket Events

#### Client to Server

**join-room**
```typescript
socket.emit('join-room', {
  visitId: string,
  role: 'doctor' | 'patient'
}, (response) => {
  // response: { roomId, peerId, otherPeers }
});
```

**leave-room**
```typescript
socket.emit('leave-room', {
  roomId: string
});
```

**webrtc-offer**
```typescript
socket.emit('webrtc-offer', {
  to: socketId,
  signal: RTCSessionDescription
});
```

**webrtc-answer**
```typescript
socket.emit('webrtc-answer', {
  to: socketId,
  signal: RTCSessionDescription
});
```

**ice-candidate**
```typescript
socket.emit('ice-candidate', {
  to: socketId,
  signal: RTCIceCandidate
});
```

**chat-message**
```typescript
socket.emit('chat-message', {
  roomId: string,
  message: string,
  timestamp: string
});
```

**typing**
```typescript
socket.emit('typing', {
  roomId: string,
  isTyping: boolean
});
```

#### Server to Client

**peer-joined**
```typescript
socket.on('peer-joined', ({ peer }) => {
  // peer: { id, userId, socketId, role }
});
```

**peer-left**
```typescript
socket.on('peer-left', ({ peerId, userId }) => {
  // Handle peer disconnection
});
```

**chat-message**
```typescript
socket.on('chat-message', (message) => {
  // message: { id, roomId, userId, role, message, timestamp }
});
```

**typing**
```typescript
socket.on('typing', ({ userId, role, isTyping }) => {
  // Show/hide typing indicator
});
```

## Testing

### Local Testing

1. Start the API server:
```bash
cd services/api
npm run dev
```

2. Start the web app:
```bash
cd apps/web
npm run dev
```

3. Open two browser windows:
   - Window 1: Doctor login and navigate to visit
   - Window 2: Patient login and navigate to same visit
   - Both should connect via WebRTC

### Mobile Testing

1. Start Expo development server:
```bash
cd apps/mobile
npm run dev
```

2. Scan QR code with Expo Go app
3. Navigate to virtual visit screen

## Troubleshooting

### Common Issues

**1. Camera/Microphone Access Denied**
- Check browser permissions
- Ensure HTTPS in production (required for getUserMedia)
- Check device availability

**2. Connection Failed**
- Verify Socket.io server is running
- Check CORS configuration
- Ensure JWT token is valid
- Check network connectivity

**3. No Video/Audio**
- Check WebRTC peer connection state
- Verify ICE candidates are exchanged
- Check NAT/firewall settings
- Consider adding TURN server

**4. Poor Video Quality**
- Check network bandwidth
- Monitor connection quality metrics
- Reduce video resolution if needed
- Check CPU usage

### Debug Logging

Enable debug logging in the browser console:

```javascript
localStorage.setItem('debug', 'socket.io-client:*,simple-peer:*');
```

## Performance Optimization

### Video Quality Settings

Adjust based on network conditions:

```typescript
// High quality (default)
video: {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  frameRate: { ideal: 30 }
}

// Low bandwidth
video: {
  width: { ideal: 640 },
  height: { ideal: 480 },
  frameRate: { ideal: 15 }
}
```

### Connection Quality Monitoring

The implementation includes automatic quality monitoring:
- Bitrate tracking
- Packet loss detection
- Jitter measurement
- Latency calculation

Quality reports are sent every 5 seconds and can be used to:
- Warn users of poor connection
- Automatically adjust video quality
- Collect analytics data

## Security Considerations

1. **Authentication**: All WebSocket connections require valid JWT tokens
2. **Room Isolation**: Users can only join rooms for their visits
3. **Data Privacy**: Video/audio streams use peer-to-peer encryption
4. **HIPAA Compliance**: Consider adding end-to-end encryption for chat messages
5. **Session Management**: Rooms are automatically cleaned up after inactivity

## Future Enhancements

- [ ] Screen sharing capability
- [ ] Recording functionality (with consent)
- [ ] Multi-party video calls (3+ participants)
- [ ] Virtual background support
- [ ] Whiteboard/annotation tools
- [ ] File sharing during calls
- [ ] Call scheduling and reminders
- [ ] Post-call summary generation
- [ ] Integration with EHR systems
- [ ] Bandwidth adaptation (dynamic quality)
- [ ] SFU architecture using Mediasoup for scalability

## License

This implementation is part of the Unified Health Platform project.
