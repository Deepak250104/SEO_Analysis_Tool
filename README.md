# SEO & GEO Analysis Tool

A comprehensive, free, and open-source SEO and GEO analysis web application built with React and Python. This tool provides detailed SEO analysis, URL comparison, and local SEO insights to help improve your website's search engine performance.

## 🌟 Features

### SEO Analysis
- **Comprehensive Scoring**: Overall SEO score out of 10 with detailed breakdowns
- **Metadata Analysis**: Title tags, meta descriptions, and keyword analysis
- **Link Analysis**: Internal/external links, broken link detection, and nofollow analysis
- **Content Quality**: Word count, heading structure, image alt text analysis
- **Performance Metrics**: Page load speed and Core Web Vitals simulation
- **Actionable Recommendations**: Specific suggestions to improve SEO

### URL Comparison
- **Side-by-Side Analysis**: Compare two websites directly
- **Visual Differentiation**: Clear indicators of which site performs better
- **Detailed Metrics**: Comprehensive comparison across all SEO factors
- **Winner Determination**: Automatic scoring to identify the better-performing site

### GEO/Local SEO Features
- **Local Keyword Analysis**: Search volume, difficulty, and CPC data
- **Local Rankings**: Track keyword positions in local search results
- **Review Analysis**: Monitor reviews across multiple platforms
- **NAP Consistency**: Name, Address, Phone consistency checking
- **Local SEO Recommendations**: Targeted suggestions for local search optimization

### UI/UX Features
- **Dark Mode Design**: Clean, modern dark theme interface
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Real-time Analysis**: Live updates during analysis process
- **Interactive Charts**: Visual representation of SEO metrics
- **User-friendly Interface**: Intuitive navigation and clear data presentation

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication
- **Recharts** for data visualization

### Backend
- **FastAPI** for high-performance API
- **Python 3.9+** for server-side processing
- **BeautifulSoup4** for HTML parsing
- **Requests** for web scraping
- **Pydantic** for data validation
- **Uvicorn** as ASGI server

### Deployment
- **Vercel** for frontend hosting
- **Render** for backend hosting
- **Free tier** compatible

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/docs

## 🚀 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with the included `vercel.json` configuration
4. Update the `REACT_APP_API_URL` environment variable with your backend URL

### Backend (Render)
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your repository
4. Use the included `render.yaml` configuration
5. Deploy automatically

## 📖 API Documentation

### SEO Analysis
- `POST /api/seo/analyze` - Analyze a single URL
- `POST /api/seo/compare` - Compare two URLs

### GEO Analysis
- `POST /api/geo/analyze` - Analyze local SEO for a location

### Performance
- `POST /api/performance/analyze` - Analyze page performance

### Keywords
- `GET /api/keywords/suggestions` - Get keyword suggestions

Full API documentation available at `/docs` when running the backend.

## 🎯 Usage

### Single URL Analysis
1. Navigate to the "SEO Analysis" page
2. Enter the URL you want to analyze
3. Click "Analyze" to get comprehensive SEO insights
4. Review the detailed scores and recommendations

### URL Comparison
1. Go to the "Compare" page
2. Enter two URLs to compare
3. Click "Compare URLs" to see side-by-side analysis
4. Review which site performs better in each category

### Local SEO Analysis
1. Visit the "GEO Insights" page
2. Enter your location and target keywords
3. Click "Analyze Location" to get local SEO insights
4. Review keyword data, rankings, and local recommendations

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```
PORT=5000
ENVIRONMENT=development
CORS_ORIGINS=*
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with free and open-source tools
- Uses only free APIs and services
- Inspired by the need for accessible SEO tools
- Community-driven development

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🗺️ Roadmap

- [ ] Real Lighthouse integration for performance analysis
- [ ] Advanced keyword research with free APIs
- [ ] Historical data tracking
- [ ] Export functionality for reports
- [ ] Mobile app version
- [ ] More detailed competitor analysis
- [ ] Integration with Google Search Console
- [ ] Advanced local SEO features

---

**Made with ❤️ for the SEO community**
