import React from 'react';
import { SEOScore as SEOScoreType } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SEOScoreProps {
  score: SEOScoreType;
  title?: string;
  showTrend?: boolean;
  previousScore?: SEOScoreType;
}

const SEOScore: React.FC<SEOScoreProps> = ({ 
  score, 
  title = "SEO Score", 
  showTrend = false, 
  previousScore 
}) => {
  const getScoreColor = (value: number) => {
    if (value >= 8) return 'text-green-400';
    if (value >= 6) return 'text-yellow-400';
    if (value >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (value: number) => {
    if (value >= 8) return 'bg-green-400/20';
    if (value >= 6) return 'bg-yellow-400/20';
    if (value >= 4) return 'bg-orange-400/20';
    return 'bg-red-400/20';
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return <Minus className="w-4 h-4 text-gray-400" />;
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendValue = (current: number, previous?: number) => {
    if (!previous) return null;
    const diff = current - previous;
    return diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
  };

  const scoreItems = [
    { key: 'overall', label: 'Overall', value: score.overall },
    { key: 'metadata', label: 'Metadata', value: score.metadata },
    { key: 'links', label: 'Links', value: score.links },
    { key: 'content', label: 'Content', value: score.content },
    { key: 'performance', label: 'Performance', value: score.performance },
  ];

  return (
    <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      <div className="space-y-4">
        {scoreItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-dark-300 text-sm font-medium">{item.label}</span>
              {showTrend && previousScore && (
                <div className="flex items-center space-x-1">
                  {getTrendIcon(item.value, previousScore[item.key as keyof SEOScoreType])}
                  <span className="text-xs text-dark-400">
                    {getTrendValue(item.value, previousScore[item.key as keyof SEOScoreType])}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-24 bg-dark-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getScoreBgColor(item.value)}`}
                  style={{ width: `${(item.value / 10) * 100}%` }}
                />
              </div>
              <span className={`text-sm font-bold w-8 ${getScoreColor(item.value)}`}>
                {item.value.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-dark-700">
        <div className="flex items-center justify-between">
          <span className="text-dark-300 text-sm">Overall Score</span>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">
              {score.overall.toFixed(1)}
            </div>
            <span className="text-dark-400 text-sm">/ 10</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOScore;
