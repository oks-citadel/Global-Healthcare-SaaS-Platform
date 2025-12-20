# Kiosk Application Deployment Guide

This guide provides instructions for deploying the Hospital Kiosk application in a production environment.

## Prerequisites

- Node.js 18.x or higher
- Touch-screen display (recommended: 1920x1080 or higher)
- Stable network connection
- Optional: Card reader for insurance/payment processing

## Build for Production

### 1. Install Dependencies

```bash
npm install --production
```

### 2. Set Environment Variables

Create a `.env.production` file:

```env
NEXT_PUBLIC_API_URL=https://api.yourhospital.com
NEXT_PUBLIC_IDLE_TIMEOUT=120000
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

### 3. Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### 4. Start the Production Server

```bash
npm start
```

The application will run on port 3004 by default.

## Kiosk Mode Configuration

### Windows Setup

1. **Install Chrome**
   ```bash
   # Download and install Chrome from https://www.google.com/chrome/
   ```

2. **Create Kiosk Startup Script** (`start-kiosk.bat`):
   ```batch
   @echo off
   chrome.exe --kiosk "http://localhost:3004" --incognito --no-first-run --disable-translate --disable-infobars --disable-suggestions-service --disable-save-password-bubble
   ```

3. **Auto-start on Boot**:
   - Place the batch file in `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp`
   - Or use Task Scheduler for more control

4. **Disable System Shortcuts**:
   - Group Policy: Disable Ctrl+Alt+Del
   - Registry: Disable Windows key
   - Use third-party tools like "Kiosk Mode" software

### Linux Setup

1. **Install Chromium**
   ```bash
   sudo apt-get update
   sudo apt-get install chromium-browser unclutter
   ```

2. **Create Autostart Script** (`~/.config/autostart/kiosk.desktop`):
   ```ini
   [Desktop Entry]
   Type=Application
   Name=Hospital Kiosk
   Exec=/usr/bin/chromium-browser --kiosk --incognito http://localhost:3004
   X-GNOME-Autostart-enabled=true
   ```

3. **Disable Screen Blanking**:
   ```bash
   xset s off
   xset -dpms
   xset s noblank
   ```

### macOS Setup

1. **Create Launch Agent** (`~/Library/LaunchAgents/com.hospital.kiosk.plist`):
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
       <key>Label</key>
       <string>com.hospital.kiosk</string>
       <key>ProgramArguments</key>
       <array>
           <string>/Applications/Google Chrome.app/Contents/MacOS/Google Chrome</string>
           <string>--kiosk</string>
           <string>http://localhost:3004</string>
       </array>
       <key>RunAtLoad</key>
       <true/>
   </dict>
   </plist>
   ```

2. **Load Launch Agent**:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.hospital.kiosk.plist
   ```

## Docker Deployment

### Dockerfile

Create a `Dockerfile` in the kiosk directory:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3004

ENV PORT 3004

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build Docker image
docker build -t hospital-kiosk .

# Run container
docker run -p 3004:3004 hospital-kiosk
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  kiosk:
    build: .
    ports:
      - "3004:3004"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourhospital.com
      - NEXT_PUBLIC_IDLE_TIMEOUT=120000
    restart: unless-stopped
    networks:
      - hospital-network

networks:
  hospital-network:
    external: true
```

Run with:
```bash
docker-compose up -d
```

## Reverse Proxy Configuration

### Nginx

```nginx
server {
    listen 80;
    server_name kiosk.yourhospital.com;

    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache

```apache
<VirtualHost *:80>
    ServerName kiosk.yourhospital.com

    ProxyPreserveHost On
    ProxyPass / http://localhost:3004/
    ProxyPassReverse / http://localhost:3004/
</VirtualHost>
```

## Monitoring and Maintenance

### Health Check Endpoint

Add a health check route (`src/app/api/health/route.ts`):

```typescript
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

### Logging

Configure logging for production:

```typescript
// src/lib/logger.ts
export function log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console[level](`[${timestamp}] ${message}`, data || '')

  // Send to external logging service if configured
  if (process.env.LOGGING_ENDPOINT) {
    fetch(process.env.LOGGING_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message, data, timestamp }),
    }).catch(console.error)
  }
}
```

### Auto-restart on Crash

#### PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "hospital-kiosk" -- start

# Save process list
pm2 save

# Setup auto-restart on boot
pm2 startup
```

#### Systemd Service

Create `/etc/systemd/system/kiosk.service`:

```ini
[Unit]
Description=Hospital Kiosk Application
After=network.target

[Service]
Type=simple
User=kiosk
WorkingDirectory=/opt/hospital-kiosk
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable kiosk
sudo systemctl start kiosk
```

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Firewall**: Restrict access to necessary ports only
3. **Updates**: Keep Node.js and dependencies updated
4. **Physical Security**: Lock down the kiosk hardware
5. **Network**: Use a separate VLAN for kiosks
6. **Monitoring**: Set up alerts for errors and downtime

## Troubleshooting

### Application won't start
- Check Node.js version: `node --version`
- Verify environment variables are set
- Check logs: `npm start 2>&1 | tee kiosk.log`

### Touch not working
- Calibrate touch screen in OS settings
- Verify browser touch support
- Check for interference from screen protector

### Auto-logout not working
- Verify idle timeout in `.env` file
- Check browser console for errors
- Ensure JavaScript is enabled

### Performance issues
- Monitor CPU/memory usage
- Check network latency to API
- Clear browser cache
- Restart application

## Support

For deployment assistance, contact the infrastructure team or refer to the main README.md for additional documentation.
