export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'analyst';
  department: string;
}

export interface PlatformData {
  id: string;
  platform: string;
  metrics: {
    followers: number;
    engagement: number;
    reach: number;
    impressions: number;
    clicks: number;
    conversions: number;
  };
  month: string;
  year: number;
  enteredBy: string;
  enteredAt: Date;
}

export interface WebsiteData {
  id: string;
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
  topPages: string[];
  month: string;
  year: number;
  enteredBy: string;
  enteredAt: Date;
}

export interface NewsData {
  id: string;
  mentions: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  reach: number;
  topSources: string[];
  month: string;
  year: number;
  enteredBy: string;
  enteredAt: Date;
}

export interface ReportData {
  platformData: PlatformData[];
  websiteData: WebsiteData[];
  newsData: NewsData[];
  generatedAt: Date;
  generatedBy: string;
}