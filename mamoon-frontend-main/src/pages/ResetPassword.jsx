import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../assets/imgs/Mamoun.svg";
import { useLanguage } from "../context/LanguageContext";
import "./Auth.css";

export default function ResetPassword() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("auth.passwordTooShort"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.passwordsDontMatch"));
      return;
    }

    setLoading(true);
    try {
      // TODO: استبدلي ده بالـ API الحقيقي بتاعك
      // await api.post("/auth/reset-password", { token, password });
      await new Promise((resolve) => setTimeout(resolve, 800));
      setDone(true);
    } catch (err) {
      console.error(err);
      setError(t("auth.resetFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
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
                <h1 className="auth-card__title">{t("auth.invalidLinkTitle")}</h1>
                <p className="auth-card__subtitle">{t("auth.invalidLinkSubtitle")}</p>
                <Link to="/forgot-password" className="btn btn--blue btn--block">
                  {t("auth.sendResetLink")}
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

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
              {!done ? (
                <>
                  <h1 className="auth-card__title">{t("auth.resetTitle")}</h1>
                  <p className="auth-card__subtitle">{t("auth.resetSubtitle")}</p>

                  <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="field">
                      <span>{t("auth.newPassword")}</span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </label>
                    <label className="field">
                      <span>{t("auth.confirmPassword")}</span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </label>

                    {error && (
                      <p style={{ color: "#dc2626", fontSize: "13.5px", fontWeight: 600 }}>
                        {error}
                      </p>
                    )}

                    <button type="submit" className="btn btn--blue btn--block" disabled={loading}>
                      {loading ? t("auth.sending") : t("auth.resetPasswordBtn")}
                      <span aria-hidden="true">→</span>
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h1 className="auth-card__title">{t("auth.resetSuccessTitle")}</h1>
                  <p className="auth-card__subtitle">{t("auth.resetSuccessSubtitle")}</p>

                  <button
                    type="button"
                    className="btn btn--blue btn--block"
                    onClick={() => navigate("/login")}
                  >
                    {t("auth.loginBtn")}
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}