import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../../assets/imgs/Mamoun.svg";
import { useCandidate } from "../../context/CandidateContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import dashboardIcon from "../../assets/icons/dashboard.svg";
import jobsIcon from "../../assets/icons/jobs.svg";
import profileIcon from "../../assets/icons/profile.svg";
import sparkleIcon from "../../assets/icons/sparkle.svg";
import "./candidate.css";

export default function CandidateLayout() {
  const { profile } = useCandidate();
  const { t, lang, toggleLang } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { to: "/candidate", label: t("candidate.navDashboard"), icon: dashboardIcon, end: true },
    { to: "/candidate/jobs", label: t("candidate.navJobs"), icon: jobsIcon },
    { to: "/candidate/profile", label: t("candidate.navProfile"), icon: profileIcon },
  ];

  const displayName = profile.fullName || "—";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";
  const email = profile.email || "you@example.com";
  const otherLangLabel = lang === "en" ? "العربية" : "English";

  return (
    <div className="candidate-shell">
      <aside className="candidate-sidebar">
        <div className="candidate-sidebar__top">
          <div className="candidate-sidebar__brand">
            <img src={Logo} alt="" className="candidate-sidebar__brand-logo" />
            <span>
              <strong>Mamoun</strong>
              <small>{t("candidate.roleLabel")}</small>
            </span>
          </div>

          <nav className="candidate-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `candidate-nav__item ${isActive ? "candidate-nav__item--active" : ""}`}
              >
                <img src={item.icon} alt="" className="candidate-nav__icon" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="candidate-boost">
            <span className="candidate-boost__icon">
              <img src={sparkleIcon} alt="" aria-hidden="true" />
            </span>
            <strong className="candidate-boost__title">{t("candidate.boostTitle")}</strong>
            <p className="candidate-boost__subtitle">{t("candidate.boostSubtitle")}</p>
            <NavLink to="/candidate/profile" className="candidate-boost__cta">
              {t("candidate.boostCta")}
            </NavLink>
          </div>
        </div>

        <div className="candidate-sidebar__bottom">
          <button type="button" className="candidate-lang" onClick={toggleLang}>
            <span aria-hidden="true">🌐</span> {otherLangLabel}
          </button>
          <button
            type="button"
            className="candidate-logout"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
          >
            <span aria-hidden="true">⏻</span> {t("candidate.logout")}
          </button>
        </div>
      </aside>

      <div className="candidate-main">
        <header className="candidate-topbar">
          <div className="candidate-topbar__right">
            <div className="candidate-user">
              <span className="candidate-user__avatar">{initial}</span>
              <span className="candidate-user__info">
                <strong>{displayName}</strong>
                <small>{email}</small>
              </span>
            </div>
          </div>
        </header>

        <div className="candidate-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
