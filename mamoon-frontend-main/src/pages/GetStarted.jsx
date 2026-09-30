import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";
import job from "../assets/imgs/job.svg";
import employee from "../assets/imgs/employee.svg";
import "./GetStarted.css";

export default function GetStarted() {
  const { t } = useLanguage();
  const candidatePoints = t("getStarted.candidatePoints");
  const employerPoints = t("getStarted.employerPoints");

  return (
    <>
      <Navbar variant="minimal" />

      <main className="onboard">
        <div className="container onboard__inner">
          <h1 className="onboard__title">{t("getStarted.title")}</h1>
          <p className="onboard__subtitle">{t("getStarted.subtitle")}</p>

          <div className="onboard__grid">
            <div className="role-card role-card--candidate">
              <span className="role-card__icon" aria-hidden="true">
               <img src={job} alt="Job" className="role-card__img" />
              </span>
              <span className="pill role-card__pill role-card__pill--candidate">{t("getStarted.candidateBadge")}</span>
              <h2 className="role-card__title">{t("getStarted.candidateTitle")}</h2>
              <ul className="role-card__list">
                {candidatePoints.map((p) => (
                  <li key={p}>
                    <span aria-hidden="true">✓</span> {p}
                  </li>
                ))}
              </ul>
              <Link to="/signup?role=candidate" className="btn btn--purple btn--block">
                {t("getStarted.continueCandidate")}
              </Link>
            </div>

            <div className="role-card role-card--employer">
              <span className="role-card__icon" aria-hidden="true">
                <img src={employee} alt="Employee" className="role-card__img" />
              </span>
              <span className="pill role-card__pill role-card__pill--employer">{t("getStarted.employerBadge")}</span>
              <h2 className="role-card__title">{t("getStarted.employerTitle")}</h2>
              <ul className="role-card__list">
                {employerPoints.map((p) => (
                  <li key={p}>
                    <span aria-hidden="true">✓</span> {p}
                  </li>
                ))}
              </ul>
              <Link to="/signup?role=employer" className="btn btn--orange btn--block">
                {t("getStarted.continueEmployer")}
              </Link>
            </div>
          </div>

          <p className="onboard__login">
            {t("getStarted.haveAccount")} <Link to="/login">{t("getStarted.logIn")}</Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
