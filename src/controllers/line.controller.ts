import crypto from "node:crypto";
import type { Request, Response } from "express";

import { env } from "../config/env.js";
import { askAI } from "../services/ai.service.js";
import { replyText } from "../services/line.service.js";

interface LineMessage {
  type: string;
  text?: string;
}

interface LineSource {
  type?: string;
  userId?: string;
  groupId?: string;
  roomId?: string;
}

interface LineEvent {
  type: string;
  mode?: string;
  replyToken?: string;
  source?: LineSource;
  message?: LineMessage;
}

interface LineWebhookBody {
  destination?: string;
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

  const hashBuffer = Buffer.from(hash);
  const signatureBuffer = Buffer.from(signature);

  if (
    hashBuffer.length !==
    signatureBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    hashBuffer,
    signatureBuffer
  );
}

export async function handleLineWebhook(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log("========== LINE WEBHOOK ==========");

    const signature =
      req.header("x-line-signature");

    if (!signature) {
      console.error(
        "Missing LINE signature"
      );

      res.status(401).json({
        message:
          "Missing LINE signature"
      });

      return;
    }

    const rawBody = req.body as Buffer;

    if (!Buffer.isBuffer(rawBody)) {
      console.error(
        "Request body is not Buffer"
      );

      res.status(400).json({
        message:
          "Invalid request body"
      });

      return;
    }

    /**
     * 1. Verify LINE signature
     */
    const valid = verifySignature(
      rawBody,
      signature
    );

    if (!valid) {
      console.error(
        "Invalid LINE signature"
      );

      res.status(401).json({
        message:
          "Invalid LINE signature"
      });

      return;
    }

    console.log(
      "LINE signature: OK"
    );

    /**
     * 2. Parse webhook
     */
    const body =
      JSON.parse(
        rawBody.toString("utf8")
      ) as LineWebhookBody;

    const events =
      body.events ?? [];

    console.log(
      "LINE events:",
      events.length
    );

    /**
     * LINE can send an empty events array
     * when verifying the webhook URL.
     */
    if (events.length === 0) {
      console.log(
        "No events - webhook verification"
      );

      res.status(200).json({
        status: "ok"
      });

      return;
    }

    /**
     * 3. Process events
     */
    for (const event of events) {
      console.log(
        "Event type:",
        event.type
      );

      console.log(
        "Event mode:",
        event.mode
      );

      if (
        event.type !== "message" ||
        event.message?.type !== "text"
      ) {
        console.log(
          "Skip unsupported event"
        );

        continue;
      }

      if (!event.replyToken) {
        console.error(
          "Missing replyToken"
        );

        continue;
      }

      const userMessage =
        event.message.text?.trim();

      if (!userMessage) {
        console.log(
          "Empty user message"
        );

        continue;
      }

      console.log(
        "LINE message:",
        userMessage
      );

      console.log(
        "Generating AI response..."
      );

      /**
       * 4. Call Gemini
       */
      const answer =
        await askAI(userMessage);

      console.log(
        "Gemini response:",
        answer
      );

      /**
       * 5. Reply to LINE
       */
      console.log(
        "Sending reply to LINE..."
      );

      await replyText(
        event.replyToken,
        answer
      );

      console.log(
        "LINE reply: SUCCESS"
      );
    }

    /**
     * 6. Return 200 only after processing
     */
    res.status(200).json({
      status: "ok"
    });

    console.log(
      "========== WEBHOOK DONE =========="
    );
  } catch (error) {
    console.error(
      "========== LINE WEBHOOK ERROR =========="
    );

    console.error(error);

    if (!res.headersSent) {
      res.status(500).json({
        message:
          "Webhook processing failed"
      });
    }
  }
}