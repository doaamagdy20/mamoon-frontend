import { Link, useNavigate, useParams } from "react-router-dom";
import { useEmployer, STAGE_ORDER } from "../../context/EmployerContext";
import { useLanguage } from "../../context/LanguageContext";
import MatchRing from "../../components/MatchRing";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";

const STAGES = ["New", "Screening", "Interview", "Offer", "Hired", "Rejected"];

export default function JobPipeline() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const {
    getJob,
    advanceCandidate,
    rejectCandidate,
    candidatePoolLoading,
    candidatePoolError,
    reloadCandidatePool,
    getCandidateFromPool,
  } = useEmployer();
  const { t } = useLanguage();
  const job = getJob(jobId);

  const stageLabel = (stage) => t(`employer.stage${stage}`);

  if (!job) {
    return (
      <div className="empty-state">
        <Link to="/employer/jobs" style={{ color: "var(--color-blue)", fontWeight: 700 }}>
          {t("employer.allJobs")}
        </Link>
      </div>
    );
  }

  if (candidatePoolLoading) {
    return <LoadingState label="Loading candidates…" />;
  }

  if (candidatePoolError) {
    return <ErrorState message={candidatePoolError} onRetry={reloadCandidatePool} />;
  }

  const totalMatched = STAGES.filter((s) => s !== "Rejected").reduce(
    (sum, s) => sum + job.pipeline[s].length,
    0
  );

  const activeCandidates = STAGE_ORDER.flatMap((stage) =>
    job.pipeline[stage].map((entry) => ({ ...entry, stage }))
  ).sort((a, b) => b.match.overall - a.match.overall);

  return (
    <div>
      <Link to="/employer/jobs" className="back-link">
        <span aria-hidden="true">←</span> {t("employer.allJobs")}
      </Link>

      <div className="card job-header-card">
        <div>
          <div className="job-header-card__title">{job.jobTitle}</div>
          <div className="job-header-card__meta">
            <span aria-hidden="true">🏢</span> Your Company
            <span aria-hidden="true">📍</span> {job.city}
            <span>{job.workModel.toLowerCase()}</span>· <span>{job.salaryRange}</span>
          </div>
        </div>
        <span className="pill pill--mint">
          ✧{t("employer.aiMatched")} {totalMatched}
        </span>
      </div>

      <h2 className="section-title">{t("employer.pipeline")}</h2>

      <div className="pipeline-board">
        {STAGES.map((stage) => (
          <div className="pipeline-column" key={stage}>
            <div className="pipeline-column__head">
              <span className="pipeline-column__head-label">
                <span className={`stage-dot stage-dot--${stage}`} />
                {stageLabel(stage)}
              </span>
              <span className="pipeline-column__count">{job.pipeline[stage].length}</span>
            </div>

            {job.pipeline[stage].map((entry) => {
              const candidate = getCandidateFromPool(entry.candidateId);
              return (
                <div
                  className="pipeline-card"
                  key={entry.candidateId}
                  onClick={() => navigate(`/employer/jobs/${job.id}/candidates/${entry.candidateId}`)}
                >
                  <div className="pipeline-card__head">
                    <span className="pipeline-card__avatar" style={{ background: candidate.color }}>
                      {candidate.name.charAt(0)}
                    </span>
                    <span>
                      <div className="pipeline-card__name">{candidate.name}</div>
                      <div className="pipeline-card__role">{candidate.role}</div>
                    </span>
                  </div>
                  <div className="pipeline-card__fill-row">
                    <span className="track">
                      <span className="pipeline-card__fill" style={{ width: `${entry.match.overall}%` }} />
                    </span>
                    <span className="pipeline-card__score">{entry.match.overall}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <h2 className="section-title">{t("employer.aiMatchedCandidates")}</h2>

      <div>
        {activeCandidates.length === 0 && <p className="empty-state">{t("employer.noCandidatesYet")}</p>}
        {activeCandidates.map((entry) => {
          const candidate = getCandidateFromPool(entry.candidateId);
          return (
            <div className="candidate-row" key={entry.candidateId}>
              <span className="candidate-row__avatar" style={{ background: candidate.color }}>
                {candidate.name.charAt(0)}
              </span>
              <div className="candidate-row__info">
                <div className="candidate-row__name-line">
                  <strong>{candidate.name}</strong>
                  <span className="status-badge">{stageLabel(entry.stage)}</span>
                </div>
                <div className="candidate-row__meta">
                  {candidate.role} · {candidate.location} · {candidate.years} {t("employer.yrs")}
                </div>
                <div className="candidate-row__tags">
                  {candidate.skills.map((s) => (
                    <span className="skill-tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <MatchRing value={entry.match.overall} />
              <div className="candidate-row__actions">
                <Link to={`/employer/jobs/${job.id}/candidates/${entry.candidateId}`} className="btn btn--blue">
                  {t("employer.view")}
                </Link>
                {entry.stage !== "Hired" && (
                  <button type="button" className="btn btn--green" onClick={() => advanceCandidate(job.id, entry.candidateId)}>
                    <span aria-hidden="true">✓</span> {t("employer.moveForward")}
                  </button>
                )}
                <button type="button" className="btn btn--red" onClick={() => rejectCandidate(job.id, entry.candidateId)}>
                  <span aria-hidden="true">✕</span> {t("employer.reject")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
