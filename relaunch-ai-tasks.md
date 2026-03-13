# 🚀 ReLaunchAI — Team Task Board
**Project:** AI Career Re-Entry Assistant for Women  
**Format:** Hackathon Prototype (3-Hour Sprint)  
**Team:** 2 Developers — Frontend (FE) + Backend (BE)

---

## 🗺️ High-Level Timeline

| Phase | Duration | FE Focus | BE Focus |
|-------|----------|----------|----------|
| **Phase 1 — Setup** | 0:00 – 0:30 | Next.js + Tailwind + ShadCN init | FastAPI + Gemini service init |
| **Phase 2 — Core Build** | 0:30 – 2:00 | Profile form, Dashboard, Roadmap UI | All 4 AI agents + 4 API endpoints |
| **Phase 3 — Polish + Integrate** | 2:00 – 2:45 | Connect FE to BE, loading states, errors | CORS, resume parser, response tuning |
| **Phase 4 — Demo Prep** | 2:45 – 3:00 | Final flow walkthrough | Seed mock data, fix edge cases |

---

## 👤 PERSON 1 — Frontend Developer

> **Stack:** Next.js 14 (App Router), Tailwind CSS, ShadCN UI, Axios

---

### ✅ PHASE 1 — Setup (0:00–0:30)

- [ ] **T1.1** — Bootstrap Next.js 14 project with App Router
  ```bash
  npx create-next-app@latest frontend --typescript --tailwind --app
  ```
- [ ] **T1.2** — Install ShadCN UI and initialize
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button card input label textarea badge progress
  ```
- [ ] **T1.3** — Install Axios
  ```bash
  npm install axios
  ```
- [ ] **T1.4** — Create `services/api.ts` — base Axios instance pointing to `http://localhost:8000`
- [ ] **T1.5** — Set up `globals.css` with brand colors (soft rose + indigo palette for empowerment theme)
- [ ] **T1.6** — Create folder structure:
  ```
  app/
    page.tsx          ← Landing / Profile Form
    dashboard/page.tsx ← Results Dashboard
    interview/page.tsx ← Interview Coach
  components/
    ProfileForm.tsx
    SkillGapCard.tsx
    RoadmapTimeline.tsx
    ResumeUpload.tsx
    InterviewCoach.tsx
  services/
    api.ts
  ```

---

### ✅ PHASE 2 — Core UI Build (0:30–2:00)

#### 🧩 T2.1 — `ProfileForm.tsx` (Priority: CRITICAL)
- [ ] Multi-step form with fields:
  - Previous Role (text input)
  - Years of Experience (number)
  - Career Break Duration in years (number)
  - Skills Known (tag input — comma-separated)
  - Desired Target Role (text input)
- [ ] "Analyze My Profile" CTA button
- [ ] On submit → call `POST /analyze-profile` via `api.ts`
- [ ] On success → navigate to `/dashboard` with response data (use `localStorage` or query params)

#### 📊 T2.2 — `SkillGapCard.tsx`
- [ ] Display `missing_skills` as badge list (red/amber styled)
- [ ] Show "Skills You Already Have" in green badges
- [ ] Header: "Your Skill Gap Analysis"

#### 🗺️ T2.3 — `RoadmapTimeline.tsx`
- [ ] Render `roadmap[]` as a vertical timeline (Month 1, Month 2…)
- [ ] Each item: icon + label + estimated duration
- [ ] Use ShadCN `Card` components for each milestone

#### 💼 T2.4 — Job & Returnship Section (inside `dashboard/page.tsx`)
- [ ] Show `recommended_roles` as cards
- [ ] Show `returnship_programs` as clickable cards (name + logo placeholder)
- [ ] Section title: "Opportunities Matched For You"

#### 📄 T2.5 — `ResumeUpload.tsx`
- [ ] Drag-and-drop PDF upload zone
- [ ] Target role input field
- [ ] On upload → call `POST /analyze-resume` (multipart form)
- [ ] Display: ATS score (progress bar), missing keywords (badges), suggestions (bullet list)

#### 🎤 T2.6 — `InterviewCoach.tsx` (app/interview/page.tsx)
- [ ] "Get Interview Question" button → calls `POST /interview-question`
- [ ] Displays question in a styled card
- [ ] Text area for user's answer
- [ ] "Submit Answer" → calls `POST /evaluate-answer`
- [ ] Displays: score (out of 10) + written feedback
- [ ] "Next Question" button to loop

