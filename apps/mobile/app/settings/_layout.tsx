import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
        headerBackTitle: 'Back',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="change-password"
        options={{
          headerTitle: 'Change Password',
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          headerTitle: 'Language',
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          headerTitle: 'Privacy & Security',
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          headerTitle: 'Help & Support',
        }}
      />
    </Stack>
  );
}
