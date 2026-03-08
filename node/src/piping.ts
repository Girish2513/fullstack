import { createReadStream, createWriteStream } from "fs";
import { Transform } from "stream";

createReadStream("input.txt").pipe(createWriteStream("copy.txt"));

const upper = new Transform({
  transform(chunk, _, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});
console.time("streamCopy");
createReadStream("input.txt")
  .pipe(upper)
  .pipe(createWriteStream("output.txt"))
  .on("finish", () => {
    console.timeEnd("streamCopy");
  });
