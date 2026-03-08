import { promises as fs } from "fs";

const FILE = "data.json";

async function saveJSON(path: string, data: any) {
  await fs.writeFile(path, JSON.stringify(data, null, 2));
}

async function loadJSON<T>(path: string, defaultValue: T): Promise<T> {
  try {
    const raw = await fs.readFile(path, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Using default value.");
    return defaultValue;
  }
}

async function run() {
  const data = { name: "Girish", role: "SDE" };

  await saveJSON(FILE, data);
  // await fs.unlink(FILE);
  const loaded = await loadJSON(FILE, { name: "Default", role: "User" });

  console.log("Loaded:", loaded);
}

run();
