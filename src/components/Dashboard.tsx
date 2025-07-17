import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Globe, MessageSquare, Calendar, ArrowUpRight, Wifi, WifiOff, BarChart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MetricCard from './MetricCard';
import Chart from './Chart';

const Dashboard: React.FC = () => {
  const { platformData, websiteData, newsData, rpaData, isConnected, lastUpdate, error } = useApp();
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Veri değişikliklerinde loading state'ini güncelle
  useEffect(() => {
    setLoading(false);
  }, [platformData, websiteData, newsData, rpaData]);

  // Periyodik loading animasyonu (sadece görsel feedback)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isConnected]);
  
  const totalFollowers = platformData.reduce((sum, data) => sum + data.metrics.followers, 0);
  const totalEngagement = platformData.reduce((sum, data) => sum + data.metrics.engagement, 0);
  const totalVisitors = websiteData.reduce((sum, data) => sum + data.visitors, 0);
  const totalMentions = newsData.reduce((sum, data) => sum + data.mentions, 0);
  
  // RPA metrikleri
  const totalIncomingMails = rpaData.reduce((sum, data) => sum + data.totalIncomingMails, 0);
  const totalDistributedMails = rpaData.reduce((sum, data) => sum + data.totalDistributed, 0);
  const rpaEfficiencyRate = totalIncomingMails > 0 ? ((totalDistributedMails / totalIncomingMails) * 100).toFixed(1) : '0';

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Social Media Engagement',
        data: [12000, 15000, 18000, 22000, 25000, 28000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Website Traffic',
        data: [8000, 11000, 14000, 17000, 20000, 24000],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: ['Facebook', 'Instagram', 'LinkedIn', 'Twitter'],
    datasets: [
      {
        data: [30, 25, 25, 20],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Genel Bakış</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{currentMonth}</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Toplam Takipçi"
          value={totalFollowers.toLocaleString()}
          change="+12.5%"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Etkileşim Oranı"
          value={`${((totalEngagement / totalFollowers) * 100).toFixed(1)}%`}
          change="+8.2%"
          icon={TrendingUp}
          color="purple"
        />
        <MetricCard
          title="Web Sitesi Ziyaretçileri"
          value={totalVisitors.toLocaleString()}
          change="+15.3%"
          icon={Globe}
          color="green"
        />
        <MetricCard
          title="Medya Bahsi"
          value={totalMentions.toLocaleString()}
          change="+22.1%"
          icon={MessageSquare}
          color="orange"
        />
      </div>

      {/* RPA Rapor Metrikleri */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">RPA Rapor Metrikleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Toplam Gelen Mail"
            value={totalIncomingMails.toLocaleString()}
            change="+5.2%"
            icon={TrendingUp}
            color="orange"
          />
          <MetricCard
            title="Dağıtılan Mail"
            value={totalDistributedMails.toLocaleString()}
            change="+4.8%"
            icon={ArrowUpRight}
            color="blue"
          />
          <MetricCard
            title="Dağıtım Oranı"
            value={`${rpaEfficiencyRate}%`}
            change="+1.2%"
            icon={BarChart}
            color="green"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performans Eğilimleri</h3>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <Chart data={chartData} type="line" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Dağılımı</h3>
            <ArrowUpRight className="w-5 h-5 text-blue-500" />
          </div>
          <Chart data={pieData} type="pie" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Instagram data updated</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Website analytics processed</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Product Launch Campaign</p>
              <p className="text-xs text-gray-500">125K impressions</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Brand Awareness Video</p>
              <p className="text-xs text-gray-500">89K impressions</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              Aylık Rapor Oluştur
            </button>
            <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              Analitik Veriyi Dışa Aktar
            </button>
            <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              Rapor E-postası Zamanla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;