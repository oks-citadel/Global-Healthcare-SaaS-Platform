# WebSocket Quick Reference

## 🚀 Installation (One-Time Setup)

```bash
cd services/api
npm install
```

## ⚙️ Configuration

Add to `.env`:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

## 🏃 Start Server

```bash
# Start Redis (Docker)
docker run -d --name redis -p 6379:6379 redis:7-alpine

# Start API
npm run dev
```

## 📡 Client Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  auth: { token: 'your-jwt-token' },
  transports: ['websocket', 'polling']
});

socket.on('connected', (data) => {
  console.log('Connected:', data.socketId);
});
```

## 💬 Send Message

```javascript
socket.emit('message:send', {
  visitId: 'visit-123',
  message: 'Hello, doctor!'
}, (response) => {
  console.log('Message ID:', response.message.id);
});

// Listen for messages
socket.on('message:new', (data) => {
  console.log('New message:', data.message);
});
```

## 🚪 Join Room

```javascript
socket.emit('room:join', {
  roomId: 'chat:user1:user2',
  roomType: 'chat',
  metadata: { visitId: 'visit-123' }
}, (response) => {
  console.log('Joined room:', response.roomId);
  console.log('Participants:', response.participants);
});
```

## 📞 Video Call

```javascript
// Initiate call
socket.emit('call:initiate', {
  recipientId: 'user-456',
  callType: 'video',
  visitId: 'visit-123'
}, (response) => {
  const callId = response.callId;
});

// Listen for incoming call
socket.on('call:incoming', (data) => {
  const { callId, callerId, callType } = data;
  // Show call UI
});

// Accept call
socket.emit('call:accept', { callId }, (response) => {
  // Start WebRTC connection
});

// End call
socket.emit('call:end', { callId });
```

## 👤 Presence

```javascript
// Get user presence
socket.emit('presence:get', {
  userIds: ['user-1', 'user-2']
}, (response) => {
  response.presences.forEach(p => {
    console.log(`${p.userId}: ${p.status}`);
  });
});

// Set status
socket.emit('presence:setStatus', {
  status: 'busy',
  customStatus: 'In a meeting'
});

// Listen for presence changes
socket.on('presence:changed', (data) => {
  console.log(`${data.userId} is now ${data.status}`);
});
```

## 🔔 Notifications

```javascript
// Listen for notifications
socket.on('notification:new', (data) => {
  console.log('Notification:', data.title, data.message);
});

// Mark as read
socket.emit('notification:read', {
  notificationId: 'notif-123'
});

// Get unread count
socket.emit('notification:getUnreadCount', (response) => {
  console.log('Unread:', response.unreadCount);
});
```

## ⌨️ Typing Indicators

```javascript
// Start typing
socket.emit('typing:start', { roomId: 'chat:user1:user2' });

// Stop typing
socket.emit('typing:stop', { roomId: 'chat:user1:user2' });

// Listen for typing
socket.on('typing:start', (data) => {
  console.log(`${data.userId} is typing...`);
});
```

## 🔍 Common Events

### Client → Server
| Event | Purpose | Callback |
|-------|---------|----------|
| `room:join` | Join chat/call room | Yes |
| `room:leave` | Leave room | Yes |
| `message:send` | Send message | Yes |
| `message:history` | Get conversation | Yes |
| `typing:start` | Show typing | No |
| `typing:stop` | Hide typing | No |
| `call:initiate` | Start call | Yes |
| `call:accept` | Accept call | Yes |
| `call:reject` | Reject call | Yes |
| `call:end` | End call | Yes |
| `presence:get` | Get status | Yes |
| `presence:setStatus` | Set status | No |
| `notification:read` | Mark read | Yes |

### Server → Client
| Event | Purpose | Data |
|-------|---------|------|
| `connected` | Connection success | socketId, userId |
| `message:new` | New message | message object |
| `message:sent` | Send confirmation | message object |
| `typing:start` | User typing | userId, role |
| `call:incoming` | Incoming call | callId, callerId |
| `call:accepted` | Call accepted | callId |
| `call:ended` | Call ended | callId, duration |
| `presence:changed` | Status changed | userId, status |
| `notification:new` | New notification | title, message |
| `room:userJoined` | User joined | userId, role |

## 🛠️ Utility Functions

```javascript
// Check if connected
console.log('Connected:', socket.connected);

// Get socket ID
console.log('Socket ID:', socket.id);

// Disconnect
socket.close();

// Reconnect
socket.connect();

// Error handling
socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

## 📊 Server-Side Usage

