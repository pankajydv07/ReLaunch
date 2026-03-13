PRODUCT REQUIREMENTS DOCUMENT (PRD)
AI Career Re-Entry Assistant for Women Returning to Work
Hackathon Prototype (3-Hour Optimized)

------------------------------------------------------------
1. PRODUCT OVERVIEW
------------------------------------------------------------

Product Name:
ReLaunchAI – AI Career Re-Entry Assistant

Problem Statement:
Many women take career breaks due to caregiving or maternity responsibilities. When they try to return to the workforce, they face challenges such as outdated skills, reduced confidence, and lack of clarity about current job requirements.

Existing job platforms rarely provide personalized guidance for individuals re-entering after a career break.

Solution:
An AI-powered platform that analyzes a user's career history, break duration, and desired role, then generates a personalized roadmap to help them return to work confidently.

Key Capabilities:
• AI skill gap analysis  
• Personalized learning roadmap  
• Returnship / job suggestions  
• Resume improvement suggestions  
• AI interview preparation guidance  

Target Users:
Women returning to professional careers after career breaks.

Example Users:
• Software engineer returning after maternity break  
• Marketing professional re-entering after family caregiving  
• Teacher transitioning to EdTech  

------------------------------------------------------------
2. PRODUCT GOALS
------------------------------------------------------------

Primary Goals

1. Help women identify missing industry skills.
2. Provide structured learning roadmaps.
3. Improve confidence for job interviews.
4. Increase awareness of returnship opportunities.

Success Metrics

• Skill gap generated within 5 seconds
• Roadmap generated instantly
• Resume suggestions generated correctly
• Interview feedback returned in real time

Hackathon Success Criteria

• Fully functional prototype
• Clear AI usage
• Smooth UI flow
• End-to-end demo journey

------------------------------------------------------------
3. CORE FEATURES (MVP)
------------------------------------------------------------

Feature 1 — Career Profile Builder

User Inputs

• Previous Role  
• Years of Experience  
• Career Break Duration  
• Skills Known  
• Desired Target Role  
• Resume Upload (Optional)

Output

UserProfile object used by AI.

------------------------------------------------------------

Feature 2 — AI Skill Gap Analyzer

AI compares:

User Skills vs Industry Skills.

Example

User Skills
Manual Testing, SQL

Industry Skills
Python, Selenium, API Testing

Output

Missing Skills
• Python  
• Selenium  
• API Testing  

------------------------------------------------------------

Feature 3 — Personalized Learning Roadmap

AI generates structured learning plan.

Example

Month 1
Python Fundamentals

Month 2
Automation Testing with Selenium

Month 3
API Testing

Month 4
CI/CD Concepts

------------------------------------------------------------

Feature 4 — Job & Returnship Suggestions

AI recommends roles and programs.

Example

Roles
• QA Automation Engineer  
• Software Tester  

Programs
• Amazon Returnship  
• IBM Tech Re-Entry  
• Microsoft Leap  

------------------------------------------------------------

Feature 5 — Resume Analyzer

User uploads resume.

AI analyzes:

• ATS keywords
• Missing competencies
• Resume wording improvements

Example Output

Suggestions
• Add automation testing keywords  
• Highlight measurable achievements  

------------------------------------------------------------

Feature 6 — AI Interview Coach

Interactive interview simulation.

Capabilities

• Ask role-specific interview questions  
• Evaluate answers  
• Provide improvement feedback  

------------------------------------------------------------
4. USER JOURNEY
------------------------------------------------------------

Step 1  
User opens the platform.

Step 2  
User fills career profile form.

Step 3  
Backend sends profile to AI analysis engine.

Step 4  
AI generates skill gap report.

Step 5  
AI generates personalized learning roadmap.

Step 6  
User receives job suggestions.

Step 7  
User uploads resume for analysis.

Step 8  
User practices interview with AI coach.

------------------------------------------------------------
5. SYSTEM ARCHITECTURE
------------------------------------------------------------

