import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {currentView === 'dashboard' && <Dashboard />}
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;