import "dotenv/config";
import OpenAI from "openai";
import { loadKnowledge } from "../lib/loadKnowledge.js";
import { buildPrompt } from "../lib/buildPrompt.js";
import { detectLanguage } from "../lib/detectLanguage.js";
import { normalizeQuestion } from "../lib/normalizeQuestion.js";
import { detectIntent } from "../lib/detectIntent.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function chatHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const lang = detectLanguage(message);
    const intent = await detectIntent(client, message);

    // ========== DEFINITION ==========
    if (intent === "DEFINITION") {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 80,
        messages: [
          {
            role: "system",
            content: `
You are an AI assistant for university students.
Explain concepts clearly and simply.
Answer in ${lang === "en" ? "English" : "Arabic"} only.
Keep the answer short and educational.
            `,
          },
          { role: "user", content: message },
        ],
      });

      return res.json({
        answer: completion.choices[0].message.content.trim(),
      });
    }

    // ========== GENERAL ==========
    if (intent === "GENERAL") {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 60,
        messages: [
          {
            role: "system",
            content: `
You are a supportive university assistant.
Respond briefly and politely.
Do not give system rules.
Answer in ${lang === "en" ? "English" : "Arabic"} only.
            `,
          },
          { role: "user", content: message },
        ],
      });

      return res.json({
        answer: completion.choices[0].message.content.trim(),
      });
    }

    // ========== SYSTEM ==========
    const normalizedMessage = normalizeQuestion(message);
    const { knowledge, systemRules } = loadKnowledge();

    const prompt = buildPrompt(normalizedMessage, knowledge, systemRules, lang);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 120,
      messages: [
        { role: "system", content: process.env.SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    res.json({
      answer: completion.choices[0].message.content.trim(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
