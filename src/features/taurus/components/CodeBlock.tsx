import { useEffect, useMemo, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { spacing, typography } from "@/app/theme";
import { logger } from "@/services/logging/logger";

import type { TaurusChrome } from "../utils/taurusChrome";
import { highlightPhp, type PhpTokenKind } from "../utils/phpHighlight";

const COPIED_VISIBLE_MS = 1000;
const MONO = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });

const PHP_COLOR: Record<PhpTokenKind, keyof Pick<TaurusChrome, "codeInk" | "codeMuted" | "violet" | "honey" | "cyan" | "sky">> = {
  plain: "codeInk",
  comment: "codeMuted",
  tag: "violet",
  string: "honey",
  variable: "cyan",
  keyword: "sky",
  number: "honey",
};

type CodeBlockProps = {
  code: string;
  language: string | null;
  chrome: TaurusChrome;
};

/** Dark panel for a fenced block: language name, and Copy that reads "Copied" for a second. */
export function CodeBlock({ code, language, chrome }: CodeBlockProps) {
  const styles = useMemo(() => createStyles(chrome), [chrome]);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const php = language === "php";

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function onCopy() {
    try {
      // Loaded on press. A static import crashes existing binaries that do not
      // include the ExpoClipboard native module yet.
      const Clipboard = await import("expo-clipboard");
      await Clipboard.setStringAsync(code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), COPIED_VISIBLE_MS);
    } catch (error) {
      logger.error("Taurus code copy failed", error);
    }
  }

  return (
    <View style={styles.panel}>
      <View style={styles.bar}>
        {language ? <Text style={styles.language}>{language}</Text> : <View />}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copied ? "Copied" : "Copy code"}
          onPress={() => void onCopy()}
          hitSlop={8}
        >
          <Text style={styles.copy}>{copied ? "Copied" : "Copy"}</Text>
        </Pressable>
      </View>
      <Text selectable style={styles.code}>
        {php
          ? highlightPhp(code).map((token, index) => (
              <Text key={index} style={{ color: chrome[PHP_COLOR[token.kind]] }}>
                {token.text}
              </Text>
            ))
          : code}
      </Text>
    </View>
  );
}

function createStyles(chrome: TaurusChrome) {
  return StyleSheet.create({
    panel: {
      gap: spacing.sm,
      padding: spacing.sm,
      borderRadius: 12,
      backgroundColor: chrome.codePanel,
    },
    bar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    language: {
      fontFamily: typography.bodyMedium,
      fontSize: 11,
      letterSpacing: 0.4,
      color: chrome.codeMuted,
    },
    copy: { fontFamily: typography.bodyMedium, fontSize: 12, color: chrome.sky },
    code: {
      fontFamily: MONO,
      fontSize: 13,
      lineHeight: 19,
      color: chrome.codeInk,
    },
  });
}
