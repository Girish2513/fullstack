import { importCSV } from "../utils/csvImport.js";
import { state } from "../utils/state.js";
import { getLogger } from "../utils/logger.js";

export async function importUsers(file: string) {
  const log = await getLogger();

  const count = await importCSV(file);

  state.read();
  state.data.imports.push({
    file,
    count,
    time: Date.now(),
  });
  state.write();

  log.info({ file, count }, "Import complete");

  console.log(`Imported ${count} users`);
}
