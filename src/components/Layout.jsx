import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../App';
import getIcon from '../utils/iconUtils';

// Icons
const HomeIcon = getIcon('Home');
const UsersIcon = getIcon('Users');
const UserCircleIcon = getIcon('UserCircle');
const CalendarIcon = getIcon('Calendar');
const BuildingIcon = getIcon('Building');
const MenuIcon = getIcon('Menu');
const XIcon = getIcon('X');
const LogOutIcon = getIcon('LogOut');
const UserIcon = getIcon('User');

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Navigation items
  const navItems = [
    { to: '/', label: 'Dashboard', icon: HomeIcon },
    { to: '/all-employees', label: 'All Employees', icon: UsersIcon },
    { to: '/on-leave-employees', label: 'On Leave', icon: CalendarIcon },
    { to: '/new-hire-employees', label: 'New Hires', icon: UserCircleIcon },
    { to: '/departments', label: 'Departments', icon: BuildingIcon },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-surface-900 bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white dark:bg-surface-800 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:w-64 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo and close button */}
          <div className="flex items-center justify-between px-4 py-5">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-surface-800 dark:text-surface-100">StaffSync</span>
            </div>
            <button 
              className="p-1 rounded-md text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 lg:hidden"
              onClick={closeSidebar}
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'}`
                    }
                    onClick={closeSidebar}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-surface-200 dark:border-surface-700">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                {user?.firstName?.[0] || user?.emailAddress?.[0] || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-surface-800 dark:text-surface-100">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.emailAddress || 'User'}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  {user?.emailAddress || ''}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm font-medium rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-150"
            >
              <LogOutIcon className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-surface-50 dark:bg-surface-900">
        {/* Header */}
        <header className="flex items-center h-16 px-6 bg-white dark:bg-surface-800 shadow-sm">
          <button className="p-1 mr-4 text-surface-500 focus:outline-none lg:hidden" onClick={toggleSidebar}>
            <MenuIcon className="h-6 w-6" />
          </button>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default Layout;