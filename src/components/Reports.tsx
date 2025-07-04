import React, { useState } from 'react';
import { Download, Filter, Calendar, TrendingUp, BarChart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Chart from './Chart';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports: React.FC = () => {
  const { platformData, websiteData, newsData } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({start: '', end: ''});
  const [scheduleType, setScheduleType] = useState('');

  const handleExportReport = () => {
    const reportData = {
      platformData,
      websiteData,
      newsData,
      generatedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `report_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const generateSummary = () => {
    const totalPlatforms = platformData.length;
    const totalFollowers = platformData.reduce((sum, data) => sum + data.metrics.followers, 0);
    const totalEngagement = platformData.reduce((sum, data) => sum + data.metrics.engagement, 0);
    const totalWebsiteVisitors = websiteData.reduce((sum, data) => sum + data.visitors, 0);
    const totalMentions = newsData.reduce((sum, data) => sum + data.mentions, 0);
    
    return {
      totalPlatforms,
      totalFollowers,
      totalEngagement,
      totalWebsiteVisitors,
      totalMentions,
      avgEngagementRate: totalFollowers > 0 ? (totalEngagement / totalFollowers * 100).toFixed(2) : 0,
    };
  };

  const summary = generateSummary();

  // Zamanlama filtre fonksiyonu
  function isInRange(date: Date, start: string, end: string) {
    if (!start && !end) return true;
    const d = date.getTime();
    const s = start ? new Date(start).getTime() : -Infinity;
    const e = end ? new Date(end).getTime() : Infinity;
    return d >= s && d <= e;
  }

  function getDate(val: any) {
    if (!val) return new Date();
    if (val instanceof Date) return val;
    if (typeof val === 'string' || typeof val === 'number') return new Date(val);
    return new Date();
  }

  // Filtreleme fonksiyonu
  const filteredPlatformData = platformData.filter((item) => {
    const itemDate = getDate(item.enteredAt);
    if (reportType !== 'all' && reportType !== 'platform') return false;
    if (selectedMonth && `${item.year}-${String(itemDate.getMonth() + 1).padStart(2, '0')}` !== selectedMonth) return false;
    if (scheduleType === 'weekly') {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      if (!isInRange(itemDate, weekAgo.toISOString().slice(0,10), now.toISOString().slice(0,10))) return false;
    }
    if (scheduleType === 'monthly') {
      const now = new Date();
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      if (!isInRange(itemDate, monthAgo.toISOString().slice(0,10), now.toISOString().slice(0,10))) return false;
    }
    if (scheduleType === 'quarterly') {
      const now = new Date();
      const quarterAgo = new Date(now);
      quarterAgo.setMonth(now.getMonth() - 3);
      if (!isInRange(itemDate, quarterAgo.toISOString().slice(0,10), now.toISOString().slice(0,10))) return false;
    }
    if (scheduleType === 'custom' && (dateRange.start || dateRange.end)) {
      if (!isInRange(itemDate, dateRange.start, dateRange.end)) return false;
    }
    return true;
  });
  const filteredWebsiteData = websiteData.filter((item) => {
    const itemDate = getDate(item.enteredAt);
    if (reportType !== 'all' && reportType !== 'website') return false;
    if (selectedMonth && `${item.year}-${String(itemDate.getMonth() + 1).padStart(2, '0')}` !== selectedMonth) return false;
    if (scheduleType === 'weekly') {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      if (!isInRange(itemDate, weekAgo.toISOString().slice(0,10), now.toISOString().slice(0,10))) return false;
    }
    if (scheduleType === 'monthly') {
      const now = new Date();
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      if (!isInRange(itemDate, monthAgo.toISOString().slice(0,10), now.toISOString().slice(0,10))) return false;
    }
    if (scheduleType === 'quarterly') {
      const now = new Date();
      const quarterAgo = new Date(now);
      quarterAgo.setMonth(now.getMonth() - 3);
      if (!isInRange(itemDate, quarterAgo.toISOString().slice(0,10), now.toISOString().slice(0,10))) return false;
    }
    if (scheduleType === 'custom' && (dateRange.start || dateRange.end)) {
      if (!isInRange(itemDate, dateRange.start, dateRange.end)) return false;
    }
    return true;
  });
  const filteredNewsData = newsData.filter((item) => {
    const itemDate = getDate(item.enteredAt);
    if (reportType !== 'all' && reportType !== 'news') return false;
    if (selectedMonth && `${item.year}-${String(itemDate.getMonth() + 1).padStart(2, '0')}` !== selectedMonth) return false;
    if (scheduleType === 'weekly') {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      if (!isInRange(itemDate, weekAgo.toISOString().slice(0,10), now.toISOString().slice(0,10))) return false;
    }
    if (scheduleType === 'monthly') {
      const now = new Date();
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      if (!isInRange(itemDate, monthAgo.toISOString().slice(0,10), now.toISOString().slice(0,10))) return false;
    }
    if (scheduleType === 'quarterly') {
      const now = new Date();
      const quarterAgo = new Date(now);
      quarterAgo.setMonth(now.getMonth() - 3);
      if (!isInRange(itemDate, quarterAgo.toISOString().slice(0,10), now.toISOString().slice(0,10))) return false;
    }
    if (scheduleType === 'custom' && (dateRange.start || dateRange.end)) {
      if (!isInRange(itemDate, dateRange.start, dateRange.end)) return false;
    }
    return true;
  });

  // Grafik verileri (örnek: platform bazlı takipçi sayısı ve dağılımı)
  const chartLabels = filteredPlatformData.map(p => `${p.platform} ${p.month}`);
  const chartFollowers = filteredPlatformData.map(p => p.metrics.followers);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Takipçi',
        data: chartFollowers,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };
  const pieLabels = [...new Set(filteredPlatformData.map(p => p.platform))];
  const pieDataArr = pieLabels.map(label => filteredPlatformData.filter(p => p.platform === label).reduce((sum, p) => sum + (p.metrics?.followers || 0), 0));
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieDataArr,
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

  // JSON dışa aktarma
  const handleExportJSON = () => {
    const data = {
      platformData: filteredPlatformData,
      websiteData: filteredWebsiteData,
      newsData: filteredNewsData,
      generatedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `rapor_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Excel dışa aktarma
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredPlatformData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Platform Verileri');
    XLSX.writeFile(wb, `rapor_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // PDF dışa aktarma
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Platform Verileri', 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [['Tarih', 'Platform', 'Metrik', 'Değer', 'Ekleyen']],
      body: filteredPlatformData.map(p => [
        `${p.month} ${p.year}`,
        p.platform,
        'Takipçi',
        p.metrics.followers,
        p.enteredBy
      ]),
    });
    doc.save(`rapor_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlar & Analizler</h1>
        <p className="text-gray-600">Verilerinizden kapsamlı raporlar oluşturun</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hızlı Özet</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Toplam Platform</span>
              <span className="font-semibold">{summary.totalPlatforms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Toplam Takipçi</span>
              <span className="font-semibold">{summary.totalFollowers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ortalama Etkileşim</span>
              <span className="font-semibold">{summary.avgEngagementRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
            <Filter className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rapor Türü
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Tüm Veriler</option>
                <option value="platform">Sosyal Medya</option>
                <option value="website">Web Sitesi</option>
                <option value="news">Haber Kapsamı</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ay
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dışa Aktarma Seçenekleri</h3>
            <Download className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <button
              onClick={handleExportJSON}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              JSON Aktar
            </button>
            <button onClick={handleExportPDF} className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
              PDF Aktar
            </button>
            <button onClick={handleExportExcel} className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
              Excel Aktar
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Zamanlama</h3>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm" onClick={() => setScheduleType('weekly')}>
              Haftalık Rapor
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm" onClick={() => setScheduleType('monthly')}>
              Aylık Rapor
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm" onClick={() => setScheduleType('quarterly')}>
              Üç Aylık Rapor
            </button>
            <div className="flex items-center space-x-2 mt-2">
              <input type="date" value={dateRange.start} onChange={e => setDateRange(r => ({...r, start: e.target.value}))} className="border rounded px-2 py-1 text-sm" />
              <span>-</span>
              <input type="date" value={dateRange.end} onChange={e => setDateRange(r => ({...r, end: e.target.value}))} className="border rounded px-2 py-1 text-sm" />
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={() => setScheduleType('custom')}>Uygula</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performansı</h3>
          <div className="space-y-4">
            {filteredPlatformData.map((platform) => (
              <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{platform.platform}</p>
                  <p className="text-sm text-gray-600">{platform.month} {platform.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{platform.metrics.followers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">takipçi</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Web Sitesi Analitiği</h3>
          <div className="space-y-4">
            {filteredWebsiteData.map((website) => (
              <div key={website.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Web Sitesi Trafiği</p>
                  <p className="text-sm text-gray-600">{website.month} {website.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{website.visitors.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">ziyaretçi</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Takipçi Eğilimi</h3>
          <Chart data={chartData} type="line" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Dağılımı</h3>
          <Chart data={pieData} type="pie" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detaylı Rapor</h3>
          <BarChart className="w-5 h-5 text-blue-500" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tarih</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Platform</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Metrik</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Değer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Ekleyen</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlatformData.map((platform) => (
                <tr key={platform.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">{platform.month} {platform.year}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{platform.platform}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Takipçi</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{platform.metrics.followers.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{platform.enteredBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;