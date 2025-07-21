import React, { useState } from 'react';
import { Filter, TrendingUp, BarChart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Chart from './Chart';

const Reports: React.FC = () => {
  const { user, platformData, websiteData, newsData, rpaData } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [reportType, setReportType] = useState('all');

  // Role'e göre veri filtreleme
  const getFilteredDataByRole = () => {
    if (user?.role === 'admin') {
      // Admin tüm verileri görebilir
      return { platformData, websiteData, newsData, rpaData };
    } else {
      // Staff sadece kendi verilerini görebilir
      return {
        platformData: platformData.filter(d => d.enteredBy === user?.name),
        websiteData: websiteData.filter(d => d.enteredBy === user?.name),
        newsData: newsData.filter(d => d.enteredBy === user?.name),
        rpaData: rpaData.filter(d => d.enteredBy === user?.name)
      };
    }
  };

  const { platformData: roleFilteredPlatform, websiteData: roleFilteredWebsite, newsData: roleFilteredNews, rpaData: roleFilteredRPA } = getFilteredDataByRole();

  // Basit filtreleme fonksiyonu
  const filteredPlatformData = roleFilteredPlatform.filter((item) => {
    if (reportType !== 'all' && reportType !== 'platform') return false;
    if (selectedMonth && `${item.year}-${String(new Date(item.enteredAt).getMonth() + 1).padStart(2, '0')}` !== selectedMonth) return false;
    return true;
  });

  const filteredWebsiteData = roleFilteredWebsite.filter((item) => {
    if (reportType !== 'all' && reportType !== 'website') return false;
    if (selectedMonth && `${item.year}-${String(new Date(item.enteredAt).getMonth() + 1).padStart(2, '0')}` !== selectedMonth) return false;
    return true;
  });

  const filteredNewsData = roleFilteredNews.filter((item) => {
    if (reportType !== 'all' && reportType !== 'news') return false;
    if (selectedMonth && `${item.year}-${String(new Date(item.enteredAt).getMonth() + 1).padStart(2, '0')}` !== selectedMonth) return false;
    return true;
  });

  const filteredRPAData = roleFilteredRPA.filter((item) => {
    if (reportType !== 'all' && reportType !== 'rpa') return false;
    if (selectedMonth && `${item.year}-${String(new Date(item.enteredAt).getMonth() + 1).padStart(2, '0')}` !== selectedMonth) return false;
    return true;
  });

  // Platform Takipçi Grafiği
  const platformChart = {
    labels: filteredPlatformData.map(p => `${p.platform} (${p.month})`),
    datasets: [
      {
        label: 'Takipçi Sayısı',
        data: filteredPlatformData.map(p => p.metrics.followers),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
    ],
  };

  // Platform Dağılım Grafiği
  const platformNames = [...new Set(filteredPlatformData.map(p => p.platform))];
  const platformDistribution = {
    labels: platformNames,
    datasets: [
      {
        data: platformNames.map(name => 
          filteredPlatformData.filter(p => p.platform === name)
            .reduce((sum, p) => sum + p.metrics.followers, 0)
        ),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Website Ziyaretçi Grafiği
  const websiteChart = {
    labels: filteredWebsiteData.map(w => `${w.month} ${w.year}`),
    datasets: [
      {
        label: 'Ziyaretçi Sayısı',
        data: filteredWebsiteData.map(w => w.visitors),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
    ],
  };

  // RPA Mail Grafiği
  const rpaChart = {
    labels: filteredRPAData.map(r => `${r.month} ${r.year}`),
    datasets: [
      {
        label: 'Gelen Mail',
        data: filteredRPAData.map(r => r.totalIncomingMails),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Dağıtılan Mail',
        data: filteredRPAData.map(r => r.totalDistributed),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {user?.role === 'admin' ? 'Grafik Raporlar' : 'Raporlarım'}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'admin' 
            ? 'Tüm verilerden grafik raporları' 
            : 'Kendi verilerinizden grafik raporları'
          }
        </p>
      </div>

      {/* Basit Filtreler */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
          <Filter className="w-5 h-5 text-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rapor Türü
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Veriler</option>
              <option value="platform">Sosyal Medya</option>
              <option value="website">Web Sitesi</option>
              <option value="news">Haber Kapsamı</option>
              <option value="rpa">RPA Rapor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ay Seçimi
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Platform Grafikleri */}
      {(reportType === 'all' || reportType === 'platform') && filteredPlatformData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Platform Takipçi Eğilimi</h3>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <Chart data={platformChart} type="line" />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Platform Dağılımı</h3>
              <BarChart className="w-5 h-5 text-purple-500" />
            </div>
            <Chart data={platformDistribution} type="pie" />
          </div>
        </div>
      )}

      {/* Website Grafikleri */}
      {(reportType === 'all' || reportType === 'website') && filteredWebsiteData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Website Ziyaretçi Eğilimi</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <Chart data={websiteChart} type="line" />
        </div>
      )}

      {/* RPA Grafikleri */}
      {(reportType === 'all' || reportType === 'rpa') && filteredRPAData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">RPA Mail İstatistikleri</h3>
            <BarChart className="w-5 h-5 text-orange-500" />
          </div>
          <Chart data={rpaChart} type="line" />
        </div>
      )}

      {/* Veri Yok Mesajı */}
      {((reportType === 'platform' && filteredPlatformData.length === 0) ||
        (reportType === 'website' && filteredWebsiteData.length === 0) ||
        (reportType === 'news' && filteredNewsData.length === 0) ||
        (reportType === 'rpa' && filteredRPAData.length === 0) ||
        (reportType === 'all' && filteredPlatformData.length === 0 && filteredWebsiteData.length === 0 && filteredNewsData.length === 0 && filteredRPAData.length === 0)) && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-gray-500">
            <BarChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Gösterilecek veri bulunamadı</h3>
            <p>Seçilen filtreler için henüz veri girişi yapılmamış.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;