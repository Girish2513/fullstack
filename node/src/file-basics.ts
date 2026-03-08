import { promises as fs } from "fs";
import { access } from "fs/promises";

async function run() {
  await fs.writeFile("test.txt", "Hello, Node.js\n");
  console.log("File created");
  await fs.appendFile("test.txt", "This is appended.\n");
  const content = await fs.readFile("test.txt", "utf8");
  console.log(content);
  // await fs.unlink("test.txt");

  try {
    await access("test.txt");
    console.log("File exists");
  } catch {
    console.log("File does not exist");
  }
}

run();
