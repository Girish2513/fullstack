import { resolve } from "node:dns";
//promise resolve
let p: Promise<number> = new Promise((resolve) => {
  resolve(42);
});

console.log(p);
async function mainn() {
  const res = await p;
  console.log(res);
}
mainn();
console.log("hello", await p);

//async function
async function add(a: number, b: number): Promise<number> {
  return a + b; //the function is returning number but async converts it into Promise<number
}
function convertedadd(a: number, b: number) {
  return Promise.resolve(a + b); //the above async func is secretly converted into this
}
console.log(add(3, 4));

//callback method
function addCallback(a: number, b: number, cb: (result: number) => void) {
  setTimeout(() => {
    cb(a + b);
  }, 1000);
}

function addPromise(a: number, b: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b);
    }, 1000);
  });
}

//creating a promise
const p1 = addPromise(2, 3);
console.log("creating a promise", p1);
//await a promise
async function main() {
  const result = await addPromise(2, 3);
  console.log("awaiting a promise", result);
}

main();
console.log(addPromise(2, 3));

//async/await
type User = {
  id: string;
  name: string;
};
async function fetchUser(id: string): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: "23", name: "Mock User" });
    }, 1000);
  });
}
async function main1() {
  const user = await fetchUser("123");
  console.log("main1", user.name);
}
main1();

//sequential
async function sequential() {
  console.time("seq");

  const a = await fetchUser("1");
  const b = await fetchUser("2");

  console.timeEnd("seq");
}
sequential();
//parallel
async function parallel() {
  console.time("par");

  const [a, b] = await Promise.all([fetchUser("1"), fetchUser("2")]);

  console.timeEnd("par");
}
parallel();

async function runallSettled() {
  const temp = await Promise.allSettled([
    Promise.resolve("success"),
    Promise.reject("failure"),
  ]);
  console.log("success");
}

runallSettled();

//timeout
function timeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    //wrapper promise
    const timer = setTimeout(() => {
      reject(new Error("Timeout"));
    }, ms);

    p.then((value) => {
      clearTimeout(timer);
      resolve(value);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function slow(): Promise<string> {
  return new Promise((res) => setTimeout(() => res("done"), 1000)); //returns after 1000ms
}

timeout(slow(), 300).then(console.log).catch(console.error);

//retries with backoff
function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms)); //returns a promise that returns after ms seconds
}
async function retry<T>(
  op: () => Promise<T>,
  attempts = 2,
  backoffMs = 250,
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i <= attempts; i++) {
    try {
      return await op();
    } catch (err: any) {
      lastError = err;

      if (!err?.retryable || i === attempts) {
        throw err;
      }

      await sleep(backoffMs * (i + 1));
    }
  }

  throw lastError;
}
let count = 0;

async function unstable() {
  count++;

  if (count < 5) {
    const err: any = new Error("Temporary failure");
    err.retryable = true;
    throw err;
  }

  return "Success!";
}

retry(unstable, 4).then(console.log).catch(console.error);
