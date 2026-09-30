import { request, mockDelay, isMockMode } from "./api";
import { CANDIDATE_POOL, getCandidateById } from "../data/candidatePool";

export const candidatesApi = {
  async getCandidatePool() {
    if (isMockMode()) {
      await mockDelay();
      return CANDIDATE_POOL;
    }
    return request("/candidates");
  },

  async getCandidateById(id) {
    if (isMockMode()) {
      await mockDelay();
      const candidate = getCandidateById(id);
      if (!candidate) throw new Error("Candidate not found.");
      return candidate;
    }
    return request(`/candidates/${id}`);
  },
};
