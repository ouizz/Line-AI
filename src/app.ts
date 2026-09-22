// import express from "express";

// import { env } from "./config/env.js";
// import { askAI } from "./services/ai.service.js";

// const app = express();

// app.use(express.json());

// app.get("/health", (_req, res) => {
//   res.json({
//     status: "ok",
//     service: "line-ai-bot"
//   });
// });

// app.post("/api/ai/chat", async (req, res) => {
//   try {
//     const { message } = req.body as {
//       message?: string;
//     };

//     if (!message || message.trim() === "") {
//       res.status(400).json({
//         message: "message is required"
//       });
//       return;
//     }

//     const answer = await askAI(message);

//     res.json({
//       message,
//       answer
//     });
//   } catch (error) {
//     console.error("AI error:", error);

//     res.status(500).json({
//       message: "AI service failed"
//     });
//   }
// });

// app.listen(env.port, () => {
//   console.log(
//     `LINE AI Bot running on port ${env.port}`
//   );

//   console.log(
//     `Health: http://localhost:${env.port}/health`
//   );
// });


import express from "express";

import { env } from "./config/env.js";
import { askAI } from "./services/ai.service.js";
import lineRouter from "./routes/line.route.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "line-ai-bot"
  });
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body as {
      message?: string;
    };

    if (!message || message.trim() === "") {
      res.status(400).json({
        message: "message is required"
      });

      return;
    }

    const answer = await askAI(
      message
    );

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
      message: "AI service failed"
    });
  }
});

app.use("/api/line", lineRouter);

app.listen(env.port, () => {
  console.log(
    `LINE AI Bot running on port ${env.port}`
  );

  console.log(
    `Health: http://localhost:${env.port}/health`
  );
});