import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import TechnicianDashboard from './components/Dashboard/TechnicianDashboard';
import ProductList from './components/Products/ProductList';
import CategoryList from './components/Categories/CategoryList';
import EquipmentList from './components/Equipment/EquipmentList';
import AreaList from './components/Areas/AreaList';
import UserList from './components/Users/UserList';
import MovementList from './components/Movements/MovementList';
import MaintenanceHistoryList from './components/Maintenance/MaintenanceHistoryList';
import ReportList from './components/Reports/ReportList';
import SessionExpiredNotification from './components/UI/SessionExpiredNotification';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const { user, isLoading, sessionExpired, sessionMessage } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const getSectionTitle = (section) => {
    const titles = {
      dashboard: 'Dashboard',
      products: 'Inventario de Artículos',
      categories: 'Gestión de Categorías',
      equipment: 'Gestión de Equipos',
      areas: 'Gestión de Áreas',
      movements: 'Historial de Movimientos',
      maintenance: 'Historial de Mantenimiento',
      users: 'Gestión de Usuarios',
      reports: 'Reportes y Estadísticas'
    };
    return titles[section] || section;
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        if (user?.role === 'administrador') {
          return <Dashboard />;
        } else if (user?.role === 'técnico') {
          return <TechnicianDashboard />;
        } else {
          return <Dashboard />;
        }
      case 'products':
        return <ProductList />;
      case 'categories':
        return <CategoryList />;
      case 'equipment':
        return <EquipmentList />;
      case 'areas':
        return <AreaList />;
      case 'movements':
        return <MovementList />;
      case 'maintenance':
        return <MaintenanceHistoryList />;
      case 'users':
        return <UserList />;
      case 'reports':
        return <ReportList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={getSectionTitle(activeSection)} />
          
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
      
      {/* Notificación de sesión expirada */}
      <SessionExpiredNotification 
        isVisible={sessionExpired}
        message={sessionMessage}
        onClose={() => {
          // La notificación se cierra automáticamente después de 3 segundos
        }}
      />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <AppContent />
    </AuthProvider>
  );
}

export default App;