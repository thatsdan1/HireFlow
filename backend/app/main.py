from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

# Import v1 API routes
from app.api.v1 import ai, resume, jobs, applications
from app.core.config import settings

app = FastAPI(
    title="HireFlow API",
    description="AI-powered career assistant for students and early-career professionals",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add all Phase 1 API routes
app.include_router(ai.router, prefix="/api/v1")
app.include_router(resume.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(applications.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to HireFlow API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "HireFlow API is running"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 