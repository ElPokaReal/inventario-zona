import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Users, 
  ArrowRightLeft, 
  BarChart3, 
  LogOut, 
  Home,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Building,
  Tag,
  Wrench
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const navRef = useRef(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['administrador', 'usuario', 'técnico'] },
    { id: 'products', label: 'Inventario', icon: Package, roles: ['administrador'] },
    { id: 'categories', label: 'Categorías', icon: Tag, roles: ['administrador'] },
    { id: 'equipment', label: 'Equipos', icon: Monitor, roles: ['administrador', 'técnico'] },
    { id: 'areas', label: 'Áreas', icon: Building, roles: ['administrador', 'técnico'] },
    { id: 'movements', label: 'Movimientos', icon: ArrowRightLeft, roles: ['administrador', 'técnico'] },
    { id: 'maintenance', label: 'Mantenimiento', icon: Wrench, roles: ['administrador', 'técnico'] },
    { id: 'users', label: 'Usuarios', icon: Users, roles: ['administrador'] },
    { id: 'reports', label: 'Reportes', icon: BarChart3, roles: ['administrador', 'técnico'] }
  ];

  const visibleItems = React.useMemo(() => {
    return menuItems.filter(item => 
      item.roles.includes(user?.role)
    );
  }, [user?.role, menuItems]);

  // Actualizar posición del indicador cuando cambia la sección activa
  useEffect(() => {
    if (navRef.current) {
      const activeIndex = visibleItems.findIndex(item => item.id === activeSection);
      if (activeIndex !== -1) {
        const activeButton = navRef.current.children[activeIndex];
        if (activeButton) {
          const buttonElement = activeButton.querySelector('button');
          if (buttonElement) {
            const newTop = activeButton.offsetTop;
            const newHeight = buttonElement.offsetHeight;

            setIndicatorStyle(prevStyle => {
              if (prevStyle.top !== newTop || prevStyle.height !== newHeight) {
                return { top: newTop, height: newHeight };
              }
              return prevStyle;
            });
          }
        }
      }
    }
  }, [activeSection, visibleItems, isCollapsed]);

  const getRoleLabel = (role) => {
    const labels = {
      'administrador': 'Administrador',
      'técnico': 'Técnico',
      'usuario': 'Usuario'
    };
    return labels[role] || 'Usuario';
  };

  return (
    <>
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg h-full flex flex-col transition-all duration-300 border-r border-gray-200 relative`}>
        <div className={`p-6 border-b border-gray-200 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-800">Zona Educativa</h1>
              <p className="text-sm text-gray-600">Soporte Técnico</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 relative">
          {/* Indicador de sección activa con animación */}
          <div 
            className="absolute inset-x-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg transition-all duration-300 ease-out z-0"
            style={{
              top: `${indicatorStyle.top + 16}px`,
              height: `${indicatorStyle.height}px`,
              opacity: activeSection ? 1 : 0
            }}
          />
          
          <ul ref={navRef} className="space-y-2 relative z-10">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const isHovered = hoveredItem === item.id;
              
              return (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => onSectionChange(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-lg text-left transition-all duration-200 relative z-10 ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:shadow-sm'
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          {!isCollapsed && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-800">{user?.nombre_completo}</p>
              <p className="text-xs text-gray-600">{getRoleLabel(user?.role || '')}</p>
              <p className="text-xs text-gray-600">{user?.departamento}</p>
            </div>
          )}
          
          <div className="relative">
            <button
              onClick={logout}
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-sm`}
            >
              <LogOut size={18} className="flex-shrink-0" />
              {!isCollapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Portal para tooltips - Completamente fuera del sidebar */}
      {isCollapsed && hoveredItem && (
        <div 
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: '72px', // Más separado del sidebar (16px de ancho + 8px de margen + 48px de espacio)
            top: hoveredItem === 'logout' 
              ? `${window.innerHeight - 80}px` // Para logout
              : `${140 + (visibleItems.findIndex(item => item.id === hoveredItem) * 56)}px`, // Para items del menú
            transform: 'translateY(-50%)',
          }}
        >
          <div 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl border border-gray-700 relative animate-in slide-in-from-left-2 duration-200"
          >
            {hoveredItem === 'logout' 
              ? 'Cerrar Sesión' 
              : visibleItems.find(item => item.id === hoveredItem)?.label
            }
            {/* Flecha del tooltip */}
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2"
              style={{
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: '8px solid #111827'
              }}
            />
          </div>
        </div>
      )}


    </>
  );
};

export default Sidebar;