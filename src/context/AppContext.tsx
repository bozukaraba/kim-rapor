import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PlatformData, WebsiteData, NewsData, RPAData } from '../types';
import { 
  auth,
  onAuthStateChange, 
  getPlatformData, 
  addPlatformData as firebaseAddPlatformData,
  getWebsiteData,
  addWebsiteData as firebaseAddWebsiteData,
  getNewsData,
  addNewsData as firebaseAddNewsData,
  getRPAData,
  addRPAData as firebaseAddRPAData,
  subscribeToPlatformData,
  subscribeToWebsiteData,
  subscribeToNewsData,
  subscribeToRPAData
} from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Data transformation functions
const convertFirebasePlatformData = (data: any[]): PlatformData[] => {
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
    enteredAt: item.enteredAt?.toDate ? item.enteredAt.toDate() : new Date(item.enteredAt),
  }));
};

const convertFirebaseWebsiteData = (data: any[]): WebsiteData[] => {
  return data.map(item => ({
    id: item.id,
    visitors: item.visitors || 0,
    pageViews: item.page_views || 0,
    bounceRate: parseFloat(item.bounce_rate || '0'),
    avgSessionDuration: parseFloat(item.avg_session_duration || '0'),
    conversions: item.conversions || 0,
    topPages: item.top_pages || [],
    month: item.month,
    year: item.year,
    enteredBy: item.entered_by,
    enteredAt: item.enteredAt?.toDate ? item.enteredAt.toDate() : new Date(item.enteredAt),
  }));
};

const convertFirebaseNewsData = (data: any[]): NewsData[] => {
  return data.map(item => ({
    id: item.id,
    mentions: item.mentions || 0,
    sentiment: item.sentiment as 'positive' | 'neutral' | 'negative',
    reach: item.reach || 0,
    topSources: item.top_sources || [],
    month: item.month,
    year: item.year,
    enteredBy: item.entered_by,
    enteredAt: item.enteredAt?.toDate ? item.enteredAt.toDate() : new Date(item.enteredAt),
  }));
};

const convertFirebaseRPAData = (data: any[]): RPAData[] => {
  return data.map(item => ({
    id: item.id,
    totalIncomingMails: item.total_incoming_mails || 0,
    totalDistributed: item.total_distributed || 0,
    topRedirectedUnits: {
      unit1: item.top_redirected_unit1 || '',
      unit2: item.top_redirected_unit2 || '',
      unit3: item.top_redirected_unit3 || '',
    },
    month: item.month,
    year: item.year,
    enteredBy: item.entered_by,
    enteredAt: item.enteredAt?.toDate ? item.enteredAt.toDate() : new Date(item.enteredAt),
  }));
};

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  platformData: PlatformData[];
  websiteData: WebsiteData[];
  newsData: NewsData[];
  rpaData: RPAData[];
  addPlatformData: (data: Omit<PlatformData, 'id' | 'enteredAt'>) => Promise<void>;
  addWebsiteData: (data: Omit<WebsiteData, 'id' | 'enteredAt'>) => Promise<void>;
  addNewsData: (data: Omit<NewsData, 'id' | 'enteredAt'>) => Promise<void>;
  addRPAData: (data: Omit<RPAData, 'id' | 'enteredAt'>) => Promise<void>;
  currentView: 'dashboard' | 'entry' | 'reports';
  setCurrentView: (view: 'dashboard' | 'entry' | 'reports') => void;
  isConnected: boolean;
  lastUpdate: Date;
  error: string | null;
  firebaseUser: any;
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

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [platformData, setPlatformData] = useState<PlatformData[]>([]);
  const [websiteData, setWebsiteData] = useState<WebsiteData[]>([]);
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [rpaData, setRpaData] = useState<RPAData[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry' | 'reports'>('dashboard');
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setUser({
          id: user.uid,
          name: user.displayName || user.email || 'User',
          email: user.email || '',
          role: 'staff', // Default role, can be fetched from Firestore
          department: 'Genel'
        });
      } else {
        setUser(null);
        setPlatformData([]);
        setWebsiteData([]);
        setNewsData([]);
        setRpaData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [platformResult, websiteResult, newsResult, rpaResult] = await Promise.all([
          getPlatformData(),
          getWebsiteData(),
          getNewsData(),
          getRPAData()
        ]);

        if (platformResult.error) throw platformResult.error;
        if (websiteResult.error) throw websiteResult.error;
        if (newsResult.error) throw newsResult.error;
        if (rpaResult.error) throw rpaResult.error;

        setPlatformData(convertFirebasePlatformData(platformResult.data || []));
        setWebsiteData(convertFirebaseWebsiteData(websiteResult.data || []));
        setNewsData(convertFirebaseNewsData(newsResult.data || []));
        setRpaData(convertFirebaseRPAData(rpaResult.data || []));
        
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
    const platformUnsubscribe = subscribeToPlatformData((payload) => {
      console.log('Platform data changed:', payload);
      getPlatformData().then(result => {
        if (result.data) {
          setPlatformData(convertFirebasePlatformData(result.data));
          setLastUpdate(new Date());
        }
      });
    });

    const websiteUnsubscribe = subscribeToWebsiteData((payload) => {
      console.log('Website data changed:', payload);
      getWebsiteData().then(result => {
        if (result.data) {
          setWebsiteData(convertFirebaseWebsiteData(result.data));
          setLastUpdate(new Date());
        }
      });
    });

    const newsUnsubscribe = subscribeToNewsData((payload) => {
      console.log('News data changed:', payload);
      getNewsData().then(result => {
        if (result.data) {
          setNewsData(convertFirebaseNewsData(result.data));
          setLastUpdate(new Date());
        }
      });
    });

    const rpaUnsubscribe = subscribeToRPAData((payload) => {
      console.log('RPA data changed:', payload);
      getRPAData().then(result => {
        if (result.data) {
          setRpaData(convertFirebaseRPAData(result.data));
          setLastUpdate(new Date());
        }
      });
    });

    return () => {
      platformUnsubscribe();
      websiteUnsubscribe();
      newsUnsubscribe();
      rpaUnsubscribe();
    };
  }, []);

  const addPlatformData = async (data: Omit<PlatformData, 'id' | 'enteredAt'>) => {
    const { error } = await firebaseAddPlatformData(data);
    if (error) throw error;
  };

  const addWebsiteData = async (data: Omit<WebsiteData, 'id' | 'enteredAt'>) => {
    const { error } = await firebaseAddWebsiteData(data);
    if (error) throw error;
  };

  const addNewsData = async (data: Omit<NewsData, 'id' | 'enteredAt'>) => {
    const { error } = await firebaseAddNewsData(data);
    if (error) throw error;
  };

  const addRPAData = async (data: Omit<RPAData, 'id' | 'enteredAt'>) => {
    const { error } = await firebaseAddRPAData(data);
    if (error) throw error;
  };

  const value = {
    user,
    setUser,
    platformData,
    websiteData,
    newsData,
    rpaData,
    addPlatformData,
    addWebsiteData,
    addNewsData,
    addRPAData,
    currentView,
    setCurrentView,
    isConnected,
    lastUpdate,
    error,
    firebaseUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};