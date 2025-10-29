# Deployment Guide

This guide covers deploying the SEO Analysis Tool to various platforms.

## 📋 Prerequisites

- Git repository
- Python 3.11+
- Account on chosen platform (Render, Vercel, Heroku, etc.)

## 🌐 Deployment Options

### Option 1: Render (Recommended)

Render provides free hosting with automatic deploys from GitHub.

#### Steps:

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the SEO_Analysis_Tool repository

3. **Configure Service**
   ```
   Name: seo-analysis-tool
   Environment: Python
   Region: Choose nearest to your users
   Branch: main
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn app:app
   ```

4. **Set Environment Variables** (Optional)
   ```
   FLASK_ENV=production
   LIGHTHOUSE_API_KEY=<optional-google-api-key>
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy
   - Your app will be available at: `https://your-app-name.onrender.com`

#### Auto-Deploy

Render automatically deploys when you push to your main branch.

#### Free Tier Limitations

- Service spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month of runtime (sufficient for personal projects)

---

### Option 2: Vercel

Vercel is excellent for serverless deployments.

#### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Configure Environment Variables** (Optional)
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add (optional):
     - `LIGHTHOUSE_API_KEY` - For unlimited performance analysis

5. **Production Deploy**
```bash
vercel --prod
```

#### Configuration File

The `vercel.json` file is already configured:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "app.py"
    }
  ]
}
```

---

### Option 3: Heroku

Classic platform with easy deployment.

#### Steps:

1. **Install Heroku CLI**
   - Download from [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login**
```bash
heroku login
```

3. **Create App**
```bash
heroku create your-app-name
```

4. **Set Environment Variables** (Optional)
```bash
heroku config:set LIGHTHOUSE_API_KEY=your-api-key  # Optional
```

5. **Deploy**
```bash
git push heroku main
```

6. **Open App**
```bash
heroku open
```

#### Required Files

- `Procfile`: Already configured
- `runtime.txt`: Specifies Python version
- `requirements.txt`: Dependencies

---

### Option 4: Railway

Modern platform similar to Render.

#### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub

2. **New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Railway auto-detects Python
   - Add environment variables in Settings

4. **Deploy**
   - Automatic deployment on push

---

### Option 5: PythonAnywhere

Good for learning and small projects.

#### Steps:

1. **Create Account**
   - Go to [pythonanywhere.com](https://www.pythonanywhere.com)
   - Sign up for free account

2. **Upload Code**
   - Use Git to clone repository
   - Or upload files manually

3. **Set Up Web App**
   - Go to Web tab
   - Create new web app
   - Choose Flask
   - Set Python version to 3.11

4. **Configure WSGI**
   - Edit WSGI configuration file
   - Point to your Flask app

5. **Install Dependencies**
```bash
pip install --user -r requirements.txt
```

6. **Reload Web App**

---

### Option 6: DigitalOcean App Platform

Professional-grade deployment.

#### Steps:

1. **Create Account**
   - Go to [digitalocean.com](https://www.digitalocean.com)

2. **Create App**
   - Click "Create" → "Apps"
   - Connect GitHub repository

3. **Configure**
   - Select region
   - Set environment variables
   - Choose plan (Basic $5/month or free trial)

4. **Deploy**
   - DigitalOcean handles the rest

---

## 🔐 Security Best Practices

### Environment Variables

If using Google PageSpeed API key, keep it in `.env` file:

```bash
# .env file (add to .gitignore)
LIGHTHOUSE_API_KEY=your-api-key-here
```

### HTTPS

- All major platforms provide free SSL/HTTPS
- Ensure HTTPS is enabled in production

### Rate Limiting

Consider adding rate limiting for production:

```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    default_limits=["100 per hour"]
)
```

---

## 📊 Monitoring

### Health Check Endpoint

The app includes a health check endpoint:
```
GET /api/health
```

### Logging

Configure logging for production:

```python
import logging

if app.config['ENV'] == 'production':
    logging.basicConfig(level=logging.WARNING)
else:
    logging.basicConfig(level=logging.DEBUG)
```

---

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Python version in `runtime.txt`
   - Verify all dependencies in `requirements.txt`
   - Check build logs for specific errors

2. **App Crashes on Start**
   - Verify `Procfile` command
   - Check environment variables are set
   - Review application logs

3. **Static Files Not Loading**
   - Check `vercel.json` or platform config
   - Verify static file paths in templates
   - Check CORS settings if needed

4. **API Rate Limits**
   - Add `LIGHTHOUSE_API_KEY` for higher limits
   - Implement caching for frequent requests
   - Consider adding rate limiting

### Debug Mode

Never enable debug mode in production:
```python
# config.py
DEBUG = os.environ.get('FLASK_ENV') != 'production'
```

---

## 🚀 Performance Optimization

### Caching

Add caching for repeated analyses:
```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@cache.memoize(timeout=300)
def analyze_url(url):
    # Analysis logic
    pass
```

### Database

For production with many users, consider adding a database:
- PostgreSQL (recommended)
- MongoDB
- SQLite (simple projects)

### CDN

Use a CDN for static files:
- Cloudflare
- AWS CloudFront
- Netlify (for frontend assets)

---

## 📈 Scaling

### Horizontal Scaling

Most platforms support auto-scaling:
- Render: Scale in dashboard
- Heroku: Add dynos
- DigitalOcean: Adjust plan

### Database Scaling

When you add a database:
- Use connection pooling
- Add read replicas for heavy read operations
- Consider database caching (Redis)

### Background Jobs

For heavy tasks, use background workers:
- Celery with Redis
- RQ (Redis Queue)
- Platform-specific solutions

---

## 🔄 CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          # Deploy commands
```

### Automated Testing

Add tests before deployment:
```yaml
- name: Run tests
  run: |
    pip install pytest
    pytest tests/
```

---

## 📞 Support

If you encounter issues:
1. Check platform status page
2. Review deployment logs
3. Check platform documentation
4. Open issue on GitHub

---

## ✅ Deployment Checklist

- [ ] Environment variables set
- [ ] Secret key generated
- [ ] Debug mode disabled
- [ ] HTTPS enabled
- [ ] Health check working
- [ ] Static files loading
- [ ] API endpoints working
- [ ] Error handling configured
- [ ] Monitoring set up
- [ ] Backup strategy planned

---

**Good luck with your deployment! 🚀**