```typescript
import { emitToUser, emitToRoom, broadcast } from './lib/websocket.js';

// Send to specific user
emitToUser('user-123', 'notification:new', {
  title: 'New Message',
  message: 'You have a new message'
});

// Send to room
emitToRoom('chat:user1:user2', 'message:new', {
  id: 'msg-123',
  senderId: 'user-1',
  message: 'Hello!'
});

// Broadcast to all
broadcast('system:maintenance', {
  message: 'Scheduled maintenance in 10 minutes'
});
```

## 🔧 Room ID Formats

```javascript
// Chat rooms (sorted user IDs)
'chat:user1:user2'

// Video call rooms
'call:visit-123'

// Visit rooms (all communications)
'visit:visit-123'

// Notification channels
'notifications:user-123'

// Topic rooms
'topic:appointments'
```

## 🔐 Authentication

```javascript
// Get JWT token first
const response = await fetch('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();

// Use token for WebSocket connection
const socket = io('http://localhost:8080', {
  auth: { token }
});
```

## 📝 Message Format

```javascript
{
  id: 'msg-123',
  senderId: 'user-456',
  recipientId: 'user-789',  // optional
  visitId: 'visit-123',      // optional
  message: 'Hello!',
  attachments: [],           // optional
  timestamp: '2024-01-15T10:30:00Z',
  status: 'sent',            // sent, delivered, read
  metadata: {}               // optional
}
```

## 🎯 Call States

```javascript
'initiating'   // Call being set up
'ringing'      // Ringing on recipient side
'accepted'     // Recipient accepted
'in_progress'  // Call active
'ended'        // Call finished
'rejected'     // Recipient declined
'missed'       // Not answered (30s timeout)
'failed'       // Technical failure
```

## 👥 Presence Status

```javascript
'online'   // Active and available
'offline'  // Disconnected
'away'     // Idle/inactive
'busy'     // Do not disturb
'in_call'  // Currently in a call
```

## 🔥 Common Patterns

### 1. Request-Response Pattern
```javascript
socket.emit('event:name', data, (response) => {
  if (response.success) {
    // Handle success
  } else {
    // Handle error
  }
});
```

### 2. Subscribe Pattern
```javascript
// Subscribe
socket.emit('presence:subscribe', {
  userIds: ['user-1', 'user-2']
});

// Listen for updates
socket.on('presence:changed', (data) => {
  // Update UI
});
```

### 3. Room-Based Pattern
```javascript
// Join room
socket.emit('room:join', { roomId, roomType });

// Send to room
socket.emit('message:send', { roomId, message });

// Leave room
socket.emit('room:leave', { roomId });
```

## 🚨 Error Handling

```javascript
// Connection errors
socket.on('connect_error', (error) => {
  if (error.message === 'Authentication error: Invalid token') {
    // Refresh token or redirect to login
  } else if (error.message === 'Authentication error: Token expired') {
    // Refresh token
  }
});

// Event errors (via callback)
socket.emit('message:send', data, (response) => {
  if (!response.success) {
    console.error('Error:', response.error);
    // Handle specific error
  }
});
```

## 📦 Files Reference

| File | Purpose |
|------|---------|
| `src/lib/websocket.ts` | Main server |
| `src/lib/websocket-room-manager.ts` | Rooms |
| `src/lib/websocket-presence.ts` | Presence |
| `src/lib/websocket-message-handler.ts` | Messages |
| `src/lib/websocket-call-handler.ts` | Calls |
| `src/lib/websocket-notification-handler.ts` | Notifications |
| `WEBSOCKET_IMPLEMENTATION.md` | Full docs |
| `WEBSOCKET_SETUP.md` | Setup guide |
| `examples/websocket-client-example.html` | Test client |

## 🧪 Testing

```bash
# Open test client in browser
open examples/websocket-client-example.html

# Or use curl to get token
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"password123"}'
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Check server is running on port 8080 |
| Invalid token | Get new token from /api/v1/auth/login |
| Token expired | Refresh token or login again |
| Redis error | Ensure Redis is running or disable in .env |
| Room access denied | Verify user has access to visit/appointment |
| Messages not persisting | Check database connection |

## 📚 More Info

- **Full API**: See `WEBSOCKET_IMPLEMENTATION.md`
- **Setup Guide**: See `WEBSOCKET_SETUP.md`
- **Test Client**: See `examples/websocket-client-example.html`
- **Summary**: See `WEBSOCKET_COMPLETION_SUMMARY.md`

---

**Quick Links**
- Logs: `logs/app.log`
- Redis Monitor: `redis-cli monitor`
- Health: `http://localhost:8080/health`
- Docs: `http://localhost:8080/api/docs`
