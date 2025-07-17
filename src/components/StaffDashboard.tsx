import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Globe, MessageSquare, Calendar, ArrowUpRight, 
  Wifi, WifiOff, Plus, FileText, Award, Clock, CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import MetricCard from './MetricCard';
import Chart from './Chart';
import { StaffSummary } from '../types';

const StaffDashboard: React.FC = () => {
  const { user, platformData, websiteData, newsData, isConnected, lastUpdate, error, setCurrentView } = useApp();
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  // Personelin kendi verilerini filtrele
  const getMyData = () => {
    if (!user) return { myPlatform: [], myWebsite: [], myNews: [] };
    
    const myPlatform = platformData.filter(d => d.enteredBy === user.name);
    const myWebsite = websiteData.filter(d => d.enteredBy === user.name);
    const myNews = newsData.filter(d => d.enteredBy === user.name);
    
    return { myPlatform, myWebsite, myNews };
  };

  const { myPlatform, myWebsite, myNews } = getMyData();

  // Personel özet bilgilerini hesapla
  const generateStaffSummary = (): StaffSummary => {
    const myEntries = myPlatform.length + myWebsite.length + myNews.length;
    
    // Bu ay ki girişler
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthName = currentDate.toLocaleDateString('tr-TR', { month: 'long' });
    
    const thisMonthEntries = [
      ...myPlatform.filter(d => d.year === currentYear && d.month === currentMonthName),
      ...myWebsite.filter(d => d.year === currentYear && d.month === currentMonthName),
      ...myNews.filter(d => d.year === currentYear && d.month === currentMonthName)
    ].length;

    // Son giriş tarihi
    const allMyEntries = [...myPlatform, ...myWebsite, ...myNews];
    const lastEntry = allMyEntries.length > 0 
      ? allMyEntries.sort((a, b) => new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime())[0]
      : null;

    return {
      myEntries,
      thisMonthEntries,
      lastEntry: lastEntry ? new Date(lastEntry.enteredAt) : null
    };
  };

  const staffSummary = generateStaffSummary();

  // Kendi verilerinden hesaplamalar
  const myTotalFollowers = myPlatform.reduce((sum, data) => sum + data.metrics.followers, 0);
  const myTotalEngagement = myPlatform.reduce((sum, data) => sum + data.metrics.engagement, 0);
  const myTotalVisitors = myWebsite.reduce((sum, data) => sum + data.visitors, 0);
  const myTotalMentions = myNews.reduce((sum, data) => sum + data.mentions, 0);

  // Veri değişikliklerinde loading state'ini güncelle
  useEffect(() => {
    setLoading(false);
  }, [platformData, websiteData, newsData]);

  // Aylık performans chart'ı
  const getMonthlyPerformance = () => {
    const monthlyData: { [key: string]: number } = {};
    
    [...myPlatform, ...myWebsite, ...myNews].forEach(entry => {
      const key = `${entry.month} ${entry.year}`;
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
    });

    return {
      labels: sortedMonths.slice(-6), // Son 6 ay
      datasets: [{
        label: 'Aylık Veri Girişlerim',
        data: sortedMonths.slice(-6).map(month => monthlyData[month] || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  };

  const monthlyChart = getMonthlyPerformance();

  // Hedef belirleme (örnek olarak aylık 10 giriş)
  const monthlyTarget = 10;
  const targetProgress = Math.min((staffSummary.thisMonthEntries / monthlyTarget) * 100, 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hoş Geldiniz, {user?.name} 👋
            </h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{currentMonth}</span>
              <span className="text-green-600 font-medium">• Kişisel Panel</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
               isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
             }`}>
               {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
               <span className={isConnected ? 'live-indicator' : ''}>
                 {isConnected ? 'Canlı' : 'Bağlantı Kesildi'}
               </span>
             </div>
            <div className="text-sm text-gray-500">
              Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
            </div>
            {loading && (
               <div className="spinner h-6 w-6"></div>
             )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WifiOff className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hızlı Aksiyonlar */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Hızlı Veri Girişi</h2>
            <p className="opacity-90">Platform, website veya haber verilerini hızlıca ekleyin</p>
          </div>
          <button
            onClick={() => setCurrentView('entry')}
            className="bg-white text-green-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Veri Ekle</span>
          </button>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Toplam Girişlerim"
          value={staffSummary.myEntries.toString()}
          change={staffSummary.lastEntry ? `Son: ${staffSummary.lastEntry.toLocaleDateString('tr-TR')}` : 'Henüz giriş yok'}
          icon={FileText}
          color="blue"
        />
        <MetricCard
          title="Bu Ay Girişlerim"
          value={staffSummary.thisMonthEntries.toString()}
          change={`Hedef: ${monthlyTarget}`}
          icon={Clock}
          color="green"
        />
        <MetricCard
          title="Aylık Hedef"
          value={`%${Math.round(targetProgress)}`}
          change={`${staffSummary.thisMonthEntries}/${monthlyTarget} giriş`}
          icon={Award}
          color="purple"
        />
        <MetricCard
          title="Performans"
          value={targetProgress >= 100 ? "Mükemmel!" : targetProgress >= 70 ? "İyi" : "Geliştirebilir"}
          change={targetProgress >= 100 ? "Hedefi aştı" : `${monthlyTarget - staffSummary.thisMonthEntries} giriş kaldı`}
          icon={CheckCircle}
          color="orange"
        />
      </div>

      {/* Hedef İlerleme Çubuğu */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Aylık Hedef İlerlemesi</h3>
          <span className="text-sm text-gray-500">{staffSummary.thisMonthEntries}/{monthlyTarget} giriş</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className={`h-4 rounded-full transition-all duration-500 ${
              targetProgress >= 100 ? 'bg-green-500' : targetProgress >= 70 ? 'bg-blue-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.min(targetProgress, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span className="font-medium">{Math.round(targetProgress)}% tamamlandı</span>
          <span>{monthlyTarget}</span>
        </div>
      </div>

      {/* Kişisel Metrikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Benim Takipçi Verim"
          value={myTotalFollowers.toLocaleString()}
          change={`${myPlatform.length} platform girişi`}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Benim Etkileşim Verim"
          value={myTotalEngagement.toLocaleString()}
          change={myTotalFollowers > 0 ? `%${((myTotalEngagement / myTotalFollowers) * 100).toFixed(1)} oran` : 'Veri yok'}
          icon={TrendingUp}
          color="purple"
        />
        <MetricCard
          title="Benim Website Verim"
          value={myTotalVisitors.toLocaleString()}
          change={`${myWebsite.length} website girişi`}
          icon={Globe}
          color="green"
        />
        <MetricCard
          title="Benim Haber Verim"
          value={myTotalMentions.toLocaleString()}
          change={`${myNews.length} haber girişi`}
          icon={MessageSquare}
          color="orange"
        />
      </div>

      {/* İki Kolon Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aylık Performans Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Performansım</h3>
          {monthlyChart.labels.length > 0 ? (
            <Chart data={monthlyChart} type="line" />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Henüz veri girişi yapılmamış</p>
                <button
                  onClick={() => setCurrentView('entry')}
                  className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  İlk verini ekle →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Son Aktivitelerim */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Girişlerim</h3>
          <div className="space-y-3">
            {[...myPlatform, ...myWebsite, ...myNews]
              .sort((a, b) => new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime())
              .slice(0, 8)
              .map((entry, index) => (
              <div key={`${entry.id}-${index}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${ 
                  ('platform' in entry) ? 'bg-blue-500' : 
                  ('visitors' in entry) ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {('platform' in entry) ? `${entry.platform} - Platform` : 
                     ('visitors' in entry) ? 'Website Analytics' : 
                     'Haber Verileri'} verisi
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.enteredAt).toLocaleDateString('tr-TR')} - {entry.month} {entry.year}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {('platform' in entry) ? `${entry.metrics.followers.toLocaleString()} takipçi` :
                   ('visitors' in entry) ? `${entry.visitors.toLocaleString()} ziyaretçi` :
                   `${entry.mentions} bahis`}
                </div>
              </div>
            ))}
            
            {[...myPlatform, ...myWebsite, ...myNews].length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Henüz veri girişi yapmadınız</p>
                <button
                  onClick={() => setCurrentView('entry')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  İlk verini ekle →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* İpuçları ve Yardım */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 İpuçları</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-1">🎯 Aylık hedefinizi takip edin</p>
            <p>Düzenli veri girişi yaparak hedefinizi aşmaya çalışın</p>
          </div>
          <div>
            <p className="font-medium mb-1">📊 Veri kalitesine dikkat edin</p>
            <p>Doğru ve eksiksiz veriler daha iyi analizler sağlar</p>
          </div>
          <div>
            <p className="font-medium mb-1">⏰ Zamanında giriş yapın</p>
            <p>Verileri mümkün olduğunca güncel tutmaya çalışın</p>
          </div>
          <div>
            <p className="font-medium mb-1">🔄 Tutarlı olun</p>
            <p>Her ay düzenli veri girişi yaparak trend oluşturun</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard; 