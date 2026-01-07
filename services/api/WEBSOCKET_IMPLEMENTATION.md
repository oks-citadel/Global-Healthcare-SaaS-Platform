# WebSocket/Socket.io Server Implementation

## Overview

Complete real-time messaging infrastructure for the Unified Health Platform with production-ready features including authentication, room management, presence tracking, message persistence, and horizontal scaling support.

## Features

### Core Features
- ✅ JWT Authentication middleware for secure connections
- ✅ Room management (patient-provider chats, video calls, notifications)
- ✅ Real-time messaging with database persistence
- ✅ Video/audio call signaling (WebRTC)
- ✅ Real-time notifications
- ✅ Presence tracking (online/offline/away/busy)
- ✅ Redis adapter for horizontal scaling
- ✅ Reconnection handling
- ✅ Connection health monitoring
- ✅ Typing indicators
- ✅ Message read receipts
- ✅ Call quality monitoring

## Architecture

### File Structure

```
services/api/src/lib/
├── websocket.ts                      # Main WebSocket server
├── websocket-room-manager.ts         # Room management logic
├── websocket-presence.ts             # Presence tracking
├── websocket-message-handler.ts      # Message handling & persistence
├── websocket-call-handler.ts         # Video/audio call management
└── websocket-notification-handler.ts # Real-time notifications
```

### Components

#### 1. Main WebSocket Server (`websocket.ts`)
- Initializes Socket.io server
- Sets up Redis adapter for scaling
- Manages authentication middleware
- Coordinates all event handlers
- Monitors connection health

#### 2. Room Manager (`websocket-room-manager.ts`)
- Manages chat rooms, video call rooms, notification rooms
- Validates room access based on user roles
- Tracks room participants
- Handles join/leave operations

#### 3. Presence Manager (`websocket-presence.ts`)
- Tracks user online/offline status
- Manages custom status (away, busy, in_call)
- Handles presence subscriptions
- Uses Redis for distributed presence tracking

#### 4. Message Handler (`websocket-message-handler.ts`)
- Processes message sending/receiving
- Persists messages to database
- Handles typing indicators
- Manages message read receipts
- Fetches message history

#### 5. Call Handler (`websocket-call-handler.ts`)
- Manages video/audio call lifecycle
- Handles WebRTC signaling (offer/answer/ICE)
- Tracks active calls
- Monitors call quality metrics
- Handles call timeouts and missed calls

#### 6. Notification Handler (`websocket-notification-handler.ts`)
- Sends real-time notifications
- Manages notification topics/subscriptions
- Tracks read/unread status
- Supports notification priorities

## Installation

### 1. Install Dependencies

```bash
cd services/api
npm install @socket.io/redis-adapter
```

The following packages should already be installed:
- `socket.io` (v4.6.1 or higher)
- `ioredis` (v5.3.2 or higher)
- `jsonwebtoken` (v9.0.2 or higher)

### 2. Environment Configuration

Add to `.env` file:

```env
# Redis Configuration (for WebSocket scaling)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 3. Update Server Initialization

The WebSocket server is automatically initialized in `src/index.ts` when the HTTP server starts.

## Usage

### Server-Side

#### Initialize WebSocket Server

```typescript
import { initializeWebSocket } from './lib/websocket.js';

// Initialize with Redis adapter for scaling
const io = await initializeWebSocket(httpServer, true);

// Or without Redis adapter (single server)
const io = await initializeWebSocket(httpServer, false);
```

#### Send Notifications

```typescript
import { emitToUser } from './lib/websocket.js';

// Send notification to specific user
emitToUser(userId, 'notification:new', {
  id: 'notif-123',
  type: 'appointment_reminder',
  title: 'Upcoming Appointment',
  message: 'Your appointment is in 30 minutes',
  timestamp: new Date().toISOString(),
});
```

#### Broadcast to Room

```typescript
import { emitToRoom } from './lib/websocket.js';

// Broadcast message to all users in room
emitToRoom('chat:123', 'message:new', {
  id: 'msg-456',
  senderId: 'user-789',
  message: 'Hello everyone!',
  timestamp: new Date().toISOString(),
});
```

### Client-Side

#### Connect to WebSocket Server

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  auth: {
    token: 'your-jwt-token',
  },
  transports: ['websocket', 'polling'],
});

socket.on('connected', (data) => {
  console.log('Connected:', data);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});
```

#### Join Room

```typescript
socket.emit('room:join', {
  roomId: 'chat:user1:user2',
  roomType: 'chat',
  metadata: {
    visitId: 'visit-123',
  },
}, (response) => {
  if (response.success) {
    console.log('Joined room:', response.roomId);
    console.log('Participants:', response.participants);
  }
});
```

#### Send Message

```typescript
socket.emit('message:send', {
  visitId: 'visit-123',
  message: 'Hello, doctor!',
  attachments: [],
}, (response) => {
  if (response.success) {
    console.log('Message sent:', response.message);
  }
});
```

