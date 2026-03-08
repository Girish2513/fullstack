import * as jobsRepo from "./repo/jobs.repo";
import { generateFakeReport } from "./services/jobs.service";

let running = false;
let pollInterval: ReturnType<typeof setTimeout> | null = null;

async function processNextJob(): Promise<boolean> {
  const job = await jobsRepo.claimNextPendingJob();
  if (!job) return false;

  try {
    // Simulate long-running PDF generation
    await new Promise((resolve) => setTimeout(resolve, 50));
    const result = generateFakeReport(job.payload);
    await jobsRepo.markJobComplete(job.id, result);
  } catch (err: any) {
    await jobsRepo.markJobFailed(job.id, err.message);
  }

  return true;
}

export function startWorker(intervalMs = 500) {
  running = true;

  async function poll() {
    if (!running) return;
    try {
      const hadWork = await processNextJob();
      // If there was work, immediately check for more
      if (running) {
        pollInterval = setTimeout(poll, hadWork ? 0 : intervalMs);
      }
    } catch (err) {
      console.error("Worker error:", err);
      if (running) {
        pollInterval = setTimeout(poll, intervalMs);
      }
    }
  }

  poll();
}

export function stopWorker(): Promise<void> {
  running = false;
  if (pollInterval) {
    clearTimeout(pollInterval);
    pollInterval = null;
  }
  return Promise.resolve();
}

export { processNextJob };