---

### ✅ PHASE 3 — Integration & Polish (2:00–2:45)

- [ ] **T3.1** — Add loading spinners for all API calls (Axios interceptors)
- [ ] **T3.2** — Add error toast notifications (ShadCN `Toast`) for failed requests
- [ ] **T3.3** — Connect all pages end-to-end (verify data flows from form → dashboard → interview)
- [ ] **T3.4** — Mobile responsiveness check (grid → stack on small screens)
- [ ] **T3.5** — Add a top `Navbar` with logo "ReLaunchAI" and nav links: Home | Dashboard | Interview Coach
- [ ] **T3.6** — Landing page hero section: tagline, "Start Your Journey" CTA button

---

### ✅ PHASE 4 — Demo Prep (2:45–3:00)

- [ ] **T4.1** — Pre-fill form with demo data: *"Software Tester, 3 years exp, 4 year break, Manual Testing + SQL → QA Automation Engineer"*
- [ ] **T4.2** — Run full demo flow once: form → dashboard → resume → interview
- [ ] **T4.3** — Screenshot or screen record the complete journey

---

## 👤 PERSON 2 — Backend Developer

> **Stack:** FastAPI, Python 3.10+, Uvicorn, Google Gemini API, pdfplumber

---

### ✅ PHASE 1 — Setup (0:00–0:30)

- [ ] **T1.1** — Create Python venv and install dependencies:
  ```bash
  python -m venv venv
  pip install fastapi uvicorn google-generativeai pdfplumber python-multipart python-dotenv
  ```
- [ ] **T1.2** — Create `.env` file:
  ```
  GEMINI_API_KEY=your_key_here
  ```
- [ ] **T1.3** — Create `main.py` — FastAPI app with CORS middleware (allow `http://localhost:3000`)
- [ ] **T1.4** — Create `services/gemini_service.py` — initialize Gemini client, expose `ask_gemini(prompt: str) -> str` helper
- [ ] **T1.5** — Create folder structure:
  ```
  backend/
    main.py
    .env
    routes/
      analyze.py
      resume.py
      interview.py
    agents/
      skill_gap_agent.py
      roadmap_agent.py
      resume_agent.py
      interview_agent.py
    services/
      gemini_service.py
    utils/
      resume_parser.py
    data/
      courses.json
      skills.json
      returnships.json
  ```
- [ ] **T1.6** — Seed `data/returnships.json` with 10 real returnship programs (Amazon, IBM, Microsoft, Salesforce, etc.)
- [ ] **T1.7** — Seed `data/skills.json` with common role → industry skills mapping

---

### ✅ PHASE 2 — AI Agents + API Endpoints (0:30–2:00)

#### 🤖 T2.1 — `services/gemini_service.py` (Priority: CRITICAL)
- [ ] Load API key from `.env`
- [ ] Initialize `google.generativeai` with `gemini-1.5-flash` model
- [ ] `ask_gemini(prompt: str) -> str` — sends prompt, returns text response
- [ ] `ask_gemini_json(prompt: str) -> dict` — parses JSON from Gemini response (use `json.loads` + fallback)

#### 🧠 T2.2 — `agents/skill_gap_agent.py`
- [ ] Function: `analyze_skill_gap(profile: dict) -> dict`
- [ ] Builds prompt: *"User was a {role} with {X} years exp, took {Y} year break. They know: {skills}. Target: {target_role}. List missing industry skills as JSON array."*
- [ ] Returns: `{ "missing_skills": [...] }`

#### 🗺️ T2.3 — `agents/roadmap_agent.py`
- [ ] Function: `generate_roadmap(profile: dict, missing_skills: list) -> list`
- [ ] Builds prompt: *"Create a week-by-week or month-by-month learning roadmap for {target_role}. Missing skills: {missing_skills}. Return as JSON array of strings."*
- [ ] Returns: `["Week 1: Python basics", "Week 2: Selenium", ...]`

#### 💼 T2.4 — `agents/resume_agent.py`
- [ ] Function: `analyze_resume(resume_text: str, target_role: str) -> dict`
- [ ] Prompt: *"Analyze this resume for {target_role}. Give ATS score (0–100), missing keywords, and improvement suggestions. Return as JSON."*
- [ ] Returns: `{ "ats_score": 78, "missing_keywords": [...], "suggestions": [...] }`

