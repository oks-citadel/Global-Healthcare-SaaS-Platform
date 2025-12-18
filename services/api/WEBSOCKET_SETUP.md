# WebSocket Implementation Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd services/api
npm install
```

This will install the newly added `@socket.io/redis-adapter` package along with all existing dependencies.

### 2. Configure Environment

Add the following to your `.env` file:

```env
# Redis Configuration (Required for horizontal scaling)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration (Already exists, ensure it's set)
JWT_SECRET=your-super-secret-key-change-in-production

# CORS Origins (Already exists, ensure it includes your client URLs)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

### 3. Start Redis (Required for Production Scaling)

**Option A: Using Docker**
```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

**Option B: Local Installation**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download from https://github.com/microsoftarchive/redis/releases
```

**Option C: Skip Redis (Development Only)**
Set `REDIS_HOST=` (empty) in your `.env` file to run without Redis adapter. This is only suitable for single-server development environments.

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

You should see in the logs:
```
Initializing WebSocket server...
Redis adapter enabled for Socket.io horizontal scaling
WebSocket server initialized successfully
```

## Implementation Files

The following files have been created:

### Core Files
1. **`src/lib/websocket.ts`** - Main WebSocket server with authentication and health monitoring
2. **`src/lib/websocket-room-manager.ts`** - Room management for chats, calls, and notifications
3. **`src/lib/websocket-presence.ts`** - Online/offline presence tracking
4. **`src/lib/websocket-message-handler.ts`** - Message handling with database persistence
5. **`src/lib/websocket-call-handler.ts`** - Video/audio call signaling
6. **`src/lib/websocket-notification-handler.ts`** - Real-time notification delivery

### Documentation
- **`WEBSOCKET_IMPLEMENTATION.md`** - Complete API documentation and usage guide
- **`WEBSOCKET_SETUP.md`** - This setup guide

### Modified Files
- **`src/index.ts`** - Updated to use new WebSocket implementation
- **`package.json`** - Added `@socket.io/redis-adapter` dependency

## Features Implemented

✅ **Authentication**
- JWT token validation on connection
- Role-based access control
- Automatic reconnection handling

✅ **Real-Time Messaging**
- Patient-provider chat
- Message persistence to database
- Typing indicators
- Read receipts
- Message history

✅ **Video/Audio Calls**
- Call initiation/acceptance/rejection
- WebRTC signaling (offer/answer/ICE)
- Call quality monitoring
- Missed call detection

✅ **Notifications**
- Real-time push notifications
- Notification topics/subscriptions
- Unread count tracking
- Mark as read functionality

✅ **Presence Tracking**
- Online/offline status
- Custom status (away, busy, in_call)
- Presence subscriptions
- Last seen tracking

✅ **Room Management**
- Patient-provider chat rooms
- Video call rooms
- Notification channels
- Room participant tracking

✅ **Horizontal Scaling**
- Redis adapter for multi-server support
- Shared presence data
- Cross-server messaging

✅ **Production Features**
- Connection health monitoring
- Graceful shutdown
- Error handling
- Logging and metrics
- Stale connection cleanup

## Testing

### Manual Testing

#### 1. Test Connection

Create a simple HTML test client:

```html
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Test</title>
    <script src="https://cdn.socket.io/4.6.0/socket.io.min.js"></script>
</head>
<body>
    <h1>WebSocket Test</h1>
    <div id="status">Disconnected</div>
    <button onclick="connect()">Connect</button>
    <button onclick="sendMessage()">Send Message</button>

    <script>
        let socket;

        function connect() {
            const token = 'YOUR_JWT_TOKEN_HERE'; // Replace with real token

            socket = io('http://localhost:8080', {
                auth: { token },
                transports: ['websocket', 'polling']
            });

            socket.on('connected', (data) => {
                document.getElementById('status').textContent = 'Connected: ' + data.socketId;
                console.log('Connected:', data);
            });

            socket.on('connect_error', (error) => {
                document.getElementById('status').textContent = 'Error: ' + error.message;
                console.error('Connection error:', error);
            });

            socket.on('message:new', (data) => {
                console.log('New message:', data);
            });
        }

        function sendMessage() {
            socket.emit('message:send', {
                visitId: 'test-visit-123',
                message: 'Hello from test client!'
            }, (response) => {
                console.log('Send response:', response);
            });
        }
    </script>
</body>
</html>
```

#### 2. Test with cURL (Token Generation)

First, get a JWT token:

```bash
# Login as patient
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "password123"
  }'

# Copy the "token" from the response
```

#### 3. Monitor Connections

Check active connections:

```bash
# View server logs
tail -f logs/app.log

# Look for these messages:
# - "Socket authenticated successfully"
# - "Client connected"
# - "User joined room"
# - "Message sent successfully"
```

### Automated Testing

Create test files:

**`tests/integration/websocket.test.ts`**

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { io, Socket } from 'socket.io-client';
import { sign } from 'jsonwebtoken';
import { config } from '../../src/config';

