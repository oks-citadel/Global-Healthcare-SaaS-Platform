import React from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof spacing;
  onPress?: () => void;
  touchableProps?: Omit<TouchableOpacityProps, 'onPress' | 'style'>;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
  padding = 'md',
  onPress,
  touchableProps,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.light.card,
      borderRadius: borderRadius.lg,
      padding: spacing[padding],
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {},
      elevated: {
        ...shadows.md,
      },
      outlined: {
        borderWidth: 1,
        borderColor: colors.light.cardBorder,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.7}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
};
