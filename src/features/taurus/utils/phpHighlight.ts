export type PhpTokenKind =
  | "plain"
  | "tag"
  | "comment"
  | "string"
  | "variable"
  | "keyword"
  | "number";

export type PhpToken = {
  kind: PhpTokenKind;
  text: string;
};

const PHP_KEYWORDS = new Set([
  "abstract",
  "and",
  "array",
  "as",
  "break",
  "case",
  "catch",
  "class",
  "clone",
  "const",
  "continue",
  "declare",
  "default",
  "do",
  "echo",
  "else",
  "elseif",
  "empty",
  "enum",
  "extends",
  "false",
  "final",
  "finally",
  "fn",
  "for",
  "foreach",
  "function",
  "global",
  "if",
  "implements",
  "include",
  "include_once",
  "instanceof",
  "interface",
  "isset",
  "match",
  "namespace",
  "new",
  "null",
  "or",
  "print",
  "private",
  "protected",
  "public",
  "readonly",
  "require",
  "require_once",
  "return",
  "static",
  "switch",
  "throw",
  "trait",
  "true",
  "try",
  "unset",
  "use",
  "var",
  "while",
  "xor",
  "yield",
]);

/** Comments and strings before words, so a keyword inside a string stays a string. */
const TOKEN =
  /\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|<\?(?:php|=)?|\?>|\$[A-Za-z_][A-Za-z0-9_]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b/g;

/** Small PHP highlighter. Other languages stay plain so the panel needs no syntax library. */
export function highlightPhp(source: string): PhpToken[] {
  const tokens: PhpToken[] = [];
  let cursor = 0;

  for (const match of source.matchAll(TOKEN)) {
    const text = match[0];
    const index = match.index ?? 0;
    if (index > cursor) {
      tokens.push({ kind: "plain", text: source.slice(cursor, index) });
    }
    tokens.push({ kind: kindFor(text), text });
    cursor = index + text.length;
  }

  if (cursor < source.length) {
    tokens.push({ kind: "plain", text: source.slice(cursor) });
  }

  return tokens;
}

function kindFor(text: string): PhpTokenKind {
  if (text.startsWith("<?") || text === "?>") return "tag";
  if (text.startsWith("/*") || text.startsWith("//") || text.startsWith("#")) return "comment";
  if (text.startsWith("'") || text.startsWith('"')) return "string";
  if (text.startsWith("$")) return "variable";
  if (/^\d/.test(text)) return "number";
  if (PHP_KEYWORDS.has(text.toLowerCase())) return "keyword";
  return "plain";
}
