import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../../assets/imgs/Mamoun.svg";
import { useEmployer } from "../../context/EmployerContext";
import "./CompanySetup.css";

const INDUSTRY_OPTIONS = ["Technology", "Finance", "Healthcare", "Retail", "Education", "Manufacturing", "Other"];
const TEAM_SIZE_OPTIONS = ["1-10", "11-50", "51-200", "201-500", "500+"];

export default function CompanySetup() {
  const navigate = useNavigate();
  const { companyProfile, updateCompanyProfile } = useEmployer();

  const [form, setForm] = useState({
    companyName: companyProfile.companyName || "",
    industry: companyProfile.industry || "",
    teamSize: companyProfile.teamSize || "",
    city: companyProfile.city || "",
    website: companyProfile.website || "",
  });

  const isComplete = Object.values(form).every((value) => value.trim() !== "");

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isComplete) return;
    updateCompanyProfile(form);
    navigate("/employer");
  };

  return (
    <div className="company-setup">
      <header className="company-setup__header">
        <div className="company-setup__brand">
          <img src={Logo} alt="" className="company-setup__brand-logo" />
          <strong>Mamoun</strong>
        </div>
      </header>

      <main className="company-setup__main">
        <h1 className="company-setup__title">Set up your company</h1>
        <p className="company-setup__subtitle">This appears on every job you post.</p>

        <form className="company-setup__card" onSubmit={handleSubmit}>
          <label className="company-setup__field">
            <span>Company name</span>
            <input value={form.companyName} onChange={setField("companyName")} required />
          </label>

          <div className="company-setup__row">
            <label className="company-setup__field">
              <span>Industry</span>
              <select value={form.industry} onChange={setField("industry")} required>
                <option value="">—</option>
                {INDUSTRY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="company-setup__field">
              <span>Team size</span>
              <select value={form.teamSize} onChange={setField("teamSize")} required>
                <option value="">—</option>
                {TEAM_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="company-setup__row">
            <label className="company-setup__field">
              <span>Headquarters city</span>
              <input value={form.city} onChange={setField("city")} required />
            </label>

            <label className="company-setup__field">
              <span>Website</span>
              <input value={form.website} onChange={setField("website")} placeholder="https://" required />
            </label>
          </div>

          <div className="company-setup__actions">
            <button type="submit" className="company-setup__submit" disabled={!isComplete}>
              Complete setup <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </main>

      <button type="button" className="company-setup__help" aria-label="Help">
        ?
      </button>
    </div>
  );
}
