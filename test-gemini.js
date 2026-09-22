import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const ai = new GoogleGenAI({
  apiKey
});

const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-lite",
  contents: "สวัสดีครับ ผมชื่อวีระ คุณช่วยอะไรผมได้บ้าง",
  config: {
    systemInstruction:
      "ตอบเป็นภาษาไทยแบบสุภาพ เป็นมิตร และกระชับ"
  }
});

console.log("Response:");
console.log(response.text);