export function buildPrompt(userQuestion, knowledgeBase, systemRules, lang) {
  const FALLBACK =
    lang === "en"
      ? "The system does not define a clear procedure for this case."
      : "النظام لا يحدد إجراءً واضحًا لهذه الحالة.";

  return `
IMPORTANT:
- Answer ONLY in ${lang === "en" ? "English" : "Arabic"}.
- Answer in the SAME language as the user's question.
- If the intent is clear but contains spelling mistakes or informal wording, interpret it correctly.
- Respond with "${FALLBACK}" ONLY if the intent itself is unclear or not covered.

SYSTEM RULES:
${JSON.stringify(systemRules, null, 2)}

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

USER QUESTION:
${userQuestion}
`;
}
