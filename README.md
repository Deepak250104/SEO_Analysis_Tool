# 🔍 SEO Analysis Tool

A comprehensive, free, and open-source SEO and GEO analysis web application. Analyze your website's SEO performance, compare with competitors, and get actionable recommendations to improve your search rankings.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![Flask](https://img.shields.io/badge/flask-3.0+-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

## ✨ Features

### 🎯 Core SEO Analysis
- **Comprehensive SEO Scoring**: Overall score out of 10 with detailed breakdowns
- **Metadata Analysis**: Title tags, meta descriptions, heading structure, image alt text, Open Graph tags
- **Link Analysis**: Internal/external links, anchor text quality, broken link detection
- **Content Quality**: Word count, readability scoring, keyword extraction and density analysis
- **Performance Metrics**: Page speed analysis using Google Lighthouse API

### 🔄 Comparison Tool
- **Side-by-Side Comparison**: Compare two websites' SEO metrics
- **Visual Differentiation**: Radar charts and visual indicators for easy comparison
- **Competitive Analysis**: Identify strengths and weaknesses relative to competitors

### 📍 Local/GEO SEO Features
- **NAP Analysis**: Check Name, Address, Phone consistency
- **Schema Markup**: Verify LocalBusiness structured data implementation
- **Local Keywords**: Analyze location-based keyword usage
- **Local SEO Recommendations**: Get specific suggestions for improving local search visibility

### 💡 Additional Features
- **Keyword Suggestions**: Location-based keyword recommendations
- **Actionable Recommendations**: Prioritized list of improvements
- **Issue Detection**: Identify SEO problems and their solutions
- **Modern Dark Mode UI**: Beautiful, responsive design for all devices

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/SEO_Analysis_Tool.git
cd SEO_Analysis_Tool
```

2. **Create a virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up API Key** (Optional - for unlimited performance analysis)
```bash
# Create a .env file for Google PageSpeed API key (optional):
LIGHTHOUSE_API_KEY=your-google-api-key
```

5. **Run the application**
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
SEO_Analysis_Tool/
├── app.py                          # Flask application entry point
├── config.py                       # Configuration settings
├── requirements.txt                # Python dependencies
├── Procfile                        # Heroku/Render deployment
├── runtime.txt                     # Python version specification
├── vercel.json                     # Vercel deployment config
├── render.yaml                     # Render deployment config
│
├── backend/                        # Backend Python modules
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py              # API endpoints
│   ├── analyzers/
│   │   ├── __init__.py
│   │   ├── seo_analyzer.py        # Main SEO analysis coordinator
│   │   ├── metadata_analyzer.py   # Metadata analysis
│   │   ├── link_analyzer.py       # Link analysis
│   │   ├── content_analyzer.py    # Content quality analysis
│   │   └── geo_analyzer.py        # Local/GEO SEO analysis
│   └── utils/
│       ├── __init__.py
│       ├── helpers.py             # Utility functions
│       └── lighthouse.py          # Lighthouse API integration
│
├── templates/                      # HTML templates
│   ├── base.html                  # Base template
│   ├── index.html                 # Home page
│   ├── analysis.html              # Single URL analysis
│   ├── comparison.html            # URL comparison
│   └── geo.html                   # GEO/Local SEO analysis
│
└── static/                         # Static assets
    ├── css/
    │   └── style.css              # Main stylesheet
    └── js/
        └── main.js                # JavaScript utilities
```

## 🔧 API Documentation

### Endpoints

#### 1. Analyze Single URL
```
POST /api/analyze
Content-Type: application/json

Body:
{
  "url": "https://example.com",
  "include_performance": true,
  "include_geo": false
}

Response:
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
  "metadata": {...},
  "links": {...},
  "content": {...},
  "performance": {...},
  "recommendations": [...],
  "issues": [...]
}
```

#### 2. Compare URLs
```
POST /api/compare
Content-Type: application/json

Body:
{
  "url1": "https://example.com",
  "url2": "https://competitor.com"
}

Response:
{
  "success": true,
  "url1": {...},
  "url2": {...},
  "comparison": {
    "winner": "url1",
    "score_difference": {...}
  }
}
```

#### 3. GEO/Local SEO Analysis
```
POST /api/geo-analyze
Content-Type: application/json

Body:
{
  "url": "https://example.com",
  "location": "New York, USA"
}

Response:
{
  "success": true,
  "url": "https://example.com",
  "location": "New York, USA",
  "results": {
    "score": 6.5,
    "nap": {...},
    "schema": {...},
    "local_keywords": {...}
  }
}
```

