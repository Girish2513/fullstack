import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
import fs from "fs-extra";

type State = {
  imports: { file: string; count: number; time: number }[];
};

const file = ".data/state.json";

await fs.ensureDir(".data");

const adapter = new JSONFileSync<State>(file);
export const state = new LowSync(adapter, { imports: [] });

state.read();
state.data ||= { imports: [] };
