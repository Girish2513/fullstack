import { loadConfig } from "../config/loadConfig.js";

export async function checkConfig() {
  const config = await loadConfig();
  console.log("CONFIG OK");
  console.dir(config, { depth: null });
}
