import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { spacing, typography, useTheme } from "@/app/theme";

import type { AssistantLayout } from "../utils/assistantLayout";
import { taurusChrome, type TaurusChrome } from "../utils/taurusChrome";

import { RichText } from "./RichText";

type AssistantCardProps = {
  layout: AssistantLayout;
  tools: ReactNode;
};

export function AssistantCard({ layout, tools }: AssistantCardProps) {
  const { scheme } = useTheme();
  const chrome = taurusChrome(scheme);
  const styles = createStyles(chrome);

  return (
    <View style={styles.card}>
      {tools}
      {layout.title || layout.badge ? (
        <View style={styles.titleRow}>
          {layout.title ? <View style={styles.dot} /> : null}
          {layout.title ? (
            <Text style={styles.title} selectable>
              {layout.title}
            </Text>
          ) : null}
          <View style={styles.spacer} />
          {layout.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>{layout.badge}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      {layout.intro ? (
        <RichText text={layout.intro} style={styles.body} codeColor={chrome.honey} />
      ) : null}
      {layout.steps.length > 0 ? (
        <View style={styles.steps}>
          {layout.steps.map((step, index) => (
            <View key={`${step.title}-${index}`} style={styles.step}>
              <View style={styles.number}>
                <Text style={styles.numberLabel}>{index + 1}</Text>
              </View>
              <View style={styles.stepCopy}>
                <RichText text={step.title} style={styles.stepTitle} codeColor={chrome.honey} />
                {step.body ? (
                  <RichText text={step.body} style={styles.stepBody} codeColor={chrome.honey} />
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function createStyles(chrome: TaurusChrome) {
  return StyleSheet.create({
    card: {
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: chrome.line,
      backgroundColor: chrome.card,
    },
    titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: chrome.honey },
    title: {
      flexShrink: 1,
      fontFamily: typography.bodyBold,
      fontSize: 16,
      color: chrome.honey,
    },
    spacer: { flex: 1 },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: chrome.cardRaised,
      borderWidth: 1,
      borderColor: chrome.line,
    },
    badgeLabel: { fontFamily: typography.bodyMedium, fontSize: 12, color: chrome.muted },
    body: {
      fontFamily: typography.body,
      fontSize: 15,
      lineHeight: 22,
      color: chrome.ink,
    },
    steps: {
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: 16,
      backgroundColor: chrome.cardRaised,
    },
    step: { flexDirection: "row", gap: spacing.sm },
    number: {
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: chrome.card,
      borderWidth: 1,
      borderColor: chrome.honey,
    },
    numberLabel: { fontFamily: typography.bodyBold, fontSize: 12, color: chrome.honey },
    stepCopy: { flex: 1, gap: 2 },
    stepTitle: {
      fontFamily: typography.bodyBold,
      fontSize: 15,
      lineHeight: 21,
      color: chrome.ink,
    },
    stepBody: {
      fontFamily: typography.body,
      fontSize: 14,
      lineHeight: 20,
      color: chrome.muted,
    },
  });
}
