import * as jobsRepo from "../repo/jobs.repo";

export async function submitReport(
  payload: any,
  idempotencyKey?: string,
): Promise<jobsRepo.Job> {
  if (idempotencyKey) {
    const existing = await jobsRepo.findJobByIdempotencyKey(idempotencyKey);
    if (existing) return existing;
  }
  return jobsRepo.createJob("report", payload, idempotencyKey);
}

export async function getJobStatus(id: number) {
  return jobsRepo.getJobById(id);
}

export function generateFakeReport(payload: any): { url: string; pages: number } {
  return {
    url: `/reports/report-${Date.now()}.pdf`,
    pages: Math.floor(Math.random() * 20) + 1,
  };
}
