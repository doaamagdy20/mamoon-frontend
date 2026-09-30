import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../../assets/imgs/Mamoun.svg";
import { useEmployer } from "../../context/EmployerContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import dashboardIcon from "../../assets/icons/dashboard.svg";
import jobsIcon from "../../assets/icons/jobs.svg";
import candidatesIcon from "../../assets/icons/applications.svg";
import analyticsIcon from "../../assets/icons/analysis.svg";
import sparkleIcon from "../../assets/icons/sparkle.svg";
import "./employer.css";

export default function EmployerLayout() {
  const { companyProfile } = useEmployer();
  const { t, lang, toggleLang } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { to: "/employer", label: t("employer.navDashboard") || "Dashboard", icon: dashboardIcon, end: true },
    { to: "/employer/jobs", label: t("employer.navJobs") || "Jobs", icon: jobsIcon },
    { to: "/employer/candidates", label: t("employer.navCandidates") || "Candidates", icon: candidatesIcon },
    { to: "/employer/analytics", label: t("employer.navAnalytics") || "Analytics", icon: analyticsIcon },
  ];

  const displayName = companyProfile.contactName || "—";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";
  const email = companyProfile.email || "you@company.com";
  const otherLangLabel = lang === "en" ? "العربية" : "English";

  return (
    <div className="employer-shell">
      <aside className="employer-sidebar">
        <div className="employer-sidebar__top">
          <div className="employer-sidebar__brand">
            <img src={Logo} alt="" className="employer-sidebar__brand-logo" />
            <span>
              <strong>Mamoun</strong>
              <small>{t("employer.roleLabel")}</small>
            </span>
          </div>

          <nav className="employer-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `employer-nav__item ${isActive ? "employer-nav__item--active" : ""}`}
              >
                <img src={item.icon} alt="" className="employer-nav__icon" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="employer-sidebar__cta">
            <span className="employer-sidebar__cta-icon">
              <img src={sparkleIcon} alt="" />
            </span>
            <strong className="employer-sidebar__cta-title">Hire smarter</strong>
            <p className="employer-sidebar__cta-subtitle">
              Let AI surface your best-fit candidates for every role.
            </p>
            <button type="button" className="employer-sidebar__cta-btn" onClick={() => navigate("/employer/jobs/new")}>
              Create a job
            </button>
          </div>
        </div>

        <div className="employer-sidebar__bottom">
          <button type="button" className="employer-lang" onClick={toggleLang}>
            <span aria-hidden="true">🌐</span> {otherLangLabel}
          </button>
          <button
            type="button"
            className="employer-logout"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
          >
            <span aria-hidden="true">⏻</span> {t("employer.logout")}
          </button>
        </div>
      </aside>

      <div className="employer-main">
        <header className="employer-topbar">
          <div className="employer-topbar__right employer-topbar__right--solo">
            <div className="employer-user">
              <span className="employer-user__avatar">{initial}</span>
              <span className="employer-user__info">
                <strong>{displayName}</strong>
                <small>{email}</small>
              </span>
            </div>
          </div>
        </header>

        <div className="employer-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
