import { router, type Href } from "expo-router";

import { needsOnboarding } from "@/app/navigation/signedInHref";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { Button } from "@/shared/components/Button";
import { Screen } from "@/shared/components/Screen";
import { TextField } from "@/shared/components/TextField";

import { useAuth } from "../hooks/useAuth";
import { signupSchema } from "../utils/auth.schemas";

export function SignupScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { signup, isSigningUp, signupError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<string | null>(null);

  async function onSubmit() {
    setBanner(null);
    const parsed = signupSchema.safeParse({ email, password, confirmPassword });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] = issue.message;
      }
      setFieldErrors(next);
      return;
    }
    setFieldErrors({});
    try {
      const session = await signup(parsed.data);
      router.replace((needsOnboarding(session.user) ? "/onboarding" : "/(tabs)") as Href);
    } catch (error) {
      setBanner(
        getErrorMessage(error) ||
          signupError ||
          (error instanceof Error ? error.message : "Signup failed"),
      );
    }
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.sub}>Password must be 8–72 characters.</Text>
      <View style={styles.form}>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          error={fieldErrors.email}
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={fieldErrors.password}
        />
        <TextField
          label="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={fieldErrors.confirmPassword}
        />
        {banner ? <Text style={styles.banner}>{banner}</Text> : null}
        <Button label="Sign up" onPress={onSubmit} loading={isSigningUp} />
        <Button
          label="Already have an account"
          variant="ghost"
          onPress={() => router.push("/(auth)/login")}
        />
      </View>
    </Screen>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  title: {
    fontFamily: typography.bodyBold,
    fontSize: 32,
    letterSpacing: -0.6,
    color: colors.ink,
  },
  sub: {
    fontFamily: typography.body,
    fontSize: 16,
    color: colors.inkMuted,
    marginBottom: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
  banner: {
    fontFamily: typography.bodyMedium,
    color: colors.danger,
  },
});
}
