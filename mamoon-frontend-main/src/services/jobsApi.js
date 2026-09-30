import { request, mockDelay, isMockMode } from "./api";
import { JOBS, getJobById } from "../data/jobs";

export const jobsApi = {
  async getJobs() {
    if (isMockMode()) {
      await mockDelay();
      return JOBS;
    }
    return request("/jobs");
  },

  async getJobById(id) {
    if (isMockMode()) {
      await mockDelay();
      const job = getJobById(id);
      if (!job) throw new Error("Job not found.");
      return job;
    }
    return request(`/jobs/${id}`);
  },
};
