import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: Date;
}

export const useRealTimeNotifications = () => {
  const { platformData, websiteData, newsData, isConnected } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [prevDataCounts, setPrevDataCounts] = useState({
    platform: 0,
    website: 0,
    news: 0
  });

  useEffect(() => {
    const currentCounts = {
      platform: platformData.length,
      website: websiteData.length,
      news: newsData.length
    };

    // Yeni veri eklenmesi durumunda bildirim göster
    if (currentCounts.platform > prevDataCounts.platform) {
      addNotification({
        id: Date.now().toString(),
        message: 'Yeni platform verisi eklendi',
        type: 'success',
        timestamp: new Date()
      });
    }

    if (currentCounts.website > prevDataCounts.website) {
      addNotification({
        id: Date.now().toString() + '_web',
        message: 'Yeni website verisi eklendi',
        type: 'success',
        timestamp: new Date()
      });
    }

    if (currentCounts.news > prevDataCounts.news) {
      addNotification({
        id: Date.now().toString() + '_news',
        message: 'Yeni haber verisi eklendi',
        type: 'success',
        timestamp: new Date()
      });
    }

    setPrevDataCounts(currentCounts);
  }, [platformData.length, websiteData.length, newsData.length]);

  // Bağlantı durumu değişikliklerini takip et
  useEffect(() => {
    if (!isConnected) {
      addNotification({
        id: 'connection_lost',
        message: 'Bağlantı kesildi - Veriler güncel olmayabilir',
        type: 'error',
        timestamp: new Date()
      });
    } else {
      // Bağlantı geri geldiğinde error bildirimini kaldır
      setNotifications(prev => prev.filter(n => n.id !== 'connection_lost'));
      
      addNotification({
        id: 'connection_restored',
        message: 'Bağlantı yeniden kuruldu',
        type: 'success',
        timestamp: new Date()
      });
    }
  }, [isConnected]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Son 5 bildirimi tut
    
    // 5 saniye sonra bildirimi otomatik kaldır
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
};