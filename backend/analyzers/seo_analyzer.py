from backend.utils.helpers import fetch_url, parse_html, normalize_url, is_valid_url
from backend.utils.lighthouse import run_lighthouse_analysis
from backend.analyzers.metadata_analyzer import MetadataAnalyzer
from backend.analyzers.link_analyzer import LinkAnalyzer
from backend.analyzers.content_analyzer import ContentAnalyzer
from backend.analyzers.geo_analyzer import GeoAnalyzer
from config import Config

class SEOAnalyzer:
    """Main SEO analysis coordinator"""
    
    def __init__(self, url):
        self.url = normalize_url(url)
        self.soup = None
        self.response = None
        
    def analyze(self, include_performance=True, include_geo=False):
        """Run complete SEO analysis"""
        
        # Validate URL
        if not is_valid_url(self.url):
            return {
                'success': False,
                'error': 'Invalid URL format'
            }
        
        try:
            # Fetch and parse URL
            self.response = fetch_url(self.url, timeout=Config.TIMEOUT_SECONDS)
            self.soup = parse_html(self.response.text)
            
            # Run individual analyses
            metadata_analyzer = MetadataAnalyzer(self.soup, self.url)
            metadata_results = metadata_analyzer.analyze()
            
            link_analyzer = LinkAnalyzer(self.soup, self.url)
            link_results = link_analyzer.analyze()
            
            content_analyzer = ContentAnalyzer(self.soup, self.url)
            content_results = content_analyzer.analyze()
            
            # Performance analysis (optional)
            performance_results = None
            if include_performance:
                try:
                    performance_results = run_lighthouse_analysis(self.url)
                except Exception as e:
                    print(f"Performance analysis failed: {str(e)}")
                    performance_results = {'score': 0, 'error': str(e)}
            
            # GEO analysis (optional)
            geo_results = None
            if include_geo:
                geo_analyzer = GeoAnalyzer(self.soup, self.url)
                geo_results = geo_analyzer.analyze()
            
            # Calculate overall SEO score
            overall_score = self.calculate_overall_score(
                metadata_results, 
                link_results, 
                content_results, 
                performance_results
            )
            
            # Aggregate all recommendations
            all_recommendations = (
                metadata_results.get('recommendations', []) +
                link_results.get('recommendations', []) +
                content_results.get('recommendations', [])
            )
            
            # Aggregate all issues
            all_issues = (
                metadata_results.get('issues', []) +
                link_results.get('issues', []) +
                content_results.get('issues', [])
            )
            
            return {
                'success': True,
                'url': self.url,
                'overall_score': overall_score,
                'scores': {
                    'metadata': metadata_results['score'],
                    'links': link_results['score'],
                    'content': content_results['score'],
                    'performance': performance_results.get('overall_score', 0) if performance_results else 0
                },
                'metadata': metadata_results,
                'links': link_results,
                'content': content_results,
                'performance': performance_results,
                'geo': geo_results,
                'recommendations': all_recommendations[:15],  # Top 15 recommendations
                'issues': all_issues,
                'status_code': self.response.status_code,
                'response_time': self.response.elapsed.total_seconds()
            }
            
        except Exception as e:
            return {
                'success': False,
                'url': self.url,
                'error': str(e)
            }
    
    def calculate_overall_score(self, metadata, links, content, performance):
        """Calculate weighted overall SEO score (0-10)"""
        score = 0
        
        # Apply weights from config
        score += metadata['score'] * Config.METADATA_WEIGHT
        score += links['score'] * Config.LINK_WEIGHT
        score += content['score'] * Config.CONTENT_WEIGHT
        
        if performance:
            score += performance.get('overall_score', 0) * Config.PERFORMANCE_WEIGHT
        
        # Add SERP weight (default assumption of 7/10 if not analyzed)
        score += 7 * Config.SERP_WEIGHT
        
        return round(score, 1)


def compare_seo(url1, url2):
    """Compare SEO metrics between two URLs"""
    
    # Analyze both URLs
    analyzer1 = SEOAnalyzer(url1)
    results1 = analyzer1.analyze(include_performance=True, include_geo=False)
    
    analyzer2 = SEOAnalyzer(url2)
    results2 = analyzer2.analyze(include_performance=True, include_geo=False)
    
    if not results1['success'] or not results2['success']:
        return {
            'success': False,
            'error': 'One or both URLs failed to analyze',
            'url1_error': results1.get('error'),
            'url2_error': results2.get('error')
        }
    
    # Calculate differences
    score_diff = {
        'overall': results1['overall_score'] - results2['overall_score'],
        'metadata': results1['scores']['metadata'] - results2['scores']['metadata'],
        'links': results1['scores']['links'] - results2['scores']['links'],
        'content': results1['scores']['content'] - results2['scores']['content'],
        'performance': results1['scores']['performance'] - results2['scores']['performance']
    }
    
    # Determine winner
    winner = 'url1' if results1['overall_score'] > results2['overall_score'] else (
        'url2' if results2['overall_score'] > results1['overall_score'] else 'tie'
    )
    
    return {
        'success': True,
        'url1': results1,
        'url2': results2,
        'comparison': {
            'winner': winner,
            'score_difference': score_diff,
            'url1_better_at': get_better_categories(score_diff, 'url1'),
            'url2_better_at': get_better_categories(score_diff, 'url2')
        }
    }


def get_better_categories(score_diff, url):
    """Get categories where a URL performs better"""
    better = []
    multiplier = 1 if url == 'url1' else -1
    
    for category, diff in score_diff.items():
        if diff * multiplier > 0:
            better.append({
                'category': category,
                'difference': abs(diff)
            })
    
    return better

