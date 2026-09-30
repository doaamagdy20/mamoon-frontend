import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/imgs/Mamoun.svg";
import signupCandidate from "../assets/imgs/signupcandadate.svg";
import signupEmployer from "../assets/imgs/signuphr.svg";
import { useEmployer } from "../context/EmployerContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import ErrorState from "../components/ErrorState";
import "./Auth.css";

export default function Signup() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { updateCompanyProfile } = useEmployer();
  const { t } = useLanguage();
  const { signup } = useAuth();
  const role = params.get("role") === "employer" ? "employer" : "candidate";

  const [candidateForm, setCandidateForm] = useState({ fullName: "", email: "", password: "" });
  const [employerForm, setEmployerForm] = useState({ fullName: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const updateCandidateField = (key) => (e) => setCandidateForm((prev) => ({ ...prev, [key]: e.target.value }));
  const updateEmployerField = (key) => (e) => setEmployerForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signup({ ...candidateForm, role: "candidate" });
      navigate("/onboarding");
    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmployerSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signup({ ...employerForm, role: "employer" });
      updateCompanyProfile({ contactName: employerForm.fullName, email: employerForm.email });
      navigate("/employer/setup");
    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-split auth-split--wide">
      <div className="auth-split__topbar auth-split__topbar--floating">
        <Link to="/" className="auth-split__brand">
          <img src={Logo} alt="" className="auth-split__brand-logo" />
          <strong>Mamoun</strong>
        </Link>
      </div>

      <section className={`auth-card-panel ${role === "employer" ? "auth-card-panel--employer" : "auth-card-panel--candidate"}`}>
        <div className="auth-card-panel__brand-row">
          <Link to="/get-started" className="auth-card-panel__change">
            <span aria-hidden="true">←</span> {t("auth.changeRole")}
          </Link>
        </div>

        <div className="auth-card-panel__content">
          <div className={`auth-role-summary ${role === "employer" ? "auth-role-summary--employer" : "auth-role-summary--candidate"}`}>
            <span className="auth-role-summary__icon" aria-hidden="true">
              <img
                src={role === "employer" ? signupEmployer : signupCandidate}
                alt=""
                className="auth-role-summary__icon-img"
              />
            </span>
            <div className="auth-role-summary__text">
              <span className="auth-role-summary__label">{t("auth.continuingAs")}</span>
              <span className="auth-role-summary__role">
                {role === "employer" ? t("getStarted.employerBadge") : t("getStarted.candidateBadge")}
              </span>
            </div>
          </div>

          <h1 className="auth-card__title">{t("auth.signupTitle")}</h1>
          <p className="auth-card__subtitle">{t("auth.oneAccountTwoExperiences")}</p>

          {error && <ErrorState message={error} />}

          {role === "employer" ? (
            <form className="auth-form" onSubmit={handleEmployerSubmit}>
              <label className="field">
                <span>{t("auth.fullName")}</span>
                <input
                  type="text"
                  placeholder={t("auth.namePlaceholder")}
                  value={employerForm.fullName}
                  onChange={updateEmployerField("fullName")}
                  required
                />
              </label>
              <label className="field">
                <span>{t("auth.workEmail")}</span>
                <input
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  value={employerForm.email}
                  onChange={updateEmployerField("email")}
                  required
                />
              </label>
              <label className="field">
                <span>{t("auth.password")}</span>
                <input type="password" placeholder="••••••••" value={employerForm.password} onChange={updateEmployerField("password")} required />
              </label>
              <button type="submit" className="btn btn--blue btn--block" disabled={submitting}>
                {submitting ? "…" : t("auth.createAccount")} <span aria-hidden="true">→</span>
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleCandidateSubmit}>
              <label className="field">
                <span>{t("auth.fullName")}</span>
                <input
                  type="text"
                  placeholder={t("auth.namePlaceholder")}
                  value={candidateForm.fullName}
                  onChange={updateCandidateField("fullName")}
                  required
                />
              </label>
              <label className="field">
                <span>{t("auth.workEmail")}</span>
                <input
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  value={candidateForm.email}
                  onChange={updateCandidateField("email")}
                  required
                />
              </label>
              <label className="field">
                <span>{t("auth.password")}</span>
                <input type="password" placeholder="••••••••" value={candidateForm.password} onChange={updateCandidateField("password")} required />
              </label>
              <button type="submit" className="btn btn--blue btn--block" disabled={submitting}>
                {submitting ? "…" : t("auth.createAccount")} <span aria-hidden="true">→</span>
              </button>
            </form>
          )}

          <p className="auth-card__footer">
            {t("auth.alreadyHaveAccount")} <Link to="/login">{t("nav.login")}</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
