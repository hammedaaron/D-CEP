
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async analyzeEngagement(postUrl: string, description: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `As an engagement specialist for high-ticket pods, analyze this post and give 3 rapid tips to boost its reach. 
        Post URL: ${postUrl}
        Context: ${description}
        
        Return the response as a simple bulleted list.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to analyze content at this moment.";
    }
  }
};
