
import { GoogleGenAI } from "@google/genai";
import { ActionType } from "../types";

export const processImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  action: ActionType
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const actionText = action === ActionType.LIKE ? "thumb up" : "thumb down";
  
  const prompt = `Modify this image by adding a clear 'Right hand ${actionText}' gesture. 
  CRITICAL INSTRUCTIONS: 
  1. DO NOT change the person's face or facial expression. The face must be identical to the original.
  2. Keep the person's identity, hair, and clothing exactly the same as the source image.
  3. Remove the entire background and replace it with a clean, solid light green background.
  4. Only extend the picture to include the hand gesture; do not regenerate the person.`;

  // Extract base64 data (remove prefix if present)
  const base64Data = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No response parts received from Gemini");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response");
  } catch (error) {
    console.error("Gemini Processing Error:", error);
    throw error;
  }
};
