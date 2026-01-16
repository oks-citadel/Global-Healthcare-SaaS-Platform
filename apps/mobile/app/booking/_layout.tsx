import { Stack } from 'expo-router';

export default function BookingLayout() {
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
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Book Appointment',
        }}
      />
      <Stack.Screen
        name="datetime"
        options={{
          title: 'Select Date & Time',
        }}
      />
      <Stack.Screen
        name="reason"
        options={{
          title: 'Appointment Details',
        }}
      />
      <Stack.Screen
        name="confirm"
        options={{
          title: 'Confirm Booking',
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          title: 'Booking Confirmed',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
