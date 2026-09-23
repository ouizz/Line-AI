import axios from "axios";
import { env } from "../config/env.js";

const LINE_REPLY_API =
  "https://api.line.me/v2/bot/message/reply";

export async function replyText(
  replyToken: string,
  text: string
): Promise<void> {
  try {
    console.log(
      "LINE Reply API: calling..."
    );

    const response = await axios.post(
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
          Authorization:
            `Bearer ${env.line.channelAccessToken}`,
          "Content-Type":
            "application/json"
        }
      }
    );

    console.log(
      "LINE Reply API status:",
      response.status
    );

    console.log(
      "LINE Reply API response:",
      response.data
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "LINE Reply API error status:",
        error.response?.status
      );

      console.error(
        "LINE Reply API error:",
        error.response?.data
      );
    } else {
      console.error(
        "LINE Reply API error:",
        error
      );
    }

    throw error;
  }
}