import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    # API Configuration
    LIGHTHOUSE_API_KEY = os.environ.get('LIGHTHOUSE_API_KEY', '')
    PAGESPEED_API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
    
    # Cache configuration
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300
    
    # Analysis settings
    MAX_URLS_PER_REQUEST = 2
    TIMEOUT_SECONDS = 30
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    
    # SEO Score Weights
    METADATA_WEIGHT = 0.20
    LINK_WEIGHT = 0.20
    CONTENT_WEIGHT = 0.25
    PERFORMANCE_WEIGHT = 0.25
    SERP_WEIGHT = 0.10
    
    # GEO/Local SEO settings
    DEFAULT_LOCATION = 'United States'
    SUPPORTED_COUNTRIES = ['US', 'UK', 'CA', 'AU', 'IN', 'DE', 'FR']

