import { Link } from "react-router-dom";
import Logo from "../assets/imgs/Mamoun.svg";
import { useLanguage } from "../context/LanguageContext";
import langauge from "../assets/icons/language.svg";
import "./Navbar.css";

export default function Navbar({ variant = "full" }) {
  const { t, lang, toggleLang } = useLanguage();
  const otherLangLabel = lang === "en" ? "العربية" : "English";

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <img src={Logo} alt="" className="navbar__brand-logo" />
          <span className="navbar__brand-text">
            <strong>Mamoun</strong>
            {variant === "full" && <small>{t("nav.tagline")}</small>}
          </span>
        </Link>

        {variant === "full" ? (
          <div className="navbar__actions">
            <button className="lang-toggle" type="button" onClick={toggleLang} aria-label="Toggle language">
              <span className="lang-toggle__icon" aria-hidden="true">
                <img src={langauge} alt="" className="lang-toggle__icon-img" />
              </span>
              {otherLangLabel}
            </button>
            <Link to="/login" className="navbar__login">
              {t("nav.login")}
            </Link>
            <Link to="/get-started" className="btn btn--dark startbtn">
              {t("nav.getStarted")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <div className="navbar__actions">
            <button className="lang-toggle" type="button" onClick={toggleLang} aria-label="Toggle language">
              <span className="lang-toggle__icon" aria-hidden="true">
                🌐
              </span>
              {otherLangLabel}
            </button>
            <Link to="/" className="navbar__back">
              <span aria-hidden="true">←</span> {t("nav.backHome")}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
