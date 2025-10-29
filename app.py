from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from config import Config
from backend.api.routes import api_bp
import os

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def index():
    """Home page / Dashboard"""
    return render_template('index.html')

@app.route('/analysis')
def analysis():
    """Single URL analysis page"""
    return render_template('analysis.html')

@app.route('/comparison')
def comparison():
    """Two URL comparison page"""
    return render_template('comparison.html')

@app.route('/geo')
def geo():
    """GEO/Local SEO insights page"""
    return render_template('geo.html')

@app.errorhandler(404)
def not_found(error):
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Create necessary directories
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    os.makedirs('static/images', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    app.run(debug=True, host='0.0.0.0', port=5000)