#### 4. Keyword Suggestions
```
POST /api/keywords
Content-Type: application/json

Body:
{
  "url": "https://example.com",
  "location": "New York"
}

Response:
{
  "success": true,
  "keywords": [...],
  "local_suggestions": [...]
}
```

#### 5. Health Check
```
GET /api/health

Response:
{
  "status": "healthy",
  "message": "SEO Analysis API is running"
}
```

## 📊 Scoring System

### Overall SEO Score (0-10)
The overall score is a weighted average of:
- **Metadata Quality**: 20%
- **Link Analysis**: 20%
- **Content Quality**: 25%
- **Performance**: 25%
- **SERP Features**: 10%

### Individual Component Scores

#### Metadata Score (0-10)
- Title tag presence and length (50-60 chars optimal)
- Meta description presence and length (150-160 chars optimal)
- Heading structure (single H1, proper hierarchy)
- Image alt text coverage
- Open Graph tags presence

#### Link Score (0-10)
- Internal link count (10+ recommended)
- External link quality
- Internal/external link ratio
- Anchor text quality
- Broken link detection

#### Content Score (0-10)
- Word count (800+ words recommended)
- Readability (15-20 words per sentence optimal)
- Keyword variety and density (1-2% optimal)
- Content structure

#### Performance Score (0-10)
- Based on Google Lighthouse metrics
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

## 🌐 Deployment

### Deploy to Render (Recommended for Backend)

1. Create account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Render will automatically detect `render.yaml`
4. Click "Create Web Service"
5. Set environment variables:
   - `SECRET_KEY`: Generate a secure random key
   - `LIGHTHOUSE_API_KEY`: (Optional) Your Google API key

### Deploy to Vercel (Frontend + Serverless)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set buildpack: `heroku buildpacks:set heroku/python`
5. Deploy: `git push heroku main`

## 🔑 Google PageSpeed Insights API Key (Optional)

The tool works perfectly without an API key, but for unlimited requests and faster performance:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable PageSpeed Insights API
4. Create credentials (API Key)
5. Add to `.env` file: `LIGHTHOUSE_API_KEY=your-api-key`

**Note**: Without an API key, you may hit rate limits (~25 requests/day) for performance analysis.

## 🛠️ Technology Stack

### Backend
- **Flask 3.0**: Web framework
- **BeautifulSoup4**: HTML parsing
- **Requests**: HTTP client
- **lxml**: XML/HTML parser
- **Plotly**: Data visualization
- **NLTK**: Natural language processing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies
- **Chart.js**: Data visualization (comparison charts)

### APIs & Services
- **Google PageSpeed Insights API**: Performance analysis
- **Free & Open Source**: No paid services required

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 style guide for Python code
- Write descriptive commit messages
- Add comments for complex logic
- Test thoroughly before submitting PR
- Update documentation as needed

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please open an issue on GitHub with:
- Clear description of the issue/feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google PageSpeed Insights API for performance metrics
- BeautifulSoup4 for HTML parsing
- Chart.js for beautiful visualizations
- Open source community for inspiration

## 📧 Contact

- **Project Link**: [https://github.com/yourusername/SEO_Analysis_Tool](https://github.com/yourusername/SEO_Analysis_Tool)
- **Issues**: [https://github.com/yourusername/SEO_Analysis_Tool/issues](https://github.com/yourusername/SEO_Analysis_Tool/issues)

## 🌟 Show Your Support

If you find this project helpful, please give it a ⭐️ on GitHub!

---

**Built with ❤️ for the SEO community**

## 📚 Additional Resources

- [SEO Best Practices](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Local SEO Guide](https://moz.com/learn/seo/local-seo)
- [Schema.org Documentation](https://schema.org/LocalBusiness)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)

## 🔮 Future Enhancements

- [ ] Backlink analysis
- [ ] Mobile-specific SEO checks
- [ ] Sitemap validation
- [ ] Robots.txt analysis
- [ ] Social media integration scores
- [ ] Historical tracking and trends
- [ ] PDF report generation
- [ ] Multi-language support
- [ ] Integration with Google Search Console
- [ ] Scheduled monitoring and alerts

## ⚠️ Disclaimer

This tool provides SEO recommendations based on general best practices. Results should be used as guidelines, not absolute requirements. Always consider your specific use case and target audience. SEO is an ongoing process, and no tool can guarantee search engine rankings.

## 🔄 Changelog

### Version 1.0.0 (2025)
- Initial release
- Single URL analysis
- Side-by-side comparison
- GEO/Local SEO analysis
- Performance metrics integration
- Dark mode UI
- Responsive design
- Free and open source
