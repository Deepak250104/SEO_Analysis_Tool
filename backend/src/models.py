from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Optional, Union
from datetime import datetime

class SEOScore(BaseModel):
    overall: float
    metadata: float
    links: float
    content: float
    performance: float

class Metadata(BaseModel):
    title: str
    description: str
    keywords: List[str]
    titleLength: int
    descriptionLength: int

class Links(BaseModel):
    internal: int
    external: int
    broken: int
    nofollow: int

class Headings(BaseModel):
    h1: int
    h2: int
    h3: int
    h4: int
    h5: int
    h6: int

class Images(BaseModel):
    total: int
    withAlt: int
    withoutAlt: int

class Content(BaseModel):
    wordCount: int
    keywordDensity: Dict[str, float]
    headings: Headings
    images: Images

class Performance(BaseModel):
    loadTime: float
    firstContentfulPaint: float
    largestContentfulPaint: float
    cumulativeLayoutShift: float
    firstInputDelay: float

class SEOAnalysis(BaseModel):
    url: str
    score: SEOScore
    metadata: Metadata
    links: Links
    content: Content
    performance: Performance
    recommendations: List[str]
    timestamp: str

class KeywordData(BaseModel):
    keyword: str
    volume: int
    difficulty: int
    cpc: float

class LocalRanking(BaseModel):
    keyword: str
    position: int
    url: str

class Reviews(BaseModel):
    total: int
    average: float
    platforms: Dict[str, int]

class NAP(BaseModel):
    name: str
    address: str
    phone: str
    consistency: int

class GEOAnalysis(BaseModel):
    location: str
    keywords: List[KeywordData]
    localRankings: List[LocalRanking]
    reviews: Reviews
    nap: NAP
    recommendations: List[str]

class Winner(BaseModel):
    overall: str  # 'url1', 'url2', or 'tie'
    metadata: str
    links: str
    content: str
    performance: str

class ComparisonData(BaseModel):
    url1: SEOAnalysis
    url2: SEOAnalysis
    winner: Winner

# Request models
class URLAnalysisRequest(BaseModel):
    url: str

class URLComparisonRequest(BaseModel):
    url1: str
    url2: str

class GEOAnalysisRequest(BaseModel):
    location: str
    keywords: List[str]

class KeywordSuggestionsRequest(BaseModel):
    seed: str

class PerformanceAnalysisRequest(BaseModel):
    url: str
