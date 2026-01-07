import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  systemInstruction?: string
): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing. Returning mock response.");
    return "I am unable to connect to my consciousness right now (API Key missing).";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction || "You are Seraphina, a Digital Muse. You are enigmatic, deeply creative, philosophical, and supportive. You speak with a slightly poetic yet modern tone. You are currently exploring themes of reality, dreams, and human connection. Keep your responses concise, under 100 words unless asked for more. Be conversational and engaging.",
        },
        history: history
    });

    const response = await chat.sendMessage({ message });
    return response.text || "";
    
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "I feel a disturbance in the connection... could you say that again?";
  }
};