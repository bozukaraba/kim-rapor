import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PlatformData, WebsiteData, NewsData } from '../types';

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

  useEffect(() => {
    // Load data from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedPlatformData = localStorage.getItem('platformData');
    const savedWebsiteData = localStorage.getItem('websiteData');
    const savedNewsData = localStorage.getItem('newsData');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedPlatformData) {
      setPlatformData(JSON.parse(savedPlatformData));
    }
    if (savedWebsiteData) {
      setWebsiteData(JSON.parse(savedWebsiteData));
    }
    if (savedNewsData) {
      setNewsData(JSON.parse(savedNewsData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('platformData', JSON.stringify(platformData));
  }, [platformData]);

  useEffect(() => {
    localStorage.setItem('websiteData', JSON.stringify(websiteData));
  }, [websiteData]);

  useEffect(() => {
    localStorage.setItem('newsData', JSON.stringify(newsData));
  }, [newsData]);

  const addPlatformData = (data: Omit<PlatformData, 'id' | 'enteredAt'>) => {
    const newData: PlatformData = {
      ...data,
      id: Date.now().toString(),
      enteredAt: new Date(),
    };
    setPlatformData(prev => [...prev, newData]);
  };

  const addWebsiteData = (data: Omit<WebsiteData, 'id' | 'enteredAt'>) => {
    const newData: WebsiteData = {
      ...data,
      id: Date.now().toString(),
      enteredAt: new Date(),
    };
    setWebsiteData(prev => [...prev, newData]);
  };

  const addNewsData = (data: Omit<NewsData, 'id' | 'enteredAt'>) => {
    const newData: NewsData = {
      ...data,
      id: Date.now().toString(),
      enteredAt: new Date(),
    };
    setNewsData(prev => [...prev, newData]);
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