const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateDocumentation(repoSummary) {
  const prompt = `You are an assistant that writes developer-friendly documentation.\n\nGiven these file summaries, produce: README, API reference, module summaries, and an architecture overview:\n\n${JSON.stringify(
    repoSummary
  ).slice(0, 20000)}`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a documentation generator." },
      { role: "user", content: prompt },
    ],
    max_tokens: 1500,
  });
  // The openai npm interface may differ — adapt to the SDK version you use.
  return (
    completion.choices?.[0]?.message?.content ||
    completion.choices?.[0]?.text ||
    "No output"
  );
}

module.exports = { generateDocumentation };
