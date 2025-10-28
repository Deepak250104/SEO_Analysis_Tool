import React from 'react';
import { Link } from 'react-router-dom';
import { Search, BarChart3, MapPin, Zap, Shield, Globe } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'SEO Analysis',
      description: 'Comprehensive SEO analysis with detailed scoring and recommendations.',
      link: '/analysis',
      color: 'bg-blue-600'
    },
    {
      icon: BarChart3,
      title: 'URL Comparison',
      description: 'Compare two websites side-by-side to identify strengths and weaknesses.',
      link: '/compare',
      color: 'bg-green-600'
    },
    {
      icon: MapPin,
      title: 'GEO Insights',
      description: 'Local SEO analysis with keyword research and rank tracking.',
      link: '/geo',
      color: 'bg-purple-600'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Page speed analysis using Google Lighthouse metrics.',
      link: '/analysis',
      color: 'bg-yellow-600'
    },
    {
      icon: Shield,
      title: 'Free & Open',
      description: 'Completely free to use with open-source code and free APIs.',
      link: '#',
      color: 'bg-red-600'
    },
    {
      icon: Globe,
      title: 'Responsive',
      description: 'Works perfectly on desktop, tablet, and mobile devices.',
      link: '#',
      color: 'bg-indigo-600'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Free SEO & GEO
          <span className="block text-blue-400">Analysis Tool</span>
        </h1>
        <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto">
          Analyze your website's SEO performance, compare with competitors, and get actionable insights 
          to improve your search rankings. All completely free and open source.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/analysis"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Start Analysis
          </Link>
          <Link
            to="/compare"
            className="bg-dark-700 hover:bg-dark-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors border border-dark-600"
          >
            Compare URLs
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-dark-600 transition-colors"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-dark-300 mb-4">{feature.description}</p>
              {feature.link !== '#' && (
                <Link
                  to={feature.link}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Learn more →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* How it works */}
      <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Enter URL</h3>
            <p className="text-dark-300">
              Simply enter the website URL you want to analyze or compare.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Analysis</h3>
            <p className="text-dark-300">
              Our tool analyzes metadata, content, links, and performance metrics.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Get Results</h3>
            <p className="text-dark-300">
              Receive detailed scores, recommendations, and actionable insights.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Improve Your SEO?
        </h2>
        <p className="text-blue-100 mb-6 text-lg">
          Start analyzing your website today and get actionable insights to boost your search rankings.
        </p>
        <Link
          to="/analysis"
          className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
        >
          Get Started Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
