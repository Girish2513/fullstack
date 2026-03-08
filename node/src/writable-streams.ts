import { createWriteStream } from "fs";

const ws = createWriteStream("log.txt");

for (let i = 0; i < 10; i++) {
  ws.write(`Line ${i}\n`);
}

// if (!ws.write("data")) {
//   ws.once("drain", () => {
//     console.log("Resumed writing");
//   });
// }

ws.write(Buffer.from([0x41, 0x42]));

ws.end();

ws.on("finish", () => {
  console.log("Write completed");
});
