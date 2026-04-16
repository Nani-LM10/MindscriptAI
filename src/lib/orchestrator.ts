"use server";

import { generateSectionContent } from "./actions/content";
import { generateImage } from "./actions/images";
import type { DocumentOutline, Topic } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GenerateAllResult {
  outline: DocumentOutline;
  generatedImages: string[];
}

export interface GenerateAllProgress {
  completed: number;
  total: number;
  phase: "content" | "images" | "done";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function batchParallel<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map((item, j) => fn(item, i + j))
    );

    results.push(...batchResults);
  }

  return results;
}

// 🧠 Extract image prompts from content
function extractOrBuildImagePrompts(
  outline: DocumentOutline,
  count: number
): string[] {
  const regex = /\[IMAGE:\s*([^\]]+)\]/gi;
  const found: string[] = [];

  for (const section of outline.sections) {
    const content = (section as { content?: string }).content || "";
    const matches = [...content.matchAll(regex)];

    for (const match of matches) {
      found.push(match[1].trim());
      if (found.length >= count) break;
    }

    if (found.length >= count) break;
  }

  const fallback = [
    `A professional illustration representing "${outline.mainTopic}"`,
    `A clean academic diagram explaining "${outline.mainTopic}"`,
  ];

  while (found.length < count) {
    found.push(fallback[found.length % fallback.length]);
  }

  return found.slice(0, count);
}

// 🧠 Remove placeholders before UI render
function stripImagePlaceholders(content: string): string {
  return content.replace(/\[IMAGE:\s*[^\]]+\]/gi, "").trim();
}

// ─── MAIN ORCHESTRATOR ───────────────────────────────────────────────────────

export async function generateAll(
  outline: DocumentOutline,
  topicInfo: Topic,
  onProgress?: (progress: GenerateAllProgress) => void
): Promise<GenerateAllResult> {
  const selectedSections = outline.sections.filter((s) => s.isSelected);

  const total = selectedSections.length;
  let completed = 0;

  onProgress?.({ completed: 0, total, phase: "content" });

  // Record<sectionId, Record<subtopicTitle, content>>
  const contentMap = new Map<string, Record<string, string>>();

  // 🚀 Generate sections (batched + retry)
  await batchParallel(selectedSections, 2, async (section) => {
    let subtopicMap: Record<string, string> = {};

    for (let i = 0; i < 2; i++) {
      try {
        subtopicMap = await generateSectionContent(
          outline.mainTopic,
          section.title,
          section.subtopics.map((st) => st.title),
          topicInfo.academicLevel ?? "Undergraduate"
        );
        break;
      } catch (err) {
        if (i === 1) {
          console.error(`Failed section "${section.title}"`, err);
          // Provide stub content for each subtopic
          subtopicMap = Object.fromEntries(
            section.subtopics.map((st) => [st.title, `Failed to generate "${st.title}"`])
          );
        }
      }
    }

    contentMap.set(section.id, subtopicMap);

    completed++;
    onProgress?.({ completed, total, phase: "content" });
  });

  // 🧩 Merge per-subtopic content into sections
  const updatedOutline: DocumentOutline = {
    ...outline,
    sections: outline.sections.map((section) => {
      const subtopicMap = contentMap.get(section.id);
      if (!subtopicMap) return section;

      return {
        ...section,
        content: undefined as string | undefined, // clear flat blob
        subtopics: section.subtopics.map((st) => {
          const exactKey = Object.keys(subtopicMap).find(
            (k) => k.toLowerCase() === st.title.toLowerCase()
          );
          const fuzzyKey = exactKey ??
            Object.keys(subtopicMap).find((k) =>
              k.toLowerCase().includes(st.title.toLowerCase().slice(0, 10)) ||
              st.title.toLowerCase().includes(k.toLowerCase().slice(0, 10))
            );
          const raw = fuzzyKey ? subtopicMap[fuzzyKey] : "";
          return {
            ...st,
            content: raw ? stripImagePlaceholders(raw) : st.content,
          };
        }),
      };
    }),
  };

  // ─── IMAGE GENERATION (ALWAYS 2 IMAGES) ─────────────────────────────────────

  const imageCount = 2; // 🔥 Always 2 (your requirement)

  let generatedImages: string[] = [];

  onProgress?.({ completed, total, phase: "images" });

  const prompts = extractOrBuildImagePrompts(updatedOutline, imageCount);

  const results = await batchParallel(prompts, 2, async (prompt) => {
    return generateImage(prompt);
  });

  generatedImages = results.filter((img): img is string => !!img);

  onProgress?.({ completed: total, total, phase: "done" });

  return {
    outline: updatedOutline,
    generatedImages,
  };
}