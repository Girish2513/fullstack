import "dotenv/config";
import YAML from "yaml";
import fs from "fs-extra";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const YamlSchema = z.object({
  dbPath: z.string(),
  logLevel: z.enum(["info", "debug"]).default("info"),
});

export type AppConfig = z.infer<typeof YamlSchema> & {
  env: z.infer<typeof EnvSchema>;
};

export async function loadConfig(): Promise<AppConfig> {
  const env = EnvSchema.parse(process.env);

  const text = await fs.readFile("config.yaml", "utf8");
  const parsed = YAML.parse(text);

  const yaml = YamlSchema.parse(parsed);

  return { ...yaml, env };
}
