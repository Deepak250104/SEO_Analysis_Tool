# API Usage Guide

Complete guide to using the SEO Analysis Tool API.

## 🌐 Base URL

```
Local Development: http://localhost:5000
Production: https://your-domain.com
```

## 🔐 Authentication

The API is open and free to use. No authentication required! Perfect for open-source projects and learning.

## 📡 Endpoints

### 1. Health Check

Check if the API is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "healthy",
  "message": "SEO Analysis API is running"
}
```

**Example:**
```bash
curl https://your-domain.com/api/health
```

---

### 2. Analyze Single URL

Perform comprehensive SEO analysis on a single URL.

**Endpoint:** `POST /api/analyze`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://example.com",
  "include_performance": true,
  "include_geo": false
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes | URL to analyze |
| include_performance | boolean | No | Include Lighthouse performance analysis (default: true) |
| include_geo | boolean | No | Include GEO/Local SEO analysis (default: false) |

**Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "overall_score": 7.5,
  "scores": {
    "metadata": 8.2,
    "links": 7.1,
    "content": 6.8,
    "performance": 7.9
  },
  "metadata": {
    "score": 8.2,
    "title": {
      "text": "Example Domain",
      "length": 14,
      "exists": true
    },
    "meta_description": {
      "text": "Example description...",
      "length": 155,
      "exists": true
    },
    "headings": {
      "h1_count": 1,
      "h2_count": 3,
      "h3_count": 5
    },
    "images": {
      "total": 10,
      "with_alt": 8,
      "without_alt": 2,
      "alt_percentage": 80.0
    },
    "issues": ["..."],
    "recommendations": ["..."]
  },
  "links": {
    "score": 7.1,
    "internal": {
      "count": 25,
      "links": [...]
    },
    "external": {
      "count": 8,
      "links": [...]
    },
    "total_links": 33,
    "issues": ["..."],
    "recommendations": ["..."]
  },
  "content": {
    "score": 6.8,
    "word_count": 450,
    "character_count": 2850,
    "keywords": [
      {
        "keyword": "example",
        "frequency": 12
      }
    ],
    "keyword_density": 2.67,
    "readability_score": 7.5,
    "issues": ["..."],
    "recommendations": ["..."]
  },
  "performance": {
    "overall_score": 7.9,
    "performance_score": 8.1,
    "accessibility_score": 8.5,
    "best_practices_score": 7.2,
    "seo_score": 8.0,
    "metrics": {
      "first_contentful_paint": "1.8 s",
      "largest_contentful_paint": "2.5 s",
      "time_to_interactive": "3.2 s",
      "cumulative_layout_shift": "0.05",
      "speed_index": "2.1 s"
    }
  },
  "recommendations": [
    "Add more content (minimum 300-500 words for better SEO)",
    "Reduce keyword density to 1-2% to avoid keyword stuffing",
    "Add more internal links to improve site navigation and SEO"
  ],
  "issues": [
    "Content is short (450 words)",
    "Few internal links (25)"
  ],
  "status_code": 200,
  "response_time": 1.234
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid URL format"
}
```

**Example (cURL):**
```bash
curl -X POST https://your-domain.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "include_performance": true,
    "include_geo": false
  }'
```

**Example (Python):**
```python
import requests

url = "http://localhost:5000/api/analyze"
data = {
    "url": "https://example.com",
    "include_performance": True,
    "include_geo": False
}

response = requests.post(url, json=data)
result = response.json()

if result['success']:
    print(f"Overall Score: {result['overall_score']}/10")
    print(f"Metadata: {result['scores']['metadata']}/10")
    print(f"Links: {result['scores']['links']}/10")
    print(f"Content: {result['scores']['content']}/10")
else:
    print(f"Error: {result['error']}")
```

**Example (JavaScript):**
```javascript
async function analyzeSEO(url) {
  const response = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: url,
      include_performance: true,
      include_geo: false
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    console.log(`Overall Score: ${data.overall_score}/10`);
    console.log('Recommendations:', data.recommendations);
  } else {
    console.error('Error:', data.error);
  }
}

analyzeSEO('https://example.com');
```

---

### 3. Compare URLs

Compare SEO metrics between two URLs.

**Endpoint:** `POST /api/compare`

**Request Body:**
```json
{
  "url1": "https://example.com",
  "url2": "https://competitor.com"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url1 | string | Yes | First URL to compare |
| url2 | string | Yes | Second URL to compare |

**Response:**
```json
{
  "success": true,
  "url1": {
    "url": "https://example.com",
    "overall_score": 7.5,
    "scores": {...},
    "metadata": {...},
    "links": {...},
    "content": {...}
  },
  "url2": {
    "url": "https://competitor.com",
    "overall_score": 6.8,
    "scores": {...},
    "metadata": {...},
    "links": {...},
    "content": {...}
  },
  "comparison": {
    "winner": "url1",
    "score_difference": {
      "overall": 0.7,
      "metadata": 1.2,
      "links": -0.5,
      "content": 0.8,
      "performance": 0.2
    },
    "url1_better_at": [
      {
        "category": "metadata",
        "difference": 1.2
      },
      {
        "category": "content",
        "difference": 0.8
      }
    ],
    "url2_better_at": [
      {
        "category": "links",
        "difference": 0.5
      }
    ]
  }
}
```

**Example (Python):**
```python
import requests

url = "http://localhost:5000/api/compare"
data = {
    "url1": "https://example.com",
    "url2": "https://competitor.com"
}

response = requests.post(url, json=data)
result = response.json()

if result['success']:
    print(f"Winner: {result['comparison']['winner']}")
    print(f"Score Difference: {result['comparison']['score_difference']['overall']}")
