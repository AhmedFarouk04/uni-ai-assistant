export async function detectIntent(client, message) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    max_tokens: 5,
    messages: [
      {
        role: "system",
        content: `
Classify the user's question into ONE of the following intents only.
Respond with ONE WORD.

DEFINITION: asking for meaning or explanation (what is, يعني ايه, ما معنى)
SYSTEM: asking about rules, limits, actions, procedures
GENERAL: emotions, confusion, greetings
        `,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion.choices[0].message.content.trim();
}
