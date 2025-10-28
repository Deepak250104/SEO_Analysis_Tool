import React, { useState } from 'react';
import { MapPin, Loader2, AlertCircle, Search, TrendingUp, Star, Phone, Map } from 'lucide-react';
import { seoApi } from '../utils/api';
import { GEOAnalysis } from '../types';

const Geo: React.FC = () => {
  const [location, setLocation] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<GEOAnalysis | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !keywords.trim()) return;

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
      const result = await seoApi.getGeoAnalysis(location, keywordList);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">GEO Insights</h1>
        <p className="text-dark-300 text-lg">
          Analyze local SEO performance and get keyword insights for your location
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-dark-300 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, NY or San Francisco, CA"
                  className="w-full pl-10 bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-dark-300 mb-2">
                Keywords (comma-separated)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., pizza, restaurant, delivery"
                  className="w-full pl-10 bg-dark-700 border border-dark-600 rounded-lg px-4 py-3 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || !location.trim() || !keywords.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
              <span>{loading ? 'Analyzing...' : 'Analyze Location'}</span>
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

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  GEO Analysis Results
                </h2>
                <div className="flex items-center space-x-2 text-dark-300">
                  <MapPin className="w-4 h-4" />
                  <span>{analysis.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Keyword Analysis */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
              Keyword Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-600">
                    <th className="text-left text-dark-300 py-2">Keyword</th>
                    <th className="text-left text-dark-300 py-2">Search Volume</th>
                    <th className="text-left text-dark-300 py-2">Difficulty</th>
                    <th className="text-left text-dark-300 py-2">CPC</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.keywords.map((keyword, index) => (
                    <tr key={index} className="border-b border-dark-700">
                      <td className="py-3 text-white font-medium">{keyword.keyword}</td>
                      <td className="py-3 text-white">{keyword.volume.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          keyword.difficulty >= 70 ? 'bg-red-600/20 text-red-400' :
                          keyword.difficulty >= 40 ? 'bg-yellow-600/20 text-yellow-400' :
                          'bg-green-600/20 text-green-400'
                        }`}>
                          {keyword.difficulty}%
                        </span>
                      </td>
                      <td className="py-3 text-white">${keyword.cpc.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Local Rankings */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4">Local Rankings</h3>
            {analysis.localRankings.length > 0 ? (
              <div className="space-y-3">
                {analysis.localRankings.map((ranking, index) => (
                  <div key={index} className="flex items-center justify-between bg-dark-700 rounded p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {ranking.position}
                      </div>
                      <div>
                        <div className="text-white font-medium">{ranking.keyword}</div>
                        <div className="text-dark-400 text-sm">{ranking.url}</div>
                      </div>
                    </div>
                    <div className="text-dark-300 text-sm">
                      Position {ranking.position}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-dark-400">No local rankings data available.</p>
            )}
          </div>

          {/* Reviews Analysis */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              Reviews Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {analysis.reviews.total.toLocaleString()}
                </div>
                <div className="text-dark-300">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2 flex items-center justify-center">
                  <Star className="w-6 h-6 mr-1" />
                  {analysis.reviews.average.toFixed(1)}
                </div>
                <div className="text-dark-300">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {Object.keys(analysis.reviews.platforms).length}
                </div>
                <div className="text-dark-300">Platforms</div>
              </div>
            </div>
            
            {Object.keys(analysis.reviews.platforms).length > 0 && (
              <div className="mt-6">
                <h4 className="text-dark-300 text-sm mb-3">Reviews by Platform</h4>
                <div className="space-y-2">
                  {Object.entries(analysis.reviews.platforms).map(([platform, count]) => (
                    <div key={platform} className="flex justify-between items-center">
                      <span className="text-dark-400 capitalize">{platform}</span>
                      <span className="text-white">{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* NAP Consistency */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Phone className="w-5 h-5 text-green-400 mr-2" />
              NAP Consistency
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-dark-300">Consistency Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-dark-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${analysis.nap.consistency}%` }}
                    />
                  </div>
                  <span className="text-white font-semibold">{analysis.nap.consistency}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-dark-400 text-sm mb-1">Name</div>
                  <div className="text-white">{analysis.nap.name || 'Not found'}</div>
                </div>
                <div>
                  <div className="text-dark-400 text-sm mb-1">Address</div>
                  <div className="text-white">{analysis.nap.address || 'Not found'}</div>
                </div>
                <div>
                  <div className="text-dark-400 text-sm mb-1">Phone</div>
                  <div className="text-white">{analysis.nap.phone || 'Not found'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4">Local SEO Recommendations</h3>
            <div className="space-y-3">
              {analysis.recommendations.length > 0 ? (
                analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
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

export default Geo;
