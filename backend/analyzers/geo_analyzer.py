import re

class GeoAnalyzer:
    """Analyze local/GEO SEO factors"""
    
    def __init__(self, soup, url):
        self.soup = soup
        self.url = url
        self.issues = []
        self.recommendations = []
    
    def analyze(self, location=None):
        """Run all GEO/Local SEO analyses"""
        nap_score = self.analyze_nap()
        schema_score = self.analyze_local_schema()
        local_keywords_score = self.analyze_local_keywords()
        
        # Calculate overall GEO score
        geo_score = (nap_score + schema_score + local_keywords_score) / 3
        
        return {
            'score': round(geo_score, 1),
            'nap': self.get_nap_info(),
            'schema': self.get_schema_info(),
            'local_keywords': self.get_local_keywords(),
            'issues': self.issues,
            'recommendations': self.recommendations
        }
    
    def analyze_nap(self):
        """Analyze NAP (Name, Address, Phone) consistency"""
        text = self.soup.get_text()
        
        # Check for phone number
        phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\(\d{3}\)\s*\d{3}[-.]?\d{4}'
        phones = re.findall(phone_pattern, text)
        
        # Check for address indicators
        address_keywords = ['street', 'st', 'avenue', 'ave', 'road', 'rd', 'suite', 'floor', 'building']
        has_address = any(keyword in text.lower() for keyword in address_keywords)
        
        # Check for business name in footer or header
        footer = self.soup.find('footer')
        header = self.soup.find('header')
        has_business_name = bool(footer or header)
        
        score = 0
        if phones:
            score += 4
        else:
            self.issues.append('No phone number found')
            self.recommendations.append('Add business phone number in footer or contact section')
        
        if has_address:
            score += 3
        else:
            self.issues.append('No address information found')
            self.recommendations.append('Add complete business address (NAP consistency is crucial for local SEO)')
        
        if has_business_name:
            score += 3
        else:
            self.recommendations.append('Ensure business name is prominently displayed in header/footer')
        
        return score
    
    def analyze_local_schema(self):
        """Analyze local business schema markup"""
        # Check for LocalBusiness schema
        schema_scripts = self.soup.find_all('script', type='application/ld+json')
        
        has_local_schema = False
        for script in schema_scripts:
            if script.string and ('LocalBusiness' in script.string or 
                                'Organization' in script.string or
                                'address' in script.string.lower()):
                has_local_schema = True
                break
        
        if has_local_schema:
            return 10
        else:
            self.issues.append('Missing LocalBusiness schema markup')
            self.recommendations.append('Add LocalBusiness schema markup with NAP details, opening hours, and geo coordinates')
            return 0
    
    def analyze_local_keywords(self):
        """Analyze presence of local keywords"""
        text = self.soup.get_text().lower()
        
        # Common local keyword patterns
        location_patterns = [
            r'\bnear me\b',
            r'\bin [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b',
            r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+(?:city|town|area|region|county)\b',
            r'\blocal\b',
            r'\bnearby\b'
        ]
        
        found_patterns = sum(1 for pattern in location_patterns if re.search(pattern, text))
        
        score = min((found_patterns / len(location_patterns)) * 10, 10)
        
        if score < 5:
            self.recommendations.append('Include location-based keywords in your content (e.g., city name, "near me", "local")')
        
        return score
    
    def get_nap_info(self):
        """Get NAP information found on page"""
        text = self.soup.get_text()
        
        # Extract phone numbers
        phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\(\d{3}\)\s*\d{3}[-.]?\d{4}'
        phones = re.findall(phone_pattern, text)
        
        # Look for email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        
        return {
            'phones': list(set(phones))[:3],  # Unique phones, max 3
            'emails': list(set(emails))[:3],
            'has_nap': bool(phones)
        }
    
    def get_schema_info(self):
        """Get schema markup information"""
        schema_scripts = self.soup.find_all('script', type='application/ld+json')
        
        schemas = []
        for script in schema_scripts:
            if script.string:
                if 'LocalBusiness' in script.string:
                    schemas.append('LocalBusiness')
                elif 'Organization' in script.string:
                    schemas.append('Organization')
        
        return {
            'found': list(set(schemas)),
            'count': len(set(schemas)),
            'has_local': 'LocalBusiness' in schemas
        }
    
    def get_local_keywords(self):
        """Get local keywords found"""
        text = self.soup.get_text().lower()
        
        keywords = []
        if 'near me' in text:
            keywords.append('near me')
        if 'local' in text:
            keywords.append('local')
        if 'nearby' in text:
            keywords.append('nearby')
        
        return {
            'keywords': keywords,
            'count': len(keywords)
        }

