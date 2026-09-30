# Mamoun — Smart Hiring Platform (React)

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

## Build for production
```bash
npm run build
```

## Environment variables
See `.env.example`. Two variables control the API layer:
- `VITE_API_URL` — base URL of the backend (unused while in mock mode).
- `VITE_MOCK_MODE` — `true` (default) makes every function in `src/services/`
  return mock/in-memory data instead of calling a real API. **The backend is
  not deployed yet**, so this stays `true` for now. Once it's live, set it to
  `false` and point `VITE_API_URL` at the real base URL — no other code
  changes needed, since every page calls the API only through `src/services/`.

## API layer & auth
- `src/services/` — one file per resource (`authApi`, `jobsApi`, `candidatesApi`)
  plus a shared `request()` fetch wrapper in `api.js`. This is the *only*
  place that should talk to the backend.
- `src/context/AuthContext.jsx` — holds the logged-in user/token (persisted to
  `localStorage`), exposes `login()`, `signup()`, `logout()`.
- `src/components/ProtectedRoute.jsx` — guards `/candidate` and `/employer`
  routes; redirects to `/login` if not authenticated, and to `/` if the
  logged-in user's role doesn't match the route.
- `src/hooks/useApiRequest.js` + `src/components/LoadingState.jsx` /
  `ErrorState.jsx` — the pattern used to fetch data with loading/error UI
  (see `src/pages/candidate/Jobs.jsx` for a full example).

## Docker
```bash
docker build -t mamoun-app .
docker run -p 8080:80 mamoun-app
```
Multi-stage build: Node 22 to build the static bundle, served by nginx with
an SPA fallback (`nginx.conf`) so client-side routes don't 404 on refresh.
Pass `--build-arg VITE_API_URL=... --build-arg VITE_MOCK_MODE=false` for a
real backend once it exists.

## Structure
```
src/
  components/   Navbar, Footer, Logo (shared UI)
  pages/        Home, GetStarted, Login, Signup
  styles/       shared button/pill/card primitives
App.jsx         routes
main.jsx        entry point (BrowserRouter)
```

## Pages so far
- `/`                        Landing page (hero, about/stats, latest jobs, CTA banner)
- `/get-started`             "How will you use Mamoun?" — candidate / employer picker + "Already have an account? Log in"
- `/login`                   Simple login form
- `/signup`                  Signup form for employers (reads ?role=employer from Get Started)
- `/onboarding`               Candidate onboarding wizard: Basic profile → CV & skills → Personality assessment → Thank you
- `/candidate`                Candidate app shell (sidebar + topbar), nested routes:
  - `/candidate`               Dashboard (welcome, active applications, recommended jobs)
  - `/candidate/jobs`          Jobs list with search + work-model filter
  - `/candidate/jobs/:id`      Job details (match breakdown, Apply modal)
  - `/candidate/applications`  My applications (empty state until you apply)
  - `/candidate/messages`      Messages placeholder
  - `/candidate/profile`       Profile (basics, skills, personality results, Save changes)

Candidate data (profile, applications) lives in `src/context/CandidateContext.jsx` — in-memory only,
no backend yet, so it resets on page reload. Sample job data is in `src/data/jobs.js`.

## Employer flow
- `/employer`                            Dashboard (welcome, pipeline snapshot / create-first-job empty state)
- `/employer/jobs`                       All posted jobs
- `/employer/jobs/new`                   Create a job wizard: Basics → Skills & requirements → Personality fit → Publish (live AI preview)
- `/employer/jobs/:jobId`                Job pipeline: Kanban board (New/Screening/Interview/Offer/Rejected) + AI-matched candidates list
- `/employer/jobs/:jobId/candidates/:id` Candidate detail — match breakdown, Move forward / Reject
- `/employer/candidates`                 Candidates across every job
- `/employer/analytics`                  Simple hiring stats

Employer data lives in `src/context/EmployerContext.jsx` (in-memory, resets on reload). The AI match
score is computed client-side in `src/utils/matching.js` from a mock candidate pool in
`src/data/candidatePool.js` — skills overlap (40%), years of experience (25%), and closeness to the
job's personality targets (35%). Swap this out for a real API once the backend exists.

More pages can be added under `src/pages` and wired into `App.jsx`.

## Language switching (English / Arabic)
Clicking the "العربية" / "English" pill in any navbar or sidebar now actually switches the whole
app's language and text direction:
- `src/context/LanguageContext.jsx` holds the `en`/`ar` dictionaries, the current `lang`, and a `t(key)`
  helper (e.g. `t("candidate.myProfile")`).
- Toggling sets `<html lang>` and `<html dir>` (`rtl` for Arabic), so layouts flip automatically since
  they're built with flexbox, and remembers the choice in `localStorage`.
- Every page/component that renders UI text reads it through `t(...)` instead of hardcoding English, so
  the whole app — landing page, onboarding, candidate app, employer app — re-renders in the new language
  instantly.
- Job/candidate data itself (titles like "Senior Frontend Engineer", skills like "React") stays in
  English since that's real content, not UI chrome.
