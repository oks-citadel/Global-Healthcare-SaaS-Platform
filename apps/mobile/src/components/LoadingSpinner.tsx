import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = colors.primary[500],
  message,
  fullScreen = false,
  style,
}) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.background,
  },
  message: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    textAlign: 'center',
  },
});
