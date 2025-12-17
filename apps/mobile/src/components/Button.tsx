import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
  ...props
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        minHeight: 36,
      },
      md: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        minHeight: 44,
      },
      lg: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? colors.gray[300] : colors.primary[500],
      },
      secondary: {
        backgroundColor: disabled ? colors.gray[300] : colors.secondary[500],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: disabled ? colors.gray[300] : colors.primary[500],
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: disabled ? colors.gray[300] : colors.error[500],
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles: Record<string, TextStyle> = {
      sm: {
        fontSize: typography.sizes.sm,
        lineHeight: typography.lineHeights.sm,
      },
      md: {
        fontSize: typography.sizes.md,
        lineHeight: typography.lineHeights.md,
      },
      lg: {
        fontSize: typography.sizes.lg,
        lineHeight: typography.lineHeights.lg,
      },
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: {
        color: '#ffffff',
      },
      secondary: {
        color: '#ffffff',
      },
      outline: {
        color: disabled ? colors.gray[400] : colors.primary[500],
      },
      ghost: {
        color: disabled ? colors.gray[400] : colors.primary[500],
      },
      danger: {
        color: '#ffffff',
      },
    };

    return {
      fontWeight: typography.fontWeights.semibold,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary[500] : '#ffffff'}
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), icon && { marginLeft: spacing.xs }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Placeholder for any additional styles if needed
});
