import React, { useState } from 'react';
import { Download, Filter, Calendar, TrendingUp, BarChart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Reports: React.FC = () => {
  const { platformData, websiteData, newsData } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [reportType, setReportType] = useState('all');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Generate comprehensive reports from your data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Summary</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Platforms</span>
              <span className="font-semibold">{summary.totalPlatforms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Followers</span>
              <span className="font-semibold">{summary.totalFollowers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Engagement</span>
              <span className="font-semibold">{summary.avgEngagementRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <Filter className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Data</option>
                <option value="platform">Social Media</option>
                <option value="website">Website</option>
                <option value="news">News Coverage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
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
            <h3 className="text-lg font-semibold text-gray-900">Export Options</h3>
            <Download className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <button
              onClick={handleExportReport}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Export JSON
            </button>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
              Export PDF
            </button>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
              Export Excel
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Weekly Report
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Monthly Report
            </button>
            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Quarterly Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
          <div className="space-y-4">
            {platformData.map((platform) => (
              <div key={platform.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{platform.platform}</p>
                  <p className="text-sm text-gray-600">{platform.month} {platform.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{platform.metrics.followers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">followers</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Website Analytics</h3>
          <div className="space-y-4">
            {websiteData.map((website) => (
              <div key={website.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Website Traffic</p>
                  <p className="text-sm text-gray-600">{website.month} {website.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{website.visitors.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">visitors</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Report</h3>
          <BarChart className="w-5 h-5 text-blue-500" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Platform</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Metric</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Entered By</th>
              </tr>
            </thead>
            <tbody>
              {platformData.map((platform) => (
                <tr key={platform.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">{platform.month} {platform.year}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{platform.platform}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Followers</td>
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