# 🚀 ReLaunchAI — AI Career Re-Entry Assistant for Women

> An AI-powered platform that helps women returning to the workforce after career breaks by providing personalized skill gap analysis, learning roadmaps, resume feedback, and interview coaching — powered by Google Gemini.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
- [User Journey](#user-journey)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

Many women take career breaks for caregiving or maternity reasons. When they attempt to re-enter the workforce, they face outdated skills, reduced confidence, and a lack of guidance tailored to their situation.

**ReLaunchAI** solves this by:

- Analyzing their career history and break duration.
- Identifying skill gaps relative to their target role.
- Generating a personalized, month-by-month learning roadmap.
- Recommending returnship programs and job opportunities.
- Evaluating their resume with ATS insights.
- Simulating real interview sessions with AI feedback.

---

## ✨ Features

| Feature                    | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| 🧠 **Skill Gap Analyzer**  | Compares user's existing skills with industry requirements for the target role |
| 🗺️ **Learning Roadmap**    | AI-generated month-by-month plan to bridge skill gaps                       |
| 💼 **Job & Returnship Finder** | Recommends relevant job roles and returnship programs (Amazon, IBM, Microsoft, etc.) |
| 📄 **Resume Analyzer**     | ATS score, missing keywords, and improvement suggestions                    |
| 🎙️ **AI Interview Coach**  | Role-specific Q&A simulation with scoring and feedback                      |
| 📋 **Career Profile Builder** | Collects user's background, skills, and target role to drive all AI features |

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                        |
|-----------------|-------------------------------|
| Next.js 16 (App Router) | React framework             |
| TypeScript       | Type safety                   |
| Tailwind CSS v4  | Utility-first styling         |
| Framer Motion    | Animations                    |
| Axios            | HTTP client                   |

### Backend

| Technology        | Purpose                        |
|------------------|-------------------------------|
| FastAPI           | Python REST API framework      |
| Uvicorn           | ASGI server                    |
| Google Gemini API | LLM for all AI capabilities    |
| pdfplumber        | PDF resume text extraction     |
| python-dotenv     | Environment variable management |

### Data

- Local JSON files: `courses.json`, `skills.json`, `returnships.json`

---

## 🏗️ System Architecture

```
         User Browser (Next.js UI)
                    │
                    │  HTTPS REST API
                    ▼
         ┌─────────────────────┐
         │   FastAPI Backend   │
         │   (Python Server)   │
         └──────────┬──────────┘
                    │
                    ▼
       ┌────────────────────────────┐
       │        AI Agent Layer       │
       │  ─────────────────────────  │
       │  Skill Gap Agent            │
       │  Roadmap Generator Agent    │
       │  Resume Analyzer Agent      │
       │  Interview Coach Agent      │
       └──────────┬─────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │   Gemini API    │
         │ (Google AI Studio) │
         └─────────────────┘
```

---

## 📁 Project Structure

```
ReLaunch/
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Landing / Profile Form
│   │   ├── dashboard/page.tsx    # Skill Gap, Roadmap, Job Suggestions
│   │   └── interview/page.tsx    # AI Interview Coach
│   ├── components/
│   │   ├── ProfileForm.tsx
│   │   ├── SkillGapCard.tsx
│   │   ├── RoadmapTimeline.tsx
│   │   ├── ResumeUpload.tsx
│   │   └── InterviewCoach.tsx
│   ├── services/
│   │   └── api.ts                # Axios API calls
│   └── package.json
│
├── backend/
│   ├── main.py                   # FastAPI entry point
│   ├── routes/
│   │   ├── analyze.py            # Profile analysis route
│   │   ├── resume.py             # Resume upload & analysis
│   │   └── interview.py          # Interview Q&A routes
│   ├── agents/
│   │   ├── skill_gap_agent.py
│   │   ├── roadmap_agent.py
│   │   ├── resume_agent.py
│   │   └── interview_agent.py
│   ├── services/
│   │   └── gemini_service.py     # Gemini API integration
│   ├── utils/
│   │   └── resume_parser.py      # PDF text extraction
│   ├── data/
│   │   └── courses.json
│   ├── requirements.txt
│   └── .env
│
└── PROJECT.md                    # Full PRD document
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.10+
- **Google Gemini API Key** — get it from [Google AI Studio](https://aistudio.google.com/)

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
# Create a .env file with the following:
GEMINI_API_KEY=your_gemini_api_key_here

# 5. Start the backend server
uvicorn main:app --reload --port 8000
```

The backend will be available at: `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env.local file:
NEXT_PUBLIC_API_URL=http://localhost:8000

# 4. Start the development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

---

## 📡 API Reference

**Base URL:** `http://localhost:8000`

### `POST /analyze-profile`

Generates skill gap analysis, learning roadmap, and job recommendations.

**Request Body:**
```json
{
  "previous_role": "Software Tester",
  "experience_years": 3,
  "career_gap_years": 4,
  "skills": ["Manual Testing", "SQL"],
  "target_role": "QA Automation Engineer"
}
```

**Response:**
```json
{
  "missing_skills": ["Python", "Selenium", "API Testing"],
  "roadmap": [
    "Week 1: Python basics",
    "Week 2: Selenium automation",
    "Week 3: API testing"
  ],
  "recommended_roles": ["QA Automation Engineer", "Test Engineer"],
  "returnship_programs": ["Amazon Returnship", "IBM Tech Re-Entry"]
}
```

---

### `POST /analyze-resume`

Analyzes an uploaded resume PDF and returns ATS insights.

**Request:** `multipart/form-data`
- `file`: PDF resume
- `target_role`: Target job title (string)

**Response:**
```json
{
  "ats_score": 78,
  "missing_keywords": ["Selenium", "Automation Testing"],
  "suggestions": [
    "Add automation testing experience",
    "Highlight measurable achievements"
  ]
}
```

---

### `POST /interview-question`

Generates a role-specific interview question.

**Request Body:**
```json
{ "role": "QA Automation Engineer" }
```

**Response:**
```json
{ "question": "Explain regression testing." }
```

---

### `POST /evaluate-answer`

Evaluates a user's answer and provides feedback.

**Request Body:**
```json
{
  "question": "Explain regression testing",
  "answer": "Regression testing ensures new changes don't break existing functionality."
}
```

**Response:**
```json
{
  "score": 7,
  "feedback": "Provide an example and mention automation tools."
}
```

---

## 🗺️ User Journey

```
1. Open Platform
       ↓
2. Fill Career Profile Form
   (Previous role, experience, break duration, skills, target role)
       ↓
3. AI Generates Skill Gap Report
       ↓
4. AI Generates Personalized Learning Roadmap
       ↓
5. View Job & Returnship Recommendations
       ↓
6. Upload Resume → Receive ATS Score & Suggestions
       ↓
7. Practice Interview with AI Coach
```

---

## 🔮 Future Improvements

- [ ] LinkedIn Jobs API integration
- [ ] Coursera / Udemy course API integration
- [ ] AI-powered resume builder
- [ ] Mentorship network feature
- [ ] Confidence tracking system
- [ ] User authentication & profile persistence
- [ ] Multi-language support

---

## 📄 License

This project was built as a **Hackathon Prototype**. All rights reserved.

---

<div align="center">
  <strong>Built with ❤️ to empower women returning to the workforce</strong>
</div>
