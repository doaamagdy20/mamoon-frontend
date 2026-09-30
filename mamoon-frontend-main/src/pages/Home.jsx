import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import HeroImage from "../assets/imgs/HeroImg.svg";
import aipowerd from "../assets/imgs/ai.svg";
import vector from "../assets/imgs/Vector.svg";
import pipline from "../assets/imgs/pipline.svg";
import personality from "../assets/imgs/personality.svg";
import job from "../assets/imgs/job.svg";
import employee from "../assets/imgs/employee.svg";
import matchfound from "../assets/imgs/matchfound.svg";
import aimatch from "../assets/icons/aimatch.svg";
import locationicon from "../assets/icons/location.svg";
import "./Home.css";

const JOBS = [
  {
    initial: "F",
    title: "Full-stack Engineer",
    company: "Mishkat Labs",
    location: "Cairo",
    tag: "Onsite",
    tagClass: "tag--blue",
    pay: "EGP 60–85k",
  },
  {
    initial: "S",
    title: "Senior Frontend Engineer",
    company: "Qanawat",
    location: "Riyadh",
    tag: "Hybrid",
    tagClass: "tag--amber",
    pay: "SAR 22–28k",
  },
  {
    initial: "P",
    title: "Product Designer",
    company: "Zaytouna Group",
    location: "Dubai",
    tag: "Remote",
    tagClass: "tag--green",
    pay: "AED 18–24k",
  },
];

export default function Home() {
  const { t } = useLanguage();

  const STATS = [
    { value: t("home.statGlobal"), label: t("home.statGlobalLabel") },
    { value: t("home.statJobs"), label: t("home.statJobsLabel") },
    { value: t("home.statMatch"), label: t("home.statMatchLabel") },
    { value: t("home.statHire"), label: t("home.statHireLabel") },
  ];

  const FEATURES = [
    { icon: aipowerd, title: t("home.featureMatchTitle"), desc: t("home.featureMatchDesc") },
    { icon: vector, title: t("home.featureCvTitle"), desc: t("home.featureCvDesc") },
    { icon: pipline, title: t("home.featurePipelineTitle"), desc: t("home.featurePipelineDesc") },
    { icon: personality, title: t("home.featurePersonalityTitle"), desc: t("home.featurePersonalityDesc") },
  ];

  return (
    <>
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__inner">
            <span className="pill pill--blue hero__badge">
              <span aria-hidden="true"><img src={aimatch} alt="AI Match" /></span> {t("home.badge")}
            </span>

            <h1 className="hero__title">
              {t("home.titleLine1")}
              <br />
              {t("home.titleLine2")}
            </h1>

            <p className="hero__subtitle">{t("home.subtitle")}</p>

            <div className="hero__actions">
              <Link to="/signup?role=candidate" className="btn btn--purple">
                <span aria-hidden="true">
                  <img src={job} alt="Job" />
                </span> {t("home.findJob")}
              </Link>
              <Link to="/signup?role=employer" className="btn btn--orange">
                <span aria-hidden="true">
                  <img src={employee} alt="Employee" />
                </span> {t("home.findEmployee")}
              </Link>
            </div>

            <div className="hero__trust">
              <span className="hero__avatars" aria-hidden="true">
                <i style={{ background: "#7c3aed" }} />
                <i style={{ background: "#ea580c" }} />
                <i style={{ background: "#0f766e" }} />
                <i style={{ background: "#2563eb" }} />
              </span>
              {t("home.trust")}
            </div>
          </div>

          <div className="hero__art" aria-hidden="true">
            <img src={HeroImage} alt="" className="hero__art-img" />
            <img src={matchfound} alt="" className="hero__match-badge" />
          </div>
        </div>
      </section>

      <section className="about">
        <div className="container about__card">
          <div className="about__left">
            <span className="pill pill--mint aboutbage">{t("home.aboutBadge")}</span>
            <h2 className="about__title">{t("home.aboutTitle")}</h2>
            <p className="about__desc">{t("home.aboutDesc")}</p>
            <div className="about__stats">
              {STATS.map((s) => (
                <div className="stat-box" key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="about__right">
            {FEATURES.map((f) => (
              <div className="feature-row" key={f.title}>
                <span className="feature-row__icon" aria-hidden="true">
                  {f.icon && <img src={f.icon} alt="" className="feature-row__icon-img" />}
                </span>
                <span>
                  <strong>{f.title}</strong>
                  <small>{f.desc}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="jobs">
        <div className="container">
          <div className="jobs__head">
            <h2 className="jobs__title">{t("home.jobsTitle")}</h2>
            <Link to="/get-started" className="jobs__viewall">
              {t("home.viewAll")} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="jobs__list">
            {JOBS.map((job) => (
              <div className="job-row" key={job.title}>
                <span className="job-row__avatar" aria-hidden="true">
                  {job.initial}
                </span>
                <span className="job-row__info">
                  <strong>{job.title}</strong>
                  <small>
                    {job.company} <span aria-hidden="true"><img src={locationicon} alt="location" /></span> {job.location}
                  </small>
                </span>
                <span className={`tag ${job.tagClass}`}>{job.tag}</span>
                <span className="job-row__pay">{job.pay}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta__banner">
            <div>
              <h2 className="cta__title">{t("home.ctaTitle")}</h2>
              <p className="cta__subtitle">{t("home.ctaSubtitle")}</p>
            </div>
            <div className="cta__actions">
              <Link to="/signup?role=candidate" className="btn btn--ghost-light">
                {t("home.findRole")}
              </Link>
              <Link to="/signup?role=employer" className="btn btn--outline-light">
                {t("home.hireTalent")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
