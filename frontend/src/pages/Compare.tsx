import React, { useState } from 'react';
import { BarChart3, Loader2, AlertCircle, ExternalLink, Trophy, Minus } from 'lucide-react';
import { seoApi } from '../utils/api';
import { ComparisonData } from '../types';
import SEOScore from '../components/SEOScore';

const Compare: React.FC = () => {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [comparison, setComparison] = useState<ComparisonData | null>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url1.trim() || !url2.trim()) return;

    setLoading(true);
    setError('');
    setComparison(null);

    try {
      const result = await seoApi.compareUrls(url1, url2);
      setComparison(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to compare URLs. Please try again.');
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

  const getWinnerIcon = (winner: 'url1' | 'url2' | 'tie') => {
    switch (winner) {
      case 'url1':
        return <Trophy className="w-4 h-4 text-green-400" />;
      case 'url2':
        return <Trophy className="w-4 h-4 text-green-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getWinnerText = (winner: 'url1' | 'url2' | 'tie', url1: string, url2: string) => {
    switch (winner) {
      case 'url1':
        return `Winner: ${formatUrl(url1)}`;
      case 'url2':
        return `Winner: ${formatUrl(url2)}`;
      default:
        return 'Tie';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">URL Comparison</h1>
        <p className="text-dark-300 text-lg">
          Compare two websites side-by-side to identify strengths and weaknesses
        </p>
      </div>

      {/* URL Input Form */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <form onSubmit={handleCompare} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="url1" className="block text-sm font-medium text-dark-300 mb-2">
                First Website URL
              </label>
              <input
                type="url"
                id="url1"
                value={url1}
                onChange={(e) => setUrl1(e.target.value)}
                placeholder="https://example1.com"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="url2" className="block text-sm font-medium text-dark-300 mb-2">
                Second Website URL
              </label>
              <input
                type="url"
                id="url2"
                value={url2}
                onChange={(e) => setUrl2(e.target.value)}
                placeholder="https://example2.com"
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || !url1.trim() || !url2.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <BarChart3 className="w-5 h-5" />
              )}
              <span>{loading ? 'Comparing...' : 'Compare URLs'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Comparison Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-dark-300 mb-2">
                  <ExternalLink className="w-4 h-4" />
                  <a
                    href={comparison.url1.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    {formatUrl(comparison.url1.url)}
                  </a>
                </div>
                <div className="text-sm text-dark-400">
                  {new Date(comparison.url1.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-dark-300 mb-2">
                  <ExternalLink className="w-4 h-4" />
                  <a
                    href={comparison.url2.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                  >
                    {formatUrl(comparison.url2.url)}
                  </a>
                </div>
                <div className="text-sm text-dark-400">
                  {new Date(comparison.url2.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Overall Winner */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-white mb-2">
              {getWinnerIcon(comparison.winner.overall)}
              <span className="text-xl font-semibold">
                {getWinnerText(comparison.winner.overall, comparison.url1.url, comparison.url2.url)}
              </span>
            </div>
            <p className="text-green-100">
              {comparison.winner.overall === 'tie' 
                ? 'Both websites have similar overall SEO performance'
                : 'This website has the better overall SEO score'
              }
            </p>
          </div>

          {/* SEO Scores Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SEOScore 
              score={comparison.url1.score} 
              title={formatUrl(comparison.url1.url)}
            />
            <SEOScore 
              score={comparison.url2.score} 
              title={formatUrl(comparison.url2.url)}
            />
          </div>

          {/* Detailed Comparison */}
          <div className="space-y-6">
            {/* Metadata Comparison */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Metadata Comparison</h3>
                <div className="flex items-center space-x-2">
                  {getWinnerIcon(comparison.winner.metadata)}
                  <span className="text-sm text-dark-300">
                    {getWinnerText(comparison.winner.metadata, comparison.url1.url, comparison.url2.url)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-dark-300 text-sm mb-3">{formatUrl(comparison.url1.url)}</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-dark-400 mb-1">Title ({comparison.url1.metadata.titleLength} chars)</div>
                      <div className="bg-dark-700 rounded p-2 text-sm text-white">
                        {comparison.url1.metadata.title || 'No title'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-dark-400 mb-1">Description ({comparison.url1.metadata.descriptionLength} chars)</div>
                      <div className="bg-dark-700 rounded p-2 text-sm text-white">
                        {comparison.url1.metadata.description || 'No description'}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-dark-300 text-sm mb-3">{formatUrl(comparison.url2.url)}</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-dark-400 mb-1">Title ({comparison.url2.metadata.titleLength} chars)</div>
                      <div className="bg-dark-700 rounded p-2 text-sm text-white">
                        {comparison.url2.metadata.title || 'No title'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-dark-400 mb-1">Description ({comparison.url2.metadata.descriptionLength} chars)</div>
                      <div className="bg-dark-700 rounded p-2 text-sm text-white">
                        {comparison.url2.metadata.description || 'No description'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Comparison */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Links Comparison</h3>
                <div className="flex items-center space-x-2">
                  {getWinnerIcon(comparison.winner.links)}
                  <span className="text-sm text-dark-300">
                    {getWinnerText(comparison.winner.links, comparison.url1.url, comparison.url2.url)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-dark-300 text-sm mb-3">{formatUrl(comparison.url1.url)}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-dark-400">Internal</span>
                      <span className="text-white">{comparison.url1.links.internal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">External</span>
                      <span className="text-white">{comparison.url1.links.external}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Broken</span>
                      <span className={comparison.url1.links.broken > 0 ? 'text-red-400' : 'text-green-400'}>
                        {comparison.url1.links.broken}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-dark-300 text-sm mb-3">{formatUrl(comparison.url2.url)}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-dark-400">Internal</span>
                      <span className="text-white">{comparison.url2.links.internal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">External</span>
                      <span className="text-white">{comparison.url2.links.external}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">Broken</span>
                      <span className={comparison.url2.links.broken > 0 ? 'text-red-400' : 'text-green-400'}>
                        {comparison.url2.links.broken}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Comparison */}
            <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Performance Comparison</h3>
                <div className="flex items-center space-x-2">
                  {getWinnerIcon(comparison.winner.performance)}
                  <span className="text-sm text-dark-300">
                    {getWinnerText(comparison.winner.performance, comparison.url1.url, comparison.url2.url)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-dark-300 text-sm mb-3">{formatUrl(comparison.url1.url)}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-dark-400">Load Time</span>
                      <span className="text-white">{comparison.url1.performance.loadTime.toFixed(2)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">FCP</span>
                      <span className="text-white">{comparison.url1.performance.firstContentfulPaint.toFixed(2)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">LCP</span>
                      <span className="text-white">{comparison.url1.performance.largestContentfulPaint.toFixed(2)}s</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-dark-300 text-sm mb-3">{formatUrl(comparison.url2.url)}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-dark-400">Load Time</span>
                      <span className="text-white">{comparison.url2.performance.loadTime.toFixed(2)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">FCP</span>
                      <span className="text-white">{comparison.url2.performance.firstContentfulPaint.toFixed(2)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-400">LCP</span>
                      <span className="text-white">{comparison.url2.performance.largestContentfulPaint.toFixed(2)}s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
