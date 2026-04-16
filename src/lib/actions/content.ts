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

// 🧠 CLEAN + SAFE JSON PARSER
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
      if (match) return JSON.parse(match[0]);
      throw new Error("Invalid JSON response from model");
    }
  }
}

// 🧠 Shared system prompt
const BASE_SYSTEM = `
You are an expert academic research writer.

Write detailed, well-structured, flowing academic content.

Rules:
- No markdown
- No bullet points
- No citations
- Use paragraphs only
- Avoid repetition
- Each piece of content must be thorough and substantive
`;

// Words per subtopic based on document length selection
function wordsPerSubtopic(documentLength?: number): number {
  if (!documentLength) return 200;
  if (documentLength <= 4) return 160;   // Short  (~1 page / 3 subtopics)
  if (documentLength <= 8) return 220;   // Medium (~1 page / 3 subtopics)
  return 300;                            // Long   (~1 page / 3 subtopics)
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Generate content for a FULL PAPER in a single API call.
 *
 * Returns: Record<sectionId, Record<subtopicTitle, content>>
 * Each subtopic gets its own, independently generated content block.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function generateFullPaperContent(
  mainTopic: string,
  sections: { id: string; title: string; subtopics: string[] }[],
  academicLevel: string,
  documentLength?: number
): Promise<Record<string, Record<string, string>>> {
  const wpSt = wordsPerSubtopic(documentLength);

  const system = `${BASE_SYSTEM}\nAcademic Level: ${academicLevel}`;

  // Build a flat list of every section + subtopic pair so the model writes each separately
  const subtopicList = sections.flatMap((s) =>
    s.subtopics.map((st) => `${s.id}__${st}`)
  );

  const prompt = `
Generate academic content for a research paper on: "${mainTopic}"

For EVERY item below, write exactly ${wpSt}–${wpSt + 80} words of flowing academic prose (NO bullet points, NO headers, NO markdown).

Items (format: sectionId__subtopicTitle):
${subtopicList.join("\n")}

Return ONLY valid raw JSON in this exact shape (no backticks, no markdown):
{
  "sectionId": {
    "subtopicTitle": "content paragraphs here"
  }
}

Critical rules:
- EVERY sectionId and EVERY subtopicTitle listed above MUST appear as a key
- Each subtopic value must be ${wpSt} words minimum — 2 full paragraphs
- Do NOT skip any subtopic
- Only plain prose in the content strings
`;

  try {
    const text = await generateWithFallback(system, prompt);
    const parsed = extractJSON(text);
    return parsed as Record<string, Record<string, string>>;
  } catch (err) {
    console.error("Full content failed:", err);
    throw new Error("Failed to generate full paper content");
  }
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Regenerate content for a SINGLE SECTION.
 *
 * Returns: Record<subtopicTitle, content>
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function generateSectionContent(
  mainTopic: string,
  sectionTitle: string,
  subtopics: string[],
  academicLevel: string,
  documentLength?: number
): Promise<Record<string, string>> {
  const wpSt = wordsPerSubtopic(documentLength);

  const system = `${BASE_SYSTEM}\nAcademic Level: ${academicLevel}`;

  const prompt = `
Write academic content for section "${sectionTitle}" in a paper on: "${mainTopic}"

Write SEPARATELY for each subtopic below (${wpSt}–${wpSt + 80} words each, 2 full paragraphs min):
${subtopics.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Return ONLY valid raw JSON (no backticks, no markdown):
{
  "subtopicTitle": "content paragraphs"
}

Rules:
- Every subtopic listed MUST have its own key and ${wpSt}+ words
- Plain academic prose only, no bullet points
`;

  try {
    const text = await generateWithFallback(system, prompt);
    const parsed = extractJSON(text);
    return parsed as Record<string, string>;
  } catch (err) {
    console.error("Section generation failed:", err);
    // Return a stub so partial content still shows
    return Object.fromEntries(
      subtopics.map((st) => [st, `Error generating content for "${st}".`])
    );
  }
}