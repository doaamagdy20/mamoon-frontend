import { createContext, useContext, useMemo, useState } from "react";

const CandidateContext = createContext(null);

const EMPTY_PERSONALITY = { resilience: 0, collaboration: 0, focus: 0, initiative: 0 };

export function CandidateProvider({ children }) {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    jobTitle: "",
    yearsOfExperience: "",
    skills: [],
    cvFileName: "",
    personality: EMPTY_PERSONALITY,
    onboardingComplete: false,
  });

  const [applications, setApplications] = useState([]);

  const updateProfile = (patch) => setProfile((prev) => ({ ...prev, ...patch }));

  const addApplication = (job, coverNote) => {
    setApplications((prev) => {
      if (prev.some((a) => a.jobId === job.id)) return prev;
      return [
        ...prev,
        {
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          coverNote,
          appliedAt: new Date().toISOString(),
          status: "Submitted",
        },
      ];
    });
  };

  const hasApplied = (jobId) => applications.some((a) => a.jobId === jobId);

  const value = useMemo(
    () => ({ profile, updateProfile, applications, addApplication, hasApplied }),
    [profile, applications]
  );

  return <CandidateContext.Provider value={value}>{children}</CandidateContext.Provider>;
}

export function useCandidate() {
  const ctx = useContext(CandidateContext);
  if (!ctx) throw new Error("useCandidate must be used within a CandidateProvider");
  return ctx;
}
