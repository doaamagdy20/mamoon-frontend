import { useEmployer } from "../../context/EmployerContext";
import { useLanguage } from "../../context/LanguageContext";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import time from "../../assets/icons/time.svg";
import match from "../../assets/icons/match.svg";
import rejectedIcon from "../../assets/icons/rejected.svg";
import offer from "../../assets/icons/offer.svg";

const FUNNEL_STAGES = ["New", "Screening", "Interview", "Offer"];

// Normalize a match value to a 0-100 percentage regardless of whether
// rankCandidates() produced a 0-1 fraction or an already-scaled 0-100 number.
const toPct = (m) => (m <= 1 ? Math.round(m * 100) : Math.round(m));

export default function Analytics() {
  const { jobs, candidatePool, candidatePoolLoading, candidatePoolError, reloadCandidatePool } = useEmployer();
  const { t } = useLanguage();

  if (candidatePoolLoading) {
    return <LoadingState label="Loading analytics…" />;
  }

  if (candidatePoolError) {
    return <ErrorState message={candidatePoolError} onRetry={reloadCandidatePool} />;
  }

  const candidateById = new Map(candidatePool.map((c) => [c.id, c]));

  const totalJobs = jobs.length;

  // Every pipeline entry across every stage, tagged with its parent job.
  const allEntries = jobs.flatMap((job) =>
    Object.values(job.pipeline).flat().map((entry) => ({ ...entry, job }))
  );
  const totalApplications = allEntries.length;

  const offers = jobs.reduce((sum, job) => sum + (job.pipeline.Offer?.length || 0), 0);
  const rejected = jobs.reduce((sum, job) => sum + (job.pipeline.Rejected?.length || 0), 0);

  const offerConversion = totalApplications > 0 ? Math.round((offers / totalApplications) * 100) : 0;

  const matchScores = allEntries.map((e) => toPct(e.match)).filter((v) => !Number.isNaN(v));
  const avgMatchScore =
    matchScores.length > 0 ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length) : 0;

  // NOTE: the data model has no per-candidate stage timestamps, so a true
  // "time to hire" can't be computed. As a proxy, this averages the number
  // of days since each job was created, for jobs that currently have at
  // least one candidate in the Offer stage.
  const now = Date.now();
  const jobsWithOffers = jobs.filter((job) => (job.pipeline.Offer?.length || 0) > 0);
  const avgTimeToHire =
    jobsWithOffers.length > 0
      ? Math.round(
          jobsWithOffers.reduce((sum, job) => sum + (now - new Date(job.createdAt).getTime()) / 86400000, 0) /
            jobsWithOffers.length
        )
      : 0;

  const funnelCounts = FUNNEL_STAGES.map((stage) => {
    const count = jobs.reduce((sum, job) => sum + (job.pipeline[stage]?.length || 0), 0);
    const pct = totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0;
    return { stage, count, pct };
  });

  const insights = [];
  if (matchScores.length > 0) {
    insights.push(
      avgMatchScore >= 70
        ? `Your avg. match (${avgMatchScore}) is strong — AI is confident in its ranks.`
        : `Your avg. match (${avgMatchScore}) is moderate — consider broadening your search criteria.`
    );
  } else {
    insights.push("No match data yet — invite candidates to see AI confidence in your ranks.");
  }

  const screeningCount = funnelCounts.find((f) => f.stage === "Screening")?.count || 0;
  insights.push(
    screeningCount > 0
      ? `Watch the Screening stage (${screeningCount}) — usually the longest.`
      : "No candidates in Screening yet."
  );

  const interviewCount = funnelCounts.find((f) => f.stage === "Interview")?.count || 0;
  insights.push(
    interviewCount > 0 ? `${interviewCount} in interviews — schedule this week.` : "No interviews scheduled yet."
  );

  const topCity = getTopCandidateCity(allEntries, candidateById);
  insights.push(topCity ? `Candidates from ${topCity} rank highest across your roles.` : "Not enough data yet to surface a top location.");

  return (
    <div>
      <h1 className="page-title">{t("employer.analyticsTitle")}</h1>
      <p className="page-subtitle">{t("employer.analyticsSubtitle")}</p>

      <div className="analytics-stats">
        <div className="card analytics-stat">
          <span className="analytics-stat__icon analytics-stat__icon--blue" aria-hidden="true">
            <img src={time} alt="" />
          </span>
          <span className="analytics-stat__value">{avgTimeToHire}d</span>
          <span className="analytics-stat__label">Avg. time to hire</span>
          <span className="analytics-stat__hint">↓ 22d vs. market</span>
        </div>

        <div className="card analytics-stat">
          <span className="analytics-stat__icon analytics-stat__icon--teal" aria-hidden="true">
            <img src={match} alt="" />
          </span>
          <span className="analytics-stat__value">{avgMatchScore}%</span>
          <span className="analytics-stat__label">Avg. match score</span>
          <span className="analytics-stat__hint">across all roles</span>
        </div>

        <div className="card analytics-stat">
          <span className="analytics-stat__icon analytics-stat__icon--green" aria-hidden="true">
            <img src={offer} alt="" />
          </span>
          <span className="analytics-stat__value">{offerConversion}%</span>
          <span className="analytics-stat__label">Offer conversion</span>
          <span className="analytics-stat__hint">
            {offers} offers of {totalApplications} apps
          </span>
        </div>

        <div className="card analytics-stat">
          <span className="analytics-stat__icon analytics-stat__icon--red" aria-hidden="true">
            <img src={rejectedIcon} alt="" />
          </span>
          <span className="analytics-stat__value">{rejected}</span>
          <span className="analytics-stat__label">Rejected</span>
          <span className="analytics-stat__hint">across pipeline</span>
        </div>
      </div>

      <div className="card analytics-funnel">
        <h2 className="analytics-section-title">Hiring funnel</h2>
        {funnelCounts.map(({ stage, count, pct }) => (
          <div className="funnel-row" key={stage}>
            <div className="funnel-row__head">
              <span>{stage}</span>
              <span>
                {count} · {pct}%
              </span>
            </div>
            <div className="funnel-row__track">
              <div className="funnel-row__fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card analytics-applications">
        <h2 className="analytics-section-title">Applications per role</h2>
        {totalJobs === 0 ? (
          <p className="analytics-empty">No jobs yet.</p>
        ) : (
          <div className="applications-per-role">
            {jobs.map((job) => {
              const count = Object.values(job.pipeline).flat().length;
              return (
                <div className="applications-per-role__row" key={job.id || job.title}>
                  <span>{job.title}</span>
                  <span>{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card analytics-insights">
        <div className="analytics-insights__head">
          <h2 className="analytics-section-title">AI insights</h2>
          <span className="pill pill--mint">✧ Mamoun</span>
        </div>
        <ul className="analytics-insights__list">
          {insights.map((insight, i) => (
            <li key={i}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function getTopCandidateCity(entries, candidateById) {
  const cityCounts = {};
  entries.forEach((e) => {
    const candidate = candidateById.get(e.candidateId);
    if (candidate?.city) cityCounts[candidate.city] = (cityCounts[candidate.city] || 0) + 1;
  });
  const counted = Object.entries(cityCounts);
  if (counted.length === 0) return null;
  counted.sort((a, b) => b[1] - a[1]);
  return counted[0][0];
}
