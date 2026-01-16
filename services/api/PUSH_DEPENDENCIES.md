# Push Notification Dependencies

## Required NPM Packages

Add the following dependencies to your `package.json`:

```json
{
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "@apns/apn": "^6.0.0",
    "web-push": "^3.6.6"
  },
  "devDependencies": {
    "@types/web-push": "^3.6.3"
  }
}
```

## Installation Command

Run this command to install all required packages:

```bash
npm install firebase-admin @apns/apn web-push
npm install --save-dev @types/web-push
```

## Package Details

### firebase-admin (v12.0.0+)
- **Purpose**: Firebase Cloud Messaging (FCM) for Android and iOS push notifications
- **Size**: ~12MB
- **Features**:
  - Send to individual devices or topics
  - Batch sending (up to 500 tokens)
  - Rich notifications with images
  - Platform-specific customization
  - Automatic token validation
  - Built-in retry logic

**Documentation**: https://firebase.google.com/docs/admin/setup

### @apns/apn (v6.0.0+)
- **Purpose**: Apple Push Notification Service (APNS) for native iOS notifications
- **Size**: ~200KB
- **Features**:
  - Token-based authentication (no certificates needed)
  - Supports iOS, macOS, tvOS, watchOS
  - HTTP/2 connection pooling
  - Silent notifications
  - Badge management
  - Sound customization

**Documentation**: https://github.com/apns/apn

**Note**: This is a fork of the original `apn` package with TypeScript support and active maintenance.

### web-push (v3.6.6+)
- **Purpose**: Web Push API for browser notifications
- **Size**: ~500KB
- **Features**:
  - VAPID protocol support
  - Works with all major browsers (Chrome, Firefox, Edge, Safari)
  - End-to-end encryption
  - TTL (time-to-live) configuration
  - Urgency levels
  - Topic-based subscriptions

**Documentation**: https://github.com/web-push-libs/web-push

### @types/web-push (v3.6.3+)
- **Purpose**: TypeScript type definitions for web-push
- **Size**: ~10KB
- **Features**:
  - Full TypeScript support
  - IntelliSense in VS Code
  - Compile-time type checking

## Version Compatibility

| Package | Minimum Version | Recommended Version | Node.js Requirement |
|---------|----------------|---------------------|---------------------|
| firebase-admin | 11.0.0 | 12.0.0+ | Node.js 14+ |
| @apns/apn | 5.0.0 | 6.0.0+ | Node.js 14+ |
| web-push | 3.5.0 | 3.6.6+ | Node.js 14+ |

## Package Size Impact

Total additional package size (production dependencies):
- firebase-admin: ~12 MB
- @apns/apn: ~200 KB
- web-push: ~500 KB
- **Total**: ~12.7 MB

This is acceptable for most backend services. All packages are production-tested and widely used.

## Alternative Packages (Not Recommended)

### Why Not Use These?

1. **node-apn** (original package)
   - **Status**: Deprecated, no longer maintained
   - **Last Update**: 2019
   - **Issues**: No TypeScript support, outdated dependencies
   - **Recommendation**: Use `@apns/apn` instead

2. **FCM HTTP v1 API (manual)**
   - **Why not**: Complex authentication with Google OAuth2
   - **Issues**: Manual token refresh, error handling complexity
   - **Recommendation**: Use `firebase-admin` SDK instead

3. **fcm-node** or **fcm-push**
   - **Status**: Uses deprecated FCM legacy API
   - **Issues**: Will stop working when Google shuts down legacy API
   - **Recommendation**: Use `firebase-admin` SDK

4. **push-notification-service**
   - **Status**: Unmaintained wrapper package
   - **Issues**: Outdated dependencies, limited features
   - **Recommendation**: Use individual packages

## Peer Dependencies

The packages have the following peer dependencies (already in your project):

```json
{
  "node-fetch": "^2.6.0",  // Used by firebase-admin
  "jsonwebtoken": "^9.0.0" // Used by @apns/apn and web-push
}
```

These are already in your `package.json`, so no additional installation needed.

## Security Considerations

All three packages:
- ✅ Have active maintenance and security updates
- ✅ Are used by millions of applications
- ✅ Have security audit histories on npm
- ✅ Support the latest security protocols
- ✅ Regularly updated for new OS versions

### Security Audit

Run security audit after installation:

```bash
npm audit
```

If vulnerabilities are found, fix them:

```bash
npm audit fix
```

## Build Size for Production

When deploying to production, ensure your build process:

1. **Excludes dev dependencies**:
   ```bash
   npm install --production
   ```

2. **Uses tree-shaking** (if applicable):
   - Modern bundlers will only include used code
   - Reduces final bundle size

3. **Compresses node_modules**:
   - Consider using `npm prune --production` before deploying
   - Remove unnecessary files

## Verifying Installation

After installation, verify packages are working:

```bash
# Check installed versions
npm list firebase-admin @apns/apn web-push

# Expected output:
# ├── firebase-admin@12.x.x
# ├── @apns/apn@6.x.x
# └── web-push@3.x.x
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  }
}
```

This ensures proper imports for the packages.

## Import Examples

### CommonJS (require)
```javascript
const admin = require('firebase-admin');
const apn = require('@apns/apn');
const webpush = require('web-push');
```

### ES6 Modules (import)
```typescript
import * as admin from 'firebase-admin';
import apn from '@apns/apn';
import webpush from 'web-push';
```

## Troubleshooting Installation

### Issue: "Cannot find module 'firebase-admin'"

**Solution**:
```bash
npm install firebase-admin
```

### Issue: "Module '@apns/apn' has no exported member 'Provider'"

**Solution**: Ensure you're using the correct import syntax:
```typescript
import apn from '@apns/apn';
const provider = new apn.Provider(config);
```

### Issue: "web-push type definitions not found"

**Solution**:
```bash
npm install --save-dev @types/web-push
```

### Issue: npm install fails with "EACCES" error

**Solution**:
```bash
# Option 1: Use npx
npx npm install firebase-admin @apns/apn web-push

# Option 2: Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

## Docker Considerations

If using Docker, add to your `Dockerfile`:

```dockerfile
# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Your app code
COPY . .
```

The packages work well in containerized environments.

## Testing Dependencies

For testing the push notification service:

```bash
npm install --save-dev supertest @types/supertest
```

This allows you to test the API endpoints that use push notifications.

## Maintenance

### Keeping Packages Updated

Check for updates regularly:

```bash
npm outdated
```

Update packages:

```bash
npm update firebase-admin @apns/apn web-push
```

### Recommended Update Schedule

- **firebase-admin**: Check monthly (frequent updates)
- **@apns/apn**: Check quarterly (stable releases)
- **web-push**: Check quarterly (stable releases)

## Support

If you encounter issues:

1. Check package documentation
2. Search GitHub issues for the specific package
3. Verify your Node.js version meets requirements
4. Ensure environment variables are correctly set

## Complete Installation Script

Save this as `install-push-deps.sh`:

```bash
#!/bin/bash

echo "Installing push notification dependencies..."

# Install production dependencies
npm install firebase-admin@latest @apns/apn@latest web-push@latest

# Install dev dependencies
npm install --save-dev @types/web-push@latest

# Verify installation
echo "\nVerifying installation..."
npm list firebase-admin @apns/apn web-push

# Run security audit
echo "\nRunning security audit..."
npm audit

echo "\nInstallation complete!"
echo "Next steps:"
echo "1. Configure environment variables in .env"
echo "2. See PUSH_NOTIFICATION_SETUP.md for configuration guide"
```

Make it executable:
```bash
chmod +x install-push-deps.sh
./install-push-deps.sh
```
