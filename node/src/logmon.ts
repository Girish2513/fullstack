import { watch, createReadStream } from "fs";
import { createInterface } from "readline";

const file = process.argv[2] || "app.log";
const filter = process.argv[3];

let position = 0;

function streamNewContent() {
  const stream = createReadStream(file, { start: position });
  const rl = createInterface({ input: stream });

  rl.on("line", (line) => {
    if (!filter || line.includes(filter)) {
      console.log(line);
    }
  });

  stream.on("end", () => {
    position = stream.bytesRead + position;
  });
}

const watcher = watch(file);

watcher.on("change", () => {
  streamNewContent();
});

watcher.on("rename", () => {
  console.log("File rotated, restarting...");
  position = 0;
});

process.on("SIGINT", () => {
  console.log("Exiting logmon...");
  watcher.close();
  process.exit(0);
});

console.log("Watching:", file);
