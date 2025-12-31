import "dotenv/config";
import OpenAI from "openai";
import { loadKnowledge } from "../lib/loadKnowledge.js";
import { buildPrompt } from "../lib/buildPrompt.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function chatHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const knowledgeBase = loadKnowledge();
    const systemRules = knowledgeBase.find((k) => k.platform);

    const prompt = buildPrompt(message, knowledgeBase, systemRules);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: process.env.SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 300,
    });

    res.json({
      answer: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
