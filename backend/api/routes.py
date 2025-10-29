from flask import Blueprint, request, jsonify
from backend.analyzers.seo_analyzer import SEOAnalyzer, compare_seo
from backend.analyzers.geo_analyzer import GeoAnalyzer
from backend.utils.helpers import is_valid_url, normalize_url, fetch_url, parse_html
from config import Config

api_bp = Blueprint('api', __name__)


@api_bp.route('/analyze', methods=['POST'])
def analyze_url():
    """Analyze a single URL for SEO"""
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({
            'success': False,
            'error': 'URL is required'
        }), 400
    
    url = data.get('url')
    include_performance = data.get('include_performance', True)
    include_geo = data.get('include_geo', False)
    
    # Normalize and validate URL
    url = normalize_url(url)
    
    if not is_valid_url(url):
        return jsonify({
            'success': False,
            'error': 'Invalid URL format'
        }), 400
    
    # Run analysis
    try:
        analyzer = SEOAnalyzer(url)
        results = analyzer.analyze(
            include_performance=include_performance,
            include_geo=include_geo
        )
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/compare', methods=['POST'])
def compare_urls():
    """Compare SEO metrics between two URLs"""
    data = request.get_json()
    
    if not data or 'url1' not in data or 'url2' not in data:
        return jsonify({
            'success': False,
            'error': 'Two URLs are required for comparison'
        }), 400
    
    url1 = normalize_url(data.get('url1'))
    url2 = normalize_url(data.get('url2'))
    
    if not is_valid_url(url1) or not is_valid_url(url2):
        return jsonify({
            'success': False,
            'error': 'Invalid URL format'
        }), 400
    
    # Run comparison
    try:
        results = compare_seo(url1, url2)
        return jsonify(results)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/geo-analyze', methods=['POST'])
def geo_analyze():
    """Analyze local/GEO SEO for a URL"""
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({
            'success': False,
            'error': 'URL is required'
        }), 400
    
    url = normalize_url(data.get('url'))
    location = data.get('location', Config.DEFAULT_LOCATION)
    
    if not is_valid_url(url):
        return jsonify({
            'success': False,
            'error': 'Invalid URL format'
        }), 400
    
    try:
        # Fetch and parse
        response = fetch_url(url)
        soup = parse_html(response.text)
        
        # Run GEO analysis
        analyzer = GeoAnalyzer(soup, url)
        results = analyzer.analyze(location=location)
        
        return jsonify({
            'success': True,
            'url': url,
            'location': location,
            'results': results
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'SEO Analysis API is running'
    })


@api_bp.route('/keywords', methods=['POST'])
def suggest_keywords():
    """Suggest keywords based on content"""
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({
            'success': False,
            'error': 'URL is required'
        }), 400
    
    url = normalize_url(data.get('url'))
    location = data.get('location')
    
    try:
        response = fetch_url(url)
        soup = parse_html(response.text)
        
        # Extract content
        from backend.analyzers.content_analyzer import ContentAnalyzer
        analyzer = ContentAnalyzer(soup, url)
        results = analyzer.analyze()
        
        keywords = results.get('keywords', [])
        
        # Add local keyword suggestions if location provided
        local_suggestions = []
        if location:
            top_keywords = [kw['keyword'] for kw in keywords[:5]]
            local_suggestions = [f"{kw} in {location}" for kw in top_keywords]
            local_suggestions += [f"{kw} near me" for kw in top_keywords[:3]]
        
        return jsonify({
            'success': True,
            'url': url,
            'keywords': keywords[:20],
            'local_suggestions': local_suggestions,
            'top_keyword': results.get('top_keyword')
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

