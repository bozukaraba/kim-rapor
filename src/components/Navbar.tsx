import React from 'react';
import { BarChart3, Database, FileText, User, LogOut, Shield, Users, Home, Plus, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import logo from '../loog.png';

const Navbar: React.FC = () => {
  const { user, setUser, currentView, setCurrentView } = useApp();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) return null;

  // Role'e göre farklı menü öğeleri
  const getMenuItems = () => {
    if (user.role === 'admin') {
      return [
        {
          key: 'dashboard',
          label: 'Admin Panel',
          icon: Shield,
          description: 'Tüm veriler ve analitik'
        },
        {
          key: 'entry',
          label: 'Veri Girişi',
          icon: Plus,
          description: 'Yeni veri ekle'
        },
        {
          key: 'reports',
          label: 'Raporlar',
          icon: FileText,
          description: 'Detaylı raporlar'
        }
      ];
    } else {
      return [
        {
          key: 'dashboard',
          label: 'Panelim',
          icon: Home,
          description: 'Kişisel dashboard'
        },
        {
          key: 'entry',
          label: 'Veri Girişi',
          icon: Database,
          description: 'Veri ekle ve güncelle'
        },
        {
          key: 'reports',
          label: 'Raporlarım',
          icon: TrendingUp,
          description: 'Kendi raporlarım'
        }
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="Kurumsal İletişim Müdürlüğü Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            
            {/* Navigation Menu */}
            <div className="flex space-x-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.key;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => setCurrentView(item.key as any)}
                    className={`group relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.description}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
              user.role === 'admin' 
                ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {user.role === 'admin' ? (
                <>
                  <Shield className="w-3 h-3" />
                  <span>Yönetici</span>
                </>
              ) : (
                <>
                  <Users className="w-3 h-3" />
                  <span>Personel</span>
                </>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  user.role === 'admin' 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                    : 'bg-gradient-to-br from-green-600 to-blue-600'
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-sm">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.department}</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group relative"
                title="Çıkış Yap"
              >
                <LogOut className="w-4 h-4" />
                
                {/* Logout Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Çıkış Yap
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Indicator */}
      <div className="sm:hidden px-4 pb-2">
        <div className="flex justify-center space-x-1">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentView === item.key
                  ? user.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;