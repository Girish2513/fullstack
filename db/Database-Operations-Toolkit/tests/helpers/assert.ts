let passed = 0;
let failed = 0;

export function assert(condition: boolean, label: string) {
  if (condition) {
    console.log(`  pass: ${label}`);
    passed++;
  } else {
    console.log(`  FAIL: ${label}`);
    failed++;
  }
}

export function getResults() {
  return { passed, failed };
}

export function resetResults() {
  passed = 0;
  failed = 0;
}
