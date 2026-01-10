import { Stack } from 'expo-router';

export default function ProvidersLayout() {
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
          title: 'Find a Doctor',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Doctor Profile',
        }}
      />
      <Stack.Screen
        name="search"
        options={{
          title: 'Search Doctors',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
