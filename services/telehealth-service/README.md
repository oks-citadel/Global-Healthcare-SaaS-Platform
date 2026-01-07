# Unified Health Telehealth Service

## Overview

The Telehealth Service enables real-time video consultations between patients and healthcare providers using WebRTC technology. It handles appointment scheduling, video signaling, and visit management.

## Technical Stack

| Component | Technology              |
| --------- | ----------------------- |
| Runtime   | Node.js 20+             |
| Framework | Express.js (TypeScript) |
| Real-time | Socket.io               |
| Video     | WebRTC                  |
| Signaling | Socket.io rooms         |

## Port Configuration

| Environment | Port |
| ----------- | ---- |
| Development | 3001 |
| Production  | 8082 |

## Directory Structure

```
services/telehealth-service/
├── src/
│   ├── generated/         # Prisma client
│   ├── lib/
│   │   └── prisma.ts      # Database client
│   ├── middleware/
│   │   └── extractUser.ts # User extraction from headers
│   ├── routes/
│   │   ├── appointments.ts # Appointment endpoints
│   │   └── visits.ts       # Visit session endpoints
│   ├── services/
│   │   └── webrtc.service.ts # WebRTC signaling
│   └── index.ts
├── Dockerfile
└── package.json
```

## API Endpoints

### Health

| Endpoint  | Method | Description          |
| --------- | ------ | -------------------- |
| `/health` | GET    | Service health check |
| `/stats`  | GET    | Active rooms count   |

### Appointments (`/appointments`)

| Endpoint      | Method | Description        |
| ------------- | ------ | ------------------ |
| `/`           | GET    | List appointments  |
| `/`           | POST   | Create appointment |
| `/:id`        | GET    | Get appointment    |
| `/:id`        | PUT    | Update appointment |
| `/:id/cancel` | POST   | Cancel appointment |

### Visits (`/visits`)

| Endpoint                 | Method | Description       |
| ------------------------ | ------ | ----------------- |
| `/:appointmentId/start`  | POST   | Start video visit |
| `/:appointmentId/end`    | POST   | End video visit   |
| `/:appointmentId/status` | GET    | Get visit status  |

## WebRTC Signaling

### Socket.io Events

| Event           | Direction                | Description            |
| --------------- | ------------------------ | ---------------------- |
| `join-room`     | Client → Server          | Join video room        |
| `leave-room`    | Client → Server          | Leave video room       |
| `offer`         | Client → Server → Client | WebRTC offer           |
| `answer`        | Client → Server → Client | WebRTC answer          |
| `ice-candidate` | Bidirectional            | ICE candidate exchange |
| `user-joined`   | Server → Client          | Participant joined     |
| `user-left`     | Server → Client          | Participant left       |

### Connection Flow

```
Patient                  Server                  Provider
   │                        │                        │
   │─── join-room ─────────▶│                        │
   │                        │◀──── join-room ────────│
   │◀── user-joined ────────│                        │
   │                        │────── user-joined ────▶│
   │                        │                        │
   │─── offer ─────────────▶│────── offer ─────────▶│
   │◀── answer ─────────────│◀───── answer ─────────│
   │                        │                        │
   │─── ice-candidate ─────▶│── ice-candidate ─────▶│
   │◀── ice-candidate ──────│◀─ ice-candidate ──────│
   │                        │                        │
   ├════════════════════════╪════════════════════════┤
   │       Video/Audio Stream Established            │
   └────────────────────────┴────────────────────────┘
```

## Environment Variables

```bash
# Required
NODE_ENV=production
PORT=8082
DATABASE_URL=postgresql://user:password@host:5432/db?schema=clinical

# WebRTC
CORS_ORIGIN=https://app.unifiedhealth.io
STUN_SERVER=stun:stun.l.google.com:19302
TURN_SERVER=turn:turn.unifiedhealth.io:3478
TURN_USERNAME=...
TURN_PASSWORD=...

# Optional
SOCKET_PATH=/socket.io
MAX_ROOM_SIZE=10
```

## Database Access

The telehealth service accesses the `clinical` schema for appointment and visit data.

| Table        | Access     |
| ------------ | ---------- |
| appointments | Read/Write |
| visits       | Read/Write |
| patients     | Read       |
| providers    | Read       |

### Database Role

```sql
CREATE ROLE role_telehealth WITH LOGIN PASSWORD 'secure_password';
GRANT USAGE ON SCHEMA clinical TO role_telehealth;
GRANT SELECT, INSERT, UPDATE ON clinical.appointments TO role_telehealth;
GRANT SELECT, INSERT, UPDATE ON clinical.visits TO role_telehealth;
GRANT SELECT ON clinical.patients TO role_telehealth;
GRANT SELECT ON clinical.providers TO role_telehealth;
```

## Running Locally

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- pnpm

### Development

```bash
# Install dependencies
pnpm install

# Start service
pnpm dev
```

### Docker

```bash
# Build
docker build -t unifiedhealth/telehealth-service:latest .

# Run
docker run -p 8082:8082 \
  -e DATABASE_URL="postgresql://..." \
  unifiedhealth/telehealth-service:latest
```

## Client Integration

### JavaScript/TypeScript

```typescript
import { io } from "socket.io-client";

const socket = io("wss://api.unifiedhealth.io", {
  path: "/telehealth/socket.io",
  auth: { token: "jwt-token" },
});

// Join room
socket.emit("join-room", { roomId: "appointment-123" });

// Handle WebRTC signaling
socket.on("offer", async (data) => {
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  socket.emit("answer", { roomId: data.roomId, answer });
});

socket.on("ice-candidate", async (data) => {
  await peerConnection.addIceCandidate(data.candidate);
});
```

## Monitoring

### Metrics

| Metric                  | Description                  |
| ----------------------- | ---------------------------- |
| `active_rooms`          | Number of active video rooms |
| `participants_total`    | Total connected participants |
| `call_duration_seconds` | Average call duration        |
| `connection_failures`   | Failed WebRTC connections    |

### Stats Endpoint

```bash
GET /stats

{
  "activeRooms": 5,
  "timestamp": "2024-12-23T00:00:00Z"
}
```

## Security

- All connections require valid JWT
- Room access verified against appointment
- TURN server credentials rotated daily
- End-to-end encryption via WebRTC
- Recording consent required (if enabled)

## HIPAA Compliance

- No video/audio data stored on server
- Peer-to-peer encryption
- Session metadata logged for audit
- Access logs retained for 7 years

## Access Control

| Team   | Access Level               |
| ------ | -------------------------- |
| NetOps | TURN/STUN configuration    |
| SecOps | Read-only (audit)          |
| AppOps | Manage, scale, configure   |
| DevOps | Full administrative access |

## Troubleshooting

### Common Issues

1. **ICE Failed**: Check TURN server connectivity
2. **No Video**: Verify browser permissions
3. **Connection Timeout**: Check firewall rules
4. **Audio Only**: Insufficient bandwidth

### Debug Mode

```bash
DEBUG=socket.io:*,telehealth:* pnpm dev
```

## Related Documentation

- [Telemedicine Implementation](../../TELEMEDICINE_IMPLEMENTATION.md)
- [WebRTC Architecture](../../docs/architecture/WEBRTC.md)
- [Access Control Matrix](../../docs/ACCESS_CONTROL_MATRIX.md)

## Contact

- **Service Owner**: Telehealth Team
- **Slack**: #telehealth
- **Email**: telehealth@unifiedhealth.io
