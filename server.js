import express from "express";
import dotenv from "dotenv";
import chatHandler from "./api/chat.js";

dotenv.config();

const app = express();
app.use(express.json());

// route محلي بدل Vercel
app.post("/api/chat", (req, res) => {
  return chatHandler(req, res);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Local server running on http://localhost:${PORT}`);
});
