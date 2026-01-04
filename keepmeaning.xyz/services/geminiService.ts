import { GoogleGenAI, Type } from "@google/genai";
import { MeaningFragment, SimplificationResult } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Constants for Models
const FAST_MODEL = 'gemini-3-flash-preview';
const DEEP_MODEL = 'gemini-3-pro-preview';

/**
 * Perform a deep check for logical fragility using the "Meaning Map" feature.
 */
export const analyzeMeaningMap = async (text: string): Promise<MeaningFragment[]> => {
  if (!text.trim()) return [];

  const prompt = `
  Analyze this text for logical fragility. Identify:
  1. Ambiguous claims that need clarification
  2. Unsupported assertions requiring evidence
  3. Vague pronouns with unclear antecedents
  4. Logical gaps in argument flow
  
  Text: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEEP_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['ambiguous-claim', 'unsupported-assertion', 'vague-pronoun', 'logical-gap'] },
              snippet: { type: Type.STRING, description: "The exact substring from the text that corresponds to this issue." },
              severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
              suggestion: { type: Type.STRING },
              reasoning: { type: Type.STRING },
            },
            required: ['type', 'snippet', 'severity', 'suggestion', 'reasoning']
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");
    
    // Post-process to find indices (basic implementation, prone to repeated substring errors but functional for demo)
    return rawData.map((item: any, index: number) => ({
      ...item,
      id: `cloud-${index}`,
      location: {
        start: text.indexOf(item.snippet),
        end: text.indexOf(item.snippet) + item.snippet.length
      }
    })).filter((item: any) => item.location.start !== -1);

  } catch (error) {
    console.error("Meaning Map Analysis Failed:", error);
    return [];
  }
};

/**
 * Adjust tone using streaming for real-time feedback (Tone Dial).
 */
export const adjustToneStream = async (text: string, formality: number, onChunk: (chunk: string) => void) => {
  const prompt = `
  Rewrite the following text to match a Formality Level of ${formality.toFixed(1)}/1.0.
  0.0 is extremely casual/slang. 1.0 is academic/legal formal.
  Maintain the core meaning. Do not add conversational filler unless requested by low formality.
  
  Text: "${text}"
  
  Return ONLY the rewritten text.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: FAST_MODEL,
      contents: prompt,
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Tone Dial Failed:", error);
  }
};

/**
 * Simplify text based on a persona ("Talk Like I'm Five").
 */
export const simplifyText = async (text: string, personaType: string): Promise<SimplificationResult | null> => {
  const prompt = `
  Simplify this text for a "${personaType}" audience.
  Include 1-2 analogies if helpful. Identify jargon.

  Text: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            simplified: { type: Type.STRING },
            analogies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                    concept: { type: Type.STRING },
                    analogy: { type: Type.STRING },
                    relevance: { type: Type.NUMBER }
                }
              }
            },
            jargonMap: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        term: { type: Type.STRING },
                        simplified: { type: Type.STRING }
                    }
                }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "null");
  } catch (error) {
    console.error("Simplification Failed:", error);
    return null;
  }
};
