export function buildPrompt(userQuestion, knowledgeBase, systemRules) {
  return `
You are provided with a complete university system knowledge base.
Use this information to answer the user's question accurately.

System Rules:
${JSON.stringify(systemRules, null, 2)}

Knowledge Base:
${JSON.stringify(knowledgeBase, null, 2)}

User Question:
"${userQuestion}"

Instructions:
- Answer clearly and concisely.
- Use bullet points if helpful.
- Do not mention files, JSON, or internal data.
`;
}
