import "dotenv/config";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing");
}

const response = await fetch("https://api.openai.com/v1/models", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${apiKey}`
  }
});

console.log("Status:", response.status);

const body = await response.text();

console.log("Body:");
console.log(body);