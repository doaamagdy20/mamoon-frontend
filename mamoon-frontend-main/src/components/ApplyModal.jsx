import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function ApplyModal({ job, onClose, onSubmit }) {
  const { t } = useLanguage();
  const [coverNote, setCoverNote] = useState("");

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-card__title">{t("candidate.applyModalTitle")}</h2>
        <p className="modal-card__subtitle">
          {job.title} · {job.company}
        </p>

        <label className="field">
          <span>{t("candidate.coverNote")}</span>
          <textarea
            rows={5}
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            placeholder={t("candidate.coverNotePlaceholder")}
          />
        </label>
        <small className="modal-card__hint">{t("candidate.coverNoteHint")}</small>

        <div className="modal-card__actions">
          <button type="button" className="link-btn" onClick={onClose}>
            {t("candidate.cancel")}
          </button>
          <button type="button" className="btn btn--blue" onClick={() => onSubmit(coverNote)}>
            {t("candidate.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
