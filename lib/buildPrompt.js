export function buildPrompt(userQuestion, knowledgeBase, systemRules) {
  const isEnglish = /^[\x00-\x7F]*$/.test(userQuestion);

  return `
IMPORTANT:
- Answer ONLY in ${isEnglish ? "English" : "Arabic"}.

SYSTEM RULES:
${JSON.stringify(systemRules, null, 2)}

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

USER QUESTION:
${userQuestion}
`;
}
