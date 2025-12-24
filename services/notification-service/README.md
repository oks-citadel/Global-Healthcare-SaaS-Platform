# Notification Service

Multi-channel notification service for the UnifiedHealth Platform supporting email, SMS, push notifications, and in-app messaging.

## Features

- **Multi-Channel Delivery**: Email (SendGrid), SMS (Twilio), Push (Firebase), In-App
- **Template Management**: Reusable notification templates with variable substitution
- **User Preferences**: Per-user, per-channel notification preferences
- **Quiet Hours**: Respect user-defined quiet hours for non-urgent notifications
- **Priority Levels**: Low, Normal, High, Urgent with appropriate delivery rules
- **Bulk Notifications**: Send up to 1000 notifications in a single request
- **Delivery Tracking**: Track sent, delivered, read, and failed states
- **Retry Logic**: Automatic retry for failed deliveries

## API Endpoints

### Notifications

| Method | Endpoint                                  | Description               |
| ------ | ----------------------------------------- | ------------------------- |
| POST   | `/api/notifications`                      | Send a notification       |
| GET    | `/api/notifications/user/:userId`         | Get user's notifications  |
| GET    | `/api/notifications/:notificationId`      | Get specific notification |
| PATCH  | `/api/notifications/:notificationId/read` | Mark as read              |
| POST   | `/api/notifications/bulk`                 | Bulk send notifications   |

### Templates

| Method | Endpoint                     | Description           |
| ------ | ---------------------------- | --------------------- |
| GET    | `/api/templates`             | List all templates    |
| GET    | `/api/templates/:templateId` | Get specific template |
| POST   | `/api/templates`             | Create template       |
| PUT    | `/api/templates/:templateId` | Update template       |
| DELETE | `/api/templates/:templateId` | Delete template       |

### Preferences

| Method | Endpoint                                       | Description                |
| ------ | ---------------------------------------------- | -------------------------- |
| GET    | `/api/preferences/user/:userId`                | Get user preferences       |
| PUT    | `/api/preferences/user/:userId`                | Update all preferences     |
| PATCH  | `/api/preferences/user/:userId/:channel/:type` | Update single preference   |
| POST   | `/api/preferences/user/:userId/unsubscribe`    | Unsubscribe from marketing |

### Health

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| GET    | `/api/health`       | Service health status |
| GET    | `/api/health/ready` | Readiness probe       |
| GET    | `/api/health/live`  | Liveness probe        |

## Notification Types

- `appointment_reminder`
- `appointment_confirmation`
- `appointment_cancellation`
- `prescription_ready`
- `lab_results_available`
- `payment_reminder`
- `payment_confirmation`
- `secure_message`
- `system_alert`
- `marketing`
- `telehealth_reminder`
- `care_plan_update`

## Environment Variables

```bash
PORT=3006
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/notifications

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@unifiedhealth.io

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_FROM_NUMBER=+1234567890

# Push (Firebase)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Redis (for queuing)
REDIS_URL=redis://localhost:6379
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Start development server
pnpm dev

# Run tests
pnpm test
```

## Port

**3006**
