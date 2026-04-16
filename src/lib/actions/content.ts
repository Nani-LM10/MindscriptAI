"use server";

// 🧠 Model priority (FIXED → stable chat models only)
const MODELS = [
  "deepseek/deepseek-chat",
  "mistralai/mistral-7b-instruct",
  "meta-llama/llama-3-8b-instruct",
];

// 🔧 Smart OpenRouter generator with fallback
async function generateWithFallback(system: string, prompt: string): Promise<string> {
  for (const model of MODELS) {
    try {
      console.log(`🧠 Trying model: ${model}`);

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        console.log(`❌ HTTP error (${res.status}) for ${model}`);
        continue;
      }

      const data = await res.json();
      const output = data?.choices?.[0]?.message?.content;

      if (output && output.trim()) {
        console.log(`✅ Success with ${model}`);
        return output;
      }
    } catch {
      console.log(`❌ Failed with ${model}`);
      continue;
    }
  }

  throw new Error("All models failed");
}

// 🧠 CLEAN + SAFE JSON PARSER (MAIN FIX)
function extractJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    try {
      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleaned);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }

      throw new Error("Invalid JSON response from model");
    }
  }
}

// 🧠 Shared system prompt
const BASE_SYSTEM = `
You are an expert academic research writer.

Write clear, structured, logical academic content.

Rules:
- No markdown
- No bullet points
- No citations
- Use paragraphs
- Avoid repetition
- Max one [IMAGE: prompt]
`;

// 🚀 FULL PAPER (1 call = optimized)
export async function generateFullPaperContent(
  mainTopic: string,
  sections: { id: string; title: string; subtopics: string[] }[],
  academicLevel: string
): Promise<Record<string, string>> {
  const system = `${BASE_SYSTEM}\nAcademic Level: ${academicLevel}`;

  const prompt = `
Generate full research content.

Topic: ${mainTopic}

Sections:
${sections.map(s => `${s.id}: ${s.title} → ${s.subtopics.join(", ")}`).join("\n")}

Return ONLY raw JSON (no markdown, no backticks):
{ "sectionId": "content" }

Requirements:
- Cover all subtopics
- Maintain flow
- Keep concise but meaningful
`;

  try {
    const text = await generateWithFallback(system, prompt);

    // ✅ FIXED parsing
    const parsed = extractJSON(text);

    return parsed;
  } catch (err) {
    console.error("Full content failed:", err);
    throw new Error("Failed to generate full paper content");
  }
}

// 🚀 SECTION GENERATION
export async function generateSectionContent(
  mainTopic: string,
  sectionTitle: string,
  subtopics: string[],
  academicLevel: string
): Promise<string> {
  const system = `${BASE_SYSTEM}\nAcademic Level: ${academicLevel}`;

  const prompt = `
Write a research section.

Topic: ${mainTopic}
Section: ${sectionTitle}

Subtopics:
${subtopics.map((s) => `- ${s}`).join("\n")}

Requirements:
- Cover all subtopics
- Smooth transitions
- Keep concise but informative
`;

  try {
    const text = await generateWithFallback(system, prompt);
    return text.trim();
  } catch (err) {
    console.error("Section generation failed:", err);
    return `Error generating section "${sectionTitle}".`;
  }
}