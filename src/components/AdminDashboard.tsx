import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Globe, MessageSquare, Calendar, ArrowUpRight, 
  Wifi, WifiOff, Filter, Download, Eye, BarChart3, PieChart, 
  Clock, Award, UserCheck, Building, Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import MetricCard from './MetricCard';
import Chart from './Chart';
import { AdminSummary, FilterOptions } from '../types';

const AdminDashboard: React.FC = () => {
  const { platformData, websiteData, newsData, isConnected, lastUpdate, error } = useApp();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'staff' | 'analytics'>('overview');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    dateRange: {
      start: '',
      end: ''
    },
    platforms: [],
    staff: [],
    departments: [],
    dataTypes: ['platform', 'website', 'news']
  });

  const currentMonth = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

  // Admin özet bilgilerini hesapla
  const generateAdminSummary = (): AdminSummary => {
    const totalEntries = platformData.length + websiteData.length + newsData.length;
    
    // Benzersiz staff sayısı
    const allStaff = new Set([
      ...platformData.map(d => d.enteredBy),
      ...websiteData.map(d => d.enteredBy),
      ...newsData.map(d => d.enteredBy)
    ]);
    
    // Bu ay ki girişler
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthName = currentDate.toLocaleDateString('tr-TR', { month: 'long' });
    
    const thisMonthEntries = [
      ...platformData.filter(d => d.year === currentYear && d.month === currentMonthName),
      ...websiteData.filter(d => d.year === currentYear && d.month === currentMonthName),
      ...newsData.filter(d => d.year === currentYear && d.month === currentMonthName)
    ].length;

    // En çok giriş yapan personeller
    const staffEntries: { [key: string]: number } = {};
    [...platformData, ...websiteData, ...newsData].forEach(entry => {
      staffEntries[entry.enteredBy] = (staffEntries[entry.enteredBy] || 0) + 1;
    });

    const topPerformingStaff = Object.entries(staffEntries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, entries]) => ({ name, entries }));

    return {
      totalEntries,
      activeStaff: allStaff.size,
      thisMonthEntries,
      topPerformingStaff
    };
  };

  const adminSummary = generateAdminSummary();

  // Filtreleme fonksiyonu
  const getFilteredData = () => {
    let filteredPlatform = platformData;
    let filteredWebsite = websiteData;
    let filteredNews = newsData;

    if (filterOptions.staff.length > 0) {
      filteredPlatform = filteredPlatform.filter(d => filterOptions.staff.includes(d.enteredBy));
      filteredWebsite = filteredWebsite.filter(d => filterOptions.staff.includes(d.enteredBy));
      filteredNews = filteredNews.filter(d => filterOptions.staff.includes(d.enteredBy));
    }

    if (filterOptions.dateRange.start && filterOptions.dateRange.end) {
      const startDate = new Date(filterOptions.dateRange.start);
      const endDate = new Date(filterOptions.dateRange.end);
      
      filteredPlatform = filteredPlatform.filter(d => {
        const entryDate = new Date(d.enteredAt);
        return entryDate >= startDate && entryDate <= endDate;
      });
      
      filteredWebsite = filteredWebsite.filter(d => {
        const entryDate = new Date(d.enteredAt);
        return entryDate >= startDate && entryDate <= endDate;
      });
      
      filteredNews = filteredNews.filter(d => {
        const entryDate = new Date(d.enteredAt);
        return entryDate >= startDate && entryDate <= endDate;
      });
    }

    return { filteredPlatform, filteredWebsite, filteredNews };
  };

  const { filteredPlatform, filteredWebsite, filteredNews } = getFilteredData();

  const totalFollowers = filteredPlatform.reduce((sum, data) => sum + data.metrics.followers, 0);
  const totalEngagement = filteredPlatform.reduce((sum, data) => sum + data.metrics.engagement, 0);
  const totalVisitors = filteredWebsite.reduce((sum, data) => sum + data.visitors, 0);
  const totalMentions = filteredNews.reduce((sum, data) => sum + data.mentions, 0);

  // Benzersiz staff listesi
  const allStaffList = Array.from(new Set([
    ...platformData.map(d => d.enteredBy),
    ...websiteData.map(d => d.enteredBy),
    ...newsData.map(d => d.enteredBy)
  ]));

  // Veri değişikliklerinde loading state'ini güncelle
  useEffect(() => {
    setLoading(false);
  }, [platformData, websiteData, newsData]);

  const chartData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Platform Etkileşimi',
        data: [12000, 15000, 18000, 22000, 25000, 28000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Website Trafiği',
        data: [8000, 11000, 14000, 17000, 20000, 24000],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{currentMonth}</span>
              <span className="text-purple-600 font-medium">• Tüm Veriler</span>
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

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Genel Bakış</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'staff'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Personel Analizi</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <PieChart className="w-4 h-4" />
                <span>Detaylı Analitik</span>
              </div>
            </button>
          </nav>
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

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtreleme</span>
          </h3>
          <button
            onClick={() => setFilterOptions({
              dateRange: { start: '', end: '' },
              platforms: [],
              staff: [],
              departments: [],
              dataTypes: ['platform', 'website', 'news']
            })}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Filtreleri Temizle
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tarih Aralığı</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={filterOptions.dateRange.start}
                onChange={(e) => setFilterOptions(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="date"
                value={filterOptions.dateRange.end}
                onChange={(e) => setFilterOptions(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Personel</label>
            <select
              multiple
              value={filterOptions.staff}
              onChange={(e) => setFilterOptions(prev => ({
                ...prev,
                staff: Array.from(e.target.selectedOptions, option => option.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {allStaffList.map(staff => (
                <option key={staff} value={staff}>{staff}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Veri Türü</label>
            <div className="space-y-1">
              {[
                { key: 'platform', label: 'Platform Verileri' },
                { key: 'website', label: 'Website Verileri' },
                { key: 'news', label: 'Haber Verileri' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filterOptions.dataTypes.includes(key as any)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterOptions(prev => ({
                          ...prev,
                          dataTypes: [...prev.dataTypes, key as any]
                        }));
                      } else {
                        setFilterOptions(prev => ({
                          ...prev,
                          dataTypes: prev.dataTypes.filter(type => type !== key)
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Admin Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Toplam Girdi"
              value={adminSummary.totalEntries.toLocaleString()}
              change={`+${adminSummary.thisMonthEntries} bu ay`}
              icon={BarChart3}
              color="blue"
            />
            <MetricCard
              title="Aktif Personel"
              value={adminSummary.activeStaff.toString()}
              change="Toplam kayıtlı"
              icon={UserCheck}
              color="green"
            />
            <MetricCard
              title="Bu Ay Girdi"
              value={adminSummary.thisMonthEntries.toString()}
              change={`${Math.round((adminSummary.thisMonthEntries / adminSummary.totalEntries) * 100)}% toplam`}
              icon={Clock}
              color="purple"
            />
            <MetricCard
              title="En Aktif Personel"
              value={adminSummary.topPerformingStaff[0]?.name || 'Yok'}
              change={`${adminSummary.topPerformingStaff[0]?.entries || 0} girdi`}
              icon={Award}
              color="orange"
            />
          </div>

          {/* Main Metrics */}
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
              value={totalFollowers > 0 ? `${((totalEngagement / totalFollowers) * 100).toFixed(1)}%` : '0%'}
              change="+8.2%"
              icon={TrendingUp}
              color="purple"
            />
            <MetricCard
              title="Website Ziyaretçileri"
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
        </>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Performanslı Personeller</h3>
            <div className="space-y-3">
              {adminSummary.topPerformingStaff.map((staff, index) => (
                <div key={staff.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{staff.name}</p>
                      <p className="text-sm text-gray-500">{staff.entries} veri girişi</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(staff.entries / adminSummary.topPerformingStaff[0].entries) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round((staff.entries / adminSummary.totalEntries) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Veri Trend Analizi</h3>
            <Chart data={chartData} type="line" />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
            <div className="space-y-3">
              {[...filteredPlatform, ...filteredWebsite, ...filteredNews]
                .sort((a, b) => new Date(b.enteredAt).getTime() - new Date(a.enteredAt).getTime())
                .slice(0, 10)
                .map((entry, index) => (
                <div key={`${entry.id}-${index}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {entry.enteredBy} - {('platform' in entry) ? 'Platform' : ('visitors' in entry) ? 'Website' : 'Haber'} verisi
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.enteredAt).toLocaleDateString('tr-TR')} - {entry.month} {entry.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 