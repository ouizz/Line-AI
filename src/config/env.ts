// import "dotenv/config";
// import process from "process";

// function getEnv(name: string): string {
//   const value = process.env[name];

//   if (!value) {
//     throw new Error(
//       `Missing required environment variable: ${name}`
//     );
//   }

//   return value;
// }

// export const env = {
//   port: Number(process.env.PORT ?? 3000),

//   line: {
//     channelSecret: getEnv("LINE_CHANNEL_SECRET"),
//     channelAccessToken: getEnv(
//       "LINE_CHANNEL_ACCESS_TOKEN"
//     )
//   },

//   openai: {
//     apiKey: getEnv("OPENAI_API_KEY")
//   }
// };


import "dotenv/config";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}`
    );
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),

  gemini: {
    apiKey: getEnv("GEMINI_API_KEY")
  },

  line: {
    channelSecret: getEnv("LINE_CHANNEL_SECRET"),
    channelAccessToken: getEnv(
      "LINE_CHANNEL_ACCESS_TOKEN"
    )
  }
};