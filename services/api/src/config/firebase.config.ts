import admin from 'firebase-admin';
import { logger } from '../utils/logger.js';

/**
 * Firebase Configuration
 *
 * Initializes Firebase Admin SDK for:
 * - Cloud Messaging (Push Notifications)
 * - Firestore (if needed)
 * - Authentication (if needed)
 */

let firebaseApp: admin.app.App | null = null;

/**
 * Initialize Firebase Admin SDK
 */
export function initializeFirebase(): admin.app.App | null {
  try {
    // Check if already initialized
    if (firebaseApp) {
      return firebaseApp;
    }

    // Method 1: Using service account JSON file path
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (serviceAccountPath) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      logger.info('Firebase initialized with service account file');
      return firebaseApp;
    }

    // Method 2: Using service account JSON object from environment variable
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

      logger.info('Firebase initialized with service account JSON');
      return firebaseApp;
    }

    // Method 3: Using individual credentials
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          // Replace escaped newlines in private key
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        projectId,
      });

      logger.info('Firebase initialized with individual credentials');
      return firebaseApp;
    }

    // If no credentials found, log warning
    logger.warn('Firebase credentials not configured. Push notifications will be in stub mode.');
    return null;
  } catch (error) {
    logger.error('Failed to initialize Firebase', { error });
    return null;
  }
}

/**
 * Get Firebase Admin App instance
 */
export function getFirebaseApp(): admin.app.App | null {
  if (!firebaseApp) {
    firebaseApp = initializeFirebase();
  }
  return firebaseApp;
}

/**
 * Get Firebase Messaging instance
 */
export function getFirebaseMessaging(): admin.messaging.Messaging | null {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  return admin.messaging(app);
}

/**
 * Get Firestore instance
 */
export function getFirestore(): admin.firestore.Firestore | null {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  return admin.firestore(app);
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): admin.auth.Auth | null {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  return admin.auth(app);
}

/**
 * Verify Firebase configuration
 */
export function verifyFirebaseConfig(): {
  configured: boolean;
  services: {
    messaging: boolean;
    firestore: boolean;
    auth: boolean;
  };
} {
  const app = getFirebaseApp();

  if (!app) {
    return {
      configured: false,
      services: {
        messaging: false,
        firestore: false,
        auth: false,
      },
    };
  }

  return {
    configured: true,
    services: {
      messaging: !!getFirebaseMessaging(),
      firestore: !!getFirestore(),
      auth: !!getFirebaseAuth(),
    },
  };
}

export default {
  initializeFirebase,
  getFirebaseApp,
  getFirebaseMessaging,
  getFirestore,
  getFirebaseAuth,
  verifyFirebaseConfig,
};
