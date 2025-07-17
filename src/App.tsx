import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import DataEntry from './components/DataEntry';
import Reports from './components/Reports';
import NotificationToast from './components/NotificationToast';
import { useRealTimeNotifications } from './hooks/useRealTimeNotifications';

const AppContent: React.FC = () => {
  const { user, currentView } = useApp();
  const { notifications, removeNotification } = useRealTimeNotifications();

  if (!user) {
    return <Login />;
  }

  // Role'e göre dashboard component'ini seç
  const getDashboardComponent = () => {
    if (user.role === 'admin') {
      return <AdminDashboard />;
    } else {
      return <StaffDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {currentView === 'dashboard' && getDashboardComponent()}
        {currentView === 'entry' && <DataEntry />}
        {currentView === 'reports' && <Reports />}
      </main>
      <NotificationToast 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;