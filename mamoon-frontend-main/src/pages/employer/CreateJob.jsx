import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEmployer } from "../../context/EmployerContext";
import { useLanguage } from "../../context/LanguageContext";
import { rankCandidates } from "../../utils/matching";
import MatchRing from "../../components/MatchRing";

const TRAIT_KEYS = ["collaboration", "focus", "initiative", "resilience"];

export default function CreateJob() {
  const { createJob, candidatePool } = useEmployer();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const STEPS = [t("employer.stepBasics"), t("employer.stepSkills"), t("employer.stepPersonality"), t("employer.stepPublish")];
  const WORK_MODELS = t("employer.workModels");
  const TRAITS = TRAIT_KEYS.map((key) => ({ key, label: t(`candidate.${key}`) }));

  const [basics, setBasics] = useState({
    jobTitle: "",
    city: "",
    workModel: WORK_MODELS[1],
    description: "",
  });
  const [skillsInput, setSkillsInput] = useState("");
  const [requirementsInput, setRequirementsInput] = useState("");
  const [personalityTargets, setPersonalityTargets] = useState({
    collaboration: 70,
    focus: 70,
    initiative: 70,
    resilience: 70,
  });

  const requiredSkills = useMemo(
    () => skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
    [skillsInput]
  );
  const requirements = useMemo(
    () => requirementsInput.split("\n").map((s) => s.trim()).filter(Boolean),
    [requirementsInput]
  );

  const jobDraft = { ...basics, requiredSkills, requirements, personalityTargets };
  const ranked = useMemo(() => rankCandidates(candidatePool, jobDraft), [
    candidatePool,
    basics.jobTitle,
    requiredSkills,
    personalityTargets,
  ]);

  const goTo = (n) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePublish = () => {
    const job = createJob(jobDraft);
    navigate(`/employer/jobs/${job.id}`);
  };

  const stepStatus = (index) => {
    if (step > index + 1) return "done";
    if (step === index + 1) return "current";
    return "upcoming";
  };

  return (
    <div>
      {step > 1 ? (
        <button type="button" className="back-link" onClick={() => goTo(step - 1)} style={{ background: "none", border: "none" }}>
          <span aria-hidden="true">←</span> {t("employer.back")}
        </button>
      ) : (
        <Link to="/employer" className="back-link">
          <span aria-hidden="true">←</span> {t("employer.back")}
        </Link>
      )}

      <h1 className="page-title">{t("employer.createJobTitle")}</h1>

      <div className="wizard-stepper">
        {STEPS.map((label, i) => (
          <span className="wizard-step" key={label}>
            <span className={`wizard-step__dot wizard-step__dot--${stepStatus(i)}`}>
              {stepStatus(i) === "done" ? "✓" : i + 1}
            </span>
            <span className={`wizard-step__label ${stepStatus(i) === "current" ? "wizard-step__label--current" : ""}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="wizard-line" />}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="card wizard-card">
          <label className="field">
            <span>{t("employer.jobTitleLabel")}</span>
            <input
              value={basics.jobTitle}
              onChange={(e) => setBasics((p) => ({ ...p, jobTitle: e.target.value }))}
              placeholder="Senior Frontend Engineer"
            />
          </label>

          <div className="field-row" style={{ marginTop: 18 }}>
            <label className="field">
              <span>{t("employer.cityLabel")}</span>
              <input value={basics.city} onChange={(e) => setBasics((p) => ({ ...p, city: e.target.value }))} placeholder="Riyadh" />
            </label>
            <label className="field">
              <span>{t("employer.workModel")}</span>
              <select value={basics.workModel} onChange={(e) => setBasics((p) => ({ ...p, workModel: e.target.value }))}>
                {WORK_MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field" style={{ marginTop: 18 }}>
            <span>{t("employer.description")}</span>
            <textarea
              rows={5}
              value={basics.description}
              onChange={(e) => setBasics((p) => ({ ...p, description: e.target.value }))}
            />
          </label>

          <div className="wizard-actions">
            <span />
            <button type="button" className="btn btn--blue" onClick={() => goTo(2)} disabled={!basics.jobTitle.trim()}>
              {t("employer.next")} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card wizard-card">
          <label className="field">
            <span>{t("employer.requiredSkills")}</span>
            <input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="React, TypeScript, Design Systems" />
          </label>

          <label className="field" style={{ marginTop: 18 }}>
            <span>{t("employer.requirementsLabel")}</span>
            <textarea
              rows={6}
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
              placeholder={"5+ years experience\nStrong communication"}
            />
          </label>

          <div className="wizard-actions">
            <button type="button" className="btn btn--white" onClick={() => goTo(1)}>
              <span aria-hidden="true">←</span> {t("employer.back")}
            </button>
            <button type="button" className="btn btn--blue" onClick={() => goTo(3)} disabled={!skillsInput.trim()}>
              {t("employer.next")} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card wizard-card">
          <span className="pill pill--mint">✧ Mamoun</span>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: "14px 0 6px" }}>{t("employer.personalityQuestion")}</h2>
          <p style={{ color: "var(--color-ink-soft)", fontSize: 14.5, marginBottom: 24 }}>{t("employer.personalitySubtitle")}</p>

          {TRAITS.map(({ key, label }) => (
            <div className="trait-slider" key={key}>
              <div className="trait-slider__head">
                <span>{label}</span>
                <span>{personalityTargets[key]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={personalityTargets[key]}
                onChange={(e) => setPersonalityTargets((p) => ({ ...p, [key]: Number(e.target.value) }))}
              />
              <div className="trait-slider__scale">
                <span>{t("employer.lowerPriority")}</span>
                <span>{t("employer.essential")}</span>
              </div>
            </div>
          ))}

          <div className="callout">
<span aria-hidden="true" className="callout__icon" style={{ fontSize: 20 }}>✧</span> {t("employer.calloutText")}          </div>

          <div className="wizard-actions">
            <button type="button" className="btn btn--white" onClick={() => goTo(2)}>
              <span aria-hidden="true">←</span> {t("employer.back")}
            </button>
            <button type="button" className="btn btn--blue" onClick={() => goTo(4)}>
              {t("employer.next")} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card wizard-card">
          <div className="ai-preview-head">
            <span className="pill pill--mint">✧ {t("employer.livePreview")}</span>
            <span style={{ color: "var(--color-ink-soft)", fontSize: 13.5 }}>
              {t("employer.analyzed")} {ranked.length} {t("employer.candidatesWord")}
            </span>
          </div>

          <div className="rank-cards">
            {ranked.slice(0, 3).map(({ candidate, match }, i) => (
              <div className="rank-card" key={candidate.id}>
                <div className="rank-card__top">
                  <span className="rank-card__badge">#{i + 1}</span>
                  <MatchRing value={match.overall} />
                </div>
                <div className="rank-card__person">
                  <span className="rank-card__avatar" style={{ background: candidate.color }}>
                    {candidate.name.charAt(0)}
                  </span>
                  <span>
                    <div className="rank-card__name">{candidate.name}</div>
                    <div className="rank-card__role">{candidate.role}</div>
                  </span>
                </div>
                <ul className="rank-card__bullets">
                  <li>
                    <span aria-hidden="true">•</span>
                    {match.matchedSkills.length} {t("employer.skillsMatch")}: {match.matchedSkills.join(", ") || "—"}
                  </li>
                  <li>
                    <span aria-hidden="true">•</span> {candidate.years} {t("employer.yrsExperience")}
                  </li>
                  <li>
                    <span aria-hidden="true">•</span> {t("employer.basedIn")} {candidate.location}
                  </li>
                </ul>
                <div className="rank-card__stats">
                  <div className="rank-card__stat">
                    <span>{t("employer.skills")}</span>
                    <strong>{match.skillsScore}</strong>
                  </div>
                  <div className="rank-card__stat">
                    <span>{t("employer.experience")}</span>
                    <strong>{match.experienceScore}</strong>
                  </div>
                  <div className="rank-card__stat">
                    <span>{t("employer.personality")}</span>
                    <strong>{match.personalityScore}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>{t("employer.jobPreview")}</h3>
          <div className="job-preview-card">
            <div className="job-preview-card__title">{basics.jobTitle || "—"}</div>
            <div className="job-preview-card__meta">
              {basics.city || "—"} · {basics.workModel.toLowerCase()}
            </div>
            <div className="job-preview-card__tags">
              {requiredSkills.map((s) => (
                <span className="skill-tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <hr />
            <span className="pill pill--mint">{t("employer.personalityTarget")}</span>
            <div className="personality-grid" style={{ marginTop: 16 }}>
              {TRAITS.map(({ key, label }) => (
                <div className="match-bar" key={key}>
                  <div className="match-bar__head">
                    <span>{label}</span>
                    <span>{personalityTargets[key]}</span>
                  </div>
                  <div className="match-bar__track">
                    <div className="match-bar__fill match-bar__fill--teal" style={{ width: `${personalityTargets[key]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="wizard-actions">
            <button type="button" className="btn btn--white" onClick={() => goTo(3)}>
              <span aria-hidden="true">←</span> {t("employer.back")}
            </button>
            <button type="button" className="btn btn--blue" onClick={handlePublish}>
              <span aria-hidden="true" >✧</span> {t("employer.publishJob")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
