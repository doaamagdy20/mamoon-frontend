import { useState } from "react";
import { useEmployer } from "../../context/EmployerContext";
import { useLanguage } from "../../context/LanguageContext";

const INDUSTRY_OPTIONS = ["Technology", "Finance", "Healthcare", "Retail", "Education", "Manufacturing", "Other"];
const TEAM_SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "500+"];

export default function Profile() {
  const { companyProfile, updateCompanyProfile } = useEmployer();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    contactName: companyProfile.contactName || "",
    email: companyProfile.email || "",
    companyName: companyProfile.companyName || "",
    industry: companyProfile.industry || "",
    teamSize: companyProfile.teamSize || "",
    city: companyProfile.city || "",
    website: companyProfile.website || "",
  });
  const [saved, setSaved] = useState(false);

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompanyProfile(form);
    setSaved(true);
  };

  const initial = (form.contactName || form.companyName || "U").trim().charAt(0).toUpperCase();

  return (
    <div>
      <h1 className="page-title">{t("employer.profileTitle")}</h1>
      <p className="page-subtitle">{t("employer.profileSubtitle")}</p>

      <form className="employer-profile-card" onSubmit={handleSubmit}>
        <div className="employer-profile-avatar-row">
          <span className="employer-profile-avatar">{initial}</span>
          <div>
            <strong>{form.companyName || t("employer.profileTitle")}</strong>
            <p>{form.email || "—"}</p>
          </div>
        </div>

        <div className="employer-profile-row">
          <label className="employer-profile-field">
            <span>{t("employer.contactName")}</span>
            <input value={form.contactName} onChange={setField("contactName")} />
          </label>
          <label className="employer-profile-field">
            <span>{t("onboarding.email")}</span>
            <input type="email" value={form.email} onChange={setField("email")} />
          </label>
        </div>

        <label className="employer-profile-field">
          <span>{t("employer.companyName")}</span>
          <input value={form.companyName} onChange={setField("companyName")} />
        </label>

        <div className="employer-profile-row">
          <label className="employer-profile-field">
            <span>{t("employer.industry")}</span>
            <select value={form.industry} onChange={setField("industry")}>
              <option value="">—</option>
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="employer-profile-field">
            <span>{t("employer.teamSize")}</span>
            <select value={form.teamSize} onChange={setField("teamSize")}>
              <option value="">—</option>
              {TEAM_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="employer-profile-row">
          <label className="employer-profile-field">
            <span>{t("employer.cityLabel")}</span>
            <input value={form.city} onChange={setField("city")} />
          </label>
          <label className="employer-profile-field">
            <span>{t("employer.website")}</span>
            <input value={form.website} onChange={setField("website")} placeholder="https://" />
          </label>
        </div>

        <div className="employer-profile-actions">
          <button type="submit" className="btn btn--blue">
            {t("employer.saveChanges")}
          </button>
          {saved && <span className="employer-profile-saved">{t("employer.savedMessage")}</span>}
        </div>
      </form>
    </div>
  );
}
