import { Command } from "commander";

import { checkConfig } from "./commands/checkConfig.js";
import { addUser } from "./commands/addUser.js";
import { listUsers } from "./commands/listUsers.js";
import { importUsers } from "./commands/importUsers.js";

const program = new Command();

program.name("capstone").version("1.0.0");

program.command("config:check").action(checkConfig);

program.command("users:add").requiredOption("--name <name>").action(addUser);

program.command("users:list").action(listUsers);

program.command("users:import <file>").action(importUsers);

program.parseAsync().catch((err) => {
  console.error("CLI ERROR:");
  console.error(err);
  process.exit(1);
});
