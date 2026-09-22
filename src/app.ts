import express from "express";

import { askAI } from "./services/ai.service.js";
import lineRouter from "./routes/line.route.js";

const app = express();

/*
 * LINE Webhook
 *
 * ต้องใช้ raw body
 * เพื่อ verify X-Line-Signature
 */
app.use(
  "/api/line",
  express.raw({
    type: "application/json"
  }),
  lineRouter
);

/*
 * Normal JSON APIs
 */
app.use(express.json());

app.get(
  "/health",
  (_req, res) => {
    res.json({
      status: "ok",
      service: "line-ai-bot"
    });
  }
);

/*
 * AI test API
 */
app.post(
  "/api/ai/chat",
  async (req, res) => {
    try {
      const {
        message
      } = req.body as {
        message?: string;
      };

      if (
        !message ||
        message.trim() === ""
      ) {
        res.status(400).json({
          message:
            "message is required"
        });

        return;
      }

      const answer =
        await askAI(message);

      res.json({
        message,
        answer
      });
    } catch (error) {
      console.error(
        "AI error:",
        error
      );

      res.status(500).json({
        message:
          "AI service failed"
      });
    }
  }
);

export default app;