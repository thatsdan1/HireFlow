#!/usr/bin/env python3
"""
Simple script to start the FastAPI server
"""
import uvicorn
from app.main import app

if __name__ == "__main__":
    print("🚀 Starting HireFlow Backend Server...")
    print(f"📊 App has {len(app.routes)} routes registered")
    print("🌐 Server will be available at: http://127.0.0.1:8000")
    print("📚 API docs will be available at: http://127.0.0.1:8000/docs")
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="info",
        reload=False  # Disable reload for debugging
    )
