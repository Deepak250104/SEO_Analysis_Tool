from fastapi import APIRouter, HTTPException
from ..services.geo_analyzer import GEOAnalyzer

router = APIRouter()
geo_analyzer = GEOAnalyzer()

@router.get("/suggestions")
async def get_keyword_suggestions(seed: str):
    """Get keyword suggestions based on a seed keyword"""
    try:
        suggestions = await geo_analyzer.get_keyword_suggestions(seed)
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
