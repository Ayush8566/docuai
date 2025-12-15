const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateDocumentation(repoSummary) {
  const prompt = `Generate detailed documentation from: ${JSON.stringify(repoSummary).slice(0, 20000)}`;
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'system', content: 'You generate documentation.' }, { role: 'user', content: prompt }],
    max_tokens: 1500
  });
  return completion.choices?.[0]?.message?.content || "No output";
}

module.exports = { generateDocumentation };