#### Listen for Messages

```typescript
socket.on('message:new', (data) => {
  console.log('New message:', data);
  // {
  //   id: 'msg-123',
  //   senderId: 'user-456',
  //   message: 'Hello!',
  //   timestamp: '2024-01-15T10:30:00Z',
  //   ...
  // }
});
```

#### Typing Indicators

```typescript
// Start typing
socket.emit('typing:start', {
  roomId: 'chat:user1:user2',
});

// Stop typing
socket.emit('typing:stop', {
  roomId: 'chat:user1:user2',
});

// Listen for typing
socket.on('typing:start', (data) => {
  console.log(`${data.userId} is typing...`);
});

socket.on('typing:stop', (data) => {
  console.log(`${data.userId} stopped typing`);
});
```

#### Video/Audio Calls

```typescript
// Initiate call
socket.emit('call:initiate', {
  recipientId: 'user-789',
  visitId: 'visit-123',
  callType: 'video',
}, (response) => {
  if (response.success) {
    const callId = response.callId;
    // Start WebRTC connection
  }
});

// Listen for incoming call
socket.on('call:incoming', (data) => {
  console.log('Incoming call from:', data.callerId);
  // Show call UI
});

// Accept call
socket.emit('call:accept', {
  callId: 'call-123',
}, (response) => {
  if (response.success) {
    // Start WebRTC connection
  }
});

// Reject call
socket.emit('call:reject', {
  callId: 'call-123',
  reason: 'busy',
});

// End call
socket.emit('call:end', {
  callId: 'call-123',
  duration: 300, // seconds
});

// WebRTC signaling
socket.emit('call:signal', {
  callId: 'call-123',
  recipientId: 'user-789',
  signal: offerSdp,
  signalType: 'offer',
});

socket.on('call:signal', (data) => {
  // Handle WebRTC signal
  const { signal, signalType } = data;
  // Process offer/answer/ICE candidate
});
```

#### Presence Tracking

```typescript
// Get user presence
socket.emit('presence:get', {
  userIds: ['user-1', 'user-2', 'user-3'],
}, (response) => {
  if (response.success) {
    response.presences.forEach((presence) => {
      console.log(`${presence.userId}: ${presence.status}`);
    });
  }
});

// Set custom status
socket.emit('presence:setStatus', {
  status: 'busy',
  customStatus: 'In a meeting',
});

// Subscribe to presence updates
socket.emit('presence:subscribe', {
  userIds: ['user-1', 'user-2'],
});

// Listen for presence changes
socket.on('presence:changed', (data) => {
  console.log(`${data.userId} is now ${data.status}`);
});
```

#### Notifications

```typescript
// Listen for notifications
socket.on('notification:new', (data) => {
  console.log('New notification:', data);
  // Show notification UI
});

// Mark as read
socket.emit('notification:read', {
  notificationId: 'notif-123',
}, (response) => {
  if (response.success) {
    console.log('Notification marked as read');
  }
});

// Mark all as read
socket.emit('notification:readAll', (response) => {
  console.log(`Marked ${response.markedCount} notifications as read`);
});

// Get unread count
socket.emit('notification:getUnreadCount', (response) => {
  console.log(`Unread notifications: ${response.unreadCount}`);
});

// Subscribe to topics
socket.emit('notification:subscribe', {
  topics: ['appointments', 'messages'],
});
```

## Events Reference

### Client → Server Events

#### Room Management
- `room:join` - Join a room
- `room:leave` - Leave a room
- `room:participants` - Get room participants

#### Messaging
- `message:send` - Send a message
- `message:received` - Acknowledge message receipt
- `message:read` - Mark messages as read
- `message:history` - Get message history
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

#### Calls
- `call:initiate` - Start a call
- `call:accept` - Accept incoming call
- `call:reject` - Reject incoming call
- `call:end` - End active call
- `call:signal` - WebRTC signaling
- `call:quality` - Send quality metrics

#### Presence
- `presence:get` - Get user presence
- `presence:setStatus` - Set custom status
- `presence:subscribe` - Subscribe to presence updates

#### Notifications
- `notification:read` - Mark notification as read
- `notification:readAll` - Mark all as read
- `notification:getUnreadCount` - Get unread count
- `notification:subscribe` - Subscribe to topics
- `notification:unsubscribe` - Unsubscribe from topics

### Server → Client Events

#### Connection
- `connected` - Connection established
- `server:shutdown` - Server shutting down

#### Room Events
- `room:userJoined` - User joined room
- `room:userLeft` - User left room

#### Messaging
- `message:new` - New message received
- `message:sent` - Message sent confirmation
- `message:delivered` - Message delivered
- `message:read` - Message read
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

#### Calls
- `call:incoming` - Incoming call
- `call:accepted` - Call accepted
- `call:rejected` - Call rejected
- `call:ended` - Call ended
- `call:missed` - Call missed
- `call:signal` - WebRTC signal
- `call:qualityIssue` - Quality issue detected

