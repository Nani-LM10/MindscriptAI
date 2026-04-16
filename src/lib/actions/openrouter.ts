"use server";

// 🧠 Model priority (BEST → FALLBACK)
const MODELS = [
  "deepseek/deepseek-chat",        // best free
  "mistralai/mistral-7b-instruct", // stable
  "meta-llama/llama-3-8b-instruct",
  "openrouter/elephant",
];

// ⏱️ Timeout helper
function fetchWithTimeout(url: string, options: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(id));
}

// 🚀 Main generator with fallback chain
export async function generateWithOpenRouter(
  system: string,
  prompt: string
): Promise<string> {
  for (const model of MODELS) {
    try {
      console.log(`🧠 Trying model: ${model}`);

      const res = await fetchWithTimeout(
        "https://openrouter.ai/api/v1/chat/completions",
        {
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
        },
        8000 // ⏱️ timeout per model
      );

      if (!res.ok) {
        console.log(`❌ HTTP error (${res.status}) for ${model}`);
        continue;
      }

      const data = await res.json();

      const output = data?.choices?.[0]?.message?.content;

      if (output && output.trim().length > 0) {
        console.log(`✅ Success with ${model}`);
        return output.trim();
      } else {
        console.log(`⚠️ Empty response from ${model}`);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log(`⏱️ Timeout with ${model}`);
      } else {
        console.log(`❌ Failed with ${model}`);
      }
      continue;
    }
  }

  throw new Error("All OpenRouter models failed");
}