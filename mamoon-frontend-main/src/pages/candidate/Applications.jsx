import { Link } from "react-router-dom";
import { useCandidate } from "../../context/CandidateContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Applications() {
  const { applications } = useCandidate();
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="page-title">{t("candidate.myApplications")}</h1>

      <div className="card" style={{ marginTop: 22 }}>
        {applications.length === 0 ? (
          <p className="empty-state">{t("candidate.noApplications")}</p>
        ) : (
          <ul className="applications-list">
            {applications.map((app) => (
              <li key={app.jobId} className="applications-list__item">
                <div>
                  <strong>{app.jobTitle}</strong>
                  <p className="job-card__meta">{app.company}</p>
                </div>
                <span className="skill-tag">{app.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {applications.length === 0 && (
        <p className="page-subtitle" style={{ marginTop: 16 }}>
          <Link to="/candidate/jobs" style={{ color: "var(--color-blue)", fontWeight: 700 }}>
            {t("candidate.browseRoles")} →
          </Link>
        </p>
      )}
    </div>
  );
}
