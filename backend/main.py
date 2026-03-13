from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes import analyze, resume, interview

load_dotenv()

app = FastAPI(
    title="ReLaunchAI API",
    description="AI Career Re-Entry Assistant for Women — Backend API",
    version="1.0.0",
)

# Allow frontend (Next.js dev server) and any origin during hackathon
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(resume.router)
app.include_router(interview.router)


@app.get("/")
def root():
    return {"message": "ReLaunchAI API is running 🚀", "docs": "/docs"}