describe('WebSocket Integration Tests', () => {
  let clientSocket: Socket;
  const token = sign(
    { userId: 'test-user-123', role: 'patient' },
    config.jwt.secret
  );

  beforeAll((done) => {
    clientSocket = io('http://localhost:8080', {
      auth: { token },
      transports: ['websocket'],
    });
    clientSocket.on('connected', () => done());
  });

  afterAll(() => {
    clientSocket.close();
  });

  it('should connect successfully', (done) => {
    expect(clientSocket.connected).toBe(true);
    done();
  });

  it('should send and receive messages', (done) => {
    clientSocket.on('message:sent', (data) => {
      expect(data.message).toBe('Test message');
      done();
    });

    clientSocket.emit('message:send', {
      visitId: 'test-visit',
      message: 'Test message',
    });
  });

  it('should join rooms', (done) => {
    clientSocket.emit('room:join', {
      roomId: 'test-room',
      roomType: 'chat',
    }, (response) => {
      expect(response.success).toBe(true);
      done();
    });
  });
});
```

Run tests:

```bash
npm run test:integration
```

## Troubleshooting

### Issue: "Authentication error: Invalid token"

**Solution:**
- Verify JWT_SECRET in .env matches the one used to generate tokens
- Check token expiration
- Ensure token is passed correctly in auth object

### Issue: "Redis adapter configuration failed"

**Solution:**
- Verify Redis is running: `redis-cli ping` should return "PONG"
- Check REDIS_HOST and REDIS_PORT in .env
- For development without Redis: Set `REDIS_HOST=` (empty)

### Issue: "Cannot emit to user: Socket.io not initialized"

**Solution:**
- Ensure server has fully started before making requests
- Check logs for "WebSocket server initialized successfully"
- Verify no errors during initialization

### Issue: Connections dropping frequently

**Solution:**
- Check network stability
- Increase pingTimeout and pingInterval in websocket.ts
- Verify firewall allows WebSocket connections
- Check for proxy/load balancer WebSocket support

### Issue: Messages not persisting to database

**Solution:**
- Verify database connection is active
- Check Prisma schema includes ChatMessage model
- Run migrations: `npm run db:migrate`
- Check logs for database errors

### Issue: Room access denied

**Solution:**
- Verify user has correct role
- Check visit/appointment relationships in database
- Ensure user is participant in the visit

## Production Deployment

### 1. Environment Configuration

Production `.env`:

```env
NODE_ENV=production
PORT=8080

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/unified_health_prod

# Redis (Required for production)
REDIS_HOST=redis-prod.example.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-very-secure-random-secret-min-32-chars
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# CORS
CORS_ORIGINS=https://app.yourdomain.com,https://admin.yourdomain.com
```

### 2. Load Balancer Configuration

**Nginx Configuration:**

```nginx
upstream socket_servers {
    # Enable sticky sessions for WebSocket
    ip_hash;

    server api-1.internal:8080;
    server api-2.internal:8080;
    server api-3.internal:8080;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/ssl/certs/api.crt;
    ssl_certificate_key /etc/ssl/private/api.key;

    location /socket.io/ {
        proxy_pass http://socket_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://socket_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Kubernetes Deployment

Add to your deployment.yaml:

```yaml
env:
  - name: REDIS_HOST
    value: "redis-service"
  - name: REDIS_PORT
    value: "6379"
  - name: REDIS_PASSWORD
    valueFrom:
      secretKeyRef:
        name: redis-secret
        key: password
```

Ensure Redis is deployed:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
---
apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
```

### 4. Health Checks

Configure health check endpoints:

**Kubernetes liveness probe:**
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
```

**Kubernetes readiness probe:**
```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

### 5. Monitoring

Set up monitoring for:
- Active WebSocket connections
- Message throughput
- Call success rate
- Presence tracking performance
- Redis connection status
- Error rates

Example Prometheus metrics (already included):
- `websocket_connections_total`
- `websocket_messages_total`
- `websocket_calls_active`
- `websocket_rooms_active`

### 6. Scaling Considerations

- **Horizontal Scaling**: Use Redis adapter (already configured)
- **Redis High Availability**: Use Redis Sentinel or Cluster
- **Database Connection Pool**: Configure Prisma connection pool size
- **Rate Limiting**: Monitor and adjust rate limits per user
- **Connection Limits**: Set max connections per server instance

## Security Checklist

- ✅ JWT authentication on all connections
- ✅ Role-based access control for rooms
- ✅ Input validation on all events
- ✅ Rate limiting on message sending
- ✅ CORS configuration restricted to known origins
- ✅ No sensitive data in logs
- ✅ Encrypted connections (use HTTPS/WSS in production)
- ✅ Token expiration and refresh
- ✅ Audit logging for critical actions

## Performance Optimization

1. **Connection Pooling**: Already configured in Prisma
2. **Message Batching**: Consider batching notifications
3. **Presence Updates**: Already throttled with TTL
4. **Room Cleanup**: Automatic cleanup of empty rooms
5. **Stale Connections**: Automatic cleanup after 5 minutes inactivity

## Next Steps

1. Install dependencies: `npm install`
2. Configure environment variables
3. Start Redis (or skip for dev)
4. Run migrations: `npm run db:migrate`
5. Start server: `npm run dev`
6. Test with provided HTML client
7. Integrate with your frontend applications
8. Monitor logs and metrics
9. Deploy to production

## Support

For additional help:
- Check logs in `logs/` directory
- Review `WEBSOCKET_IMPLEMENTATION.md` for API details
- Test with provided HTML client
- Monitor Redis with `redis-cli monitor`

## Changelog

**v1.0.0 (2024-01-15)**
- Initial WebSocket implementation
- JWT authentication middleware
- Room management (chat, calls, notifications)
- Message persistence
- Call signaling
- Presence tracking
- Redis adapter for scaling
- Production-ready error handling
