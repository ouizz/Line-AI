// import OpenAI from "openai";
// import { env } from "../config/env.js";

// const openai = new OpenAI({
//   apiKey: env.openai.apiKey
// });

// const SYSTEM_INSTRUCTIONS = `
// คุณคือ AI Assistant สำหรับ LINE Official Account

// หน้าที่:
// - ตอบคำถามของลูกค้า
// - ใช้ภาษาไทยเป็นหลัก
// - สุภาพ เป็นมิตร และเข้าใจง่าย
// - ตอบกระชับ ไม่ยาวเกินความจำเป็น
// - หากไม่มีข้อมูลเพียงพอ ห้ามแต่งข้อมูลขึ้นมา
// - หากไม่ทราบคำตอบ ให้แจ้งลูกค้าตามตรง
// `;

// export async function askAI(
//   message: string
// ): Promise<string> {
//   try {
//     const response = await openai.responses.create({
//       model: "gpt-5",
//       instructions: SYSTEM_INSTRUCTIONS,
//       input: message
//     });

//     return response.output_text.trim();
//   } catch (error) {
//     console.error("OpenAI error:", error);

//     throw new Error("AI service failed");
//   }
// }

import { GoogleGenAI } from "@google/genai";

import { env } from "../config/env.js";

const ai = new GoogleGenAI({
  apiKey: env.gemini.apiKey
});

export async function askAI(
  message: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",

      contents: message,

      config: {
        systemInstruction: `
คุณคือ AI Assistant ของ LINE Official Account

หน้าที่:
- ตอบคำถามของผู้ใช้อย่างสุภาพ
- ตอบเป็นภาษาไทย
- เป็นมิตรและเข้าใจง่าย
- ตอบให้กระชับ
- หากไม่ทราบข้อมูล ห้ามแต่งข้อมูลขึ้นมา
        `.trim()
      }
    });

    const answer = response.text?.trim();

    if (!answer) {
      throw new Error(
        "Gemini returned empty response"
      );
    }

    return answer;
  } catch (error) {
    console.error("Gemini error:", error);

    throw new Error(
      "AI service failed"
    );
  }
}