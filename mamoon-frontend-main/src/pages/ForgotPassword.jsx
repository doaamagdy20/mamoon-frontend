import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/imgs/Mamoun.svg";
import { useLanguage } from "../context/LanguageContext";
import "./Auth.css";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: استبدلي ده بالـ API الحقيقي بتاعك
      // await api.post("/auth/forgot-password", { email });
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
              {!sent ? (
                <>
                  <h1 className="auth-card__title">{t("auth.forgotTitle")}</h1>
                  <p className="auth-card__subtitle">{t("auth.forgotSubtitle")}</p>

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

                    <button type="submit" className="btn btn--blue btn--block" disabled={loading}>
                      {loading ? t("auth.sending") : t("auth.sendResetLink")}
                      <span aria-hidden="true">→</span>
                    </button>
                  </form>

                  <p className="auth-card__footer">
                    <Link to="/login">{t("auth.backToLogin")}</Link>
                  </p>
                </>
              ) : (
                <>
                  <h1 className="auth-card__title">{t("auth.checkEmailTitle")}</h1>
                  <p className="auth-card__subtitle">
                    {t("auth.checkEmailSubtitle")} <strong>{email}</strong>
                  </p>

                  <button
                    type="button"
                    className="btn btn--outline-dark btn--block"
                    onClick={() => navigate("/login")}
                  >
                    {t("auth.backToLogin")}
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