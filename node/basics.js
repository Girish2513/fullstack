console.log("PID:", process.pid);
console.log("Node Version:", process.version);

console.log(process.argv);
const args = process.argv.slice(2);
console.log("Args:", args);
// process.exit(0);
// process.exit(1);
console.log("Current Dir:", process.cwd());
console.log(process.env);
console.log(process.env.PATH);

function multiplier(a, b) {
  let asquare = a ** 2;
  let bsquare = b ** 2;
  return asquare * bsquare;
}
debugger;

console.log(multiplier(3, 4));
