import Logo from "../assets/imgs/Mamoun.svg";
import { useLanguage } from "../context/LanguageContext";
import "./Footer.css";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src={Logo} alt="" className="footer__brand-logo" />
          <strong>Mamoun</strong>
        </div>
        <p className="footer__copy">{t("footer.rights")}</p>
      </div>
    </footer>
  );
}
