export const isServer = typeof window === "undefined";
if (isServer) {
    console.log("Running on server");
}
