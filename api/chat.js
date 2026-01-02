import "dotenv/config";
import OpenAI from "openai";
import { loadKnowledge } from "../lib/loadKnowledge.js";
import { buildPrompt } from "../lib/buildPrompt.js";
import { detectLanguage } from "../lib/detectLanguage.js";
import { normalizeQuestion } from "../lib/normalizeQuestion.js";

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

    const normalizedMessage = normalizeQuestion(message);

    const { knowledge, systemRules } = loadKnowledge();

    const prompt = buildPrompt(normalizedMessage, knowledge, systemRules, lang);

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

    res.json({ answer: finalAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
