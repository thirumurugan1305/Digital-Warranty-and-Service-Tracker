import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Package,
  PlusCircle,
  Wrench,
  FileText,
  Bell,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  ExternalLink,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isMobileOpen, closeMobileSidebar, isCollapsed, toggleCollapse }) => {
  const { unreadNotificationsCount } = useProducts();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Products', path: '/products', icon: Package },
    { name: 'Add Product', path: '/products/new', icon: PlusCircle },
    { name: 'Service History', path: '/services', icon: Wrench },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotificationsCount },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200/90 z-50 transition-all duration-300 ease-in-out flex flex-col justify-between select-none ${
          isMobileOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full lg:translate-x-0 ' + (isCollapsed ? 'w-20' : 'w-64')
        }`}
      >
        <div>
          {/* Header & Logo Branding */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 transition-opacity ${
                isCollapsed ? 'justify-center w-full' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-md shadow-indigo-100 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div>
                  <span className="text-base font-bold text-slate-900 leading-none block">WarrantyTrack</span>
                  <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider block mt-0.5">
                    Asset Manager
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Toggle Button */}
            <button
              onClick={toggleCollapse}
              className={`hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ${
                isCollapsed ? 'mx-auto' : ''
              }`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={closeMobileSidebar}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.path}
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <NavLink
                    to={item.path}
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `relative flex items-center rounded-xl transition-all duration-150 ${
                        isCollapsed ? 'justify-center h-11 w-11 mx-auto' : 'px-3.5 py-2.5 justify-between'
                      } ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active Left Indicator Bar */}
                        {isActive && !isCollapsed && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full"></span>
                        )}

                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-5 h-5 flex-shrink-0 transition-colors ${
                              isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          />
                          {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                        </div>

                        {/* Badge Count */}
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ${
                              isCollapsed
                                ? 'absolute -top-1 -right-1 w-4 h-4 border-2 border-white'
                                : 'px-2 py-0.5'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>

                  {/* Collapsed Tooltip */}
                  {isCollapsed && hoveredItem === item.name && (
                    <div className="fixed left-20 ml-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg z-50 whitespace-nowrap pointer-events-none animate-in fade-in duration-150">
                      {item.name}
                      {item.badge > 0 && ` (${item.badge})`}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/70 shadow-sm">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-200 flex-shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative group flex justify-center">
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center shadow-sm transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
