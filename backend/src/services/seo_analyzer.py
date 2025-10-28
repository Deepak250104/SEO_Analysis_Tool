import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Tuple
import time
from datetime import datetime
import asyncio
import aiohttp

class SEOAnalyzer:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    async def analyze_url(self, url: str) -> Dict:
        """Main method to analyze a URL for SEO"""
        try:
            # Ensure URL has protocol
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            # Fetch the page
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Analyze different aspects
            metadata = self._analyze_metadata(soup)
            links = await self._analyze_links(soup, url)
            content = self._analyze_content(soup)
            performance = await self._analyze_performance(url)
            
            # Calculate scores
            scores = self._calculate_scores(metadata, links, content, performance)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(metadata, links, content, performance)
            
            return {
                'url': url,
                'score': scores,
                'metadata': metadata,
                'links': links,
                'content': content,
                'performance': performance,
                'recommendations': recommendations,
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to analyze URL: {str(e)}")

    def _analyze_metadata(self, soup: BeautifulSoup) -> Dict:
        """Analyze page metadata"""
        title = soup.find('title')
        title_text = title.get_text().strip() if title else ""
        
        description = soup.find('meta', attrs={'name': 'description'})
        description_text = description.get('content', '').strip() if description else ""
        
        keywords = soup.find('meta', attrs={'name': 'keywords'})
        keywords_text = keywords.get('content', '').strip() if keywords else ""
        keywords_list = [k.strip() for k in keywords_text.split(',')] if keywords_text else []
        
        return {
            'title': title_text,
            'description': description_text,
            'keywords': keywords_list,
            'titleLength': len(title_text),
            'descriptionLength': len(description_text)
        }

    async def _analyze_links(self, soup: BeautifulSoup, base_url: str) -> Dict:
        """Analyze page links"""
        links = soup.find_all('a', href=True)
        
        internal_links = 0
        external_links = 0
        broken_links = 0
        nofollow_links = 0
        
        base_domain = urlparse(base_url).netloc
        
        for link in links:
            href = link.get('href')
            if not href:
                continue
                
            # Check for nofollow
            if link.get('rel') and 'nofollow' in link.get('rel'):
                nofollow_links += 1
            
            # Resolve relative URLs
            full_url = urljoin(base_url, href)
            link_domain = urlparse(full_url).netloc
            
            if link_domain == base_domain:
                internal_links += 1
            else:
                external_links += 1
                
                # Check if external link is broken (simplified check)
                try:
                    response = self.session.head(full_url, timeout=5)
                    if response.status_code >= 400:
                        broken_links += 1
                except:
                    broken_links += 1
        
        return {
            'internal': internal_links,
            'external': external_links,
            'broken': broken_links,
            'nofollow': nofollow_links
        }

    def _analyze_content(self, soup: BeautifulSoup) -> Dict:
        """Analyze page content"""
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text()
        words = text.split()
        word_count = len(words)
        
        # Analyze headings
        headings = {
            'h1': len(soup.find_all('h1')),
            'h2': len(soup.find_all('h2')),
            'h3': len(soup.find_all('h3')),
            'h4': len(soup.find_all('h4')),
            'h5': len(soup.find_all('h5')),
            'h6': len(soup.find_all('h6'))
        }
        
        # Analyze images
        images = soup.find_all('img')
        total_images = len(images)
        images_with_alt = len([img for img in images if img.get('alt')])
        images_without_alt = total_images - images_with_alt
        
        # Calculate keyword density (simplified)
        text_lower = text.lower()
        common_words = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
        word_freq = {}
        for word in words:
            word_lower = word.lower().strip('.,!?;:"()[]{}')
            if word_lower and word_lower not in common_words and len(word_lower) > 3:
                word_freq[word_lower] = word_freq.get(word_lower, 0) + 1
        
        # Get top keywords by frequency
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        keyword_density = {word: (count / word_count) * 100 for word, count in sorted_words[:10]}
        
        return {
            'wordCount': word_count,
            'keywordDensity': keyword_density,
            'headings': headings,
            'images': {
                'total': total_images,
                'withAlt': images_with_alt,
                'withoutAlt': images_without_alt
            }
        }

    async def _analyze_performance(self, url: str) -> Dict:
        """Analyze page performance (simplified)"""
        try:
            start_time = time.time()
            response = self.session.get(url, timeout=30)
            load_time = time.time() - start_time
            
            # Simulate performance metrics (in real implementation, use Lighthouse)
            return {
                'loadTime': round(load_time, 2),
                'firstContentfulPaint': round(load_time * 0.8, 2),
                'largestContentfulPaint': round(load_time * 1.2, 2),
                'cumulativeLayoutShift': 0.1,  # Simulated
                'firstInputDelay': 50.0  # Simulated
            }
        except:
            return {
                'loadTime': 0.0,
                'firstContentfulPaint': 0.0,
                'largestContentfulPaint': 0.0,
                'cumulativeLayoutShift': 0.0,
                'firstInputDelay': 0.0
            }

    def _calculate_scores(self, metadata: Dict, links: Dict, content: Dict, performance: Dict) -> Dict:
        """Calculate SEO scores out of 10"""
        
        # Metadata score
        metadata_score = 0
        if metadata['title'] and 30 <= len(metadata['title']) <= 60:
            metadata_score += 3
        elif metadata['title']:
            metadata_score += 1
            
        if metadata['description'] and 120 <= len(metadata['description']) <= 160:
            metadata_score += 3
        elif metadata['description']:
            metadata_score += 1
            
        if metadata['keywords']:
            metadata_score += 2
            
        if metadata['titleLength'] > 0:
            metadata_score += 2
            
        metadata_score = min(metadata_score, 10)
        
        # Links score
        links_score = 0
        total_links = links['internal'] + links['external']
        if total_links > 0:
            internal_ratio = links['internal'] / total_links
            broken_ratio = links['broken'] / total_links if total_links > 0 else 0
            
            links_score += min(internal_ratio * 5, 5)  # Internal links bonus
            links_score += max(0, 5 - broken_ratio * 10)  # Penalty for broken links
            
        links_score = min(links_score, 10)
        
        # Content score
        content_score = 0
        if content['wordCount'] >= 300:
            content_score += 3
        elif content['wordCount'] >= 150:
            content_score += 2
        else:
            content_score += 1
            
        if content['headings']['h1'] == 1:
            content_score += 2
        elif content['headings']['h1'] > 1:
            content_score += 1
            
        if content['headings']['h2'] > 0:
            content_score += 2
            
        alt_ratio = content['images']['withAlt'] / content['images']['total'] if content['images']['total'] > 0 else 1
        content_score += alt_ratio * 3
        
        content_score = min(content_score, 10)
        
        # Performance score
        performance_score = 10
        if performance['loadTime'] > 3:
            performance_score -= 3
        elif performance['loadTime'] > 2:
            performance_score -= 2
        elif performance['loadTime'] > 1:
            performance_score -= 1
            
        performance_score = max(performance_score, 0)
        
        # Overall score
        overall_score = (metadata_score + links_score + content_score + performance_score) / 4
        
        return {
            'overall': round(overall_score, 1),
            'metadata': round(metadata_score, 1),
            'links': round(links_score, 1),
            'content': round(content_score, 1),
            'performance': round(performance_score, 1)
        }

    def _generate_recommendations(self, metadata: Dict, links: Dict, content: Dict, performance: Dict) -> List[str]:
        """Generate SEO recommendations"""
        recommendations = []
        
        # Metadata recommendations
        if not metadata['title']:
            recommendations.append("Add a title tag to improve search engine visibility")
        elif len(metadata['title']) < 30 or len(metadata['title']) > 60:
            recommendations.append("Optimize title length (30-60 characters recommended)")
            
        if not metadata['description']:
            recommendations.append("Add a meta description to improve click-through rates")
        elif len(metadata['description']) < 120 or len(metadata['description']) > 160:
            recommendations.append("Optimize meta description length (120-160 characters recommended)")
            
        if not metadata['keywords']:
            recommendations.append("Consider adding relevant keywords to your content")
            
        # Links recommendations
        if links['broken'] > 0:
            recommendations.append(f"Fix {links['broken']} broken links to improve user experience")
            
        if links['internal'] < 3:
            recommendations.append("Add more internal links to improve site structure and SEO")
            
        # Content recommendations
        if content['wordCount'] < 300:
            recommendations.append("Increase content length to at least 300 words for better SEO")
            
        if content['headings']['h1'] == 0:
            recommendations.append("Add an H1 heading to structure your content")
        elif content['headings']['h1'] > 1:
            recommendations.append("Use only one H1 heading per page")
            
        if content['images']['withoutAlt'] > 0:
            recommendations.append(f"Add alt text to {content['images']['withoutAlt']} images for better accessibility and SEO")
            
        # Performance recommendations
        if performance['loadTime'] > 3:
            recommendations.append("Optimize page loading speed (currently over 3 seconds)")
        elif performance['loadTime'] > 2:
            recommendations.append("Consider optimizing images and scripts to improve loading speed")
            
        return recommendations

    async def compare_urls(self, url1: str, url2: str) -> Dict:
        """Compare two URLs"""
        analysis1 = await self.analyze_url(url1)
        analysis2 = await self.analyze_url(url2)
        
        # Determine winners
        def get_winner(score1: float, score2: float) -> str:
            if score1 > score2:
                return 'url1'
            elif score2 > score1:
                return 'url2'
            else:
                return 'tie'
        
        winner = {
            'overall': get_winner(analysis1['score']['overall'], analysis2['score']['overall']),
            'metadata': get_winner(analysis1['score']['metadata'], analysis2['score']['metadata']),
            'links': get_winner(analysis1['score']['links'], analysis2['score']['links']),
            'content': get_winner(analysis1['score']['content'], analysis2['score']['content']),
            'performance': get_winner(analysis1['score']['performance'], analysis2['score']['performance'])
        }
        
        return {
            'url1': analysis1,
            'url2': analysis2,
            'winner': winner
        }
