import { watch } from "fs";

const watcher = watch("log.txt");

watcher.on("change", (eventType, filename) => {
  if (eventType === "change") {
    console.log(`Modified: ${filename}`);
  } else if (eventType === "rename") {
    console.log(`Renamed or deleted: ${filename}`);
  }
});

setTimeout(() => {
  watcher.close();
}, 30000);
