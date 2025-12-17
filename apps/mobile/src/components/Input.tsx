import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  required = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return colors.error[500];
    if (isFocused) return colors.primary[500];
    return colors.gray[300];
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            style,
          ]}
          placeholderTextColor={colors.gray[400]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.error[500],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.background,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.gray[900],
    minHeight: 44,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xs,
  },
  iconLeft: {
    paddingLeft: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRight: {
    paddingRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.error[500],
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  helperText: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
