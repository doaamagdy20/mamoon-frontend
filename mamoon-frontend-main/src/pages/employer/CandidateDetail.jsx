import { Link, useNavigate, useParams } from "react-router-dom";
import { useEmployer, STAGE_ORDER } from "../../context/EmployerContext";
import { useLanguage } from "../../context/LanguageContext";
import MatchRing from "../../components/MatchRing";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";

export default function CandidateDetail() {
  const { jobId, candidateId } = useParams();
  const navigate = useNavigate();
  const {
    getJob,
    findPipelineEntry,
    advanceCandidate,
    rejectCandidate,
    candidatePoolLoading,
    candidatePoolError,
    reloadCandidatePool,
    getCandidateFromPool,
  } = useEmployer();
  const { t } = useLanguage();
  const job = getJob(jobId);
  const candidate = getCandidateFromPool(candidateId);

  const TRAITS = [
    { key: "collaboration", label: t("candidate.collaboration") },
    { key: "focus", label: t("candidate.focus") },
    { key: "initiative", label: t("candidate.initiative") },
    { key: "resilience", label: t("candidate.resilience") },
  ];

  if (candidatePoolLoading) {
    return <LoadingState label="Loading candidate…" />;
  }

  if (candidatePoolError) {
    return <ErrorState message={candidatePoolError} onRetry={reloadCandidatePool} />;
  }

  if (!job || !candidate) {
    return (
      <div className="empty-state">
        <Link to="/employer/jobs" style={{ color: "var(--color-blue)", fontWeight: 700 }}>
          {t("employer.allJobs")}
        </Link>
      </div>
    );
  }

  const found = findPipelineEntry(job, candidateId);
  const entry = found?.entry;
  const stage = found?.stage;
  const match = entry?.match;

  const requiredSkillsLower = (job.requiredSkills || []).map((s) => s.toLowerCase());
  const isOffer = stage === "Offer";
  const isRejected = stage === "Rejected";
  const nextStage = STAGE_ORDER[Math.min(STAGE_ORDER.indexOf(stage) + 1, STAGE_ORDER.length - 1)];

  const handleAdvance = () => {
    advanceCandidate(job.id, candidate.id);
    navigate(`/employer/jobs/${job.id}`);
  };

  const handleReject = () => {
    rejectCandidate(job.id, candidate.id);
    navigate(`/employer/jobs/${job.id}`);
  };

  return (
    <div>
      <Link to={`/employer/jobs/${job.id}`} className="back-link">
        <span aria-hidden="true">←</span> {job.jobTitle}
      </Link>

      <div className="job-detail-grid">
        <div>
          <div className="card job-detail-head">
            <span
              className="candidate-row__avatar"
              style={{ background: candidate.color, width: 56, height: 56, fontSize: 20 }}
            >
              {candidate.name.charAt(0)}
            </span>
            <div>
              <h1 className="job-detail-head__title">{candidate.name}</h1>
              <p className="job-card__meta">
                {candidate.role} · <span aria-hidden="true">📍</span> {candidate.location} · {candidate.years}{" "}
                {t("employer.yrs")}
              </p>
              {stage && (
                <span className="status-badge" style={{ marginTop: 10, display: "inline-block" }}>
                  {t(`employer.stage${stage}`)}
                </span>
              )}
            </div>
          </div>

          <div className="card job-detail-body">
            <h2 className="job-detail-body__heading">{t("employer.skills")}</h2>
            <div className="job-card__tags">
              {candidate.skills.map((s) => (
                <span
                  className="skill-tag"
                  key={s}
                  style={
                    requiredSkillsLower.includes(s.toLowerCase())
                      ? { background: "#dcfce7", color: "#15803d" }
                      : undefined
                  }
                >
                  {s}
                </span>
              ))}
            </div>

            <h2 className="job-detail-body__heading">{t("employer.personality")}</h2>
            <div className="personality-grid">
              {TRAITS.map(({ key, label }) => (
                <div className="match-bar" key={key}>
                  <div className="match-bar__head">
                    <span>{label}</span>
                    <span>{candidate.personality[key]}</span>
                  </div>
                  <div className="match-bar__track">
                    <div className="match-bar__fill match-bar__fill--teal" style={{ width: `${candidate.personality[key]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="job-detail-side">
          <div className="card job-detail-side__card">
            <span className="pill pill--mint">✦ {t("employer.whyRanking")}</span>

            {match && (
              <>
                <div className="overall-match-block">
                  <MatchRing value={match.overall} size={96} />
                  <div className="overall-match-block__label">{t("employer.overallMatch")}</div>
                  <div className="overall-match-block__value">{match.overall}%</div>
                </div>

                <div className="match-bar">
                  <div className="match-bar__head">
                    <span>{t("employer.skills")}</span>
                    <span>{match.skillsScore}</span>
                  </div>
                  <div className="match-bar__track">
                    <div className="match-bar__fill" style={{ width: `${match.skillsScore}%` }} />
                  </div>
                </div>
                <div className="match-bar">
                  <div className="match-bar__head">
                    <span>{t("employer.experience")}</span>
                    <span>{match.experienceScore}</span>
                  </div>
                  <div className="match-bar__track">
                    <div className="match-bar__fill" style={{ width: `${match.experienceScore}%` }} />
                  </div>
                </div>
                <div className="match-bar">
                  <div className="match-bar__head">
                    <span>{t("employer.personality")}</span>
                    <span>{match.personalityScore}</span>
                  </div>
                  <div className="match-bar__track">
                    <div className="match-bar__fill" style={{ width: `${match.personalityScore}%` }} />
                  </div>
                </div>
              </>
            )}
          </div>

          {!isRejected && (
            <div className="job-detail-side__card card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {!isOffer && (
                <button type="button" className="btn btn--green btn--block" onClick={handleAdvance}>
                  <span aria-hidden="true">✓</span> {t("employer.moveForward")} → {t(`employer.stage${nextStage}`)}
                </button>
              )}
              <button type="button" className="btn btn--red btn--block" onClick={handleReject}>
                <span aria-hidden="true">✕</span> {t("employer.reject")}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
