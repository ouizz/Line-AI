import type { Request, Response } from "express";

import { askAI } from "../services/ai.service.js";
import { replyText } from "../services/line.service.js";

interface LineEvent {
  type: string;
  replyToken?: string;
  message?: {
    type: string;
    text?: string;
  };
}

interface LineWebhookBody {
  events?: LineEvent[];
}

export async function handleLineWebhook(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const body = req.body as LineWebhookBody;

    const events = body.events ?? [];

    // ตอบ LINE Platform ก่อน
    // เพื่อไม่ให้ webhook timeout
    res.status(200).json({
      status: "ok"
    });

    for (const event of events) {
      if (
        event.type !== "message" ||
        event.message?.type !== "text" ||
        !event.replyToken ||
        !event.message.text
      ) {
        continue;
      }

      const userMessage = event.message.text;

      console.log(
        "LINE message:",
        userMessage
      );

      const answer = await askAI(
        userMessage
      );

      await replyText(
        event.replyToken,
        answer
      );
    }
  } catch (error) {
    console.error(
      "LINE webhook error:",
      error
    );
  }
}