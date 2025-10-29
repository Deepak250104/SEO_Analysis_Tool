from bs4 import BeautifulSoup

class MetadataAnalyzer:
    """Analyze metadata elements for SEO"""
    
    def __init__(self, soup, url):
        self.soup = soup
        self.url = url
        self.issues = []
        self.recommendations = []
    
    def analyze(self):
        """Run all metadata analyses"""
        title_score = self.analyze_title()
        description_score = self.analyze_meta_description()
        heading_score = self.analyze_headings()
        image_score = self.analyze_images()
        og_score = self.analyze_open_graph()
        
        # Calculate overall metadata score (0-10)
        total_score = (title_score + description_score + heading_score + image_score + og_score) / 5
        
        return {
            'score': round(total_score, 1),
            'title': self.get_title_info(),
            'meta_description': self.get_meta_description_info(),
            'headings': self.get_heading_info(),
            'images': self.get_image_info(),
            'open_graph': self.get_og_info(),
            'issues': self.issues,
            'recommendations': self.recommendations
        }
    
    def analyze_title(self):
        """Analyze title tag"""
        title = self.soup.find('title')
        if not title or not title.string:
            self.issues.append('Missing title tag')
            self.recommendations.append('Add a descriptive title tag (50-60 characters)')
            return 0
        
        title_text = title.string.strip()
        length = len(title_text)
        
        if length < 30:
            self.issues.append(f'Title too short ({length} chars)')
            self.recommendations.append('Increase title length to 50-60 characters')
            return 5
        elif length > 60:
            self.issues.append(f'Title too long ({length} chars)')
            self.recommendations.append('Reduce title length to 50-60 characters')
            return 7
        
        return 10
    
    def analyze_meta_description(self):
        """Analyze meta description"""
        meta_desc = self.soup.find('meta', attrs={'name': 'description'})
        
        if not meta_desc or not meta_desc.get('content'):
            self.issues.append('Missing meta description')
            self.recommendations.append('Add a compelling meta description (150-160 characters)')
            return 0
        
        desc_text = meta_desc.get('content', '').strip()
        length = len(desc_text)
        
        if length < 120:
            self.issues.append(f'Meta description too short ({length} chars)')
            self.recommendations.append('Expand meta description to 150-160 characters')
            return 6
        elif length > 160:
            self.issues.append(f'Meta description too long ({length} chars)')
            self.recommendations.append('Reduce meta description to 150-160 characters')
            return 7
        
        return 10
    
    def analyze_headings(self):
        """Analyze heading structure"""
        h1_tags = self.soup.find_all('h1')
        
        if len(h1_tags) == 0:
            self.issues.append('Missing H1 tag')
            self.recommendations.append('Add a single H1 tag with primary keyword')
            return 0
        elif len(h1_tags) > 1:
            self.issues.append(f'Multiple H1 tags found ({len(h1_tags)})')
            self.recommendations.append('Use only one H1 tag per page')
            return 6
        
        # Check for heading hierarchy
        h2_tags = self.soup.find_all('h2')
        h3_tags = self.soup.find_all('h3')
        
        if len(h2_tags) == 0 and len(h3_tags) > 0:
            self.issues.append('Poor heading hierarchy (H3 without H2)')
            self.recommendations.append('Maintain proper heading hierarchy (H1 > H2 > H3)')
            return 7
        
        return 10
    
    def analyze_images(self):
        """Analyze image alt attributes"""
        images = self.soup.find_all('img')
        
        if len(images) == 0:
            return 10  # No images, no issues
        
        missing_alt = sum(1 for img in images if not img.get('alt'))
        
        if missing_alt == len(images):
            self.issues.append('All images missing alt text')
            self.recommendations.append('Add descriptive alt text to all images')
            return 0
        elif missing_alt > 0:
            percentage = (missing_alt / len(images)) * 100
            self.issues.append(f'{missing_alt} images missing alt text ({percentage:.1f}%)')
            self.recommendations.append('Add alt text to remaining images')
            return max(10 - (percentage / 10), 0)
        
        return 10
    
    def analyze_open_graph(self):
        """Analyze Open Graph tags"""
        og_tags = ['og:title', 'og:description', 'og:image', 'og:url']
        found_tags = []
        
        for tag in og_tags:
            if self.soup.find('meta', property=tag):
                found_tags.append(tag)
        
        score = (len(found_tags) / len(og_tags)) * 10
        
        if len(found_tags) < len(og_tags):
            missing = set(og_tags) - set(found_tags)
            self.recommendations.append(f'Add missing Open Graph tags: {", ".join(missing)}')
        
        return score
    
    def get_title_info(self):
        """Get title tag information"""
        title = self.soup.find('title')
        if title and title.string:
            text = title.string.strip()
            return {
                'text': text,
                'length': len(text),
                'exists': True
            }
        return {'text': '', 'length': 0, 'exists': False}
    
    def get_meta_description_info(self):
        """Get meta description information"""
        meta_desc = self.soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            text = meta_desc.get('content', '').strip()
            return {
                'text': text,
                'length': len(text),
                'exists': True
            }
        return {'text': '', 'length': 0, 'exists': False}
    
    def get_heading_info(self):
        """Get heading structure information"""
        return {
            'h1_count': len(self.soup.find_all('h1')),
            'h2_count': len(self.soup.find_all('h2')),
            'h3_count': len(self.soup.find_all('h3')),
            'h4_count': len(self.soup.find_all('h4')),
            'h1_text': [h1.get_text(strip=True) for h1 in self.soup.find_all('h1')]
        }
    
    def get_image_info(self):
        """Get image information"""
        images = self.soup.find_all('img')
        total = len(images)
        with_alt = sum(1 for img in images if img.get('alt'))
        
        return {
            'total': total,
            'with_alt': with_alt,
            'without_alt': total - with_alt,
            'alt_percentage': round((with_alt / total * 100) if total > 0 else 0, 1)
        }
    
    def get_og_info(self):
        """Get Open Graph information"""
        og_tags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']
        found = {}
        
        for tag in og_tags:
            meta_tag = self.soup.find('meta', property=tag)
            if meta_tag:
                found[tag] = meta_tag.get('content', '')
        
        return {
            'tags': found,
            'count': len(found),
            'exists': len(found) > 0
        }

