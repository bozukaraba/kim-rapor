import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PlatformData, WebsiteData, NewsData } from '../types';
import { db, auth, onAuthStateChanged } from '../firebase';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

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
  firebaseUser: FirebaseUser | null;
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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [platformData, setPlatformData] = useState<PlatformData[]>([]);
  const [websiteData, setWebsiteData] = useState<WebsiteData[]>([]);
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry' | 'reports'>('dashboard');
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (!user) {
        setUser(null);
        setPlatformData([]);
        setWebsiteData([]);
        setNewsData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Initial data load
  useEffect(() => {
    // Geçici: Auth kontrolü olmadan veri yükle
    const loadInitialData = async () => {
      try {
        const platformSnapshot = await getDocs(collection(db, 'platformData'));
        setPlatformData(platformSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PlatformData[]);
        
        const websiteSnapshot = await getDocs(collection(db, 'websiteData'));
        setWebsiteData(websiteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WebsiteData[]);
        
        const newsSnapshot = await getDocs(collection(db, 'newsData'));
        setNewsData(newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsData[]);
        
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

  // Real-time updates
  useEffect(() => {
    // Geçici: Auth kontrolü olmadan real-time updates
    const unsubPlatform = onSnapshot(
      collection(db, 'platformData'),
      (snapshot) => {
        setPlatformData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PlatformData[]);
        setLastUpdate(new Date());
        setIsConnected(true);
        setError(null);
      },
      (error) => {
        console.error('Platform data error:', error);
        setIsConnected(false);
        setError('Platform verilerinde bağlantı hatası');
      }
    );
    
    const unsubWebsite = onSnapshot(
      collection(db, 'websiteData'),
      (snapshot) => {
        setWebsiteData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WebsiteData[]);
        setLastUpdate(new Date());
        setIsConnected(true);
        setError(null);
      },
      (error) => {
        console.error('Website data error:', error);
        setIsConnected(false);
        setError('Website verilerinde bağlantı hatası');
      }
    );
    
    const unsubNews = onSnapshot(
      collection(db, 'newsData'),
      (snapshot) => {
        setNewsData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsData[]);
        setLastUpdate(new Date());
        setIsConnected(true);
        setError(null);
      },
      (error) => {
        console.error('News data error:', error);
        setIsConnected(false);
        setError('Haber verilerinde bağlantı hatası');
      }
    );
    
    return () => {
      unsubPlatform();
      unsubWebsite();
      unsubNews();
    };
  }, []);

  const addPlatformData = async (data: Omit<PlatformData, 'id' | 'enteredAt'>) => {
    // Geçici: Auth kontrolü kaldırıldı
    // if (!firebaseUser) throw new Error('Kullanıcı girişi gerekli');
    
    await import('firebase/firestore').then(async ({ addDoc, collection }) => {
      await addDoc(collection(db, 'platformData'), {
        ...data,
        enteredAt: new Date(),
      });
    });
  };

  const addWebsiteData = async (data: Omit<WebsiteData, 'id' | 'enteredAt'>) => {
    // Geçici: Auth kontrolü kaldırıldı
    // if (!firebaseUser) throw new Error('Kullanıcı girişi gerekli');
    
    await import('firebase/firestore').then(async ({ addDoc, collection }) => {
      await addDoc(collection(db, 'websiteData'), {
        ...data,
        enteredAt: new Date(),
      });
    });
  };

  const addNewsData = async (data: Omit<NewsData, 'id' | 'enteredAt'>) => {
    // Geçici: Auth kontrolü kaldırıldı
    // if (!firebaseUser) throw new Error('Kullanıcı girişi gerekli');
    
    await import('firebase/firestore').then(async ({ addDoc, collection }) => {
      await addDoc(collection(db, 'newsData'), {
        ...data,
        enteredAt: new Date(),
      });
    });
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
    firebaseUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};