import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getAppName = () => {
  if (IS_DEV) return 'Unified Health (Dev)';
  if (IS_PREVIEW) return 'Unified Health (Preview)';
  return 'Unified Health';
};

const getBundleIdentifier = () => {
  if (IS_DEV) return 'com.unifiedhealth.app.dev';
  if (IS_PREVIEW) return 'com.unifiedhealth.app.preview';
  return 'com.unifiedhealth.app';
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(),
  slug: 'unified-health',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'unifiedhealth',
  userInterfaceStyle: 'automatic',

  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0F4C81',
  },

  assetBundlePatterns: ['**/*'],

  ios: {
    supportsTablet: true,
    bundleIdentifier: getBundleIdentifier(),
    buildNumber: '1',
    infoPlist: {
      NSFaceIDUsageDescription: 'Use Face ID for secure authentication',
      NSCameraUsageDescription: 'Take photos for medical records',
      NSPhotoLibraryUsageDescription: 'Upload photos for medical records',
      NSMicrophoneUsageDescription: 'Use microphone for telehealth calls',
      NSCalendarsUsageDescription: 'Sync appointments with your calendar',
      NSHealthShareUsageDescription: 'Read health data from HealthKit',
      NSHealthUpdateUsageDescription: 'Write health data to HealthKit',
      UIBackgroundModes: ['fetch', 'remote-notification'],
    },
    config: {
      usesNonExemptEncryption: true,
    },
    associatedDomains: [
      'applinks:unifiedhealth.com',
      'applinks:*.unifiedhealth.com',
    ],
  },

  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0F4C81',
    },
    package: getBundleIdentifier(),
    versionCode: 1,
    permissions: [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.READ_CALENDAR',
      'android.permission.WRITE_CALENDAR',
      'android.permission.USE_BIOMETRIC',
      'android.permission.USE_FINGERPRINT',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.VIBRATE',
    ],
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'unifiedhealth.com',
            pathPrefix: '/app',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },

  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },

  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#0F4C81',
        sounds: ['./assets/notification.wav'],
      },
    ],
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'Allow Unified Health to use Face ID for secure authentication.',
      },
    ],
    'expo-localization',
  ],

  experiments: {
    typedRoutes: true,
  },

  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'unified-health-production',
    },
    // Public environment variables (no secrets!)
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    authIssuer: process.env.EXPO_PUBLIC_AUTH_ISSUER,
    featureFlags: process.env.EXPO_PUBLIC_FEATURE_FLAGS,
    sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    environment: process.env.APP_VARIANT || 'production',
  },

  updates: {
    enabled: true,
    fallbackToCacheTimeout: 30000,
    url: 'https://u.expo.dev/unified-health-production',
  },

  runtimeVersion: {
    policy: 'sdkVersion',
  },

  owner: 'unified-health',
});
