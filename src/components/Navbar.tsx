import React from 'react';
import { BarChart3, Database, FileText, User, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { user, setUser, currentView, setCurrentView } = useApp();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ReportHub</span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Panel</span>
              </button>
              
              <button
                onClick={() => setCurrentView('entry')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === 'entry' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Veri Girişi</span>
              </button>
              
              <button
                onClick={() => setCurrentView('reports')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === 'reports' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Raporlar</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;