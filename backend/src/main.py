from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime
import os
from dotenv import load_dotenv

from .routers import seo, geo, performance, keywords
from .models import SEOAnalysis, GEOAnalysis, ComparisonData

# Load environment variables
load_dotenv()

app = FastAPI(
    title="SEO & GEO Analysis API",
    description="Free and open-source SEO and GEO analysis tool",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(seo.router, prefix="/api/seo", tags=["SEO"])
app.include_router(geo.router, prefix="/api/geo", tags=["GEO"])
app.include_router(performance.router, prefix="/api/performance", tags=["Performance"])
app.include_router(keywords.router, prefix="/api/keywords", tags=["Keywords"])

@app.get("/")
async def root():
    return {
        "message": "SEO & GEO Analysis API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        reload=True
    )
