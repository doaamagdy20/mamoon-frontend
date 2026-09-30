import { useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import JobCard from "../../components/JobCard";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { jobsApi } from "../../services/jobsApi";
import { useApiRequest } from "../../hooks/useApiRequest";

const WORK_MODEL_VALUES = ["onsite", "hybrid", "remote"];

export default function Jobs() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [workModel, setWorkModel] = useState("all");
  const { data: jobs, loading, error, reload } = useApiRequest(() => jobsApi.getJobs(), []);

  const filtered = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const matchesQuery =
        !query ||
        [job.title, job.company, ...job.tags].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesModel = workModel === "all" || job.workModel === workModel;
      return matchesQuery && matchesModel;
    });
  }, [query, workModel]);

  return (
    <div>
      <h1 className="page-title">{t("candidate.jobsTitle")}</h1>
      <p className="page-subtitle">{t("candidate.jobsSubtitle")}</p>

      <div className="jobs-filters">
        <div className="candidate-search jobs-filters__search">
          <span aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder={t("candidate.searchJobs")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="jobs-filters__select" value={workModel} onChange={(e) => setWorkModel(e.target.value)}>
          <option value="all">{t("candidate.allWorkModels")}</option>
          {WORK_MODEL_VALUES.map((m) => (
            <option key={m} value={m}>
              {m[0].toUpperCase() + m.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingState label="Loading jobs…" />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && (
        <div className="job-cards" style={{ marginTop: 22 }}>
          {filtered.map((job) => (
            <JobCard job={job} key={job.id} />
          ))}
          {filtered.length === 0 && <p className="empty-state">{t("candidate.noMatch")}</p>}
        </div>
      )}
    </div>
  );
}
