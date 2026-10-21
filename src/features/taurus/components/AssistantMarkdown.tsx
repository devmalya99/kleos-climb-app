import { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Markdown, { hasParents, type ASTNode, type RenderRules } from "react-native-markdown-display";

import { spacing, typography, useTheme } from "@/app/theme";
import { logger } from "@/services/logging/logger";

import { taurusChrome, type TaurusChrome } from "../utils/taurusChrome";

import { CodeBlock } from "./CodeBlock";

const MONO = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });
const HTTP_URL = /^https?:\/\//i;

type AssistantMarkdownProps = {
  text: string;
};

/**
 * GitHub-flavored markdown for a finished assistant reply.
 * Headings stay at section-title size so a model `#` cannot blow up the bubble.
 */
export function AssistantMarkdown({ text }: AssistantMarkdownProps) {
  const { scheme } = useTheme();
  const chrome = taurusChrome(scheme);
  const style = useMemo(() => markdownStyles(chrome), [chrome]);
  const markdownRules = useMemo(() => rules(chrome), [chrome]);

  return (
    <Markdown style={style} rules={markdownRules} onLinkPress={openLink}>
      {text}
    </Markdown>
  );
}

function openLink(url: string): boolean {
  if (!HTTP_URL.test(url)) return false;
  void WebBrowser.openBrowserAsync(url).catch((error) => {
    logger.error("Taurus link failed", error);
  });
  return false;
}

function rules(chrome: TaurusChrome): RenderRules {
  return {
    fence: (node) => (
      <CodeBlock
        key={node.key}
        code={trimTrailingNewline(node.content)}
        language={fenceLanguage(node)}
        chrome={chrome}
      />
    ),
    code_block: (node) => (
      <CodeBlock key={node.key} code={trimTrailingNewline(node.content)} language={null} chrome={chrome} />
    ),
    list_item: (node, children, parent, styles) => {
      const ordered = hasParents(parent, "ordered_list");
      return (
        <View key={node.key} style={styles._VIEW_SAFE_list_item}>
          <Text style={ordered ? styles.ordered_list_icon : styles.bullet_list_icon}>
            {ordered ? orderedMarker(parent, node.index) : "•"}
          </Text>
          <View
            style={
              ordered ? styles._VIEW_SAFE_ordered_list_content : styles._VIEW_SAFE_bullet_list_content
            }
          >
            {children}
          </View>
        </View>
      );
    },
  };
}

function fenceLanguage(node: ASTNode): string | null {
  const info = (node as ASTNode & { sourceInfo?: string }).sourceInfo?.trim().split(/\s+/)[0];
  return info ? info.toLowerCase() : null;
}

function trimTrailingNewline(content: string): string {
  return content.endsWith("\n") ? content.slice(0, -1) : content;
}

function orderedMarker(parent: ASTNode[], index: number): string {
  const list = [...parent].reverse().find((item) => item.type === "ordered_list");
  const start = Number(list?.attributes?.start ?? 1);
  const origin = Number.isFinite(start) ? start : 1;
  return `${origin + index}.`;
}

function markdownStyles(chrome: TaurusChrome) {
  const body = {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: chrome.ink,
  };
  const section = {
    fontFamily: typography.bodyBold,
    fontWeight: "normal" as const,
    fontSize: 16,
    lineHeight: 22,
    color: chrome.ink,
    marginTop: 0,
    marginBottom: spacing.xs,
  };
  const subhead = { ...section, fontSize: 14, lineHeight: 20 };

  return StyleSheet.create({
    body,
    paragraph: { marginTop: 0, marginBottom: spacing.sm },
    heading1: section,
    heading2: section,
    heading3: subhead,
    heading4: subhead,
    heading5: subhead,
    heading6: subhead,
    strong: { fontFamily: typography.bodyBold, fontWeight: "normal", color: chrome.ink },
    em: { fontFamily: typography.bodyItalic, fontStyle: "normal" },
    bullet_list: { marginBottom: spacing.xs },
    ordered_list: { marginBottom: spacing.xs },
    list_item: { flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.sm },
    bullet_list_icon: { ...body, color: chrome.cyan, marginRight: spacing.sm, marginLeft: 0 },
    ordered_list_icon: {
      ...body,
      fontFamily: typography.bodyMedium,
      color: chrome.cyan,
      minWidth: 22,
      marginRight: spacing.sm,
      marginLeft: 0,
    },
    bullet_list_content: { flex: 1 },
    ordered_list_content: { flex: 1 },
    link: { color: chrome.sky, textDecorationLine: "underline" },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: chrome.violet,
      backgroundColor: "transparent",
      marginLeft: 0,
      paddingHorizontal: 0,
      paddingLeft: spacing.sm,
      marginVertical: spacing.xs,
      fontFamily: typography.bodyItalic,
      fontStyle: "normal",
      color: chrome.muted,
    },
    hr: { backgroundColor: chrome.line, height: 1, marginVertical: spacing.sm },
    code_inline: {
      fontFamily: MONO,
      fontSize: 13,
      color: chrome.cyan,
      backgroundColor: chrome.codeChip,
      borderWidth: 0,
      padding: 0,
      paddingHorizontal: 5,
      paddingVertical: 1,
    },
  });
}