High-Level Architecture

                ┌───────────────────────────┐
                │        User Browser        │
                │       (Next.js UI)         │
                └──────────────┬────────────┘
                               │
                               │ HTTPS REST API
                               ▼
                ┌───────────────────────────┐
                │        Next.js Frontend    │
                │  React Components + UI     │
                └──────────────┬────────────┘
                               │
                               │ API Calls
                               ▼
                ┌───────────────────────────┐
                │       FastAPI Backend      │
                │       (Python Server)      │
                └──────────────┬────────────┘
                               │
                               │ Internal Calls
                               ▼
        ┌─────────────────────────────────────────┐
        │             AI Agent Layer               │
        │------------------------------------------│
        │ Skill Gap Agent                          │
        │ Roadmap Generator Agent                  │
        │ Resume Analyzer Agent                    │
        │ Interview Coach Agent                    │
        └──────────────┬───────────────────────────┘
                       │
                       │ LLM API
                       ▼
               ┌─────────────────────┐
               │     Gemini API       │
               │ (Google AI Studio)   │
               └─────────────────────┘

                       │
                       │
                       ▼
             ┌───────────────────────┐
             │    Local Data Layer    │
             │------------------------│
             │ courses.json           │
             │ skills.json            │
             │ returnships.json       │
             └───────────────────────┘

------------------------------------------------------------
6. TECH STACK
------------------------------------------------------------

Frontend

Framework
Next.js 14 (App Router)

Styling
Tailwind CSS

UI Components
ShadCN UI

State Management
React Hooks

HTTP Client
Axios

------------------------------------------------------------

Backend

Framework
FastAPI

Language
Python 3.10+

Server
Uvicorn

------------------------------------------------------------

AI Provider

Google Gemini API

Capabilities

• reasoning
• text generation
• skill analysis
• structured responses

------------------------------------------------------------

Resume Processing

Library
pdfplumber

Purpose
Extract resume text for analysis.

------------------------------------------------------------

Data Storage

Local JSON files

Example

courses.json  
skills.json  
returnships.json  

------------------------------------------------------------
7. FOLDER STRUCTURE
------------------------------------------------------------

PROJECT ROOT

career-reentry-ai

frontend
│
├── app
│   ├── page.tsx
│   ├── dashboard
│   │   └── page.tsx
│   └── interview
│       └── page.tsx
│
├── components
│   ├── ProfileForm.tsx
│   ├── SkillGapCard.tsx
│   ├── RoadmapTimeline.tsx
│   ├── ResumeUpload.tsx
│   └── InterviewCoach.tsx
│
├── services
│   └── api.ts
│
└── styles
    └── globals.css


backend
│
├── main.py
│
├── routes
│   ├── analyze.py
│   ├── resume.py
│   └── interview.py
│
├── agents
│   ├── skill_gap_agent.py
│   ├── roadmap_agent.py
│   ├── resume_agent.py
│   └── interview_agent.py
│
├── services
│   └── gemini_service.py
│
├── utils
│   └── resume_parser.py
│
└── data
    └── courses.json

------------------------------------------------------------
8. API ENDPOINTS
------------------------------------------------------------

Base URL

http://localhost:8000

------------------------------------------------------------

POST /analyze-profile

Purpose
Generate skill gap analysis and roadmap.

Request

{
 "previous_role": "Software Tester",
 "experience_years": 3,
 "career_gap_years": 4,
 "skills": ["Manual Testing", "SQL"],
 "target_role": "QA Automation Engineer"
}

Response

{
 "missing_skills": [
  "Python",
  "Selenium",
  "API Testing"
 ],
 "roadmap": [
  "Week 1: Python basics",
  "Week 2: Selenium automation",
  "Week 3: API testing"
 ],
 "recommended_roles": [
  "QA Automation Engineer",
  "Test Engineer"
 ],
 "returnship_programs": [
  "Amazon Returnship",
  "IBM Tech Re-Entry"
 ]
}

------------------------------------------------------------

POST /analyze-resume

Purpose
Analyze resume and suggest improvements.

Request

file: resume.pdf  
target_role: QA Automation Engineer

Response

{
 "ats_score": 78,
 "missing_keywords": [
  "Selenium",
  "Automation Testing"
 ],
 "suggestions": [
  "Add automation testing experience",
  "Highlight measurable achievements"
 ]
}

------------------------------------------------------------

POST /interview-question

Purpose
Generate interview question.

Request

{
 "role": "QA Automation Engineer"
}

Response

{
 "question": "Explain regression testing."
}

------------------------------------------------------------

POST /evaluate-answer

Request

{
 "question": "Explain regression testing",
 "answer": "Regression testing ensures new changes don't break existing functionality."
}

Response

{
 "score": 7,
 "feedback": "Provide an example and mention automation tools."
}

------------------------------------------------------------
9. FUTURE IMPROVEMENTS
------------------------------------------------------------

• Integration with LinkedIn Jobs API  
• Integration with Coursera/Udemy course APIs  
• AI resume builder  
• Mentorship network  
• Confidence tracking system  

------------------------------------------------------------
END OF PRD