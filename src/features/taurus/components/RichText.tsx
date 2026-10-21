import { Text, type TextStyle } from "react-native";

import { typography } from "@/app/theme";

type RichTextProps = {
  text: string;
  style: TextStyle;
  codeColor: string;
};

/** Renders `code` and **bold** spans inside assistant copy. */
export function RichText({ text, style, codeColor }: RichTextProps) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);

  return (
    <Text style={style} selectable>
      {parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <Text key={index} style={[style, codeStyle(codeColor)]}>
              {part.slice(1, -1)}
            </Text>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <Text key={index} style={[style, { fontFamily: typography.bodyBold }]}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        return part;
      })}
    </Text>
  );
}

function codeStyle(color: string): TextStyle {
  return { fontFamily: "monospace", color };
}
