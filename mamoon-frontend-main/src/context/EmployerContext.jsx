import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { candidatesApi } from "../services/candidatesApi";
import { rankCandidates } from "../utils/matching";

const EmployerContext = createContext(null);

const STAGE_ORDER = ["New", "Screening", "Interview", "Offer", "Hired"];

let jobCounter = 0;

export function EmployerProvider({ children }) {
  const [companyProfile, setCompanyProfile] = useState({
    contactName: "",
    email: "",
    companyName: "",
    industry: "",
    teamSize: "",
    city: "",
    website: "",
  });
  const [jobs, setJobs] = useState([]);

  // Candidate pool is fetched once here (through candidatesApi, which is
  // mock-backed until the real backend exists) and shared by every
  // employer page instead of each page importing data/candidatePool.js
  // directly.
  const [candidatePool, setCandidatePool] = useState([]);
  const [candidatePoolLoading, setCandidatePoolLoading] = useState(true);
  const [candidatePoolError, setCandidatePoolError] = useState(null);

  const loadCandidatePool = useCallback(() => {
    setCandidatePoolLoading(true);
    setCandidatePoolError(null);
    return candidatesApi
      .getCandidatePool()
      .then((pool) => setCandidatePool(pool))
      .catch((err) => setCandidatePoolError(err.message || "Failed to load candidates."))
      .finally(() => setCandidatePoolLoading(false));
  }, []);

  useEffect(() => {
    loadCandidatePool();
  }, [loadCandidatePool]);

  const getCandidateFromPool = (candidateId) => candidatePool.find((c) => c.id === candidateId);

  const updateCompanyProfile = (patch) => setCompanyProfile((prev) => ({ ...prev, ...patch }));

  const createJob = (jobDraft) => {
    jobCounter += 1;
    const id = `job-${jobCounter}-${Date.now()}`;
    const ranked = rankCandidates(candidatePool, jobDraft);

    const pipeline = { New: [], Screening: [], Interview: [], Offer: [], Hired: [], Rejected: [] };
    ranked.forEach(({ candidate, match }) => {
      pipeline.New.push({ candidateId: candidate.id, status: "New", match });
    });

    const job = { id, ...jobDraft, pipeline, createdAt: new Date().toISOString() };
    setJobs((prev) => [...prev, job]);
    return job;
  };

  const getJob = (jobId) => jobs.find((j) => j.id === jobId);

  const findPipelineEntry = (job, candidateId) => {
    for (const stage of Object.keys(job.pipeline)) {
      const entry = job.pipeline[stage].find((e) => e.candidateId === candidateId);
      if (entry) return { stage, entry };
    }
    return null;
  };

  const moveCandidate = (jobId, candidateId, toStage) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        const found = findPipelineEntry(job, candidateId);
        if (!found) return job;
        const nextPipeline = { ...job.pipeline };
        nextPipeline[found.stage] = nextPipeline[found.stage].filter((e) => e.candidateId !== candidateId);
        nextPipeline[toStage] = [...nextPipeline[toStage], { ...found.entry, status: toStage }];
        return { ...job, pipeline: nextPipeline };
      })
    );
  };

  const advanceCandidate = (jobId, candidateId) => {
    const job = getJob(jobId);
    if (!job) return;
    const found = findPipelineEntry(job, candidateId);
    if (!found) return;
    const idx = STAGE_ORDER.indexOf(found.stage);
    const nextStage = STAGE_ORDER[Math.min(idx + 1, STAGE_ORDER.length - 1)];
    if (nextStage === found.stage) return;
    moveCandidate(jobId, candidateId, nextStage);
  };

  const rejectCandidate = (jobId, candidateId) => moveCandidate(jobId, candidateId, "Rejected");

  const value = useMemo(
    () => ({
      companyProfile,
      updateCompanyProfile,
      jobs,
      createJob,
      getJob,
      advanceCandidate,
      rejectCandidate,
      findPipelineEntry,
      candidatePool,
      candidatePoolLoading,
      candidatePoolError,
      reloadCandidatePool: loadCandidatePool,
      getCandidateFromPool,
    }),
    [companyProfile, jobs, candidatePool, candidatePoolLoading, candidatePoolError, loadCandidatePool]
  );

  return <EmployerContext.Provider value={value}>{children}</EmployerContext.Provider>;
}

export function useEmployer() {
  const ctx = useContext(EmployerContext);
  if (!ctx) throw new Error("useEmployer must be used within an EmployerProvider");
  return ctx;
}

export { STAGE_ORDER };
