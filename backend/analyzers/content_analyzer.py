import re
from backend.utils.helpers import extract_keywords

class ContentAnalyzer:
    """Analyze content quality for SEO"""
    
    def __init__(self, soup, url):
        self.soup = soup
        self.url = url
        self.issues = []
        self.recommendations = []
    
    def analyze(self):
        """Run all content analyses"""
        # Extract text content
        text_content = self.get_text_content()
        
        # Analyze content
        word_count = self.count_words(text_content)
        keywords = extract_keywords(text_content, top_n=15)
        readability_score = self.calculate_readability(text_content, word_count)
        keyword_density = self.calculate_keyword_density(keywords, word_count)
        
        # Calculate overall content score
        content_score = self.calculate_content_score(word_count, readability_score, keywords)
        
        return {
            'score': content_score,
            'word_count': word_count,
            'character_count': len(text_content),
            'keywords': [{'keyword': k[0], 'frequency': k[1]} for k in keywords],
            'top_keyword': keywords[0][0] if keywords else None,
            'keyword_density': keyword_density,
            'readability_score': readability_score,
            'paragraph_count': len(self.soup.find_all('p')),
            'issues': self.issues,
            'recommendations': self.recommendations
        }
    
    def get_text_content(self):
        """Extract visible text content from page"""
        # Remove script and style elements
        for script in self.soup(['script', 'style', 'nav', 'footer', 'header']):
            script.decompose()
        
        # Get text
        text = self.soup.get_text(separator=' ', strip=True)
        
        # Clean up whitespace
        text = re.sub(r'\s+', ' ', text)
        
        return text
    
    def count_words(self, text):
        """Count words in text"""
        words = re.findall(r'\b\w+\b', text.lower())
        return len(words)
    
    def calculate_readability(self, text, word_count):
        """Calculate simple readability score"""
        if word_count == 0:
            return 0
        
        # Simple readability based on average word length and sentence length
        sentences = re.split(r'[.!?]+', text)
        sentence_count = len([s for s in sentences if s.strip()])
        
        if sentence_count == 0:
            return 5
        
        avg_words_per_sentence = word_count / sentence_count
        
        # Score based on sentence length (15-20 words per sentence is ideal)
        if 12 <= avg_words_per_sentence <= 22:
            readability = 10
        elif 8 <= avg_words_per_sentence <= 28:
            readability = 7
        else:
            readability = 5
        
        return round(readability, 1)
    
    def calculate_keyword_density(self, keywords, word_count):
        """Calculate keyword density for top keyword"""
        if not keywords or word_count == 0:
            return 0
        
        top_keyword_freq = keywords[0][1]
        density = (top_keyword_freq / word_count) * 100
        
        return round(density, 2)
    
    def calculate_content_score(self, word_count, readability_score, keywords):
        """Calculate overall content score (0-10)"""
        score = 10
        
        # Word count scoring
        if word_count < 300:
            score -= 3
            self.issues.append(f'Content too short ({word_count} words)')
            self.recommendations.append('Add more content (minimum 300-500 words for better SEO)')
        elif word_count < 500:
            score -= 1.5
            self.issues.append(f'Content is short ({word_count} words)')
            self.recommendations.append('Consider expanding content to 800+ words')
        elif word_count < 800:
            score -= 0.5
        
        # Readability scoring
        if readability_score < 7:
            score -= 1
            self.issues.append('Content readability could be improved')
            self.recommendations.append('Use shorter sentences and simpler words for better readability')
        
        # Keyword scoring
        if not keywords or len(keywords) < 5:
            score -= 1
            self.issues.append('Limited keyword variety')
            self.recommendations.append('Include more relevant keywords naturally in your content')
        
        # Keyword density check
        if keywords:
            density = (keywords[0][1] / word_count) * 100 if word_count > 0 else 0
            if density > 3:
                score -= 1
                self.issues.append(f'Keyword "{keywords[0][0]}" may be overused ({density:.1f}%)')
                self.recommendations.append('Reduce keyword density to 1-2% to avoid keyword stuffing')
            elif density < 0.5 and word_count > 500:
                self.recommendations.append('Consider using your primary keyword more frequently (target 1-2%)')
        
        return max(round(score, 1), 0)

