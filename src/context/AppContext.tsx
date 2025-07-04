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
  addPlatformData: (data: Omit<PlatformData, 'id' | 'enteredAt'>) => Promise<void>;
  addWebsiteData: (data: Omit<WebsiteData, 'id' | 'enteredAt'>) => Promise<void>;
  addNewsData: (data: Omit<NewsData, 'id' | 'enteredAt'>) => Promise<void>;
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

  useEffect(() => {
    const unsubPlatform = onSnapshot(collection(db, 'platformData'), (snapshot) => {
      setPlatformData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PlatformData[]);
    });
    const unsubWebsite = onSnapshot(collection(db, 'websiteData'), (snapshot) => {
      setWebsiteData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as WebsiteData[]);
    });
    const unsubNews = onSnapshot(collection(db, 'newsData'), (snapshot) => {
      setNewsData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsData[]);
    });
    return () => {
      unsubPlatform();
      unsubWebsite();
      unsubNews();
    };
  }, []);

  const addPlatformData = async (data: Omit<PlatformData, 'id' | 'enteredAt'>) => {
    await import('firebase/firestore').then(async ({ addDoc, collection, serverTimestamp }) => {
      await addDoc(collection(db, 'platformData'), {
        ...data,
        enteredAt: new Date(),
      });
    });
  };

  const addWebsiteData = async (data: Omit<WebsiteData, 'id' | 'enteredAt'>) => {
    await import('firebase/firestore').then(async ({ addDoc, collection, serverTimestamp }) => {
      await addDoc(collection(db, 'websiteData'), {
        ...data,
        enteredAt: new Date(),
      });
    });
  };

  const addNewsData = async (data: Omit<NewsData, 'id' | 'enteredAt'>) => {
    await import('firebase/firestore').then(async ({ addDoc, collection, serverTimestamp }) => {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};