```

---

### 4. GEO/Local SEO Analysis

Analyze local SEO factors for a website.

**Endpoint:** `POST /api/geo-analyze`

**Request Body:**
```json
{
  "url": "https://example.com",
  "location": "New York, USA"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes | URL to analyze |
| location | string | No | Target location (default: "United States") |

**Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "location": "New York, USA",
  "results": {
    "score": 6.5,
    "nap": {
      "phones": ["+1-555-0123"],
      "emails": ["contact@example.com"],
      "has_nap": true
    },
    "schema": {
      "found": ["LocalBusiness", "Organization"],
      "count": 2,
      "has_local": true
    },
    "local_keywords": {
      "keywords": ["local", "near me"],
      "count": 2
    },
    "issues": ["..."],
    "recommendations": ["..."]
  }
}
```

**Example (cURL):**
```bash
curl -X POST https://your-domain.com/api/geo-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "location": "New York, USA"
  }'
```

---

### 5. Keyword Suggestions

Get keyword suggestions based on page content.

**Endpoint:** `POST /api/keywords`

**Request Body:**
```json
{
  "url": "https://example.com",
  "location": "New York"
}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes | URL to analyze |
| location | string | No | Target location for local keyword suggestions |

**Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "keywords": [
    {
      "keyword": "example",
      "frequency": 12
    },
    {
      "keyword": "domain",
      "frequency": 8
    }
  ],
  "local_suggestions": [
    "example in New York",
    "domain in New York",
    "example near me"
  ],
  "top_keyword": "example"
}
```

---

## 🔧 Error Handling

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid parameters) |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Errors

1. **Invalid URL**
```json
{
  "success": false,
  "error": "Invalid URL format"
}
```

2. **Missing Parameters**
```json
{
  "success": false,
  "error": "URL is required"
}
```

3. **Network Error**
```json
{
  "success": false,
  "error": "Failed to fetch URL: Connection timeout"
}
```

---

## ⚡ Rate Limiting

**Free Tier:**
- 100 requests per hour per IP
- No rate limit with API key (future feature)

**Lighthouse API:**
- Without API key: ~25 requests per day
- With API key: Higher limits (check Google Cloud quotas)

---

## 💡 Best Practices

### 1. Cache Results

Cache results on your end to avoid redundant requests:

```python
import time

cache = {}

def get_analysis(url):
    if url in cache:
        cached_data, timestamp = cache[url]
        if time.time() - timestamp < 3600:  # 1 hour cache
            return cached_data
    
    # Make API request
    result = requests.post('http://localhost:5000/api/analyze', 
                          json={'url': url})
    data = result.json()
    
    cache[url] = (data, time.time())
    return data
```

### 2. Handle Errors Gracefully

```python
def safe_analyze(url):
    try:
        response = requests.post(
            'http://localhost:5000/api/analyze',
            json={'url': url},
            timeout=60
        )
        response.raise_for_status()
        return response.json()
    except requests.Timeout:
        return {'success': False, 'error': 'Request timeout'}
    except requests.RequestException as e:
        return {'success': False, 'error': str(e)}
```

### 3. Batch Processing

For multiple URLs, add delays between requests:

```python
import time

urls = ['url1', 'url2', 'url3']
results = []

for url in urls:
    result = analyze_url(url)
    results.append(result)
    time.sleep(2)  # 2 second delay between requests
```

---

## 📊 Response Time

Typical response times:
- Basic analysis: 2-5 seconds
- With performance: 5-15 seconds
- Comparison: 10-30 seconds

Factors affecting speed:
- Target website response time
- Lighthouse API availability
- Network latency
- Content size

---

## 🔒 Security

### Input Validation

All URLs are validated before processing:
- Must be valid HTTP/HTTPS URLs
- Must be accessible
- Timeouts after 30 seconds

### CORS

CORS is enabled for cross-origin requests. In production, configure allowed origins:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-frontend-domain.com"]
    }
})
```

---

## 📝 Examples

### Complete Python Example

```python
import requests
import json

class SEOAnalyzer:
    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url
        
    def analyze(self, url, include_performance=True, include_geo=False):
        """Analyze a single URL"""
        endpoint = f"{self.base_url}/api/analyze"
        data = {
            "url": url,
            "include_performance": include_performance,
            "include_geo": include_geo
        }
        
        response = requests.post(endpoint, json=data)
        return response.json()
    
    def compare(self, url1, url2):
        """Compare two URLs"""
        endpoint = f"{self.base_url}/api/compare"
        data = {"url1": url1, "url2": url2}
        
        response = requests.post(endpoint, json=data)
        return response.json()
    
    def geo_analyze(self, url, location="United States"):
        """Analyze local SEO"""
        endpoint = f"{self.base_url}/api/geo-analyze"
        data = {"url": url, "location": location}
        
        response = requests.post(endpoint, json=data)
        return response.json()
    
    def get_keywords(self, url, location=None):
        """Get keyword suggestions"""
        endpoint = f"{self.base_url}/api/keywords"
        data = {"url": url}
        if location:
            data["location"] = location
        
        response = requests.post(endpoint, json=data)
        return response.json()

# Usage
analyzer = SEOAnalyzer()

# Analyze
result = analyzer.analyze("https://example.com")
print(f"Overall Score: {result['overall_score']}/10")

# Compare
comparison = analyzer.compare("https://example.com", "https://competitor.com")
print(f"Winner: {comparison['comparison']['winner']}")

# GEO Analysis
geo_result = analyzer.geo_analyze("https://example.com", "New York")
print(f"Local SEO Score: {geo_result['results']['score']}/10")
```

---

## 📞 Support

For API questions or issues:
- GitHub Issues: [Report bugs or request features](https://github.com/yourusername/SEO_Analysis_Tool/issues)
- Documentation: Check README.md
- Examples: See `/examples` directory

---

**Happy Analyzing! 🚀**

