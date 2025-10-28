from fastapi import APIRouter, HTTPException
from ..models import GEOAnalysisRequest, GEOAnalysis
from ..services.geo_analyzer import GEOAnalyzer

router = APIRouter()
geo_analyzer = GEOAnalyzer()

@router.post("/analyze", response_model=GEOAnalysis)
async def analyze_location(request: GEOAnalysisRequest):
    """Analyze local SEO for a location and keywords"""
    try:
        result = await geo_analyzer.analyze_location(request.location, request.keywords)
        return GEOAnalysis(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
