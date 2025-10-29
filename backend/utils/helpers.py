import requests
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
import re

def fetch_url(url, timeout=30):
    """Fetch URL content with proper headers"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=timeout, allow_redirects=True)
        response.raise_for_status()
        return response
    except requests.RequestException as e:
        raise Exception(f"Failed to fetch URL: {str(e)}")

def parse_html(html_content):
    """Parse HTML content with BeautifulSoup"""
    return BeautifulSoup(html_content, 'lxml')

def is_valid_url(url):
    """Validate URL format"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def normalize_url(url):
    """Normalize URL by adding protocol if missing"""
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    return url

def get_domain(url):
    """Extract domain from URL"""
    parsed = urlparse(url)
    return parsed.netloc

def is_internal_link(url, base_domain):
    """Check if link is internal"""
    link_domain = get_domain(url)
    return link_domain == base_domain or link_domain == ''

def extract_keywords(text, top_n=10):
    """Extract top keywords from text"""
    # Remove special characters and convert to lowercase
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())
    words = text.split()
    
    # Common stop words to exclude
    stop_words = {'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'from', 'this', 'that', 'be', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can'}
    
    # Filter and count
    word_freq = {}
    for word in words:
        if word not in stop_words and len(word) > 3:
            word_freq[word] = word_freq.get(word, 0) + 1
    
    # Sort and return top N
    sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    return sorted_words[:top_n]

def calculate_score(value, max_value, weight=1.0):
    """Calculate normalized score (0-10)"""
    if max_value == 0:
        return 0
    score = (value / max_value) * 10 * weight
    return min(round(score, 1), 10)

def format_bytes(bytes_value):
    """Format bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_value < 1024.0:
            return f"{bytes_value:.2f} {unit}"
        bytes_value /= 1024.0
    return f"{bytes_value:.2f} TB"

