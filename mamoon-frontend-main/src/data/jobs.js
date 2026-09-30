export const JOBS = [
  {
    id: "senior-frontend-engineer",
    title: "Senior Frontend Engineer",
    company: "Qanawat",
    location: "Riyadh",
    workModel: "hybrid",
    tags: ["React", "TypeScript", "Design Systems", "RTL", "Tailwind"],
    salary: "SAR 22–28k",
    match: 28,
    matchBreakdown: { skills: 0, experience: 40, personality: 78 },
    about:
      "Lead the front-end for a bilingual (Arabic + English) hiring platform. Own the design system, drive performance, and mentor a small team.",
    requirements: [
      "6+ years building web apps",
      "Deep React & TypeScript",
      "RTL layout experience",
      "Design-system ownership",
    ],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    company: "Zaytouna Group",
    location: "Dubai",
    workModel: "remote",
    tags: ["Figma", "Design Systems", "UX Research", "Prototyping"],
    salary: "AED 18–24k",
    match: 28,
    matchBreakdown: { skills: 0, experience: 35, personality: 82 },
    about:
      "Shape the end-to-end candidate and employer experience. Partner closely with engineering to ship a consistent, accessible design system.",
    requirements: [
      "4+ years in product design",
      "Strong Figma & prototyping skills",
      "Comfortable running user research",
      "Portfolio of shipped products",
    ],
  },
  {
    id: "full-stack-engineer",
    title: "Full-stack Engineer",
    company: "Mishkat Labs",
    location: "Cairo",
    workModel: "onsite",
    tags: ["Node.js", "Postgres", "AWS", "TypeScript"],
    salary: "EGP 60–85k",
    match: 28,
    matchBreakdown: { skills: 0, experience: 45, personality: 70 },
    about:
      "Build and scale the core platform end to end — from the API and database layer to the applicant-facing UI. Own features from spec to production.",
    requirements: [
      "3+ years full-stack experience",
      "Node.js & relational databases",
      "Comfortable with AWS deployments",
      "TypeScript across the stack",
    ],
  },
];

export function getJobById(id) {
  return JOBS.find((job) => job.id === id);
}
