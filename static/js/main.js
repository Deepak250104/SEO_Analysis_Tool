// Main JavaScript for SEO Analysis Tool

// Utility Functions
function showError(message, containerId = 'errorMessage') {
    const errorDiv = document.getElementById(containerId);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('active');
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            errorDiv.classList.remove('active');
        }, 10000);
    }
}

function showLoading(show, loaderId = 'loadingSpinner') {
    const loader = document.getElementById(loaderId);
    if (loader) {
        if (show) {
            loader.classList.add('active');
        } else {
            loader.classList.remove('active');
        }
    }
}

function validateURL(url) {
    try {
        new URL(url.startsWith('http') ? url : 'https://' + url);
        return true;
    } catch {
        return false;
    }
}

function formatNumber(num) {
    return num.toLocaleString();
}

function getScoreColor(score) {
    if (score >= 8) return 'var(--success)';
    if (score >= 5) return 'var(--warning)';
    return 'var(--danger)';
}

function getScoreClass(score) {
    if (score >= 8) return 'score-good';
    if (score >= 5) return 'score-warning';
    return 'score-poor';
}

function getScoreBadge(score) {
    if (score >= 8) return 'badge-success';
    if (score >= 5) return 'badge-warning';
    return 'badge-danger';
}

// Animation helper
function animateNumber(element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current * 10) / 10;
        }
    }, 16);
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Export results as JSON
function exportResults(data, filename = 'seo-analysis.json') {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = filename;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Debounce function for input fields
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Local storage helpers
const storage = {
    save: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    },
    
    load: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage load error:', e);
            return null;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }
};

// Save analysis history
function saveToHistory(data) {
    const history = storage.load('seo_analysis_history') || [];
    const entry = {
        url: data.url,
        score: data.overall_score,
        timestamp: new Date().toISOString()
    };
    
    history.unshift(entry);
    
    // Keep only last 10 analyses
    if (history.length > 10) {
        history.pop();
    }
    
    storage.save('seo_analysis_history', history);
}

// Get analysis history
function getHistory() {
    return storage.load('seo_analysis_history') || [];
}

// Initialize tooltips (if needed)
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('SEO Analysis Tool initialized');
    
    // Set current year in footer
    const yearSpan = document.querySelector('footer p');
    if (yearSpan) {
        yearSpan.innerHTML = yearSpan.innerHTML.replace('2025', new Date().getFullYear());
    }
    
    // Initialize tooltips
    initTooltips();
    
    // Add active class to current nav link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});

// Handle API errors
function handleAPIError(error) {
    console.error('API Error:', error);
    
    if (error.message.includes('Failed to fetch')) {
        return 'Network error. Please check your connection and try again.';
    }
    
    return error.message || 'An unexpected error occurred';
}

// Smooth scroll to element
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Print results
function printResults() {
    window.print();
}

// Share results (if Web Share API is available)
async function shareResults(data) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'SEO Analysis Results',
                text: `SEO Score: ${data.overall_score}/10 for ${data.url}`,
                url: window.location.href
            });
        } catch (err) {
            console.error('Share failed:', err);
        }
    } else {
        // Fallback: copy URL to clipboard
        copyToClipboard(window.location.href);
    }
}

// Export to console for debugging
console.log('SEO Analysis Tool - v1.0.0');
console.log('Utilities loaded:', {
    showError,
    showLoading,
    validateURL,
    formatNumber,
    getScoreColor,
    getScoreClass,
    storage,
    exportResults
});