#### Presence
- `presence:initial` - Initial presence data
- `presence:changed` - Presence changed
- `presence:statusUpdated` - Status updated

#### Notifications
- `notification:new` - New notification
- `notification:subscribed` - Subscribed to topics
- `notification:unsubscribed` - Unsubscribed from topics

## Room Types

### Chat Rooms
Format: `chat:userId1:userId2` (sorted user IDs)

Used for direct patient-provider messaging.

### Video Call Rooms
Format: `call:visitId`

Used for telemedicine video calls.

### Visit Rooms
Format: `visit:visitId`

Used for all communications within a visit (messages and calls).

### Notification Rooms
Format: `notifications:userId`

Personal notification channel for each user.

### Topic Rooms
Format: `topic:topicName`

Broadcast channels for specific notification topics.

## Presence Status

- `online` - User is active and available
- `offline` - User is disconnected
- `away` - User is idle
- `busy` - User is in a meeting/call
- `in_call` - User is currently in a call

## Security

### Authentication
- All connections require valid JWT token
- Token is verified on connection and contains userId and role
- Unauthorized connections are rejected immediately

### Authorization
- Room access is validated based on user role and relationship
- Patients can only access their own data
- Providers can only access their patient data
- Admins have access to all resources

### Rate Limiting
- Connection attempts are rate-limited
- Message sending is rate-limited per user
- Call initiation is rate-limited

## Horizontal Scaling

### Redis Adapter
The Redis adapter enables multiple Socket.io servers to work together:

1. All servers connect to same Redis instance
2. Messages are published to Redis pub/sub
3. All servers receive and emit events to their clients
4. Presence data is shared via Redis

### Load Balancing
Configure sticky sessions in your load balancer:

**Nginx Example:**
```nginx
upstream socket_servers {
    ip_hash;  # Sticky sessions
    server 10.0.1.1:8080;
    server 10.0.1.2:8080;
    server 10.0.1.3:8080;
}

server {
    location /socket.io/ {
        proxy_pass http://socket_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

## Monitoring

### Connection Stats
```typescript
import { getConnectionStats } from './lib/websocket.js';

const stats = getConnectionStats();
console.log('Active connections:', stats.totalConnections);
```

### Health Check
```typescript
import { isUserConnected } from './lib/websocket.js';

const connected = await isUserConnected('user-123');
console.log('User online:', connected);
```

### Metrics
- Total active connections
- Connections by user role
- Active rooms by type
- Active calls
- Message throughput
- Presence tracking stats

## Error Handling

### Connection Errors
- Invalid token: `Authentication error: Invalid token`
- Expired token: `Authentication error: Token expired`
- No token: `Authentication error: No token provided`

### Room Errors
- Access denied: `Access denied to this room`
- Room not found: `Room not found`

### Message Errors
- Invalid input: `Message content is required`
- Unauthorized: `Access denied to this conversation`

### Call Errors
- Call not found: `Call not found`
- Already in call: `Cannot accept call in X state`

## Troubleshooting

### Connection Issues
1. Verify JWT token is valid and not expired
2. Check CORS configuration matches client origin
3. Ensure WebSocket transport is allowed by firewall
4. Check Redis connection if using adapter

### Message Delivery Issues
1. Verify user is in correct room
2. Check room access permissions
3. Verify recipient is online
4. Check database persistence

### Presence Issues
1. Ensure Redis is running
2. Check presence TTL settings
3. Verify presence updates are emitted

## Performance Optimization

### Best Practices
1. Use rooms for targeted messaging instead of broadcasting
2. Implement message pagination for history
3. Batch presence updates
4. Use Redis for distributed state
5. Monitor connection count and set limits
6. Implement reconnection backoff on client

### Database Optimization
- Index `visitId` and `timestamp` on ChatMessage table
- Archive old messages regularly
- Use connection pooling for Prisma

## Testing

### Unit Tests
```bash
npm run test:unit
```

### Integration Tests
```bash
npm run test:integration
```

### Load Testing
Use tools like Artillery or k6 to test WebSocket performance:

```yaml
# artillery-websocket-test.yml
config:
  target: "ws://localhost:8080"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - engine: socketio
    flow:
      - emit:
          channel: "message:send"
          data:
            message: "Test message"
```

## Future Enhancements

- [ ] Message encryption (E2E)
- [ ] File sharing via WebSocket
- [ ] Screen sharing signaling
- [ ] Group video calls
- [ ] Voice messages
- [ ] Message reactions/emojis
- [ ] Message threading
- [ ] Delivery reports
- [ ] Push notification fallback
- [ ] Offline message queue

## Support

For issues or questions:
1. Check the logs in `logs/` directory
2. Review error messages in browser console
3. Check Redis connection status
4. Verify database connectivity

## License

Internal use only - Unified Health Platform
