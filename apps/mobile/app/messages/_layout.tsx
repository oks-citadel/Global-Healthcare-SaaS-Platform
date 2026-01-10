import { Stack } from 'expo-router';

export default function MessagesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#1976D2',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Messages',
        }}
      />
      <Stack.Screen
        name="[conversationId]"
        options={{
          title: 'Chat',
        }}
      />
      <Stack.Screen
        name="new"
        options={{
          title: 'New Message',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
