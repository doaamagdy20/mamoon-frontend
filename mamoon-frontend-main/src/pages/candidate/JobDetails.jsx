import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { jobsApi } from "../../services/jobsApi";
import { useApiRequest } from "../../hooks/useApiRequest";
import { useCandidate } from "../../context/CandidateContext";
import { useLanguage } from "../../context/LanguageContext";
import MatchRing from "../../components/MatchRing";
import ApplyModal from "../../components/ApplyModal";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import employee from "../../assets/imgs/employee.svg";
export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: job, loading, error, reload } = useApiRequest(() => jobsApi.getJobById(id), [id]);
  const { addApplication, hasApplied } = useCandidate();
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) {
    return <LoadingState label="Loading job…" />;
  }

  if (error || !job) {
    return (
      <div>
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : (
          <div className="empty-state">
            <Link to="/candidate/jobs" style={{ color: "var(--color-blue)", fontWeight: 700 }}>
              {t("candidate.backToDashboard")}
            </Link>
          </div>
        )}
      </div>
    );
  }

  const applied = hasApplied(job.id);

  const submitApplication = (coverNote) => {
    addApplication(job, coverNote);
    setModalOpen(false);
    navigate("/candidate/applications");
  };

  return (
    <div>
      <Link to="/candidate" className="back-link">
        <span aria-hidden="true">←</span> {t("candidate.backToDashboard")}
      </Link>

      <div className="job-detail-grid">
        <div>
          <div className="card job-detail-head">
            <span className="job-card__icon" aria-hidden="true">
              <img src={employee} alt="" className="job-card__icon-img" />
            </span>
            <div>
              <h1 className="job-detail-head__title">{job.title}</h1>
              <p className="job-card__meta">
                {job.company} · <span aria-hidden="true">📍</span> {job.location} · {job.workModel}
              </p>
              <div className="job-card__tags" style={{ marginTop: 12 }}>
                {job.tags.map((tag) => (
                  <span className="skill-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card job-detail-body">
            <h2 className="job-detail-body__heading">{t("candidate.aboutRole")}</h2>
            <p className="job-detail-body__text">{job.about}</p>

            <h2 className="job-detail-body__heading">{t("candidate.requirements")}</h2>
            <ul className="req-list">
              {job.requirements.map((req) => (
                <li key={req}>
                  <span aria-hidden="true">✓</span> {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="job-detail-side">
          <div className="card job-detail-side__card">
            <div className="job-detail-side__row">
              <span className="pill pill--mint">✦ {t("candidate.match")}</span>
              <MatchRing value={job.match} />
            </div>

            <MatchBar label={t("candidate.skills")} value={job.matchBreakdown.skills} />
            <MatchBar label={t("candidate.experience")} value={job.matchBreakdown.experience} />
            <MatchBar label={t("candidate.personality")} value={job.matchBreakdown.personality} />
          </div>

          <div className="card job-detail-side__card">
            <span className="job-card__meta">{t("candidate.salary")}</span>
            <strong className="job-detail-side__salary">{job.salary}</strong>
            <button
              type="button"
              className="btn btn--blue btn--block"
              disabled={applied}
              onClick={() => setModalOpen(true)}
            >
              {applied ? t("candidate.applied") : t("candidate.apply")}
            </button>
          </div>
        </aside>
      </div>

      {modalOpen && <ApplyModal job={job} onClose={() => setModalOpen(false)} onSubmit={submitApplication} />}
    </div>
  );
}

function MatchBar({ label, value }) {
  return (
    <div className="match-bar">
      <div className="match-bar__head">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="match-bar__track">
        <div className="match-bar__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
