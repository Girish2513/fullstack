import pino from "pino";
import { loadConfig } from "../config/loadConfig.js";

let logger: pino.Logger;

export async function getLogger() {
  if (logger) return logger;

  const config = await loadConfig();
  logger = pino({ level: config.logLevel });
  return logger;
}
