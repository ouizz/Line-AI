import "dotenv/config";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing");
}

const response = await fetch(
  "https://api.openai.com/v1/responses",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-5",
      instructions: "ตอบเป็นภาษาไทยแบบสุภาพและกระชับ",
      input: "สวัสดีครับ ผมชื่อวีระ"
    })
  }
);

console.log("Status:", response.status);

const body = await response.text();

console.log("Body:");
console.log(body);