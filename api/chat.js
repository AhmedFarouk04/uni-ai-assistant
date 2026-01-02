import "dotenv/config";
import OpenAI from "openai";
import { loadKnowledge } from "../lib/loadKnowledge.js";
import { buildPrompt } from "../lib/buildPrompt.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AR_FALLBACK = "النظام لا يحدد إجراءً واضحًا لهذه الحالة";
const EN_FALLBACK =
  "The system does not define a clear procedure for this case.";

function normalizeFallback(answer, userQuestion) {
  const isEnglish = /^[\x00-\x7F]*$/.test(userQuestion);
  const normalized = answer.replace(/\s+/g, " ").trim();

  if (
    isEnglish &&
    normalized.includes("النظام لا يحدد إجراءً واضحًا لهذه الحالة")
  ) {
    return "The system does not define a clear procedure for this case.";
  }

  return answer;
}

// ============================================================

export default async function chatHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const { knowledge, systemRules } = loadKnowledge();

    const prompt = buildPrompt(message, knowledge, systemRules);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_tokens: 120,
      messages: [
        { role: "system", content: process.env.SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    const rawAnswer = completion.choices[0].message.content.trim();
    const finalAnswer = normalizeFallback(rawAnswer, message);

    res.json({
      answer: finalAnswer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
