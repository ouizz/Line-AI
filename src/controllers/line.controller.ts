import crypto from "node:crypto";

import type {
  Request,
  Response
} from "express";

import { env } from "../config/env.js";
import { askAI } from "../services/ai.service.js";
import { replyText } from "../services/line.service.js";

interface LineMessage {
  type: string;
  text?: string;
}

interface LineEvent {
  type: string;
  replyToken?: string;
  message?: LineMessage;
}

interface LineWebhookBody {
  events?: LineEvent[];
}

function verifySignature(
  body: Buffer,
  signature: string
): boolean {
  const hash = crypto
    .createHmac(
      "sha256",
      env.line.channelSecret
    )
    .update(body)
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(signature)
  );
}

export async function handleLineWebhook(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const signature =
      req.header("x-line-signature");

    if (!signature) {
      res.status(401).json({
        message:
          "Missing LINE signature"
      });

      return;
    }

    const rawBody = req.body as Buffer;

    if (!Buffer.isBuffer(rawBody)) {
      res.status(400).json({
        message:
          "Invalid request body"
      });

      return;
    }

    const valid = verifySignature(
      rawBody,
      signature
    );

    if (!valid) {
      res.status(401).json({
        message:
          "Invalid LINE signature"
      });

      return;
    }

    const body =
      JSON.parse(
        rawBody.toString("utf8")
      ) as LineWebhookBody;

    res.status(200).json({
      status: "ok"
    });

    const events =
      body.events ?? [];

    for (const event of events) {
      if (
        event.type !== "message" ||
        event.message?.type !== "text" ||
        !event.replyToken ||
        !event.message.text
      ) {
        continue;
      }

      const userMessage =
        event.message.text;

      console.log(
        "LINE message:",
        userMessage
      );

      const answer =
        await askAI(userMessage);

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

    // ถ้ายังไม่ได้ส่ง response
    if (!res.headersSent) {
      res.status(500).json({
        message:
          "Webhook processing failed"
      });
    }
  }
}