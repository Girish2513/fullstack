import fs from "node:fs";

export function readFile() {
  return fs.readFileSync("package.json", "utf-8");
}
