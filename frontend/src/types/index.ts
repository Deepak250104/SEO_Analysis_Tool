export interface SEOScore {
  overall: number;
  metadata: number;
  links: number;
  content: number;
  performance: number;
}

export interface SEOAnalysis {
  url: string;
  score: SEOScore;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    titleLength: number;
    descriptionLength: number;
  };
  links: {
    internal: number;
    external: number;
    broken: number;
    nofollow: number;
  };
  content: {
    wordCount: number;
    keywordDensity: Record<string, number>;
    headings: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
      h5: number;
      h6: number;
    };
    images: {
      total: number;
      withAlt: number;
      withoutAlt: number;
    };
  };
  performance: {
    loadTime: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
  };
  recommendations: string[];
  timestamp: string;
}

export interface GEOAnalysis {
  location: string;
  keywords: Array<{
    keyword: string;
    volume: number;
    difficulty: number;
    cpc: number;
  }>;
  localRankings: Array<{
    keyword: string;
    position: number;
    url: string;
  }>;
  reviews: {
    total: number;
    average: number;
    platforms: Record<string, number>;
  };
  nap: {
    name: string;
    address: string;
    phone: string;
    consistency: number;
  };
  recommendations: string[];
}

export interface ComparisonData {
  url1: SEOAnalysis;
  url2: SEOAnalysis;
  winner: {
    overall: 'url1' | 'url2' | 'tie';
    metadata: 'url1' | 'url2' | 'tie';
    links: 'url1' | 'url2' | 'tie';
    content: 'url1' | 'url2' | 'tie';
    performance: 'url1' | 'url2' | 'tie';
  };
}
