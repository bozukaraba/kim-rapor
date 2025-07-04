import React from 'react';
import { TrendingUp, Users, Globe, MessageSquare, Calendar, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MetricCard from './MetricCard';
import Chart from './Chart';

const Dashboard: React.FC = () => {
  const { platformData, websiteData, newsData } = useApp();

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const totalFollowers = platformData.reduce((sum, data) => sum + data.metrics.followers, 0);
  const totalEngagement = platformData.reduce((sum, data) => sum + data.metrics.engagement, 0);
  const totalVisitors = websiteData.reduce((sum, data) => sum + data.visitors, 0);
  const totalMentions = newsData.reduce((sum, data) => sum + data.mentions, 0);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span>{currentMonth}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Followers"
          value={totalFollowers.toLocaleString()}
          change="+12.5%"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Engagement Rate"
          value={`${((totalEngagement / totalFollowers) * 100).toFixed(1)}%`}
          change="+8.2%"
          icon={TrendingUp}
          color="purple"
        />
        <MetricCard
          title="Website Visitors"
          value={totalVisitors.toLocaleString()}
          change="+15.3%"
          icon={Globe}
          color="green"
        />
        <MetricCard
          title="Media Mentions"
          value={totalMentions.toLocaleString()}
          change="+22.1%"
          icon={MessageSquare}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <Chart data={chartData} type="line" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Distribution</h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              Generate Monthly Report
            </button>
            <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              Export Analytics Data
            </button>
            <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              Schedule Report Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;