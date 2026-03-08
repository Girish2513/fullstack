const buf = Buffer.from("Hello");
console.log(buf);
console.log(buf.toString());

const utf = Buffer.from("hello", "utf8");
const base = Buffer.from("hello").toString("base64");

console.log("utf8:", utf);
console.log("base64:", base);

const buffer = Buffer.alloc(10);
buffer.fill(0xff);
console.log(buffer);

const str = "😀";
console.log(str.length); // 2 characters (UTF-16)
console.log(Buffer.from(str).length); // 4 bytes (UTF-8)
