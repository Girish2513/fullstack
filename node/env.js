import dotenv from "dotenv";
dotenv.config();

console.log("API_KEY:", process.env.API_KEY);
console.log("PORT:", process.env.PORT);
const port = process.env.PORT || 3000;
console.log("Port:", port);

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value;
}

const apiKey = requireEnv("API_KEY");
console.log(apiKey);
