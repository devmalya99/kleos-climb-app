import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme, type AppColors } from "@/app/theme";
import { getErrorMessage } from "@/services/api";
import { Button } from "@/shared/components/Button";
import { Screen } from "@/shared/components/Screen";
import { TextField } from "@/shared/components/TextField";

import { useAuth } from "../hooks/useAuth";
import { loginSchema } from "../utils/auth.schemas";

export function LoginScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { login, isLoggingIn, loginError, startGoogleAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<string | null>(null);

  async function onSubmit() {
    setBanner(null);
    const parsed = loginSchema.safeParse({ email, password });
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
      await login(parsed.data);
      router.replace("/(tabs)");
    } catch (error) {
      setBanner(
        getErrorMessage(error) ||
          loginError ||
          (error instanceof Error ? error.message : "Login failed"),
      );
    }
  }

  async function onGoogle() {
    setBanner(null);
    const result = await startGoogleAuth();
    if (!result.ok) {
      setBanner(result.error);
      return;
    }
    router.replace("/(tabs)");
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <Text style={styles.title}>Log in</Text>
      <Text style={styles.sub}>Pick up your campaigns where you left off.</Text>
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
        {banner ? <Text style={styles.banner}>{banner}</Text> : null}
        <Button label="Continue" onPress={onSubmit} loading={isLoggingIn} />
        <Button label="Continue with Google" variant="secondary" onPress={onGoogle} />
        <Button
          label="Create an account"
          variant="ghost"
          onPress={() => router.push("/(auth)/signup")}
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
