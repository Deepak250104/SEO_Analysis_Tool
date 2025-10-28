import axios from 'axios';
import { SEOAnalysis, GEOAnalysis, ComparisonData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const seoApi = {
  analyzeUrl: async (url: string): Promise<SEOAnalysis> => {
    const response = await api.post('/seo/analyze', { url });
    return response.data;
  },

  compareUrls: async (url1: string, url2: string): Promise<ComparisonData> => {
    const response = await api.post('/seo/compare', { url1, url2 });
    return response.data;
  },

  getGeoAnalysis: async (location: string, keywords: string[]): Promise<GEOAnalysis> => {
    const response = await api.post('/geo/analyze', { location, keywords });
    return response.data;
  },

  getKeywordSuggestions: async (seed: string): Promise<string[]> => {
    const response = await api.get(`/keywords/suggestions?seed=${encodeURIComponent(seed)}`);
    return response.data;
  },

  getPerformanceMetrics: async (url: string): Promise<any> => {
    const response = await api.post('/performance/analyze', { url });
    return response.data;
  }
};

export default api;
