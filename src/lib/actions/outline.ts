"use server";

import { z } from "zod";
import type { DocumentOutline, Section } from "@/lib/types";
import { nanoid } from "nanoid";
import { generateWithOpenRouter } from "./openrouter";

// 🧠 Schema
const aiSectionSchema = z.object({
  title: z.string(),
  subtopics: z.array(z.string()),
});

const aiOutlineSchema = z.object({
  sections: z.array(aiSectionSchema),
});

// 🧠 System prompt (optimized)
const SYSTEM = `
You are an expert academic research planner.

Create a clean, structured research outline.

Rules:
- EXACT number of sections required
- Each section = major part of research
- Each section has 2–3 subtopics
- Keep structure simple and logical
- No explanations

Return ONLY raw JSON (no markdown, no backticks):
{ "sections": [{ "title": "", "subtopics": [] }] }
`;

// 🛡️ ROBUST JSON EXTRACTOR (FIXED)
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

      throw new Error("Invalid JSON response");
    }
  }
}

export async function generateAIOutline(
  topic: string,
  academicLevel: string,
  documentLength: number
): Promise<DocumentOutline> {
  try {
    const prompt = `
Generate a research outline.

Topic: ${topic}
Academic Level: ${academicLevel}
Sections: ${documentLength}

Requirements:
- EXACTLY ${documentLength} sections
- Proper academic headings
- Logical progression
`;

    const text = await generateWithOpenRouter(SYSTEM, prompt);

    // ✅ FIXED parsing
    const parsed = extractJSON(text);

    // ✅ Validate structure
    const validated = aiOutlineSchema.parse(parsed);

    const sections = validated.sections.map((section) => ({
      id: nanoid(5),
      title: section.title,
      isSelected: true,
      subtopics: section.subtopics.map((subtopicTitle) => ({
        id: nanoid(5),
        title: subtopicTitle,
        isSelected: true,
        content: "",
      })),
    }));

    return {
      mainTopic: topic,
      sections,
    };
  } catch (error) {
    console.error("Error generating AI outline:", error);
    return generateStaticOutline(topic);
  }
}

// 🧩 Fallback
function generateStaticOutline(topic: string): DocumentOutline {
  const sections: Section[] = [
    {
      id: "1",
      title: "Introduction",
      isSelected: true,
      subtopics: [
        {
          id: "1-1",
          title: "Background",
          isSelected: true,
          content: `This section provides a background on ${topic}.`,
        },
        {
          id: "1-2",
          title: "Objective",
          isSelected: true,
          content: `This section defines the objective of ${topic}.`,
        },
      ],
    },
  ];

  return {
    mainTopic: topic,
    sections,
  };
}