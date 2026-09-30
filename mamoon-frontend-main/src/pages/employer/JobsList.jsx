import { Link } from "react-router-dom";
import { useEmployer } from "../../context/EmployerContext";
import { useLanguage } from "../../context/LanguageContext";

export default function JobsList() {
  const { jobs } = useEmployer();
  const { t } = useLanguage();

  return (
    <div>
      <div className="dashboard-head">
        <div>
          <h1 className="page-title">{t("employer.jobsTitle")}</h1>
          <p className="page-subtitle">{t("employer.jobsSubtitle")}</p>
        </div>
        <Link to="/employer/jobs/new" className="btn btn--blue">
          <span aria-hidden="true">+</span> {t("employer.createJob")}
        </Link>
      </div>

      <div style={{ marginTop: 22 }}>
        {jobs.length === 0 ? (
          <div className="card snapshot-card">
            <p style={{ color: "var(--color-ink-soft)", marginBottom: 20 }}>{t("employer.noJobsYet")}</p>
            <Link to="/employer/jobs/new" className="btn btn--blue">
              <span aria-hidden="true">+</span> {t("employer.createFirstJob")}
            </Link>
          </div>
        ) : (
          jobs.map((job) => {
            const matched = Object.entries(job.pipeline).reduce(
              (sum, [stage, entries]) => (stage === "Rejected" ? sum : sum + entries.length),
              0
            );
            return (
              <Link to={`/employer/jobs/${job.id}`} className="employer-job-row" key={job.id} style={{ marginBottom: 12 }}>
                <span className="employer-job-row__icon" aria-hidden="true">
                  💼
                </span>
                <span className="employer-job-row__info">
                  <strong>{job.jobTitle}</strong>
                  <small>
                    {job.city} · {job.workModel} · {job.salaryRange}
                  </small>
                </span>
                <span className="pill pill--mint">
                  ✧ {t("employer.aiMatched")} {matched}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
