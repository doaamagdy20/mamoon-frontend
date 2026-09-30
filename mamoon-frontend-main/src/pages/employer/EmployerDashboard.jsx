import { Link } from "react-router-dom";
import { useEmployer } from "../../context/EmployerContext";
import { useLanguage } from "../../context/LanguageContext";

export default function EmployerDashboard() {
  const { companyProfile, jobs } = useEmployer();
  const { t } = useLanguage();
  const displayName = companyProfile.contactName || "—";

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <h1 className="page-title">
            {t("employer.welcome")} {displayName}
          </h1>
          <p className="page-subtitle">{t("employer.welcomeSubtitle")}</p>
        </div>
        <Link to="/employer/jobs/new" className="btn btn--blue">
          <span aria-hidden="true">+</span> {t("employer.createJob")}
        </Link>
      </div>

      <h2 className="section-title">{t("employer.pipelineSnapshot")}</h2>

      {jobs.length === 0 ? (
        <div className="card snapshot-card">
          <p style={{ color: "var(--color-ink-soft)", marginBottom: 20 }}>{t("employer.noJobsYet")}</p>
          <Link to="/employer/jobs/new" className="btn btn--blue">
            <span aria-hidden="true">+</span> {t("employer.createFirstJob")}
          </Link>
        </div>
      ) : (
        <div>
          {jobs.map((job) => {
            const total = Object.entries(job.pipeline)
              .filter(([stage]) => stage !== "Rejected")
              .reduce((sum, [, entries]) => sum + entries.length, 0);
            return (
              <Link to={`/employer/jobs/${job.id}`} className="employer-job-row" key={job.id} style={{ marginBottom: 12 }}>
                <span className="employer-job-row__icon" aria-hidden="true">
                  💼
                </span>
                <span className="employer-job-row__info">
                  <strong>{job.jobTitle}</strong>
                  <small>
                    {job.city} · {job.workModel}
                  </small>
                </span>
                <span className="pill pill--mint">
                  {total} {t("employer.inPipeline")}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
