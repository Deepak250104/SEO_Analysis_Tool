import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { seoApi } from '../utils/api';
import { SEOAnalysis } from '../types';
import SEOScore from '../components/SEOScore';

const Analysis: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const result = await seoApi.analyzeUrl(url);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">SEO Analysis</h1>
        <p className="text-dark-300 text-lg">
          Enter a URL to get comprehensive SEO analysis and recommendations
        </p>
      </div>

      {/* URL Input Form */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-dark-300 mb-2">
              Website URL
            </label>
            <div className="flex space-x-4">
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Analysis Results
                </h2>
                <div className="flex items-center space-x-2 text-dark-300">
                  <ExternalLink className="w-4 h-4" />
                  <a
                    href={analysis.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    {formatUrl(analysis.url)}
                  </a>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-dark-400">Analyzed on</div>
                <div className="text-dark-300">
                  {new Date(analysis.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Score */}
          <SEOScore score={analysis.score} />

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metadata Analysis */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-white mb-4">Metadata Analysis</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-dark-300 text-sm">Title Tag</span>
                    <span className="text-xs text-dark-400">
                      {analysis.metadata.titleLength} characters
                    </span>
                  </div>
                  <div className="bg-dark-700 rounded p-3 text-sm text-white">
                    {analysis.metadata.title || 'No title found'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-dark-300 text-sm">Meta Description</span>
                    <span className="text-xs text-dark-400">
                      {analysis.metadata.descriptionLength} characters
                    </span>
                  </div>
                  <div className="bg-dark-700 rounded p-3 text-sm text-white">
                    {analysis.metadata.description || 'No description found'}
                  </div>
                </div>
                <div>
                  <span className="text-dark-300 text-sm">Keywords</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysis.metadata.keywords.length > 0 ? (
                      analysis.metadata.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))
                    ) : (
                      <span className="text-dark-400 text-sm">No keywords found</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Link Analysis */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-white mb-4">Link Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Internal Links</span>
                  <span className="text-white font-semibold">{analysis.links.internal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">External Links</span>
                  <span className="text-white font-semibold">{analysis.links.external}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Broken Links</span>
                  <span className={`font-semibold ${analysis.links.broken > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {analysis.links.broken}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">NoFollow Links</span>
                  <span className="text-white font-semibold">{analysis.links.nofollow}</span>
                </div>
              </div>
            </div>

            {/* Content Analysis */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-white mb-4">Content Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Word Count</span>
                  <span className="text-white font-semibold">{analysis.content.wordCount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-dark-300 text-sm mb-2 block">Heading Structure</span>
                  <div className="space-y-1">
                    {Object.entries(analysis.content.headings).map(([level, count]) => (
                      <div key={level} className="flex justify-between items-center text-sm">
                        <span className="text-dark-400">H{level.slice(1)}</span>
                        <span className="text-white">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-dark-300 text-sm mb-2 block">Images</span>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-dark-400">Total Images</span>
                      <span className="text-white">{analysis.content.images.total}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-dark-400">With Alt Text</span>
                      <span className="text-green-400">{analysis.content.images.withAlt}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-dark-400">Without Alt Text</span>
                      <span className="text-red-400">{analysis.content.images.withoutAlt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Load Time</span>
                  <span className="text-white font-semibold">
                    {analysis.performance.loadTime.toFixed(2)}s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">First Contentful Paint</span>
                  <span className="text-white font-semibold">
                    {analysis.performance.firstContentfulPaint.toFixed(2)}s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Largest Contentful Paint</span>
                  <span className="text-white font-semibold">
                    {analysis.performance.largestContentfulPaint.toFixed(2)}s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Cumulative Layout Shift</span>
                  <span className="text-white font-semibold">
                    {analysis.performance.cumulativeLayoutShift.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">First Input Delay</span>
                  <span className="text-white font-semibold">
                    {analysis.performance.firstInputDelay.toFixed(2)}ms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              Recommendations
            </h3>
            <div className="space-y-3">
              {analysis.recommendations.length > 0 ? (
                analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-dark-300">{recommendation}</p>
                  </div>
                ))
              ) : (
                <p className="text-dark-400">No specific recommendations at this time.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
