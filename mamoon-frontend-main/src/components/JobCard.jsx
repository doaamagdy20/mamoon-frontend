import { Link } from "react-router-dom";
import MatchRing from "./MatchRing";
import { useLanguage } from "../context/LanguageContext";
import employee from "../assets/imgs/employee.svg";
export default function JobCard({ job }) {
  const { t } = useLanguage();
  return (
    <div className="job-card card">
      <div className="job-card__head">
        <div style={{ display: "flex", gap: 12 }}>
          
          <span className="job-card__icon" aria-hidden="true">
            <img src={employee} alt="" className="job-card__icon-img" />
              </span>
          
          <div>
            <div className="job-card__title">{job.title}</div>
            <div className="job-card__meta">
              {job.company} · {job.location} · {job.workModel}
            </div>
          </div>
        </div>
        <MatchRing value={job.match} />
      </div>

      <div className="job-card__tags">
        {job.tags.map((tag) => (
          <span className="skill-tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="job-card__foot">
        <span className="job-card__salary">{job.salary}</span>
        <Link to={`/candidate/jobs/${job.id}`} className="btn btn--blue">
          {t("candidate.viewJob")}
        </Link>
      </div>
    </div>
  );
}
