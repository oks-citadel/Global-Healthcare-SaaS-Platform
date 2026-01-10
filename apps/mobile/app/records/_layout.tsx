import { Stack } from 'expo-router';

export default function RecordsLayout() {
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
          title: 'Health Records',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Record Details',
        }}
      />
      <Stack.Screen
        name="lab-results"
        options={{
          title: 'Lab Results',
        }}
      />
      <Stack.Screen
        name="prescriptions"
        options={{
          title: 'Prescriptions',
        }}
      />
      <Stack.Screen
        name="immunizations"
        options={{
          title: 'Immunizations',
        }}
      />
    </Stack>
  );
}
