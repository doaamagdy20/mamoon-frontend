import { useLanguage } from "../../context/LanguageContext";

export default function Messages() {
  const { t } = useLanguage();
  return (
    <div>
      <h1 className="page-title">{t("candidate.messagesTitle")}</h1>
      <p className="page-subtitle">{t("candidate.messagesSubtitle")}</p>

      <div className="card" style={{ marginTop: 22 }}>
        <p className="empty-state">{t("candidate.noMessages")}</p>
      </div>
    </div>
  );
}
