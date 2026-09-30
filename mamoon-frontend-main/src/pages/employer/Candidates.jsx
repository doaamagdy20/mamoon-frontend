import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useEmployer, STAGE_ORDER } from "../../context/EmployerContext";
import { useLanguage } from "../../context/LanguageContext";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";

export default function Candidates() {
  const { jobs, candidatePool, candidatePoolLoading, candidatePoolError, reloadCandidatePool } = useEmployer();
  const { t } = useLanguage();
  const [selectedJobId, setSelectedJobId] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");

  const allRows = useMemo(
    () =>
      jobs.flatMap((job) =>
        STAGE_ORDER.flatMap((stage) =>
          job.pipeline[stage].map((entry) => ({
            job,
            stage,
            entry,
            candidate: candidatePool.find((c) => c.id === entry.candidateId),
          }))
        )
      ),
    [jobs, candidatePool]
  );

  const rows = allRows.filter(
    ({ job, stage }) =>
      (selectedJobId === "all" || job.id === selectedJobId) && (selectedStage === "all" || stage === selectedStage)
  );

  return (
    <div>
      <h1 className="page-title">{t("employer.candidatesTitle")}</h1>
      <p className="page-subtitle">{t("employer.candidatesSubtitle")}</p>

      <div className="candidates-filters">
        <select value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
          <option value="all">{t("employer.allJobs")}</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.jobTitle}
            </option>
          ))}
        </select>
        <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
          <option value="all">{t("employer.allStages")}</option>
          {STAGE_ORDER.map((stage) => (
            <option key={stage} value={stage}>
              {t(`employer.stage${stage}`)}
            </option>
          ))}
        </select>
      </div>

      {candidatePoolLoading && <LoadingState label="Loading candidates…" />}
      {!candidatePoolLoading && candidatePoolError && (
        <ErrorState message={candidatePoolError} onRetry={reloadCandidatePool} />
      )}
      {!candidatePoolLoading && !candidatePoolError && (rows.length === 0 ? (
        <div className="card snapshot-card">
          <p style={{ color: "var(--color-ink-soft)" }}>{t("employer.noCandidatesGlobal")}</p>
        </div>
      ) : (
        <div className="candidates-table-wrap">
          <div className="candidates-table-head">
            <span>{t("employer.candidateCol")}</span>
            <span>{t("employer.roleCol")}</span>
            <span>{t("employer.stageCol")}</span>
            <span>{t("employer.matchCol")}</span>
            <span />
          </div>
          {rows.map(({ job, stage, entry, candidate }) => (
            <div className="candidates-table-row" key={`${job.id}-${candidate.id}`}>
              <div className="ct-candidate">
                <span className="ct-avatar" style={{ background: candidate.color }}>
                  {candidate.name.charAt(0)}
                </span>
                <span>
                  <div className="ct-name">{candidate.name}</div>
                  <div className="ct-meta">
                    {candidate.role} · {candidate.location}
                  </div>
                </span>
              </div>

              <div className="ct-role">{job.jobTitle}</div>

              <div>
                <span className={`ct-stage-pill ct-stage-pill--${stage}`}>{t(`employer.stage${stage}`)}</span>
              </div>

              <div className="ct-match">
                <span className="ct-match-track">
                  <span
                    className="ct-match-fill"
                    style={{
                      width: `${entry.match.overall}%`,
                      background: entry.match.overall >= 90 ? "#16a34a" : "var(--color-blue)",
                    }}
                  />
                </span>
                <span className="ct-match-value">{entry.match.overall}</span>
              </div>

              <div>
                <Link to={`/employer/jobs/${job.id}/candidates/${candidate.id}`} className="btn btn--blue">
                  {t("employer.view")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
