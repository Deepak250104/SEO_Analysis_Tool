#!/usr/bin/env python3
"""
Test script to verify SEO Analysis Tool setup
Run this to check if everything is configured correctly
"""

import sys
import importlib

def check_python_version():
    """Check if Python version is compatible"""
    print("🔍 Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 11:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Compatible")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Need Python 3.11+")
        return False

def check_dependencies():
    """Check if required packages are installed"""
    print("\n🔍 Checking dependencies...")
    
    required_packages = {
        'flask': 'Flask',
        'flask_cors': 'Flask-CORS',
        'requests': 'requests',
        'bs4': 'BeautifulSoup4',
        'lxml': 'lxml',
        'pandas': 'pandas',
        'plotly': 'plotly',
        'textstat': 'textstat',
        'nltk': 'nltk',
        'dotenv': 'python-dotenv',
        'gunicorn': 'gunicorn'
    }
    
    all_installed = True
    
    for module, package in required_packages.items():
        try:
            importlib.import_module(module)
            print(f"✅ {package} - Installed")
        except ImportError:
            print(f"❌ {package} - Not installed")
            all_installed = False
    
    return all_installed

def check_directories():
    """Check if required directories exist"""
    print("\n🔍 Checking directory structure...")
    
    import os
    
    required_dirs = [
        'backend',
        'backend/api',
        'backend/analyzers',
        'backend/utils',
        'static',
        'static/css',
        'static/js',
        'templates'
    ]
    
    all_exist = True
    
    for directory in required_dirs:
        if os.path.exists(directory):
            print(f"✅ {directory}/ - Exists")
        else:
            print(f"❌ {directory}/ - Missing")
            all_exist = False
    
    return all_exist

def check_files():
    """Check if required files exist"""
    print("\n🔍 Checking required files...")
    
    import os
    
    required_files = [
        'app.py',
        'config.py',
        'requirements.txt',
        'backend/api/routes.py',
        'backend/analyzers/seo_analyzer.py',
        'backend/utils/helpers.py',
        'templates/base.html',
        'templates/index.html',
        'static/css/style.css',
        'static/js/main.js'
    ]
    
    all_exist = True
    
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file} - Exists")
        else:
            print(f"❌ {file} - Missing")
            all_exist = False
    
    return all_exist

def check_imports():
    """Check if app can be imported"""
    print("\n🔍 Checking if app can be imported...")
    
    try:
        from app import app
        print("✅ Flask app - Can be imported")
        return True
    except Exception as e:
        print(f"❌ Flask app - Import failed: {str(e)}")
        return False

def check_config():
    """Check if configuration is valid"""
    print("\n🔍 Checking configuration...")
    
    try:
        from config import Config
        
        checks = {
            'PAGESPEED_API_URL': Config.PAGESPEED_API_URL,
            'TIMEOUT_SECONDS': Config.TIMEOUT_SECONDS
        }
        
        all_valid = True
        
        for key, value in checks.items():
            if value:
                print(f"✅ {key} - Configured")
            else:
                print(f"⚠️  {key} - Not configured (may use defaults)")
        
        return all_valid
    except Exception as e:
        print(f"❌ Configuration - Error: {str(e)}")
        return False

def run_all_checks():
    """Run all checks"""
    print("=" * 60)
    print("🚀 SEO Analysis Tool - Setup Verification")
    print("=" * 60)
    
    results = {
        'Python Version': check_python_version(),
        'Dependencies': check_dependencies(),
        'Directories': check_directories(),
        'Files': check_files(),
        'App Import': check_imports(),
        'Configuration': check_config()
    }
    
    print("\n" + "=" * 60)
    print("📊 Summary")
    print("=" * 60)
    
    for check, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{check:.<40} {status}")
    
    all_passed = all(results.values())
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 All checks passed! You're ready to run the app.")
        print("\nTo start the application, run:")
        print("  python app.py")
        print("\nThen visit: http://localhost:5000")
    else:
        print("⚠️  Some checks failed. Please fix the issues above.")
        print("\nCommon fixes:")
        print("  - Install dependencies: pip install -r requirements.txt")
        print("  - Check file paths and directory structure")
        print("  - Verify Python version (3.11+ required)")
    print("=" * 60)
    
    return all_passed

if __name__ == '__main__':
    success = run_all_checks()
    sys.exit(0 if success else 1)

