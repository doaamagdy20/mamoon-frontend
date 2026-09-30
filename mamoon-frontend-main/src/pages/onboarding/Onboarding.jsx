import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../../assets/imgs/Mamoun.svg";
import { useCandidate } from "../../context/CandidateContext";
import { useLanguage } from "../../context/LanguageContext";
import "./Onboarding.css";

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useCandidate();
  const { t } = useLanguage();

  const STEPS = t("onboarding.steps");
  const QUESTIONS = t("onboarding.questions");
  const SCALE_LABELS = t("onboarding.scale");
  const SCALE = SCALE_LABELS.map((label, i) => ({ value: i + 1, label }));
  const EXPERIENCE_OPTIONS = t("onboarding.experienceOptions");

  const [step, setStep] = useState(1); // 1,2,3, then 4 = thank you
  const [form, setForm] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    yearsOfExperience: profile.yearsOfExperience,
    jobTitle: profile.jobTitle,
  });
  const [cvFileName, setCvFileName] = useState("");
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [qIndex, setQIndex] = useState(0);

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const goToStep = (n) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBasicsContinue = (e) => {
    e.preventDefault();
    updateProfile(form);
    goToStep(2);
  };

  const handleCvFile = (file) => {
    if (!file) return;
    setCvFileName(file.name);
    updateProfile({ cvFileName: file.name, skills: profile.skills.length ? profile.skills : [] });
    goToStep(3);
  };

  const answerQuestion = (value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = value;
      return next;
    });
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      const scores = computePersonality([...answers.slice(0, qIndex), value]);
      updateProfile({ personality: scores, onboardingComplete: true });
      goToStep(4);
    }
  };

  const goPrevQuestion = () => {
    if (qIndex > 0) setQIndex((i) => i - 1);
    else goToStep(2);
  };

  const stepStatus = (index) => {
    if (step > index + 1 || step === 4) return "done";
    if (step === index + 1) return "current";
    return "upcoming";
  };

  return (
    <div className="onboarding">
      <header className="onboarding__header">
        <div className="onboarding__brand">
          <img src={Logo} alt="" className="onboarding__brand-logo" />
          <strong>Mamoun</strong>
        </div>
        {step <= 3 && (
          <span className="onboarding__step-label">
            {t("onboarding.stepLabel")} {step} {t("onboarding.stepOf")}
          </span>
        )}
      </header>

      <main className="onboarding__main">
        <div className="onboarding__stepper">
          {STEPS.map((label, i) => (
            <div className="stepper-item" key={label}>
              <div className="stepper-item__row">
                <span className={`stepper-dot stepper-dot--${stepStatus(i)}`}>
                  {stepStatus(i) === "done" ? "✓" : i + 1}
                </span>
                {i < STEPS.length - 1 && (
                  <span className={`stepper-line ${stepStatus(i) === "done" ? "stepper-line--done" : ""}`} />
                )}
              </div>
              <span className={`stepper-label ${stepStatus(i) === "current" ? "stepper-label--current" : ""}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 className="onboarding__title">{t("onboarding.basicsTitle")}</h1>
            <p className="onboarding__subtitle">{t("onboarding.basicsSubtitle")}</p>

            <form className="onboarding-card card" onSubmit={handleBasicsContinue}>
              <label className="field">
                <span>{t("onboarding.fullName")}</span>
                <input value={form.fullName} onChange={setField("fullName")} required />
              </label>

              <div className="field-row">
                <label className="field">
                  <span>{t("onboarding.email")}</span>
                  <input type="email" value={form.email} onChange={setField("email")} required />
                </label>
                <label className="field">
                  <span>{t("onboarding.phone")}</span>
                  <input value={form.phone} onChange={setField("phone")} placeholder="+966 5XX XXX XXX" />
                </label>
              </div>

              <div className="field-row">
                <label className="field">
                  <span>{t("onboarding.city")}</span>
                  <input value={form.city} onChange={setField("city")} placeholder="Riyadh" />
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

              <label className="field">
                <span>{t("onboarding.jobTitle")}</span>
                <input value={form.jobTitle} onChange={setField("jobTitle")} placeholder="Senior Frontend Engineer" />
              </label>

              <div className="onboarding-card__actions">
                <button type="button" className="link-btn" onClick={() => updateProfile(form)}>
                  {t("onboarding.saveDraft")}
                </button>
                <button type="submit" className="btn btn--blue">
                  {t("onboarding.continueBtn")} <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="onboarding__title">{t("onboarding.cvTitle")}</h1>
            <p className="onboarding__subtitle">{t("onboarding.cvSubtitle")}</p>

            <div className="onboarding-card card">
              <label
                className="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleCvFile(e.dataTransfer.files?.[0]);
                }}
              >
                <input
                  id="cv-upload-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={(e) => handleCvFile(e.target.files?.[0])}
                />
                <span className="dropzone__icon" aria-hidden="true">
                  ⬆
                </span>
                <p>
                  {t("onboarding.dropzoneText")} <span className="dropzone__browse">{t("onboarding.browseFiles")}</span>
                </p>
                <small>{t("onboarding.fileHint")}</small>
              </label>
            </div>

            <div className="onboarding__nav">
              <button type="button" className="btn btn--white" onClick={() => goToStep(1)}>
                <span aria-hidden="true">←</span> {t("onboarding.back")}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="onboarding__title">{t("onboarding.personalityTitle")}</h1>
            <p className="onboarding__subtitle">{t("onboarding.personalitySubtitle")}</p>

            <div className="onboarding-card card assessment-card">
              <div className="assessment-card__head">
                <span className="pill pill--mint">{t("onboarding.assessmentLabel")}</span>
                <span className="assessment-card__count">
                  {t("onboarding.questionOf")} {qIndex + 1} {t("onboarding.of")} {QUESTIONS.length}
                </span>
              </div>

              <div className="assessment-progress">
                <div
                  className="assessment-progress__fill"
                  style={{ width: `${((qIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <h2 className="assessment-question">{QUESTIONS[qIndex]}</h2>

              <div className="assessment-options">
                {SCALE.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    className={`assessment-option ${answers[qIndex] === opt.value ? "assessment-option--selected" : ""}`}
                    onClick={() => answerQuestion(opt.value)}
                  >
                    <span className="assessment-option__num">{opt.value}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="onboarding__nav">
              <button type="button" className="link-btn" onClick={goPrevQuestion}>
                <span aria-hidden="true">←</span> {t("onboarding.previous")}
              </button>
              <button type="button" className="btn btn--white" onClick={() => goToStep(2)}>
                {t("onboarding.back")}
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <div className="onboarding-thanks">
            <span className="onboarding-thanks__icon" aria-hidden="true">
              ✓
            </span>
            <h1 className="onboarding__title">{t("onboarding.thankYouTitle")}</h1>
            <p className="onboarding__subtitle onboarding__subtitle--wide">{t("onboarding.thankYouSubtitle")}</p>
            <button type="button" className="btn btn--blue" onClick={() => navigate("/candidate")}>
              {t("onboarding.goToDashboard")} <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function computePersonality(values) {
  const toPct = (nums) => Math.round((nums.reduce((a, b) => a + b, 0) / nums.length / 5) * 100);
  return {
    resilience: toPct([values[0], values[2], values[5]]),
    collaboration: toPct([values[1]]),
    focus: toPct([values[3]]),
    initiative: toPct([values[4]]),
  };
}
