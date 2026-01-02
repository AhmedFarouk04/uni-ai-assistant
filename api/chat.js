import "dotenv/config";
import OpenAI from "openai";
import { loadKnowledge } from "../lib/loadKnowledge.js";
import { buildPrompt } from "../lib/buildPrompt.js";
import { detectLanguage } from "../lib/detectLanguage.js";
import { normalizeQuestion } from "../lib/normalizeQuestion.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// بسيط جدًا: أسئلة عامة / مشاعر
function isGeneralEmotionQuestion(text) {
  const shortText = text.trim().split(/\s+/).length <= 4;
  return shortText;
}

export default async function chatHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1️⃣ تحديد اللغة
    const lang = detectLanguage(message);

    // 2️⃣ Normalize (typos)
    const normalizedMessage = normalizeQuestion(message);

    // 3️⃣ Load rules + knowledge
    const { knowledge, systemRules } = loadKnowledge();

    // 4️⃣ Build prompt
    const prompt = buildPrompt(normalizedMessage, knowledge, systemRules, lang);

    // 5️⃣ Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      max_tokens: 120,
      messages: [
        { role: "system", content: process.env.SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    const finalAnswer = completion.choices[0].message.content.trim();

    // 🛡️ 6️⃣ General / Emotion Guard
    if (
      isGeneralEmotionQuestion(message) &&
      (finalAnswer.includes("does not define a clear procedure") ||
        finalAnswer.includes("لا يحدد إجراء"))
    ) {
      return res.json({
        answer: lang === "en" ? "Sure, I'm here to help." : "أكيد، أنا معاك.",
      });
    }

    // 7️⃣ Normal response
    res.json({ answer: finalAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
