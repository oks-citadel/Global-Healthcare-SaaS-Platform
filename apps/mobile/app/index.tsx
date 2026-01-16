import { Redirect } from 'expo-router';

export default function Index() {
  // This will redirect to either (auth)/login or (tabs) based on auth state
  // The actual navigation logic is handled in _layout.tsx
  return <Redirect href="/(tabs)" />;
}
