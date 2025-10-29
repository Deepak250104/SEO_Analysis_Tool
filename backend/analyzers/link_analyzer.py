from urllib.parse import urljoin, urlparse
import requests

class LinkAnalyzer:
    """Analyze links for SEO"""
    
    def __init__(self, soup, url):
        self.soup = soup
        self.url = url
        self.domain = urlparse(url).netloc
        self.issues = []
        self.recommendations = []
    
    def analyze(self):
        """Run all link analyses"""
        links = self.soup.find_all('a', href=True)
        
        internal_links = []
        external_links = []
        broken_links = []
        nofollow_links = []
        
        for link in links:
            href = link.get('href', '').strip()
            if not href or href.startswith('#') or href.startswith('javascript:') or href.startswith('mailto:') or href.startswith('tel:'):
                continue
            
            # Make absolute URL
            absolute_url = urljoin(self.url, href)
            link_domain = urlparse(absolute_url).netloc
            
            # Categorize link
            if link_domain == self.domain or link_domain == '':
                internal_links.append({
                    'url': absolute_url,
                    'text': link.get_text(strip=True),
                    'rel': link.get('rel', [])
                })
            else:
                external_links.append({
                    'url': absolute_url,
                    'text': link.get_text(strip=True),
                    'rel': link.get('rel', [])
                })
            
            # Check for nofollow
            if 'nofollow' in link.get('rel', []):
                nofollow_links.append(absolute_url)
        
        # Calculate score
        score = self.calculate_link_score(internal_links, external_links)
        
        # Generate recommendations
        self.generate_recommendations(internal_links, external_links)
        
        return {
            'score': score,
            'internal': {
                'count': len(internal_links),
                'links': internal_links[:20]  # Limit to first 20 for display
            },
            'external': {
                'count': len(external_links),
                'links': external_links[:20]
            },
            'nofollow': {
                'count': len(nofollow_links),
                'links': nofollow_links[:10]
            },
            'broken': {
                'count': len(broken_links),
                'links': broken_links
            },
            'total_links': len(links),
            'issues': self.issues,
            'recommendations': self.recommendations
        }
    
    def calculate_link_score(self, internal_links, external_links):
        """Calculate link quality score (0-10)"""
        score = 10
        
        internal_count = len(internal_links)
        external_count = len(external_links)
        
        # Penalize for too few internal links
        if internal_count < 5:
            score -= 2
            self.issues.append(f'Few internal links ({internal_count})')
        elif internal_count < 10:
            score -= 1
        
        # Penalize for no external links
        if external_count == 0:
            score -= 1.5
            self.issues.append('No external links found')
        
        # Penalize for too many external vs internal
        if external_count > internal_count * 2:
            score -= 1
            self.issues.append('Too many external links compared to internal')
        
        # Check for descriptive anchor text
        empty_anchors = sum(1 for link in internal_links + external_links if not link['text'])
        if empty_anchors > 0:
            score -= 1
            self.issues.append(f'{empty_anchors} links with empty anchor text')
        
        return max(round(score, 1), 0)
    
    def generate_recommendations(self, internal_links, external_links):
        """Generate link recommendations"""
        if len(internal_links) < 10:
            self.recommendations.append('Add more internal links to improve site navigation and SEO')
        
        if len(external_links) == 0:
            self.recommendations.append('Add relevant external links to authoritative sources')
        
        if len(external_links) > len(internal_links) * 2:
            self.recommendations.append('Balance external links with more internal linking')
        
        # Check for anchor text quality
        generic_anchors = ['click here', 'read more', 'here', 'link', 'this']
        generic_count = sum(1 for link in internal_links + external_links 
                          if link['text'].lower() in generic_anchors)
        
        if generic_count > 0:
            self.recommendations.append('Use descriptive anchor text instead of generic phrases like "click here"')

