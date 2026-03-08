import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

function listener(data: string) {
  console.log("Received:", data);
}

emitter.on("custom", listener);
emitter.on("custom", () => console.log("Second listener"));

emitter.emit("custom", "Hello Event");

emitter.off("custom", listener);

emitter.emit("custom", "After removal");
