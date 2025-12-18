import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8080', 10),
  version: process.env.API_VERSION || '1.0.0',

  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:3002').split(','),
  },

  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRY || '1h',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  },

  database: {
    url: process.env.DATABASE_URL || 'postgresql://unified_health:password@localhost:5432/unified_health_dev',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  encryption: {
    key: process.env.ENCRYPTION_KEY || 'your-32-byte-encryption-key-here',
  },

  azure: {
    keyVaultUrl: process.env.AZURE_KEY_VAULT_URL,
    storage: {
      connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
      accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
      accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'healthcare-documents',
    },
  },

  storage: {
    url: process.env.STORAGE_URL || 'https://storage.example.com',
    container: process.env.STORAGE_CONTAINER || 'documents',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10), // 100MB
  },

  storageUrl: process.env.STORAGE_URL || 'https://storage.example.com',

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  push: {
    fcm: {
      serverKey: process.env.FCM_SERVER_KEY,
      senderId: process.env.FCM_SENDER_ID,
    },
    apns: {
      keyId: process.env.APNS_KEY_ID,
      teamId: process.env.APNS_TEAM_ID,
      bundleId: process.env.APNS_BUNDLE_ID,
      production: process.env.APNS_PRODUCTION === 'true',
      keyPath: process.env.APNS_KEY_PATH,
    },
    webPush: {
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
      subject: process.env.VAPID_SUBJECT || 'mailto:support@unifiedhealth.com',
    },
  },
};

// Validate required config in production
if (config.env === 'production') {
  const required = ['JWT_SECRET', 'DATABASE_URL', 'ENCRYPTION_KEY'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
