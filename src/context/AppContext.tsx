import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PlatformData, WebsiteData, NewsData } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  platformData: PlatformData[];
  websiteData: WebsiteData[];
  newsData: NewsData[];
  addPlatformData: (data: Omit<PlatformData, 'id' | 'enteredAt'>) => void;
  addWebsiteData: (data: Omit<WebsiteData, 'id' | 'enteredAt'>) => void;
  addNewsData: (data: Omit<NewsData, 'id' | 'enteredAt'>) => void;
  currentView: 'dashboard' | 'entry' | 'reports';
  setCurrentView: (view: 'dashboard' | 'entry' | 'reports') => void;
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
  const [platformData, setPlatformData] = useState<PlatformData[]>([]);
  const [websiteData, setWebsiteData] = useState<WebsiteData[]>([]);
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'entry' | 'reports'>('dashboard');

  // LocalStorage'dan user bilgisini yükle
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('User parse error:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const unsubPlatform = onSnapshot(collection(db, 'platformData'), (snapshot) => {
      setPlatformData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PlatformData[]);
    }, (error) => {
      console.error('PlatformData error:', error);
    });
    const unsubWebsite = onSnapshot(collection(db, 'websiteData'), (snapshot) => {
      setWebsiteData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WebsiteData[]);
    }, (error) => {
      console.error('WebsiteData error:', error);
    });
    const unsubNews = onSnapshot(collection(db, 'newsData'), (snapshot) => {
      setNewsData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsData[]);
    }, (error) => {
      console.error('NewsData error:', error);
    });
    return () => {
      unsubPlatform();
      unsubWebsite();
      unsubNews();
    };
  }, []);

  const addPlatformData = async (data: Omit<PlatformData, 'id' | 'enteredAt'>) => {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      await addDoc(collection(db, 'platformData'), {
        ...data,
        enteredAt: new Date(),
      });
      console.log('Platform data saved successfully');
    } catch (error) {
      console.error('Error saving platform data:', error);
      throw error;
    }
  };

  const addWebsiteData = async (data: Omit<WebsiteData, 'id' | 'enteredAt'>) => {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      await addDoc(collection(db, 'websiteData'), {
        ...data,
        enteredAt: new Date(),
      });
      console.log('Website data saved successfully');
    } catch (error) {
      console.error('Error saving website data:', error);
      throw error;
    }
  };

  const addNewsData = async (data: Omit<NewsData, 'id' | 'enteredAt'>) => {
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      await addDoc(collection(db, 'newsData'), {
        ...data,
        enteredAt: new Date(),
      });
      console.log('News data saved successfully');
    } catch (error) {
      console.error('Error saving news data:', error);
      throw error;
    }
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};