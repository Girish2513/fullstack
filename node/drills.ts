try {
  throw new Error("Something went wrong synchronously!");
} catch (error) {
  console.error("Caught sync error:", (error as Error).message);
}

function riskyAsyncOperation(): Promise<string> {
  return Promise.reject(new Error("Async operation failed!"));
}

riskyAsyncOperation()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error("Caught async error:", err.message);
  });

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message); //This catches errors that were not handled anywhere.

  // clean up
  // process.exit(1);
});

setTimeout(() => {
  throw new Error("Unexpected crash!");
}, 1000);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);

  // process.exit(1);
});
Promise.reject("Unhandled promise error!");

function shutdownGracefully() {
  console.log("Cleaning up resources...");
  setTimeout(() => {
    console.log("Shutdown complete.");
    process.exit(1);
  }, 1000);
}

process.on("uncaughtException", (err) => {
  console.error("Fatal error:", err.message);
  shutdownGracefully();
});
