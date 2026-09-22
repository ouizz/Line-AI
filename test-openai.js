const response = await fetch("https://api.openai.com/v1/models");

console.log("Status:", response.status);
console.log("Headers:", Object.fromEntries(response.headers));

const body = await response.text();

console.log("Body:");
console.log(body);