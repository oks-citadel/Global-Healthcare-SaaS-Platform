import { Stack } from 'expo-router';

export default function BillingLayout() {
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
          title: 'Billing & Payments',
        }}
      />
      <Stack.Screen
        name="subscription"
        options={{
          title: 'Subscription',
        }}
      />
      <Stack.Screen
        name="payment-methods"
        options={{
          title: 'Payment Methods',
        }}
      />
      <Stack.Screen
        name="invoices"
        options={{
          title: 'Invoices',
        }}
      />
    </Stack>
  );
}
