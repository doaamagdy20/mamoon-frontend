import { useCandidate } from "../../context/CandidateContext";
import { useLanguage } from "../../context/LanguageContext";
import JobCard from "../../components/JobCard";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import activeapp from "../../assets/icons/activeapp.svg";
import { jobsApi } from "../../services/jobsApi";
import { useApiRequest } from "../../hooks/useApiRequest";

export default function Dashboard() {
  const { profile, applications } = useCandidate();
  const { t } = useLanguage();
  const displayName = profile.fullName || "—";
  const { data: jobs, loading, error, reload } = useApiRequest(() => jobsApi.getJobs(), []);

  return (
    <div>
      <h1 className="page-title">
        {t("candidate.welcome")} {displayName}
      </h1>
      <p className="page-subtitle">{t("candidate.welcomeSubtitle")}</p>

      <div className="stat-card card">
        <span className="stat-card__icon" aria-hidden="true">
          <img src={activeapp} alt="" className="stat-card__icon-img" />
        </span>
        <span>
          <span className="stat-card__label">{t("candidate.activeApplications")}</span>
          <span className="stat-card__value">{applications.length}</span>
        </span>
      </div>

      <div className="section-head">
        <h2>{t("candidate.recommendedForYou")}</h2>
        <span className="pill pill--mint">✦ {t("candidate.aiRanked")}</span>
      </div>

      {loading && <LoadingState label="Loading recommended jobs…" />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && (
        <div className="job-cards">
          {jobs.map((job) => (
            <JobCard job={job} key={job.id} />
          ))}
        </div>
      )}
    </div>
  );
}