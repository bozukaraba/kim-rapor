export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff'; // Sadece admin ve staff rolleri
  department: string;
  created_at?: Date;
  updated_at?: Date;
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
  userId?: string; // Hangi personelin girdiğini takip için
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
  userId?: string; // Hangi personelin girdiğini takip için
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
  userId?: string; // Hangi personelin girdiğini takip için
}

export interface RPAData {
  id: string;
  totalIncomingMails: number; // Gelen Toplam Mail
  totalDistributed: number; // Toplam Dağıtılan
  topRedirectedUnits: {
    unit1: string; // En Çok Yönlendirme Yapılan 1. Birim
    unit2: string; // En Çok Yönlendirme Yapılan 2. Birim
    unit3: string; // En Çok Yönlendirme Yapılan 3. Birim
  };
  month: string;
  year: number;
  enteredBy: string;
  enteredAt: Date;
  userId?: string; // Hangi personelin girdiğini takip için
}

export interface ReportData {
  platformData: PlatformData[];
  websiteData: WebsiteData[];
  newsData: NewsData[];
  rpaData: RPAData[];
  generatedAt: Date;
  generatedBy: string;
}

// Admin için gelişmiş filtreleme
export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  platforms: string[];
  staff: string[];
  departments: string[];
  dataTypes: ('platform' | 'website' | 'news' | 'rpa')[];
}

// Admin dashboard için özet bilgiler
export interface AdminSummary {
  totalEntries: number;
  activeStaff: number;
  thisMonthEntries: number;
  topPerformingStaff: {
    name: string;
    entries: number;
  }[];
}

// Staff dashboard için kısıtlı bilgiler
export interface StaffSummary {
  myEntries: number;
  thisMonthEntries: number;
  lastEntry: Date | null;
}