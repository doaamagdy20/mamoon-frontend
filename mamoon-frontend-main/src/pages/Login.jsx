import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/imgs/Mamoun.svg";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import ErrorState from "../components/ErrorState";
import "./Auth.css";

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password, role });
      navigate(role === "employer" ? "/employer" : "/candidate");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await login({ email: `demo-${role}@mamoun.app`, password: "demo", role });
      navigate(role === "employer" ? "/employer" : "/candidate");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-split auth-split--login">
      <div className="auth-split__form">
        <div className="auth-split__topbar">
          <Link to="/" className="auth-split__brand">
            <img src={Logo} alt="" className="auth-split__brand-logo" />
            <strong>Mamoun</strong>
          </Link>
        </div>

        <div className="auth-split__body">
          <section className="auth-card-panel auth-card-panel--login">
            <div className="auth-card-panel__content">
              <h1 className="auth-card__title">{t("auth.loginTitle")}</h1>
              <p className="auth-card__subtitle">{t("auth.loginSubtitle")}</p>

              <div className="role-toggle" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={role === "candidate"}
                  className={`role-toggle__btn ${role === "candidate" ? "role-toggle__btn--active" : ""}`}
                  onClick={() => setRole("candidate")}
                >
                  <span aria-hidden="true">👥</span> {t("getStarted.candidateBadge")}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={role === "employer"}
                  className={`role-toggle__btn ${role === "employer" ? "role-toggle__btn--active" : ""}`}
                  onClick={() => setRole("employer")}
                >
                  <span aria-hidden="true">🏢</span> {t("getStarted.employerBadge")}
                </button>
              </div>

              {error && <ErrorState message={error} />}

              <form className="auth-form" onSubmit={handleSubmit}>
                <label className="field">
                  <span>{t("auth.workEmail")}</span>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
                <label className="field">
                  <span>{t("auth.password")}</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>

                <Link to="/forgot-password" className="auth-split__forgot">
                  {t("auth.forgotPassword")}
                </Link>

                <button type="submit" className="btn btn--blue btn--block" disabled={submitting}>
                  {submitting ? "…" : t("auth.loginBtn")}
                  <span aria-hidden="true">→</span>
                </button>
              </form>

              <div className="auth-split__divider">
                <span>{t("auth.or")}</span>
              </div>

              <button
                type="button"
                className="btn btn--outline-dark btn--block"
                onClick={handleDemo}
                disabled={submitting}
              >
                {t("auth.continueDemo")}
              </button>

              <p className="auth-card__footer">
                {t("auth.newHere")} <Link to="/get-started">{t("auth.createAccount")}</Link>
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="auth-split__visual">
        <span className="pill auth-split__badge">
          <span aria-hidden="true">✨</span> {t("auth.builtWithIntelligence")}
        </span>
        <blockquote className="auth-split__quote">"{t("auth.testimonialQuote")}"</blockquote>
        <button type="button" className="auth-split__help" aria-label={t("auth.help")}>
          ?
        </button>
      </div>
    </div>
  );
}