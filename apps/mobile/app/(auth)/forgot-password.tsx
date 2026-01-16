import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Button, Input } from "../../src/components";
import { colors, spacing, typography } from "../../src/theme";
import apiClient from "../../src/api/client";

type ForgotPasswordStep = "email" | "code" | "newPassword" | "success";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetToken, setResetToken] = useState("");

  const router = useRouter();

  const validateEmail = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCode = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!verificationCode.trim()) {
      newErrors.code = "Verification code is required";
    } else if (verificationCode.length !== 6) {
      newErrors.code = "Code must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewPassword = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newPassword) {
      newErrors.password = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestReset = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      setStep("code");
      Alert.alert(
        "Code Sent",
        "If an account exists with this email, you will receive a verification code shortly.",
        [{ text: "OK" }],
      );
    } catch {
      // For security, we don't reveal if the email exists
      // Still show success message to prevent email enumeration
      setStep("code");
      Alert.alert(
        "Code Sent",
        "If an account exists with this email, you will receive a verification code shortly.",
        [{ text: "OK" }],
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateCode()) return;

    setIsLoading(true);
    try {
      const response = await apiClient.post<{ resetToken: string }>(
        "/auth/verify-reset-code",
        {
          email: email.trim().toLowerCase(),
          code: verificationCode,
        },
      );
      setResetToken(response.resetToken);
      setStep("newPassword");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Invalid or expired code";
      Alert.alert("Error", message, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateNewPassword()) return;

    setIsLoading(true);
    try {
      await apiClient.post("/auth/reset-password", {
        resetToken,
        newPassword,
      });
      setStep("success");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      Alert.alert("Error", message, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      Alert.alert("Code Resent", "A new verification code has been sent.", [
        { text: "OK" },
      ]);
    } catch {
      Alert.alert("Error", "Failed to resend code. Please try again later.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const renderEmailStep = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we will send you a verification code to
          reset your password.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors({ ...errors, email: "" });
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          required
        />

        <Button
          title="Send Verification Code"
          onPress={handleRequestReset}
          loading={isLoading}
          fullWidth
          size="lg"
        />
      </View>
    </>
  );

  const renderCodeStep = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Enter Code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit verification code to {email}. Enter it below to
          continue.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Verification Code"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChangeText={(text) => {
            // Only allow digits
            const digits = text.replace(/\D/g, "").slice(0, 6);
            setVerificationCode(digits);
            setErrors({ ...errors, code: "" });
          }}
          error={errors.code}
          keyboardType="number-pad"
          maxLength={6}
          required
        />

        <Button
          title="Verify Code"
          onPress={handleVerifyCode}
          loading={isLoading}
          fullWidth
          size="lg"
        />

        <TouchableOpacity
          onPress={handleResendCode}
          style={styles.resendButton}
          disabled={isLoading}
        >
          <Text style={styles.resendText}>
            Didn't receive a code? <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderNewPasswordStep = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Your new password must be at least 8 characters and include uppercase,
          lowercase, and a number.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            setErrors({ ...errors, password: "" });
          }}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          required
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors({ ...errors, confirmPassword: "" });
          }}
          error={errors.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          required
        />

        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          loading={isLoading}
          fullWidth
          size="lg"
        />
      </View>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <View style={styles.header}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>&#10003;</Text>
        </View>
        <Text style={styles.title}>Password Reset!</Text>
        <Text style={styles.subtitle}>
          Your password has been successfully reset. You can now log in with
          your new password.
        </Text>
      </View>

      <View style={styles.form}>
        <Button
          title="Back to Login"
          onPress={handleBackToLogin}
          fullWidth
          size="lg"
        />
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {step === "email" && renderEmailStep()}
          {step === "code" && renderCodeStep()}
          {step === "newPassword" && renderNewPasswordStep()}
          {step === "success" && renderSuccessStep()}

          {step !== "success" && (
            <View style={styles.footer}>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.backLink}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.gray[900],
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    marginBottom: spacing.xl,
  },
  footer: {
    alignItems: "center",
  },
  backLink: {
    fontSize: typography.sizes.md,
    color: colors.primary[500],
    fontWeight: typography.fontWeights.semibold,
  },
  resendButton: {
    marginTop: spacing.md,
    alignItems: "center",
  },
  resendText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  resendLink: {
    color: colors.primary[500],
    fontWeight: typography.fontWeights.semibold,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  successIconText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
});