#### 🎤 T2.5 — `agents/interview_agent.py`
- [ ] Function: `generate_question(role: str) -> str`
  - Prompt: *"Generate one realistic interview question for a {role}. Return just the question."*
- [ ] Function: `evaluate_answer(question: str, answer: str) -> dict`
  - Prompt: *"Evaluate this interview answer for the question '{question}'. Score 1–10 and give improvement feedback. Return JSON: {score, feedback}."*

#### 🌐 T2.6 — `routes/analyze.py` — `POST /analyze-profile`
- [ ] Accept `UserProfile` Pydantic model
- [ ] Call `skill_gap_agent.analyze_skill_gap()`
- [ ] Call `roadmap_agent.generate_roadmap()`
- [ ] Load `returnships.json` → filter relevant programs
- [ ] Return combined response JSON (see PRD spec)

#### 📄 T2.7 — `routes/resume.py` — `POST /analyze-resume`
- [ ] Accept `file` (PDF) + `target_role` (form field) via multipart
- [ ] Call `utils/resume_parser.py` → extract text from PDF using `pdfplumber`
- [ ] Call `resume_agent.analyze_resume(text, target_role)`
- [ ] Return analysis JSON

#### 🎤 T2.8 — `routes/interview.py` — `POST /interview-question` + `POST /evaluate-answer`
- [ ] `POST /interview-question`: Accept `{ role }` → return `{ question }`
- [ ] `POST /evaluate-answer`: Accept `{ question, answer }` → return `{ score, feedback }`

#### 🔧 T2.9 — `utils/resume_parser.py`
- [ ] `extract_text_from_pdf(file_bytes: bytes) -> str` using `pdfplumber`
- [ ] Handle empty/corrupt PDF gracefully

---

### ✅ PHASE 3 — Integration & Polish (2:00–2:45)

- [ ] **T3.1** — Enable CORS in `main.py` for `http://localhost:3000`
- [ ] **T3.2** — Add input validation with Pydantic (required fields, type checks)
- [ ] **T3.3** — Add try/except around all Gemini calls → return structured error responses
- [ ] **T3.4** — Test each endpoint manually with `curl` or Swagger UI (`/docs`)
- [ ] **T3.5** — Tune Gemini prompts for consistent JSON output (use explicit JSON format instructions)
- [ ] **T3.6** — Add `recommended_roles` to `/analyze-profile` response (derive from target role + Gemini)

---

### ✅ PHASE 4 — Demo Prep (2:45–3:00)

- [ ] **T4.1** — Run server: `uvicorn main:app --reload --port 8000`
- [ ] **T4.2** — Walk through demo request via Swagger `/docs` to verify all 4 endpoints
- [ ] **T4.3** — Verify resume upload works with a sample PDF
- [ ] **T4.4** — Confirm CORS is working with the live frontend

---

## 🔗 Integration Sync Points

> These are moments where BOTH devs must coordinate:

| Sync Point | When | Action |
|-----------|------|--------|
| **API Contract** | 0:30 (after setup) | Agree on exact request/response shapes |
| **CORS Check** | After T3.1 (BE) | FE makes first real API call |
| **Resume Upload** | After T2.5 (FE) + T2.7 (BE) | Test end-to-end PDF flow together |
| **Full Flow Demo** | 2:45 | Both run the complete user journey |

---

## 📦 Shared Decisions (Agreed Up-Front)

| Decision | Choice |
|----------|--------|
| Base URL | `http://localhost:8000` |
| AI Model | `gemini-1.5-flash` (fast, free tier) |
| Auth | None (hackathon scope) |
| DB | Local JSON files only |
| Resume format | PDF only (pdfplumber) |
| State between pages | `localStorage` (FE persists profile result) |

---

## 🏆 Definition of Done (Hackathon)

- [ ] User can fill profile form and get skill gap + roadmap
- [ ] User can upload a resume and get ATS score + suggestions
- [ ] User can practice interview Q&A with AI feedback
- [ ] All 4 API endpoints return correct JSON
- [ ] UI looks polished and tells the user's story clearly
- [ ] End-to-end demo runs without errors in under 60 seconds
