export function buildPrompt(userQuestion, knowledgeBase, systemRules) {
  return `
SYSTEM RULES:
${JSON.stringify(systemRules, null, 2)}

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

USER QUESTION:
${userQuestion}
`;
}
