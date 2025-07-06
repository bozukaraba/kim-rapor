import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PlatformData, WebsiteData, NewsData } from '../types';
import { 
  supabase, 
  onAuthStateChange, 
  getPlatformData, 
  addPlatformData as supabaseAddPlatformData,
  getWebsiteData,
  addWebsiteData as supabaseAddWebsiteData,
  getNewsData,
  addNewsData as supabaseAddNewsData,
  subscribeToPlatformData,
  subscribeToWebsiteData,
  subscribeToNewsData
} from '../supabase';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  platformData: PlatformData[];
  websiteData: WebsiteData[];
  newsData: NewsData[];
  addPlatformData: (data: Omit<PlatformData, 'id' | 'enteredAt'>) => Promise<void>;
  addWebsiteData: (data: Omit<WebsiteData, 'id' | 'enteredAt'>) => Promise<void>;
  addNewsData: (data: Omit<NewsData, 'id' | 'enteredAt'>) => Promise<void>;
  currentView: 'dashboard' | 'entry' | 'reports';
  setCurrentView: (view: 'dashboard' | 'entry' | 'reports') => void;
  isConnected: boolean;
  lastUpdate: Date;
  error: string | null;
  supabaseUser: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

// Supabase verisini TypeScript tipine dönüştürme fonksiyonları
const convertSupabasePlatformData = (data: any[]): PlatformData[] => {
  return data.map(item => ({
    id: item.id,
    platform: item.platform,
    metrics: {
      followers: item.metrics_followers || 0,
      engagement: item.metrics_engagement || 0,
      reach: item.metrics_reach || 0,
      impressions: item.metrics_impressions || 0,
      clicks: item.metrics_clicks || 0,
      conversions: item.metrics_conversions || 0,
    },
    month: item.month,
    year: item.year,
    enteredBy: item.entered_by,
    enteredAt: new Date(item.entered_at)
  }));
};

const convertSupabaseWebsiteData = (data: any[]): WebsiteData[] => {
  return data.map(item => ({
    id: item.id,
    visitors: item.visitors,
    pageViews: item.page_views,
    bounceRate: item.bounce_rate,
    avgSessionDuration: item.avg_session_duration,
    conversions: item.conversions,
    topPages: item.top_pages || [],
    month: item.month,
    year: item.year,
    enteredBy: item.entered_by,
    enteredAt: new Date(item.entered_at)
  }));
};

const convertSupabaseNewsData = (data: any[]): NewsData[] => {
  return data.map(item => ({
    id: item.id,
    mentions: item.mentions,
    sentiment: item.sentiment,
    reach: item.reach,
    topSources: item.top_sources || [],
    month: item.month,
    year: item.year,
    enteredBy: item.entered_by,
    enteredAt: new Date(item.entered_at)
  }));
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [platformData, setPlatformData] = useState<PlatformData[]>([]);
  const [websiteData, setWebsiteData] = useState<WebsiteData[]>([]);
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry' | 'reports'>('dashboard');
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  // Supabase Auth state listener
  useEffect(() => {
    // Geçici: Demo modu için auth kontrolü devre dışı
    /*
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setSupabaseUser(session?.user || null);
      if (!session?.user) {
        setUser(null);
        setPlatformData([]);
        setWebsiteData([]);
        setNewsData([]);
      }
    });

    return () => subscription.unsubscribe();
    */
  }, []);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [platformResult, websiteResult, newsResult] = await Promise.all([
          getPlatformData(),
          getWebsiteData(),
          getNewsData()
        ]);

        if (platformResult.error) throw platformResult.error;
        if (websiteResult.error) throw websiteResult.error;
        if (newsResult.error) throw newsResult.error;

        setPlatformData(convertSupabasePlatformData(platformResult.data || []));
        setWebsiteData(convertSupabaseWebsiteData(websiteResult.data || []));
        setNewsData(convertSupabaseNewsData(newsResult.data || []));
        
        setLastUpdate(new Date());
        setIsConnected(true);
        setError(null);
      } catch (error) {
        console.error('Initial data load error:', error);
        setIsConnected(false);
        setError('Veri yüklenirken hata oluştu');
      }
    };

    loadInitialData();
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const platformSub = subscribeToPlatformData((payload) => {
      console.log('Platform data changed:', payload);
      // Veri değişikliği olduğunda yeniden yükle
      getPlatformData().then(result => {
        if (result.data) {
          setPlatformData(convertSupabasePlatformData(result.data));
          setLastUpdate(new Date());
        }
      });
    });

    const websiteSub = subscribeToWebsiteData((payload) => {
      console.log('Website data changed:', payload);
      getWebsiteData().then(result => {
        if (result.data) {
          setWebsiteData(convertSupabaseWebsiteData(result.data));
          setLastUpdate(new Date());
        }
      });
    });

    const newsSub = subscribeToNewsData((payload) => {
      console.log('News data changed:', payload);
      getNewsData().then(result => {
        if (result.data) {
          setNewsData(convertSupabaseNewsData(result.data));
          setLastUpdate(new Date());
        }
      });
    });

    return () => {
      supabase.removeChannel(platformSub);
      supabase.removeChannel(websiteSub);
      supabase.removeChannel(newsSub);
    };
  }, []);

  const addPlatformData = async (data: Omit<PlatformData, 'id' | 'enteredAt'>) => {
    const { error } = await supabaseAddPlatformData(data);
    if (error) throw error;
  };

  const addWebsiteData = async (data: Omit<WebsiteData, 'id' | 'enteredAt'>) => {
    const { error } = await supabaseAddWebsiteData(data);
    if (error) throw error;
  };

  const addNewsData = async (data: Omit<NewsData, 'id' | 'enteredAt'>) => {
    const { error } = await supabaseAddNewsData(data);
    if (error) throw error;
  };

  const value = {
    user,
    setUser,
    platformData,
    websiteData,
    newsData,
    addPlatformData,
    addWebsiteData,
    addNewsData,
    currentView,
    setCurrentView,
    isConnected,
    lastUpdate,
    error,
    supabaseUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};