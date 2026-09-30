import { useState } from "react";
import { useCandidate } from "../../context/CandidateContext";
import { useLanguage } from "../../context/LanguageContext";

export default function Profile() {
  const { profile, updateProfile } = useCandidate();
  const { t } = useLanguage();

  const EXPERIENCE_OPTIONS = t("onboarding.experienceOptions");
  const TRAITS = [
    { key: "resilience", label: t("candidate.resilience") },
    { key: "collaboration", label: t("candidate.collaboration") },
    { key: "focus", label: t("candidate.focus") },
    { key: "initiative", label: t("candidate.initiative") },
  ];
  const FALLBACK_SKILLS = ["RTL", "Tailwind", "GraphQL", "Design Systems", "TypeScript"];

  const [form, setForm] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    jobTitle: profile.jobTitle,
    yearsOfExperience: profile.yearsOfExperience,
  });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(profile.skills.length ? profile.skills : profile.cvFileName ? FALLBACK_SKILLS : []);

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const addSkill = (e) => {
    if (e.key !== "Enter" || !skillInput.trim()) return;
    e.preventDefault();
    if (!skills.includes(skillInput.trim())) setSkills((prev) => [...prev, skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  const saveChanges = () => {
    updateProfile({ ...form, skills });
  };

  const visibleSkills = skills.length ? skills : profile.cvFileName ? FALLBACK_SKILLS : [];

  const hasPersonality = Object.values(profile.personality).some((v) => v > 0);
  const currentName = form.fullName || profile.fullName;
  const currentRole = form.jobTitle || profile.jobTitle;
  const completedSections = [
    currentName ? { label: t("onboarding.fullName") } : null,
    form.email || profile.email ? { label: t("onboarding.email") } : null,
    form.city || profile.city ? { label: t("onboarding.city") } : null,
    currentRole ? { label: t("candidate.jobTitle") } : null,
    visibleSkills.length ? { label: t("candidate.skills") } : null,
    hasPersonality ? { label: t("candidate.personalityAssessment") } : null,
    profile.cvFileName ? { label: "CV" } : null,
  ].filter(Boolean);
  const completionPercent = Math.min(100, Math.round((completedSections.length / 7) * 100));
  const profileInitial = (currentName || "U").trim().charAt(0).toUpperCase();

  return (
    <div>
      <h1 className="page-title">{t("candidate.myProfile")}</h1>

      <div className="card profile-section">
        <h2 className="profile-section__title">{t("candidate.basics")}</h2>
        <div className="field-row">
          <label className="field">
            <span>{t("onboarding.fullName")}</span>
            <input value={form.fullName} onChange={setField("fullName")} />
          </label>
          <label className="field">
            <span>{t("onboarding.email")}</span>
            <input type="email" value={form.email} onChange={setField("email")} />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>{t("onboarding.phone")}</span>
            <input value={form.phone} onChange={setField("phone")} />
          </label>
          <label className="field">
            <span>{t("onboarding.city")}</span>
            <input value={form.city} onChange={setField("city")} />
          </label>
        </div>
        <div className="field-row">
          <label className="field">
            <span>{t("candidate.jobTitle")}</span>
            <input value={form.jobTitle} onChange={setField("jobTitle")} />
          </label>
          <label className="field">
            <span>{t("onboarding.yearsExp")}</span>
            <select value={form.yearsOfExperience} onChange={setField("yearsOfExperience")}>
              <option value="">—</option>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option value={opt} key={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="card profile-section">
        <div className="profile-section__head">
          <h2 className="profile-section__title">{t("candidate.skills")}</h2>
          {profile.cvFileName && <span className="pill pill--mint">✦ {t("candidate.fromCv")}</span>}
        </div>
        <div className="skills-input profile-skills-input">
          {visibleSkills.map((skill) => (
            <span className="skill-tag skill-tag--removable" key={skill}>
              {skill}
              <button type="button" aria-label={`Remove ${skill}`} onClick={() => removeSkill(skill)}>
                ×
              </button>
            </span>
          ))}
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={addSkill}
            placeholder={skills.length ? "" : t("candidate.addSkill")}
          />
        </div>
      </div>

      <div className="card profile-section">
        <div className="profile-section__head">
          <h2 className="profile-section__title">{t("candidate.personalityAssessment")}</h2>
          {hasPersonality && <span className="pill pill--mint profile-status-pill">Completed</span>}
        </div>

        {hasPersonality ? (
          <div className="profile-personality-grid">
            {TRAITS.map(({ key, label }) => (
              <div className="match-bar profile-match-bar" key={key}>
                <div className="match-bar__head">
                  <span>{label}</span>
                  <span>{profile.personality[key]}</span>
                </div>
                <div className="match-bar__track profile-match-track">
                  <div className="match-bar__fill match-bar__fill--teal" style={{ width: `${profile.personality[key]}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">{t("candidate.completeAssessment")}</p>
        )}
      </div>

      <div className="profile-save">
        <button type="button" className="btn btn--blue" onClick={saveChanges}>
          {t("candidate.saveChanges")}
        </button>
      </div>
    </div>
  );
}