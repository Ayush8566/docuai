import express from "express";

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
import cors from "cors";

const FRONTEND_URL = process.env.FRONTEND_URL || "*";
app.use(cors({ origin: FRONTEND_URL }));

app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn(
    "WARNING: OPENAI_API_KEY is not set. Set it in backend/.env or env vars."
  );
}

app.post("/generate", async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY not set on server." });
  }

  const {
    projectCategory = "",
    clientName = "",
    goals = "",
    budget = "",
  } = req.body;

  const prompt = `You are an expert proposal writer for digital agencies.
Write a concise, well-structured project proposal for the following input.
Project category: ${projectCategory}
Client name: ${clientName}
Goals: ${goals}
Budget: ${budget}
Include: Executive summary, Problem statement, Proposed solution, Scope, Timeline (weeks), Deliverables, Suggested tech stack, Pricing band.
Keep it short, professional, and suitable for sending to a client.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // replace with a model you have access to (e.g., "gpt-4o-mini" or "gpt-4o" or "gpt-4.1")
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that writes agency proposals.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 800,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("OpenAI response error:", txt);
      return res.status(500).json({ error: "OpenAI API error", detail: txt });
    }

    const data = await response.json();
    const output =
      data.choices?.[0]?.message?.content ?? "No response from model.";
    res.json({ proposal: output });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
