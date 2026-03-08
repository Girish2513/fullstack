import { createReadStream } from "fs";

const stream = createReadStream("big.txt");
let chunks = 0;

stream.on("data", (chunk) => {
  chunks++;
  console.log("Chunk size:", chunk.length);
});

stream.on("end", () => {
  console.log("done");
  console.log("Total chunks:", chunks);
});

stream.on("error", (err) => {
  console.error("Stream error:", err.message);
});
