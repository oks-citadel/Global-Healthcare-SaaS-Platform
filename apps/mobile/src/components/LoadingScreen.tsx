import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
} from "react-native";
import { colors, spacing, typography } from "../theme";

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
  style?: ViewStyle;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  showLogo = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {showLogo && (
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Unified Health</Text>
        </View>
      )}
      <ActivityIndicator size="large" color={colors.primary[500]} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light.background,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: typography.sizes["2xl"],
    fontWeight: "700",
    color: colors.primary[600],
  },
  message: {
    marginTop: spacing.lg,
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    textAlign: "center",
  },
});
