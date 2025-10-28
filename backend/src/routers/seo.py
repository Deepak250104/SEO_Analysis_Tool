from fastapi import APIRouter, HTTPException
from ..models import URLAnalysisRequest, URLComparisonRequest, SEOAnalysis, ComparisonData
from ..services.seo_analyzer import SEOAnalyzer

router = APIRouter()
seo_analyzer = SEOAnalyzer()

@router.post("/analyze", response_model=SEOAnalysis)
async def analyze_url(request: URLAnalysisRequest):
    """Analyze a single URL for SEO"""
    try:
        result = await seo_analyzer.analyze_url(request.url)
        return SEOAnalysis(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/compare", response_model=ComparisonData)
async def compare_urls(request: URLComparisonRequest):
    """Compare two URLs for SEO"""
    try:
        result = await seo_analyzer.compare_urls(request.url1, request.url2)
        return ComparisonData(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
