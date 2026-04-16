"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 🧠 Ensure consistent image quality
function enhancePrompt(prompt: string) {
  return `
High quality illustration, clean, modern, professional.

${prompt}

Style:
- minimal
- no text overlay
- high clarity
- visually structured
`;
}

export async function generateImage(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-image",
    });

    const enhancedPrompt = enhancePrompt(prompt);

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;

    const part = response.candidates?.[0]?.content?.parts?.[0];

    // 🛡️ Handle different formats safely
    if (part?.inlineData?.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }

    console.log("⚠️ No image data returned");
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}