import fs from "fs";
import chokidar from "chokidar";
import readline from "readline";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: npm run dev <logfile> [filter]");
  process.exit(1);
}

const filter = process.argv[3]; // optional filter

let fileSize = 0;

function streamNewLines() {
  const stream = fs.createReadStream(filePath, {
    start: fileSize,
    encoding: "utf-8",
  });

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    if (!filter || line.includes(filter)) {
      console.log(line);
    }
  });

  stream.on("end", () => {
    fileSize = fs.statSync(filePath).size;
  });
}

if (fs.existsSync(filePath)) {
  fileSize = fs.statSync(filePath).size;
}

const watcher = chokidar.watch(filePath, {
  persistent: true,
});

watcher.on("change", () => {
  streamNewLines();
});

watcher.on("unlink", () => {
  console.log("Log file rotated. Waiting for new file...");
});

watcher.on("add", () => {
  console.log("New log file detected. Resuming monitoring.");
  fileSize = 0;
});

process.on("SIGINT", () => {
  console.log("\nStopping log monitor...");
  watcher.close();
  process.exit(0);
});

console.log("Watching log file:", filePath);
