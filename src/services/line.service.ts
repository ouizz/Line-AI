import axios from "axios";

import { env } from "../config/env.js";

const LINE_REPLY_API =
  "https://api.line.me/v2/bot/message/reply";

export async function replyText(
  replyToken: string,
  text: string
): Promise<void> {
  await axios.post(
    LINE_REPLY_API,
    {
      replyToken,

      messages: [
        {
          type: "text",
          text
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${env.line.channelAccessToken}`,

        "Content-Type":
          "application/json"
      }
    }
  );
}