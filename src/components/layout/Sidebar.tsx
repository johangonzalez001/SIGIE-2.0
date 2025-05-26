import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Award, 
  CalendarCheck, 
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogIn,
  School
} from 'lucide-react';
import { useAuth } from '../../modules/auth/context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-800 font-medium' 
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
    }`;

  return (
    <aside 
      className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-6`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-700" />
            <span className="font-bold text-lg text-blue-900">SIGIE</span>
          </div>
        )}
        {collapsed && (
          <GraduationCap className="w-6 h-6 text-blue-700" />
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          <NavLink to="/" className={navLinkClass} title="Panel">
            <LayoutDashboard size={20} />
            {!collapsed && <span>Panel</span>}
          </NavLink>
          
          <NavLink to="/students" className={navLinkClass} title="Estudiantes">
            <Users size={20} />
            {!collapsed && <span>Estudiantes</span>}
          </NavLink>
          
          <NavLink to="/courses" className={navLinkClass} title="Cursos">
            <School size={20} />
            {!collapsed && <span>Cursos</span>}
          </NavLink>
          
          <NavLink to="/subjects" className={navLinkClass} title="Asignaturas">
            <BookOpen size={20} />
            {!collapsed && <span>Asignaturas</span>}
          </NavLink>
          
          <NavLink to="/grades" className={navLinkClass} title="Notas">
            <Award size={20} />
            {!collapsed && <span>Notas</span>}
          </NavLink>
          
          <NavLink to="/attendance" className={navLinkClass} title="Asistencia">
            <CalendarCheck size={20} />
            {!collapsed && <span>Asistencia</span>}
          </NavLink>
          
          {user?.role === 'administrator' && (
            <>
              <NavLink to="/settings" className={navLinkClass} title="Configuración">
                <Settings size={20} />
                {!collapsed && <span>Configuración</span>}
              </NavLink>
              
              <NavLink to="/settings/login-log" className={navLinkClass} title="Registro de Accesos">
                <LogIn size={20} />
                {!collapsed && <span>Registro de Accesos</span>}
              </NavLink>
            </>
          )}
        </nav>
      </div>
      
      <div className={`p-4 border-t border-gray-200 ${collapsed ? 'text-center' : ''}`}>
        <div className={`bg-blue-50 text-blue-800 rounded-lg p-3 ${collapsed ? 'mx-auto' : ''}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
              {user?.name?.charAt(0) || ''}
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user?.name || ''}</span>
                <span className="text-xs capitalize">{user?.role || ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;